// pages/register/register.js
const app = getApp()

Page({
  data: {
    registerType: 'account', // account: 账号注册, phone: 手机号注册
    username: '',
    password: '',
    confirmPassword: '',
    phone: '',
    verifyCode: '',
    showPassword: false,
    showConfirmPassword: false,
    isLoading: false,
    canSendCode: true,
    countdown: 60
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

  // 切换注册方式
  switchRegisterType(e) {
    const type = e.currentTarget.dataset.type
    this.setData({
      registerType: type
    })
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

  // 输入确认密码
  onConfirmPasswordInput(e) {
    this.setData({
      confirmPassword: e.detail.value
    })
  },

  // 输入手机号
  onPhoneInput(e) {
    this.setData({
      phone: e.detail.value
    })
  },

  // 输入验证码
  onVerifyCodeInput(e) {
    this.setData({
      verifyCode: e.detail.value
    })
  },

  // 切换密码显示/隐藏
  togglePasswordVisibility() {
    this.setData({
      showPassword: !this.data.showPassword
    })
  },

  // 切换确认密码显示/隐藏
  toggleConfirmPasswordVisibility() {
    this.setData({
      showConfirmPassword: !this.data.showConfirmPassword
    })
  },

  // 发送验证码
  async sendVerifyCode() {
    const { phone } = this.data

    // 验证手机号
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return
    }

    if (!this.data.canSendCode) {
      return
    }

    try {
      // TODO: 调用发送验证码接口
      wx.showToast({
        title: '验证码已发送',
        icon: 'success'
      })

      // 开始倒计时
      this.setData({ canSendCode: false, countdown: 60 })
      this.startCountdown()

    } catch (error) {
      console.error('发送验证码失败:', error)
      wx.showToast({
        title: error.message || '发送失败',
        icon: 'none'
      })
    }
  },

  // 倒计时
  startCountdown() {
    const timer = setInterval(() => {
      if (this.data.countdown <= 1) {
        clearInterval(timer)
        this.setData({
          canSendCode: true,
          countdown: 60
        })
      } else {
        this.setData({
          countdown: this.data.countdown - 1
        })
      }
    }, 1000)
  },

  // 账号注册
  async handleAccountRegister() {
    const { username, password, confirmPassword } = this.data

    // 表单验证
    if (!username || !username.trim()) {
      wx.showToast({
        title: '请输入用户名',
        icon: 'none'
      })
      return
    }

    if (username.length < 3 || username.length > 20) {
      wx.showToast({
        title: '用户名长度3-20位',
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

    if (password !== confirmPassword) {
      wx.showToast({
        title: '两次密码不一致',
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
      console.log('开始注册...')
      
      // 调用注册接口
      const result = await API.user.register({
        username: username.trim(),
        password: password,
        registerType: 'account'
      })

      console.log('注册成功:', result)

      wx.showModal({
        title: '注册成功',
        content: '注册成功，是否立即登录？',
        confirmText: '立即登录',
        cancelText: '稍后',
        success: (res) => {
          if (res.confirm) {
            // 跳转到登录页面
            wx.redirectTo({
              url: '/pages/login/login'
            })
          } else {
            wx.navigateBack()
          }
        }
      })

    } catch (error) {
      console.error('注册失败:', error)
      
      let errorMsg = '注册失败'
      if (error.message) {
        if (error.message.includes('已存在')) {
          errorMsg = '用户名已存在'
        } else {
          errorMsg = error.message
        }
      }
      
      wx.showToast({
        title: errorMsg,
        icon: 'none'
      })
    } finally {
      this.setData({ isLoading: false })
    }
  },

  // 手机号注册
  async handlePhoneRegister() {
    const { phone, verifyCode, password, confirmPassword } = this.data

    // 表单验证
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return
    }

    if (!verifyCode || verifyCode.length !== 6) {
      wx.showToast({
        title: '请输入6位验证码',
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

    if (password !== confirmPassword) {
      wx.showToast({
        title: '两次密码不一致',
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
      // TODO: 实现手机号注册逻辑
      wx.showToast({
        title: '功能开发中',
        icon: 'none'
      })
    } catch (error) {
      console.error('注册失败:', error)
      wx.showToast({
        title: error.message || '注册失败',
        icon: 'none'
      })
    } finally {
      this.setData({ isLoading: false })
    }
  },

  // 注册
  handleRegister() {
    if (this.data.registerType === 'account') {
      this.handleAccountRegister()
    } else {
      this.handlePhoneRegister()
    }
  },

  // 返回登录
  goToLogin() {
    wx.navigateBack()
  }
})

