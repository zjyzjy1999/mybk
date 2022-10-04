<template>
  <div class="box">
    <div class="bj" ref="vantaRef"></div>
    <div class="container">
      <div class="welcome">
        <div class="pinkbox">
          <!-- 注册 -->
          <div class="signup nodisplay">
            <h1>Register</h1>
            <el-form class="elform" ref="rgsRef" :rules="registerRules" :model="registerForm" autocomplete="off">
              <el-form-item prop="username">
                <el-input type="text" maxlength="18" v-model="registerForm.username" clearable placeholder="Username"/>
              </el-form-item>
              <el-form-item prop="email">
                <el-input type="email" maxlength="20"   v-model="registerForm.email" clearable placeholder="Email"/>
              </el-form-item>
              <el-form-item prop="password">
                <el-input type="password" maxlength="18"   v-model="registerForm.password" show-password clearable placeholder="Password"/>
              </el-form-item>
              <el-form-item prop="password2">
                <el-input type="password" maxlength="18"   v-model="registerForm.password2" show-password clearable placeholder="Confirm Password"/>
              </el-form-item>
              <button class="button submit" @click.prevent="register">Create Account</button>
            </el-form>
          </div>

          <!-- 登录 -->
          <div class="signin">
            <h1>Sign In</h1>
            <el-form class="more-padding elform" :rules="loginRules"  ref="loginRef" :model="loginForm" autocomplete="off">
              <el-form-item prop="username">
               <el-input type="text" maxlength="18" ref="UserNameRef"   v-model="loginForm.username" clearable  placeholder="Username"/>
              </el-form-item>
              <el-form-item prop="password">
               <el-input type="password" maxlength="18" ref="PasswordRef"   v-model="loginForm.password" show-password clearable placeholder="Password"/>
              </el-form-item>
              <div class="checkbox">
<!--                <el-input type="checkbox" id="remember" /><label for="remember">Remember Me</label>-->
                <el-checkbox v-model="loginForm.rememberMe">Remember Me</el-checkbox>
              </div>
              <button class="buttom sumbit" @click.prevent="login">Login</button>
            </el-form>
          </div>
        </div>

        <div class="leftbox">
          <h2 class="title"><span>阳哥</span>博客</h2>
          <p class="desc">Belongs to Yang brother's  <span>blog</span></p>
          <img class="flower smaller" src="@/assets/login/flower.png" />
          <p class="account">Have an account?</p>
          <button class="button signinDom"  id="signin" @click="signinClick">Login</button>
        </div>

        <div class="rightbox">
          <h2 class="title"><span>阳哥</span>博客</h2>
          <p class="desc">Belongs to Yang brother's  <span>blog</span></p>
          <img class="flower" src="@/assets/login/flower2.png" />
          <p class="account">Don't have an account?</p>
          <button class="button" id="signup" @click="signupClick">Sign Up</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as THREE from 'three'
