<template>
  <div id="app">
      <TopNav></TopNav>
      <div :style="{paddingTop:$route.meta.showNav?'100px':''}"></div>
      <Play></Play>
    <keep-alive><router-view v-if="$route.meta.keepAlive"></router-view></keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <div :style="{paddingBottom:$root.musicStore.musicID?'60px':''}"></div>
  </div>
</template>
<script>
import TopNav from '@/components/TopNav'
import Play from '@/components/Play'
export default {
    name:'App',
    data(){
      return {
        // musicID:null
      }
    },
    created(){
    
    },
    components: {
      TopNav,
      Play
    },
    methods:{
      //  play(musicID){ //play事件执行函数 获取子组件
      //       this.musicID = musicID;
      // }
    }

}
</script>
<style>
::-webkit-scrollbar {
  display: none;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #fff;
  background-color: #1a1a1a;
  min-height: 120vh;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #f5d93b;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
