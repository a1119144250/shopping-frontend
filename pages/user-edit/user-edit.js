// pages/user-edit/user-edit.js
const app = getApp()

Page({
  data: {
    userInfo: {},
    formData: {
      nickName: '',
      phone: '',
      email: '',
      gender: 0,
      avatarUrl: ''
    },
    genderOptions: ['未知', '男', '女'],
    isSubmitting: false
  },

  onLoad(options) {
    this.loadUserInfo()
  },

  // 加载用户信息
  loadUserInfo() {
    const { userStorage } = require('../../utils/storage.js')
    const userInfo = userStorage.getUserInfo()
    
    console.log('加载用户信息:', userInfo)
    
    // 初始化表单数据
    this.setData({
      userInfo: userInfo || {},
      formData: {
        nickName: userInfo.nickName || '',
        phone: userInfo.phone || '',
        email: userInfo.email || '',
        gender: userInfo.gender || 0,
        avatarUrl: userInfo.avatarUrl || ''
      }
    })
  },

  // 输入框变化
  onNickNameInput(e) {
    this.setData({
      'formData.nickName': e.detail.value
    })
  },

  onPhoneInput(e) {
    this.setData({
      'formData.phone': e.detail.value
    })
  },

  onEmailInput(e) {
    this.setData({
      'formData.email': e.detail.value
    })
  },

  // 选择性别
  onGenderChange(e) {
    this.setData({
      'formData.gender': parseInt(e.detail.value)
    })
  },

  // 选择头像
  handleChooseAvatar() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],  // 压缩图片
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0]
        console.log('选择的图片:', tempFilePath)
        
        // 先显示预览
        this.setData({
          'formData.avatarUrl': tempFilePath
        })
        
        // 上传图片到服务器
        this.uploadAvatar(tempFilePath)
      },
      fail: (error) => {
        console.error('选择图片失败:', error)
        wx.showToast({
          title: '选择图片失败',
          icon: 'none'
        })
      }
    })
  },

  // 上传头像
  async uploadAvatar(filePath) {
    try {
      console.log('开始上传头像...')
      
      const { API } = require('../../utils/api.js')
      const result = await API.user.uploadAvatar(filePath)

      console.log('头像上传成功:', result)
      
      // 更新表单数据中的头像URL（使用服务器返回的URL）
      this.setData({
        'formData.avatarUrl': result.avatarUrl || result.url || result
      })

      wx.showToast({
        title: '头像上传成功',
        icon: 'success',
        duration: 2000
      })
    } catch (error) {
      console.error('头像上传失败:', error)
      
      // 清除预览的临时图片
      this.setData({
        'formData.avatarUrl': this.data.userInfo.avatarUrl || ''
      })
      
      wx.showToast({
        title: error.message || '上传失败，请重试',
        icon: 'none',
        duration: 2000
      })
    }
  },

  // 表单验证
  validateForm() {
    const { nickName, phone, email } = this.data.formData

    // 昵称验证（可选，如果填写则验证长度）
    if (nickName && (nickName.trim().length < 2 || nickName.trim().length > 20)) {
      wx.showToast({
        title: '昵称长度应在2-20个字符',
        icon: 'none'
      })
      return false
    }

    // 手机号验证（可选，如果填写则验证格式）
    if (phone && !/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return false
    }

    // 邮箱验证（可选，如果填写则验证格式）
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      wx.showToast({
        title: '请输入正确的邮箱地址',
        icon: 'none'
      })
      return false
    }

    return true
  },

  // 提交表单
  async handleSubmit() {
    if (!this.validateForm()) {
      return
    }

    if (this.data.isSubmitting) {
      return
    }

    // 检查是否有修改
    const { userInfo, formData } = this.data
    const hasChanges = 
      formData.nickName !== (userInfo.nickName || '') ||
      formData.phone !== (userInfo.phone || '') ||
      formData.email !== (userInfo.email || '') ||
      formData.gender !== (userInfo.gender || 0) ||
      formData.avatarUrl !== (userInfo.avatarUrl || '')

    if (!hasChanges) {
      wx.showToast({
        title: '没有修改内容',
        icon: 'none'
      })
      return
    }

    this.setData({ isSubmitting: true })

    try {
      const { API } = require('../../utils/api.js')
      const { userStorage } = require('../../utils/storage.js')
      
      // 检查 token 是否存在
      const token = userStorage.getToken()
      console.log('当前 token:', token)
      if (!token) {
        throw new Error('未登录或登录已过期，请重新登录')
      }
      
      // 准备要更新的数据（只发送有值的字段）
      const updateData = {}
      if (formData.nickName) updateData.nickName = formData.nickName.trim()
      if (formData.phone) updateData.phone = formData.phone
      if (formData.email) updateData.email = formData.email
      if (formData.avatarUrl) updateData.avatarUrl = formData.avatarUrl
      updateData.gender = formData.gender

      console.log('提交更新数据:', updateData)

      // 调用后端接口
      const result = await API.user.updateProfile(updateData)
      
      console.log('✅ 更新成功:', result)

      // 更新本地存储
      const updatedUserInfo = {
        ...userInfo,
        ...updateData
      }
      userStorage.setUserInfo(updatedUserInfo)
      
      // 更新全局数据
      app.globalData.userInfo = updatedUserInfo

      wx.showToast({
        title: '保存成功',
        icon: 'success'
      })

      // 延迟返回
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)

    } catch (error) {
      console.error('更新失败:', error)
      console.error('错误详情:', error.message)
      
      let errorMsg = '保存失败'
      let needRelogin = false
      
      if (error.message) {
        if (error.message.includes('未登录') || error.message.includes('过期')) {
          errorMsg = error.message
          needRelogin = true
        } else if (error.message.includes('手机号')) {
          errorMsg = error.message
        } else if (error.message.includes('邮箱')) {
          errorMsg = error.message
        } else if (error.message.includes('token')) {
          errorMsg = '登录已过期，请重新登录'
          needRelogin = true
        } else {
          errorMsg = error.message
        }
      }

      wx.showModal({
        title: '保存失败',
        content: errorMsg,
        showCancel: needRelogin,
        confirmText: needRelogin ? '去登录' : '确定',
        success: (res) => {
          if (res.confirm && needRelogin) {
            // 清除登录信息并跳转到登录页
            const { userStorage } = require('../../utils/storage.js')
            userStorage.clearUserInfo()
            wx.reLaunch({
              url: '/pages/login/login'
            })
          }
        }
      })
    } finally {
      this.setData({ isSubmitting: false })
    }
  },

  // 取消编辑
  handleCancel() {
    wx.navigateBack()
  }
})

