// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 检查登录状态
    this.checkLoginStatus()
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
    version: '1.0.0',
    isLoggingIn: false // 登录状态标识，防止重复登录
  },

  // 检查登录状态
  checkLoginStatus() {
    const token = wx.getStorageSync('token')
    const tokenExpireTime = wx.getStorageSync('tokenExpireTime')
    const userInfo = wx.getStorageSync('userInfo')

    // 如果有 token 且未过期，则认为已登录
    if (token && tokenExpireTime && Date.now() < tokenExpireTime) {
      console.log('用户已登录，token 有效')
      this.globalData.userInfo = userInfo
      return true
    }

    // token 不存在或已过期
    if (token && tokenExpireTime && Date.now() >= tokenExpireTime) {
      console.log('token 已过期，清除本地数据')
      this.clearLoginData()
    }

    console.log('用户未登录')
    return false
  },

  // 清除登录数据
  clearLoginData() {
    wx.removeStorageSync('token')
    wx.removeStorageSync('tokenExpireTime')
    wx.removeStorageSync('userInfo')
    this.globalData.userInfo = null
  },

  // 静默登录（自动登录）
  async silentLogin() {
    // 防止重复登录
    if (this.globalData.isLoggingIn) {
      console.log('正在登录中，请勿重复操作')
      return Promise.reject(new Error('正在登录中'))
    }

    // 检查是否已登录
    if (this.checkLoginStatus()) {
      console.log('已有有效登录状态，无需重复登录')
      return Promise.resolve(this.globalData.userInfo)
    }

    this.globalData.isLoggingIn = true

    try {
      // 获取微信登录 code
      const loginRes = await new Promise((resolve, reject) => {
        wx.login({
          success: resolve,
          fail: reject
        })
      })

      console.log('静默登录获取到 code:', loginRes.code)
      
      // 这里可以调用后端接口进行静默登录
      // const { API } = require('./utils/api.js')
      // const result = await API.user.login({ code: loginRes.code })
      // wx.setStorageSync('token', result.token)
      // wx.setStorageSync('tokenExpireTime', Date.now() + 7 * 24 * 60 * 60 * 1000) // 7天有效期
      // this.globalData.userInfo = result.userInfo

      return loginRes.code
    } catch (error) {
      console.error('静默登录失败:', error)
      throw error
    } finally {
      this.globalData.isLoggingIn = false
    }
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
