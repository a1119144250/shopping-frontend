// utils/storage.js
// 本地存储管理工具

/**
 * 存储数据到本地
 * @param {string} key 存储键名
 * @param {any} data 要存储的数据
 */
function setStorage(key, data) {
  try {
    wx.setStorageSync(key, data)
    return true
  } catch (error) {
    console.error('存储数据失败:', error)
    return false
  }
}

/**
 * 从本地获取数据
 * @param {string} key 存储键名
 * @param {any} defaultValue 默认值
 */
function getStorage(key, defaultValue = null) {
  try {
    const data = wx.getStorageSync(key)
    return data !== '' ? data : defaultValue
  } catch (error) {
    console.error('获取数据失败:', error)
    return defaultValue
  }
}

/**
 * 删除本地存储数据
 * @param {string} key 存储键名
 */
function removeStorage(key) {
  try {
    wx.removeStorageSync(key)
    return true
  } catch (error) {
    console.error('删除数据失败:', error)
    return false
  }
}

/**
 * 清空本地存储
 */
function clearStorage() {
  try {
    wx.clearStorageSync()
    return true
  } catch (error) {
    console.error('清空存储失败:', error)
    return false
  }
}

/**
 * 获取存储信息
 */
function getStorageInfo() {
  try {
    return wx.getStorageInfoSync()
  } catch (error) {
    console.error('获取存储信息失败:', error)
    return null
  }
}

/**
 * 异步存储数据
 * @param {string} key 存储键名
 * @param {any} data 要存储的数据
 */
function setStorageAsync(key, data) {
  return new Promise((resolve, reject) => {
    wx.setStorage({
      key,
      data,
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 异步获取数据
 * @param {string} key 存储键名
 */
function getStorageAsync(key) {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key,
      success: (res) => resolve(res.data),
      fail: reject
    })
  })
}

/**
 * 异步删除数据
 * @param {string} key 存储键名
 */
function removeStorageAsync(key) {
  return new Promise((resolve, reject) => {
    wx.removeStorage({
      key,
      success: resolve,
      fail: reject
    })
  })
}

// 常用存储键名常量
const STORAGE_KEYS = {
  USER_INFO: 'userInfo',
  TOKEN: 'token',
  TOKEN_EXPIRE_TIME: 'tokenExpireTime',
  CART: 'cart',
  SEARCH_HISTORY: 'searchHistory',
  BROWSE_HISTORY: 'browseHistory',
  ADDRESS_LIST: 'addressList',
  DEFAULT_ADDRESS: 'defaultAddress',
  SETTINGS: 'settings',
  THEME: 'theme',
  LANGUAGE: 'language'
}

// 用户相关存储
const userStorage = {
  // 设置用户信息
  setUserInfo(userInfo) {
    return setStorage(STORAGE_KEYS.USER_INFO, userInfo)
  },

  // 获取用户信息
  getUserInfo() {
    return getStorage(STORAGE_KEYS.USER_INFO, {})
  },

  // 清除用户信息
  clearUserInfo() {
    removeStorage(STORAGE_KEYS.USER_INFO)
    removeStorage(STORAGE_KEYS.TOKEN)
    removeStorage(STORAGE_KEYS.TOKEN_EXPIRE_TIME)
  },

  // 设置token
  setToken(token, expireDays = 7) {
    const success = setStorage(STORAGE_KEYS.TOKEN, token)
    if (success) {
      // 设置过期时间（默认7天）
      const expireTime = Date.now() + expireDays * 24 * 60 * 60 * 1000
      setStorage(STORAGE_KEYS.TOKEN_EXPIRE_TIME, expireTime)
    }
    return success
  },

  // 获取token
  getToken() {
    return getStorage(STORAGE_KEYS.TOKEN, '')
  },

  // 获取token过期时间
  getTokenExpireTime() {
    return getStorage(STORAGE_KEYS.TOKEN_EXPIRE_TIME, 0)
  },

  // 检查token是否有效
  isTokenValid() {
    const token = this.getToken()
    const expireTime = this.getTokenExpireTime()
    
    if (!token) {
      console.log('token 不存在')
      return false
    }

    if (!expireTime) {
      console.log('token 过期时间不存在')
      return false
    }

    const now = Date.now()
    if (now >= expireTime) {
      console.log('token 已过期')
      return false
    }

    // 计算剩余有效时间（小时）
    const remainingHours = Math.floor((expireTime - now) / (60 * 60 * 1000))
    console.log(`token 有效，剩余 ${remainingHours} 小时`)
    return true
  },

  // 检查是否已登录（包含token有效性检查）
  isLoggedIn() {
    const token = this.getToken()
    const userInfo = this.getUserInfo()
    const isValid = this.isTokenValid()
    
    if (!token || !userInfo.nickName) {
      return false
    }

    // 如果token已过期，清除登录数据
    if (!isValid) {
      console.log('token 已过期，清除登录数据')
      this.clearUserInfo()
      return false
    }

    return true
  },

  // 设置完整的登录信息（token + userInfo）
  setLoginInfo(token, userInfo, expireDays = 7) {
    this.setToken(token, expireDays)
    this.setUserInfo(userInfo)
    return true
  },

  // 获取token剩余有效时间（毫秒）
  getTokenRemainingTime() {
    const expireTime = this.getTokenExpireTime()
    if (!expireTime) {
      return 0
    }
    const remaining = expireTime - Date.now()
    return remaining > 0 ? remaining : 0
  },

  // 检查token是否即将过期（默认24小时内）
  isTokenExpiringSoon(hours = 24) {
    const remainingTime = this.getTokenRemainingTime()
    const thresholdTime = hours * 60 * 60 * 1000
    return remainingTime > 0 && remainingTime < thresholdTime
  }
}

// 购物车相关存储
const cartStorage = {
  // 设置购物车数据
  setCart(cartData) {
    return setStorage(STORAGE_KEYS.CART, cartData)
  },

  // 获取购物车数据
  getCart() {
    return getStorage(STORAGE_KEYS.CART, [])
  },

  // 清空购物车
  clearCart() {
    return setStorage(STORAGE_KEYS.CART, [])
  },

  // 添加商品到购物车
  addItem(product) {
    const cart = this.getCart()
    const existItem = cart.find(item => item.id === product.id)
    
    if (existItem) {
      existItem.count += product.count || 1
    } else {
      cart.push({
        ...product,
        count: product.count || 1,
        addTime: Date.now()
      })
    }
    
    return this.setCart(cart)
  },

  // 更新商品数量
  updateItemCount(productId, count) {
    const cart = this.getCart()
    const item = cart.find(item => item.id === productId)
    
    if (item) {
      if (count <= 0) {
        return this.removeItem(productId)
      } else {
        item.count = count
        return this.setCart(cart)
      }
    }
    return false
  },

  // 移除商品
  removeItem(productId) {
    const cart = this.getCart()
    const newCart = cart.filter(item => item.id !== productId)
    return this.setCart(newCart)
  },

  // 获取购物车统计信息
  getCartInfo() {
    const cart = this.getCart()
    const totalCount = cart.reduce((sum, item) => sum + item.count, 0)
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.count), 0)
    
    return {
      items: cart,
      totalCount,
      totalPrice: parseFloat(totalPrice.toFixed(2))
    }
  }
}

