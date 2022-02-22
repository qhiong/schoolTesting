<template>
  <div>
    <Crumbs></Crumbs>
    <el-row>
      <el-col :span='4'>
        <QuestionTypeSelect :questionTypeList='questionTypeList' :filterable='true'
                            v-model='queryObject.questionTypeId'></QuestionTypeSelect>
      </el-col>
      <el-col :span='4'>
        <el-input
          placeholder='请输入试题内容'
          v-model='queryObject.testQuestionsContent'
          clearable>
        </el-input>
      </el-col>
      <el-col :span='4' :offset='1'>
        <DegreeOfDifficultySelect v-model='queryObject.testQuestionsDifficulty'></DegreeOfDifficultySelect>
      </el-col>
      <el-col :span='2'>
        <el-button @click='getTestQuestionsList' type='primary' icon='el-icon-search'>查询</el-button>
      </el-col>
    </el-row>
    <div style='display: flex; justify-content: space-between'>
      <el-button type='primary' plain icon='el-icon-circle-plus-outline' @click='openTestQuestionsFromDialog(-1)'>添加试题
      </el-button>
      <div style='display: flex'>
        <el-button type='info' plain icon='iconfont iconshujudaoru' @click='downTestQuestionsImportModel()'>下载导入模板
        </el-button>
        <el-upload
          ref='uploadRef'
          class='upload-demo'
          :headers='{Authorization:  token}'
          :action='action + "/upload/singleUpload"'
          :limit='1'
          :data='{courseGroupId: queryObject.courseGroupId}'
          :on-success='uploadSuccess'
          :on-error='uploadError'
        >
          <el-button type='primary'>批量导入试题</el-button>
        </el-upload>
      </div>
    </div>
    <el-table
      :data='testQuestionsList'
      style='width: 100%'>
      <el-table-column
        type='index'
        label='序号' width='100'>
      </el-table-column>
      <el-table-column
        label='试题内容'>
        <template #default='scope'>
          <p v-html='scope.row.testQuestionsContent'></p>
        </template>
      </el-table-column>
      <el-table-column
        label='难度'>
        <template #default='scope'>
          {{ scope.row.testQuestionsDifficulty == '1' ? '易' : '' }}
          {{ scope.row.testQuestionsDifficulty == '2' ? '中' : '' }}
          {{ scope.row.testQuestionsDifficulty == '3' ? '难' : '' }}
        </template>
      </el-table-column>
      <el-table-column
        prop='questionTypeName'
        label='试题类型名称'>
      </el-table-column>
      <el-table-column
        label='操作'>
        <template #default='scope'>
          <el-button icon='iconfont iconxiugai' type='primary' size='mini'
                     @click='openTestQuestionsFromDialog(scope.row)'>编辑
          </el-button>
          <el-button icon='iconfont iconicon-shanchu' type='danger' size='mini'
                     @click='deleteTestQuestionsById(scope.row.testQuestionsId)'>删除
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
      :title='testQuestionsForm.testQuestionsFormTitle'
      v-model='testQuestionsForm.isTestQuestionsFormDialog'
      width='80%' @close='resetFormData'>
      <el-form :model='testQuestionsForm' :rules='testQuestionsFormRules' ref='testQuestionsFormRef' label-width='100px'
               class='demo-ruleForm'>
        <el-row>
          <el-col :span='24'>
            <el-form-item label='试题内容' prop='testQuestionsContent'>
              <QuillEditor id='testQuestionsContent' v-model:content='testQuestionsForm.testQuestionsContent'
                           contentType='html'
                           theme='snow' ref='testQuestionsContentRef' toolbar='full'
                           @textChange='richTextContentChange("testQuestionsContent")'></QuillEditor>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='24'>
            <el-form-item label='试题答案' prop='testQuestionsAnswer'>
              <QuillEditor id='testQuestionsAnswer' v-model:content='testQuestionsForm.testQuestionsAnswer'
                           contentType='html'
                           theme='snow' ref='testQuestionsAnswerRef' toolbar='full'
                           @textChange='richTextContentChange("testQuestionsAnswer")'></QuillEditor>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='24'>
            <el-form-item label='正确答案' prop='testQuestionsCorrectAnswer'>
              <QuillEditor id='testQuestionsCorrectAnswer'
                           v-model:content='testQuestionsForm.testQuestionsCorrectAnswer'
                           contentType='html'
                           theme='snow' ref='testQuestionsCorrectAnswerRef' toolbar='full'
                           @textChange='richTextContentChange("testQuestionsCorrectAnswer")'></QuillEditor>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='6'>
            <el-form-item label='难度' prop='testQuestionsDifficulty'>
              <DegreeOfDifficultySelect style='width: 80%;'
                                        v-model='testQuestionsForm.testQuestionsDifficulty'></DegreeOfDifficultySelect>
            </el-form-item>
          </el-col>
          <el-col :span='6'>
            <el-form-item label='试题类型' prop='questionTypeId'>
              <QuestionTypeSelect style='width: 80%;'
                                  :questionTypeList='questionTypeList' :filterable='true'
                                  v-model='testQuestionsForm.questionTypeId'></QuestionTypeSelect>
            </el-form-item>
          </el-col>
          <el-col :span='6'>
            <el-form-item label='试题章节' prop='testQuestionsChapter'>
              <el-input
                placeholder='请输入试题章节'
                v-model='testQuestionsForm.testQuestionsChapter'
                clearable>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type='primary' @click='preservationTestQuestions'>立即保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title='解析数据'
      fullscreen
      v-model='uploadWordData.isUploadWordDataDialog'>
      <el-form v-for='(item, index) in uploadWordData.testQuestionsList' :key='index' label-width='100px'
               class='demo-ruleForm'>
        {{ index + 1 }}
        <el-row>
          <el-col :span='24'>
            <el-form-item label='试题内容'>
              <QuillEditor :id='"testQuestionsContent" + index' v-model:content='item.testQuestionsContent'
                           contentType='html'
                           theme='snow' toolbar='full'
                           @textChange='richTextContentChange("testQuestionsContent" + index)'></QuillEditor>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='24'>
            <el-form-item label='试题答案'>
              <QuillEditor :id='"testQuestionsAnswer" + index' v-model:content='item.testQuestionsAnswer'
                           contentType='html'
                           theme='snow' toolbar='full'
                           @textChange='richTextContentChange("testQuestionsAnswer" + index)'></QuillEditor>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='24'>
            <el-form-item label='正确答案'>
              <QuillEditor :id='"testQuestionsCorrectAnswer" + index'
                           v-model:content='item.testQuestionsCorrectAnswer'
                           contentType='html'
                           theme='snow' toolbar='full'
                           @textChange='richTextContentChange("testQuestionsCorrectAnswer" + index)'></QuillEditor>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='6'>
            <el-form-item label='难度'>
              <DegreeOfDifficultySelect style='width: 80%;'
                                        v-model='item.testQuestionsDifficulty'></DegreeOfDifficultySelect>
            </el-form-item>
          </el-col>
          <el-col :span='6'>
            <el-form-item label='试题类型'>
              <QuestionTypeSelect style='width: 80%;'
                                  :questionTypeList='questionTypeList' :filterable='true'
                                  v-model='item.questionTypeId'></QuestionTypeSelect>
            </el-form-item>
          </el-col>
          <el-col :span='6'>
            <el-form-item label='试题章节'>
              <el-input
                placeholder='请输入试题章节'
                v-model='item.testQuestionsChapter'
                clearable>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider></el-divider>
      </el-form>
      <el-button type='primary' @click='importTestQuestions'>确认导入</el-button>
    </el-dialog>
  </div>
