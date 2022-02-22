<template>
  <div>
    <Crumbs></Crumbs>
    <el-row>
      <el-col :span='6'>
        <el-input
          placeholder='请输入编号'
          v-model='queryObject.departmentId'
          clearable >
        </el-input>
      </el-col>
      <el-col :span='6' :offset='1'>
        <el-input
          placeholder='请输入名称'
          v-model='queryObject.departmentName'
          clearable>
        </el-input>
      </el-col>
      <el-col :span='2' :offset='1'>
        <el-button @click='getDepartmentList' type="primary" icon='el-icon-search'>查询</el-button>
      </el-col>
    </el-row>

    <el-button type='primary' plain icon='el-icon-circle-plus-outline' @click='openDepartmentFromDialog(-1)'>添加学院
    </el-button>
    <el-table
      :data='departmentList'
      style='width: 100%'>
      <el-table-column
        type='index'
        label='序号' width='200'>
      </el-table-column>
      <el-table-column
        prop='departmentId'
        label='编号'>
      </el-table-column>
      <el-table-column
        prop='departmentName'
        label='名称'>
      </el-table-column>
      <el-table-column
        label='操作'>
        <template #default='scope'>
          <el-button icon='iconfont iconxiugai' type='primary' size='mini' @click='openDepartmentFromDialog(scope.row)'>编辑
          </el-button>
          <el-button icon='iconfont iconicon-shanchu' type='danger' size='mini'
                     @click='deleteDepartmentById(scope.row.departmentId)'>删除
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
      :title='departmentFormTitle'
      v-model='departmentForm.isDepartmentFormDialog'
      width='50%' top='25vh' @close='resetFormData'>
      <el-form :model='departmentForm' :rules='departmentFormRules' ref='departmentFormRef' label-width='100px' class='demo-ruleForm'>
        <el-form-item label='学院编号' prop='departmentId'>
          <el-input v-model='departmentForm.departmentId' clearable></el-input>
        </el-form-item>
        <el-form-item label='学院名称' prop='departmentName'>
          <el-input v-model='departmentForm.departmentName' clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type='primary' @click='preservationDepartment'>立即保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// 引入面包屑
import Crumbs from '@/components/Crumbs'
// 引入获取所有学院api 添加学院api 删除学院api 修改学院api
import { apiGetDepartmentListByConditionalPagination, apiAddDepartment, apiDeleteDepartmentById, apiUpdateDepartmentById } from '@/request/api/department'

export default {
  name: 'Department',
  // 注册组件
  components: { Crumbs },
  data() {
    return {
      // 学院数组
      departmentList: [],
      // 查询条件对象
      queryObject: {
        // 页码
        currentPage: 1,
        // 每页显示数量
        pageSize: 10,
        // 查询时的学院编号
        departmentId: '',
        // 查询时的学院名称
        departmentName: ''
      },
      // 总记录数
      total: 0,
      // 学院表单标题
      departmentFormTitle: '',
      // 新增 修改页面表单数据
      departmentForm: {
        // 是否显示新增、修改保存页面
        isDepartmentFormDialog: false,
        // 旧学院编号
        oldDepartmentId: false,
        // 学院编号
        departmentId: '',
        // 学院名称
        departmentName: ''
      },
      // 表单验证规则
      departmentFormRules: {
        // 学院编号验证规则
        departmentId: [
          {
            required: true,
            message: '请输入学院编号',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 2,
            message: '长度在 1~2 个字符',
            trigger: 'blur'
          }
        ],
        // 学院名称验证规则
        departmentName: [
          {
            required: true,
            message: '请输入学院名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 50,
            message: '长度在 1 ~ 50 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 获取所有学院
    getDepartmentList() {
      // 执行查询
      apiGetDepartmentListByConditionalPagination(this.queryObject).then(res => {
        // 将查询结果保存
        this.departmentList = res.data.departmentList
        // 将返回的总数存储
        this.total = res.data.total
      })
    },
    // 每页显示数量发生变化时触发的事件
    handleSizeChange(newSize) {
      // 将最新的每页数量存储
      this.queryObject.pageSize = newSize
      // 执行获取所有学院方法
      this.getDepartmentList()
    },
    // 页码发生变化触发的事件
    handleCurrentChange(newPage) {
      // 将最新的页码保存下来
      this.queryObject.currentPage = newPage
      // 获取最新的学院数据
      this.getDepartmentList()
    },
    // 重置表单数据
    resetFormData() {
      this.departmentForm.oldDepartmentId = false
      this.departmentForm.departmentId = ''
      this.departmentForm.departmentName = ''
    },
    // 打开表单
    openDepartmentFromDialog(row) {
      // 保存this
      const that = this
      // 将表单显示
      this.departmentForm.isDepartmentFormDialog = true
      // 将表单标题修改为添加
      that.departmentFormTitle = '添加'
      // 判断参数row 是否为-1 如果不是说明是修改
      if (row !== -1) {
        // 将参数保存在新增 修改保存页面
        that.departmentForm.oldDepartmentId = row.departmentId
        that.departmentForm.departmentId = row.departmentId
        that.departmentForm.departmentName = row.departmentName
        that.departmentFormTitle = '修改'
      }
    },
    // 保存学院表单 转同步
    async preservationDepartment() {
      // 保存this
      const that = this
      // 初始化状态值
      let valid = false
      // 表单验证
      that.$refs.departmentFormRef.validate(v => {
        // 将验证结果保存
        valid = v
      })
      // 判断验证是否成功
      if (!valid) {
        this.$message.error('请输入正确内容')
        return
      }
      // 判断表单中的旧学院编号是否是初始化的false false表示新增数据
      if (!this.departmentForm.oldDepartmentId) {
        // 执行新增学院
        await apiAddDepartment(that.departmentForm).then(res => {
          // 成功提示信息
          that.$message.success(res.msg)
        })
        // 如果不等于0 表示修改数据
      } else {
        // 执行修改方法
        await apiUpdateDepartmentById(that.departmentForm).then(res => {
          // 提示成功信息
          that.$message.success(res.msg)
        })
      }
      // 将表单隐藏
      that.departmentForm.isDepartmentFormDialog = false
      // 重新获取学院数据
      that.getDepartmentList()
    },
    // 删除学院根据编号
    deleteDepartmentById(departmentId) {
      // 提示是否确认删除
      this.$confirm('确认删除？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(_ => {
        // 确定 执行删除
        apiDeleteDepartmentById({ departmentId: departmentId }).then(res => {
          // 提示成功信息
          this.$message.success(res.msg)
          // 重新获取学院数据
          this.getDepartmentList()
        })
      })
    }
  },
  // 生命周期函数
  created() {
    // 执行获取所有学院
    this.getDepartmentList()
  }
}
</script>

<style lang='less' scoped>
.el-row{
  margin: 10px 0 ;
}
</style>
