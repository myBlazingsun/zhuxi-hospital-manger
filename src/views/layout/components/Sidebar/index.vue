<template>
  <scroll-bar>
    <div class="logo-img">
      <!-- <img :src="logo" alt=""> -->
    </div>
    <!-- <h3 class="h3-title">雅鹿后台管理系统</h3> -->
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      :default-openeds="openeds"
      :background-color="'#ffffff'"
      text-color="#1e1e1e"
      active-text-color="#409EFF"
    >
      <sidebar-item :routes="routes"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'
import { getSetting } from '@/api/set'

export default {
  components: { SidebarItem, ScrollBar },
  data(){
    return {
      logo: '',
      openeds: ['1']
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'routers'
    ]),
    routes() {
      // return this.$router.options.routes
      return this.routers
    },
    isCollapse() {
      return false
    },
    
  },
  created(){
    this.getSetting()
  },
  methods:{
    getSetting(){
      getSetting().then(res=> {
        if(res.data && Object.keys(res.data).length){
          this.logo = res.data.logo
        }
      })
    }
    
  }
}
</script>

<style>
.logo-img{
  padding-left: 10px;
  margin-bottom: 30px;
  height: 50px;
  line-height: 50px;
}
.logo-img img{
  display: inline-block;
  height: auto;
  width: 60%;
  vertical-align: middle;
}
.h3-title{
  color: #fff;
  font-size: 16px;
  text-align: center;
  margin: 15px 0 30px;
}
</style>
