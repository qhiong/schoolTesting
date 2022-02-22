<template>
  <div>
    <crumbs></crumbs>
    <el-row>
      <el-col :span='3'>
        <el-button type='primary' plain icon='el-icon-circle-plus-outline' @click='openUserFromDialog(-1)'>添加用户
        </el-button>
      </el-col>
      <el-col :span='3' :offset='11'>
        <el-input
          placeholder='请输入工号'
          v-model='queryObject.userJobNumber'
          clearable>
        </el-input>
      </el-col>
      <el-col :span='3' :offset='1'>
        <el-input
          placeholder='请输入名称'
          v-model='queryObject.userName'
          clearable>
        </el-input>
      </el-col>
      <el-col :span='2' :offset='1'>
        <el-button @click='getUserList' type='primary' icon='el-icon-search'>查询</el-button>
      </el-col>
    </el-row>
    <el-table
      :data='userList'
      style='width: 100%'>
      <el-table-column
        type='index'
        label='序号' width='100'>
      </el-table-column>
      <el-table-column
        prop='userJobNumber'
        label='工号'
        width='100'>
      </el-table-column>
      <el-table-column
        prop='userName'
        label='姓名'
        width='100'>
      </el-table-column>
      <el-table-column
        prop='userIdCard'
        label='身份证'
        width='200'>
      </el-table-column>
      <el-table-column
        prop='userPhone'
        label='电话'
        width='200'>
      </el-table-column>
      <el-table-column
        prop='userEmail'
        label='邮箱'
        width='200'>
      </el-table-column>
      <el-table-column
        label='状态'
        width='80'>
        <template #default='scope'>
          <el-switch v-model='scope.row.userState' active-color='#13ce66' inactive-color='#ff4949' :active-value='0'
                     :inactive-value='1' @change='userStateChange(scope.row)'>
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label='操作' width='400'>
        <template #default='scope'>
          <el-button icon='iconfont iconxiugai' type='primary' size='mini' @click='openUserFromDialog(scope.row)'>编辑
          </el-button>
          <el-button icon='iconfont iconshezhi' type='success' size='mini'
                     @click='openAssignmentRoleDialog((scope.row.userId))'>分配角色
          </el-button>
          <el-button icon='iconfont iconicon-shanchu' type='danger' size='mini'
                     @click='deleteUserById(scope.row.userId)'>删除
          </el-button>
          <el-button icon='iconfont iconchushihua' type='warning' size='mini'
                     @click='initializationPassword(scope.row.userId)'>初始化密码
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
  </div>
  <el-dialog
    :title='formObject.userFormTitle'
    v-model='formObject.isUserFormDialog'
    width='40%' top='25vh' @close='resetFormData'>
    <el-form :model='formObject' :rules='userFormRules' ref='userFormRef' label-width='100px' class='demo-ruleForm'>
      <el-form-item label='工号' prop='userJobNumber'>
        <el-input v-model='formObject.userJobNumber'
                  :disabled='formObject.disabledField'></el-input>
      </el-form-item>
      <el-form-item label='姓名' prop='userName'>
        <el-input v-model='formObject.userName' clearable></el-input>
      </el-form-item>
      <el-form-item label='学院' prop='departmentId'>
        <DepartmentSelect :department-list='formObject.departmentList' v-model='formObject.departmentId'
                          @change='getMajorByDepartmentId' style='width: 100%;'></DepartmentSelect>
      </el-form-item>
      <el-form-item label='专业'>
        <MajorSelect multiple :major-list='formObject.majorList' style='width: 100%;' v-model='formObject.majorId'></MajorSelect>
      </el-form-item>
      <el-form-item label='身份证' prop='userIdCard'>
        <el-input v-model='formObject.userIdCard' :disabled='formObject.disabledField' clearable></el-input>
      </el-form-item>
      <el-form-item label='电话' prop='userPhone'>
        <el-input v-model='formObject.userPhone' clearable></el-input>
      </el-form-item>
      <el-form-item label='邮箱' prop='userEmail'>
        <el-input type='email' v-model='formObject.userEmail' clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type='primary' @click='preservationUser'>立即保存</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <el-dialog
    title='分配角色'
    v-model='userRole.isAssignmentRoleDialog'
    width='50%'>
    <el-tree ref='roleTreeRef'
             :data='userRole.roleList'
             show-checkbox
             node-key='roleId'
             :default-checked-keys='userRole.checkedRoleList'
             :props="{
          children: 'children',
          label: 'roleName'
        }">
    </el-tree>
    <el-row>
      <el-col :span='4' :offset='20' class='text-align-rigth'>
        <el-button type='primary' @click='saveUserMenu'>保存</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
