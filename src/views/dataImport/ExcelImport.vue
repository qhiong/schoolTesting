<template>
  <div>
    <Crumbs></Crumbs>
    <el-tag type='danger'>
      请选择导入数据类型
    </el-tag>
    <el-radio-group v-model='checkImportDataType'>
      <el-radio v-for='(item,index) in importDataTypeList' :key='index' :label='index'>{{ item.name }}</el-radio>
    </el-radio-group>
    <el-button type='info' icon='iconfont iconshujudaoru' @click='downModel'>下载模板</el-button>
    <el-upload ref='uploadRef'
               accept='application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
               :limit='1'
               class='upload-demo'
               drag
               :action='action + "/excel/excelImport"'
               :on-success='uploadAnalysis' 
               :data='importDataTypeList[checkImportDataType].value'
    >
      <i class='el-icon-upload'></i>
      <div class='el-upload__text'>将文件拖到此处，或<em>点击上传</em></div>
      <template #tip>
        <div class='el-upload__tip'>只能上传 xlsx/xls 文件</div>
      </template>
    </el-upload>
    <el-dialog
      title='上传数据'
      v-model='isImportDataDialog'
      width='50%' top='25vh'>
      <el-table :data='importDataList' style='width: 100%'>
        <el-table-column v-for='(item, index) in importDataTypeList[checkImportDataType].fieldList' :key='index'
                         :prop='item.value' :label='item.name'></el-table-column>
      </el-table>
      <div class='dis_play'>
        <el-button type='primary' @click='confirmImport'>确定导入</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 导入面包屑组件
import Crumbs from '@/components/Crumbs'
// 引入vuex
import store from '@/store/index'
// 引入批量导入学院 试题类型 用户api
import { apiImportDepartment, apiImportQuestionType, apiImportUser } from '@/request/api/excelImport'

export default {
  name: 'ExcelImport',
  // 注册组件
  components: { Crumbs },
  data() {
    return {
      // 导入数据类型列表
      importDataTypeList: [
        // 学院类型
        {
          // 类名
          value: { className: 'Department' },
          // 标签名
          name: '学院',
          // 上传地址
          uploadAddress: apiImportDepartment,
          // 模板下载地址
          downModelAddress: 'departmentExcelModel.xls',
          // 字段列表
          fieldList: [
            { name: '学院编号', value: 'departmentId' },
            { name: '学院名称', value: 'departmentName' }
          ]
        },
        // 试题类型
        {
          value: { className: 'QuestionType' },
          name: '试题类型',
          uploadAddress: apiImportQuestionType,
          downModelAddress: 'questionTypeExcelModel.xls',
          fieldList: [
            { name: '试题类型名称', value: 'questionTypeName' },
            { name: '试题类型简介', value: 'questionTypeSynopsis' }
          ]
        },
        // 用户
        {
          value: { className: 'User' },
          name: '用户',
          uploadAddress: apiImportUser,
          downModelAddress: 'usersExcelModel.xls',
          fieldList: [
            { name: '工号', value: 'userJobNumber' },
            { name: '姓名', value: 'userName' },
            { name: '部门', value: 'departmentId' },
            { name: '专业', value: 'majorId' },
            { name: '身份证号', value: 'userIdCard' },
            { name: '电话', value: 'userPhone' },
            { name: '邮箱', value: 'userEmail' }
          ]
        }
      ],
      // 当前选中导入类型数组索引
      checkImportDataType: 0,
      // 上传文件解析地址
      action: store.state.axiosHeaderPath,
      // 是否显示导入数据对话框
      isImportDataDialog: false,
      // 导入数据列表
      importDataList: []
    }
  },
  methods: {
    // 上传按钮事件
    uploadAnalysis(response) {
      // 返回数据保存
      this.importDataList = response.data
      // 显示导入数据对话框
      this.isImportDataDialog = true
    },
    // 确认导入按钮
    confirmImport() {
      // 当前选中类型
      const importDataType = this.importDataTypeList[this.checkImportDataType]
      // 执行上传
      importDataType.uploadAddress(this.importDataList).then(res => {
        // 提示信息
        this.$message.success(res.data.msg)
        // 清空上传列表文件
        this.$refs.uploadRef.clearFiles()
        // 导入数据列表清空
        this.importDataList = []
        // 不显示导入数据对话框
        this.isImportDataDialog = false
      })
    },
    // 下载模板
    downModel() {
      // 执行跳转下载
      location.href = store.state.fileDownPath + 'model/' + this.importDataTypeList[this.checkImportDataType].downModelAddress
    }
  }
}
</script>

<style lang='less' scoped>
.el-radio-group {
  padding: 10px;
  margin: 10px 0;
}

.dis_play {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
</style>
