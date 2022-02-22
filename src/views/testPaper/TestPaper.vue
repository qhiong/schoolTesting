<template>
  <div>
    <Crumbs></Crumbs>
    <el-row>
      <el-col :span='5'>
        <el-select @change='getGrade' v-model='majorId' filterable
                   placeholder='请选择专业'>
          <el-option
            v-for='item in majorList'
            :key='item.majorId'
            :label='item.majorName'
            :value='item.majorId'
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span='4' :offset='1'>
        <el-select @change='gradeChange' v-model='grade' filterable
                   placeholder='请选择年级'>
          <el-option
            v-for='(item, index) in gradeList'
            :key='item.courseSelectionId'
            :label="item.grade+''"
            :value='index'
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span='3' :offset='1'>
        <CourseSemesterSelect v-model='courseSemester'></CourseSemesterSelect>
      </el-col>
      <el-col :span='6' :offset='1'>
        <el-input
          placeholder='请输入课程名称'
          clearable
          v-model='courseName'
        >
        </el-input>
      </el-col>
      <el-col :span='2' :offset='1'>
        <el-button @click='getCourseList' type='primary' icon='el-icon-search'
        >查询
        </el-button>
      </el-col>
    </el-row>

    <el-button
      icon='iconfont icontianjia'
      type='primary'
      size='mini'
      @click='addTestPaper'
    >添加试卷
    </el-button>
    <el-table @selection-change='toggleSelection' :data='courseList' style='width: 100%'>
      <el-table-column type='selection' width='55'></el-table-column>
      <el-table-column type='index' label='序号' width='70'></el-table-column>
      <el-table-column prop='courseName' label='课程名称'></el-table-column>
      <el-table-column label='操作'>
        <template #default='scope'>
          <el-button
            icon='iconfont iconlishijilu_o'
            type='warning'
            size='mini'
            @click='openHistoryTestPaperDialog(scope.row)'
          >历史试卷
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title='添加试卷'
      v-model='testPaperForm.isAddTestPaperDialog' @close='resetForm'>
      <el-form :model='testPaperForm' ref='testPaperFormRef' :rules='testPaperFormRules' label-width='100px'
               class='demo-ruleForm'>
        <el-form-item label='试卷名称' prop='testPaperName'>
          <el-input v-model='testPaperForm.testPaperName'></el-input>
          <el-tag type="warning">例：输入2021年 试卷名称=2021年+班级名称+课程名称+试卷类型</el-tag>
        </el-form-item>
        <el-form-item label='试卷类型' prop='testPaperTypeId'>
          <el-select v-model='testPaperForm.testPaperTypeId' placeholder='请选择试卷类型'>
            <el-option v-for='item in testPaperTypeList' :key='item.testPaperTypeId' :label='item.testPaperTypeName'
                       :value='item.testPaperTypeId'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='指定班级' prop='checkClassesIdList'>
          <el-checkbox-group v-model="testPaperForm.checkClassesIdList">
            <el-checkbox :label="item.classesId" v-for='item in classesList' :key='item.classesId'>{{ item.classesName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <el-form-item class='dis_flex'>
        <el-button type='primary' @click='preservationTestPaper'>添加</el-button>
      </el-form-item>
    </el-dialog>
    <el-dialog
      title='历史试卷'
      v-model='historyTestPaper.isHistoryTestPaperDialog' width='80%'>
      <el-table :data="historyTestPaper.testPaperList">
        <el-table-column type='index' label='序号'></el-table-column>
        <el-table-column label="日期" width="180">
          <template #default="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.testPaperTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="试卷名称" width="180" prop='testPaperName'>
        </el-table-column>
        <el-table-column label="试卷分数" width="110" prop='testPaperFraction'>
        </el-table-column>
        <el-table-column label="指定用户" width="110" prop='userName'>
        </el-table-column>
        <el-table-column label="试卷类型名称" width="110" prop='testPaperTypeName'>
        </el-table-column>
        <el-table-column label="班级名称" width="180" prop='classesName'>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button v-if='scope.row.testPaperState === 0' size="mini" @click="deleteTestPaperByTestPaperId(scope.row)"
            >撤销</el-button
            >
            <el-button v-if='scope.row.testPaperState === 1'
              size="mini"
              type="danger"
              @click="down(scope.row.testPaperAddress)"
            >下载试卷</el-button
            >
            <el-button v-if='scope.row.testPaperState === 1'
                       size="mini"
                       @click="generateTestPaperAnswers(scope.row.testPaperId)"
            >下载答案</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
// 引入面包屑导航
import Crumbs from '@/components/Crumbs'
// 引入添加试卷api 获取试卷根据课程编号api 删除试卷根据试卷编号api
import {
  apiAddTestPaper,
  apiGetTestPaperByCourseId,
  apiDeleteTestPaperByTestPaperId,
  apiGenerateTestPaperAnswers
} from '@/request/api/testPaper'
// 引入获取所有试卷类型api
import { apiGetTestPaperTypeList } from '@/request/api/testPaperType'
// 引入vuex
import store from '@/store/index'
// 引入获取操作根据用户操作地址
import { apiGetOperationByUserIdOperationAddress } from '@/request/api/operation'
// 引入开课学期选择器
import CourseSemesterSelect from '@/components/CourseSemesterSelect'
// 引入获取课程根据教学计划开课学期课程名
import { apiGetCourseByTeachingPlanIdCourseSemesterCourseName } from '@/request/api/course'
// 引入获取专业根据用户登录信息 获取专业根据登录用户学院
import { apiGetMajorByLoginUserDepartmentId, apiGetMajorByLoginUserMajorId } from '@/request/api/major'
// 获取选课的课程根据专业
import { apiGetSelectedCourseByMajorId } from '@/request/api/courseSelection'
// 获取班级根据专业年级
import { apiGetClassesByMajorIdGrade } from '@/request/api/classes'

export default {
  name: 'TestPaper',
  // 注册组件
  components: {
    Crumbs,
    CourseSemesterSelect
  },
  data() {
    return {
      // 专业数组
      majorList: [],
      // 试卷列表
      testPaperList: [],
      // 试卷类型列表
      testPaperTypeList: [],
      // 专业编号
      majorId: '',
      // 开课学期
      courseSemester: '1',
      // 课程名称
      courseName: '',
      // 年纪列表
      gradeList: [],
      // 当前选中年级数组索引
      grade: '',
      // 课程列表
      courseList: [],
      // 班级列表
      classesList: [],
      // 历史试卷
      historyTestPaper: {
        // 是否显示历史试卷页面
        isHistoryTestPaperDialog: false,
        // 试卷列表
        testPaperList: [],
        // 课程编号
        courseId: ''
      },
      // 试卷表单
      testPaperForm: {
        // 是否显示添加试卷页面
        isAddTestPaperDialog: false,
        // 选中课程编号列表
        checkCourseIdList: [],
        // 试卷名称
        testPaperName: '',
        // 试卷类型编号
        testPaperTypeId: '',
        // 选中班级编号列表
        checkClassesIdList: []
      },
      // 表单验证规则
      testPaperFormRules: {
        // 试卷名称验证规则
        testPaperName: [
          {
            required: true,
            message: '请输入试卷名称',
            trigger: 'blur'
          }
        ],
        // 试卷类型验证规则
        testPaperTypeId: [
          {
            required: true,
            message: '请选则试卷类型',
            trigger: 'change'
          }
        ],
        // 班级验证规则
        checkClassesIdList: [
          {
            type: 'array',
            required: true,
            message: '请至少选择一个班级',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    // 获取所有课程
    getCourseList() {
      // 判断专业编号 年级是否为空
      if (this.majorId === '' || this.grade === '') {
        return
      }
      // 执行获取课程根据教学计划编号课程开课学期课程名
      apiGetCourseByTeachingPlanIdCourseSemesterCourseName({
        teachingPlanId: this.gradeList[this.grade].teachingPlanId,
        courseSemester: this.courseSemester,
        courseName: this.courseName
      }).then(res => {
        // 返回数据保存
        this.courseList = res.data
      })
    },
    // 通过试卷编号删除试卷
    deleteTestPaperByTestPaperId(row) {
      // 确认删除对话框
      this.$confirm('确认撤销？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(_ => {
        // 确定 执行删除
        apiDeleteTestPaperByTestPaperId({ testPaperId: row.testPaperId }).then(res => {
          // 提示信息
          this.$message.success(res.msg)
          // 获取试卷根据课程编号
          this.getTestPaperByCourseId()
        })
      })
    },
    // 保存试卷
    preservationTestPaper() {
      // 初始化状态值
      let valid = false
      // 表单验证
      this.$refs.testPaperFormRef.validate(v => {
        // 将验证结果保存
        valid = v
      })
      // 判断验证是否成功
      if (!valid) {
        this.$message.error('请输入正确内容')
        return
      }
      // 添加试卷api
      apiAddTestPaper({
        testPaperName: this.testPaperForm.testPaperName,
        testPaperTypeId: this.testPaperForm.testPaperTypeId,
        courseIdArray: this.testPaperForm.checkCourseIdList,
        classesIdArray: this.testPaperForm.checkClassesIdList
      }).then(res => {
        // 提示信息
        this.$message.success(res.msg)
        // 关闭添加页面
        this.testPaperForm.isAddTestPaperDialog = false
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
    // 下载试卷
    down(testPaperAddress) {
      // 执行下载
      location.href = store.state.fileDownPath + testPaperAddress
    },
    // 年纪状态改变事件
    gradeChange() {
      // 判断年纪索引是否为空
      if (this.grade === '') {
        return
      }
      // 根据年级获取第一学期开课时间
      const date = new Date(this.gradeList[this.grade].grade + '-09-01')
      // 获取月
      const startMonth = date.getMonth()
      // 获取当前时间
      const d = new Date()
      // 获取当前月份
      const endMonth = d.getMonth()
      // 获取时间相差月
      const intervalMonth = (date.getFullYear() * 12 + startMonth) - (d.getFullYear() * 12 + endMonth)
      // 转成int
      const mo = parseInt((0 - intervalMonth) / 6) + 1
      // 判断是否超过第八学期
      if (mo > 8) {
        this.courseSemester = '8'
      } else {
        this.courseSemester = mo + ''
      }
    },
    // 打开添加试卷页面
    addTestPaper() {
      // 判断是否选择课程
      if (this.testPaperForm.checkCourseIdList.length === 0) {
        this.$message.error('请选择课程')
        return
      }
      // 显示添加页面
      this.testPaperForm.isAddTestPaperDialog = true
      // 将试卷名称清空
      this.testPaperForm.testPaperName = ''
      // 将试卷类型编号清空
      this.testPaperForm.testPaperTypeId = ''
      // 获取班级根据专业编号年级
      this.getClassesByMajorIdGrade()
    },
    // 课程多选按钮改变事件
    toggleSelection(rows) {
      // 将选中课程编号列表清空
      const checkCourseIdList = []
      // 遍历最新选中数组
      for (let i = 0; i < rows.length; i++) {
        // 添加到选中课程编号列表中
        checkCourseIdList.push(rows[i].courseId)
      }
      // 赋值给选中课程编号列表
      this.testPaperForm.checkCourseIdList = checkCourseIdList
    },
    // 获取专业
    getMajor() {
      // 判断是当前用户是专业管理员还是学院管理员
      apiGetOperationByUserIdOperationAddress({
        operationAddress: '/major/getMajorByLoginUserDepartmentId'
      }).then(res => {
        // 学院管理员
        if (res.data.length !== 0) {
          // 根据登录用户学院获取专业
          apiGetMajorByLoginUserDepartmentId().then(r => {
            // 将返回数据保存
            this.majorList = r.data
            // 判断专业是否为空
            if (this.majorList.length !== 0) {
              // 不为空将第一位设为选中
              this.majorId = r.data[0].majorId
            }
          })
        } else {
          apiGetMajorByLoginUserMajorId().then(res => {
            // 将返回数据保存
            this.majorList = res.data
            // 判断专业是否为空
            if (this.majorList.length !== 0) {
              // 不为空将第一位设为选中
              this.majorId = res.data[0].majorId
            }
          })
        }
      })
    },
    // 获取年级
    async getGrade() {
      // 判断专业编号是否为空
      if (this.majorId === undefined || this.majorId === '') {
        return
      }
      // 执行获取选课根据专业编号
      await apiGetSelectedCourseByMajorId({ majorId: this.majorId }).then(res => {
        // 返回数据保存
        this.gradeList = res.data
        // 判断数组是否为空
        if (res.data.length !== 0) {
          // 将当前年级索引设置为0
          this.grade = 0
          // 年级改变事件
          this.gradeChange()
        }
      })
    },
    // 获取班级根据专业年级
    getClassesByMajorIdGrade() {
      // 判断专业是否为空
      if (this.majorId === undefined || this.majorId === '') {
        return
      }
      // 执行获取班级
      apiGetClassesByMajorIdGrade({ majorId: this.majorId, classesGrade: this.gradeList[this.grade].grade }).then(res => {
        // 数据保存
        this.classesList = res.data
      })
    },
    // 重置表单
    resetForm() {
      // 将表单中试卷名称清空
      this.testPaperForm.testPaperName = ''
      // 将表单中选中班级清空
      this.testPaperForm.checkClassesIdList = []
    },
    // 获取试卷根据课程
    getTestPaperByCourseId() {
      // 执行查询
      apiGetTestPaperByCourseId({ courseId: this.historyTestPaper.courseId }).then(res => {
        // 返回数据保存
        this.historyTestPaper.testPaperList = res.data
      })
    },
    // 打开历史试卷页面
    openHistoryTestPaperDialog(row) {
      // 显示历史试卷页面
      this.historyTestPaper.isHistoryTestPaperDialog = true
      // 将课程编号保存
      this.historyTestPaper.courseId = row.courseId
      // 执行获取试卷根据课程编号
      this.getTestPaperByCourseId()
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
  // 生命周期函数
  async created() {
    // 执行获取试卷类型
    this.getTestPaperTypeList()
    // 执行获取专业
    await this.getMajor()
  }
}
</script>

<style lang='less' scoped>
.el-row {
  margin: 10px 0;
}

.el-select {
  width: 100%;
}

.dis_flex {
  display: flex;
  justify-content: flex-end;
}
</style>
