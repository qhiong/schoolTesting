<template>
  <label v-for='menu in menuList' :key="menu.menuId+''">
    <el-submenu :index="menu.menuId+''" v-if='typeof menu.children!="undefined"'>
      <template #title>
        <i class='el-icon-location'></i>
        <span>{{ menu.menuName }}</span>
      </template>
      <Menu :menuList='menu.children'></Menu>
    </el-submenu>
    <el-menu-item v-else :route='menu.menuAddress' :index="menu.menuId+''">
      {{ menu.menuName }}
    </el-menu-item>
  </label>
</template>

<script>
export default {
  name: 'Menu',
  // 父子通信
  props: [
    'menuList'
  ]
}
</script>

<style scoped>

</style>
