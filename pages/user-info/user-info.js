// pages/user-info/user-info.js
const app = getApp()

Page({
  data: {
    userInfo: {},
    tokenInfo: {
      remainingDays: 0,
      remainingHours: 0,
      remainingMinutes: 0
    }
  },

  onLoad(options) {
    this.loadUserInfo()
    this.calculateTokenRemaining()
  },

  onShow() {
    this.loadUserInfo()
    this.calculateTokenRemaining()
  },

  // 加载用户信息
  loadUserInfo() {
    const { userStorage } = require('../../utils/storage.js')
    const userInfo = userStorage.getUserInfo()
    
    console.log('加载用户信息:', userInfo)
    
    this.setData({ 
      userInfo: userInfo || {}
    })
  },

  // 计算token剩余时间
  calculateTokenRemaining() {
    const { userStorage } = require('../../utils/storage.js')
    const remainingTime = userStorage.getTokenRemainingTime()
    
    if (remainingTime > 0) {
      const remainingDays = Math.floor(remainingTime / (24 * 60 * 60 * 1000))
      const remainingHours = Math.floor((remainingTime % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
      const remainingMinutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000))
      
      this.setData({
        tokenInfo: {
          remainingDays,
          remainingHours,
          remainingMinutes
        }
      })
    }
  },

  // 编辑用户信息
  handleEdit() {
    wx.navigateTo({
      url: '/pages/user-edit/user-edit'
    })
  },

  // 复制信息
  handleCopy(e) {
    const text = e.currentTarget.dataset.text
    if (text) {
      wx.setClipboardData({
        data: text,
        success: () => {
          wx.showToast({
            title: '已复制',
            icon: 'success'
          })
        }
      })
    }
  },

  // 退出登录
  handleLogout() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      confirmColor: '#ff4444',
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
          
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          })
          
          // 延迟返回上一页
          setTimeout(() => {
            wx.navigateBack()
          }, 1500)
        }
      }
    })
  },

  // 分享
  onShareAppMessage() {
    return {
      title: '美食外卖 - 新鲜美味送到家',
      path: '/pages/index/index'
    }
  }
})

