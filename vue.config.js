"use strict";
const path = require("path");

const { RetryChunkLoadPlugin } = require("webpack-retry-chunk-load-plugin");

// const defaultSettings = require("./src/settings.js");

const resolve = dir => path.join(__dirname, dir);

const name =  "Yang"; // 标题

const port = process.env.port || process.env.npm_config_port || 82; // 端口

// vue.config.js 配置说明
//官方vue.config.js 参考文档 https://cli.vuejs.org/zh/config/#css-loaderoptions
// 这里只列一部分，具体配置参考文档
module.exports = {
  // 部署生产环境和开发环境下的URL。
  // 默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上
  // 例如 https://www.ruoyi.vip/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.ruoyi.vip/admin/，则设置 baseUrl 为 /admin/。
  publicPath: process.env.NODE_ENV === "production" ? "/" : "/",
  // 在npm run build 或 yarn build 时 ，生成文件的目录名称（要和baseUrl的生产环境路径一致）（默认dist）
  outputDir: "dist",
  // 用于放置生成的静态资源 (js、css、img、fonts) 的；（项目打包之后，静态资源会放在这个文件夹下）
  assetsDir: "static",
  // 是否开启eslint保存检测，有效值：ture | false | 'error'
  lintOnSave: process.env.NODE_ENV === "development",
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  productionSourceMap: false,
  filenameHashing: false,
  // webpack-dev-server 相关配置
  devServer: {
    host: "localhost",
    port,
    open: true,
    proxy: {
      /*[process.env.VUE_APP_BASE_API]: {
        target: "http://localhost:83",
        changeOrigin: true,
        pathRewrite: {
          [`^${process.env.VUE_APP_BASE_API}`]: ""
        }
      },*/
      '/':{
        target:process.env["VUE_APP_BASE_API"],
        changeOrigin:true
      }
    },
    disableHostCheck: true
  },
  configureWebpack: {
    name,
    resolve: {
      alias: {
        "@": resolve("src"),
        "@css": resolve("src/styles"),
        "@img": resolve("src/assets/images"),
        "@font": resolve("src/assets/font"),
        "@icon": resolve("src/assets/baseIcon"),
        "@icons": resolve("src/assets/icons")
      }
    }
  },
  chainWebpack(config) {
    config.plugins.delete("preload"); // TODO: need test
    config.plugins.delete("prefetch"); // TODO: need test

    // set svg-sprite-loader
    config.module
      .rule("svg")
      .exclude.add(resolve("src/icons"))
      .end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      })
      .end();

    config.optimization.splitChunks({
      name: false,
      chunks: "initial",
      minSize: 512 * 1024,
      maxSize: 1024 * 1024,
      automaticNameDelimiter: "-",
      cacheGroups: {
        elementUI: {
          name: "chunk-elementUI", // split elementUI into a single package
          priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
          minChunks: 3,
          test: /[\\/]node_modules[\\/]element-ui(.*)/ // in order to adapt to cnpm
        },
        moment: {
          name: "chunk-moment", // split elementUI into a single package
          priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
          test: /[\\/]node_modules[\\/]moment(.*)/ // in order to adapt to cnpm
        },
        xMinder: {
          name: "chunk-xminder",
          priority: 20,
          test: /[\\/]node_modules[\\/]kityMinder(.*)/
        },
        neditor: {
          name: "chunk-neditor",
          priority: 20,
          test: /[\\/]node_modules[\\/]vue-neditor-wrap(.*)/
        },
        vendors: {
          name: "chunk-vendors",
          test: /[\\/]node_modules[\\/]/,
          priority: 15
        },
        svgIcon: {
          name: "chunk-svgIcon",
          test: resolve("src/icons"), // can customize your rules
          minChunks: 3, //  minimum common number
          priority: 10,
          reuseExistingChunk: true
        },
        commons: {
          name: "chunk-commons",
          test: resolve("src/components"), // can customize your rules
          minChunks: 3, //  minimum common number
          priority: 10,
          reuseExistingChunk: true
        },
        utils: {
          name: "chunk-utils",
          test: resolve("src/utils"), // can customize your rules
          minChunks: 3, //  minimum common number
          priority: 10,
          reuseExistingChunk: true
        }
      }
    });

    config.when(process.env.NODE_ENV !== "development", config => {
      config
        .plugin("ScriptExtHtmlWebpackPlugin")
        .after("html")
        .use("script-ext-html-webpack-plugin", [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/
          }
        ])
        .end();

      config
        .plugin("RetryChunkLoadPlugin")
        .use(RetryChunkLoadPlugin, [
          {
            maxRetries: 2,
            cacheBust: `function(){
              return Date.now();
            }`
          }
        ])
        .end();

      config.optimization.runtimeChunk("single");
    });
  }
};
