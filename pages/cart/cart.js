// pages/cart/cart.js
const app = getApp()
const { API } = require('../../utils/api.js')
const { userStorage } = require('../../utils/storage.js')

Page({
  data: {
    cartItems: [],
    recommendProducts: [],
    isAllSelected: false,
    selectedCount: 0,
    totalPrice: 0,
    loading: false,
    isLoggedIn: false
  },

  onLoad() {
    this.loadRecommendProducts()
  },

  onShow() {
    // 更新自定义 tabBar 选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      })
    }
    
    // 检查登录状态
    const isLoggedIn = userStorage.isLoggedIn()
    this.setData({ isLoggedIn })
    
    if (isLoggedIn) {
      this.loadCartData()
    } else {
      // 未登录，加载本地购物车
      this.loadLocalCart()
    }
  },

  onPullDownRefresh() {
    this.loadCartData()
    this.loadRecommendProducts()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  },

  // 加载购物车数据（从后端API）
  async loadCartData() {
    if (this.data.loading) return
    
    this.setData({ loading: true })
    
    try {
      const cartList = await API.cart.list()
      const cartItems = cartList.map(item => ({
        ...item,
        id: item.productId, // 确保有 id 字段
        name: item.productName,
        image: item.productImage,
        selected: item.selected !== false // 默认选中
      }))
      
      this.setData({ 
        cartItems,
        loading: false 
      })
      this.calculateTotal()
    } catch (error) {
      console.error('加载购物车失败:', error)
      this.setData({ loading: false })
      
      // 如果是未登录错误，显示提示
      if (error.message && error.message.includes('登录')) {
        this.setData({ isLoggedIn: false })
      }
    }
  },

  // 加载本地购物车（未登录时）
  loadLocalCart() {
    // 未登录时显示空购物车
    this.setData({ 
      cartItems: [],
      selectedCount: 0,
      totalPrice: 0,
      isAllSelected: false
    })
  },

  // 加载推荐商品
  async loadRecommendProducts() {
    try {
      const res = await API.product.list({ 
        page: 1, 
        pageSize: 4,
        sortBy: 'sales',
        sortOrder: 'desc'
      })
      this.setData({ 
        recommendProducts: res.items || [] 
      })
    } catch (error) {
      console.error('加载推荐商品失败:', error)
      // 推荐商品加载失败不影响主流程
    }
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

  // 更新购物车到后端
  async updateCartItem(cartId, data) {
    try {
      await API.cart.update(cartId, data)
    } catch (error) {
      console.error('更新购物车失败:', error)
      wx.showToast({
        title: '操作失败',
        icon: 'none'
      })
    }
  },

  // 更新本地购物车（已废弃）
  updateLocalCart() {
    // 不再使用本地购物车
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
    
    // 如果已登录，更新后端
    if (this.data.isLoggedIn) {
      cartItems.forEach(item => {
        this.updateCartItem(item.id, { selected: isAllSelected })
      })
    }
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
    
    // 如果已登录，更新后端
    if (this.data.isLoggedIn) {
      const item = cartItems.find(i => i.id === itemId)
      if (item) {
        this.updateCartItem(item.id, { selected: item.selected })
      }
    }
  },

  onCountMinus(e) {
    if (e && e.stopPropagation) {
      e.stopPropagation()
    }
    const itemId = e.currentTarget.dataset.id
    const cartItems = this.data.cartItems.map(item => {
      if (item.id === itemId && item.count > 1) {
        return { ...item, count: item.count - 1 }
      }
      return item
    })
    
    this.setData({ cartItems })
    this.calculateTotal()
    
    // 更新购物车
    if (this.data.isLoggedIn) {
      const item = cartItems.find(i => i.id === itemId)
      if (item) {
        this.updateCartItem(item.id, { count: item.count })
      }
    } else {
      this.updateLocalCart()
    }
  },

  onCountPlus(e) {
    if (e && e.stopPropagation) {
      e.stopPropagation()
    }
    const itemId = e.currentTarget.dataset.id
    const cartItems = this.data.cartItems.map(item => {
      if (item.id === itemId) {
        return { ...item, count: item.count + 1 }
      }
      return item
    })
    
    this.setData({ cartItems })
    this.calculateTotal()
    
    // 更新购物车
    if (this.data.isLoggedIn) {
      const item = cartItems.find(i => i.id === itemId)
      if (item) {
        this.updateCartItem(item.id, { count: item.count })
      }
    } else {
      this.updateLocalCart()
    }
  },

  onItemDelete(e) {
    if (e && e.stopPropagation) {
      e.stopPropagation()
    }
    const itemId = e.currentTarget.dataset.id
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个商品吗？',
      success: async (res) => {
        if (res.confirm) {
          if (this.data.isLoggedIn) {
            // 已登录，调用后端API删除
            try {
              await API.cart.remove(itemId)
              const cartItems = this.data.cartItems.filter(item => item.id !== itemId)
              this.setData({ cartItems })
              this.calculateTotal()
              
              wx.showToast({
                title: '已删除',
                icon: 'success',
                duration: 1000
              })
            } catch (error) {
              console.error('删除失败:', error)
              wx.showToast({
                title: '删除失败',
                icon: 'none'
              })
            }
          } else {
            // 未登录，删除本地购物车
            const cartItems = this.data.cartItems.filter(item => item.id !== itemId)
            this.setData({ cartItems })
            this.calculateTotal()
            this.updateLocalCart()
            
            wx.showToast({
              title: '已删除',
              icon: 'success',
              duration: 1000
            })
          }
        }
      }
    })
  },

  onClearCart() {
    if (this.data.cartItems.length === 0) return
    
    wx.showModal({
      title: '确认清空',
      content: '确定要清空购物车吗？',
      success: async (res) => {
        if (res.confirm) {
          if (this.data.isLoggedIn) {
            // 已登录，调用后端API清空
            try {
              await API.cart.clear()
              this.setData({
                cartItems: [],
                selectedCount: 0,
                totalPrice: 0,
                isAllSelected: false
              })
              
              wx.showToast({
                title: '已清空',
                icon: 'success',
                duration: 1000
              })
            } catch (error) {
              console.error('清空失败:', error)
              wx.showToast({
                title: '清空失败',
                icon: 'none'
              })
            }
          } else {
            // 未登录，无购物车可清空
            this.setData({
              cartItems: [],
              selectedCount: 0,
              totalPrice: 0,
              isAllSelected: false
            })
            
            wx.showToast({
              title: '已清空',
              icon: 'success',
              duration: 1000
            })
          }
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

  onLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },

  onCheckout() {
    if (!this.data.isLoggedIn) {
      wx.showModal({
        title: '提示',
        content: '请先登录后再结算',
        confirmText: '去登录',
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
