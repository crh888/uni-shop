<template>
	<view class="my-settle-container">
		<!-- 全选 -->
    <label class="radio" @click="changeAllState">
      <radio :checked="isFullCheck" color="#C00000"/><text>全选</text>
    </label>
    <!-- 合计 -->
    <view class="amount-box">
      合计：<text  class="amount">￥{{ checkedGoodsAmount }}</text>
    </view>
    <!-- 结算按钮 -->
    <view class="btn-settle" @click="settlement">结算({{ checkedCount }})</view>
	</view>
</template>

<script>
  import { mapGetters, mapMutations, mapState } from 'vuex'
	export default {
		data() {
			return {
				seconds: 3,
        timer: null
			};
		},
    computed: {
      ...mapGetters('m_cart', ['checkedCount', 'total', 'checkedGoodsAmount']),
      ...mapGetters('m_user', ['addstr']),
      ...mapState('m_user', ['token']),
      ...mapState('m_cart', ['cart']),
      isFullCheck() {
        return this.checkedCount === this.total
      }
    },
    methods: {
      ...mapMutations('m_cart', ['updateAllGoodsState', 'removeBuyGoods']),
      ...mapMutations('m_user', ['updateRedirectInfo']),
      // 改变全选状态
      changeAllState() {
        this.updateAllGoodsState(!this.isFullCheck)
      },
      // 结算按钮
      settlement() {
        if (!this.checkedCount) return uni.$showMsg('请选择要结算的商品')
        if (!this.addstr) return uni.$showMsg('请选择收货地址')
        // if (!this.token) return uni.$showMsg('请先登录')
        if (!this.token) return this.delayNavigate()
        // 实现微信支付功能
        this.payOrder()
      },
      // 微信支付
      async payOrder() {
        // 组织订单信息
        const orderInfo = {
          // 写死订单总价为 0
          order_price: 0.01,
          consignee_addr: this.addstr,
          goods: this.cart.filter(x => x.goods_state).map(x => ({
            goods_id: x.goods_id,
            goods_number: x.goods_count,
            goods_price: x.goods_price
          }))
        }
        // 发起请求创建订单
        const {data: res} = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo)
        if (res.meta.status !== 200) return uni.$showMsg('创建订单失败！')
        // 得到服务器响应的订单号
         const orderNumber = res.message.order_number
         // 发起请求获取订单预支付信息
        /* const {data: res2} = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', {order_number: orderNumber})
         if (res2.meta.status !== 200) return uni.$showMsg('预付订单生成失败！')
         // 得到订单支付相关的必要参数
         const payInfo = res2.message.pay */
         // 假数据
         /* const pay = {
               "timeStamp": "1564730510",
               "nonceStr": "SReWbt3nEmpJo3tr",
               "package": "prepay_id=wx02152148991420a3b39a90811023326800",
               "signType": "MD5",
               "paySign": "3A6943C3B865FA2B2C825CDCB33C5304"
             }
         const payInfo = pay */
         /* // 3. 发起微信支付
            // 3.1 调用 uni.requestPayment() 发起微信支付
            const [err, succ] = await uni.requestPayment(payInfo)
            // 3.2 未完成支付
            if (err) return uni.$showMsg('订单未支付！')
            // 3.3 完成了支付，进一步查询支付的结果
            const { data: res3 } = await uni.$http.post('/api/public/v1/my/orders/chkOrder', { order_number: orderNumber })
            // 3.4 检测到订单未支付
            if (res3.meta.status !== 200) return uni.$showMsg('订单未支付！')
            // 3.5 检测到订单支付完成 */
            uni.showToast({
              title: '支付完成！',
              icon: 'success'
            })
            // 清除已购买的商品
            this.removeBuyGoods()
      },
      showTips(n) {
        uni.showToast({
          icon: 'none',
          mask: true,
          title: '请先登录后再结算！'+ n +'秒之后自动跳转到登录页',
          duration: 1500
        })
      },
      // 延迟导航到 my 页面
      delayNavigate() {
        // 将秒数重置为 3
        this.seconds = 3
        this.showTips(this.seconds)
        this.timer = setInterval(() => {
          this.seconds--
          if (this.seconds <= 0) {
            // 清除定时器
            clearInterval(this.timer)
            // 跳转到 my 页面
            uni.switchTab({
              url: '/pages/my/my',
              success: () => {
                this.updateRedirectInfo({
                  openType: 'switchTab',
                  from: '/pages/cart/cart'
                })
              }
            })
            return
          }
          this.showTips(this.seconds)
        }, 1000)
      }
    }
	}
</script>

<style lang="scss">
.my-settle-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  background-color: white;
  font-size: 14px;
  padding-left: 5px;
  
  .radio {
    display: flex;
    align-items: center;
  }
  .amount-box {
    .amount {
      color: #C00000;
      font-weight: 700;
    }
  }
  .btn-settle {
    background-color: #C00000;
    height: 50px;
    color: white;
    line-height: 50px;
    padding: 0 10px;
    min-width: 100px;
    text-align: center;
  }
}
</style>
