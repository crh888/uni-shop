export default {
  // 开启命名空间
  namespaced: true,
  state: () => ({
    // 购物车的数组，用来存储购物车中每个商品的信息对象
    // 每个商品的信息对象，都包含如下 6 个属性：
    // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
    cart: JSON.parse(uni.getStorageSync('cart') || '[]')
  }),
  mutations: {
    addToCart(state, goods) {
      // 根据提交的商品的Id，查询购物车中是否存在这件商品
      // 如果不存在，则 findResult 为 undefined；否则，为查找到的商品信息对象
      const findResult =  state.cart.find(x => x.goods_id === goods.goods_id)
      if(!findResult) {
        // 如果购物车中没有这件商品，则直接 push
        state.cart.push(goods)
      } else {
        // 如果购物车中有这件商品，则只更新数量即可
        findResult.goods_count++
      }
      // 本地化存储购物车数据
      this.commit('m_cart/saveToStorage')
    },
    // 本地化存储数据
    saveToStorage(state) {
      uni.setStorageSync('cart', JSON.stringify(state.cart))
    },
    // 更新购物车商品选中的状态
    updateGoodsState(state, goods) {
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
      if(findResult) {
        findResult.goods_state = goods.goods_state
        // 本地化存储购物车数据
        this.commit('m_cart/saveToStorage')
      }
    },
    updateGoodsCount(state, goods) {
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
      if(findResult) {
        findResult.goods_count = goods.goods_count
        // 本地化存储购物车数据
        this.commit('m_cart/saveToStorage') 
      }
    },
    removeGoodsById(state, goods_id) {
      state.cart = state.cart.filter(x => x.goods_id !== goods_id)
      // 本地化存储购物车数据
      this.commit('m_cart/saveToStorage') 
    },
    // 清空购物车所有商品
    removeBuyGoods(state) {
      state.cart = state.cart.filter(x => !x.goods_state)
      // 本地化存储购物车数据
      this.commit('m_cart/saveToStorage') 
    },
    updateAllGoodsState(state, newState) {
      state.cart.forEach(x => x.goods_state = newState)
      // 本地化存储购物车数据
      this.commit('m_cart/saveToStorage') 
    }
  },
  getters: {
    // 统计购物车中商品的总数量
    total(state) {
      let c = 0
      // 循环统计商品的数量，累加到变量 c 中
      state.cart.forEach(x => c+= x.goods_count)
      return c
    },
    // 勾选商品的数量
    checkedCount(state) {
      return state.cart.filter(x => x.goods_state).reduce((total, item) =>  total += item.goods_count , 0)
    },
    // 计算勾选商品总价格
    checkedGoodsAmount(state) {
      return state.cart.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count * item.goods_price, 0).toFixed(2)
    }
  }
}