<template>
  <el-container>
    <el-header>
      <h3>后台管理<a title='折叠' @click='isCollapse = !isCollapse'><i class='iconfont iconzhedie'></i></a>
      </h3>
      <div class='dis_flex'>
        <el-menu text-color='#fff' class='el-menu-demo' mode='horizontal' background-color="#032121" active-text-color='#fff'>
          <el-submenu index='1'>
            <template #title>
              <el-avatar
                :src='infoImgPath'
              ></el-avatar>
            </template>
            <el-menu-item index='1-1' @click='personalInformation'>个人信息</el-menu-item>
            <el-menu-item index='1-2' @click='signOut'>退出</el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse?'0px': '200px'">
        <el-menu @select='handleMenuSelect' router class='el-menu-vertical-demo' background-color='#032121'
                 :collapse='isCollapse'
                 text-color='#AAA9B0'
                 :collapse-transition='false' unique-opened>
          <Menu :menuList='menuList'></Menu>
        </el-menu>
      </el-aside>
      <el-main>
        <div class='layout'>
          <router-view />
        </div>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
// 引入获取菜单api
import { apiGetMenuByUserJobNumber } from '@/request/api/menu'
// 引入路由
import router from '@/router'
// 引入菜单组件
import Menu from '@/components/Menu'
// 引入vuex
import store from '@/store/index'
export default {
  name: 'Home',
  // 注册组件
  components: {
    Menu
  },
  data() {
    return {
      // 菜单是否折叠状态
      isCollapse: false,
      // 菜单数组
      menuList: [],
      // 面包屑内容数组
      crumbs: ['角色管理', '查看'],
      // 个人信息图片地址
      infoImgPath: store.state.fileDownPath + 'info.png'
    }
  },
  methods: {
    // 路由跳转
    handleMenuSelect(index, indexPath) {
      // 保存this
      const that = this
      // 将面包屑数组清空
      this.crumbs = []
      // 循环路径编号
      for (let i = 0; i < indexPath.length; i++) {
        // 循环菜单数组
        for (let m = 0; m < that.menuList.length; m++) {
          // 判断路径与菜单中的编号是否相等
          // eslint-disable-next-line eqeqeq
          if (indexPath[i] == that.menuList[m].menuId) {
            // 相等 加入面包屑数组
            that.crumbs.push(that.menuList[m].menuName)
            // 结束本次循环
            continue
          }
          // 没找到遍历菜单中子项
          for (let c = 0; c < that.menuList[m].children.length; c++) {
            // 判断路径与菜单中的编号是否相等
            // eslint-disable-next-line eqeqeq
            if (indexPath[i] == that.menuList[m].children[c].menuId) {
              // 相等 加入面包屑数组
              that.crumbs.push(that.menuList[m].children[c].menuName)
              // 结束本次循环
              continue
            }
          }
        }
      }
      // 将面包屑数组转换成字符串
      const crumbs = JSON.stringify(this.crumbs)
      // 存储在本地session
      window.sessionStorage.setItem('crumbs', crumbs)
    },
    // 退出登陆
    signOut() {
      // 弹出是否要退出对话框
      this.$confirm('确认退出？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(_ => {
        // 确认后删除本地存储的令牌
        localStorage.removeItem('token')
        // 跳转到登陆页
        router.push('/login')
      })
    },
    // 根据用户名获取菜单数组
    getMenuByUserJobNumber() {
      // api请求
      apiGetMenuByUserJobNumber().then(res => {
        // 将返回数据放到定义的菜单数组中
        // 将数组转换成树形结构
        const data = res.data
        const result = []
        if (!Array.isArray(data)) {
          return result
        }
        data.forEach(item => {
          delete item.children
        })
        const map = {}
        data.forEach(item => {
          map[item.menuId] = item
        })
        data.forEach(item => {
          const parent = map[item.pId]
          if (parent) {
            (parent.children || (parent.children = [])).push(item)
          } else {
            result.push(item)
          }
        })
        this.menuList = result
      })
    },
    // 跳转到个人信息页面
    personalInformation() {
      // 跳转
      this.$router.push('/personalInformation')
    }
  },
  // 生命周期函数
  created() {
    // 执行获取菜单方法
    this.getMenuByUserJobNumber()
    // 刷新页面时
    const crumbs = window.sessionStorage.getItem('crumbs')
    if (crumbs !== null && crumbs !== '') {
      this.crumbs = JSON.parse(crumbs)
    }
  },
  // 传值
  provide() {
    return {
      crumbs: () => this.crumbs
    }
  }
}
</script>

<style lang='less' scoped>
.el-header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  background-color: #032121;
  a {
    margin-left: 110px;
  }
  h3{
    color: #fff;
  }
}

.el-aside {
  overflow-y: auto;
  overflow-x: hidden;
}

.el-menu {
  text-align: left;
  border: none;
  height: 100%;
}

.el-main {
  background-color: #E9ECF3;
  padding: 20px;
}

.iconzhedie {
  margin: 0 auto;
  width: 10px;
  margin: 10px 0;
}

.el-container {
  height: 100%;
}

.el-main {
  text-align: left;
}

.layout {
  background-color: #fff;
  padding: 10px;
}

.item {
  margin-top: 10px;
  margin-right: 40px;
}

.dis_flex {
  display: flex;
}
</style>
