<template>
  <div>
    <crumbs></crumbs>
    <el-row>
      <el-col :span='3'>
        <el-button type='primary' plain icon='el-icon-circle-plus-outline' @click='openRoleFromDialog(-1)'>添加角色
        </el-button>
      </el-col>
      <el-col :span='3' :offset='18'>
        <el-input
          placeholder='请输入名称'
          v-model='roleName'
          clearable @change='getRoleList' suffix-icon='el-icon-search'>
        </el-input>
      </el-col>
    </el-row>
    <el-table
      :data='roleList'
      style='width: 100%'>
      <el-table-column
        type='index'
        label='序号' width='200'>
      </el-table-column>
      <el-table-column
        prop='roleName'
        label='名称'
        width='400'>
      </el-table-column>
      <el-table-column
        label='操作'>
        <template #default='scope'>
          <el-button icon='iconfont iconxiugai' type='primary' size='mini' @click='openRoleFromDialog(scope.row)'>编辑
          </el-button>
          <el-button icon='iconfont iconshezhi' type='success' size='mini'
                     @click='openAssignmentMenuDialog((scope.row.roleId))'>分配菜单
          </el-button>
          <el-button icon='iconfont iconicon-shanchu' type='danger' size='mini'
                     @click='deleteRoleById(scope.row.roleId)'>删除
          </el-button>
          <el-button icon='iconfont iconshezhi1' type='warning' size='mini'
                     @click='openAssignmentOperationDialog((scope.row.roleId))'>分配操作
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change='handleSizeChange'
      @current-change='handleCurrentChange'
      :current-page='currentPage'
      :page-sizes='[10, 20, 50, 100]'
      :page-size='10'
      layout='total, sizes, prev, pager, next, jumper'
      :total='total'>
    </el-pagination>
  </div>
  <el-dialog
    :title='roleFormTitle'
    v-model='isRoleFormDialog'
    width='50%' top='25vh' @close='resetFormData'>
    <el-form :model='roleForm' :rules='roleFormRules' ref='roleFormRef' label-width='100px' class='demo-ruleForm'>
      <el-form-item label='角色名称' prop='roleName'>
        <el-input v-model='roleForm.roleName' clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type='primary' @click='preservationRole'>立即保存</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <el-dialog
    title='分配菜单'
    v-model='roleMenu.isAssignmentMenuDialog'
    width='50%'>
    <el-tree ref='menuTreeRef'
             :data='roleMenu.menuList'
             show-checkbox
             node-key='menuId'
             :default-checked-keys='roleMenu.checkedMenuList'
             :props="{
          children: 'children',
          label: 'menuName'
        }">
    </el-tree>
    <el-row>
      <el-col :span='4' :offset='20' class='text-align-rigth'>
        <el-button type='primary' @click='saveRoleMenu'>保存</el-button>
      </el-col>
    </el-row>
  </el-dialog>
  <el-dialog
    title='分配操作'
    v-model='roleOperation.isAssignmentOperationDialog'
    width='50%'>
    <el-tree ref='operationTreeRef'
             :data='roleOperation.operationList'
             show-checkbox
             node-key='operationId'
             :default-checked-keys='roleOperation.checkedOperationList'
             :props="{
          children: 'children',
          label: 'operationName'
        }">
    </el-tree>
    <el-row>
      <el-col :span='4' :offset='20' class='text-align-rigth'>
        <el-button type='primary' @click='saveRoleOperation'>保存</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
// 引入获取角色api 、添加角色api、删除角色api、修改角色api
import { apiGetRoleListByConditionalPagination, apiAddRole, apiDeleteRoleById, apiUpdateRoleById } from '@/request/api/role'
// 引入获取所有菜单api
import { apiGetMenuList } from '@/request/api/menu'
// 引入根据角色编号获取菜单api 更新菜单根据角色编号api
import { apiGetMenuByRoleId, apiUpdateMenuByRoleId } from '@/request/api/roleMenu'
// 引入获取所有操作api
import { apiGetOperationList } from '@/request/api/operation'
// 引入根据角色获取操作api 引入根据角色编号修改操作api
import { apiGetOperationByRoleId, apiUpdateOperationByRoleId } from '@/request/api/roleOperation'
// 引入面包屑导航
import Crumbs from '@/components/Crumbs'

