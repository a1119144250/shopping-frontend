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

  // ===== 以下本地购物车相关方法已废弃，现在使用后端购物车 =====
  // 保留这些方法是为了防止旧代码调用时报错
  
  addToCart(product) {
    console.warn('本地购物车已废弃，请使用后端购物车')
  },

  removeFromCart(productId) {
    console.warn('本地购物车已废弃，请使用后端购物车')
  },

  updateCartItemCount(productId, count) {
    console.warn('本地购物车已废弃，请使用后端购物车')
  },

  clearCart() {
    console.warn('本地购物车已废弃，请使用后端购物车')
  },

  updateCartInfo() {
    console.warn('本地购物车已废弃，请使用后端购物车')
  },

  saveCartToStorage() {
    console.warn('本地购物车已废弃，请使用后端购物车')
  },

  loadCartFromStorage() {
    console.warn('本地购物车已废弃，请使用后端购物车')
  }
})
