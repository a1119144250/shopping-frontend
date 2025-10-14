# 后端接口开发清单

## 📋 核心接口优先级

### 🔥 高优先级 (必须实现)

#### 用户模块

- [ ] `POST /user/login` - 微信登录
- [ ] `GET /user/profile` - 获取用户信息
- [ ] `PUT /user/profile` - 更新用户信息

#### 商品模块

- [ ] `GET /products` - 商品列表 (支持分页、分类筛选)
- [ ] `GET /products/{id}` - 商品详情
- [ ] `GET /categories` - 商品分类列表
- [ ] `GET /products/search` - 商品搜索

#### 购物车模块

- [ ] `GET /cart` - 购物车列表
- [ ] `POST /cart` - 添加到购物车
- [ ] `PUT /cart/{id}` - 更新购物车商品
- [ ] `DELETE /cart/{id}` - 删除购物车商品

#### 订单模块

- [ ] `POST /orders` - 创建订单
- [ ] `GET /orders` - 订单列表
- [ ] `GET /orders/{id}` - 订单详情
- [ ] `POST /orders/{id}/pay` - 订单支付

#### 地址模块

- [ ] `GET /addresses` - 地址列表
- [ ] `POST /addresses` - 添加地址
- [ ] `PUT /addresses/{id}` - 更新地址
- [ ] `DELETE /addresses/{id}` - 删除地址

### 🟡 中优先级 (建议实现)

#### 首页数据

- [ ] `GET /banners` - 轮播图
- [ ] `GET /statistics/orders` - 订单统计

#### 订单管理

- [ ] `POST /orders/{id}/cancel` - 取消订单
- [ ] `POST /orders/{id}/confirm` - 确认收货

#### 优惠券

- [ ] `GET /coupons` - 优惠券列表
- [ ] `GET /coupons/available` - 可用优惠券
- [ ] `POST /coupons/{id}/receive` - 领取优惠券

### 🟢 低优先级 (可选实现)

#### 其他功能

- [ ] `POST /upload` - 文件上传
- [ ] `POST /feedback` - 意见反馈
- [ ] `POST /user/logout` - 用户登出
- [ ] `POST /addresses/{id}/default` - 设置默认地址

---

## 📊 数据模型设计

### 核心数据表

#### 用户表 (users)

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  open_id VARCHAR(100) UNIQUE NOT NULL,
  nick_name VARCHAR(100),
  avatar_url VARCHAR(500),
  phone VARCHAR(20),
  points INT DEFAULT 0,
  balance DECIMAL(10,2) DEFAULT 0.00,
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 商品分类表 (categories)

```sql
CREATE TABLE categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  icon VARCHAR(500),
  description VARCHAR(200),
  sort INT DEFAULT 0,
  status TINYINT DEFAULT 1,
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 商品表 (products)

```sql
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  image VARCHAR(500),
  images JSON,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  description VARCHAR(500),
  detail TEXT,
  category_id INT,
  sales INT DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0.00,
  status TINYINT DEFAULT 1,
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

#### 购物车表 (cart_items)

```sql
CREATE TABLE cart_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  count INT NOT NULL DEFAULT 1,
  selected TINYINT DEFAULT 1,
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);
```

#### 收货地址表 (addresses)

```sql
CREATE TABLE addresses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  name VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  province VARCHAR(50),
  city VARCHAR(50),
  district VARCHAR(50),
  detail VARCHAR(200) NOT NULL,
  tag VARCHAR(20) DEFAULT '家',
  is_default TINYINT DEFAULT 0,
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### 订单表 (orders)

```sql
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_no VARCHAR(50) UNIQUE NOT NULL,
  user_id INT NOT NULL,
  status ENUM('pending','paid','confirmed','preparing','delivering','completed','cancelled') DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  goods_amount DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) DEFAULT 0.00,
  discount_amount DECIMAL(10,2) DEFAULT 0.00,
  address_info JSON NOT NULL,
  remark VARCHAR(500),
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  pay_time TIMESTAMP NULL,
  delivery_time TIMESTAMP NULL,
  complete_time TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### 订单商品表 (order_items)

```sql
CREATE TABLE order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  product_image VARCHAR(500),
  price DECIMAL(10,2) NOT NULL,
  count INT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);
```

---

## 🔧 技术实现建议

### 1. 认证授权

```javascript
// JWT Token 验证中间件示例
const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '')

  if (!token) {
    return res.status(401).json({
      code: 401,
      message: '未提供认证token',
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({
      code: 401,
      message: 'token无效或已过期',
    })
  }
}
```

### 2. 统一响应格式

```javascript
// 响应格式化中间件
const responseFormatter = {
  success: (data, message = 'success') => ({
    code: 0,
    message,
    data,
  }),

  error: (message, code = 1) => ({
    code,
    message,
    data: null,
  }),
}
```

### 3. 分页处理

```javascript
// 分页工具函数
const paginate = (page = 1, limit = 10) => {
  const offset = (page - 1) * limit
  return {
    offset,
    limit: parseInt(limit),
  }
}
```

### 4. 微信登录处理

```javascript
// 微信登录示例
const wechatLogin = async (code) => {
  // 1. 通过code获取session_key和openid
  const response = await axios.get(
    `https://api.weixin.qq.com/sns/jscode2session`,
    {
      params: {
        appid: process.env.WECHAT_APPID,
        secret: process.env.WECHAT_SECRET,
        js_code: code,
        grant_type: 'authorization_code',
      },
    }
  )

  const { openid, session_key } = response.data

  // 2. 查找或创建用户
  let user = await User.findOne({ open_id: openid })
  if (!user) {
    user = await User.create({ open_id: openid })
  }

  // 3. 生成JWT token
  const token = jwt.sign(
    { userId: user.id, openId: openid },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

  return { user, token }
}
```

---

## 🚀 快速开发指南

### Phase 1: 基础功能 (1-2 周)

1. 搭建项目框架
2. 实现用户登录
3. 商品展示 (列表、详情、分类)
4. 购物车基础功能

### Phase 2: 核心功能 (2-3 周)

1. 订单创建和管理
2. 地址管理
3. 支付集成
4. 订单状态流转

### Phase 3: 完善功能 (1-2 周)

1. 优惠券系统
2. 搜索功能优化
3. 数据统计
4. 其他辅助功能

---

## 📱 小程序端配置

记得在小程序端更新 API 配置：

```javascript
// utils/api.js
const API_CONFIG = {
  baseUrl: 'https://your-api-domain.com', // 替换为你的API域名
  timeout: 10000,
}
```

---

## ✅ 开发完成检查

- [ ] 所有接口返回统一格式
- [ ] 实现 JWT 认证
- [ ] 添加参数验证
- [ ] 错误处理完善
- [ ] 接口文档更新
- [ ] 单元测试编写
- [ ] 性能优化
- [ ] 安全检查

---

这份清单可以帮助你按优先级逐步实现后端接口，建议先完成高优先级接口，确保小程序基本功能可用，再逐步完善其他功能。
