// pages/address/address.js
const { API } = require('../../utils/api.js')
const { userStorage } = require('../../utils/storage.js')

Page({
  data: {
    addressList: [],
    fromPage: '' // 来源页面
  },

  onLoad(options) {
    // 检查登录状态
    if (!this.checkLogin()) {
      return
    }
    
    this.setData({
      fromPage: options.from || ''
    })
    this.loadAddressList()
  },

  onShow() {
    // 检查登录状态
    if (!this.checkLogin()) {
      return
    }
    
    this.loadAddressList()
  },

  // 检查登录状态
  checkLogin() {
    const isLoggedIn = userStorage.isLoggedIn()
    
    if (!isLoggedIn) {
      wx.showModal({
        title: '提示',
        content: '请先登录后再查看收货地址',
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

  // 加载地址列表
  loadAddressList() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    
    API.address.list()
      .then(addressList => {
        this.setData({ 
          addressList: addressList || [] 
        })
        wx.hideLoading()
      })
      .catch(err => {
        console.error('加载地址列表失败:', err)
        wx.hideLoading()
        wx.showToast({
          title: '加载失败，请重试',
          icon: 'none'
        })
        // 加载失败时显示空列表
        this.setData({ addressList: [] })
      })
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
    const address = e.currentTarget.dataset.address
    wx.navigateTo({
      url: `/pages/address-edit/address-edit?id=${address.id}`
    })
  },

  onDeleteAddress(e) {
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
    wx.showLoading({
      title: '删除中...',
      mask: true
    })
    
    API.address.remove(addressId)
      .then(() => {
        wx.hideLoading()
        wx.showToast({
          title: '删除成功',
          icon: 'success'
        })
        // 重新加载地址列表
        this.loadAddressList()
      })
      .catch(err => {
        console.error('删除地址失败:', err)
        wx.hideLoading()
        wx.showToast({
          title: '删除失败，请重试',
          icon: 'none'
        })
      })
  }
})
