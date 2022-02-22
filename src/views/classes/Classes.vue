<template>
  <div>
    <Crumbs></Crumbs>
    <el-row>
      <el-col :span='4'>
        <el-select v-model="queryObject.majorId" filterable placeholder="请选择专业">
          <el-option
            v-for="item in majorList"
            :key="item.majorId"
            :label="item.majorName"
            :value="item.majorId"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span='6'>
        <el-input
          placeholder='请输入班级编号'
          v-model='queryObject.classesId'
          clearable>
        </el-input>
      </el-col>
      <el-col :span='6' :offset='1'>
        <el-input
          placeholder='请输入班级名称'
          v-model='queryObject.classesName'
          clearable>
        </el-input>
      </el-col>
      <el-col :span='2' :offset='1'>
        <el-button @click='getClassesList' type='primary' icon='el-icon-search'>查询</el-button>
      </el-col>
    </el-row>
    <el-button type='primary' plain icon='el-icon-circle-plus-outline' @click='openClassesFromDialog(-1)'>添加班级
    </el-button>
    <el-table
      :data='classesList'
      style='width: 100%'>
      <el-table-column
        type='index'
        label='序号' width='200'>
      </el-table-column>
      <el-table-column
        prop='classesId'
        label='班级编号'>
      </el-table-column>
      <el-table-column
        prop='classesName'
        label='班级名称'>
      </el-table-column>
      <el-table-column
        prop='classesGrade'
        label='年级'>
      </el-table-column>
      <el-table-column
        prop='classesPeopleNumber'
        label='人数'>
      </el-table-column>
      <el-table-column
        label='操作'>
        <template #default='scope'>
          <el-button icon='iconfont iconxiugai' type='primary' size='mini' @click='openClassesFromDialog(scope.row)'>编辑
          </el-button>
          <el-button icon='iconfont iconicon-shanchu' type='danger' size='mini'
                     @click='deleteClassesById(scope.row.classesId)'>删除
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
      :total='total'>
    </el-pagination>
    <el-dialog
      :title='classesForm.classesFormTitle'
      v-model='classesForm.isClassesFormDialog'
      width='50%' top='25vh' @close='resetFormData'>
      <el-form :model='classesForm' :rules='classesFormRules' ref='classesFormRef' label-width='100px'
               class='demo-ruleForm'>
        <el-form-item label='班级编号' prop='classesId'>
          <el-input v-model='classesForm.classesId' clearable></el-input>
        </el-form-item>
        <el-form-item label='班级名称' prop='classesName'>
          <el-input v-model='classesForm.classesName' clearable></el-input>
        </el-form-item>
        <el-form-item label='年级' prop='classesGrade'>
          <el-input v-model='classesForm.classesGrade' clearable></el-input>
        </el-form-item>
        <el-form-item label='人数' prop='classesPeopleNumber'>
          <el-input type='number' v-model='classesForm.classesPeopleNumber' step='1' max='200' min='1'
                    clearable></el-input>
        </el-form-item>
        <el-form-item label='专业名称' prop='majorId'>
          <el-select v-model="classesForm.majorId" filterable placeholder="请选择专业">
            <el-option
              v-for="item in majorList"
              :key="item.majorId"
              :label="item.majorName"
              :value="item.majorId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type='primary' @click='preservationClasses'>立即保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// 引入面包屑导航
import Crumbs from '@/components/Crumbs'
// 引入获取班级根据条件分页api 引入删除班级api 增加班级api 修改班级api
import {
  apiGetClassesListByConditionalPagination,
  apiDeleteClassesById,
  apiAddClasses,
  apiUpdateClassesById
} from '@/request/api/classes'
// 引入根据用户专业获取专业api
import { apiGetMajorByLoginUserMajorId } from '@/request/api/major'
// 引入处理树形结构数据工具类 级联选择器数据处理工具类
import { arrayToString } from '@/util/treeStructureDataConversion'

