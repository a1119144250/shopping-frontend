// pages/product-detail/product-detail.js
const app = getApp()

Page({
  data: {
    product: {},
    isCollected: false,
    discountText: ''
  },

  onLoad(options) {
    const productId = options.id
    if (productId) {
      this.loadProductDetail(productId)
    }
  },

  onShow() {
    // 检查收藏状态
    this.checkCollectStatus()
  },

  // 加载商品详情
  async loadProductDetail(productId) {
    try {
      wx.showLoading({ title: '加载中...' })
      
      // 模拟API调用
      const product = await this.fetchProductDetail(productId)
      
      this.setData({ product })
      this.calculateDiscount(product)
      
      // 设置页面标题
      wx.setNavigationBarTitle({
        title: product.name || '商品详情'
      })
      
      wx.hideLoading()
    } catch (error) {
      console.error('加载商品详情失败:', error)
      wx.hideLoading()
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  },

  fetchProductDetail(productId) {
    const { API } = require('../../utils/api.js')
    return API.product.detail(productId).catch(error => {
      console.error('加载商品详情失败:', error)
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
      // 返回一个空对象，避免页面崩溃
      return {
        id: productId,
        name: '商品不存在',
        image: '',
        price: 0,
        description: ''
      }
    })
  },

  // 计算折扣
  calculateDiscount(product) {
    if (product.originalPrice && product.originalPrice > product.price) {
      const discount = Math.round((1 - product.price / product.originalPrice) * 10) / 10
      const discountPercent = Math.round(discount * 10)
      this.setData({
        discountText: `${discountPercent}折`
      })
    }
  },

  // 检查收藏状态
  checkCollectStatus() {
    // 从本地存储检查收藏状态
    const collectList = wx.getStorageSync('collectList') || []
    const isCollected = collectList.some(item => item.id === this.data.product.id)
    this.setData({ isCollected })
  },

  // 事件处理
  onImageTap(e) {
    const url = e.currentTarget.dataset.url
    const urls = this.data.product.images || [this.data.product.image]
    
    wx.previewImage({
      current: url,
      urls: urls
    })
  },

  onCollectTap() {
    const product = this.data.product
    const collectList = wx.getStorageSync('collectList') || []
    
    if (this.data.isCollected) {
      // 取消收藏
      const newList = collectList.filter(item => item.id !== product.id)
      wx.setStorageSync('collectList', newList)
      this.setData({ isCollected: false })
      wx.showToast({
        title: '已取消收藏',
        icon: 'success'
      })
    } else {
      // 添加收藏
      collectList.unshift({
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        collectTime: Date.now()
      })
      wx.setStorageSync('collectList', collectList)
      this.setData({ isCollected: true })
      wx.showToast({
        title: '收藏成功',
        icon: 'success'
      })
    }
  },

  async onAddToCart() {
    const product = this.data.product
    const { userStorage } = require('../../utils/storage.js')
    const { API } = require('../../utils/api.js')
    
    // 检查是否登录
    if (!userStorage.isLoggedIn()) {
      wx.showModal({
        title: '提示',
        content: '请先登录后再加入购物车',
        confirmText: '去登录',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login'
            })
          }
        }
      })
      return
    }
    
    // 已登录，调用后端API
    try {
      await API.cart.add({
        productId: product.id,
        count: 1
      })
      
      wx.showToast({
        title: '已加入购物车',
        icon: 'success',
        duration: 1500
      })
    } catch (error) {
      console.error('加入购物车失败:', error)
      wx.showToast({
        title: error.message || '加入购物车失败',
        icon: 'none'
      })
    }
  },

  onBuyNow() {
    const { userStorage } = require('../../utils/storage.js')
    
    // 检查是否登录
    if (!userStorage.isLoggedIn()) {
      wx.showModal({
        title: '提示',
        content: '请先登录后再购买',
        confirmText: '去登录',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login'
            })
          }
        }
      })
      return
    }
    
    const product = this.data.product
    
    // 创建临时订单数据
    const orderData = {
      items: [{
        ...product,
        count: 1,
        selected: true
      }],
      totalPrice: product.price,
      totalCount: 1
    }
    
    wx.setStorageSync('orderData', orderData)
    
    wx.navigateTo({
      url: '/pages/order/order'
    })
  },

  // 分享功能
  onShareAppMessage() {
    const product = this.data.product
    return {
      title: product.name,
      path: `/pages/product-detail/product-detail?id=${product.id}`,
      imageUrl: product.image
    }
  },

  onShareTimeline() {
    const product = this.data.product
    return {
      title: product.name,
      imageUrl: product.image
    }
  }
})
