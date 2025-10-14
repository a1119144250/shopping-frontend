// pages/address-edit/address-edit.js
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

  // 加载地址数据
  loadAddressData(addressId) {
    const addressList = wx.getStorageSync('addressList') || []
    const address = addressList.find(item => item.id === addressId)
    
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
    
    const addressData = {
      ...this.data.formData,
      id: this.data.addressId || this.generateId(),
      createTime: Date.now(),
      updateTime: Date.now()
    }
    
    this.saveAddress(addressData)
  },

  // 保存地址
  saveAddress(addressData) {
    let addressList = wx.getStorageSync('addressList') || []
    
    if (this.data.isEdit) {
      // 编辑模式
      const index = addressList.findIndex(item => item.id === this.data.addressId)
      if (index > -1) {
        addressList[index] = { ...addressList[index], ...addressData }
      }
    } else {
      // 新增模式
      addressList.unshift(addressData)
    }
    
    // 如果设置为默认地址，取消其他地址的默认状态
    if (addressData.isDefault) {
      addressList.forEach(item => {
        if (item.id !== addressData.id) {
          item.isDefault = false
        }
      })
      wx.setStorageSync('defaultAddress', addressData)
    }
    
    wx.setStorageSync('addressList', addressList)
    
    wx.showToast({
      title: '保存成功',
      icon: 'success',
      success: () => {
        setTimeout(() => {
          wx.navigateBack()
        }, 1500)
      }
    })
  },

  // 生成唯一ID
  generateId() {
    return 'addr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }
})