</template>

<script>
// 引入vuex
import store from '@/store'
// 引入试题难度下拉列表组件
import DegreeOfDifficultySelect from '@/components/DegreeOfDifficultySelect'
// 引入面包屑组件
import Crumbs from '@/components/Crumbs'
// 引入试题类型选择器组件
import QuestionTypeSelect from '@/components/QuestionTypeSelect'
// 引入富文本组件
import { QuillEditor } from '@vueup/vue-quill'
// 引入获取所有试题api 添加试题api 删除试题api 修改试题api 解析word文本api 导入试题api
import {
  apiGetTestQuestionsByConditionalPagination,
  apiDeleteTestQuestionsById,
  apiAddTestQuestions,
  apiUpdateTestQuestionsById,
  apiWordAnalysis,
  apiImportTestQuestions
} from '@/request/api/testQuestions'
// 引入上传图片api
import { apiUploadImg } from '@/request/api/upload'
// 引入获取试题类型列表api
import { apiGetQuestionTypeList } from '@/request/api/questionType'
// 引入树形结构数据格式化工具 级联选择器选中后是数组形式转换成数组最后一位工具类
import { arrayToNumeric } from '@/util/treeStructureDataConversion'
// 引入富文本样式
import '@vueup/vue-quill/dist/vue-quill.snow.css'
// 引入base64转换图片工具方法
import { base64ToImg } from '@/util/base64Utils'

