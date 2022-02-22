<template>
  <div>
    <Crumbs></Crumbs>
    <el-row>
      <el-col :span='6'>
        <el-input
          placeholder='请输入名称'
          v-model='queryObject.questionTypeName'
          clearable>
        </el-input>
      </el-col>
      <el-col :span='2' :offset='1'>
        <el-button @click='getQuestionTypeList' type='primary' icon='el-icon-search'>查询</el-button>
      </el-col>
    </el-row>

    <el-button type='primary' plain icon='el-icon-circle-plus-outline' @click='openQuestionTypeFromDialog(-1)'>添加试题类型
    </el-button>
    <el-table
      :data='questionTypeList'
      style='width: 100%'>
      <el-table-column
        type='index'
        label='序号' width='100'>
      </el-table-column>
      <el-table-column
        prop='questionTypeName'
        label='名称'>
      </el-table-column>
      <el-table-column
        prop='questionTypeSynopsis'
        label='简介'>
      </el-table-column>
      <el-table-column
        label='操作'>
        <template #default='scope'>
          <el-button icon='iconfont iconxiugai' type='primary' size='mini'
                     @click='openQuestionTypeFromDialog(scope.row)'>编辑
          </el-button>
          <el-button icon='iconfont iconicon-shanchu' type='danger' size='mini'
                     @click='deleteQuestionTypeById(scope.row.questionTypeId)'>删除
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
      :title='questionTypeForm.questionTypeFormTitle'
      v-model='questionTypeForm.isQuestionTypeFormDialog'
      width='40%' top='25vh' @close='resetFormData'>
      <el-form :model='questionTypeForm' :rules='questionTypeFormRules' ref='questionTypeFormRef' label-width='100px'
               class='demo-ruleForm'>
        <el-form-item label='名称' prop='questionTypeName'>
          <el-input v-model='questionTypeForm.questionTypeName' clearable></el-input>
        </el-form-item>
        <el-form-item label='简介' prop='questionTypeSynopsis'>
          <el-input type='textarea' v-model='questionTypeForm.questionTypeSynopsis' clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type='primary' @click='preservationQuestionType'>立即保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// 引入面包屑
import Crumbs from '@/components/Crumbs'
// 引入获取所有试题类型api 添加试题类型api 删除试题类型api 修改试题类型api
import {
  apiGetQuestionTypeByConditionalPagination,
  apiAddQuestionType,
  apiDeleteQuestionTypeById,
  apiUpdateQuestionTypeById
} from '@/request/api/questionType'

export default {
  name: 'QuestionType',
  // 注册组件
  components: { Crumbs },
  data() {
    return {
      // 试题类型数组
      questionTypeList: [],
      // 查询条件对象
      queryObject: {
        // 页码
        currentPage: 1,
        // 每页显示数量
        pageSize: 10,
        // 查询时的试题类型名称
        questionTypeName: ''
      },
      // 总记录数
      total: 0,
      // 新增 修改页面表单数据
      questionTypeForm: {
        // 试题类型表单标题
        questionTypeFormTitle: '',
        // 是否显示新增、修改保存页面
        isQuestionTypeFormDialog: false,
        // 试题类型编号
        questionTypeId: 0,
        // 试题类型名称
        questionTypeName: '',
        // 试题类型简介
        questionTypeSynopsis: ''
      },
      // 表单验证规则
      questionTypeFormRules: {
        // 试题类型名称验证规则
        questionTypeName: [
          {
            required: true,
            message: '请输入试题类型名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 200,
            message: '长度在 1~200 个字符',
            trigger: 'blur'
          }
        ],
        // 试题类型简介验证规则
        questionTypeSynopsis: [
          {
            required: true,
            message: '请输入试题类型简介',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 200,
            message: '长度在 1 ~ 200 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 获取所有试题类型
    getQuestionTypeList() {
      // 执行查询
      apiGetQuestionTypeByConditionalPagination(this.queryObject).then(res => {
        // 将查询结果保存
        this.questionTypeList = res.data.questionTypeList
        // 将返回的总数存储
        this.total = res.data.total
      })
    },
    // 每页显示数量发生变化时触发的事件
    handleSizeChange(newSize) {
      // 将最新的每页数量存储
      this.queryObject.pageSize = newSize
      // 执行获取所有试题类型方法
      this.getQuestionTypeList()
    },
    // 页码发生变化触发的事件
    handleCurrentChange(newPage) {
      // 将最新的页码保存下来
      this.queryObject.currentPage = newPage
      // 获取最新的试题类型数据
      this.getQuestionTypeList()
    },
    // 重置表单数据
    resetFormData() {
      this.questionTypeForm.questionTypeId = 0
      this.questionTypeForm.questionTypeName = ''
      this.questionTypeForm.questionTypeSynopsis = ''
    },
    // 打开表单
    openQuestionTypeFromDialog(row) {
      // 保存this
      const that = this
      // 将表单显示
      this.questionTypeForm.isQuestionTypeFormDialog = true
      // 将表单标题修改为添加
      that.questionTypeForm.questionTypeFormTitle = '添加'
      // 判断参数row 是否为-1 如果不是说明是修改
      if (row !== -1) {
        // 将参数保存在新增 修改保存页面
        that.questionTypeForm.questionTypeId = row.questionTypeId
        that.questionTypeForm.questionTypeName = row.questionTypeName
        that.questionTypeForm.questionTypeSynopsis = row.questionTypeSynopsis
        that.questionTypeFormTitle = '修改'
      }
    },
    // 保存试题类型表单 转同步
    async preservationQuestionType() {
      // 保存this
      const that = this
      // 初始化状态值
      let valid = false
      // 表单验证
      that.$refs.questionTypeFormRef.validate(v => {
        // 将验证结果保存
        valid = v
      })
      // 判断验证是否成功
      if (!valid) {
        this.$message.error('请输入正确内容')
        return
      }
      // 判断表单中的试题类型编号是否是初始化的0 0表示新增数据
      if (!this.questionTypeForm.questionTypeId) {
        // 执行新增试题类型
        await apiAddQuestionType(that.questionTypeForm).then(res => {
          // 成功提示信息
          that.$message.success(res.msg)
        })
        // 如果不等于0 表示修改数据
      } else {
        // 执行修改方法
        await apiUpdateQuestionTypeById(that.questionTypeForm).then(res => {
          // 提示成功信息
          that.$message.success(res.msg)
        })
      }
      // 将表单隐藏
      that.questionTypeForm.isQuestionTypeFormDialog = false
      // 重新获取试题类型数据
      that.getQuestionTypeList()
    },
    // 删除试题类型根据编号
    deleteQuestionTypeById(questionTypeId) {
      // 提示是否确认删除
      this.$confirm('确认删除？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(_ => {
        // 确定 执行删除
        apiDeleteQuestionTypeById({ questionTypeId: questionTypeId }).then(res => {
          // 提示成功信息
          this.$message.success(res.msg)
          // 重新获取试题类型数据
          this.getQuestionTypeList()
        })
      })
    }
  },
  // 生命周期函数
  created() {
    // 执行获取所有试题类型
    this.getQuestionTypeList()
  }
}
</script>

<style lang='less' scoped>
.el-row {
  margin: 10px 0;
}
</style>
