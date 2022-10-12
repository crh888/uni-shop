<template>
	<view class="goods-item">
	  <!-- 左侧盒子 -->
	  <view class="goods-item-left">
      <radio :checked="goods.goods_state" color="#C00000" v-if="showRadio" @click="radioClickHandler" />
	    <image :src="goods.goods_small_logo || defaultPic" class="goods-pic" @click="gotoDetail"></image>
	  </view>
	  <!-- 右侧 盒子-->
	  <view class="goods-item-right">
	    <!-- 商品的名字 -->
	    <view class="goods-name" @click="gotoDetail">{{goods.goods_name}}</view>
	    <!-- 商品价格-->
	    <view class="goods-info-box">
	      <view class="goods-price">￥{{goods.goods_price | toFixed}}</view>
        <uni-number-box :min="1" v-if="showRadio" @change="numChangeHandler" :value="goods.goods_count"></uni-number-box>
	    </view>
	  </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 默认图片地址
				defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
			};
		},
    props: {
      goods: {
        type: Object,
        default: {}
      },
      showRadio: {
        type: Boolean,
        default: false
      }
    },
    filters: {
      toFixed(num) {
        return Number(num).toFixed(2)
      }
    },
    methods: {
      radioClickHandler() {
        this.$emit('radio-change', {
          // 商品的id
          goods_id: this.goods.goods_id,
          // 最新的商品勾选状态
          goods_state: !this.goods.goods_state
        })
      },
      numChangeHandler(val) {
        this.$emit('num-change', {
          // 商品的id
          goods_id: this.goods.goods_id,
          // 最新的商品数量
          goods_count: +val
        })
      },
      gotoDetail() {
        this.$emit('click')
      }
    }
	}
</script>

<style lang="scss">
.goods-item {
  display: flex;
  padding: 10px 5px;
  border-bottom: 1px solid #efefef;
  .goods-item-left {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-right: 5px;
    .goods-pic {
      width: 100px;
      height: 100px;
      display: block;
    }
  }
  .goods-item-right {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    .goods-name {
      font-size: 13px;
    }
    .goods-info-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .goods-price {
        color: #c00000;
        font-size: 16px;
      }
    }
  }
}
</style>