export default {
  name: 'TestQuestions',
  // 注册组件
  components: {
    QuillEditor,
    Crumbs,
    DegreeOfDifficultySelect,
    QuestionTypeSelect
  },
  data() {
    return {
      // 用户信息
      token: localStorage.getItem('token'),
      // 上传文件解析地址
      action: store.state.axiosHeaderPath,
      // 试题数组
      testQuestionsList: [],
      // 试题类型数组
      questionTypeList: [],
      // 试题总记录数
      total: 0,
      // 查询条件对象
      queryObject: {
        // 页码
        currentPage: 1,
        // 每页显示数量
        pageSize: 10,
        // 查询时的试题内容
        testQuestionsContent: '',
        // 查询时试题难度
        testQuestionsDifficulty: '',
        // 试题类型编号
        questionTypeId: '',
        // 课程组编号
        courseGroupId: 0
      },
      // 新增 修改页面表单数据
      testQuestionsForm: {
        // 试题表单标题
        testQuestionsFormTitle: '',
        // 是否显示新增、修改保存页面
        isTestQuestionsFormDialog: false,
        // 试题编号
        testQuestionsId: 0,
        // 试题内容
        testQuestionsContent: '',
        // 试题答案
        testQuestionsAnswer: '',
        // 试题难度
        testQuestionsDifficulty: '',
        // 试题类型编号
        questionTypeId: 1,
        // 试题章节
        testQuestionsChapter: '',
        // 试题正确答案
        testQuestionsCorrectAnswer: ''
      },
      // 上传解析数据
      uploadWordData: {
        // 上传试题数据
        testQuestionsList: [],
        // 是否显示上传数据解析页面
        isUploadWordDataDialog: false
      },
      // 表单验证规则
      testQuestionsFormRules: {
        // 试题内容验证规则
        testQuestionsContent: [
          {
            required: true,
            message: '请输入试题内容',
            trigger: 'blur'
          }
        ],
        // 试题答案验证规则
        testQuestionsAnswer: [
          {
            required: true,
            message: '请输入试题答案',
            trigger: 'blur'
          }
        ],
        // 试题正确答案验证规则
        testQuestionsCorrectAnswer: [
          {
            required: true,
            message: '请输入试题正确答案',
            trigger: 'blur'
          }
        ],
        // 试题章节验证规则
        testQuestionsChapter: [
          {
            required: true,
            message: '请输入试题章节',
            trigger: 'blur'
          }
        ],
        // 试题难度验证规则
        testQuestionsDifficulty: [
          {
            required: true,
            message: '请选则试题难度',
            trigger: 'blur'
          }
        ],
        // 试题类型验证规则
        questionTypeId: [
          {
            required: true,
            message: '请选则试题类型',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 富文本中内容变动事件
    richTextContentChange(id) {
      // 根据编号获取节点
      const el = document.getElementById(id)
      // 获取节点中的img标签
      const imgs = el.getElementsByTagName('img')
      // 判断是否有img标签
      if (imgs.length === 0) {
        return
      }
      // 获取将最后一个img
      const img = imgs[imgs.length - 1]
      // 获取img src属性
      const src = img.getAttribute('src')
      // 将字符串转化图片
      const obj = base64ToImg(src)
      // 判断返回值是否存在
      if (obj === undefined) {
        return
      }
      // 初始化表单数据
      const fd = new FormData()
      // 表单中添加图片文件
      fd.append('file', obj, 'image.jpg')
      // 执行上传文件
      apiUploadImg(fd).then(res => {
        // 上传成功将src属性替换为最新上传路径
        img.setAttribute('src', store.state.fileDownPath + res.data.data)
        // 设置图片宽度
        img.setAttribute('width', 100)
        // 设置图片高度
        img.setAttribute('height', 70)
        // 设置图片右边距
        img.setAttribute('style', 'margin-right: 10px')
      })
    },
    // 获取所有试题
    getTestQuestionsList() {
      // 将查询对象深拷贝
      const queryObject = Object.assign({}, this.queryObject)
      // 判断试题类型编号是否为空
      queryObject.questionTypeId = arrayToNumeric(queryObject.questionTypeId)
      // 判断课程组编号是否为空
      queryObject.courseGroupId = arrayToNumeric(queryObject.courseGroupId)
      // 执行查询
      apiGetTestQuestionsByConditionalPagination(queryObject).then(res => {
        // 将查询结果保存
        this.testQuestionsList = res.data.testQuestionsList
        // 将总记录条数保存
        this.total = res.data.total
      })
    },
    // 每页显示数量发生变化时触发的事件
    handleSizeChange(newSize) {
      // 将最新的每页数量存储
      this.queryObject.pageSize = newSize
      // 执行获取所有试题方法
      this.getTestQuestionsList()
    },
    // 页码发生变化触发的事件
    handleCurrentChange(newPage) {
      // 将最新的页码保存下来
      this.queryObject.currentPage = newPage
      // 获取最新的试题数据
      this.getTestQuestionsList()
    },
    // 重置表单数据
    resetFormData() {
      // 将表单弹出层关闭
      this.testQuestionsForm.isTestQuestionsFormDialog = false
      // 将试题编号清空
      this.testQuestionsForm.testQuestionsId = 0
      // 将试题内容设置为空
      this.$refs.testQuestionsContentRef.setHTML('')
      // 将试题答案设置为空
      this.$refs.testQuestionsAnswerRef.setHTML('')
      // 将试题正确答案设置为空
      this.$refs.testQuestionsCorrectAnswerRef.setHTML('')
      // 将试题难度设置为空
      this.testQuestionsForm.testQuestionsDifficulty = ''
      // 将试题类型编号设置为1
      this.testQuestionsForm.questionTypeId = 1
      // 将试题章节设置为空
      this.testQuestionsForm.testQuestionsChapter = ''
    },
    // 打开表单
    async openTestQuestionsFromDialog(row) {
      // 保存this
      const that = this
      // 将表单显示
      this.testQuestionsForm.isTestQuestionsFormDialog = true
      // 将表单标题修改为添加
      that.testQuestionsForm.testQuestionsFormTitle = '添加'
      // 判断参数row 是否为-1 如果不是说明是修改
      if (row !== -1) {
        // 将参数保存在新增 修改保存页面
        that.testQuestionsForm.testQuestionsId = row.testQuestionsId
        // 将试题难度保存
        that.testQuestionsForm.testQuestionsDifficulty = row.testQuestionsDifficulty
        // 将试题章节保存
        that.testQuestionsForm.testQuestionsChapter = row.testQuestionsChapter
        // 将试题类型编号保存
        that.testQuestionsForm.questionTypeId = row.questionTypeId
        // 设置表单标题
        that.testQuestionsForm.testQuestionsFormTitle = '修改'
        // 设置定时器 每秒执行一次设置试题内容 试题答案 试题正确答案富文本 不抛出异常 停止定时器 （因为懒加载获取不到富文本对象）
        const t = setInterval(function() {
          try {
            that.$refs.testQuestionsContentRef.setHTML(row.testQuestionsContent)
            that.$refs.testQuestionsAnswerRef.setHTML(row.testQuestionsAnswer)
            that.$refs.testQuestionsCorrectAnswerRef.setHTML(row.testQuestionsCorrectAnswer)
            clearInterval(t)
          } catch (e) {
          }
        }, 100)
      }
    },
    // 保存试题表单 转同步
    async preservationTestQuestions() {
      // 保存this
      const that = this
      // 初始化状态值
      let valid = false
      // 表单验证
      that.$refs.testQuestionsFormRef.validate(v => {
        // 将验证结果保存
        valid = v
      })
      // 判断验证是否成功
      if (!valid) {
        this.$message.error('请输入正确内容')
        return
      }
      // 定义试题数据
      const testQuestions = {
        testQuestionsId: this.testQuestionsForm.testQuestionsId,
        testQuestionsContent: this.testQuestionsForm.testQuestionsContent,
        testQuestionsDifficulty: this.testQuestionsForm.testQuestionsDifficulty,
        courseGroupId: this.queryObject.courseGroupId,
        questionTypeId: this.testQuestionsForm.questionTypeId,
        testQuestionsAnswer: this.testQuestionsForm.testQuestionsAnswer,
        testQuestionsCorrectAnswer: this.testQuestionsForm.testQuestionsCorrectAnswer,
        testQuestionsChapter: this.testQuestionsForm.testQuestionsChapter
      }
      // 判断表单中的试题编号是否是初始化的0 0表示新增数据
      if (!this.testQuestionsForm.testQuestionsId) {
        // 执行新增试题
        await apiAddTestQuestions(testQuestions).then(res => {
          // 成功提示信息
          that.$message.success(res.msg)
        })
        // 如果不等于0 表示修改数据
      } else {
        // 执行修改方法
        await apiUpdateTestQuestionsById(testQuestions).then(res => {
          // 提示成功信息
          that.$message.success(res.msg)
        })
      }
      // 将表单隐藏
      that.testQuestionsForm.isTestQuestionsFormDialog = false
      // 重新获取试题数据
      that.getTestQuestionsList()
    },
    // 删除试题根据编号
    deleteTestQuestionsById(testQuestionsId) {
      // 提示是否确认删除
      this.$confirm('确认删除？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(_ => {
        // 确定 执行删除
        apiDeleteTestQuestionsById({ testQuestionsId: testQuestionsId }).then(res => {
          // 提示成功信息
          this.$message.success(res.msg)
          // 重新获取试题数据
          this.getTestQuestionsList()
        })
      })
    },
    // 获取试题类型
    getQuestionTypeList() {
      // 执行查询
      apiGetQuestionTypeList().then(res => {
        // 将结果保存
        this.questionTypeList = res.data
      })
    },
    // 下载导入试题模板
    downTestQuestionsImportModel() {
      location.href = store.state.fileDownPath + 'model/testQuestionsImportModel.doc'
    },
    // 上传导入文件成功函数
    uploadSuccess(response) {
      // 执行根据word文件名获取试题信息
      apiWordAnalysis({ wordPath: response.data }).then(res => {
        // 显示解析数据页面
        this.uploadWordData.isUploadWordDataDialog = true
        // 数据保存
        const data = res.data
        // 遍历试题
        data.forEach(d => {
          // 处理试题难度格式
          d.testQuestionsDifficulty = d.testQuestionsDifficulty.slice(5).trim()
          // 试题答案格式化
          d.testQuestionsAnswer = d.testQuestionsAnswer.slice(5).trim()
          // 试题正确答案格式化
          d.testQuestionsCorrectAnswer = d.testQuestionsCorrectAnswer.slice(5).trim()
          switch (d.testQuestionsDifficulty) {
            case '难': d.testQuestionsDifficulty = '3'; break
            case '中': d.testQuestionsDifficulty = '2'; break
            default: d.testQuestionsDifficulty = '1'
          }
          // 处理试题章节格式
          d.testQuestionsChapter = d.testQuestionsChapter.slice(3)
          // 处理课程组编号格式
          d.courseGroupId = parseInt(this.queryObject.courseGroupId)
          // 处理试题类型编号格式
          d.questionTypeId = d.questionTypeId.slice(3)
          this.questionTypeList.forEach(q => {
            if (q.questionTypeName === d.questionTypeId) {
              d.questionTypeId = q.questionTypeId
            }
          })
        })
        // 处理后数据保存
        this.uploadWordData.testQuestionsList = res.data
      })
    },
    // 上传失败函数
    uploadError(err) {
      // 提示信息
      this.$message.error(err.msg)
    },
    // 导入试题
    importTestQuestions() {
      // 执行导入
      apiImportTestQuestions(this.uploadWordData.testQuestionsList).then(res => {
        // 提示信息
        this.$message.success(res.data.msg)
        // 执行获取试题
        this.getTestQuestionsList()
        // 数据解析页面关闭
        this.uploadWordData.isUploadWordDataDialog = false
      })
    }

  },
  // 生命周期函数
  created() {
    // 将路由中的课程组编号保存到查询对象中
    this.queryObject.courseGroupId = this.$route.params.courseGroupId
    // 执行获取所有试题
    this.getTestQuestionsList()
    // 获去所有试题类型
    this.getQuestionTypeList()
  }
}
</script>

<style lang='less' scoped>
.el-row {
  margin: 10px 0;
}

.el-button {
  margin-right: 10px;
  height: 40px;
}
</style>
