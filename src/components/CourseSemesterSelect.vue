<template>
  <el-select placeholder='请选择开课学期'>
    <el-option v-for='courseSemester in courseSemesterList' :key='courseSemester.id'
               :label='courseSemester.name' :value='courseSemester.id'>
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'CourseSemesterSelect',
  data() {
    return {
      courseSemesterList: [
        {
          id: '1',
          name: '第一学期'
        },
        {
          id: '2',
          name: '第二学期'
        },
        {
          id: '3',
          name: '第三学期'
        },
        {
          id: '4',
          name: '第四学期'
        }, {
          id: '5',
          name: '第五学期'
        },
        {
          id: '6',
          name: '第六学期'
        },
        {
          id: '7',
          name: '第七学期'
        },
        {
          id: '8',
          name: '第八学期'
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
