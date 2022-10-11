<template>
	<view>
    <!-- 自定义搜索组件 -->
    <my-search @click="gotoSearch"></my-search>
		<view class="scroll-view-container">
		  <!-- 左侧的滑动区域 -->
      <scroll-view scroll-y="true" class="left-scroll-view" :style="{height: wh + 'px'}">
        <block v-for="(item, i) in cateList" :key="i">
        <view :class="['left-view-item', i === active ? 'active': '']" @click="activeChange(i)">{{item.cat_name}}</view>
        </block>
      </scroll-view>
		  <!-- 右侧的滑动区域 -->
      <scroll-view scroll-y="true" :style="{height: wh + 'px'}" :scroll-top="scrollTop">
        <!-- 二级分类 -->
        <view class="cate-lv2" v-for="(item2, i2) in cateLevel2" :key="i2">
          <view class="cate-lv2-item">/ {{item2.cat_name}} /</view>
          <!-- 三级分类 -->
          <view class="cate-lv3-list">
            <view class="cate-lv3-item" v-for="(item3, i3) in item2.children" :key="i3" @click="goToGoodsList(item3)">
              <!-- 图片 -->
              <image :src="item3.cat_icon.replace('dev','web')" mode=""></image>
              <!-- 文本-->
              <text>{{ item3.cat_name }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
		</view>
	</view>
</template>

<script>
	import badgeMix from '@/mixins/tabbar-badges.js'
	export default {
	  mixins:[badgeMix],
		data() {
			return {
				// 当前设备可用的高度
        wh: 0,
        // 分类数据
        cateList: [],
        // 一级标题激活项
        active: 0,
        // 二级分类
        cateLevel2: [],
        // 滚动条位置
        scrollTop: 0
			};
		},
    onLoad() {
      // 获取当前设备可用视图高度
      const sysInfo = uni.getSystemInfoSync()
      console.log(sysInfo);
      this.wh = sysInfo.windowHeight - 50
      // 调用获取分类数据的方法
      this.getCateList()
      
    },
    methods: {
      // 定义获取跟类数据的方法
      async getCateList() {
       const {data: res} = await uni.$http.get('/api/public/v1/categories')
       if (res.meta.status !== 200) return uni.$showMsg()
       this.cateList = res.message
       // 为二级分类赋值
       this.cateLevel2 = res.message[0].children 
      },
   
      activeChange(i) {
         // 修改当前一级目录设置为激活项
        this.active = i
        // 重新为二级分类赋值
        this.cateLevel2 = this.cateList[i].children 
        // 重新赋值 scrollTop
        this.scrollTop = this.scrollTop === 0 ? 1 : 0
      },
      // 跳转到商品列表页面
      goToGoodsList(item) {
        uni.navigateTo({
          url: '/subpkg/goods_list/goods_list?cid=' + item.cat_id
        })
      },
      // my-search 自定义事件
      gotoSearch() {
        uni.navigateTo({
          url: '/subpkg/search/search'
        })
      }
    }
	}
</script>

<style lang="scss">
.scroll-view-container {
  display: flex;
  .left-scroll-view {
    width: 120px;
    .left-view-item {
      background-color: #F7F7F7;
      line-height: 60px;
      text-align: center;
      font-size: 12px;
      &.active {
        position: relative;
        background-color: #FFFFFF;
        &::before {
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          content: ' ';
          display: block;
          width: 3px;
          height: 30px;
          background-color: #C00000;
        }
      }
    }
  }
  
}
.cate-lv2-item {
  font-size: 12px;
  font-weight: 700;
  text-align: center;
  padding: 15px 0;
}
.cate-lv3-list {
  display: flex;
  flex-wrap: wrap;
  .cate-lv3-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 33.33%;
    margin-bottom: 10px;
    image {
      width: 60px;
      height: 60px;
    }
    text {
      font-size: 12px;
    }
  }
}

</style>
