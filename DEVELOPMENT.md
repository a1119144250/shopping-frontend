# 开发指南

本文档为外卖小程序的开发指南，包含开发环境搭建、代码规范、调试技巧等内容。

## 开发环境

### 必需工具

- **微信开发者工具** 1.05.0+
- **Node.js** 14.0+（可选，用于 npm 包管理）
- **Git** 版本控制

### 开发者工具配置

1. 下载并安装微信开发者工具
2. 使用微信扫码登录
3. 创建小程序项目，选择现有项目目录
4. 配置 AppID（可使用测试号）

## 项目结构详解

```
shopping-frontend/
├── app.js                 # 小程序入口，全局逻辑
├── app.json              # 全局配置，页面路由、窗口样式等
├── app.wxss              # 全局样式，通用CSS类
├── sitemap.json          # 站点地图，SEO配置
├── project.config.json   # 项目配置，编译设置等
├── pages/                # 页面目录
│   ├── index/           # 首页 - 商品展示、分类导航
│   ├── category/        # 分类页 - 商品分类浏览
│   ├── cart/            # 购物车 - 商品管理、结算
│   ├── profile/         # 个人中心 - 用户信息、订单管理
│   ├── product-detail/  # 商品详情 - 商品详细信息
│   ├── order/           # 订单确认 - 下单流程
│   ├── order-detail/    # 订单详情 - 订单状态跟踪
│   ├── address/         # 地址管理 - 收货地址列表
│   └── address-edit/    # 地址编辑 - 新增/编辑地址
├── components/          # 自定义组件
│   ├── product-card/    # 商品卡片 - 商品展示组件
│   └── cart-float/      # 购物车悬浮按钮
├── utils/               # 工具类
│   ├── api.js          # API接口管理
│   ├── util.js         # 通用工具函数
│   └── storage.js      # 本地存储管理
└── images/             # 图片资源
```

## 开发流程

### 1. 新增页面

```bash
# 创建页面目录
mkdir pages/new-page

# 创建页面文件
touch pages/new-page/new-page.wxml  # 页面结构
touch pages/new-page/new-page.js    # 页面逻辑
touch pages/new-page/new-page.wxss  # 页面样式
touch pages/new-page/new-page.json  # 页面配置
```

在 `app.json` 中注册页面：

```json
{
  "pages": ["pages/new-page/new-page"]
}
```

### 2. 新增组件

```bash
# 创建组件目录
mkdir components/new-component

# 创建组件文件
touch components/new-component/new-component.wxml
touch components/new-component/new-component.js
touch components/new-component/new-component.wxss
touch components/new-component/new-component.json
```

在页面中使用组件：

```json
{
  "usingComponents": {
    "new-component": "/components/new-component/new-component"
  }
}
```

### 3. API 接口开发

在 `utils/api.js` 中添加新接口：

```javascript
const API = {
  // 新模块
  newModule: {
    list: (params) => get('/new-module', params),
    detail: (id) => get(`/new-module/${id}`),
    create: (data) => post('/new-module', data),
    update: (id, data) => put(`/new-module/${id}`, data),
    delete: (id) => del(`/new-module/${id}`),
  },
}
```

## 代码规范

### JavaScript 规范

```javascript
// 使用const/let，避免var
const app = getApp()
let currentPage = 1

// 函数命名使用驼峰式
function loadProductList() {
  // 函数体
}

// 事件处理函数以on开头
onProductClick(e) {
  // 事件处理
}

// 异步函数使用async/await
async loadData() {
  try {
    const result = await API.product.list()
    this.setData({ products: result })
  } catch (error) {
    console.error('加载失败:', error)
  }
}
```

### WXML 规范

```xml
<!-- 使用语义化的class名 -->
<view class="product-card">
  <image class="product-image" src="{{item.image}}" />
  <text class="product-name">{{item.name}}</text>
</view>

<!-- 条件渲染 -->
<view wx:if="{{products.length > 0}}">
  <!-- 有数据时显示 -->
</view>
<view wx:else>
  <!-- 无数据时显示 -->
</view>

<!-- 列表渲染 -->
<block wx:for="{{products}}" wx:key="id">
  <view class="product-item">{{item.name}}</view>
</block>
```

### WXSS 规范

```css
/* 使用BEM命名规范 */
.product-card {
  /* 块级元素 */
}

.product-card__image {
  /* 元素 */
}

.product-card--featured {
  /* 修饰符 */
}

/* 使用CSS变量 */
:root {
  --primary-color: #ff6b35;
  --text-color: #333;
}

.button {
  background-color: var(--primary-color);
  color: var(--text-color);
}
```

## 调试技巧

### 1. 控制台调试

