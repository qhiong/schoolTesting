<template>
  <el-card class="box-card">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for='crumb in crumbs()' :key='crumb'>{{ crumb }}</el-breadcrumb-item>
    </el-breadcrumb>
  </el-card>
</template>

<script>
export default {
  name: 'crumbs',
  // 接受父传值
  inject: ['crumbs']
}
</script>

<style lang='less' scoped>

</style>
