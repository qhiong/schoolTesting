<template>
  <el-row>
    <el-col :span="10">
      <img src="../../assets/images/404.png" alt="" />
    </el-col>
    <el-col :span="10">
      <h2>哎呀！</h2>
      <h4>
        网站管理员说你无法进入此页面...
      </h4>
      <h5>
        请检查您输入的URL是否正确，或单击下面的按钮返回首页。
      </h5>
      <el-button type="primary" round @click="backToHome">回到家</el-button>
    </el-col>
  </el-row>
</template>

<script>
// 引入路由
import router from '@/router'

export default {
  name: '404',
  data() {
    return {}
  },
  methods: {
    // 定义返回首页方法
    backToHome() {
      router.push('/')
    }
  }
}
</script>

<style lang="less" scoped>
img {
  width: 100%;
  height: 300px;
}

.el-col {
  text-align: left;
}

.el-row {
  height: 100%;
  position: absolute;
  top: 20%;
  left: 20%;
}

h2 {
  color: #1582f0;
  font-size: 40px;
}

h4 {
  font-weight: bolder;
  font-size: 28px;
}

h5 {
  font-weight: lighter;
}
</style>