```javascript
// 使用console.log输出调试信息
console.log('数据:', data)
console.error('错误:', error)
console.warn('警告:', warning)

// 使用debugger断点
function handleClick() {
  debugger // 在此处暂停
  // 处理逻辑
}
```

### 2. 网络调试

在微信开发者工具中：

1. 打开"调试器"面板
2. 切换到"Network"标签
3. 查看 API 请求和响应

### 3. 存储调试

```javascript
// 查看本地存储
console.log('用户信息:', wx.getStorageSync('userInfo'))
console.log('购物车:', wx.getStorageSync('cart'))

// 清空存储（调试时使用）
wx.clearStorageSync()
```

### 4. 真机调试

1. 点击工具栏"预览"按钮
2. 使用微信扫描二维码
3. 在手机上打开调试面板：连续点击右上角 10 次

## 性能优化

### 1. 图片优化

```javascript
// 使用lazy-load懒加载
<image lazy-load="{{true}}" src="{{item.image}}" />

// 合理设置mode属性
<image mode="aspectFill" src="{{item.image}}" />
```

### 2. 数据优化

```javascript
// 避免频繁setData
// 错误示例
for (let i = 0; i < 100; i++) {
  this.setData({ count: i })
}

// 正确示例
let count = 0
for (let i = 0; i < 100; i++) {
  count = i
}
this.setData({ count })
```

### 3. 代码分包

在 `app.json` 中配置分包：

```json
{
  "subpackages": [
    {
      "root": "packageA",
      "pages": ["pages/order/order", "pages/order-detail/order-detail"]
    }
  ]
}
```

## 常见问题

### 1. 页面跳转失败

```javascript
// 检查页面路径是否正确
wx.navigateTo({
  url: '/pages/product-detail/product-detail?id=123',
})

// 检查是否超过页面栈限制（最多10层）
// 使用redirectTo或reLaunch
wx.redirectTo({
  url: '/pages/index/index',
})
```

### 2. 数据不更新

```javascript
// 确保使用setData更新数据
this.setData({
  products: newProducts,
})

// 检查数据路径是否正确
this.setData({
  'user.name': newName, // 更新嵌套对象
})
```

### 3. 样式不生效

```css
/* 检查选择器优先级 */
.container .product-card {
  /* 更具体的选择器 */
}

/* 避免使用标签选择器 */
/* 错误 */
view {
}
/* 正确 */
.my-view {
}
```

### 4. 组件通信问题

```javascript
// 父组件向子组件传递数据
<my-component data="{{parentData}}" />

// 子组件向父组件传递事件
// 子组件
this.triggerEvent('myevent', { data: 'value' })

// 父组件
<my-component bind:myevent="handleEvent" />
```

## 发布流程

### 1. 代码检查

- 检查控制台是否有错误
- 测试核心功能是否正常
- 检查网络请求是否正确

### 2. 上传代码

1. 在微信开发者工具中点击"上传"
2. 填写版本号和项目备注
3. 确认上传

### 3. 提交审核

1. 登录小程序管理后台
2. 在"版本管理"中提交审核
3. 填写审核信息

### 4. 发布上线

审核通过后，在管理后台点击"发布"

## 最佳实践

### 1. 错误处理

```javascript
// 统一错误处理
async function apiCall() {
  try {
    const result = await API.getData()
    return result
  } catch (error) {
    console.error('API调用失败:', error)
    wx.showToast({
      title: '网络异常，请重试',
      icon: 'none',
    })
    throw error
  }
}
```

### 2. 用户体验

```javascript
// 显示加载状态
wx.showLoading({ title: '加载中...' })
try {
  await loadData()
} finally {
  wx.hideLoading()
}

// 防抖处理
const debounceSearch = debounce(function (keyword) {
  this.search(keyword)
}, 300)
```

### 3. 数据管理

```javascript
// 使用全局数据管理
const app = getApp()
app.globalData.userInfo = userInfo

// 本地存储管理
const { userStorage } = require('./utils/storage')
userStorage.setUserInfo(userInfo)
```

## 扩展功能

### 1. 添加新页面

参考现有页面结构，创建新的页面文件并在 `app.json` 中注册。

### 2. 集成第三方服务

- 地图服务：腾讯地图、百度地图
- 支付服务：微信支付
- 统计服务：微信小程序数据助手

### 3. 性能监控

```javascript
// 页面性能监控
Page({
  onLoad() {
    const startTime = Date.now()
    // 页面逻辑
    const endTime = Date.now()
    console.log('页面加载耗时:', endTime - startTime)
  },
})
```

## 参考资源

- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [小程序设计指南](https://developers.weixin.qq.com/miniprogram/design/)
- [小程序开发最佳实践](https://developers.weixin.qq.com/miniprogram/dev/framework/performance/)

---

如有问题，请查阅官方文档或联系项目维护者。
