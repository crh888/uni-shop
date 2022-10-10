<template>
	<view>
		<view class="goods-list">
      <view v-for="(goods, i) in goodsList" :key="i" @click="gotoDetail(goods)">
        <my-goods :goods="goods"></my-goods>
      </view>
    </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
        // 请求参数对象
				queryObj: {
          query: '',
          cid: '',
          pagnum: 1,
          pagesize: 10
        },
        goodsList: [],
        total: 0,
       // 是否正在请求数据 (节流阀)
       isLoading: false
        
			};
		},
    onLoad(options) {
      this.queryObj.query = options.query || ''
      this.queryObj.cid = options.cid || ''
      this.getGoodsList()
    },
    methods: {
      // 获取商品列表数据的方法
      async getGoodsList(cb) {
        // 打开节流阀
        this.isLoading = true
        const {data: res} = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
        // 关闭节流阀
        this.isLoading = false
        // 自动关闭下拉刷新效果
        cb && cb()
        if (res.meta.status !== 200) return uni.$showMsg()
        this.goodsList = [...this.goodsList, ...res.message.goods]
        this.total = res.message.total
      },
      // 跳转到商品详情页
      gotoDetail(goods) {
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods.goods_id
        })
      }
    },
    onReachBottom() {
      // 判断是否还有下一页数据
      if(this.queryObj.pagesize * this.queryObj.pagnum >= this.total) return uni.$showMsg('数据加载完毕')
      // 判断是否有在发请求
      if (this.isLoading) return
      // 让页码值自增+1
      this.queryObj.pagnum++
      this.getGoodsList()
    },
    onPullDownRefresh() {
      // 重置关键数据
      this.queryObj.pagnum = 1,
      this.total = 0,
      this.isLoading = false,
      this.goodsList = [],
      // 重新发起请求
      this.getGoodsList(() => {uni.stopPullDownRefresh()})
    }
	}
</script>

<style lang="scss">

</style>
