// pages/search/search.js
const app = getApp()
const { searchStorage } = require('../../utils/storage')

Page({
  data: {
    keyword: '',
    searchHistory: [],
    hotKeywords: [],
    searchResults: [],
    loading: false
  },

  onLoad(options) {
    // 如果有传入的关键词，直接搜索
    if (options.keyword) {
      this.setData({ keyword: options.keyword })
      this.performSearch(options.keyword)
    }
    
    this.loadSearchHistory()
    this.loadHotKeywords()
  },

  onShow() {
    // 每次显示页面时重新加载搜索历史
    this.loadSearchHistory()
  },

  // 加载搜索历史
  loadSearchHistory() {
    const searchHistory = searchStorage.getSearchHistory()
    this.setData({ searchHistory })
  },

  // 加载热门搜索
  loadHotKeywords() {
    // 模拟热门搜索数据
    const hotKeywords = [
      '汉堡', '披萨', '炸鸡', '奶茶', 
      '寿司', '火锅', '烧烤', '甜品'
    ]
    this.setData({ hotKeywords })
  },

  // 输入框输入事件
  onKeywordInput(e) {
    const keyword = e.detail.value
    this.setData({ keyword })
    
    // 实时搜索（防抖处理）
    if (this.searchTimer) {
      clearTimeout(this.searchTimer)
    }
    
    if (keyword.trim()) {
      this.searchTimer = setTimeout(() => {
        this.performSearch(keyword)
      }, 500) // 500ms 防抖
    } else {
      this.setData({ searchResults: [] })
    }
  },

  // 搜索按钮点击
  onSearch() {
    const keyword = this.data.keyword.trim()
    if (keyword) {
      this.performSearch(keyword)
    }
  },

  // 执行搜索
  async performSearch(keyword) {
    if (!keyword.trim()) return
    
    this.setData({ loading: true })
    
    try {
      // 添加到搜索历史
      searchStorage.addSearchHistory(keyword)
      this.loadSearchHistory()
      
      // 执行搜索
      const results = await this.searchProducts(keyword)
      
      this.setData({
        searchResults: results,
        loading: false
      })
    } catch (error) {
      console.error('搜索失败:', error)
      wx.showToast({
        title: '搜索失败',
        icon: 'none'
      })
      this.setData({ loading: false })
    }
  },

  // 搜索商品API
  searchProducts(keyword) {
    const { API } = require('../../utils/api.js')
    return API.product.search(keyword, { 
      page: 1, 
      pageSize: 50 
    }).then(res => {
      return res.items || []
    }).catch(error => {
      console.error('搜索商品失败:', error)
      return [] // 失败时返回空数组
    })
  },

  // 搜索历史点击
  onHistoryTap(e) {
    const keyword = e.currentTarget.dataset.keyword
    this.setData({ keyword })
    this.performSearch(keyword)
  },

  // 热门搜索点击
  onHotKeywordTap(e) {
    const keyword = e.currentTarget.dataset.keyword
    this.setData({ keyword })
    this.performSearch(keyword)
  },

  // 清空搜索历史
  onClearHistory() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空搜索历史吗？',
      success: (res) => {
        if (res.confirm) {
          searchStorage.clearSearchHistory()
          this.setData({ searchHistory: [] })
          wx.showToast({
            title: '已清空',
            icon: 'success'
          })
        }
      }
    })
  },

  // 商品点击
  onProductClick(e) {
    const product = e.currentTarget.dataset.product
    wx.navigateTo({
      url: `/pages/product-detail/product-detail?id=${product.id}`
    })
  },

  // 添加到购物车
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

  // 页面卸载时清除定时器
  onUnload() {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer)
    }
  }
})
