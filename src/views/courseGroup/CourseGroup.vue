<template>
  <div>
    <Crumbs></Crumbs>
    <el-row>
      <el-col :span='8'>
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
      <el-col :span='6' :offset='1'>
        <el-input
          placeholder='请输入课程组名称'
          v-model='queryObject.courseGroupName'
          clearable>
        </el-input>
      </el-col>
      <el-col :span='2' :offset='1'>
        <el-button @click='getCourseGroupList' type='primary' icon='el-icon-search'>查询</el-button>
      </el-col>
    </el-row>
    <el-button type='primary' plain icon='el-icon-circle-plus-outline' @click='openCourseGroupFromDialog(-1)'>添加课程组
    </el-button>
    <el-table
      :data='courseGroupList'
      style='width: 100%'>
      <el-table-column
        type='index'
        label='序号' width='200'>
      </el-table-column>
      <el-table-column
        prop='courseGroupName'
        label='课程组名称'>
      </el-table-column>
      <el-table-column
        label='操作'>
        <template #default='scope'>
          <el-button icon='iconfont iconxiugai' type='primary' size='mini'
                     @click='openCourseGroupFromDialog(scope.row)'>编辑
          </el-button>
          <el-button icon='iconfont iconshezhi' type='success' size='mini'
                     @click='openAssignmentUserDialog((scope.row.courseGroupId))'>分配教师
          </el-button>
          <el-button icon='iconfont iconicon-shanchu' type='danger' size='mini'
                     @click='deleteCourseGroupById(scope.row.courseGroupId)'>删除
          </el-button>
          <el-button icon='iconfont iconshezhi' type='warning' size='mini'
                     @click='openAssignCourseLeader((scope.row.courseGroupId))'>分配课程组长
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
      :title='courseGroupForm.courseGroupFormTitle'
      v-model='courseGroupForm.isCourseGroupFormDialog'
      width='50%' top='25vh' @close='resetFormData'>
      <el-form :model='courseGroupForm' :rules='courseGroupFormRules' ref='courseGroupFormRef' label-width='100px'
               class='demo-ruleForm'>
        <el-form-item label='课程组名称' prop='courseGroupName'>
          <el-input v-model='courseGroupForm.courseGroupName' clearable></el-input>
        </el-form-item>
        <el-form-item label='专业名称' prop='majorId'>
          <el-select v-model="courseGroupForm.majorId" filterable placeholder="请选择专业">
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
          <el-button type='primary' @click='preservationCourseGroup'>立即保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
  <el-dialog
    title='分配教师'
    v-model='userCourseGroup.isAssignmentUserDialog'
    width='50%'>
    <el-input
      placeholder='输入关键字进行过滤'
      v-model='filterText' @change='filterNode'>
    </el-input>

    <el-tree node-key='id'
             class='filter-tree'
             :data='userCourseGroup.departmentMajorUserTreeShapeList'
             :props='{children: "children", label: "name"}'
             default-expand-all
             :filter-node-method='filterNode'
             ref='departmentMajorUserRef' show-checkbox>
    </el-tree>
    <el-row>
      <el-col :span='4' :offset='20' class='text-align-rigth'>
        <el-button type='primary' @click='saveUserCourseGroup'>保存</el-button>
      </el-col>
    </el-row>
  </el-dialog>
  <el-dialog
    title='分配课程组长'
    v-model='assignCourseLeaderForm.isAssignCourseLeaderDialog'
    width='50%'>
    <el-radio-group v-model='assignCourseLeaderForm.courseGroupLeader'>
      <el-radio v-for='item in assignCourseLeaderForm.userCourseGroupList' :key='item.userId' :label='item.userId'>
        {{ item.userName }}
      </el-radio>
    </el-radio-group>
    <el-row>
      <el-col :span='4' :offset='20' class='text-align-rigth'>
        <el-button type='primary' @click='saveCourseGroupLeader'>保存</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
