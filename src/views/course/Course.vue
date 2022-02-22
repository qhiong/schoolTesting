<template>
  <div>
    <Crumbs></Crumbs>
    <el-row>
      <el-col :span='6'>
        <el-select v-model='queryObject.teachingPlanId' filterable placeholder='请选择教学计划'>
          <el-option
            v-for='item in teachingPlanList'
            :key='item.teachingPlanId'
            :label="item.majorName+'/'+item.teachingPlanName"
            :value='item.teachingPlanId'
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span='6' :offset='1'>
        <el-select v-model='queryObject.courseGroupId' filterable placeholder='请选择课程组'>
          <el-option
            v-for='item in courseGroupList'
            :key='item.courseGroupId'
            :label="item.majorName+'/'+item.courseGroupName"
            :value='item.courseGroupId'
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span='6' :offset='1'>
        <el-input
          placeholder='请输入课程名称'
          v-model='queryObject.courseName'
          clearable
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
      type='primary'
      plain
      icon='el-icon-circle-plus-outline'
      @click='openCourseFromDialog(-1)'
    >添加课程
    </el-button>
    <el-button
      type='warning'
      plain
      icon='iconfont iconshujudaoru1'
      @click='importData.isImportDialog = true'
    >导入课程
    </el-button>
    <el-table :data='courseList' style='width: 100%'>
      <el-table-column type='index' label='序号' width='70'></el-table-column>
      <el-table-column prop='courseName' label='课程名称'></el-table-column>
      <el-table-column label='开课学期'>
        <template #default='scope'>
          {{ scope.row.courseSemester == '1' ? '第一学期' : '' }}
          {{ scope.row.courseSemester == '2' ? '第二学期' : '' }}
          {{ scope.row.courseSemester == '3' ? '第三学期' : '' }}
          {{ scope.row.courseSemester == '4' ? '第四学期' : '' }}
          {{ scope.row.courseSemester == '5' ? '第五学期' : '' }}
          {{ scope.row.courseSemester == '6' ? '第六学期' : '' }}
          {{ scope.row.courseSemester == '7' ? '第七学期' : '' }}
          {{ scope.row.courseSemester == '8' ? '第八学期' : '' }}
        </template>
      </el-table-column>
      <el-table-column prop='teachingPlanName' label='教学计划名称'>
      </el-table-column>
      <el-table-column prop='courseGroupName' label='课程组名称'>
      </el-table-column>
      <el-table-column prop='majorName' label='专业名称'></el-table-column>
      <el-table-column prop='departmentName' label='学院名称'>
      </el-table-column>
      <el-table-column label='操作'>
        <template #default='scope'>
          <el-button
            icon='iconfont iconxiugai'
            type='primary'
            size='mini'
            @click='openCourseFromDialog(scope.row)'
          >编辑
          </el-button>
          <el-button
            icon='iconfont iconicon-shanchu'
            type='danger'
            size='mini'
            @click='deleteCourseById(scope.row.courseId)'
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change='handleSizeChange'
      @current-change='handleCurrentChange'
      :current-page='queryObject.currentPage'
      :page-sizes='[10, 20, 50, 100]'
      :page-size='10'
      layout='total, sizes, prev, pager, next, jumper'
      :total='total'
    >
    </el-pagination>
    <el-dialog
      :title='courseForm.courseFormTitle'
      v-model='courseForm.isCourseFormDialog'
      width='50%'
      top='25vh'
      @close='resetFormData'
    >
      <el-form
        :model='courseForm'
        :rules='courseFormRules'
        ref='courseFormRef'
        label-width='120px'
        class='demo-ruleForm'
      >
        <el-form-item label='课程名称' prop='courseName'>
          <el-input v-model='courseForm.courseName' clearable></el-input>
        </el-form-item>
        <el-form-item label='开课学期' prop='courseSemester'>
          <CourseSemesterSelect
            v-model='courseForm.courseSemester'
          ></CourseSemesterSelect>
        </el-form-item>
        <el-form-item label='教学计划' prop='teachingPlanId'>
          <el-select v-model='courseForm.teachingPlanId' filterable placeholder='请选择教学计划'>
            <el-option
              v-for='item in teachingPlanList'
              :key='item.teachingPlanId'
              :label="item.majorName+'/'+item.teachingPlanName"
              :value='item.teachingPlanId'
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='课程组' prop='teachingPlanId'>
          <el-select v-model='courseForm.courseGroupId' filterable placeholder='请选择课程组'>
            <el-option
              v-for='item in courseGroupList'
              :key='item.courseGroupId'
              :label="item.majorName+'/'+item.courseGroupName"
              :value='item.courseGroupId'
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type='primary' @click='preservationCourse'
          >立即保存
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title='数据导入'
      v-model='importData.isImportDialog'
      width='50%'
      top='25vh'
    >
      <el-form
        :model='courseForm'
        :rules='courseFormRules'
        ref='courseFormRef'
        label-width='120px'
        class='demo-ruleForm'
      >
        <el-form-item label='上传文件'>
          <el-upload
            class='upload-demo'
            drag
            :action='importData.action'
            :limit='1'
            :on-success='uploadExcelSuccess'
            ref='uploadRef'
          >
            <i class='el-icon-upload'></i>
            <div class='el-upload__text'>将文件拖到此处，或<em>点击上传</em></div>
            <template #tip>
              <div class='el-upload__tip'>只能上传 xls/xlsx 文件，且不超过 500kb
                <el-button size='mini' type='warning' @click='downImportModel'>下载模板</el-button>
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label='教学计划'>
          <el-select v-model='importData.teachingPlanId' filterable placeholder='请选择教学计划'>
            <el-option
              v-for='item in teachingPlanList'
              :key='item.teachingPlanId'
              :label="item.majorName+'/'+item.teachingPlanName"
              :value='item.teachingPlanId'
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='课程组'>
          <el-select v-model='importData.courseGroupId' filterable placeholder='请选择课程组'>
            <el-option
              v-for='item in courseGroupList'
              :key='item.courseGroupId'
              :label="item.majorName+'/'+item.courseGroupName"
              :value='item.courseGroupId'
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type='primary' @click='confirmImport'
          >立即保存
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// 引入面包屑导航
import Crumbs from '@/components/Crumbs'
// 引入课程开课学期下拉列表
import CourseSemesterSelect from '@/components/CourseSemesterSelect'
// 引入获取课程根据条件分页api 引入删除课程api 增加课程api 修改课程api 批量导入课程api
import {
  apiGetCourseListByConditionalPagination,
  apiDeleteCourseById,
  apiAddCourse,
  apiUpdateCourseById,
  apiImportCourse
} from '@/request/api/course'
// 引入根据登录用户专业获取教学计划api
import { apiGetTeachingPlanByLoginUserMajor } from '@/request/api/teachingPlan'
// 引入获取课程组根据登录用户专业api
import { apiGetCourseGroupByLoginUserMajor } from '@/request/api/courseGroup'

