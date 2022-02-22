<template>
  <el-select placeholder='请选择试题类型'>
    <el-option v-for='questionType in questionTypeList' :key='questionType.questionTypeId'
               :label='questionType.questionTypeName' :value='questionType.questionTypeId'></el-option>
  </el-select>
</template>

<script>
export default {
  name: 'QuestionTypeSelect',
  props: [
    'questionTypeList'
  ]
}
</script>

<style scoped>

</style>