// 引入获取用户api 、添加用户api、删除用户api、修改用户api 修改用户状态api 初始化密码api
import {
  apiGetUserListByConditionalPagination,
  apiAddUser,
  apiDeleteUserById,
  apiUpdateUserById,
  apiUpdateUserStateById,
  apiInitializationPassword
} from '@/request/api/user'
// 引入获取用户角色api 修改用户角色api
import { apiGetRoleByUserId, apiUpdateRoleByUserId } from '@/request/api/userRole'
// 引入面包屑导航
import Crumbs from '@/components/Crumbs'
// 引入学院下拉列表
import DepartmentSelect from '@/components/DepartmentSelect'
// 引入获取所有学院api
import { apiGetDepartmentList } from '@/request/api/department'
// 引入专业下拉列表
import MajorSelect from '@/components/MajorSelect'
// 引入获取专业根据学院编号api
import { apiGetMajorByDepartmentId } from '@/request/api/major'
// 引入获取所有角色api
import { apiGetRoleList } from '@/request/api/role'

export default {
  name: 'User',
  // 注册面包屑 学院下拉列表 专业下拉列表
  components: {
    Crumbs,
    DepartmentSelect,
    MajorSelect
  },
  data() {
    return {
      // 用户数组
      userList: [],
      // 查询对象
      queryObject: {
        // 查询时工号
        userJobNumber: '',
        // 页码
        currentPage: 1,
        // 每页显示数量
        pageSize: 10,
        // 查询时的用户姓名
        userName: ''
      },
      // 总记录数
      total: 0,
      // 表单提交对象
      formObject: {
        // 表单标题
        userFormTitle: '',
        // 是否显示新增、修改保存页面
        isUserFormDialog: false,
        // 用户编号
        userId: 0,
        // 用户工号
        userJobNumber: '',
        // 用户姓名
        userName: '',
        // 学院编号
        departmentId: '',
        // 专业编号
        majorId: [],
        // 身份证号
        userIdCard: '',
        // 手机号
        userPhone: '',
        // 邮箱
        userEmail: '',
        // 学院数组
        departmentList: [],
        // 专业数组
        majorList: [],
        // 修改时不可修改字段
        disabledField: false
      },
      // 表单验证规则
      userFormRules: {
        // 工号验证规则
        userJobNumber: [
          {
            required: true,
            message: '请输入工号',
            trigger: 'blur'
          },
          {
            min: 5,
            max: 10,
            message: '长度在 5 到 10 个字符',
            trigger: 'blur'
          }
        ],
        // 姓名验证
        userName: [
          {
            required: true,
            message: '请输入姓名',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 30,
            message: '长度在 2 到 30 个字符',
            trigger: 'blur'
          }
        ],
        // 学院编号验证
        departmentId: [
          {
            required: true,
            message: '请选择学院',
            trigger: 'change'
          }
        ],
        // 身份证验证
        userIdCard: [
          {
            required: true,
            message: '请输入身份证',
            trigger: 'blur'
          },
          {
            min: 18,
            max: 18,
            message: '长度在 18 到 18 个字符',
            trigger: 'blur'
          }
        ],
        // 电话号验证
        userPhone: [
          {
            required: true,
            message: '请输入电话',
            trigger: 'blur'
          },
          {
            min: 11,
            max: 11,
            message: '长度在 11 个字符',
            trigger: 'blur'
          }
        ],
        // 邮箱验证
        userEmail: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            min: 5,
            max: 30,
            message: '长度在 5 到 30 个字符',
            trigger: 'blur'
          }
        ]
      },
      // 用户角色数据
      userRole: {
        // 是否显示分配角色弹出层
        isAssignmentRoleDialog: false,
        // 存放所有角色数组
        roleList: [],
        // 默认选中角色数组
        checkedRoleList: [],
        // 要修改用户编号
        updateUserId: -1
      }
    }
  },
  methods: {
    // 获取所有用户
    getUserList() {
      // 调用获取用户接口 根据用户工号 名称 页码 每页显示数量
      apiGetUserListByConditionalPagination(this.queryObject).then(res => {
        // 将返回的用户数组存储
        this.userList = res.data.userList
        // 将返回的总数存储
        this.total = res.data.total
      })
    },
    // 每页显示数量发生变化时触发的事件
    handleSizeChange(newSize) {
      // 将最新的每页数量存储
      this.queryObject.pageSize = newSize
      // 执行获取所有用户方法
      this.getUserList()
    },
    // 页码发生变化触发的事件
    handleCurrentChange(newPage) {
      // 将最新的页码保存下来
      this.queryObject.currentPage = newPage
      // 获取最新的用户数据
      this.getUserList()
    },
    // 保存用户表单 转同步
    async preservationUser() {
      // 保存this
      const that = this
      // 初始化状态值
      let valid = false
      // 表单验证
      that.$refs.userFormRef.validate(v => {
        // 将验证结果保存
        valid = v
      })
      // 判断验证是否成功
      if (!valid) {
        this.$message.error('请输入正确内容')
        return
      }
      const formObject = JSON.parse(JSON.stringify(this.formObject))
      formObject.majorId = formObject.majorId.toString()
      // 判断表单中的用户编号是否是初始化的0 如果是说明是新增数据
      if (formObject.userId === 0) {
        // 执行新增用户
        await apiAddUser(formObject).then(res => {
          // 成功提示信息
          that.$message.success(res.msg)
        })
        // 如果不等于0 表示修改数据
      } else {
        // 执行修改方法
        await apiUpdateUserById(formObject).then(res => {
          // 提示成功信息
          that.$message.success(res.msg)
        })
      }
      // 清空表单
      this.resetFormData()
      // 重新获取用户数据
      that.getUserList()
    },
    // 重置表单数据
    resetFormData() {
      this.formObject.isUserFormDialog = false
      this.formObject.userId = 0
      this.formObject.userJobNumber = ''
      this.formObject.userName = ''
      this.formObject.departmentId = ''
      this.formObject.majorId = ''
      this.formObject.userIdCard = ''
      this.formObject.userPhone = ''
      this.formObject.userEmail = ''
    },
    // 打开表单
    async openUserFromDialog(row) {
      // 保存this
      const that = this
      // 将表单显示
      this.formObject.isUserFormDialog = true
      // 将表单标题修改为添加
      that.formObject.userFormTitle = '添加'
      // 将字段变为可修改
      this.formObject.disabledField = false
      // 判断参数row 是否为-1 如果不是说明是修改
      // eslint-disable-next-line eqeqeq
      if (row != -1) {
        // 将参数保存在新增 修改保存页面
        this.formObject.userId = row.userId
        this.formObject.userJobNumber = row.userJobNumber
        this.formObject.userName = row.userName
        this.formObject.departmentId = row.departmentId
        // 执行获取专业数组根据学院编号
        await this.getMajorByDepartmentId()
        this.formObject.majorId = row.majorId === '' ? [] : row.majorId.split(',')
        this.formObject.userIdCard = row.userIdCard
        this.formObject.userPhone = row.userPhone
        this.formObject.userEmail = row.userEmail
        this.formObject.disabledField = true
        that.formObject.userFormTitle = '修改'
      }
    },
    // 删除用户根据编号
    deleteUserById(userId) {
      // 提示是否确认删除
      this.$confirm('确认删除？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(_ => {
        // 确定 执行删除
        apiDeleteUserById({ userId: userId }).then(res => {
          // 提示成功信息
          this.$message.success(res.msg)
          // 重新获取用户数据
          this.getUserList()
        })
      })
    },
    // 打开分配角色页面
    async openAssignmentRoleDialog(userId) {
      // 保存this
      const that = this
      // 将将要修改的用户编号保存
      this.userRole.updateUserId = userId
      // 将分配角色页面打开
      this.userRole.isAssignmentRoleDialog = true
      // 判断是否第一次打开 如果是则发送请求 获取数据
      if (that.userRole.roleList.length === 0) {
        // 发送请求获取所有角色
        await apiGetRoleList().then(res => {
          // 将返回数据保存
          that.userRole.roleList = res.data
        })
      }
      // 清空树形控件默认值
      this.$refs.roleTreeRef.setCheckedKeys([])
      // 获取选中用户拥有的角色
      await apiGetRoleByUserId({ userId: userId }).then(res => {
        // 将返回数据存储在默认选中角色中
        that.userRole.checkedRoleList = res.data
      })
    },
    // 保存用户角色
    saveUserMenu() {
      // 获取选中节点
      const checkedKeys = this.$refs.roleTreeRef.getCheckedKeys()
      // 执行更新操作
      apiUpdateRoleByUserId({
        userId: this.userRole.updateUserId,
        roleArray: checkedKeys
      }).then(res => {
        // 将页面关闭
        this.userRole.isAssignmentRoleDialog = false
        // 提示信息
        this.$message.success(res.msg)
      })
    },
    // 更新用户状态
    userStateChange(row) {
      // 判断是否是页面初始化触发事件
      if (typeof (row.userId) === 'undefined') {
        // 结束方法
        return
      }
      // 执行更新
      apiUpdateUserStateById({
        userId: row.userId,
        userState: row.userState
      }).then(res => {
        // 提示消息
        this.$message.success(res.msg)
      })
    },
    // 获取学院
    getDepartmentList() {
      // 执行获取
      apiGetDepartmentList().then(res => {
        // 将返回数据保存
        this.formObject.departmentList = res.data
      })
    },
    // 获取专业根据学院
    getMajorByDepartmentId() {
      // 执行获取
      apiGetMajorByDepartmentId({ departmentId: this.formObject.departmentId }).then(res => {
        // 将返回数据保存
        this.formObject.majorList = res.data
      })
    },
    // 初始化密码
    initializationPassword(userId) {
      // 提示是否确认初始化密码
      this.$confirm('确认初始化密码？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(_ => {
        // 执行初始化密码
        apiInitializationPassword({ userId: userId }).then(res => {
          // 提示信息
          this.$message.success(res.msg)
        })
      })
    }
  },
  // 生命周期函数
  created() {
    // 执行获取用户数据
    this.getUserList()
    // 获取所有学院
    this.getDepartmentList()
  }
}
</script>

<style lang='less' scoped>
.text-align-rigth {
  text-align: right;
}
</style>
