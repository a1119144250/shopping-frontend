// pages/address/address.js
Page({
  data: {
    addressList: [],
    fromPage: '' // 来源页面
  },

  onLoad(options) {
    this.setData({
      fromPage: options.from || ''
    })
    this.loadAddressList()
  },

  onShow() {
    this.loadAddressList()
  },

  // 加载地址列表
  loadAddressList() {
    const addressList = wx.getStorageSync('addressList') || []
    this.setData({ addressList })
  },

  // 事件处理
  onAddressSelect(e) {
    const address = e.currentTarget.dataset.address
    
    // 如果是从订单页面来的，选择地址后返回
    if (this.data.fromPage === 'order') {
      wx.setStorageSync('selectedOrderAddress', address)
      wx.navigateBack()
    }
  },

  onAddAddress() {
    wx.navigateTo({
      url: '/pages/address-edit/address-edit'
    })
  },

  onEditAddress(e) {
    e.stopPropagation()
    const address = e.currentTarget.dataset.address
    wx.navigateTo({
      url: `/pages/address-edit/address-edit?id=${address.id}`
    })
  },

  onDeleteAddress(e) {
    e.stopPropagation()
    const addressId = e.currentTarget.dataset.id
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个地址吗？',
      success: (res) => {
        if (res.confirm) {
          this.deleteAddress(addressId)
        }
      }
    })
  },

  // 删除地址
  deleteAddress(addressId) {
    let addressList = this.data.addressList
    const deleteIndex = addressList.findIndex(item => item.id === addressId)
    
    if (deleteIndex > -1) {
      const deletedAddress = addressList[deleteIndex]
      addressList.splice(deleteIndex, 1)
      
      // 如果删除的是默认地址，设置第一个为默认
      if (deletedAddress.isDefault && addressList.length > 0) {
        addressList[0].isDefault = true
        wx.setStorageSync('defaultAddress', addressList[0])
      } else if (deletedAddress.isDefault) {
        wx.removeStorageSync('defaultAddress')
      }
      
      wx.setStorageSync('addressList', addressList)
      this.setData({ addressList })
      
      wx.showToast({
        title: '删除成功',
        icon: 'success'
      })
    }
  }
})
