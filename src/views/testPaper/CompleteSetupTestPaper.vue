<template>
  <div>
    <Crumbs></Crumbs>
    <el-row>
      <el-col :span='5'>
        <el-select v-model='queryObject.testPaperTypeId' filterable placeholder='请选择试卷类型'>
          <el-option
            v-for='testPaperType in testPaperTypeList'
            :key='testPaperType.testPaperTypeId'
            :label='testPaperType.testPaperTypeName'
            :value='testPaperType.testPaperTypeId'
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span='5'>
        <el-select @change='getCourseByCourseGroupId' v-model='queryObject.courseGroupId' filterable
                   placeholder='请选择课程组'>
          <el-option
            v-for='courseGroup in courseGroupList'
            :key='courseGroup.courseGroupId'
            :label='courseGroup.courseGroupName'
            :value='courseGroup.courseGroupId'
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span='5'
              :offset='1'>
        <el-select v-model='queryObject.courseId' filterable placeholder='请选择课程'>
          <el-option
            v-for='course in courseList'
            :key='course.courseId'
            :label="course.teachingPlanName+'/'+course.courseName"
            :value='course.courseId'
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span='5'>
        <el-input v-model='queryObject.testPaperName' placeholder='请输入试卷名称'></el-input>
      </el-col>
      <el-col :span='2'
      >
        <el-button @click='getSetTestPaperByConditional'
                   type='primary'
                   icon='el-icon-search' class='m0_10'>查询
        </el-button>
      </el-col>
    </el-row>
    <el-table :data='testPaperList' style='width: 100%'>
      <el-table-column type='index' label='序号' width='70'></el-table-column>
      <el-table-column prop='testPaperName' label='试卷名称'></el-table-column>
      <el-table-column prop='testPaperTypeName' label='试卷类型名称'></el-table-column>
      <el-table-column prop='testPaperTime' label='添加时间'></el-table-column>
      <el-table-column prop='courseName' label='课程名称'></el-table-column>
      <el-table-column prop='teachingPlanName' label='教学计划名称'></el-table-column>
      <el-table-column prop='majorName' label='专业名称'></el-table-column>
      <el-table-column prop='departmentName' label='学院名称'>
      </el-table-column>
      <el-table-column label='操作' width='270'>
        <template #default='scope'>
          <el-button
            icon='iconfont iconxiazai'
            type='warning'
            size='mini'
            @click='downWord(scope.row.testPaperAddress)'
          >下载试卷
          </el-button>
          <el-button
            icon='iconfont iconxiazai'
            type='danger'
            size='mini'
            @click='generateTestPaperAnswers(scope.row.testPaperId)'
          >下载答案
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// 引入面包屑导航
import Crumbs from '@/components/Crumbs'
// 引入获取已设置试卷根据登录用户api
import { apiGetSetTestPaperByConditional, apiGenerateTestPaperAnswers } from '@/request/api/testPaper'
// 引入vuex
import store from '@/store/index'
// 引入数据处理工具
import { arrayToNumeric } from '@/util/treeStructureDataConversion'
// 引入获取课程根据课程组编号
import { apiGetCourseByCourseGroupId } from '@/request/api/course'
// 引入获取课程组根据登陆者
import { apiGetCourseGroupByLoginInformationCourseGroupName } from '@/request/api/courseGroup'
// 引入获取试卷类型api
import { apiGetTestPaperTypeList } from '@/request/api/testPaperType'

export default {
  name: 'setTestPaper',
  // 注册组件
  components: {
    Crumbs
  },
  data() {
    return {
      // 试卷列表
      testPaperList: [],
      // 查询对象
      queryObject: {
        // 试卷名称
        testPaperName: '',
        // 课程编号
        courseId: '',
        // 课程组编号
        courseGroupId: '',
        // 试卷类型编号
        testPaperTypeId: ''
      },
      // 课程组列表
      courseGroupList: [],
      // 课程列表
      courseList: [],
      // 试卷类型列表
      testPaperTypeList: []
    }
  },
  methods: {
    // 获取课程根据课程组编号
    getCourseByCourseGroupId() {
      let courseGroupId = this.queryObject.courseGroupId
      // 将课程组编号处理成需要的格式
      courseGroupId = arrayToNumeric(courseGroupId)
      // 判断课程组是否为空
      if (courseGroupId === 0) {
        return
      }
      // 执行获取课程根据课程组编号
      apiGetCourseByCourseGroupId({
        courseGroupId: courseGroupId
      }).then(res => {
        // 将返回结果保存
        this.courseList = res.data
      })
    },
    // 获取课程组数组
    getCourseGroupByLoginInformationCourseGroupName() {
      // 执行查询
      apiGetCourseGroupByLoginInformationCourseGroupName({ courseGroupName: '' }).then((res) => {
        // 将数组保存 对数据进行处理
        this.courseGroupList = res.data
      })
    },
    // 获取已设置试卷根据登录者
    getSetTestPaperByConditional() {
      // 保存课程组编号
      let courseGroupId = this.queryObject.courseGroupId
      // 将课程组编号处理成需要的格式
      courseGroupId = arrayToNumeric(courseGroupId)
      let courseId = this.queryObject.courseId
      // 将课程组编号处理成需要的格式
      courseId = arrayToNumeric(courseId)
      let testPaperTypeId = this.queryObject.testPaperTypeId
      // 将课程组编号处理成需要的格式
      testPaperTypeId = arrayToNumeric(testPaperTypeId)
      // 执行查询
      apiGetSetTestPaperByConditional({
        testPaperName: this.queryObject.testPaperName,
        courseId: courseId,
        testPaperTypeId: testPaperTypeId,
        courseGroupId: courseGroupId
      }).then(res => {
        // 返回结果保存
        this.testPaperList = res.data
      })
    },
    // 获取所有试卷类型
    getTestPaperTypeList() {
      // 执行查询
      apiGetTestPaperTypeList().then(res => {
        // 数据保存
        this.testPaperTypeList = res.data
      })
    },
    // 下载文件
    downWord(path) {
      // 页面跳转
      location.href = store.state.fileDownPath + path
    },
    // 生成试卷答案
    generateTestPaperAnswers(testPaperId) {
      // 执行生成
      apiGenerateTestPaperAnswers({ testPaperId: testPaperId }).then(res => {
        // 跳转
        location.href = store.state.fileDownPath + 'word/' + res.data + '.doc'
      })
    }
  },
  created() {
    // 获取已设置试卷根据登录用户
    this.getSetTestPaperByConditional()
    // 获取试卷类型列表
    this.getTestPaperTypeList()
    // 获取课程组根据登录信息
    this.getCourseGroupByLoginInformationCourseGroupName()
  }
}
</script>

<style lang='less' scoped>
.demo-input-suffix {
  display: flex;

  p {
    width: 100px;
    margin-top: 9px;
  }

  margin: 10px 0;
}

.dis_play {
  display: flex;
  justify-content: flex-end;
}

.el-checkbox-group {
  margin-top: 11px;
}

.border {
  border: 1px solid #E2E2E2;
}

.p10 {
  padding: 10px;
}

.m10_0 {
  margin: 10px 0;
}

.m0_10 {
  margin: 0 10px;
}

.w540 {
  width: 540px;
}
</style>
