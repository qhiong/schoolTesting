<template>
  <el-select placeholder='请选择专业'>
    <el-option v-for='major in majorList' :key='major.majorId'
               :label='major.majorName' :value='major.majorId'></el-option>
  </el-select>
</template>

<script>
export default {
  name: 'MajorSelect',
  props: [
    'majorList'
  ]
}
</script>

<style scoped>

</style>
