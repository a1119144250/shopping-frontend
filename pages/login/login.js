// pages/login/login.js
const app = getApp()

Page({
  data: {
    username: '',
    password: '',
    showPassword: false,
    isLoading: false
  },

  onLoad(options) {
    // 检查是否已登录
    const { userStorage } = require('../../utils/storage.js')
    if (userStorage.isLoggedIn()) {
      wx.showToast({
        title: '您已登录',
        icon: 'success'
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    }
  },

  // 输入用户名
  onUsernameInput(e) {
    this.setData({
      username: e.detail.value
    })
  },

  // 输入密码
  onPasswordInput(e) {
    this.setData({
      password: e.detail.value
    })
  },

  // 切换密码显示/隐藏
  togglePasswordVisibility() {
    this.setData({
      showPassword: !this.data.showPassword
    })
  },

  // 登录
  async handleLogin() {
    const { username, password } = this.data

    // 表单验证
    if (!username || !username.trim()) {
      wx.showToast({
        title: '请输入用户名',
        icon: 'none'
      })
      return
    }

    if (!password || password.length < 6) {
      wx.showToast({
        title: '密码至少6位',
        icon: 'none'
      })
      return
    }

    // 防止重复提交
    if (this.data.isLoading) {
      return
    }

    this.setData({ isLoading: true })

    try {
      const { API } = require('../../utils/api.js')
      console.log('开始登录...')
      
      // 调用登录接口
      const result = await API.user.login({
        username: username.trim(),
        password: password,
        loginType: 'account'
      })

      console.log('登录成功:', result)
      console.log('返回的 token:', result.token)
      console.log('返回的 userInfo:', result.userInfo)

      // 检查 token 是否存在
      if (!result.token) {
        throw new Error('后端未返回 token')
      }

      // 保存登录信息
      const { userStorage } = require('../../utils/storage.js')
      userStorage.setLoginInfo(result.token, result.userInfo || result.user, 7)
      
      // 验证保存是否成功
      const savedToken = userStorage.getToken()
      const savedUserInfo = userStorage.getUserInfo()
      console.log('保存后的 token:', savedToken)
      console.log('保存后的 userInfo:', savedUserInfo)
      
      // 更新全局数据
      app.globalData.userInfo = result.userInfo || result.user

      wx.showToast({
        title: '登录成功',
        icon: 'success'
      })

      // 延迟返回上一页
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)

    } catch (error) {
      console.error('登录失败:', error)
      
      // 根据错误信息提示
      let errorMsg = '登录失败'
      if (error.message) {
        if (error.message.includes('不存在') || error.message.includes('用户名')) {
          errorMsg = '用户名不存在'
        } else if (error.message.includes('密码')) {
          errorMsg = '密码错误'
        } else {
          errorMsg = error.message
        }
      }
      
      wx.showModal({
        title: '登录失败',
        content: errorMsg,
        showCancel: errorMsg === '用户名不存在',
        confirmText: errorMsg === '用户名不存在' ? '去注册' : '确定',
        success: (res) => {
          if (res.confirm && errorMsg === '用户名不存在') {
            // 跳转到注册页面
            wx.navigateTo({
              url: '/pages/register/register'
            })
          }
        }
      })
    } finally {
      this.setData({ isLoading: false })
    }
  },

  // 跳转到注册页面
  goToRegister() {
    wx.navigateTo({
      url: '/pages/register/register'
    })
  },

  // 忘记密码（暂未实现）
  handleForgotPassword() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  }
})

