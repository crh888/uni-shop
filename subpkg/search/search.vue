<template>
  <view>
	<view class="search-box">
		<uni-search-bar @confirm="" @input="input" :radius="100" cancelButton="none" />
	</view>
  <!-- 搜索建议列表 -->
  <view class="sugg-list" v-if="searchResults.length !== 0">
    <view class="sugg-list-item" v-for="(item, i) in searchResults" :key="i" @click="gotoDetail(item)">
      <view class="goods-name">{{ item.goods_name }}</view>
      <uni-icons type="arrowright"></uni-icons>
    </view>
  </view>
  <!-- 搜索历史 -->
  <view class="history-box" v-else>
    <view class="history-title">
      <text>搜索历史</text>
      <uni-icons type="trash" size="17" @click="clean"></uni-icons>
    </view>
    <view class="history-list">
      <uni-tag :text="item" v-for="(item, i) in histories" :key="i" @click="gotoGoodsList(item)"></uni-tag>
    </view>
  </view>
  </view>
</template>

<script>
	export default {
		data() {
			return {
				// 延时器
        timer: null,
        // 搜索关键词
        kw: '',
        // 搜索的结果
        searchResults: [],
        // 搜索历史
        historySearch: []
			};
		},
    methods: {
      // input 输入事件
      input(e) {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.kw = e.value
          // 获取搜索结果的方法
          this.getSearchList()
        }, 500)
      },
      async getSearchList() {
        // 判断关键词是否为空
        if (this.kw === '') {
          this.searchResults = []
          return
        }
       const {data: res} = await uni.$http.get('/api/public/v1/goods/qsearch', {query: this.kw})
       if (res.meta.status !== 200) return uni.$showMsg()
       this.searchResults = res.message
       // 将搜索关键词存入搜索历史
       this.saveSearchHistory()
      },
      // 跳转到详情页
      gotoDetail(item) {
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
        })
      },
      // 将搜索关键词存入搜索历史的 方法
      saveSearchHistory() {
        // this.historySearch.push(this.kw)
        // 过滤重复的关键词
        // 1. 将 Array 数组转化为 Set 对象
        const set = new Set(this.historySearch)
        // 2. 调用 Set 对象的 delete 方法，移除对应的元素
        set.delete(this.kw)
        // 3. 调用 Set 对象的 add 方法，向 Set 中添加元素
        set.add(this.kw)
        // 4. 将 Set 对象转化为 Array 数组
        this.historySearch = Array.from(set)
        
        // 对搜索历史进行永久化存储
        uni.setStorageSync('kw', JSON.stringify(this.historySearch))
      },
      // 清除搜索历史方法
      clean() {
        this.historySearch = []
        uni.setStorageSync('kw', '[]')
      },
      // 跳转到商品列表页面
      gotoGoodsList(kw) {
        uni.navigateTo({
          url: '/subpkg/goods_list/goods_list?query=' + kw
        })
      }
    },
    onLoad() {
      this.historySearch = JSON.parse(uni.getStorageSync('kw') || '[]')
    },
    computed: {
      histories() {
        // 因为 unshift 会改变 key 性能不好
        // 使用浅拷贝 + 反抓数组 reverse
        return [...this.historySearch].reverse()
      }
    }
	}
</script>

<style lang="scss">
.search-box {
  position: sticky;
  top: 0;
  z-index: 999;
}
.sugg-list {
  padding: 0 5px;
  .sugg-list-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    padding: 13px 0;
    border-bottom: 1px solid #efefef;
    .goods-name {
      // 文字不允许换行
      white-space: nowrap;
      // 溢出隐藏
      overflow: hidden;
      // 多余溢出的文字使用 ... 代替
      text-overflow: ellipsis;
      
    }
  }
}
.history-box {
  padding: 0 5px;
  .history-title {
    display: flex;
    justify-content: space-between;
    height: 40px;
    align-items: center;
    font-size: 13px;
    border-bottom: 1px solid #efefef;
  }
  .history-list {
    display: flex;
    flex-wrap: wrap;
    .uni-tag {
      margin: 5px 5px 0 0;
    }
  }
}
</style>
