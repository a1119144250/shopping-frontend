// components/cart-float/cart-float.js
const app = getApp()

Component({
  properties: {
    show: {
      type: Boolean,
      value: true
    }
  },

  data: {
    cartCount: 0,
    totalPrice: '0.00',
    showRipple: false
  },

  lifetimes: {
    attached() {
      this.updateCartInfo()
    },

    ready() {
      // 监听全局购物车变化
      this.updateCartInfo()
    }
  },

  pageLifetimes: {
    show() {
      this.updateCartInfo()
    }
  },

  methods: {
    // 更新购物车信息
    updateCartInfo() {
      if (!app.globalData) return
      
      const cartCount = app.globalData.totalCount || 0
      const totalPrice = (app.globalData.totalPrice || 0).toFixed(2)
      
      this.setData({
        cartCount,
        totalPrice
      })
    },

    // 购物车点击事件
    onCartTap() {
      // 添加点击动画
      this.showClickAnimation()
      
      // 触发父组件事件
      this.triggerEvent('carttap')
      
      // 如果没有绑定事件，默认跳转到购物车页面
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/cart/cart'
        })
      }, 200)
    },

    // 显示点击动画
    showClickAnimation() {
      this.setData({ showRipple: true })
      
      setTimeout(() => {
        this.setData({ showRipple: false })
      }, 600)
    },

    // 添加商品时的动画效果
    addItemAnimation() {
      const animation = wx.createAnimation({
        duration: 300,
        timingFunction: 'ease-out'
      })
      
      // 放大缩小动画
      animation.scale(1.2).step({ duration: 150 })
      animation.scale(1).step({ duration: 150 })
      
      this.setData({
        animationData: animation.export()
      })
      
      // 显示波纹效果
      this.showClickAnimation()
    }
  }
})
