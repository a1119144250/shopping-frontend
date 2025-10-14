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
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            name: '汉堡',
            icon: '/images/category/burger.png',
            description: '美味汉堡，满足你的味蕾',
            count: 0
          },
          {
            id: 2,
            name: '披萨',
            icon: '/images/category/pizza.png',
            description: '正宗意式披萨',
            count: 0
          },
          {
            id: 3,
            name: '炸鸡',
            icon: '/images/category/chicken.png',
            description: '香脆炸鸡，外酥内嫩',
            count: 0
          },
          {
            id: 4,
            name: '饮品',
            icon: '/images/category/drink.png',
            description: '清爽饮品，解腻必备',
            count: 0
          },
          {
            id: 5,
            name: '甜品',
            icon: '/images/category/dessert.png',
            description: '精美甜品，甜蜜时光',
            count: 0
          },
          {
            id: 6,
            name: '小食',
            icon: '/images/category/snack.png',
            description: '休闲小食，随时享用',
            count: 0
          }
        ])
      }, 300)
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
      
      // 添加购物车数量信息
      const productsWithCart = products.map(product => ({
        ...product,
        cartCount: this.getCartCount(product.id)
      }))
      
      this.setData({
        products: refresh ? productsWithCart : [...this.data.products, ...productsWithCart],
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
    return new Promise((resolve) => {
      setTimeout(() => {
        // 模拟不同分类的商品数据
        const productsByCategory = {
          1: [ // 汉堡
            {
              id: 101,
              name: '经典牛肉汉堡',
              image: '/images/products/burger1.jpg',
              price: 25.8,
              originalPrice: 32.0,
              description: '新鲜牛肉饼配生菜番茄',
              sales: 1234,
              rating: 4.8
            },
            {
              id: 102,
              name: '双层芝士汉堡',
              image: '/images/products/burger2.jpg',
              price: 32.8,
              originalPrice: 38.0,
              description: '双倍芝士，双倍满足',
              sales: 876,
              rating: 4.7
            }
          ],
          2: [ // 披萨
            {
              id: 201,
              name: '意式玛格丽特披萨',
              image: '/images/products/pizza1.jpg',
              price: 38.0,
              originalPrice: 45.0,
              description: '经典意式口味，芝士浓郁',
              sales: 856,
              rating: 4.9
            },
            {
              id: 202,
              name: '夏威夷披萨',
              image: '/images/products/pizza2.jpg',
              price: 42.0,
              originalPrice: 48.0,
              description: '菠萝火腿，酸甜可口',
              sales: 654,
              rating: 4.5
            }
          ],
          3: [ // 炸鸡
            {
              id: 301,
              name: '香辣炸鸡翅',
              image: '/images/products/chicken1.jpg',
              price: 18.8,
              originalPrice: 22.0,
              description: '外酥内嫩，香辣可口',
              sales: 2156,
              rating: 4.7
            }
          ],
          4: [ // 饮品
            {
              id: 401,
              name: '芒果气泡水',
              image: '/images/products/drink1.jpg',
              price: 12.0,
              originalPrice: 15.0,
              description: '清爽芒果味，解腻必备',
              sales: 3421,
              rating: 4.6
            }
          ]
        }
        
        const products = productsByCategory[categoryId] || []
        resolve(page === 1 ? products : []) // 模拟分页
      }, 500)
    })
  },

  // 加载更多商品
  loadMoreProducts() {
    this.loadProducts(this.data.currentCategoryId, false)
  },

  // 获取商品在购物车中的数量
  getCartCount(productId) {
    const cartItem = app.globalData.cart.find(item => item.id === productId)
    return cartItem ? cartItem.count : 0
  },

  // 更新购物车信息
  updateCartInfo() {
    app.loadCartFromStorage()
    
    // 更新商品的购物车数量
    const products = this.data.products.map(product => ({
      ...product,
      cartCount: this.getCartCount(product.id)
    }))
    
    // 更新分类的购物车数量
    const categories = this.data.categories.map(category => ({
      ...category,
      count: this.getCategoryCartCount(category.id)
    }))
    
    this.setData({ products, categories })
  },

  // 获取分类在购物车中的商品数量
  getCategoryCartCount(categoryId) {
    // 这里需要根据实际的商品分类关系来计算
    // 暂时返回0，实际项目中需要实现
    return 0
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

  onAddToCart(e) {
    e.stopPropagation()
    const product = e.currentTarget.dataset.product
    app.addToCart(product)
    this.updateCartInfo()
    
    wx.showToast({
      title: '已加入购物车',
      icon: 'success',
      duration: 1000
    })
  },

  onCartPlus(e) {
    e.stopPropagation()
    const productId = e.currentTarget.dataset.id
    const product = this.data.products.find(p => p.id === productId)
    if (product) {
      app.addToCart({ ...product, count: 1 })
      this.updateCartInfo()
    }
  },

  onCartMinus(e) {
    e.stopPropagation()
    const productId = e.currentTarget.dataset.id
    const currentCount = this.getCartCount(productId)
    if (currentCount > 1) {
      app.updateCartItemCount(productId, currentCount - 1)
    } else {
      app.removeFromCart(productId)
    }
    this.updateCartInfo()
  },

  onCartTap() {
    wx.switchTab({
      url: '/pages/cart/cart'
    })
  }
})
