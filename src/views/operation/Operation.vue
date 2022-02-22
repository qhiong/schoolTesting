<template>
  <div>
    <Crumbs></Crumbs>
    <el-button type='primary' plain icon='el-icon-circle-plus-outline' @click='openOperationFromDialog(-1)'>添加操作
    </el-button>
    <el-table
      :data='operationList'
      row-key='operationId'
      border
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column
        prop='operationName'
        label='操作名称'
        sortable
        width='380'>
      </el-table-column>
      <el-table-column
        prop='operationAddress'
        label='操作地址'
        sortable
        width='380'>
      </el-table-column>
      <el-table-column
        label='操作'
        sortable
        width='240'>
        <template #default='scope'>
          <el-button type='primary' icon='iconfont iconxiugai' @click='openOperationFromDialog(scope.row)'>编辑</el-button>
          <el-button type='danger' icon='iconfont iconicon-shanchu' @click='deleteOperationById(scope.row.operationId)'>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-dialog
    :title='operationForm.operationFormTitle'
    v-model='operationForm.isOperationFormDialog'
    width='50%' top='25vh' @close='emptyForm'>
    <el-form :model='operationForm' :rules='operationRules' label-width='100px'
             class='demo-ruleForm'>
      <el-form-item label='父目录'>
        <el-cascader placeholder='未选择为一级操作' v-model='operationForm.pId'
                     :props='{label: "operationName", value: "operationId", checkStrictly: "true"}'
                     :options='operationList'
                     clearable filterable @change='operationCascaderChange'></el-cascader>
      </el-form-item>
      <el-form-item label='操作名称' prop='operationName'>
        <el-input v-model='operationForm.operationName'></el-input>
      </el-form-item>
      <el-form-item label='操作地址' prop='operationAddress'>
        <el-input v-model='operationForm.operationAddress'></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type='primary' @click='preservationOperation'>立即保存</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
// 引入面包屑
import Crumbs from '@/components/Crumbs'
// 引入操作 增加 删除 修改 查看api
import { apiGetOperationList, apiAddOperation, apiDeleteOperationById, apiUpdateOperationById } from '@/request/api/operation'

export default {
  name: 'Operation',
  // 注册面包屑组件
  components: { Crumbs },
  data() {
    return {
      // 操作数组
      operationList: [],
      // 操作表单对象
      operationForm: {
        // 操作编号
        operationId: -1,
        // 操作名称
        operationName: '',
        // 操作父编号
        pId: 0,
        // 操作地址
        operationAddress: '',
        // 是否显示操作表单
        isOperationFormDialog: false,
        // 操作表单标题
        operationFormTitle: ''
      },
      // 表单验证规则
      operationRules: {
        // 操作名称
        operationName: [
          {
            required: true,
            message: '请输入操作名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 45,
            message: '长度在 1 到 45 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 获取所有操作 树状结构
    getOperationList() {
      // 执行查询
      apiGetOperationList().then(res => {
        // 将查询的数据保存
        this.operationList = res.data
      })
    },
    // 清空表单
    emptyForm() {
      // 对表单内容重新赋值
      this.operationForm.operationId = -1
      this.operationForm.operationName = ''
      this.operationForm.pId = 0
      this.operationForm.operationAddress = ''
      // 将表单不显示
      this.operationForm.isOperationFormDialog = false
    },
    // 保存操作 转同步
    async preservationOperation() {
      // 保存this
      const that = this
      // 定义提交数据
      const operation = {
        // 操作名
        operationName: that.operationForm.operationName,
        // 操作父级编号
        pId: that.operationForm.pId,
        // 操作地址
        operationAddress: that.operationForm.operationAddress
      }
      // 判断是否选中自己作为父级编号
      if (operation.pId === this.operationForm.operationId) {
        // 提示错误信息
        this.$message.error('父级不能是自己')
        // 结束
        return
      }
      // 判断是新增还是修改
      if (this.operationForm.operationId === -1) {
        // 执行添加api
        await apiAddOperation(operation).then(res => {
          // 提示信息
          that.$message.success(res.msg)
        })
      } else {
        // 提交数据增加操作编号
        operation.operationId = that.operationForm.operationId
        // 执行修改
        await apiUpdateOperationById(operation).then(res => {
          // 提示信息
          that.$message.success(res.msg)
        })
      }
      // 清空表单
      that.emptyForm()
      // 重新获取操作
      that.getOperationList()
    },
    // 删除操作根据编号
    deleteOperationById(operationId) {
      // 保存this
      const that = this
      // 弹出确认对话框
      this.$confirm('此操作将永久删除该操作, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger'
      }).then(() => {
        // 执行删除api
        apiDeleteOperationById({ operationId: operationId }).then(res => {
          // 提示信息
          that.$message.success(res.msg)
          // 获取操作
          that.getOperationList()
          // 清空表单
          that.emptyForm()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 打开表单
    openOperationFromDialog(row) {
      // 保存this
      const that = this
      // 将表单显示
      this.operationForm.isOperationFormDialog = true
      // 将表单标题修改为添加
      that.operationForm.operationFormTitle = '添加'
      // 判断参数row 是否为-1 如果不是说明是修改
      if (row !== -1) {
        // 将参数保存在新增 修改保存页面
        that.operationForm.operationId = row.operationId
        that.operationForm.operationName = row.operationName
        that.operationForm.operationAddress = row.operationAddress
        that.operationForm.pId = row.pId
        // 将标题修改为修改
        that.operationForm.operationFormTitle = '修改'
      }
    },
    // 表单中父级级联组件值改变事件 是数组形式
    operationCascaderChange(node) {
      // 判断最新状态是否为null 或者长度为0
      if (node == null || node.length === 0) {
        // 将操作设为一级操作
        this.operationForm.pId = 0
        // 结束
        return
      }
      // 不是将数组中最后一位取出设置为父操作
      this.operationForm.pId = node[node.length - 1]
    }
  },
  // 生命周期函数
  created() {
    // 获取操作
    this.getOperationList()
  }
}
</script>

<style lang='less' scoped>

.el-select {
  width: 100%;
}

.el-button {
  margin-bottom: 10px;
}
</style>
