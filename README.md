# 美食外卖小程序

一个基于微信小程序开发的外卖订餐应用，提供商品浏览、购物车管理、订单处理等完整的外卖服务功能。

## 项目特色

- 🎨 **现代化 UI 设计** - 采用渐变色彩和圆角设计，提供优雅的用户体验
- 📱 **响应式布局** - 适配不同尺寸的移动设备
- 🛒 **完整购物流程** - 商品浏览、加购、结算一体化
- 🔄 **实时数据同步** - 购物车数据实时更新
- 🎯 **组件化开发** - 可复用的自定义组件
- 🚀 **性能优化** - 图片懒加载、防抖节流等优化措施

## 功能模块

### 核心功能

- **首页** - 轮播图、分类导航、推荐商品展示
- **商品分类** - 左右分栏布局，商品筛选浏览
- **购物车** - 商品管理、数量调整、价格计算
- **个人中心** - 用户信息、订单管理、功能设置

### 扩展功能

- **商品详情** - 详细信息展示、规格选择
- **订单管理** - 订单创建、状态跟踪、历史记录
- **地址管理** - 收货地址增删改查
- **用户系统** - 登录注册、个人资料管理

## 技术架构

### 前端技术栈

- **框架**: 微信小程序原生框架
- **样式**: WXSS + CSS3
- **组件**: 自定义组件 + 原生组件
- **状态管理**: 全局数据管理
- **工具库**: 自封装工具函数

### 项目结构

```
shopping-frontend/
├── app.js                 # 小程序入口文件
├── app.json              # 全局配置文件
├── app.wxss              # 全局样式文件
├── sitemap.json          # 站点地图配置
├── project.config.json   # 项目配置文件
├── pages/                # 页面目录
│   ├── index/           # 首页
│   ├── category/        # 分类页
│   ├── cart/            # 购物车
│   ├── profile/         # 个人中心
│   ├── product-detail/  # 商品详情
│   ├── order/           # 订单页面
│   ├── order-detail/    # 订单详情
│   ├── address/         # 地址管理
│   └── address-edit/    # 地址编辑
├── components/          # 自定义组件
│   ├── product-card/    # 商品卡片组件
│   └── cart-float/      # 购物车悬浮按钮
├── utils/               # 工具类
│   ├── api.js          # API接口管理
│   ├── util.js         # 通用工具函数
│   └── storage.js      # 本地存储管理
└── images/             # 图片资源
```

## 快速开始

### 环境要求

- 微信开发者工具 1.05.0+
- Node.js 14.0+（如需使用 npm 包）

### 安装步骤

1. **克隆项目**

```bash
git clone [项目地址]
cd shopping-frontend
```

2. **导入项目**

- 打开微信开发者工具
- 选择"导入项目"
- 选择项目目录
- 填入 AppID（测试可使用测试号）

3. **配置 AppID**

- 在 `project.config.json` 中修改 `appid` 字段
- 替换为你的小程序 AppID

4. **配置 API 地址**

- 在 `utils/api.js` 中修改 `baseUrl`
- 替换为你的后端 API 地址

### 开发调试

1. **启动开发**

- 在微信开发者工具中打开项目
- 点击"编译"按钮
- 在模拟器中预览效果

2. **真机调试**

- 点击"预览"生成二维码
- 使用微信扫码在真机上调试

## 核心组件说明

### ProductCard 商品卡片组件

```javascript
// 使用示例
<product-card
  product="{{productData}}"
  bind:addtocart="onAddToCart"
  bind:productclick="onProductClick"
></product-card>
```

**属性说明:**

- `product`: 商品数据对象
- `addtocart`: 加入购物车事件
- `productclick`: 商品点击事件

### CartFloat 购物车悬浮按钮

```javascript
// 使用示例
<cart-float show="{{true}}" bind:carttap="onCartTap"></cart-float>
```

**属性说明:**

- `show`: 是否显示按钮
- `carttap`: 点击事件

