"use strict";

import Vue from 'vue';
import axios from "axios";

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
  // baseURL:'http://musicapi.leanapp.cn/'
  baseURL:'http://music.kele8.cn'
  // baseURL:'http://192.168.96.37:3000'
  // baseURL: process.env.baseURL || process.env.apiUrl || ""
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
};

//根据配置文件 创建axios对象
const _axios = axios.create(config);

//请求前置拦截方法，在发起请求之前 做一些工作
_axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    // config.token='xxxxxx';
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

//响应拦截，服务器返回数据之后，可以在这里处理
// Add a response interceptor
_axios.interceptors.response.use(
  function(response) {
    // Do something with response data
    // return response.result;
    return response;
  },
  function(error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

//写一个vue的插件的方法 install
Plugin.install = function(Vue) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      }
    },
    $axios: {
      get() {
        return _axios;
      }
    },
  });
};

//安装插件
Vue.use(Plugin)

export default Plugin;