// 引入vuex
import store from '@/store/index'

export default {
  name: 'Course',
  // 注册组件
  components: {
    Crumbs,
    CourseSemesterSelect
  },
  data() {
    return {
      // 课程数组
      courseList: [],
      // 教学计划数组
      teachingPlanList: [],
      // 课程组数组
      courseGroupList: [],
      // 总记录数
      total: 0,
      // 查询数据对象
      queryObject: {
        // 页码
        currentPage: 1,
        // 每页显示数量
        pageSize: 10,
        // 教学计划编号
        teachingPlanId: '',
        // 查询时的课程名称
        courseName: '',
        // 查询时课程组编号
        courseGroupId: ''
      },
      // 新增 修改页面表单数据
      courseForm: {
        // 是否显示新增、修改保存页面
        isCourseFormDialog: false,
        // 课程编号
        courseId: 0,
        // 课程名称
        courseName: '',
        // 表单标题
        courseFormTitle: '',
        // 教学计划编号
        teachingPlanId: '',
        // 课程开课学期
        courseSemester: '1',
        // 课程组编号
        courseGroupId: ''
      },
      // 导入数据
      importData: {
        // 显示导入对话框
        isImportDialog: false,
        // 上传excel 地址
        excelPath: '',
        // 教学计划编号
        teachingPlanId: '',
        // 课程组编号
        courseGroupId: '',
        // 文件上传地址
        action: store.state.fileUploadPath,
        // 模板下载地址
        modelPath: store.state.fileDownPath + 'model/importCourse.xlsx'
      },
      // 表单验证规则
      courseFormRules: {
        // 课程名称验证规则
        courseName: [
          {
            required: true,
            message: '请输入课程名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 200,
            message: '长度在 1 ~ 200 个字符',
            trigger: 'blur'
          }
        ],
        // 教学计划编号验证规则
        teachingPlanId: [
          {
            required: true,
            message: '请选则教学计划',
            trigger: 'change'
          }
        ],
        // 教学计划编号验证规则
        courseGroupId: [
          {
            required: true,
            message: '请选则课程组',
            trigger: 'change'
          }
        ],
        // 开课学期验证规则
        courseSemester: [
          {
            required: true,
            message: '请选则学期',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    // 获取所有课程
    getCourseList() {
      // 定义查询对象
      const queryObject = this.queryObject
      // 执行查询
      apiGetCourseListByConditionalPagination(queryObject).then(res => {
        // 将查询结果保存
        this.courseList = res.data.courseList
        // 将返回的总数存储
        this.total = res.data.total
      })
    },
    // 每页显示数量发生变化时触发的事件
    handleSizeChange(newSize) {
      // 将最新的每页数量存储
      this.queryObject.pageSize = newSize
      // 执行获取所有课程方法
      this.getCourseList()
    },
    // 页码发生变化触发的事件
    handleCurrentChange(newPage) {
      // 将最新的页码保存下来
      this.queryObject.currentPage = newPage
      // 获取最新的课程数据
      this.getCourseList()
    },
    // 打开表单
    openCourseFromDialog(row) {
      // 保存this
      const that = this
      // 将表单显示
      this.courseForm.isCourseFormDialog = true
      // 将表单标题修改为添加
      that.courseForm.courseFormTitle = '添加'
      // 判断参数row 是否为-1 如果不是说明是修改
      if (row !== -1) {
        // 将参数保存在新增 修改保存页面
        that.courseForm.courseId = row.courseId
        that.courseForm.courseName = row.courseName
        that.courseForm.teachingPlanId = row.teachingPlanId
        that.courseForm.courseGroupId = row.courseGroupId
        that.courseForm.courseSemester = row.courseSemester
        that.courseForm.courseFormTitle = '修改'
      }
    },
    // 重置表单数据
    resetFormData() {
      // 清空表单 并移除判定错误信息
      // this.$refs.courseFormRef.resetFields()
      this.courseForm.courseId = 0
      this.courseForm.courseName = ''
      this.courseForm.teachingPlanId = ''
      this.courseForm.courseGroupId = ''
      this.courseForm.courseSemester = '1'
      this.courseForm.courseFormTitle = ''
    },
    // 保存课程表单 转同步
    async preservationCourse() {
      // 定义保存表单对象
      const formObject = this.courseForm
      // 保存this
      const that = this
      // 初始化状态值
      let valid = false
      // 表单验证
      that.$refs.courseFormRef.validate(v => {
        // 将验证结果保存
        valid = v
      })
      // 判断验证是否成功
      if (!valid) {
        this.$message.error('请输入正确内容')
        return
      }
      // 判断表单中的课程编号是否是初始化的0 0表示新增数据
      if (!this.courseForm.courseId) {
        // 执行新增课程
        await apiAddCourse(formObject).then(res => {
          // 成功提示信息
          that.$message.success(res.msg)
        })
        // 如果不等于0 表示修改数据
      } else {
        // 执行修改方法
        await apiUpdateCourseById(formObject).then(res => {
          // 提示成功信息
          that.$message.success(res.msg)
        })
      }
      // 将表单隐藏
      that.courseForm.isCourseFormDialog = false
      // 重置表单数组
      this.resetFormData()
      // 重新获取课程数据
      that.getCourseList()
    },
    // 删除课程根据编号
    deleteCourseById(courseId) {
      // 提示是否确认删除
      this.$confirm('确认删除？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(_ => {
        // 确定 执行删除
        apiDeleteCourseById({ courseId: courseId }).then(res => {
          // 提示成功信息
          this.$message.success(res.msg)
          // 重新获取课程数据
          this.getCourseList()
        })
      })
    },
    // 获取教学计划根据登录用户专业数组
    getTeachingPlanByLoginUserMajor() {
      // 执行查询
      apiGetTeachingPlanByLoginUserMajor().then(res => {
        // 将数组保存 对数据进行处理
        this.teachingPlanList = res.data
        // 判断数组是否为空
        if (res.data.length !== 0) {
          // 不为空设置数组第一位的教学计划编号到查询对象
          this.queryObject.teachingPlanId = res.data[0].teachingPlanId
          // 获取课程组
          this.getCourseGroupByLoginUserMajor()
        }
      })
    },
    // 获取课程组根据登录用户专业
    getCourseGroupByLoginUserMajor() {
      // 执行查询
      apiGetCourseGroupByLoginUserMajor().then(res => {
        // 将数组保存 对数据进行处理
        this.courseGroupList = res.data
        // 判断数组是否为空
        if (res.data.length !== 0) {
          // 将数组第一位中课程组编号设置到课程组查询对象中
          this.queryObject.courseGroupId = res.data[0].courseGroupId
          // 获取课程
          this.getCourseList()
        }
      })
    },
    // 文件上传成功回调
    uploadExcelSuccess(response) {
      // 将上传文件路径保存
      this.importData.excelPath = response.data
    },
    // 确认导入
    confirmImport() {
      // 课程组
      const courseGroupId = this.importData.courseGroupId
      // 教学计划
      const teachingPlanId = this.importData.teachingPlanId
      // 判断是否添加文件
      if (this.importData.excelPath === '') {
        this.$message.error('请上传文件')
        return
      }
      // 判断是否选中课程组和教学计划
      if (courseGroupId === 0 || teachingPlanId === 0) {
        this.$message.error('请选择内容')
        return
      }
      // 执行导入
      apiImportCourse({
        excelPath: this.importData.excelPath,
        teachingPlanId: teachingPlanId,
        courseGroupId: courseGroupId
      }).then(res => {
        // 提示信息
        this.$message.success(res.msg)
        // 数据重置
        this.importData.excelPath = ''
        this.importData.isImportDialog = false
        this.importData.teachingPlanId = ''
        this.importData.courseGroupId = ''
        this.$refs.uploadRef.clearFiles()
        // 获取课程
        this.getCourseList()
      })
    },
    // 下载导入模板
    downImportModel() {
      location.href = this.importData.modelPath
    }
  },
  // 生命周期函数
  created() {
    // 获取教学计划根据登录用户专业
    this.getTeachingPlanByLoginUserMajor()
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
</style>
