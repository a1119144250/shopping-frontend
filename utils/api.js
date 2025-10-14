// utils/api.js
// API接口管理

const app = getApp()

// API基础配置
const API_CONFIG = {
  baseUrl: 'https://api.example.com', // 替换为实际的API地址
  timeout: 10000,
  header: {
    'Content-Type': 'application/json'
  }
}

/**
 * 封装wx.request
 * @param {Object} options 请求配置
 */
function request(options) {
  return new Promise((resolve, reject) => {
    // 显示加载提示
    if (options.showLoading !== false) {
      wx.showLoading({
        title: options.loadingText || '加载中...',
        mask: true
      })
    }

    // 构建完整URL
    const url = options.url.startsWith('http') 
      ? options.url 
      : `${API_CONFIG.baseUrl}${options.url}`

    // 获取用户token
    const token = wx.getStorageSync('token')
    const header = {
      ...API_CONFIG.header,
      ...options.header
    }
    
    if (token) {
      header.Authorization = `Bearer ${token}`
    }

    wx.request({
      url,
      method: options.method || 'GET',
      data: options.data || {},
      header,
      timeout: options.timeout || API_CONFIG.timeout,
      success: (res) => {
        wx.hideLoading()
        
        // 统一处理响应
        if (res.statusCode === 200) {
          const data = res.data
          
          // 根据业务逻辑处理响应
          if (data.code === 0 || data.success) {
            resolve(data.data || data)
          } else {
            // 业务错误
            const message = data.message || data.msg || '请求失败'
            wx.showToast({
              title: message,
              icon: 'none',
              duration: 2000
            })
            reject(new Error(message))
          }
        } else if (res.statusCode === 401) {
          // 未授权，清除token并跳转登录
          wx.removeStorageSync('token')
          wx.removeStorageSync('userInfo')
          wx.showToast({
            title: '请重新登录',
            icon: 'none'
          })
          reject(new Error('未授权'))
        } else {
          // HTTP错误
          const message = `请求失败 (${res.statusCode})`
          wx.showToast({
            title: message,
            icon: 'none'
          })
          reject(new Error(message))
        }
      },
      fail: (error) => {
        wx.hideLoading()
        console.error('API请求失败:', error)
        
        let message = '网络异常，请检查网络连接'
        if (error.errMsg) {
          if (error.errMsg.includes('timeout')) {
            message = '请求超时，请重试'
          } else if (error.errMsg.includes('fail')) {
            message = '网络连接失败'
          }
        }
        
        wx.showToast({
          title: message,
          icon: 'none',
          duration: 2000
        })
        reject(error)
      }
    })
  })
}

// GET请求
function get(url, data = {}, options = {}) {
  return request({
    url,
    method: 'GET',
    data,
    ...options
  })
}

// POST请求
function post(url, data = {}, options = {}) {
  return request({
    url,
    method: 'POST',
    data,
    ...options
  })
}

// PUT请求
function put(url, data = {}, options = {}) {
  return request({
    url,
    method: 'PUT',
    data,
    ...options
  })
}

// DELETE请求
function del(url, data = {}, options = {}) {
  return request({
    url,
    method: 'DELETE',
    data,
    ...options
  })
}

// 文件上传
function uploadFile(filePath, options = {}) {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token')
    const header = { ...options.header }
    
    if (token) {
      header.Authorization = `Bearer ${token}`
    }

    wx.uploadFile({
      url: `${API_CONFIG.baseUrl}${options.url || '/upload'}`,
      filePath,
      name: options.name || 'file',
      formData: options.formData || {},
      header,
      success: (res) => {
        try {
          const data = JSON.parse(res.data)
          if (data.code === 0 || data.success) {
            resolve(data.data || data)
          } else {
            reject(new Error(data.message || '上传失败'))
          }
        } catch (error) {
          reject(new Error('响应格式错误'))
        }
      },
      fail: reject
    })
  })
}

// API接口定义
const API = {
  // 用户相关
  user: {
    login: (data) => post('/user/login', data),
    register: (data) => post('/user/register', data),
    profile: () => get('/user/profile'),
    updateProfile: (data) => put('/user/profile', data),
    logout: () => post('/user/logout')
  },

  // 商品相关
  product: {
    list: (params) => get('/products', params),
    detail: (id) => get(`/products/${id}`),
    search: (keyword, params) => get('/products/search', { keyword, ...params }),
    categories: () => get('/categories'),
    categoryProducts: (categoryId, params) => get(`/categories/${categoryId}/products`, params)
  },

  // 购物车相关
  cart: {
    list: () => get('/cart'),
    add: (data) => post('/cart', data),
    update: (id, data) => put(`/cart/${id}`, data),
    remove: (id) => del(`/cart/${id}`),
    clear: () => del('/cart')
  },

  // 订单相关
  order: {
    create: (data) => post('/orders', data),
    list: (params) => get('/orders', params),
    detail: (id) => get(`/orders/${id}`),
    cancel: (id) => post(`/orders/${id}/cancel`),
    pay: (id, data) => post(`/orders/${id}/pay`, data),
    confirm: (id) => post(`/orders/${id}/confirm`)
  },

  // 地址相关
  address: {
    list: () => get('/addresses'),
    detail: (id) => get(`/addresses/${id}`),
    create: (data) => post('/addresses', data),
    update: (id, data) => put(`/addresses/${id}`, data),
    remove: (id) => del(`/addresses/${id}`),
    setDefault: (id) => post(`/addresses/${id}/default`)
  },

  // 优惠券相关
  coupon: {
    list: (params) => get('/coupons', params),
    available: (params) => get('/coupons/available', params),
    receive: (id) => post(`/coupons/${id}/receive`),
    use: (id, orderId) => post(`/coupons/${id}/use`, { orderId })
  },

  // 其他接口
  common: {
    banners: () => get('/banners'),
    upload: (filePath, options) => uploadFile(filePath, options),
    feedback: (data) => post('/feedback', data)
  }
}

module.exports = {
  request,
  get,
  post,
  put,
  del,
  uploadFile,
  API
}
