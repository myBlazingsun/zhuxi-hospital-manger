<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <breadcrumb></breadcrumb>
    <el-dropdown class="avatar-container" trigger="click">
      <div class="right-box">
        <span class="avatar-name">{{name}}</span>
        <div class="avatar-wrapper">
          <!-- <img class="user-avatar" :src="avatar"> -->
          <i class="el-icon-caret-bottom"></i>
        </div>
      </div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <!-- <router-link class="inlineBlock" to="/">
          <el-dropdown-item>
            首页
          </el-dropdown-item>
        </router-link> -->
        <el-dropdown-item divided>
          <span @click="logout" style="display:block;">退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

let computed  = mapGetters([
  'sidebar',
  'avatar',
  'name'
])
console.log(computed);
export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...computed
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
    display: none;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .right-box{
      height: 100%;
      line-height: 50px;
      cursor: pointer;
      .avatar-name{
        height: 100%;
        line-height: 50px;
        vertical-align: middle;
        display: inline-block;
        margin-right: 8px;
      }
      .avatar-wrapper {
        display: inline-block;
        cursor: pointer;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          font-size: 12px;
        }
      }
    }
    
  }
}

</style>

