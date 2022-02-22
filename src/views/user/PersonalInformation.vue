<template>
  <h2>账号信息</h2>
  <el-form ref='form' :model='information' label-width='80px'>
    <el-form-item label='用户名'>
      <el-input :disabled='true' v-model='information.user.userJobNumber'></el-input>
    </el-form-item>
    <el-form-item label='密码'>
      <el-input :disabled='true' v-model='information.user.userPassword'></el-input>
      <el-button type='info' plain @click='updatePasswordForm.isUpdatePasswordDialog = true'>修改密码</el-button>
    </el-form-item>
    <el-form-item label='姓名'>
      <el-input :disabled='true' v-model='information.user.userName'></el-input>
    </el-form-item>
    <el-form-item label='学院'>
      <el-input :disabled='true' v-model='information.department.departmentName'></el-input>
    </el-form-item>
    <el-form-item label='专业'>
      <el-input :disabled='true' v-model='information.major.majorName'></el-input>
    </el-form-item>
    <el-form-item label='身份证'>
      <el-input :disabled='true' v-model='information.user.userIdCard'></el-input>
    </el-form-item>
    <el-form-item label='电话'>
      <el-input :disabled='true' v-model='information.user.userPhone'></el-input>
    </el-form-item>
    <el-form-item label='邮箱'>
      <el-input :disabled='true' v-model='information.user.userEmail'></el-input>
      <el-button type='info' plain @click='updateEmailForm.isUpdateEmailDialog = true'>修改邮箱</el-button>
    </el-form-item>
  </el-form>
  <el-dialog
    title='修改密码'
    v-model='updatePasswordForm.isUpdatePasswordDialog'
    width='30%'
    @close='resetForm'>
    <el-form :model='updatePasswordForm' :rules='updatePasswordRules' ref='updatePasswordRef' label-width='100px'
             class='demo-ruleForm'>
      <el-form-item label='旧密码' prop='oldPassword'>
        <el-input type='password' v-model='updatePasswordForm.oldPassword'></el-input>
      </el-form-item>
      <el-form-item label='新密码' prop='newPassword1'>
        <el-input type='password' v-model='updatePasswordForm.newPassword1'></el-input>
      </el-form-item>
      <el-form-item label='确认密码' prop='newPassword2'>
        <el-input type='password' v-model='updatePasswordForm.newPassword2'></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
    <span class='dialog-footer'>
      <el-button @click='resetForm'>取 消</el-button>
      <el-button type='primary' @click='submitUpdatePassword'>确 定</el-button>
    </span>
    </template>
  </el-dialog>
  <el-dialog
    title='修改邮箱'
    v-model='updateEmailForm.isUpdateEmailDialog'
    width='30%'
    @close='resetForm'>
    <el-steps :active='updateEmailForm.active' finish-status='success'>
      <el-step title='步骤 1'></el-step>
      <el-step title='步骤 2'></el-step>
      <el-step title='步骤 3'></el-step>
      <el-step title='步骤 4'></el-step>
    </el-steps>
    <div v-show='updateEmailForm.active == 0'>
      <p>你正在进行敏感操作, 继续操作前请验证您的身份</p>
      <div class='demo-input-suffix'>
        密码验证：
        <el-input
          placeholder='请输入密码'
          v-model='updateEmailForm.password' type='password'>
        </el-input>
      </div>
    </div>
    <div v-show='updateEmailForm.active == 1'>
      <p>你正在进行敏感操作, 继续操作前请验证您的身份</p>
      <div class='demo-input-suffix'>
        <p>
          邮箱验证:
        </p>
        <el-row>
          <el-col :span='17'>
            <el-input
              placeholder='请输入验证码'
              v-model='updateEmailForm.verificationCode'>
            </el-input>
          </el-col>
          <el-col :span='4'>
            <el-button type='warning' plain @click='sendVerificationCode'
                       v-text='updateEmailForm.captchaButton'></el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <div v-show='updateEmailForm.active == 2'>
      <div class='demo-input-suffix'>
        新邮箱:
        <el-input
          placeholder='请输入邮箱'
          v-model='updateEmailForm.email'>
        </el-input>
      </div>
    </div>
    <div v-show='updateEmailForm.active == 3'>
      <div class='demo-input-suffix'>
        <el-input
          placeholder='请输入验证码'
          v-model='updateEmailForm.verificationCode'>
        </el-input>
      </div>
    </div>
    <template #footer>
    <span class='dialog-footer'>
      <el-button type='danger' @click='next'>下一步</el-button>
    </span>
    </template>
  </el-dialog>
