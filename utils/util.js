// utils/util.js
// 通用工具函数

/**
 * 格式化时间
 * @param {Date|string|number} date 时间
 * @param {string} format 格式 (YYYY-MM-DD HH:mm:ss)
 */
function formatTime(date, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) return ''
  
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const minute = String(d.getMinutes()).padStart(2, '0')
  const second = String(d.getSeconds()).padStart(2, '0')
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hour)
    .replace('mm', minute)
    .replace('ss', second)
}

/**
 * 获取相对时间
 * @param {Date|string|number} date 时间
 */
function getRelativeTime(date) {
  if (!date) return ''
  
  const now = new Date()
  const target = new Date(date)
  const diff = now.getTime() - target.getTime()
  
  if (diff < 0) return '未来时间'
  
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const week = 7 * day
  const month = 30 * day
  const year = 365 * day
  
  if (diff < minute) {
    return '刚刚'
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`
  } else if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`
  } else if (diff < week) {
    return `${Math.floor(diff / day)}天前`
  } else if (diff < month) {
    return `${Math.floor(diff / week)}周前`
  } else if (diff < year) {
    return `${Math.floor(diff / month)}个月前`
  } else {
    return `${Math.floor(diff / year)}年前`
  }
}

/**
 * 格式化价格
 * @param {number} price 价格
 * @param {number} decimals 小数位数
 */
function formatPrice(price, decimals = 2) {
  if (typeof price !== 'number' || isNaN(price)) return '0.00'
  return price.toFixed(decimals)
}

/**
 * 格式化数字
 * @param {number} num 数字
 */
function formatNumber(num) {
  if (typeof num !== 'number' || isNaN(num)) return '0'
  
  if (num < 1000) {
    return num.toString()
  } else if (num < 10000) {
    return (num / 1000).toFixed(1) + 'k'
  } else if (num < 100000000) {
    return (num / 10000).toFixed(1) + '万'
  } else {
    return (num / 100000000).toFixed(1) + '亿'
  }
}

/**
 * 防抖函数
 * @param {Function} func 要防抖的函数
 * @param {number} delay 延迟时间(ms)
 */
function debounce(func, delay = 300) {
  let timer = null
  return function(...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

/**
 * 节流函数
 * @param {Function} func 要节流的函数
 * @param {number} delay 延迟时间(ms)
 */
function throttle(func, delay = 300) {
  let timer = null
  return function(...args) {
    if (!timer) {
      timer = setTimeout(() => {
        func.apply(this, args)
        timer = null
      }, delay)
    }
  }
}

/**
 * 深拷贝
 * @param {any} obj 要拷贝的对象
 */
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (obj instanceof Array) return obj.map(item => deepClone(item))
  if (typeof obj === 'object') {
    const cloned = {}
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key])
      }
    }
    return cloned
  }
}

/**
 * 生成唯一ID
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * 验证手机号
 * @param {string} phone 手机号
 */
function validatePhone(phone) {
  const reg = /^1[3-9]\d{9}$/
  return reg.test(phone)
}

/**
 * 验证邮箱
 * @param {string} email 邮箱
 */
function validateEmail(email) {
  const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return reg.test(email)
}

/**
 * 获取图片信息
 * @param {string} src 图片路径
 */
function getImageInfo(src) {
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src,
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 保存图片到相册
 * @param {string} filePath 图片路径
 */
function saveImageToPhotosAlbum(filePath) {
  return new Promise((resolve, reject) => {
    wx.saveImageToPhotosAlbum({
      filePath,
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 选择图片
 * @param {Object} options 选项
 */
function chooseImage(options = {}) {
  return new Promise((resolve, reject) => {
    wx.chooseImage({
      count: options.count || 1,
      sizeType: options.sizeType || ['original', 'compressed'],
      sourceType: options.sourceType || ['album', 'camera'],
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 获取位置信息
 * @param {Object} options 选项
 */
function getLocation(options = {}) {
  return new Promise((resolve, reject) => {
    wx.getLocation({
      type: options.type || 'wgs84',
      altitude: options.altitude || false,
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 选择位置
 */
function chooseLocation() {
  return new Promise((resolve, reject) => {
    wx.chooseLocation({
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 设置剪贴板内容
 * @param {string} data 要复制的内容
 */
function setClipboardData(data) {
  return new Promise((resolve, reject) => {
    wx.setClipboardData({
      data,
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 拨打电话
 * @param {string} phoneNumber 电话号码
 */
function makePhoneCall(phoneNumber) {
  return new Promise((resolve, reject) => {
    wx.makePhoneCall({
      phoneNumber,
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 显示模态对话框
 * @param {Object} options 选项
 */
function showModal(options = {}) {
  return new Promise((resolve) => {
    wx.showModal({
      title: options.title || '提示',
      content: options.content || '',
      showCancel: options.showCancel !== false,
      cancelText: options.cancelText || '取消',
      confirmText: options.confirmText || '确定',
      success: (res) => {
        resolve(res.confirm)
      },
      fail: () => {
        resolve(false)
      }
    })
  })
}

/**
 * 显示操作菜单
 * @param {Array} itemList 菜单项列表
 */
function showActionSheet(itemList) {
  return new Promise((resolve, reject) => {
    wx.showActionSheet({
      itemList,
      success: (res) => {
        resolve(res.tapIndex)
      },
      fail: reject
    })
  })
}

/**
 * 页面跳转封装
 */
const navigation = {
  // 保留当前页面，跳转到应用内的某个页面
  navigateTo(url, params = {}) {
    const query = Object.keys(params).map(key => `${key}=${encodeURIComponent(params[key])}`).join('&')
    const fullUrl = query ? `${url}?${query}` : url
    
    return new Promise((resolve, reject) => {
      wx.navigateTo({
        url: fullUrl,
        success: resolve,
        fail: reject
      })
    })
  },

  // 关闭当前页面，跳转到应用内的某个页面
  redirectTo(url, params = {}) {
    const query = Object.keys(params).map(key => `${key}=${encodeURIComponent(params[key])}`).join('&')
    const fullUrl = query ? `${url}?${query}` : url
    
    return new Promise((resolve, reject) => {
      wx.redirectTo({
        url: fullUrl,
        success: resolve,
        fail: reject
      })
    })
  },

  // 跳转到 tabBar 页面
  switchTab(url) {
    return new Promise((resolve, reject) => {
      wx.switchTab({
        url,
        success: resolve,
        fail: reject
      })
    })
  },

  // 关闭所有页面，打开到应用内的某个页面
  reLaunch(url, params = {}) {
    const query = Object.keys(params).map(key => `${key}=${encodeURIComponent(params[key])}`).join('&')
    const fullUrl = query ? `${url}?${query}` : url
    
    return new Promise((resolve, reject) => {
      wx.reLaunch({
        url: fullUrl,
        success: resolve,
        fail: reject
      })
    })
  },

  // 关闭当前页面，返回上一页面或多级页面
  navigateBack(delta = 1) {
    return new Promise((resolve, reject) => {
      wx.navigateBack({
        delta,
        success: resolve,
        fail: reject
      })
    })
  }
}

module.exports = {
  formatTime,
  getRelativeTime,
  formatPrice,
  formatNumber,
  debounce,
  throttle,
  deepClone,
  generateId,
  validatePhone,
  validateEmail,
  getImageInfo,
  saveImageToPhotosAlbum,
  chooseImage,
  getLocation,
  chooseLocation,
  setClipboardData,
  makePhoneCall,
  showModal,
  showActionSheet,
  navigation
}