## API 接口规范

### 请求格式

```javascript
// GET请求
const products = await API.product.list({ page: 1, limit: 10 })

// POST请求
const result = await API.order.create(orderData)
```

### 响应格式

```json
{
  "code": 0,
  "message": "success",
  "data": {
    // 具体数据
  }
}
```

### 错误处理

- 统一错误提示
- 自动 token 刷新
- 网络异常处理

## 数据存储

### 本地存储管理

```javascript
// 用户信息
userStorage.setUserInfo(userInfo)
const userInfo = userStorage.getUserInfo()

// 购物车数据
cartStorage.addItem(product)
const cartInfo = cartStorage.getCartInfo()

// 搜索历史
searchStorage.addSearchHistory(keyword)
```

### 存储键名规范

- `userInfo`: 用户信息
- `token`: 登录凭证
- `cart`: 购物车数据
- `searchHistory`: 搜索历史
- `browseHistory`: 浏览历史

## 样式规范

### 颜色规范

- 主色调: `#ff6b35` (橙色)
- 辅助色: `#ff8f65` (浅橙色)
- 文字色: `#333` (深灰)
- 次要文字: `#666` (中灰)
- 提示文字: `#999` (浅灰)

### 尺寸规范

- 基础间距: `20rpx`
- 圆角大小: `10rpx`
- 字体大小: `28rpx` (常规)
- 按钮高度: `80rpx`

### 动画效果

- 过渡时间: `0.3s`
- 缓动函数: `ease-in-out`
- 点击反馈: `scale(0.95)`

## 性能优化

### 图片优化

- 使用 `lazy-load` 懒加载
- 合理设置 `mode` 属性
- 压缩图片资源

### 代码优化

- 防抖节流处理
- 组件按需加载
- 减少不必要的 setData

### 网络优化

- 请求合并
- 数据缓存
- 错误重试机制

## 部署发布

### 代码审核

1. 检查代码规范
2. 测试核心功能
3. 性能测试
4. 兼容性测试

### 提交审核

1. 在微信开发者工具中点击"上传"
2. 填写版本号和项目备注
3. 登录小程序后台提交审核
4. 等待微信官方审核

### 发布上线

1. 审核通过后在后台点击"发布"
2. 设置体验版供内部测试
3. 正式发布到线上环境

## 常见问题

### 开发问题

**Q: 组件不显示？**
A: 检查组件路径和 usingComponents 配置是否正确

**Q: 接口请求失败？**
A: 检查网络权限和域名配置，确保在小程序后台配置了合法域名

**Q: 样式不生效？**
A: 检查选择器优先级，避免使用标签选择器

### 功能问题

**Q: 购物车数据丢失？**
A: 检查本地存储是否正常，确保在合适的时机保存数据

**Q: 页面跳转异常？**
A: 检查页面路径和参数传递是否正确

## 更新日志

### v1.0.0 (2024-01-01)

- ✨ 初始版本发布
- 🎨 完成基础 UI 设计
- 🛒 实现购物车功能
- 👤 完成用户系统
- 📱 适配移动端显示

## 贡献指南

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

- 项目维护者: [Your Name]
- 邮箱: [your.email@example.com]
- 项目地址: [GitHub Repository URL]

**下一步开发建议**：

1. 替换图片资源

- 根据 images/README.md 说明添加真实图片

2. 配置后端 API

- 修改 utils/api.js 中的接口地址

3. 完善订单详情页

- 添加订单状态跟踪功能

4. 集成支付功能

- 接入微信支付

5. 添加搜索功能

- 实现商品搜索页面

6. 优化用户体验

- 添加更多动画和交互效果

这个框架为你提供了一个完整的外卖小程序基础结构，你可以在此基础上继续开发和完善功能。所有代码都遵循微信小程序的开发规范，具有良好的可扩展性和维护性。

---

**注意**: 这是一个示例项目，实际使用时请根据具体需求进行调整和完善。
