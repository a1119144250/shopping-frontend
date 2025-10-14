// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log('登录成功', res.code)
      }
    })
  },

  onShow() {
    // 小程序启动，或从后台进入前台显示时
    console.log('小程序显示')
  },

  onHide() {
    // 小程序从前台进入后台时
    console.log('小程序隐藏')
  },

  onError(msg) {
    console.log('小程序错误', msg)
  },

  // 全局数据
  globalData: {
    userInfo: null,
    cart: [], // 购物车数据
    totalPrice: 0, // 购物车总价
    totalCount: 0, // 购物车商品总数
    selectedAddress: null, // 选中的收货地址
    baseUrl: 'https://api.example.com', // API基础地址
    version: '1.0.0'
  },

  // 全局方法
  // 添加商品到购物车
  addToCart(product) {
    const cart = this.globalData.cart
    const existItem = cart.find(item => item.id === product.id)
    
    if (existItem) {
      existItem.count += product.count || 1
    } else {
      cart.push({
        ...product,
        count: product.count || 1
      })
    }
    
    this.updateCartInfo()
    this.saveCartToStorage()
  },

  // 从购物车移除商品
  removeFromCart(productId) {
    const cart = this.globalData.cart
    const index = cart.findIndex(item => item.id === productId)
    
    if (index > -1) {
      cart.splice(index, 1)
      this.updateCartInfo()
      this.saveCartToStorage()
    }
  },

  // 更新购物车商品数量
  updateCartItemCount(productId, count) {
    const cart = this.globalData.cart
    const item = cart.find(item => item.id === productId)
    
    if (item) {
      if (count <= 0) {
        this.removeFromCart(productId)
      } else {
        item.count = count
        this.updateCartInfo()
        this.saveCartToStorage()
      }
    }
  },

  // 清空购物车
  clearCart() {
    this.globalData.cart = []
    this.updateCartInfo()
    this.saveCartToStorage()
  },

  // 更新购物车统计信息
  updateCartInfo() {
    const cart = this.globalData.cart
    this.globalData.totalCount = cart.reduce((sum, item) => sum + item.count, 0)
    this.globalData.totalPrice = cart.reduce((sum, item) => sum + (item.price * item.count), 0)
  },

  // 保存购物车到本地存储
  saveCartToStorage() {
    wx.setStorageSync('cart', this.globalData.cart)
  },

  // 从本地存储加载购物车
  loadCartFromStorage() {
    const cart = wx.getStorageSync('cart') || []
    this.globalData.cart = cart
    this.updateCartInfo()
  }
})
