<template>
  <el-select placeholder='请选择难度系数'>
    <el-option
      v-for='item in degreeOfDifficultyList'
      :key='item.id'
      :label='item.name'
      :value='item.id'>
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'DegreeOfDifficultySelect',
  data() {
    return {
      degreeOfDifficultyList: [
        {
          id: '1',
          name: '易'
        },
        {
          id: '2',
          name: '中'
        },
        {
          id: '3',
          name: '难'
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