// 引入面包屑导航
import Crumbs from '@/components/Crumbs'
// 引入获取专业根据登录用户api
import { apiGetMajorByLoginUserMajorId } from '@/request/api/major'
// 引入获取课程组根据条件分页api 引入删除课程组api 增加课程组api 修改课程组api
import {
  apiAddCourseGroup,
  apiDeleteCourseGroupById,
  apiGetCourseGroupByConditionalPagination,
  apiUpdateCourseGroupById
} from '@/request/api/courseGroup'
// 引入处理树形结构数据工具类api 级联选择器数据处理工具类
import { dataConversion, arrayToNumeric, arrayToString } from '@/util/treeStructureDataConversion'
// 引入获取学院专业用户树形结构数据api
import { apiGetDepartmentMajorUserTreeShapeList } from '@/request/api/user'
// 引入获取用户编号数组根据课程组编号api 引入修改用户根据课程组编号api 根据课程组编号获取用户课程组api 根据用户课程组修改课程组长api
import {
  apiGetUserIdByCourseGroupId,
  apiUpdateUserByCourseGroupId,
  apiGetUserCourseGroupByCourseGroupId,
  apiUpdateUserCourseGroupLeaderByCourseGroupId
} from '@/request/api/userCourseGroup'

export default {
  name: 'CourseGroup',
  // 注册组件
  components: {
    Crumbs
  },
  // 监听
  watch: {
    // 树形控件过滤器文本
    filterText(val) {
      // 执行过滤方法
      this.$refs.departmentMajorUserRef.filter(val)
    }
  },
  data() {
    return {
      // 树形控件过滤器文本
      filterText: '',
      // 学院专业树形结构数组
      majorList: [],
      // 课程组数组
      courseGroupList: [],
      // 总记录数
      total: 0,
      // 查询数据对象
      queryObject: {
        // 专业编号
        majorId: '',
        // 查询时的课程组名称
        courseGroupName: '',
        // 页码
        currentPage: 1,
        // 每页显示数量
        pageSize: 10
      },
      // 新增 修改页面表单数据
      courseGroupForm: {
        // 是否显示新增、修改保存页面
        isCourseGroupFormDialog: false,
        // 课程组编号
        courseGroupId: 0,
        // 课程组名称
        courseGroupName: '',
        // 表单标题
        courseGroupFormTitle: '',
        // 专业编号
        majorId: ''
      },
      // 用户课程组数据
      userCourseGroup: {
        // 是否显示分配用户弹出层
        isAssignmentUserDialog: false,
        // 学院专业用户树形结构数据
        departmentMajorUserTreeShapeList: [],
        // 要修改课程组编号
        updateCourseGroupId: -1
      },
      // 分配课程组长表单
      assignCourseLeaderForm: {
        // 是否显示分配课程组长页面
        isAssignCourseLeaderDialog: false,
        // 用户课程组信息
        userCourseGroupList: [],
        // 选中课程组长
        courseGroupLeader: '',
        // 课程组编号
        courseGroupId: ''
      },
      // 表单验证规则
      courseGroupFormRules: {
        // 课程组名称验证规则
        courseGroupName: [
          {
            required: true,
            message: '请输入课程组名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 100,
            message: '长度在 1 ~ 100 个字符',
            trigger: 'blur'
          }
        ],
        // 课程编号验证规则
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
    // 获取所有课程组
    getCourseGroupList() {
      // 专业编号格式转换
      this.queryObject.majorId = arrayToString(this.queryObject.majorId)
      // 将查询对象进行深拷贝
      const queryObject = JSON.parse(JSON.stringify(this.queryObject))
      // 判断课程编号是否为空
      if (queryObject.courseId === '') {
        // 将课程编号设置为空
        queryObject.courseId = 0
      }
      // 执行查询
      apiGetCourseGroupByConditionalPagination(queryObject).then(res => {
        // 将查询结果保存
        this.courseGroupList = res.data.courseGroupList
        // 将返回的总数存储
        this.total = res.data.total
      })
    },
    // 每页显示数量发生变化时触发的事件
    handleSizeChange(newSize) {
      // 将最新的每页数量存储
      this.queryObject.pageSize = newSize
      // 执行获取所有课程组方法
      this.getCourseGroupList()
    },
    // 页码发生变化触发的事件
    handleCurrentChange(newPage) {
      // 将最新的页码保存下来
      this.queryObject.currentPage = newPage
      // 获取最新的课程组数据
      this.getCourseGroupList()
    },
    // 打开表单
    openCourseGroupFromDialog(row) {
      // 保存this
      const that = this
      // 将表单显示
      this.courseGroupForm.isCourseGroupFormDialog = true
      // 将表单标题修改为添加
      that.courseGroupForm.courseGroupFormTitle = '添加'
      // 判断参数row 是否为-1 如果不是说明是修改
      if (row !== -1) {
        // 将参数保存在新增 修改保存页面
        that.courseGroupForm.courseGroupId = row.courseGroupId
        that.courseGroupForm.courseGroupName = row.courseGroupName
        that.courseGroupForm.majorId = row.majorId
        that.courseGroupForm.courseGroupFormTitle = '修改'
      }
    },
    // 重置表单数据
    resetFormData() {
      this.courseGroupForm.courseGroupId = 0
      this.courseGroupForm.courseGroupName = ''
      this.courseGroupForm.majorId = ''
      this.courseGroupForm.courseGroupFormTitle = ''
      // 清空表单 并移除判定错误信息
      // this.$refs.courseGroupFormRef.resetFields()
    },
    // 保存课程组表单 转同步
    async preservationCourseGroup() {
      // 保存this
      const that = this
      // 初始化状态值
      let valid = false
      // 表单验证
      that.$refs.courseGroupFormRef.validate(v => {
        // 将验证结果保存
        valid = v
      })
      // 判断验证是否成功
      if (!valid) {
        this.$message.error('请输入正确内容')
        return
      }
      // 专业编号格式转换
      this.courseGroupForm.majorId = arrayToNumeric(this.courseGroupForm.majorId)
      // 判断表单中的课程组编号是否是初始化的0 0表示新增数据
      if (this.courseGroupForm.courseGroupId === 0) {
        // 执行新增课程组
        await apiAddCourseGroup(that.courseGroupForm).then(res => {
          // 成功提示信息
          that.$message.success(res.msg)
        })
        // 如果不等于0 表示修改数据
      } else {
        // 执行修改方法
        await apiUpdateCourseGroupById(that.courseGroupForm).then(res => {
          // 提示成功信息
          that.$message.success(res.msg)
        })
      }
      // 将表单隐藏
      that.courseGroupForm.isCourseGroupFormDialog = false
      // 重置表单数组
      this.resetFormData()
      // 重新获取课程组数据
      that.getCourseGroupList()
    },
    // 删除课程组根据编号
    deleteCourseGroupById(courseGroupId) {
      // 提示是否确认删除
      this.$confirm('确认删除？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(_ => {
        // 确定 执行删除
        apiDeleteCourseGroupById({ courseGroupId: courseGroupId }).then(res => {
          // 提示成功信息
          this.$message.success(res.msg)
          // 重新获取课程组数据
          this.getCourseGroupList()
        })
      })
    },
    // 获取专业根据登录用户
    getMajorByLoginUserMajorId() {
      // 判断数组是否为空 不为空结束程序
      if (this.majorList.length !== 0) {
        return
      }
      // 执行查询
      apiGetMajorByLoginUserMajorId().then(res => {
        // 将数组保存
        this.majorList = res.data
        if (res.data.length !== 0) {
          // 不为空将查询专业编号设置数组第一位的专业编号
          this.queryObject.majorId = res.data[0].majorId
          // 获取课程组
          this.getCourseGroupList()
        }
      })
    },
    // 打开分配用户页面
    async openAssignmentUserDialog(courseGroupId) {
      // 保存this
      const that = this
      // 将要修改的课程组编号保存
      this.userCourseGroup.updateCourseGroupId = courseGroupId
      // 将分配用户页面打开
      this.userCourseGroup.isAssignmentUserDialog = true
      // 判断是否第一次打开 如果是则发送请求 获取数据
      if (that.userCourseGroup.departmentMajorUserTreeShapeList.length === 0) {
        // 发送请求获取所有菜单
        await apiGetDepartmentMajorUserTreeShapeList().then(res => {
          // 将返回数据保存
          that.userCourseGroup.departmentMajorUserTreeShapeList = dataConversion(res.data, [
            {
              id: 'departmentId',
              name: 'departmentName',
              children: 'children'
            },
            {
              id: 'majorId',
              name: 'majorName',
              children: 'children'
            },
            {
              id: 'userId',
              name: 'userName',
              children: 'children'
            }
          ])
        })
      }
      // 清空树形控件默认值
      this.$refs.departmentMajorUserRef.setCheckedKeys([])
      // 获取选中课程组拥有的用户
      await apiGetUserIdByCourseGroupId({ courseGroupId: this.userCourseGroup.updateCourseGroupId }).then(res => {
        // 将返回数据存储在默认选中用户中
        this.$refs.departmentMajorUserRef.setCheckedKeys(res.data)
      })
    },
    // 保存用户课程组
    saveUserCourseGroup() {
      // 获取树形控件中选中用户
      const checkArray = this.$refs.departmentMajorUserRef.getCheckedKeys(true)
      // 初始化数组
      const array = []
      // 将选中用户数组循环
      checkArray.forEach(checkArray => {
        // 判断是否为数值类型 如果为数值说明是教师编号 不为数值说明是学院编号或者专业编号
        if (typeof checkArray === 'number') {
          // 添加到数组中
          array.push(checkArray)
        }
      })
      // 执行根据课程组编号修改用户
      apiUpdateUserByCourseGroupId({
        courseGroupId: this.userCourseGroup.updateCourseGroupId,
        userArray: array
      }).then(res => {
        // 提示信息
        this.$message.success(res.msg)
        // 将弹出层关闭
        this.userCourseGroup.isAssignmentUserDialog = false
        // 将修改课程组编号初始化
        this.userCourseGroup.updateCourseGroupId = -1
      })
    },
    // 树形控件文本过滤器触发事件
    filterNode(value, data) {
      // 判断数据是否为空
      if (!data) return true
      return data.name.indexOf(value) !== -1
    },
    // 打开分配课程组长页面
    openAssignCourseLeader(courseGroupId) {
      // 将页面显示
      this.assignCourseLeaderForm.isAssignCourseLeaderDialog = true
      // 设置课程组编号
      this.assignCourseLeaderForm.courseGroupId = courseGroupId
      // 将组长选项清空
      this.assignCourseLeaderForm.courseGroupLeader = ''
      // 执行获取用户课程组根据课程组编号
      apiGetUserCourseGroupByCourseGroupId({ courseGroupId: courseGroupId }).then(res => {
        // 判断是否存在教师
        if (res.data.length === 0) {
          this.$message.error('请先分配教师')
          return
        }
        // 判断是否是课程组组长
        if (res.data[0].userCourseGroupLeader === 1) {
          // 设置组长选中
          this.assignCourseLeaderForm.courseGroupLeader = res.data[0].userId
        }
        // 将数据保存
        this.assignCourseLeaderForm.userCourseGroupList = res.data
      })
    },
    // 保存课程组组长
    saveCourseGroupLeader() {
      // 执行修改
      apiUpdateUserCourseGroupLeaderByCourseGroupId({
        courseGroupId: this.assignCourseLeaderForm.courseGroupId,
        userId: this.assignCourseLeaderForm.courseGroupLeader
      }).then(res => {
        // 提示信息
        this.$message.success(res.msg)
        // 将分配课程组长页面关闭
        this.assignCourseLeaderForm.isAssignCourseLeaderDialog = false
      })
    }
  },
  // 生命周期函数
  created() {
    // 获取专业根据登录用户
    this.getMajorByLoginUserMajorId()
  }
}
</script>

<style lang='less' scoped>
.el-row {
  margin: 10px 0;
}
.el-select{
  width: 100%;
}
</style>
