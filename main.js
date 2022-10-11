import Vue from 'vue'
import App from './App'
import store from '@/store/store.js'

// 导入网络请求的包
import { $http } from '@escook/request-miniprogram'

// 将$http挂载到 uni 上
uni.$http = $http

// 配置请求根路径
$http.baseUrl = 'https://api-ugo-web.itheima.net'

// 请求拦截器
$http.beforeRequest = function(options) {
	uni.showLoading({
		title: '数据加载中'
	})
}

// 相应拦截器
$http.afterRequest = function(options) {
	uni.hideLoading()
}

// 封装消息弹窗的方法
uni.$showMsg = function(title="数据请求失败！", duration=1500) {
  uni.showToast({
    title,
    duration,
    icon: 'none'
  })
}

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App,
  store
})
app.$mount()
