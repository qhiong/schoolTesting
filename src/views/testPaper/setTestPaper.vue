<template>
  <div>
    <Crumbs></Crumbs>
    <el-table v-if='!isSettingsDisplay' :data='testPaperList' style='width: 100%'>
      <el-table-column type='index' label='序号' width='70'></el-table-column>
      <el-table-column prop='testPaperName' label='试卷名称'></el-table-column>
      <el-table-column prop='testPaperTypeName' label='试卷类型名称'></el-table-column>
      <el-table-column prop='testPaperTime' label='添加时间'></el-table-column>
      <el-table-column prop='courseName' label='课程名称'></el-table-column>
      <el-table-column prop='classesName' label='指定班级'></el-table-column>
      <el-table-column prop='teachingPlanName' label='教学计划名称'></el-table-column>
      <el-table-column prop='majorName' label='专业名称'></el-table-column>
      <el-table-column prop='departmentName' label='学院名称'>
      </el-table-column>
      <el-table-column label='操作'>
        <template #default='scope'>
          <el-button
            icon='iconfont iconshezhi1'
            type='warning'
            size='mini'
            @click='toSetting(scope.row)'
          >去设置
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-if='isSettingsDisplay'>
      <div class='dis_play'>
        <el-button
          icon='iconfont iconfanhui'
          type='warning'
          size='mini'
          @click='toSetting'
        >返回
        </el-button>
      </div>
      <div class='demo-input-suffix'>
        <p>试卷名称：</p>
        <el-input v-model='form.testPaperName' disabled>
        </el-input>
      </div>
      <div class='demo-input-suffix'>
        <p>试卷满分：</p>
        <el-input v-model='form.testPaperFraction' type='number' min='1'>
        </el-input>
      </div>
      <div class='demo-input-suffix'>
        <p>试卷难度：</p>
        <DegreeOfDifficultySelect v-model='form.testQuestionsDifficulty'
                                  @change='getTestQuestionsCountGroupByQuestionTypeByCourseIdTestQuestionsDifficulty'></DegreeOfDifficultySelect>
      </div>
      <div class='demo-input-suffix'>
        <p>试题类型：</p>
        <el-checkbox-group v-model='checkQuestionTypeIdList' @change='checkQuestionTypeIdChange'>
          <el-checkbox v-for='questionType in questionTypeList' :key='questionType.questionTypeId'
                       :label='questionType.questionTypeId'>
            {{ questionType.questionTypeName }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <div class='border p10 m10_0' v-for='checkQuestionType in checkQuestionTypeConfigureList'
           :key='checkQuestionType.questionTypeId'>
        <div>
          {{ checkQuestionType.questionType.questionTypeName }}
          <hr>
        </div>
        <div class='dis_play w540'>
          <el-input type='number' :max='form.testPaperFraction'
                    v-model='checkQuestionType.fraction' min='0'
          >
            <template style='height: 40px;' #prepend>总分</template>
          </el-input>
          <el-input class='m0_10' :max='checkQuestionType.share' type='number'
                    v-model='checkQuestionType.extractionQuantity' min='0'>
            <template #prepend>共 {{ checkQuestionType.share }} 道 抽</template>
            <template #append>道</template>
          </el-input>
        </div>
      </div>
      <div>
        <el-button type='primary' @click='generateTestPaper'>生成试卷</el-button>
      </div>
    </div>
  </div>
</template>

<script>
// 引入试题难度下拉列表
import DegreeOfDifficultySelect from '@/components/DegreeOfDifficultySelect'
// 引入面包屑导航
import Crumbs from '@/components/Crumbs'
// 引入获取试卷根据登录用户api 生成试卷api
import { apiGetTestPaperByLoginUser, apiGenerateTestPaper } from '@/request/api/testPaper'
// 引入获取试题类型api
import { apiGetQuestionTypeList } from '@/request/api/questionType'
// 引入获取试题数量根据试题类型分组并且课程编号试题难度相等api
import { apiGetTestQuestionsCountGroupByQuestionTypeByCourseIdTestQuestionsDifficulty } from '@/request/api/testQuestions'
// 引入vuex
import store from '@/store/index'
export default {
  name: 'setTestPaper',
  // 注册组件
  components: {
    Crumbs,
    DegreeOfDifficultySelect
  },
  data() {
    return {
      // 试卷列表
      testPaperList: [],
      // 是否显示设置试卷页面
      isSettingsDisplay: false,
      // 试卷设置表单
      form: {
        // 试卷编号
        testPaperId: '',
        // 试卷名称
        testPaperName: '',
        // 试卷满分
        testPaperFraction: 100,
        // 试卷配置
        testPaperConfigure: '',
        // 试卷难度
        testQuestionsDifficulty: '2',
        // 课程编号
        courseId: 0
      },
      // 试题类型列表
      questionTypeList: [],
      // 选中试题类型编号列表
      checkQuestionTypeIdList: [],
      // 选中试题类型配置列表
      checkQuestionTypeConfigureList: [],
      // 试题类型中试题数量列表
      testQuestionsCountGroupByQuestionType: []
    }
  },
  methods: {
    // 获取试卷根据登录者
    getTestPaperByLoginUser() {
      // 执行查询
      apiGetTestPaperByLoginUser().then(res => {
        // 返回结果保存
        this.testPaperList = res.data
      })
    },
    // 打开页面
    async toSetting(row) {
      // 显示、关闭设置页面
      this.isSettingsDisplay = !this.isSettingsDisplay
      // 判断当前显示页面是否是设置页面 不是设置执行获取试卷
      if (!this.isSettingsDisplay) {
        await this.getTestPaperByLoginUser()
        return
      }
      // 设置页面将数据保存
      this.form.testPaperId = row.testPaperId
      this.form.testPaperName = row.testPaperName
      this.form.courseId = row.courseId
      // 获取试题数量
      this.getTestQuestionsCountGroupByQuestionTypeByCourseIdTestQuestionsDifficulty()
    },
    // 获取试题类型
    getQuestionTypeList() {
      // 执行查询
      apiGetQuestionTypeList().then(res => {
        // 将结果保存
        this.questionTypeList = res.data
      })
    },
    // 选中试题类型改变
    checkQuestionTypeIdChange() {
      // 将选中试题类型配置列表清空
      this.checkQuestionTypeConfigureList = []
      // 遍历选中试题类型编号列表
      this.checkQuestionTypeIdList.forEach(res => {
        // 找到当前试题类型编号在试题类型列表中的数据
        this.questionTypeList.forEach(r => {
          // 判断试题类型编号是否相同
          if (r.questionTypeId === res) {
            // 定义当前试题类型题库中试题数量
            let share = 0
            // 遍历试题类型中试题数量列表
            this.testQuestionsCountGroupByQuestionType.forEach(t => {
              // 判断试题类型编号是否相等
              if (t.questionTypeId === r.questionTypeId) {
                // 试题类型数量赋值
                share = t.count
              }
            })
            // 向试题类型配置列表中添加试题类型配置
            this.checkQuestionTypeConfigureList.push({
              // 当前试题类型
              questionType: r,
              // 当前试题类型总分
              fraction: 0,
              // 试题题库中数量
              share: share,
              // 将要抽取试题数量
              extractionQuantity: 0
            })
          }
        })
      })
    },
    // 根据条件获取试题数量根据试题类型分组
    getTestQuestionsCountGroupByQuestionTypeByCourseIdTestQuestionsDifficulty() {
      // 执行查询
      apiGetTestQuestionsCountGroupByQuestionTypeByCourseIdTestQuestionsDifficulty({
        // 根据课程编号
        courseId: this.form.courseId,
        // 根据试题难度
        testQuestionsDifficulty: this.form.testQuestionsDifficulty
      }).then(res => {
        // 将数据保存
        this.testQuestionsCountGroupByQuestionType = res.data
        // 执行选中试题类型编号改变事件
        this.checkQuestionTypeIdChange()
      })
    },
    // 生成试卷
    generateTestPaper() {
      // 判断试题配置列表是否为空
      if (this.checkQuestionTypeConfigureList.length === 0) {
        this.$message.error('未选择试题类型')
        return
      }
      // 定义总分
      let sum = 0
      // 遍历试题配置列表
      this.checkQuestionTypeConfigureList.forEach(r => {
        // 总分加当前试题类型总分
        sum += parseInt(r.fraction)
        // 判断试题数量 分数设置是否合理
        if (r.extractionQuantity <= 0 || r.fraction <= 0) {
          this.$message.error(r.questionType.questionTypeName + '总分或数量设置错误')
          throw new Error()
        }
        // 判断当前抽取数量是否大于题库中试题总数
        if (r.share < r.extractionQuantity) {
          this.$message.error(r.questionType.questionTypeName + '抽取数量超出')
          throw new Error()
        }
      })
      // 判断试题类型总分是否超出用户设置总分
      if (sum !== parseInt(this.form.testPaperFraction)) {
        this.$message.error('已选试题类型总分与试卷总分不相等')
        return
      }
      // 定义选中试题类型配置列表
      const checkQuestionTypeConfigureList = []
      // 遍历试题类型配置列表
      this.checkQuestionTypeConfigureList.forEach(r => {
        // 添加到局部变量试题配置列表中
        checkQuestionTypeConfigureList.push({
          questionTypeId: r.questionType.questionTypeId,
          fraction: r.fraction,
          extractionQuantity: r.extractionQuantity
        })
      })
      // 执行生成试卷
      apiGenerateTestPaper({
        testPaperId: this.form.testPaperId,
        testPaperFraction: this.form.testPaperFraction,
        testPaperConfigure: JSON.stringify(checkQuestionTypeConfigureList),
        testQuestionsDifficulty: this.form.testQuestionsDifficulty
      }).then(res => {
        // 提示信息
        this.$message.success('生成试卷成功，请在下载列表中查询')
        // 执行下载试卷
        location.href = store.state.fileDownPath + res.data
        // 返回列表页面
        this.toSetting()
      })
    }
  },
  created() {
    // 获取试卷根据登录用户
    this.getTestPaperByLoginUser()
    // 获取试题类型
    this.getQuestionTypeList()
  }
}
</script>

<style lang='less' scoped>
.demo-input-suffix {
  display: flex;

  p {
    width: 100px;
    margin-top: 9px;
  }

  margin: 10px 0;
}

.dis_play {
  display: flex;
  justify-content: flex-end;
}

.el-checkbox-group {
  margin-top: 11px;
}

.border {
  border: 1px solid #E2E2E2;
}

.p10 {
  padding: 10px;
}

.m10_0 {
  margin: 10px 0;
}

.m0_10 {
  margin: 0 10px;
}

.w540 {
  width: 540px;
}
</style>
