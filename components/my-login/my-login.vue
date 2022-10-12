<template>
	<view class="login-container">
		<uni-icons type="contact-filled" size="100" color="#afafaf"></uni-icons>
    <button type="primary" class="btn-login" open-type="getUserInfo" @click="getUserProfile">一键登录</button>
    <text class="tips-text">登录后尽享更多权益</text>
	</view>
</template>

<script>
  import { mapMutations, mapState } from 'vuex'
	export default {
		data() {
			return {
				
			};
		},
    computed: {
      ...mapState('m_user', ['redirectInfo'])
    },
    methods: {
      ...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),
      // 用户授权之后，获取用户的基本信息
        getUserProfile() {
          uni.getUserProfile({
            desc: '您的授权信息',
            success: res => {
              this.updateUserInfo(res.userInfo)
              this.getToken(res)
            }, // 允许的回调
            fail: res => { return uni.$showMsg('您取消了授权') } // 拒绝的回调
          })
        },
        async getToken(info) {
          // 获取 code 对应的值
          const [err, res] = await uni.login().catch(err => err)
          if(res.errMsg !== 'login:ok') return $showMsg('登录失败！')
          // 准备参数
          /* const query = {
            code: res.code,
            encryptedData: info.encryptedData,
            iv: info.iv,
            rawData: info.rawData,
            signature: info.signature
          } */
          // const {data: loginResult} = await uni.$http.post('/api/public/v1/users/wxlogin', query)
          this.updateToken('Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo') // 特殊原因 暂时写死
          this.navigateBack()
        },
        navigateBack() {
          if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
            uni.switchTab({
              url: this.redirectInfo.from,
              // 跳转之后，将 vuex 中的 redirectInfo 对象重置为 null
              complete: () => {
                this.updateRedirectInfo(null)
              }
            })
          }
        }
    }
	}
</script>

<style lang="scss">
.login-container {
  height: 750rpx;
  background-color: #F8F8F8;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  
  &::after {
    position: absolute;
    bottom: 0;
    left: 0;
    content: '';
    display: block;
    width: 100%;
    height: 40px;
    background-color: white;
    border-radius: 100%;
    transform: translateY(50%);
  }
  
  .btn-login {
    width: 90%;
    border-radius: 100px;
    margin: 15px 0;
    background-color: #C00000;
  }
  .tips-text {
    font-size: 12px;
    color: gray;
  }
}
</style>
