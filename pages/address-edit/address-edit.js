// pages/address-edit/address-edit.js
const { API } = require('../../utils/api.js')
const { userStorage } = require('../../utils/storage.js')

Page({
  data: {
    isEdit: false,
    addressId: null,
    formData: {
      name: '',
      phone: '',
      region: '',
      detail: '',
      tag: '家',
      isDefault: false
    },
    tagOptions: ['家', '公司', '学校', '其他']
  },

  onLoad(options) {
    // 检查登录状态
    if (!this.checkLogin()) {
      return
    }
    
    if (options.id) {
      this.setData({
        isEdit: true,
        addressId: options.id
      })
      this.loadAddressData(options.id)
      wx.setNavigationBarTitle({
        title: '编辑地址'
      })
    } else {
      wx.setNavigationBarTitle({
        title: '新增地址'
      })
    }
  },

  // 检查登录状态
  checkLogin() {
    const isLoggedIn = userStorage.isLoggedIn()
    
    if (!isLoggedIn) {
      wx.showModal({
        title: '提示',
        content: '请先登录后再操作收货地址',
        confirmText: '去登录',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            // 跳转到登录页面
            wx.redirectTo({
              url: '/pages/login/login'
            })
          } else {
            // 取消则返回上一页
            wx.navigateBack({
              delta: 1,
              fail: () => {
                // 如果没有上一页，跳转到首页
                wx.switchTab({
                  url: '/pages/index/index'
                })
              }
            })
          }
        }
      })
      return false
    }
    
    return true
  },

  // 加载地址数据
  loadAddressData(addressId) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    
    API.address.detail(addressId)
      .then(address => {
        wx.hideLoading()
        if (address) {
          this.setData({
            formData: {
              name: address.name || '',
              phone: address.phone || '',
              region: address.region || '',
              detail: address.detail || '',
              tag: address.tag || '家',
              isDefault: address.isDefault || false
            }
          })
        }
      })
      .catch(err => {
        console.error('加载地址详情失败:', err)
        wx.hideLoading()
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 1500)
      })
  },

  // 事件处理
  onInputChange(e) {
    const field = e.currentTarget.dataset.field
    const value = e.detail.value
    
    this.setData({
      [`formData.${field}`]: value
    })
  },

  onLocationTap() {
    // 这里可以集成地区选择器组件
    // 暂时使用简单的picker
    wx.showActionSheet({
      itemList: ['北京市 朝阳区', '上海市 浦东新区', '广州市 天河区', '深圳市 南山区'],
      success: (res) => {
        const regions = ['北京市 朝阳区', '上海市 浦东新区', '广州市 天河区', '深圳市 南山区']
        this.setData({
          'formData.region': regions[res.tapIndex]
        })
      }
    })
  },

  onTagSelect(e) {
    const tag = e.currentTarget.dataset.tag
    this.setData({
      'formData.tag': tag
    })
  },

  onSwitchChange(e) {
    this.setData({
      'formData.isDefault': e.detail.value
    })
  },

  // 表单验证
  validateForm() {
    const { name, phone, region, detail } = this.data.formData
    
    if (!name.trim()) {
      wx.showToast({
        title: '请输入收货人姓名',
        icon: 'none'
      })
      return false
    }
    
    if (!phone.trim()) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return false
    }
    
    // 简单的手机号验证
    const phoneReg = /^1[3-9]\d{9}$/
    if (!phoneReg.test(phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return false
    }
    
    if (!region) {
      wx.showToast({
        title: '请选择所在地区',
        icon: 'none'
      })
      return false
    }
    
    if (!detail.trim()) {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none'
      })
      return false
    }
    
    return true
  },

  // 提交表单
  onSubmit() {
    if (!this.validateForm()) {
      return
    }
    
    this.saveAddress()
  },

  // 保存地址
  saveAddress() {
    wx.showLoading({
      title: '保存中...',
      mask: true
    })
    
    const addressData = { ...this.data.formData }
    const isSetDefault = addressData.isDefault
    
    // 根据编辑/新增模式调用不同的 API
    const apiCall = this.data.isEdit 
      ? API.address.update(this.data.addressId, addressData)
      : API.address.create(addressData)
    
    apiCall
      .then(result => {
        // 如果设置为默认地址，需要调用 setDefault 接口
        // 注意：后端可能在创建/更新时已经处理了默认地址逻辑
        // 这里提供一个可选的显式设置默认地址的调用
        if (isSetDefault && result && result.id) {
          return API.address.setDefault(result.id)
            .then(() => result)
            .catch(err => {
              console.warn('设置默认地址失败:', err)
              return result // 即使设置默认失败，也返回结果
            })
        }
        return result
      })
      .then(() => {
        wx.hideLoading()
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          success: () => {
            setTimeout(() => {
              wx.navigateBack()
            }, 1500)
          }
        })
      })
      .catch(err => {
        console.error('保存地址失败:', err)
        wx.hideLoading()
        wx.showToast({
          title: '保存失败，请重试',
          icon: 'none'
        })
      })
  }
})
