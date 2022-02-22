<template>
  <el-select placeholder='请选择学院'>
    <el-option v-for='department in departmentList' :key='department.departmentId'
               :label='department.departmentName' :value='department.departmentId'></el-option>
  </el-select>
</template>

<script>
export default {
  name: 'DepartmentSelect',
  props: [
    'departmentList'
  ]
}
</script>

<style scoped>

</style>
