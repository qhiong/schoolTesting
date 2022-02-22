<template>
  <div>
    <Crumbs></Crumbs>
    <el-row>
      <el-col :span='9'>
        <el-select @change='getCourseByCourseGroupId' v-model='courseGroupId' filterable placeholder='请选择课程组'>
          <el-option
            v-for='courseGroup in courseGroupList'
            :key='courseGroup.courseGroupId'
            :label='courseGroup.courseGroupName'
            :value='courseGroup.courseGroupId'
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span='9'
              :offset='1'>
        <el-select v-model='courseId' filterable placeholder='请选择课程'>
          <el-option
            v-for='course in courseList'
            :key='course.courseId'
            :label="course.majorName+'/'+course.teachingPlanName+'/'+course.courseName"
            :value='course.courseId'
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span='2'
      >
        <el-button @click='getTestQuestionsIdByCourseId'
                   type='primary'
                   icon='el-icon-search' class='m0_10'>查询
        </el-button>
      </el-col>
    </el-row>
    <div class='edit_dev'>
      <el-transfer
        v-model='checkTestQuestionsIdArray'
        filterable
        filter-placeholder='请输入试题内容'
        :data='testQuestionsList'
        :props='{key: "testQuestionsId", label: "testQuestionsContent"}'
        :titles="['题库', '已选试题']"
      />
    </div>
    <el-button type='primary' @click='save' class='m10_0'>立即保存</el-button>
  </div>
</template>

<script>
// 引入面包屑
import Crumbs from '@/components/Crumbs'
// 引入获取课程组根据登陆这信息课程组名称查询api
import { apiGetCourseGroupByLoginInformationCourseGroupName } from '@/request/api/courseGroup'
// 引入获取课程根据课程组编号api
import { apiGetCourseByCourseGroupId } from '@/request/api/course'
// 引入获取试题根据课程组api
import { apiGetTestQuestionsByCourseGroupId } from '@/request/api/testQuestions'
// 引入获取试题编号根据课程编号api 引入修改课程编号根据课程编号api
import { apiGetTestQuestionsIdByCourseId, apiUpdateTestQuestionsByCourseId } from '@/request/api/courseTestQuestions'
// 级联选择器数据处理工具类
import {
  arrayToNumeric
} from '@/util/treeStructureDataConversion'

export default {
  name: 'CourseTestQuestions',
  // 注册组件
  components: { Crumbs },
  data() {
    return {
      // 课程组数组
      courseGroupList: [],
      // 课程组编号
      courseGroupId: '',
      // 课程列表
      courseList: [],
      // 课程编号
      courseId: '',
      // 试题列表
      testQuestionsList: [],
      // 选中试题编号数组
      checkTestQuestionsIdArray: []
    }
  },
  methods: {
    // 获取课程根据课程组编号
    getCourseByCourseGroupId() {
      // 保存课程组编号
      let courseGroupId = this.courseGroupId
      // 将课程组编号处理成需要的格式
      courseGroupId = arrayToNumeric(courseGroupId)
      // 判断课程组是否为空
      if (courseGroupId === 0) {
        return
      }
      // 执行获取课程根据课程组编号
      apiGetCourseByCourseGroupId({ courseGroupId: courseGroupId }).then(res => {
        // 将返回结果保存
        this.courseList = res.data
      })
    },
    // 获取课程组数组
    apiGetCourseGroupByLoginInformationCourseGroupName() {
      // 执行查询
      apiGetCourseGroupByLoginInformationCourseGroupName({ courseGroupName: '' }).then((res) => {
        // 将数组保存 对数据进行处理
        this.courseGroupList = res.data
      })
    },
    // 获取试题编号根据课程编号
    async getTestQuestionsIdByCourseId() {
      // 判断是否选择了课程
      if (this.courseId === null || this.courseId === '') {
        // 提示信息
        this.$message.error('请选择课程')
        return
      }
      // 将课程组编号保存
      let courseGroupId = JSON.stringify(this.courseGroupId)
      courseGroupId = JSON.parse(courseGroupId)
      // 课程组编号数据处理
      courseGroupId = arrayToNumeric(courseGroupId)
      // 执行获取试题根据课程组编号
      await apiGetTestQuestionsByCourseGroupId({ courseGroupId: courseGroupId }).then(res => {
        // 将返回数据保存
        const data = res.data
        // 获取数据长度
        const length = data.length
        // 遍历试题
        for (let i = 0; i < length; i++) {
          // 将试题内容中的标签删除
          data[i].testQuestionsContent = data[i].testQuestionsContent.replace(/<[^>]+>/g, '')
        }
        // 将试题数据保存
        this.testQuestionsList = data
      })
      // 执行根据课程编号获取试题编号
      await apiGetTestQuestionsIdByCourseId({ courseId: this.courseId }).then(res => {
        // 将返回数据保存
        this.checkTestQuestionsIdArray = res.data
      })
    },
    // 保存课程试题
    save() {
      // 判断是否选中课程
      if (this.courseId === null || this.courseId === 0 || this.courseId === '') {
        this.$message.error('请选择课程')
        return
      }
      // 判断是否有试题
      if (this.testQuestionsList.length === 0) {
        this.$message.error('无试题可以选择')
        return
      }
      // 执行修改
      apiUpdateTestQuestionsByCourseId({
        courseId: this.courseId,
        testQuestionsArray: this.checkTestQuestionsIdArray
      }).then(res => {
        // 提示信息
        this.$message.success(res.msg)
      })
    }
  },
  // 生命周期函数
  created() {
    // 执行课程组数据
    this.apiGetCourseGroupByLoginInformationCourseGroupName()
  }
}
</script>
<style lang='less' scoped>
.el-row {
  margin: 10px 0;
}

// css 样式穿透 /deep/ 同 <<<
.edit_dev /deep/ .el-transfer-panel {
  width: 40%;
  height: 600px;
}

.el-select {
  width: 100%;
}

.m10_0 {
  margin: 10px 0;
}

.m0_10 {
  margin: 0 10px;
}

</style>
