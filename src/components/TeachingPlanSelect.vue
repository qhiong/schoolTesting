<template>
  <el-select placeholder='请选择教学计划'>
    <el-option v-for='teachingPlan in teachingPlanList' :key='teachingPlan.teachingPlanId'
               :label='teachingPlan.teachingPlanName' :value='teachingPlan.teachingPlanId'></el-option>
  </el-select>
</template>

<script>
export default {
  name: 'TeachingPlanSelect',
  props: [
    'teachingPlanList'
  ]
}
</script>

<style scoped>

</style>
