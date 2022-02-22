<template>
  <Crumbs></Crumbs>
  <el-row>
    <el-col :span='4'>
      <el-select v-model="majorId" filterable placeholder="请选择专业"  @change='majorIdChange'>
        <el-option
          v-for="item in majorList"
          :key="item.majorId"
          :label="item.majorName"
          :value="item.majorId"
        >
        </el-option>
      </el-select>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span='7'>
      <el-row>
        <el-col :span='12'>
          <p>未选课年级:</p>
          <el-checkbox-group v-model='checkGradeList'>
            <el-checkbox v-for='grade in gradeList' :key='grade' :label='grade' border></el-checkbox>
          </el-checkbox-group>
        </el-col>
        <el-col :span='11' :offset='1'>
          <p>教学计划:</p>
          <el-radio v-model='teachingPlanId' :label='teachingPlan.teachingPlanId' border
                    v-for='teachingPlan in teachingPlanList'
                    :key='teachingPlan.teachingPlanId'>
            {{ teachingPlan.teachingPlanName }}
          </el-radio>
        </el-col>
      </el-row>

      <div class='t_a_r'>
        <el-button type='primary' class='m_t_20' @click='addCourseSelection'>添加选课</el-button>
      </div>
    </el-col>

    <el-col :span='16' :offset='1'>
      <p>已选课信息:</p>
      <el-table
        :data='selectedCourseList'
        style='width: 100%'>
        <el-table-column
          prop='teachingPlanName'
          label='教学计划名称'
          width='180'>
        </el-table-column>
        <el-table-column
          prop='grade'
          label='年级'
          width='180'>
        </el-table-column>
        <el-table-column
          label='操作'>
          <template #default='scope'>
            <el-button type='danger' @click='deleteCourseSelectionById(scope.row.courseSelectionId)'>删除选课</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>

<script>
// 引入面包屑导航
import Crumbs from '@/components/Crumbs'

// 引入获取为选课年级根据专业api 一如获取选课信息根据专业编号api 引入删除选课api 引入添加选课api
import {
  apiGetNotSelectedCourseGrade,
  apiGetSelectedCourseByMajorId,
  apiDeleteCourseSelectionById,
  apiAddCourseSelection
} from '@/request/api/courseSelection'
// 引入获取教学计划根据专业api
import { apiGetTeachingPlanByMajorId } from '@/request/api/teachingPlan'
// 引入获取学院专业属性结构数据api
import { apiGetMajorByLoginUserMajorId } from '@/request/api/major'
// 级联选择器数据处理工具类
import { arrayToString } from '@/util/treeStructureDataConversion'

export default {
  name: 'CourseSelection',
  // 注册组件
  components: {
    Crumbs
  },
  data() {
    return {
      // 为选课年级数组
      gradeList: [],
      // 选中为选课年级数组
      checkGradeList: [],
      // 专业编号
      majorId: '',
      // 教学计划数组
      teachingPlanList: [],
      // 选中教学计划编号
      teachingPlanId: 0,
      // 已选课数组
      selectedCourseList: [],
      // 获取学院专业树形结构数组
      majorList: []
    }
  },
  methods: {
    // 获取未选课年级数组
    getNotSelectedCourseGrade() {
      // 执行根据专业编号获取
      apiGetNotSelectedCourseGrade({ majorId: this.majorId }).then(res => {
        // 保存数据
        this.gradeList = res.data
      })
    },
    // 获取教学计划根据专业编号
    getTeachingPlanByMajorId() {
      // 执行查询
      apiGetTeachingPlanByMajorId({ majorId: this.majorId }).then(res => {
        // 保存数据
        this.teachingPlanList = res.data
      })
    },
    // 获取已选课信息根据专业编号
    getSelectedCourseByMajorId() {
      // 执行查询
      apiGetSelectedCourseByMajorId({ majorId: this.majorId }).then(res => {
        // 保存数据
        this.selectedCourseList = res.data
      })
    },
    // 专业值改变
    majorIdChange() {
      // 专业编号格式转换
      this.majorId = arrayToString(this.majorId)
      // 将教学计划编号清空
      this.teachingPlanId = 0
      // 执行 获取为选课年级数组
      this.getNotSelectedCourseGrade()
      // 执行 获取教学计划数组
      this.getTeachingPlanByMajorId()
      // 执行 获取已选课数组
      this.getSelectedCourseByMajorId()
    },
    // 删除选课根据编号
    deleteCourseSelectionById(courseSelectionId) {
      // 提示是否确认删除
      this.$confirm('确认删除？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(_ => {
        // 确定 执行删除
        apiDeleteCourseSelectionById({ courseSelectionId: courseSelectionId }).then(res => {
          // 提示信息
          this.$message.success(res.msg)
          // 重新获取数据
          this.majorIdChange()
        })
      })
    },
    // 添加选课
    addCourseSelection() {
      // 判断已选中年级数组是否为空
      if (this.checkGradeList.length === 0) {
        // 提示信息
        this.$message.error('请选择年级')
        // 结束
        return
      }
      // 判断教学计划是否选中
      if (this.teachingPlanId === 0) {
        // 提示信息
        this.$message.error('请选择教学计划')
        // 结束
        return
      }
      // 执行添加
      apiAddCourseSelection({
        gradeArray: this.checkGradeList,
        teachingPlanId: this.teachingPlanId
      }).then(res => {
        // 提示信息
        this.$message.success(res.msg)
        // 重新获取数据据
        this.majorIdChange()
        // 将选中年级数组清空
        this.checkGradeList = []
      })
    },
    // 获取专业根据登录用户
    getMajorByLoginUserMajorId() {
      // 执行查询
      apiGetMajorByLoginUserMajorId().then(res => {
        // 将数组保存
        this.majorList = res.data
      })
    }
  },
  created() {
    // 获取专业根据登录用户
    this.getMajorByLoginUserMajorId()
  }
}
</script>

<style scoped>
.el-checkbox {
  display: block;
  margin: 10px;
}

.el-radio {
  margin: 0 10px 10px;
}

.el-row {
  margin-bottom: 10px;
}

.m_t_20 {
  margin-top: 20px;
}

.t_a_r {
  text-align: right;
}
</style>
