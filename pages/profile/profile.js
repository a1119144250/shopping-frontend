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
    },
    isLoggingIn: false // 登录中状态标识
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
    // 防止重复登录
    if (this.data.isLoggingIn || app.globalData.isLoggingIn) {
      console.log('正在登录中，请勿重复操作')
      wx.showToast({
        title: '正在登录中...',
        icon: 'loading'
      })
      return Promise.reject(new Error('正在登录中'))
    }

    // 检查是否已登录
    if (app.checkLoginStatus()) {
      console.log('已有有效登录状态，无需重复登录')
      const userInfo = wx.getStorageSync('userInfo')
      this.setData({ userInfo })
      return Promise.resolve(userInfo)
    }

    return new Promise((resolve, reject) => {
      console.log('调用 wx.getUserProfile...')
      wx.getUserProfile({
        desc: '用于完善用户资料',
        success: async (res) => {
          console.log('wx.getUserProfile 成功:', res.userInfo)
          
          // 设置登录中状态
          this.setData({ isLoggingIn: true })
          app.globalData.isLoggingIn = true

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
            
            // 保存token和用户信息到本地，并设置过期时间（7天）
            const { userStorage } = require('../../utils/storage.js')
            userStorage.setLoginInfo(result.token, result.userInfo, 7)
            app.globalData.userInfo = result.userInfo
            
            this.setData({ 
              userInfo: result.userInfo,
              isLoggingIn: false 
            })
            resolve(result.userInfo)
          } catch (error) {
            console.error('❌ 登录过程出错:', error)
            this.setData({ isLoggingIn: false })
            reject(error)
          } finally {
            app.globalData.isLoggingIn = false
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
    
    // 检查登录状态
    const { userStorage } = require('../../utils/storage.js')
    const isLoggedIn = userStorage.isLoggedIn()
    
    if (!isLoggedIn || !this.data.userInfo.nickName) {
      // 未登录，显示确认对话框
      wx.showModal({
        title: '登录确认',
        content: '您还未登录，是否现在登录以享受更多服务？',
        confirmText: '立即登录',
        cancelText: '暂不登录',
        success: (res) => {
          if (res.confirm) {
            // 跳转到登录页面
            wx.navigateTo({
              url: '/pages/login/login'
            })
          }
        }
      })
    } else {
      // 已登录，跳转到用户信息详情页
      wx.navigateTo({
        url: '/pages/user-info/user-info'
      })
    }
  },

  // 退出登录
  async handleLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            // 调用后端退出登录接口
            const { API } = require('../../utils/api.js')
            console.log('调用后端退出登录接口...')
            await API.user.logout()
            console.log('✅ 后端退出登录成功')
          } catch (error) {
            // 即使后端调用失败，也继续清除本地数据
            console.error('后端退出登录失败:', error)
            console.log('继续清除本地数据...')
          }
          
          // 清除本地存储
          const { userStorage } = require('../../utils/storage.js')
          userStorage.clearUserInfo()
          
          // 清除全局数据
          app.globalData.userInfo = null
          app.globalData.isLoggingIn = false
          
          // 刷新页面
          this.setData({
            userInfo: {},
            orderCounts: {
              pending: 0,
              confirmed: 0,
              preparing: 0,
              delivering: 0,
              completed: 0
            }
          })
          
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          })
        }
      }
    })
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
