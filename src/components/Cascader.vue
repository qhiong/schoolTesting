<template>
  <el-cascader style='width: 100%'
               :options='list'
               :props="{children: 'children', label: 'name', value: 'id'}" clearable>
  </el-cascader>
</template>

<script>
export default {
  name: 'Cascader',
  props: ['list']
}
</script>

<style scoped>
</style>
