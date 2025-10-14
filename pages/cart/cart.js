// pages/cart/cart.js
const app = getApp()

Page({
  data: {
    cartItems: [],
    recommendProducts: [],
    isAllSelected: false,
    selectedCount: 0,
    totalPrice: 0,
    loading: false
  },

  onLoad() {
    this.loadRecommendProducts()
  },

  onShow() {
    this.loadCartData()
  },

  onPullDownRefresh() {
    this.loadCartData()
    this.loadRecommendProducts()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  },

  // 加载购物车数据
  loadCartData() {
    app.loadCartFromStorage()
    const cartItems = app.globalData.cart.map(item => ({
      ...item,
      selected: true // 默认全选
    }))
    
    this.setData({ cartItems })
    this.calculateTotal()
  },

  // 加载推荐商品
  async loadRecommendProducts() {
    try {
      const products = await this.fetchRecommendProducts()
      this.setData({ recommendProducts: products })
    } catch (error) {
      console.error('加载推荐商品失败:', error)
    }
  },

  fetchRecommendProducts() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 501,
            name: '香辣鸡腿堡',
            image: '/images/products/burger3.jpg',
            price: 28.8
          },
          {
            id: 502,
            name: '奥尔良烤翅',
            image: '/images/products/chicken2.jpg',
            price: 22.0
          },
          {
            id: 503,
            name: '柠檬汽水',
            image: '/images/products/drink2.jpg',
            price: 8.0
          },
          {
            id: 504,
            name: '提拉米苏',
            image: '/images/products/dessert1.jpg',
            price: 35.0
          }
        ])
      }, 300)
    })
  },

  // 计算总价和选中数量
  calculateTotal() {
    const selectedItems = this.data.cartItems.filter(item => item.selected)
    const selectedCount = selectedItems.reduce((sum, item) => sum + item.count, 0)
    const totalPrice = selectedItems.reduce((sum, item) => sum + (item.price * item.count), 0)
    const isAllSelected = this.data.cartItems.length > 0 && selectedItems.length === this.data.cartItems.length

    this.setData({
      selectedCount,
      totalPrice: totalPrice.toFixed(2),
      isAllSelected
    })
  },

  // 更新购物车到全局数据
  updateGlobalCart() {
    const cart = this.data.cartItems.map(item => ({
      id: item.id,
      name: item.name,
      image: item.image,
      price: item.price,
      originalPrice: item.originalPrice,
      description: item.description,
      count: item.count
    }))
    
    app.globalData.cart = cart
    app.updateCartInfo()
    app.saveCartToStorage()
  },

  // 事件处理
  onSelectAll() {
    const isAllSelected = !this.data.isAllSelected
    const cartItems = this.data.cartItems.map(item => ({
      ...item,
      selected: isAllSelected
    }))
    
    this.setData({ cartItems })
    this.calculateTotal()
  },

  onItemSelect(e) {
    const itemId = e.currentTarget.dataset.id
    const cartItems = this.data.cartItems.map(item => {
      if (item.id === itemId) {
        return { ...item, selected: !item.selected }
      }
      return item
    })
    
    this.setData({ cartItems })
    this.calculateTotal()
  },

  onCountMinus(e) {
    e.stopPropagation()
    const itemId = e.currentTarget.dataset.id
    const cartItems = this.data.cartItems.map(item => {
      if (item.id === itemId && item.count > 1) {
        return { ...item, count: item.count - 1 }
      }
      return item
    })
    
    this.setData({ cartItems })
    this.calculateTotal()
    this.updateGlobalCart()
  },

  onCountPlus(e) {
    e.stopPropagation()
    const itemId = e.currentTarget.dataset.id
    const cartItems = this.data.cartItems.map(item => {
      if (item.id === itemId) {
        return { ...item, count: item.count + 1 }
      }
      return item
    })
    
    this.setData({ cartItems })
    this.calculateTotal()
    this.updateGlobalCart()
  },

  onItemDelete(e) {
    e.stopPropagation()
    const itemId = e.currentTarget.dataset.id
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个商品吗？',
      success: (res) => {
        if (res.confirm) {
          const cartItems = this.data.cartItems.filter(item => item.id !== itemId)
          this.setData({ cartItems })
          this.calculateTotal()
          this.updateGlobalCart()
          
          wx.showToast({
            title: '已删除',
            icon: 'success',
            duration: 1000
          })
        }
      }
    })
  },

  onClearCart() {
    if (this.data.cartItems.length === 0) return
    
    wx.showModal({
      title: '确认清空',
      content: '确定要清空购物车吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            cartItems: [],
            selectedCount: 0,
            totalPrice: 0,
            isAllSelected: false
          })
          app.clearCart()
          
          wx.showToast({
            title: '已清空',
            icon: 'success',
            duration: 1000
          })
        }
      }
    })
  },

  onItemClick(e) {
    const itemId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/product-detail/product-detail?id=${itemId}`
    })
  },

  onRecommendClick(e) {
    const product = e.currentTarget.dataset.product
    wx.navigateTo({
      url: `/pages/product-detail/product-detail?id=${product.id}`
    })
  },

  onGoShopping() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  onCheckout() {
    if (this.data.selectedCount === 0) {
      wx.showToast({
        title: '请选择商品',
        icon: 'none'
      })
      return
    }

    // 获取选中的商品
    const selectedItems = this.data.cartItems.filter(item => item.selected)
    
    // 将选中商品信息传递给订单页面
    const orderData = {
      items: selectedItems,
      totalPrice: this.data.totalPrice,
      totalCount: this.data.selectedCount
    }
    
    wx.setStorageSync('orderData', orderData)
    
    wx.navigateTo({
      url: '/pages/order/order'
    })
  }
})