// import BIRDS from 'vanta/src/vanta.birds'
import CLOUDS from 'vanta/src/vanta.clouds'
import $ from 'jquery'
import {login,register} from '@/api/login'
import {registerRules,loginRules} from './config'
import { setAccount, getAccount } from "@/utils/auth";
export  default  {
  name:'login',
  data(){
    return{
      registerForm:{
        username:'',
        password: '',
        password2:'',
        email:''
      },
      loginForm:{
        username:'',
        password: '',
        rememberMe:false
      },
      loading: false,
      registerRules:registerRules.call(this),
      loginRules:loginRules()
    }
  },
  methods:{
    signupClick(){
      $('.pinkbox').css('transform', 'translateX(80%)');
      $('.signin').addClass('nodisplay');
      $('.signup').removeClass('nodisplay');
    },
    signinClick(){
      $('#signin').click(function() {
        $('.pinkbox').css('transform', 'translateX(0%)');
        $('.signup').addClass('nodisplay');
        $('.signin').removeClass('nodisplay');
      });
    },
    /**
     * 是否保存账户信息
     */
    saveAccount() {
      const saveInfo = {};
      const { username, rememberMe } = this.loginForm;
      // 账户信息
      saveInfo.username = username;
      // 保存密码
      if (rememberMe) {
        saveInfo.rememberMe = rememberMe;
        saveInfo.password = this.loginForm.password;
      }
      // 保存用户信息
      setAccount(saveInfo);
    },
    /**
     * 获取用户信息
     */
    getAccount() {
      const defaultInfo = getAccount();
      // 默认账号信息
      this.loginForm = {
        ...this.loginForm,
        ...defaultInfo
      };
      if (this.loginForm.username) {
        this.$refs["PasswordRef"].focus();
      } else {
        this.$refs["UserNameRef"].focus();
      }
    },
    register(){
      this.$refs.rgsRef.validate(vaild=>{
        if(!vaild) return
        if(this.loading)return
        this.loading=true
        const params={
          ...this.registerForm
        }
        register(params).then(({code})=>{
          if(code===200){
            this.$message.success('注册成功！')
            this.$refs.rgsRef.resetFields();
            this.$refs.rgsRef.clearValidate();
            $('.pinkbox').css('transform', 'translateX(0%)');
            $('.signup').addClass('nodisplay');
            $('.signin').removeClass('nodisplay');
          }
        }).finally(()=>{
          this.loading=false
        })
      })
    },
    login(){
      this.$refs.loginRef.validate(vaild=> {
        if(!vaild)return
        if(this.loading)return
        this.loading=true
        const params={
          ...this.loginForm
        }
        login(params).then(({code,data})=>{
            if(code===200){
              // 是否保存账号
              this.saveAccount();
              localStorage.setItem('userInfo',JSON.stringify(data))
              this.$message.success('登录成功！')
            }
        }).finally(()=>{
          this.loading=false
        })
      })


    }
  },
  mounted() {
    this.vantaEffect=CLOUDS({
      el:this.$refs.vantaRef,
      THREE:THREE
    })
    // 获取默认账号信息
    this.$nextTick().then(() => {
      this.getAccount();
    });
  },
  beforeDestroy() {
    if(this.vantaEffect){
      this.vantaEffect.destroy()
    }
  }
}
</script>
<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css?family=Open+Sans:300,400|Lora");
button:hover{
  cursor: pointer;
}
 .box{
   width: 100%;
   height: 100%;
   display: flex;
   .elform /deep/ {
     .el-form-item{
       margin-bottom: 40px;
     }
     .el-input{
       .el-input__clear{
         color: aliceblue;
       }
     }
     .el-input__inner {
       background: #eac7cc;
       width: 100%;
       color: #ce7d88;
       border: none;
       border-bottom: 1px solid rgba(246, 246, 246, 0.5);
       padding: 9px;
       font-weight: 100;
       &::placeholder{
         color: #f6f6f6;
         letter-spacing: 2px;
         font-size: 1.0em;
         font-weight: 100;
       }
       &:focus{
         color: #ce7d88;
         outline: none;
         border-bottom: 1.2px solid rgba(206, 125, 136, 0.7);
         font-size: 1.0em;
         transition: 0.8s all ease;
         &::placeholder{
           opacity: 0;
         }
       }
     }
   }

   label {
     font-family: "Open Sans", sans-serif;
     color: #ce7d88;
     font-size: 0.8em;
     letter-spacing: 1px;
   }

   .checkbox {
     display: inline;
     white-space: nowrap;
     position: relative;
     left: -25px;
     top: 0px;
   }

   input[type=checkbox] {
     width: 15px;
     background: #ce7d88;
   }

   .checkbox input[type=checkbox]:checked + label {
     color: #ce7d88;
     transition: 0.5s all ease;
   }
   .bj{
     width: 100%;
     height: 100%;
   }
   /* 容器的样式 */
   .container {
     width: 650px;
     height: 550px;
     position: absolute;
     left: 36%;
     top: 17%;
   }


   .welcome {
     background: #f6f6f6;
     width: 650px;
     height: 415px;
     position: absolute;
     top: 25%;
     border-radius: 5px;
     box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
   }

   .pinkbox {
     position: absolute;
     top: -10%;
     left: 5%;
     background: #eac7cc;
     width: 320px;
     height: 500px;
     border-radius: 5px;
     box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
     transition: all 0.5s ease-in-out;
     z-index: 2;
   }

   .nodisplay {
     display: none;
     transition: all 0.5s ease;
   }

   .leftbox, .rightbox {
     position: absolute;
     width: 50%;
     transition: 1s all ease;
   }

   .leftbox {
     left: -2%;
   }

   .rightbox {
     right: -2%;
   }

   /* 字体和按钮的样式 */
   h1 {
     font-family: "Open Sans", sans-serif;
     text-align: center;
     margin-top: 45px;
     text-transform: uppercase;
     color: #f6f6f6;
     font-size: 2em;
     letter-spacing: 8px;
   }

   .title {
     font-family: "Lora", serif;
     color: #8e9aaf;
     font-size: 1.8em;
     line-height: 1.1em;
     letter-spacing: 3px;
     text-align: center;
     font-weight: 300;
     margin-top: 20%;
   }

   .desc {
     margin-top: -8px;
   }

   .account {
     margin-top: 45%;
     font-size: 10px;
   }

   p {
     font-family: "Open Sans", sans-serif;
     font-size: 0.7em;
     letter-spacing: 2px;
     color: #8e9aaf;
     text-align: center;
   }

   span {
     color: #eac7cc;
   }

   .flower {
     position: absolute;
     width: 150px;
     height: 150px;
     top: 38%;
     left: 27%;
     opacity: 0.8;
   }

   .smaller {
     width: 130px;
     height: 130px;
     top: 42%;
     left: 30%;
     opacity: 0.9;
   }

   button {
     padding: 12px;
     font-family: "Open Sans", sans-serif;
     text-transform: uppercase;
     letter-spacing: 3px;
     font-size: 11px;
     border-radius: 10px;
     margin: auto;
     outline: none;
     display: block;
   }

   button:hover {
     background: #eac7cc;
     color: #f6f6f6;
     transition: background-color 1s ease-out;
   }

   .button {
     margin-top: 3%;
     background: #f6f6f6;
     color: #ce7d88;
     border: solid 1px #eac7cc;
   }

   /* 表单样式 */
   form {
     display: flex;
     align-items: center;
     flex-direction: column;
     padding-top: 7px;
   }

   .more-padding {
     padding-top: 35px;
   }

   .more-padding input {
     padding: 12px;
   }

   .more-padding .sumbit {
     margin-top: 45px;
   }

   .sumbit {
     margin-top: 25px;
     padding: 12px;
     border-color: #ce7d88;
   }

   .sumbit:hover {
     background: #cbc0d3;
     border-color: #bfb1c9;
   }

   /*input {
     background: #eac7cc;
     width: 65%;
     color: #ce7d88;
     border: none;
     border-bottom: 1px solid rgba(246, 246, 246, 0.5);
     padding: 9px;
     font-weight: 100;
   }
*/

 }

</style>