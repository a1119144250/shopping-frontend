// components/product-card/product-card.js
Component({
  properties: {
    product: {
      type: Object,
      value: {},
      observer: function(newVal) {
        this.calculateDiscount(newVal)
      }
    }
  },

  data: {
    discountText: ''
  },

  lifetimes: {
    attached() {
      this.calculateDiscount(this.data.product)
    }
  },

  methods: {
    // 计算折扣信息
    calculateDiscount(product) {
      if (product && product.originalPrice && product.originalPrice > product.price) {
        const discount = Math.round((1 - product.price / product.originalPrice) * 10) / 10
        const discountPercent = Math.round(discount * 10)
        this.setData({
          discountText: `${discountPercent}折`
        })
      }
    },

    // 商品点击事件
    onProductClick(e) {
      if (e && e.stopPropagation) {
        e.stopPropagation()
      }
      this.triggerEvent('productclick', this.data.product)
    },

    // 加入购物车事件
    onAddToCart(e) {
      if (e && e.stopPropagation) {
        e.stopPropagation()
      }
      
      // 检查登录状态
      const { userStorage } = require('../../utils/storage.js')
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
      
      // 添加点击动画效果
      const animation = wx.createAnimation({
        duration: 200,
        timingFunction: 'ease-in-out'
      })
      
      animation.scale(0.9).step()
      animation.scale(1).step()
      
      this.setData({
        animationData: animation.export()
      })
      
      // 触发父组件事件
      this.triggerEvent('addtocart', this.data.product)
      
      // 显示成功提示
      wx.showToast({
        title: '已加入购物车',
        icon: 'success',
        duration: 1000
      })
    }
  }
})
