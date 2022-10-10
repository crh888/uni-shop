<template>
	<view class="my-search-container" :style="{'background-color': bgcolor}">
		<view class="my-search-box" :style="{'border-radius': radius + 'px'}" @click="searchBoxHandler">
      <uni-icons type="search" size="18"></uni-icons>
      <text class="placeholder">搜索</text>
    </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
    props: {
      // 背景颜色
      bgcolor: {
        type: String,
        default: '#C00000'
      },
      radius: {
        type: Number,
        default: 18
      }
    },
    methods: {
      searchBoxHandler() {
        this.$emit('click')
      }
    }
	}
</script>

<style lang="scss">
.my-search-container {
  height: 50px;
  // background-color: #c00000;
  padding: 0 10px;
  display: flex;
  align-items: center;
  .my-search-box {
    background-color: #ffffff;
    // border-radius: 15px;
    width: 100%;
    height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    .placeholder {
      font-size: 15px;
      margin-left: 5px;
    }
  }
}
</style>
