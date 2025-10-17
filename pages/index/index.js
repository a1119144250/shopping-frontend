// pages/index/index.js
const app = getApp()

Page({
  data: {
    banners: [],
    categories: [],
    recommendProducts: [],
    hotProducts: [],
    loading: false,
    page: 1,
    hasMore: true
  },

  onLoad() {
    this.loadData()
  },

  onShow() {
    // 更新自定义 tabBar 选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
    // 更新购物车数据
    this.updateCartInfo()
  },

  onPullDownRefresh() {
    this.setData({
      page: 1,
      hasMore: true
    })
    this.loadData().then(() => {
      wx.stopPullDownRefresh()
    })
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadMoreProducts()
    }
  },

  // 加载页面数据
  async loadData() {
    this.setData({ loading: true })
    
    try {
      // 并行加载数据
      const [banners, categories, recommendProducts, hotProducts] = await Promise.all([
        this.loadBanners(),
        this.loadCategories(),
        this.loadRecommendProducts(),
        this.loadHotProducts()
      ])

      this.setData({
        banners,
        categories,
        recommendProducts,
        hotProducts,
        loading: false
      })
    } catch (error) {
      console.error('加载数据失败:', error)
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
      this.setData({ loading: false })
    }
  },

  // 加载轮播图数据
  loadBanners() {
    const { API } = require('../../utils/api.js')
    return API.common.banners().catch(error => {
      console.error('加载轮播图失败:', error)
      return [] // 失败时返回空数组
    })
  },

  // 加载分类数据
  loadCategories() {
    const { API } = require('../../utils/api.js')
    return API.product.categories().then(categories => {
      // 只取前6个分类
      return categories.slice(0, 6)
    }).catch(error => {
      console.error('加载分类失败:', error)
      return [] // 失败时返回空数组
    })
  },

  // 加载推荐商品
  loadRecommendProducts() {
    const { API } = require('../../utils/api.js')
    return API.product.list({ 
      page: 1, 
      pageSize: 4,
      sortBy: 'rating',
      sortOrder: 'desc'
    }).then(res => {
      return res.items || []
    }).catch(error => {
      console.error('加载推荐商品失败:', error)
      return [] // 失败时返回空数组
    })
  },

  // 加载热销商品
  loadHotProducts() {
    const { API } = require('../../utils/api.js')
    return API.product.list({ 
      page: 1, 
      pageSize: 10,
      sortBy: 'sales',
      sortOrder: 'desc'
    }).then(res => {
      return res.items || []
    }).catch(error => {
      console.error('加载热销商品失败:', error)
      return [] // 失败时返回空数组
    })
  },

  // 加载更多商品
  async loadMoreProducts() {
    if (this.data.loading) return
    
    this.setData({ loading: true })
    
    try {
      const { API } = require('../../utils/api.js')
      const res = await API.product.list({ 
        page: this.data.page,
        pageSize: 10,
        sortBy: 'sales',
        sortOrder: 'desc'
      })
      
      const newProducts = res.items || []
      
      if (newProducts.length > 0) {
        this.setData({
          hotProducts: [...this.data.hotProducts, ...newProducts],
          page: this.data.page + 1
        })
      } else {
        this.setData({ hasMore: false })
      }
    } catch (error) {
      console.error('加载更多失败:', error)
    } finally {
      this.setData({ loading: false })
    }
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

  onBannerTap(e) {
    const url = e.currentTarget.dataset.url
    if (url) {
      wx.navigateTo({ url })
    }
  },

  onCategoryTap(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/category/category?id=${id}`
    })
  },

  onMoreTap() {
    wx.switchTab({
      url: '/pages/category/category'
    })
  },

  onProductClick(e) {
    const product = e.detail
    wx.navigateTo({
      url: `/pages/product-detail/product-detail?id=${product.id}`
    })
  },

  async onAddToCart(e) {
    const product = e.detail
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
