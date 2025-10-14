// pages/profile/profile.js
const app = getApp()

Page({
  data: {
    userInfo: {},
    orderCounts: {
      pending: 0,
      confirmed: 0,
      preparing: 0,
      delivering: 0,
      completed: 0
    }
  },

  onLoad() {
    this.loadUserInfo()
  },

  onShow() {
    this.loadUserInfo()
    this.loadOrderCounts()
  },

  onPullDownRefresh() {
    this.loadUserInfo()
    this.loadOrderCounts()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  },

  // 加载用户信息
  loadUserInfo() {
    // 从本地存储获取用户信息
    const userInfo = wx.getStorageSync('userInfo') || {}
    this.setData({ userInfo })
  },

  // 加载订单数量统计
  async loadOrderCounts() {
    try {
      const counts = await this.fetchOrderCounts()
      this.setData({ orderCounts: counts })
    } catch (error) {
      console.error('加载订单统计失败:', error)
    }
  },

  fetchOrderCounts() {
    return new Promise((resolve) => {
      // 模拟API调用
      setTimeout(() => {
        resolve({
          pending: 1,
          confirmed: 0,
          preparing: 1,
          delivering: 0,
          completed: 5
        })
      }, 500)
    })
  },

  // 获取用户信息授权并登录
  getUserProfile() {
    return new Promise((resolve, reject) => {
      console.log('调用 wx.getUserProfile...')
      wx.getUserProfile({
        desc: '用于完善用户资料',
        success: async (res) => {
          console.log('wx.getUserProfile 成功:', res.userInfo)
          try {
            // 先获取微信登录code
            console.log('开始获取微信登录code...')
            const loginRes = await this.wxLogin()
            console.log('获取到微信code:', loginRes.code)
            
            // 准备发送给后端的数据
            const loginData = {
              code: loginRes.code,
              userInfo: res.userInfo
            }
            console.log('准备发送给后端的数据:', loginData)
            
            // 调用后端登录接口
            const { API } = require('../../utils/api.js')
            console.log('开始调用后端登录接口: POST /user/login')
            const result = await API.user.login(loginData)
            
            console.log('✅ 后端登录成功!')
            console.log('返回的token:', result.token)
            console.log('返回的用户信息:', result.userInfo)
            
            // 保存token和用户信息到本地
            wx.setStorageSync('token', result.token)
            wx.setStorageSync('userInfo', result.userInfo)
            app.globalData.userInfo = result.userInfo
            
            this.setData({ userInfo: result.userInfo })
            resolve(result.userInfo)
          } catch (error) {
            console.error('❌ 登录过程出错:', error)
            reject(error)
          }
        },
        fail: (error) => {
          console.error('❌ wx.getUserProfile 失败:', error)
          reject(error)
        }
      })
    })
  },

  // 微信登录获取code
  wxLogin() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: resolve,
        fail: reject
      })
    })
  },

  // 事件处理
  async onUserInfoTap() {
    console.log('=== 点击了用户头像区域 ===')
    console.log('当前用户信息:', this.data.userInfo)
    
    if (!this.data.userInfo.nickName) {
      try {
        console.log('开始获取用户授权...')
        await this.getUserProfile()
        wx.showToast({
          title: '登录成功',
          icon: 'success'
        })
      } catch (error) {
        console.error('获取用户信息失败:', error)
        wx.showToast({
          title: '登录失败',
          icon: 'none'
        })
      }
    } else {
      // 已登录，跳转到个人信息编辑页面
      wx.navigateTo({
        url: '/pages/user-info/user-info'
      })
    }
  },


  onAllOrdersTap() {
    if (!this.data.userInfo.nickName) {
      this.showLoginTip()
      return
    }
    
    wx.navigateTo({
      url: '/pages/order-list/order-list'
    })
  },

  onOrderStatusTap(e) {
    if (!this.data.userInfo.nickName) {
      this.showLoginTip()
      return
    }
    
    const status = e.currentTarget.dataset.status
    wx.navigateTo({
      url: `/pages/order-list/order-list?status=${status}`
    })
  },

  onMenuTap(e) {
    const type = e.currentTarget.dataset.type
    
    // 部分功能需要登录
    const needLoginTypes = ['coupon', 'favorite']
    if (needLoginTypes.includes(type) && !this.data.userInfo.nickName) {
      this.showLoginTip()
      return
    }
    
    switch (type) {
      case 'address':
        wx.navigateTo({
          url: '/pages/address/address'
        })
        break
      case 'coupon':
        wx.navigateTo({
          url: '/pages/coupon/coupon'
        })
        break
      case 'favorite':
        wx.navigateTo({
          url: '/pages/favorite/favorite'
        })
        break
      case 'feedback':
        wx.navigateTo({
          url: '/pages/feedback/feedback'
        })
        break
      case 'about':
        wx.navigateTo({
          url: '/pages/about/about'
        })
        break
      case 'settings':
        wx.navigateTo({
          url: '/pages/settings/settings'
        })
        break
      default:
        wx.showToast({
          title: '功能开发中',
          icon: 'none'
        })
    }
  },

  showLoginTip() {
    wx.showModal({
      title: '提示',
      content: '请先登录',
      confirmText: '去登录',
      success: (res) => {
        if (res.confirm) {
          this.onUserInfoTap()
        }
      }
    })
  },

  // 分享功能
  onShareAppMessage() {
    return {
      title: '美食外卖 - 新鲜美味送到家',
      path: '/pages/index/index',
      imageUrl: '/images/share-cover.jpg'
    }
  },

  onShareTimeline() {
    return {
      title: '美食外卖 - 新鲜美味送到家',
      imageUrl: '/images/share-cover.jpg'
    }
  }
})
