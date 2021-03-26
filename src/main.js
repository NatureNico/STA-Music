import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import './plugins/myplugin'

Vue.config.productionTip = false
Vue.prototype.$sayhi = function(){
  console.log('$sayhi');
}
//播放音乐的相关数据存储在vue实例里面
//在整个i项目组件里面都可以通过this.$root获取vue实例
let musicStore = {
  musicID:null,
  musicList:[], //当前播放列表
  currentMusic:null, //记录当前播放音乐的信息 
}

new Vue({
  data:{
    musicStore
  },
  watch:{
   
  },
  router,
  render: h => h(App)
}).$mount('#app')
