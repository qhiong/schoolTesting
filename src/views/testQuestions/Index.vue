<template>
  <div>
    <Crumbs></Crumbs>
    <el-row>
      <el-col :span='4' :offset='17'>
        <el-input
          placeholder='请输入课程组名称'
          v-model='queryCourseGroupName'
          clearable>
        </el-input>
      </el-col>
      <el-col :span='2' :offset='1'>
        <el-button @click='getCourseGroupByLoginInformationCourseGroupName' type='primary' icon='el-icon-search'>查询
        </el-button>
      </el-col>
    </el-row>
    <div class='dis_flex cursor_pointer'>
      <div v-for='courseGroup in courseGroupList' :key='courseGroup.courseGroupId' class='m30'
           @click='goTestQuestions(courseGroup.courseGroupId)'>
        <img :src='imgDownPath'>
        <h3>{{ courseGroup.courseGroupName }}</h3>
      </div>
    </div>
  </div>
</template>

<script>
// 引入vuex
import store from '@/store/index'
// 引入面包屑组件
import Crumbs from '@/components/Crumbs'
// 引入获取课程组根据登陆这信息课程组名称查询api
import { apiGetCourseGroupByLoginInformationCourseGroupName } from '@/request/api/courseGroup'

export default {
  name: 'Index',
  // 注册组件
  components: {
    Crumbs
  },
  data() {
    return {
      // 课程组数组
      courseGroupList: [],
      // 查询时课程组名称
      queryCourseGroupName: '',
      // 图片下载路径
      imgDownPath: store.state.fileDownPath + 'course_img.jpg'
    }
  },
  methods: {
    // 获取课程组根据课程名
    getCourseGroupByLoginInformationCourseGroupName() {
      // 执行查询
      apiGetCourseGroupByLoginInformationCourseGroupName({ courseGroupName: this.queryCourseGroupName }).then(res => {
        // 将返回结果保存
        this.courseGroupList = res.data
      })
    },
    // 跳转到试题页面
    goTestQuestions(courseGroupId) {
      // 执行跳转
      this.$router.push('/testQuestions/' + courseGroupId)
    }
  },
  created() {
    // 执行获取课程组信息
    this.getCourseGroupByLoginInformationCourseGroupName()
  }
}
</script>

<style lang='less' scoped>
.dis_flex {
  display: flex;
  flex-wrap: wrap;
}

.cursor_pointer {
  cursor: pointer;
}

h3:hover {
  color: #005C81;
}

.m30 {
  margin: 30px;
}
</style>
