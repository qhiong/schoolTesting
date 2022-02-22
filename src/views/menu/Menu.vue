<template>
  <div>
    <Crumbs></Crumbs>
    <el-button type='primary' plain icon='el-icon-circle-plus-outline' @click='openMenuFromDialog(-1)'>添加菜单
    </el-button>
    <el-table
      :data='menuList'
      row-key='menuId'
      border
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column
        prop='menuName'
        label='菜单名称'
        sortable
        width='280'>
      </el-table-column>
      <el-table-column
        prop='menuAddress'
        label='菜单地址'
        sortable
        width='280'>
      </el-table-column>
      <el-table-column
        label='操作'
        sortable
        width='240'>
        <template #default='scope'>
          <el-button type='primary' icon='iconfont iconxiugai' @click='openMenuFromDialog(scope.row)'>编辑</el-button>
          <el-button type='danger' icon='iconfont iconicon-shanchu' @click='deleteMenuById(scope.row.menuId)'>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-dialog
    :title='menuForm.menuFormTitle'
    v-model='menuForm.isMenuFormDialog'
    width='50%' top='25vh' @close='emptyForm'>
    <el-form :model='menuForm' :rules='menuRules' label-width='100px'
             class='demo-ruleForm'>
      <el-form-item label='父目录'>
        <el-cascader placeholder='未选择为一级菜单' v-model='menuForm.pId'
                     :props='{label: "menuName", value: "menuId", checkStrictly: "true"}'
                     :options='menuList'
                     clearable filterable @change='menuCascaderChange'></el-cascader>
      </el-form-item>
      <el-form-item label='菜单名称' prop='menuName'>
        <el-input v-model='menuForm.menuName'></el-input>
      </el-form-item>
      <el-form-item label='菜单地址' prop='menuAddress'>
        <el-input v-model='menuForm.menuAddress'></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type='primary' @click='preservationMenu'>立即保存</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
// 引入面包屑
import Crumbs from '@/components/Crumbs'
// 引入菜单 增加 删除 修改 查看api
import { apiGetMenuList, apiAddMenu, apiDeleteMenuById, apiUpdateMenuById } from '@/request/api/menu'

export default {
  name: 'Menu',
  // 注册面包屑组件
  components: { Crumbs },
  data() {
    return {
      // 菜单数组
      menuList: [],
      // 菜单表单对象
      menuForm: {
        // 菜单编号
        menuId: -1,
        // 菜单名称
        menuName: '',
        // 菜单父编号
        pId: 0,
        // 菜单地址
        menuAddress: '',
        // 是否显示菜单表单
        isMenuFormDialog: false,
        // 菜单表单标题
        menuFormTitle: ''
      },
      // 表单验证规则
      menuRules: {
        // 菜单名称
        menuName: [
          {
            required: true,
            message: '请输入菜单名称',
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
    // 获取所有菜单 树状结构
    getMenuList() {
      // 执行查询
      apiGetMenuList().then(res => {
        // 将查询的数据保存
        this.menuList = res.data
      })
    },
    // 清空表单
    emptyForm() {
      // 对表单内容重新赋值
      this.menuForm.menuId = -1
      this.menuForm.menuName = ''
      this.menuForm.pId = 0
      this.menuForm.menuAddress = ''
      // 将表单不显示
      this.menuForm.isMenuFormDialog = false
    },
    // 保存菜单 转同步
    async preservationMenu() {
      // 保存this
      const that = this
      // 定义提交数据
      const menu = {
        // 菜单名
        menuName: that.menuForm.menuName,
        // 菜单父级编号
        pId: that.menuForm.pId,
        // 菜单地址
        menuAddress: that.menuForm.menuAddress
      }
      // 判断是否选中自己作为父级编号
      if (menu.pId === this.menuForm.menuId) {
        // 提示错误信息
        this.$message.error('父级不能是自己')
        // 结束
        return
      }
      // 判断是新增还是修改
      if (this.menuForm.menuId === -1) {
        // 执行添加api
        await apiAddMenu(menu).then(res => {
          // 提示信息
          that.$message.success(res.msg)
        })
      } else {
        // 提交数据增加菜单编号
        menu.menuId = that.menuForm.menuId
        // 执行修改
        await apiUpdateMenuById(menu).then(res => {
          // 提示信息
          that.$message.success(res.msg)
        })
      }
      // 清空表单
      that.emptyForm()
      // 重新获取菜单
      that.getMenuList()
    },
    // 删除菜单根据编号
    deleteMenuById(menuId) {
      // 保存this
      const that = this
      // 弹出确认对话框
      this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger'
      }).then(() => {
        // 执行删除api
        apiDeleteMenuById({ menuId: menuId }).then(res => {
          // 提示信息
          that.$message.success(res.msg)
          // 获取菜单
          that.getMenuList()
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
    openMenuFromDialog(row) {
      // 保存this
      const that = this
      // 将表单显示
      this.menuForm.isMenuFormDialog = true
      // 将表单标题修改为添加
      that.menuForm.menuFormTitle = '添加'
      // 判断参数row 是否为-1 如果不是说明是修改
      if (row !== -1) {
        // 将参数保存在新增 修改保存页面
        that.menuForm.menuId = row.menuId
        that.menuForm.menuName = row.menuName
        that.menuForm.menuAddress = row.menuAddress
        that.menuForm.pId = row.pId
        // 将标题修改为修改
        that.menuForm.menuFormTitle = '修改'
      }
    },
    // 表单中父级级联组件值改变事件 是数组形式
    menuCascaderChange(node) {
      // 判断最新状态是否为null 或者长度为0
      if (node == null || node.length === 0) {
        // 将菜单设为一级菜单
        this.menuForm.pId = 0
        // 结束
        return
      }
      // 不是将数组中最后一位取出设置为父菜单
      this.menuForm.pId = node[node.length - 1]
    }
  },
  // 生命周期函数
  created() {
    // 获取菜单
    this.getMenuList()
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