</template>

<script>
// 导入获取登录者信息api 修改密码根据登录者api 发送验证码api 验证密码根据登录者api 验证邮箱验证码api 发送注册验证码api 修改邮箱根据登录信息api
import {
  apiGetLoginInformation,
  apiUpdateUserPasswordByLoginInformation,
  apiSendVerificationCode,
  apiCheckPasswordByLoginInformation,
  apiCheckVerificationCode,
  apiSendRegistrationVerificationCode,
  apiUpdateEmailByLoginInformation
} from '@/request/api/user'

export default {
  name: 'PersonalInformation',
  data() {
    return {
      // 个人信息
      information: {
        // 基本信息
        user: {},
        // 学院信息
        department: {},
        // 专业信息
        major: {}
      },
      // 修改密码表单
      updatePasswordForm: {
        // 是否显示修改密码对话框
        isUpdatePasswordDialog: false,
        // 旧密码
        oldPassword: '',
        // 新密码
        newPassword1: '',
        // 确认密码
        newPassword2: ''
      },
      // 修改邮箱表单
      updateEmailForm: {
        // 是否显示修改邮箱对话框
        isUpdateEmailDialog: false,
        // 邮箱地址
        email: '',
        // 验证码
        verificationCode: '',
        // 步骤条进度
        active: 0,
        // 验证密码
        password: '',
        // 按钮是否可用
        captchaButtonState: false,
        // 按钮文字
        captchaButton: '发送验证码'
      },
      // 表单验证对象
      updatePasswordRules: {
        // 原密码
        oldPassword: [
          {
            required: true,
            message: '请输入原密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur'
          }
        ],
        // 新密码
        newPassword1: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur'
          }
        ],
        // 确认密码
        newPassword2: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 获取当前登陆者信息
    getLoginInformation() {
      // 执行获取信息
      apiGetLoginInformation().then(res => {
        // 将返回信息中基本信息保存
        this.information.user = res.data.user
        // 判断学院是否为空
        if (!(typeof (res.data.department) === 'undefined')) {
          // 不为空将学院保存
          this.information.department = res.data.department
        }
        // 判断专业是否为空
        if (!(typeof (res.data.major) === 'undefined')) {
          // 不为空将专业保存
          this.information.major = res.data.major
        }
      })
    },
    // 重置表单数据
    resetForm() {
      this.updatePasswordForm.isUpdatePasswordDialog = false
      this.updatePasswordForm.oldPassword = ''
      this.updatePasswordForm.newPassword1 = ''
      this.updatePasswordForm.newPassword2 = ''
      this.updateEmailForm.isUpdateEmailDialog = false
      this.updateEmailForm.email = ''
      this.updateEmailForm.verificationCode = ''
      this.updateEmailForm.active = 0
      this.updateEmailForm.password = ''
      this.updateEmailForm.captchaButtonState = false
      this.updateEmailForm.captchaButton = '发送验证码'
    },
    // 提交修改密码
    submitUpdatePassword() {
      // 初始化状态值
      let valid = false
      // 表单验证
      this.$refs.updatePasswordRef.validate(v => {
        // 将验证结果保存
        valid = v
      })
      // 判断验证是否成功
      if (!valid) {
        this.$message.error('请输入正确内容')
        return
      }
      // 判断两次密码是否一致
      if (this.updatePasswordForm.newPassword1 !== this.updatePasswordForm.newPassword2) {
        this.$message.error('两次密码不一致')
        return
      }
      // 执行修改密码
      apiUpdateUserPasswordByLoginInformation({
        oldPassword: this.updatePasswordForm.oldPassword,
        newPassword: this.updatePasswordForm.newPassword1
      }).then(res => {
        // 提示信息
        this.$message.success(res.msg)
        // 跳转到登录页
        this.$router.push('/login')
      })
    },
    // 进度条下一步
    async next() {
      // 判断是第一步
      if (this.updateEmailForm.active === 0) {
        // 执行验证密码是否正确
        apiCheckPasswordByLoginInformation({ password: this.updateEmailForm.password }).then(res => {
          // 进度条加一
          this.updateEmailForm.active++
        })
        // 结束
        return
      }
      // 判断是第二步
      if (this.updateEmailForm.active === 1) {
        // 执行验证验证码
        apiCheckVerificationCode({
          userEmail: this.information.user.userEmail,
          verificationCode: this.updateEmailForm.verificationCode
        }).then(res => {
          // 进度条加一
          this.updateEmailForm.active++
          // 将表单邮箱清空
          this.updateEmailForm.email = ''
          // 将表单验证码清空
          this.updateEmailForm.verificationCode = ''
        })
        // 结束
        return
      }
      // 判断是第三步
      if (this.updateEmailForm.active === 2) {
        // 执行发送注册验证码
        await apiSendRegistrationVerificationCode({ email: this.updateEmailForm.email }).then(res => {
          // 提示信息
          this.$message.success('验证码发送成功')
        })
        // 进度条加一
        this.updateEmailForm.active++
        // 结束
        return
      }
      // 判断是第四步
      if (this.updateEmailForm.active === 3) {
        // 执行验证验证码
        await apiCheckVerificationCode({
          userEmail: this.updateEmailForm.email,
          verificationCode: this.updateEmailForm.verificationCode
        })
        // 执行修改邮箱根据登陆者
        await apiUpdateEmailByLoginInformation({ email: this.updateEmailForm.email }).then(res => {
          // 提示信息
          this.$message.success(res.msg)
          // 将用户信息中邮箱修改为新邮箱
          this.information.user.userEmail = this.updateEmailForm.email
          // 重置表单
          this.resetForm()
        })
      }
    },
    // 发送验证码
    sendVerificationCode() {
      // 执行发送验证码
      apiSendVerificationCode({ email: this.information.user.userEmail }).then(res => {
        // 提示信息
        this.$message.success(res.msg)
        // 保存this
        const that = this
        // 将发送验证码按钮变成不可单击状态
        this.updateEmailForm.captchaButtonState = true
        // 设置倒计时时间
        let second = 60
        // 定时器 每秒将发送邮件按钮文本改变
        const timer = setInterval(function() {
          that.updateEmailForm.captchaButton = '倒计时' + second + '秒'
          // 每次秒数减一
          --second
          // 判断秒数小于1 说明读秒完成
          if (second < 1) {
            // 清除定时器
            clearInterval(timer)
            // 将发送邮件按钮变成可以单机
            that.updateEmailForm.captchaButtonState = false
            // 将发送邮件按钮文本改成 发送验证码
            that.updateEmailForm.captchaButton = '发送验证码'
          }
        }, 1000)
      })
    }
  },
  // 生命周期函数
  created() {
    // 获取个人信息
    this.getLoginInformation()
  }
}
</script>

<style lang='less' scoped>
h2 {
  border-bottom: 1px solid #E5E5E5;
  padding-bottom: 3px;
}

.el-input {
  max-width: 400px;
}

.el-button {
  margin-left: 10px;
}

.el-col {
  text-align: left;
}
.el-steps{
  margin-bottom: 20px;
}
</style>