export default {
  name: 'Classes',
  // 注册组件
  components: {
    Crumbs
  },
  data() {
    return {
      // 学院专业树形结构数组
      majorList: [],
      // 班级数组
      classesList: [],
      // 总记录数
      total: 0,
      // 查询数据对象
      queryObject: {
        // 页码
        currentPage: 1,
        // 每页显示数量
        pageSize: 10,
        // 查询时专业编号
        majorId: '',
        // 查询时的班级名称
        classesName: '',
        // 查询时的班级编号
        classesId: ''
      },
      // 新增 修改页面表单数据
      classesForm: {
        // 是否显示新增、修改保存页面
        isClassesFormDialog: false,
        // 旧班级编号
        oldClassesId: false,
        // 班级编号
        classesId: '',
        // 班级名称
        classesName: '',
        // 专业编号
        majorId: '',
        // 表单标题
        classesFormTitle: '',
        // 班级年级
        classesGrade: '',
        // 班级人数
        classesPeopleNumber: 1
      },
      // 表单验证规则
      classesFormRules: {
        // 班级编号验证规则
        classesId: [
          {
            required: true,
            message: '请输入班级编号',
            trigger: 'blur'
          },
          {
            min: 8,
            max: 8,
            message: '长度在 8 个字符',
            trigger: 'blur'
          }
        ],
        // 班级名称验证规则
        classesName: [
          {
            required: true,
            message: '请输入班级名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 200,
            message: '长度在 1 ~ 200 个字符',
            trigger: 'blur'
          }
        ],
        // 班级年级验证规则
        classesGrade: [
          {
            required: true,
            message: '请输入年级',
            trigger: 'blur'
          },
          {
            min: 4,
            max: 4,
            message: '长度在 4 个字符',
            trigger: 'blur'
          }
        ],
        // 班级人数验证规则
        classesPeopleNumber: [
          {
            required: true,
            message: '请输入人数',
            trigger: 'blur'
          }
        ],
        // 专业编号验证规则
        majorId: [
          {
            required: true,
            message: '请选则专业',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    // 获取所有班级
    getClassesList() {
      // 执行查询
      apiGetClassesListByConditionalPagination(this.queryObject).then(res => {
        // 将查询结果保存
        this.classesList = res.data.classesList
        // 将返回的总数存储
        this.total = res.data.total
      })
    },
    // 每页显示数量发生变化时触发的事件
    handleSizeChange(newSize) {
      // 将最新的每页数量存储
      this.queryObject.pageSize = newSize
      // 执行获取所有班级方法
      this.getClassesList()
    },
    // 页码发生变化触发的事件
    handleCurrentChange(newPage) {
      // 将最新的页码保存下来
      this.queryObject.currentPage = newPage
      // 获取最新的班级数据
      this.getClassesList()
    },
    // 打开表单
    openClassesFromDialog(row) {
      // 保存this
      const that = this
      // 将表单显示
      this.classesForm.isClassesFormDialog = true
      // 将表单标题修改为添加
      that.classesForm.classesFormTitle = '添加'
      // 判断参数row 是否为-1 如果不是说明是修改
      if (row !== -1) {
        // 将参数保存在新增 修改保存页面
        that.classesForm.oldClassesId = row.classesId
        that.classesForm.classesId = row.classesId
        that.classesForm.classesName = row.classesName
        that.classesForm.classesGrade = row.classesGrade + ''
        that.classesForm.classesPeopleNumber = row.classesPeopleNumber
        that.classesForm.majorId = row.majorId
        that.classesForm.classesFormTitle = '修改'
      }
    },
    // 重置表单数据
    resetFormData() {
      this.classesForm.oldClassesId = false
      this.classesForm.classesId = ''
      this.classesForm.classesName = ''
      this.classesForm.classesGrade = ''
      this.classesForm.classesPeopleNumber = 1
      this.classesForm.majorId = ''
      this.classesForm.classesFormTitle = ''
      // 清空表单 并移除判定错误信息
      // this.$refs.classesFormRef.resetFields()
    },
    // 保存学院表单 转同步
    async preservationClasses() {
      // 保存this
      const that = this
      // 初始化状态值
      let valid = false
      // 表单验证
      that.$refs.classesFormRef.validate(v => {
        // 将验证结果保存
        valid = v
      })
      // 判断验证是否成功
      if (!valid) {
        this.$message.error('请输入正确内容')
        return
      }
      // 转换专业编号格式
      this.classesForm.majorId = arrayToString(this.classesForm.majorId)
      // 判断表单中的旧班级编号是否是初始化的false false表示新增数据
      if (!this.classesForm.oldClassesId) {
        // 执行新增班级
        await apiAddClasses(that.classesForm).then(res => {
          // 成功提示信息
          that.$message.success(res.msg)
        })
        // 如果不等于0 表示修改数据
      } else {
        // 执行修改方法
        await apiUpdateClassesById(that.classesForm).then(res => {
          // 提示成功信息
          that.$message.success(res.msg)
        })
      }
      // 将表单隐藏
      that.classesForm.isClassesFormDialog = false
      // 重置表单数组
      this.resetFormData()
      // 重新获取班级数据
      that.getClassesList()
    },
    // 删除班级根据编号
    deleteClassesById(classesId) {
      // 提示是否确认删除
      this.$confirm('确认删除？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(_ => {
        // 确定 执行删除
        apiDeleteClassesById({ classesId: classesId }).then(res => {
          // 提示成功信息
          this.$message.success(res.msg)
          // 重新获取班级数据
          this.getClassesList()
        })
      })
    },
    // 获取专业数组
    getMajorByLoginUserMajorId() {
      // 执行查询
      apiGetMajorByLoginUserMajorId().then(res => {
        // 将数组保存
        this.majorList = res.data
        // 判断数组长度是否为空
        if (res.data.length !== 0) {
          // 不为空将查询专业编号设置数组第一位的专业编号
          this.queryObject.majorId = res.data[0].majorId
          // 获取班级
          this.getClassesList()
        }
      })
    }
  },
  // 生命周期函数
  created() {
    // 获取专业数据
    this.getMajorByLoginUserMajorId()
  }
}
</script>

<style lang='less' scoped>
.el-row {
  margin: 10px 0;
}
</style>
