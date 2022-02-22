<template>
  <el-select placeholder='请选择课程'>
    <el-option v-for='course in courseList' :key='course.courseId'
               :label='course.courseName' :value='course.courseId'></el-option>
  </el-select>
</template>

<script>
export default {
  name: 'CourseSelect',
  props: [
    'courseList'
  ]
}
</script>

<style scoped>

</style>
