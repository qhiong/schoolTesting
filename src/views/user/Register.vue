<template>
  <div class="registerDiv">
    <div class="circular"></div>
    <h4>注册</h4>
    <el-form :model="registerForm" :rules="registerRules" ref="registerRuleForm" label-width="100px"
             class="demo-ruleForm">
      <el-form-item prop="userJobNumber" label-width="0">
        <el-input prefix-icon="iconfont iconyonghu" v-model="registerForm.userJobNumber"
                  placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item prop="userPassword" label-width="0">
        <el-input type="password" prefix-icon="iconfont iconmima" v-model="registerForm.userPassword"
                  placeholder="请输入密码，默认身份证后六位" show-password></el-input>
      </el-form-item>
      <el-form-item prop="userEmail" label-width="0">
        <el-input type="text" prefix-icon="iconfont iconyouxiang" v-model="registerForm.userEmail"
                  placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item prop="verificationCode" label-width="0">
        <el-input type="text" prefix-icon="iconfont iconyanzhengma" v-model="registerForm.verificationCode"
                  placeholder="请输入验证码" class="verificationCodeInput"></el-input>
        <el-button class="verificationCodeButton" @click="sendRegistrationVerificationCode"
                   v-text="captchaButton" :disabled="captchaButtonState"></el-button>
      </el-form-item>
      <el-form-item label-width="0">
        <el-button class="submit" type="success" @click="register">注册</el-button>
        <el-button @click="returnToLogin">返回登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 引入发送注册邮箱验证码api 注册api
import { apiSendRegistrationVerificationCode, apiRegister } from '@/request/api/user'
// 引入路由
import router from '@/router'

export default {
  name: 'register',
  data() {
    // 设置邮箱验证格式
    const checkEmail = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
      if (!value) {
        return callback(new Error('邮箱不能为空'))
      }
      setTimeout(() => {
        if (mailReg.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的邮箱格式'))
        }
      }, 100)
    }
    return {
      // 登录表单数据
      registerForm: {
        userJobNumber: '',
        userPassword: '',
        userEmail: '',
        verificationCode: ''
      },
      // 表单验证对象
      registerRules: {
        userJobNumber: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
        ],
        userPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 8 个字符', trigger: 'blur' }
        ],
        userEmail: [
          { validator: checkEmail, trigger: 'blur', message: '邮箱格式不正确' }
        ],
        verificationCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 6, max: 6, message: '长度在 6个字符', trigger: 'blur' }
        ]
      },
      // 发送验证码按钮文字
      captchaButton: '发送验证码',
      // 发送验证码按钮是否启用
      captchaButtonState: false
    }
  },
  methods: {
    // 注册提交方法
    register() {
      // 保存this变量
      const that = this
      // 验证表单数据
      that.$refs.registerRuleForm.validate(valid => {
        if (!valid) {
          that.$message.error('请输入正确内容')
          return
        }
        // 验证成功发送请求
        apiRegister(that.registerForm).then(res => {
          that.$message.success(res.msg)
        })
      })
    },
    // 返回登录页
    returnToLogin() {
      router.push('/')
    },
    // 发送邮件事件
    sendRegistrationVerificationCode() {
      // 判断邮箱是否为空
      if (this.registerForm.userEmail === '') {
        this.$message.error('请输入邮箱')
        return
      }
      // 保存this
      const that = this
      // 向服务器发送发送邮件请求
      apiSendRegistrationVerificationCode({ email: this.registerForm.userEmail }).then(res => {
        // 提示信息
        this.$message.success(res.msg)
        // 将发送验证码按钮变成不可单击状态
        this.captchaButtonState = true
        // 设置倒计时时间
        let second = 60
        // 定时器 每秒将发送邮件按钮文本改变
        const timer = setInterval(function () {
          that.captchaButton = '倒计时' + second + '秒'
          // 每次秒数减一
          --second
          // 判断秒数小于1 说明读秒完成
          if (second < 1) {
            // 清除定时器
            clearInterval(timer)
            // 将发送邮件按钮变成可以单机
            that.captchaButtonState = false
            // 将发送邮件按钮文本改成 发送验证码
            that.captchaButton = '发送验证码'
          }
        }, 1000)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.registerDiv {
  width: 400px;
  height: 450px;
  background-color: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  box-shadow: 20px 40px 60px #C5C7C7;
  transform: translate(-50%, -50%);
  border-radius: 10px;
  background-color: #fff;
  padding: 0 30px 30px 30px;

  .circular {
    width: 150px;
    height: 75px;
    border-radius: 150px 150px 0 0;
    box-shadow: 2px -5px 10px #F1F3F3;
    position: absolute;
    left: 50%;
    background-color: #ffffff;
    transform: translate(-50%, -100%);
  }

  .el-button {
    width: 100%;
    margin: 5px 0;
  }

  .verificationCodeInput {
    width: 70%;
  }

  .verificationCodeButton {
    width: 30%;
  }
}

h4 {
  color: #BCE7A9;
  font-size: 24px;
  margin: 30px 0;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}
</style>