// 搜索历史存储
const searchStorage = {
  // 添加搜索记录
  addSearchHistory(keyword) {
    if (!keyword || !keyword.trim()) return
    
    const history = this.getSearchHistory()
    const trimmedKeyword = keyword.trim()
    
    // 移除已存在的记录
    const filteredHistory = history.filter(item => item !== trimmedKeyword)
    
    // 添加到开头
    filteredHistory.unshift(trimmedKeyword)
    
    // 限制数量
    const maxCount = 10
    if (filteredHistory.length > maxCount) {
      filteredHistory.splice(maxCount)
    }
    
    return setStorage(STORAGE_KEYS.SEARCH_HISTORY, filteredHistory)
  },

  // 获取搜索历史
  getSearchHistory() {
    return getStorage(STORAGE_KEYS.SEARCH_HISTORY, [])
  },

  // 清空搜索历史
  clearSearchHistory() {
    return setStorage(STORAGE_KEYS.SEARCH_HISTORY, [])
  },

  // 删除单个搜索记录
  removeSearchHistory(keyword) {
    const history = this.getSearchHistory()
    const newHistory = history.filter(item => item !== keyword)
    return setStorage(STORAGE_KEYS.SEARCH_HISTORY, newHistory)
  }
}

// 浏览历史存储
const browseStorage = {
  // 添加浏览记录
  addBrowseHistory(product) {
    if (!product || !product.id) return
    
    const history = this.getBrowseHistory()
    
    // 移除已存在的记录
    const filteredHistory = history.filter(item => item.id !== product.id)
    
    // 添加到开头
    filteredHistory.unshift({
      ...product,
      browseTime: Date.now()
    })
    
    // 限制数量
    const maxCount = 50
    if (filteredHistory.length > maxCount) {
      filteredHistory.splice(maxCount)
    }
    
    return setStorage(STORAGE_KEYS.BROWSE_HISTORY, filteredHistory)
  },

  // 获取浏览历史
  getBrowseHistory() {
    return getStorage(STORAGE_KEYS.BROWSE_HISTORY, [])
  },

  // 清空浏览历史
  clearBrowseHistory() {
    return setStorage(STORAGE_KEYS.BROWSE_HISTORY, [])
  },

  // 删除单个浏览记录
  removeBrowseHistory(productId) {
    const history = this.getBrowseHistory()
    const newHistory = history.filter(item => item.id !== productId)
    return setStorage(STORAGE_KEYS.BROWSE_HISTORY, newHistory)
  }
}

// 地址相关存储
const addressStorage = {
  // 设置地址列表
  setAddressList(addressList) {
    return setStorage(STORAGE_KEYS.ADDRESS_LIST, addressList)
  },

  // 获取地址列表
  getAddressList() {
    return getStorage(STORAGE_KEYS.ADDRESS_LIST, [])
  },

  // 设置默认地址
  setDefaultAddress(address) {
    return setStorage(STORAGE_KEYS.DEFAULT_ADDRESS, address)
  },

  // 获取默认地址
  getDefaultAddress() {
    return getStorage(STORAGE_KEYS.DEFAULT_ADDRESS, null)
  }
}

// 应用设置存储
const settingsStorage = {
  // 设置应用设置
  setSettings(settings) {
    return setStorage(STORAGE_KEYS.SETTINGS, settings)
  },

  // 获取应用设置
  getSettings() {
    return getStorage(STORAGE_KEYS.SETTINGS, {
      notifications: true,
      soundEnabled: true,
      vibrationEnabled: true,
      autoLocation: true
    })
  },

  // 更新单个设置
  updateSetting(key, value) {
    const settings = this.getSettings()
    settings[key] = value
    return this.setSettings(settings)
  }
}

module.exports = {
  setStorage,
  getStorage,
  removeStorage,
  clearStorage,
  getStorageInfo,
  setStorageAsync,
  getStorageAsync,
  removeStorageAsync,
  STORAGE_KEYS,
  userStorage,
  cartStorage,
  searchStorage,
  browseStorage,
  addressStorage,
  settingsStorage
}
