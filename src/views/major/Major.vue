<template>
  <div>
    <Crumbs></Crumbs>
    <el-row>
      <el-col :span='6'>
        <el-input
          placeholder='请输入专业编号'
          v-model='queryObject.majorId'
          clearable>
        </el-input>
      </el-col>
      <el-col :span='6' :offset='1'>
        <el-input
          placeholder='请输入专业名称'
          v-model='queryObject.majorName'
          clearable>
        </el-input>
      </el-col>
      <el-col :span='2' :offset='1'>
        <el-button @click='getMajorList' type='primary' icon='el-icon-search'>查询</el-button>
      </el-col>
    </el-row>
    <el-button type='primary' plain icon='el-icon-circle-plus-outline' @click='openMajorFromDialog(-1)'>添加专业
    </el-button>
    <el-table
      :data='majorList'
      style='width: 100%'>
      <el-table-column
        type='index'
        label='序号' width='200'>
      </el-table-column>
      <el-table-column
        prop='majorId'
        label='专业编号'>
      </el-table-column>
      <el-table-column
        prop='majorName'
        label='专业名称'>
      </el-table-column>
      <el-table-column
        label='操作'>
        <template #default='scope'>
          <el-button icon='iconfont iconxiugai' type='primary' size='mini' @click='openMajorFromDialog(scope.row)'>编辑
          </el-button>
          <el-button icon='iconfont iconicon-shanchu' type='danger' size='mini'
                     @click='deleteMajorById(scope.row.majorId)'>删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title='majorForm.majorFormTitle'
      v-model='majorForm.isMajorFormDialog'
      width='50%' top='25vh' @close='resetFormData'>
      <el-form :model='majorForm' :rules='majorFormRules' ref='majorFormRef' label-width='100px' class='demo-ruleForm'>
        <el-form-item label='专业编号' prop='majorId'>
          <el-input v-model='majorForm.majorId' clearable></el-input>
        </el-form-item>
        <el-form-item label='专业名称' prop='majorName'>
          <el-input v-model='majorForm.majorName' clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type='primary' @click='preservationMajor'>立即保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// 引入面包屑导航
import Crumbs from '@/components/Crumbs'
// 引入查询专业根据条件查询分页api 增加专业api 删除专业api 修改专业api
import {
  apiAddMajor,
  apiDeleteMajorById,
  apiUpdateMajorById,
  apiGetMajorByLoginUserDepartmentId
} from '@/request/api/major'

export default {
  name: 'Major',
  // 注册组件
  components: { Crumbs },
  data() {
    return {
      // 专业数组
      majorList: [],
      oldMajorList: [],
      // 查询数据对象
      queryObject: {
        // 查询时专业编号
        majorId: '',
        // 查询时的专业名称
        majorName: ''
      },
      // 新增 修改页面表单数据
      majorForm: {
        // 是否显示新增、修改保存页面
        isMajorFormDialog: false,
        // 旧专业编号
        oldMajorId: false,
        // 专业编号
        majorId: '',
        // 专业名称
        majorName: '',
        // 表单标题
        majorFormTitle: ''
      },
      // 表单验证规则
      majorFormRules: {
        // 专业名称验证规则
        majorName: [
          {
            required: true,
            message: '请输入专业名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 100,
            message: '长度在 1 ~ 100 个字符',
            trigger: 'blur'
          }
        ],
        // 专业编号验证规则
        majorId: [
          {
            required: true,
            message: '请输入专业编号',
            trigger: 'blur'
          },
          {
            min: 4,
            max: 4,
            message: '长度在 4 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 获取所有专业
    async getMajorList() {
      // 判断原专业列表是否为空
      if (this.oldMajorList.length === 0) {
        // 执行查询
        await apiGetMajorByLoginUserDepartmentId().then(res => {
          // 将查询结果保存
          this.oldMajorList = res.data
          // 专业列表赋值
          this.majorList = res.data
        })
        return
      }
      // 判断查询专业编号专业名称是否为空
      if (this.queryObject.majorId === '' && this.queryObject.majorName === '') {
        // 将原专业数组赋值给专业数组
        this.majorList = this.oldMajorList
        return
      }
      // 将专业数组清空
      this.majorList = []
      // 遍历原专业数组
      this.oldMajorList.forEach(res => {
        // 判断是否是要查询的数据
        if (res.majorId.indexOf(this.queryObject.majorId) !== -1 && res.majorName.indexOf(this.queryObject.majorName) !== -1) {
          // 将数据添加到专业数组
          this.majorList.push(res)
        }
      })
    },
    // 打开表单
    openMajorFromDialog(row) {
      // 保存this
      const that = this
      // 将表单显示
      this.majorForm.isMajorFormDialog = true
      // 将表单标题修改为添加
      that.majorForm.majorFormTitle = '添加'
      // 判断参数row 是否为-1 如果不是说明是修改
      if (row !== -1) {
        // 将参数保存在新增 修改保存页面
        that.majorForm.oldMajorId = row.majorId
        that.majorForm.majorId = row.majorId
        that.majorForm.majorName = row.majorName
        that.majorForm.departmentId = row.department.departmentId
        that.majorForm.majorFormTitle = '修改'
      }
    },
    // 重置表单数据
    resetFormData() {
      this.majorForm = {
        // 是否显示新增、修改保存页面
        isMajorFormDialog: false,
        // 旧专业编号
        oldMajorId: false,
        // 专业编号
        majorId: '',
        // 专业名称
        majorName: '',
        // 表单标题
        majorFormTitle: ''
      }
    },
    // 保存学院表单 转同步
    async preservationMajor() {
      // 保存this
      const that = this
      // 初始化状态值
      let valid = false
      // 表单验证
      that.$refs.majorFormRef.validate(v => {
        // 将验证结果保存
        valid = v
      })
      // 判断验证是否成功
      if (!valid) {
        this.$message.error('请输入正确内容')
        return
      }
      // 判断表单中的旧专业编号是否是初始化的false false表示新增数据
      if (!this.majorForm.oldMajorId) {
        // 执行新增专业
        await apiAddMajor(that.majorForm).then(res => {
          // 成功提示信息
          that.$message.success(res.msg)
        })
        // 如果不等于0 表示修改数据
      } else {
        // 执行修改方法
        await apiUpdateMajorById(that.majorForm).then(res => {
          // 提示成功信息
          that.$message.success(res.msg)
        })
      }
      // 将表单隐藏
      that.majorForm.isMajorFormDialog = false
      // 将原专业列表清空
      this.oldMajorList = []
      // 重新获取专业数据
      await that.getMajorList()
    },
    // 删除专业根据编号
    deleteMajorById(majorId) {
      // 提示是否确认删除
      this.$confirm('确认删除？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(_ => {
        // 确定 执行删除
        apiDeleteMajorById({ majorId: majorId }).then(res => {
          // 提示成功信息
          this.$message.success(res.msg)
          // 将原专业列表清空
          this.oldMajorList = []
          // 重新获取专业数据
          this.getMajorList()
        })
      })
    }
  },
  // 生命周期函数
  created() {
    // 获取所有专业
    this.getMajorList()
  }
}
</script>

<style lang='less' scoped>
.el-row {
  margin: 10px 0;
}
</style>