export default {
  name: 'Role',
  // 注册面包屑
  components: { Crumbs },
  data() {
    return {
      // 角色数组
      roleList: [],
      // 表单标题
      roleFormTitle: '',
      // 页码
      currentPage: 1,
      // 每页显示数量
      pageSize: 10,
      // 查询时的角色名称
      roleName: '',
      // 总记录数
      total: 0,
      // 是否显示新增、修改保存页面
      isRoleFormDialog: false,
      // 新增 修改页面表单数据
      roleForm: {
        // 角色名称
        roleName: '',
        // 角色编号
        roleId: 0
      },
      // 表单验证规则
      roleFormRules: {
        // 角色名验证规则
        roleName: [
          {
            required: true,
            message: '请输入角色名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ]
      },
      // 角色菜单数据
      roleMenu: {
        // 是否显示分配菜单弹出层
        isAssignmentMenuDialog: false,
        // 存放所有菜单数组
        menuList: [],
        // 默认选中菜单数组
        checkedMenuList: [],
        // 要修改角色编号
        updateRoleId: -1
      },
      // 角色操作数据
      roleOperation: {
        // 是否显示分配操作弹出层
        isAssignmentOperationDialog: false,
        // 存放所有操作数组
        operationList: [],
        // 默认选中操作数组
        checkedOperationList: [],
        // 要修改角色编号
        updateRoleId: -1
      }
    }
  },
  methods: {
    // 获取所有角色
    getRoleList() {
      // 调用获取角色接口 根据角色名称 页码 每页显示数量
      apiGetRoleListByConditionalPagination({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        roleName: this.roleName
      }).then(res => {
        // 将返回的角色数组存储
        this.roleList = res.data.roleList
        // 将返回的总数存储
        this.total = res.data.total
      })
    },
    // 每页显示数量发生变化时触发的事件
    handleSizeChange(newSize) {
      // 将最新的每页数量存储
      this.pageSize = newSize
      // 执行获取所有角色方法
      this.getRoleList()
    },
    // 页码发生变化触发的事件
    handleCurrentChange(newPage) {
      // 将最新的页码保存下来
      this.currentPage = newPage
      // 获取最新的角色数据
      this.getRoleList()
    },
    // 保存角色表单 转同步
    async preservationRole() {
      // 保存this
      const that = this
      // 初始化状态值
      let valid = false
      // 表单验证
      that.$refs.roleFormRef.validate(v => {
        // 将验证结果保存
        valid = v
      })
      // 判断验证是否成功
      if (!valid) {
        this.$message.error('请输入正确内容')
        return
      }
      // 判断表单中的角色编号是否是初始化的0 如果是说明是新增数据
      // eslint-disable-next-line eqeqeq
      if (this.roleForm.roleId == 0) {
        // 执行新增角色
        await apiAddRole(that.roleForm).then(res => {
          // 成功提示信息
          that.$message.success(res.msg)
        })
        // 如果不等于0 表示修改数据
      } else {
        // 执行修改方法
        await apiUpdateRoleById(that.roleForm).then(res => {
          // 提示成功信息
          that.$message.success(res.msg)
        })
      }
      // 将表单隐藏
      that.isRoleFormDialog = false
      // 重新获取角色数据
      that.getRoleList()
    },
    // 重置表单数据
    resetFormData() {
      this.roleForm.roleId = 0
      this.roleForm.roleName = ''
    },
    // 打开表单
    openRoleFromDialog(row) {
      // 保存this
      const that = this
      // 将表单显示
      this.isRoleFormDialog = true
      // 将表单标题修改为添加
      that.roleFormTitle = '添加'
      // 判断参数row 是否为-1 如果不是说明是修改
      // eslint-disable-next-line eqeqeq
      if (row != -1) {
        // 将参数保存在新增 修改保存页面
        that.roleForm.roleId = row.roleId
        that.roleForm.roleName = row.roleName
        that.roleFormTitle = '修改'
      }
    },
    // 删除角色根据编号
    deleteRoleById(roleId) {
      // 提示是否确认删除
      this.$confirm('确认删除？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(_ => {
        // 确定 执行删除
        apiDeleteRoleById({ roleId: roleId }).then(res => {
          // 提示成功信息
          this.$message.success(res.msg)
          // 重新获取角色数据
          this.getRoleList()
        })
      })
    },
    // 打开分配菜单页面
    async openAssignmentMenuDialog(roleId) {
      const that = this
      // 将将要修改的角色编号保存
      this.roleMenu.updateRoleId = roleId
      // 将分配菜单页面打开
      this.roleMenu.isAssignmentMenuDialog = true
      // 判断是否第一次打开 如果是则发送请求 获取数据
      // eslint-disable-next-line eqeqeq
      if (that.roleMenu.menuList.length == 0) {
        // 发送请求获取所有菜单
        await apiGetMenuList().then(res => {
          // 将返回数据保存
          that.roleMenu.menuList = res.data
        })
      }
      // 清空树形控件默认值
      this.$refs.menuTreeRef.setCheckedKeys([])
      // 获取选中角色拥有的菜单
      await apiGetMenuByRoleId({ roleId: roleId }).then(res => {
        // 将返回数据存储在默认选中菜单中
        that.roleMenu.checkedMenuList = res.data
      })
    },
    // 保存角色菜单
    saveRoleMenu() {
      // 获取选中节点 不包括半选父节点
      const checkedKeys = this.$refs.menuTreeRef.getCheckedKeys()
      // 获取半选父节点
      const halfCheckedKeys = this.$refs.menuTreeRef.getHalfCheckedKeys()
      // 执行更新操作
      apiUpdateMenuByRoleId({
        roleId: this.roleMenu.updateRoleId,
        menuArray: [].concat(checkedKeys, halfCheckedKeys)
      }).then(res => {
        // 将页面关闭
        this.roleMenu.isAssignmentMenuDialog = false
        // 提示信息
        this.$message.success(res.msg)
      })
    },
    // 打开分配操作页面
    async openAssignmentOperationDialog(roleId) {
      const that = this
      // 将将要修改的角色编号保存
      this.roleOperation.updateRoleId = roleId
      // 将分配操作页面打开
      this.roleOperation.isAssignmentOperationDialog = true
      // 判断是否第一次打开 如果是则发送请求 获取数据
      // eslint-disable-next-line eqeqeq
      if (that.roleOperation.operationList.length == 0) {
        // 发送请求获取所有操作
        await apiGetOperationList().then(res => {
          // 将返回数据保存
          that.roleOperation.operationList = res.data
        })
      }
      // 清空树形控件默认值
      this.$refs.operationTreeRef.setCheckedKeys([])
      // 获取选中角色拥有的操作
      await apiGetOperationByRoleId({ roleId: roleId }).then(res => {
        // 将返回数据存储在默认选中菜单中
        that.roleOperation.checkedOperationList = res.data
      })
    },
    // 保存操作菜单
    saveRoleOperation() {
      // 获取选中节点 不包括半选父节点
      const checkedKeys = this.$refs.operationTreeRef.getCheckedKeys()
      // 获取半选父节点
      const halfCheckedKeys = this.$refs.operationTreeRef.getHalfCheckedKeys()
      // 执行更新操作
      apiUpdateOperationByRoleId({
        roleId: this.roleOperation.updateRoleId,
        operationArray: [].concat(checkedKeys, halfCheckedKeys)
      }).then(res => {
        // 将页面关闭
        this.roleOperation.isAssignmentOperationDialog = false
        // 提示信息
        this.$message.success(res.msg)
      })
    }
  },
  // 生命周期函数
  created() {
    // 执行获取角色数据
    this.getRoleList()
  }
}
</script>

<style lang='less' scoped>
.text-align-rigth {
  text-align: right;
}
</style>
