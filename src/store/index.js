import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
Vue.use(Vuex);

const reqContext = require.context('./modules', false, /\.js$/);

const modules = reqContext.keys().reduce((modules, filePath) => {
  const name = filePath.replace(/\.\/(.*)\.\w+$/, '$1');
  modules[name] = reqContext(filePath).default;
  return modules;
}, {});

const store = new Vuex.Store({
  modules,
  getters
});

export default store;
