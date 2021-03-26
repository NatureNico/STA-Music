import Vue from 'vue'
//定义构造函数 myPlugin
let myPlugin = function(){}

//插件
myPlugin.install = function(Vue){
    console.log('插件 myPlugin.install');
    Vue.hello = function(){
        console.log('Vue 全局hello函数');
    };
    Vue.prototype.$hello = function(){
        console.log('vue实例方法 $hello');
    }
};
//调用 MyPlugin的install
Vue.use(myPlugin);
export default myPlugin;