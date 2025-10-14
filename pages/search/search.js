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
    return new Promise((resolve) => {
      // 模拟搜索API
      setTimeout(() => {
        // 模拟商品数据
        const allProducts = [
          {
            id: 1,
            name: '经典牛肉汉堡',
            image: '/images/products/burger1.jpg',
            price: 25.8,
            originalPrice: 32.0,
            description: '新鲜牛肉饼配生菜番茄',
            sales: 1234,
            rating: 4.8
          },
          {
            id: 2,
            name: '意式玛格丽特披萨',
            image: '/images/products/pizza1.jpg',
            price: 38.0,
            originalPrice: 45.0,
            description: '经典意式口味，芝士浓郁',
            sales: 856,
            rating: 4.9
          },
          {
            id: 3,
            name: '香辣炸鸡翅',
            image: '/images/products/chicken1.jpg',
            price: 18.8,
            originalPrice: 22.0,
            description: '外酥内嫩，香辣可口',
            sales: 2156,
            rating: 4.7
          },
          {
            id: 4,
            name: '芒果气泡水',
            image: '/images/products/drink1.jpg',
            price: 12.0,
            originalPrice: 15.0,
            description: '清爽芒果味，解腻必备',
            sales: 3421,
            rating: 4.6
          },
          {
            id: 5,
            name: '双层芝士汉堡',
            image: '/images/products/burger2.jpg',
            price: 32.8,
            originalPrice: 38.0,
            description: '双倍芝士，双倍满足',
            sales: 1876,
            rating: 4.8
          },
          {
            id: 6,
            name: '夏威夷披萨',
            image: '/images/products/pizza2.jpg',
            price: 42.0,
            originalPrice: 48.0,
            description: '菠萝火腿，酸甜可口',
            sales: 1234,
            rating: 4.5
          }
        ]
        
        // 模糊搜索
        const results = allProducts.filter(product => 
          product.name.includes(keyword) || 
          product.description.includes(keyword)
        )
        
        resolve(results)
      }, 800)
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
  onAddToCart(e) {
    e.stopPropagation()
    const product = e.currentTarget.dataset.product
    app.addToCart(product)
    
    wx.showToast({
      title: '已加入购物车',
      icon: 'success',
      duration: 1000
    })
  },

  // 页面卸载时清除定时器
  onUnload() {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer)
    }
  }
})
