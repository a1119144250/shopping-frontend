// pages/category/category.js
const app = getApp()

Page({
  data: {
    categories: [],
    currentCategoryId: null,
    currentCategory: null,
    products: [],
    loading: false,
    page: 1,
    hasMore: true
  },

  onLoad(options) {
    const categoryId = options.id ? parseInt(options.id) : null
    this.loadCategories().then(() => {
      if (categoryId) {
        this.selectCategory(categoryId)
      } else if (this.data.categories.length > 0) {
        this.selectCategory(this.data.categories[0].id)
      }
    })
  },

  onShow() {
    // 更新自定义 tabBar 选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
    this.updateCartInfo()
  },

  onPullDownRefresh() {
    this.loadProducts(this.data.currentCategoryId, true).then(() => {
      wx.stopPullDownRefresh()
    })
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadMoreProducts()
    }
  },

  // 加载分类数据
  async loadCategories() {
    try {
      const categories = await this.fetchCategories()
      this.setData({ categories })
    } catch (error) {
      console.error('加载分类失败:', error)
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  },

  fetchCategories() {
    const { API } = require('../../utils/api.js')
    return API.product.categories().then(categories => {
      // 添加 count 字段
      return categories.map(cat => ({
        ...cat,
        count: 0
      }))
    }).catch(error => {
      console.error('加载分类失败:', error)
      return [] // 失败时返回空数组
    })
  },

  // 选择分类
  selectCategory(categoryId) {
    const category = this.data.categories.find(cat => cat.id === categoryId)
    if (category) {
      this.setData({
        currentCategoryId: categoryId,
        currentCategory: category,
        page: 1,
        hasMore: true
      })
      this.loadProducts(categoryId, true)
    }
  },

  // 加载商品数据
  async loadProducts(categoryId, refresh = false) {
    if (this.data.loading) return
    
    this.setData({ loading: true })
    
    try {
      const products = await this.fetchProducts(categoryId, refresh ? 1 : this.data.page)
      
      this.setData({
        products: refresh ? products : [...this.data.products, ...products],
        page: refresh ? 2 : this.data.page + 1,
        hasMore: products.length > 0,
        loading: false
      })
    } catch (error) {
      console.error('加载商品失败:', error)
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
      this.setData({ loading: false })
    }
  },

  fetchProducts(categoryId, page = 1) {
    const { API } = require('../../utils/api.js')
    return API.product.categoryProducts(categoryId, { 
      page, 
      pageSize: 20 
    }).then(res => {
      return res.items || []
    }).catch(error => {
      console.error('加载商品失败:', error)
      return [] // 失败时返回空数组
    })
  },

  // 加载更多商品
  loadMoreProducts() {
    this.loadProducts(this.data.currentCategoryId, false)
  },

  // 更新购物车信息（已废弃，现在使用后端购物车）
  updateCartInfo() {
    // 不再使用本地购物车
  },

  // 事件处理
  onSearchTap() {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },

  onCategorySelect(e) {
    const categoryId = e.currentTarget.dataset.id
    this.selectCategory(categoryId)
  },

  onProductClick(e) {
    const product = e.currentTarget.dataset.product
    wx.navigateTo({
      url: `/pages/product-detail/product-detail?id=${product.id}`
    })
  },

  async onAddToCart(e) {
    if (e && e.stopPropagation) {
      e.stopPropagation()
    }
    const product = e.currentTarget.dataset.product
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
      
      this.updateCartInfo()
      
      wx.showToast({
        title: '已加入购物车',
        icon: 'success',
        duration: 1000
      })
    } catch (error) {
      console.error('加入购物车失败:', error)
      wx.showToast({
        title: error.message || '加入购物车失败',
        icon: 'none'
      })
    }
  },

  async onCartPlus(e) {
    if (e && e.stopPropagation) {
      e.stopPropagation()
    }
    const productId = e.currentTarget.dataset.id
    const product = this.data.products.find(p => p.id === productId)
    const { userStorage } = require('../../utils/storage.js')
    const { API } = require('../../utils/api.js')
    
    if (product) {
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
        this.updateCartInfo()
      } catch (error) {
        console.error('加入购物车失败:', error)
        wx.showToast({
          title: error.message || '操作失败',
          icon: 'none'
        })
      }
    }
  },

  onCartMinus(e) {
    if (e && e.stopPropagation) {
      e.stopPropagation()
    }
    // 购物车减少功能需要在购物车页面操作
    wx.showToast({
      title: '请在购物车页面操作',
      icon: 'none'
    })
  },

  onCartTap() {
    // 防止重复点击
    if (this.cartTapLock) return
    this.cartTapLock = true
    
    wx.switchTab({
      url: '/pages/cart/cart',
      success: () => {
        setTimeout(() => {
          this.cartTapLock = false
        }, 1000)
      },
      fail: () => {
        this.cartTapLock = false
      }
    })
  }
})
