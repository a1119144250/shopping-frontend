// pages/order/order.js
const app = getApp()

Page({
  data: {
    orderItems: [],
    selectedAddress: null,
    selectedCoupon: null,
    remark: '',
    deliveryFee: 5.0,
    goodsAmount: 0,
    totalAmount: 0,
    estimatedTime: '30-45分钟'
  },

  onLoad() {
    this.loadOrderData()
    this.loadDefaultAddress()
  },

  onShow() {
    // 从地址选择页面返回时重新加载地址
    this.loadSelectedAddress()
  },

  // 加载订单数据
  loadOrderData() {
    const orderData = wx.getStorageSync('orderData')
    if (orderData && orderData.items) {
      const goodsAmount = orderData.totalPrice || 0
      this.setData({
        orderItems: orderData.items,
        goodsAmount: goodsAmount.toFixed(2)
      })
      this.calculateTotal()
    } else {
      wx.showToast({
        title: '订单数据异常',
        icon: 'none'
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    }
  },

  // 加载默认地址
  loadDefaultAddress() {
    const defaultAddress = wx.getStorageSync('defaultAddress')
    if (defaultAddress) {
      this.setData({ selectedAddress: defaultAddress })
    }
  },

  // 加载选中的地址
  loadSelectedAddress() {
    const selectedAddress = wx.getStorageSync('selectedOrderAddress')
    if (selectedAddress) {
      this.setData({ selectedAddress })
      wx.removeStorageSync('selectedOrderAddress') // 使用后清除
    }
  },

  // 计算总金额
  calculateTotal() {
    const goodsAmount = parseFloat(this.data.goodsAmount)
    const deliveryFee = parseFloat(this.data.deliveryFee)
    const couponDiscount = this.data.selectedCoupon ? parseFloat(this.data.selectedCoupon.discount) : 0
    
    const totalAmount = Math.max(0, goodsAmount + deliveryFee - couponDiscount)
    
    this.setData({
      totalAmount: totalAmount.toFixed(2)
    })
  },

  // 事件处理
  onAddressTap() {
    wx.navigateTo({
      url: '/pages/address/address?from=order'
    })
  },

  onCouponTap() {
    wx.navigateTo({
      url: '/pages/coupon-select/coupon-select'
    })
  },

  onRemarkInput(e) {
    this.setData({
      remark: e.detail.value
    })
  },

  async onSubmitOrder() {
    if (!this.data.selectedAddress) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none'
      })
      return
    }

    try {
      wx.showLoading({ title: '提交中...' })
      
      // 构建订单数据
      const orderData = {
        items: this.data.orderItems,
        address: this.data.selectedAddress,
        coupon: this.data.selectedCoupon,
        remark: this.data.remark,
        deliveryFee: this.data.deliveryFee,
        goodsAmount: this.data.goodsAmount,
        totalAmount: this.data.totalAmount,
        createTime: Date.now()
      }
      
      // 提交订单
      const result = await this.submitOrder(orderData)
      
      wx.hideLoading()
      
      if (result.success) {
        // 清除购物车中已下单的商品
        this.clearOrderedItems()
        
        // 跳转到支付页面或订单详情
        wx.redirectTo({
          url: `/pages/order-detail/order-detail?id=${result.orderId}&status=pending`
        })
      } else {
        wx.showToast({
          title: result.message || '提交失败',
          icon: 'none'
        })
      }
    } catch (error) {
      wx.hideLoading()
      console.error('提交订单失败:', error)
      wx.showToast({
        title: '提交失败，请重试',
        icon: 'none'
      })
    }
  },

  // 提交订单API
  async submitOrder(orderData) {
    const { API } = require('../../utils/api.js')
    
    try {
      // 构建后端需要的订单数据格式
      const requestData = {
        items: orderData.items.map(item => ({
          productId: item.id,
          productName: item.name,
          productImage: item.image,
          price: item.price,
          count: item.count
        })),
        addressId: orderData.address.id,
        couponId: orderData.coupon ? orderData.coupon.id : undefined,
        remark: orderData.remark,
        deliveryFee: parseFloat(orderData.deliveryFee),
        goodsAmount: parseFloat(orderData.goodsAmount),
        totalAmount: parseFloat(orderData.totalAmount)
      }
      
      const result = await API.order.create(requestData)
      
      return {
        success: true,
        orderId: result.orderId || result.orderNo,
        message: '订单提交成功'
      }
    } catch (error) {
      console.error('提交订单失败:', error)
      return {
        success: false,
        message: error.message || '提交订单失败'
      }
    }
  },

  // 清除购物车中已下单的商品（已废弃，后端会自动处理）
  clearOrderedItems() {
    // 不再使用本地购物车，后端会自动清除已下单的商品
    // 清除临时订单数据
    wx.removeStorageSync('orderData')
  }
})
