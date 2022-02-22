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
          placeholder='请输入教学计划名称'
          v-model='queryObject.teachingPlanName'
          clearable>
        </el-input>
      </el-col>
      <el-col :span='2' :offset='1'>
        <el-button @click='getTeachingPlanList' type='primary' icon='el-icon-search'>查询</el-button>
      </el-col>
    </el-row>
    <el-button type='primary' plain icon='el-icon-circle-plus-outline' @click='openTeachingPlanFromDialog(-1)'>添加教学计划
    </el-button>
    <el-table
      :data='teachingPlanList'
      style='width: 100%'>
      <el-table-column
        type='index'
        label='序号' width='200'>
      </el-table-column>
      <el-table-column
        prop='teachingPlanName'
        label='教学计划名称'>
      </el-table-column>
      <el-table-column
        label='操作'>
        <template #default='scope'>
          <el-button icon='iconfont iconxiugai' type='primary' size='mini'
                     @click='openTeachingPlanFromDialog(scope.row)'>编辑
          </el-button>
          <el-button icon='iconfont iconicon-shanchu' type='danger' size='mini'
                     @click='deleteTeachingPlanById(scope.row.teachingPlanId)'>删除
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
      :title='teachingPlanForm.teachingPlanFormTitle'
      v-model='teachingPlanForm.isTeachingPlanFormDialog'
      width='50%' top='25vh' @close='resetFormData'>
      <el-form :model='teachingPlanForm' :rules='teachingPlanFormRules' ref='teachingPlanFormRef' label-width='120px'
               class='demo-ruleForm'>
        <el-form-item label='教学计划名称' prop='teachingPlanName'>
          <el-input v-model='teachingPlanForm.teachingPlanName' clearable></el-input>
        </el-form-item>
        <el-form-item label='专业名称' prop='majorId'>
          <el-select v-model="teachingPlanForm.majorId" filterable placeholder="请选择专业">
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
          <el-button type='primary' @click='preservationTeachingPlan'>立即保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// 引入面包屑导航
import Crumbs from '@/components/Crumbs'
// 引入获取教学计划根据条件分页api 引入删除教学计划api 增加教学计划api 修改教学计划api
import {
  apiGetTeachingPlanListByConditionalPagination,
  apiDeleteTeachingPlanById,
  apiAddTeachingPlan,
  apiUpdateTeachingPlanById
} from '@/request/api/teachingPlan'

// 引入根据用户专业获取专业api
import { apiGetMajorByLoginUserMajorId } from '@/request/api/major'
export default {
  name: 'TeachingPlan',
  // 注册组件
  components: {
    Crumbs
  },
  data() {
    return {
      majorList: [],
      // 教学计划数组
      teachingPlanList: [],
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
        // 查询时的教学计划名称
        teachingPlanName: ''
      },
      // 新增 修改页面表单数据
      teachingPlanForm: {
        // 是否显示新增、修改保存页面
        isTeachingPlanFormDialog: false,
        // 教学计划编号
        teachingPlanId: 0,
        // 教学计划名称
        teachingPlanName: '',
        // 专业编号
        majorId: '',
        // 表单标题
        teachingPlanFormTitle: ''
      },
      // 表单验证规则
      teachingPlanFormRules: {
        // 教学计划名称验证规则
        teachingPlanName: [
          {
            required: true,
            message: '请输入教学计划名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 200,
            message: '长度在 1 ~ 200 个字符',
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
    // 获取所有教学计划
    getTeachingPlanList() {
      // 执行查询
      apiGetTeachingPlanListByConditionalPagination(this.queryObject).then(res => {
        // 将查询结果保存
        this.teachingPlanList = res.data.teachingPlanList
        // 将返回的总数存储
        this.total = res.data.total
      })
    },
    // 每页显示数量发生变化时触发的事件
    handleSizeChange(newSize) {
      // 将最新的每页数量存储
      this.queryObject.pageSize = newSize
      // 执行获取所有教学计划方法
      this.getTeachingPlanList()
    },
    // 页码发生变化触发的事件
    handleCurrentChange(newPage) {
      // 将最新的页码保存下来
      this.queryObject.currentPage = newPage
      // 获取最新的教学计划数据
      this.getTeachingPlanList()
    },
    // 打开表单
    openTeachingPlanFromDialog(row) {
      // 保存this
      const that = this
      // 将表单显示
      this.teachingPlanForm.isTeachingPlanFormDialog = true
      // 将表单标题修改为添加
      that.teachingPlanForm.teachingPlanFormTitle = '添加'
      // 判断参数row 是否为-1 如果不是说明是修改
      if (row !== -1) {
        // 将参数保存在新增 修改保存页面
        that.teachingPlanForm.teachingPlanId = row.teachingPlanId
        that.teachingPlanForm.teachingPlanName = row.teachingPlanName
        that.teachingPlanForm.majorId = row.majorId
        that.teachingPlanForm.teachingPlanFormTitle = '修改'
      }
    },
    // 重置表单数据
    resetFormData() {
      // 清空表单 并移除判定错误信息
      // this.$refs.teachingPlanFormRef.resetFields()
      this.teachingPlanForm.teachingPlanId = 0
      this.teachingPlanForm.teachingPlanName = ''
      this.teachingPlanForm.majorId = ''
      this.teachingPlanForm.teachingPlanFormTitle = ''
    },
    // 保存学院表单 转同步
    async preservationTeachingPlan() {
      // 保存this
      const that = this
      // 初始化状态值
      let valid = false
      // 表单验证
      that.$refs.teachingPlanFormRef.validate(v => {
        // 将验证结果保存
        valid = v
      })
      // 判断验证是否成功
      if (!valid) {
        this.$message.error('请输入正确内容')
        return
      }
      // 判断表单中的教学计划编号是否是初始化的0 0表示新增数据
      if (!this.teachingPlanForm.teachingPlanId) {
        // 执行新增教学计划
        await apiAddTeachingPlan(that.teachingPlanForm).then(res => {
          // 成功提示信息
          that.$message.success(res.msg)
        })
        // 如果不等于0 表示修改数据
      } else {
        // 执行修改方法
        await apiUpdateTeachingPlanById(that.teachingPlanForm).then(res => {
          // 提示成功信息
          that.$message.success(res.msg)
        })
      }
      // 将表单隐藏
      that.teachingPlanForm.isTeachingPlanFormDialog = false
      // 重置表单数组
      this.resetFormData()
      // 重新获取教学计划数据
      that.getTeachingPlanList()
    },
    // 删除教学计划根据编号
    deleteTeachingPlanById(teachingPlanId) {
      // 提示是否确认删除
      this.$confirm('确认删除？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(_ => {
        // 确定 执行删除
        apiDeleteTeachingPlanById({ teachingPlanId: teachingPlanId }).then(res => {
          // 提示成功信息
          this.$message.success(res.msg)
          // 重新获取教学计划数据
          this.getTeachingPlanList()
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
          this.getTeachingPlanList()
        }
      })
    }
  },
  // 生命周期函数
  created() {
    // 获取专业数组
    this.getMajorByLoginUserMajorId()
  }
}
</script>

<style lang='less' scoped>
.el-row {
  margin: 10px 0;
}
</style>
