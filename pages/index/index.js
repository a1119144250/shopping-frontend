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
    return new Promise((resolve) => {
      // 模拟数据，实际项目中应该调用API
      setTimeout(() => {
        resolve([
          {
            id: 1,
            image: '/images/banner1.jpg',
            url: '/pages/product-detail/product-detail?id=1'
          },
          {
            id: 2,
            image: '/images/banner2.jpg',
            url: '/pages/category/category?id=2'
          },
          {
            id: 3,
            image: '/images/banner3.jpg',
            url: '/pages/product-detail/product-detail?id=3'
          }
        ])
      }, 500)
    })
  },

  // 加载分类数据
  loadCategories() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, name: '汉堡', icon: '/images/category/burger.png' },
          { id: 2, name: '披萨', icon: '/images/category/pizza.png' },
          { id: 3, name: '炸鸡', icon: '/images/category/chicken.png' },
          { id: 4, name: '饮品', icon: '/images/category/drink.png' },
          { id: 5, name: '甜品', icon: '/images/category/dessert.png' },
          { id: 6, name: '小食', icon: '/images/category/snack.png' }
        ])
      }, 300)
    })
  },

  // 加载推荐商品
  loadRecommendProducts() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
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
          }
        ])
      }, 400)
    })
  },

  // 加载热销商品
  loadHotProducts() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
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
        ])
      }, 600)
    })
  },

  // 加载更多商品
  async loadMoreProducts() {
    if (this.data.loading) return
    
    this.setData({ loading: true })
    
    try {
      // 模拟加载更多数据
      const newProducts = await this.loadMoreHotProducts(this.data.page + 1)
      
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

  loadMoreHotProducts(page) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (page > 3) {
          resolve([]) // 模拟没有更多数据
        } else {
          resolve([
            {
              id: 6 + page,
              name: `商品 ${6 + page}`,
              image: '/images/products/default.jpg',
              price: 20 + page * 5,
              originalPrice: 25 + page * 5,
              description: '美味商品描述',
              sales: 100 * page,
              rating: 4.5
            }
          ])
        }
      }, 800)
    })
  },

  // 更新购物车信息
  updateCartInfo() {
    app.loadCartFromStorage()
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

  onAddToCart(e) {
    const product = e.detail
    app.addToCart(product)
    
    wx.showToast({
      title: '已加入购物车',
      icon: 'success',
      duration: 1500
    })
  },

  onCartTap() {
    wx.switchTab({
      url: '/pages/cart/cart'
    })
  }
})
