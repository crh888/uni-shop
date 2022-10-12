<template>
	<view class="my-info-container">
		<!-- 头像和昵称区域 -->
    <view class="top-box">
      <image :src="userinfo.avatarUrl" class="avatar"></image>
      <view class="nickname">{{ userinfo.nickName }}</view>
    </view>
    <!-- 面版区域 -->
    <view class="panel-list">
      <!-- 第一个面板 -->
      <view class="panel">
        <view class="panel-body">
          <view class="panel-item">
            <text>8</text>
            <text>收藏的店铺</text>
          </view>
          <view class="panel-item">
            <text>14</text>
            <text>收藏的商品</text>
          </view>
          <view class="panel-item">
            <text>18</text>
            <text>关注的商品</text>
          </view>
          <view class="panel-item">
            <text>84</text>
            <text>足迹</text>
          </view>
        </view>
      </view>
      <!-- 第二个面板 -->
       <view class="panel">
         <view class="panel-title">我的订单</view>
         <view class="panel-body">
           <view class="panel-item">
             <image src="../../static/my-icons/icon1.png" class="icon"></image>
             <text>待付款</text>
           </view>
           <view class="panel-item">
             <image src="../../static/my-icons/icon2.png" class="icon"></image>
             <text>待收货</text>
           </view>
           <view class="panel-item">
             <image src="../../static/my-icons/icon3.png" class="icon"></image>
             <text>退款/退货</text>
           </view>
           <view class="panel-item">
             <image src="../../static/my-icons/icon4.png" class="icon"></image>
             <text>全部订单</text>
           </view>
         </view>
       </view>
      <!-- 第三个面板 -->
      <view class="panel">
        <view class="panel-list-item" @click="chooseAddress">
          <text>收货地址</text>
          <uni-icons type="arrowright" size="15"></uni-icons>
        </view>
        <view class="panel-list-item" @click="contact">
          <text>联系客服</text>
          <uni-icons type="arrowright" size="15"></uni-icons>
        </view>
        <view class="panel-list-item" @click="logout">
          <text>退出登录</text>
          <uni-icons type="arrowright" size="15"></uni-icons>
        </view>
      </view>
    </view>
	</view>
</template>

<script>
  import { mapState, mapMutations } from 'vuex'
	export default {
		data() {
			return {
				
			};
		},
    computed: {
      ...mapState('m_user', ['userinfo'])
    },
    methods: {
      ...mapMutations('m_user', ['updateAddress', 'updateUserInfo', 'updateToken']),
      // 退出登录的回调
      async logout() {
        const [err, succ] = await uni.showModal({
          title: '提示',
          content: '确认退出登录吗？'
        }).catch(err => err)
        if (succ && succ.confirm) {
          this.updateAddress({})
          this.updateUserInfo({})
          this.updateToken('')
        }
      },
      // 点击收货地址的回调
      async chooseAddress() {
        // 调用小程序提供的 chooseAddress() 方法，即可使用选择收货地址的功能
        //返回值是一个数组：第 1 项为错误对象；第 2 项为成功之后的收货地址对象
        const [err, succ] = await uni.chooseAddress().catch(err => err)
        // 用户成功的选择了收货地址
        if(!err && succ.errMsg === 'chooseAddress:ok') {
          // 为 data 里面的收货地址对象赋值
          this.updateAddress(succ)
        }
      },
      contact() {
        uni.$showMsg('此功能正在开发中...')
      }
    }
	}
</script>

<style lang="scss">
.my-info-container {
  height: 100%;
  background-color: #f4f4f4;
  .top-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 400rpx;
    background-color: #C00000;
    .avatar {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      border: 2px solid #fff;
      box-shadow: 0 1px 5px black;
    }
    .nickname {
      font-size: 16px;
      color: white;
      font-weight: 700;
      margin-top: 10px;
    }
  }
}
.panel-list {
  padding: 0 10px;
  position: relative;
  top: -10px;
  .panel {
    background-color: white;
    border-radius: 3px;
    margin-bottom: 8px;
    
    .panel-title {
      line-height: 45px;
      padding-left: 10px;
      font-size: 15px;
      border-bottom: 1px solid #f4f4f4;
    }
    
    .panel-body {
      display: flex;
      justify-content: space-around;
      .panel-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        padding: 10px 0;
        font-size: 13px;
        
        .icon {
          width: 35px;
          height: 35px;
        }
      }
    }
  }
}
.panel-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 45px;
  font-size: 15px;
  padding: 0 10px;
}
</style>
