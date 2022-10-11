import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('m_cart', ['total'])
  },
  onShow() {
    this.setBadge()
  },
  watch: {
    total() {
      this.setBadge()
    }
  },
  methods: {
    setBadge() {
      // 设置tabbar 购物车的徽标
      uni.setTabBarBadge({
        index: 2, // 2代表是购物车
        text: this.total + '' // text 的值必须是字符串
      })
    }
  }
}