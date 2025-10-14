# 外卖小程序后端接口文档

## 📋 概述

本文档描述了外卖小程序所需的后端 API 接口，包括用户管理、商品管理、订单处理、地址管理等核心功能。

## 🔧 基础配置

### 请求基础信息

- **Base URL**: `https://api.yourdomain.com`
- **Content-Type**: `application/json`
- **认证方式**: Bearer Token
- **超时时间**: 10 秒

### 统一响应格式

```json
{
  "code": 0, // 0表示成功，其他表示失败
  "message": "success", // 响应消息
  "data": {} // 响应数据
}
```

### 状态码说明

- `200`: 请求成功
- `400`: 请求参数错误
- `401`: 未授权/token 失效
- `403`: 权限不足
- `404`: 资源不存在
- `500`: 服务器内部错误

---

## 👤 用户管理模块

### 1. 用户登录

**接口**: `POST /user/login`

**请求参数**:

```json
{
  "code": "微信登录code",
  "userInfo": {
    "nickName": "用户昵称",
    "avatarUrl": "头像URL",
    "gender": 1,
    "city": "城市",
    "province": "省份",
    "country": "国家"
  }
}
```

**响应数据**:

```json
{
  "code": 0,
  "message": "登录成功",
  "data": {
    "token": "jwt_token_string",
    "userInfo": {
      "id": 1,
      "openId": "微信openId",
      "nickName": "用户昵称",
      "avatarUrl": "头像URL",
      "phone": "手机号",
      "points": 1200,
      "coupons": 3,
      "balance": 58.5,
      "createTime": "2024-01-01T00:00:00Z"
    }
  }
}
```

### 2. 获取用户信息

**接口**: `GET /user/profile`

**请求头**: `Authorization: Bearer {token}`

**响应数据**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "nickName": "用户昵称",
    "avatarUrl": "头像URL",
    "phone": "手机号",
    "points": 1200,
    "coupons": 3,
    "balance": 58.5
  }
}
```

### 3. 更新用户信息

**接口**: `PUT /user/profile`

**请求参数**:

```json
{
  "nickName": "新昵称",
  "phone": "13800138000",
  "avatarUrl": "新头像URL"
}
```

### 4. 用户登出

**接口**: `POST /user/logout`

---

## 🏠 首页数据模块

### 1. 获取轮播图

**接口**: `GET /banners`

**响应数据**:

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": 1,
      "title": "轮播图标题",
      "image": "图片URL",
      "url": "跳转链接",
      "sort": 1,
      "status": 1
    }
  ]
}
```

### 2. 获取商品分类

**接口**: `GET /categories`

**响应数据**:

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "汉堡",
      "icon": "分类图标URL",
      "description": "美味汉堡，满足你的味蕾",
      "sort": 1,
      "status": 1
    }
  ]
}
```

---

## 🍔 商品管理模块

### 1. 获取商品列表

**接口**: `GET /products`

**请求参数**:

```
page: 页码 (默认1)
limit: 每页数量 (默认10)
categoryId: 分类ID (可选)
keyword: 搜索关键词 (可选)
sortBy: 排序方式 (sales|price|rating) (可选)
sortOrder: 排序顺序 (asc|desc) (可选)
```

**响应数据**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "name": "经典牛肉汉堡",
        "image": "商品主图URL",
        "images": ["图片1", "图片2", "图片3"],
        "price": 25.8,
        "originalPrice": 32.0,
        "description": "商品简介",
        "detail": "商品详细描述",
        "categoryId": 1,
        "categoryName": "汉堡",
        "sales": 1234,
        "rating": 4.8,
        "status": 1,
        "ingredients": ["牛肉饼", "生菜", "番茄"],
        "nutrition": {
          "calories": 520,
          "protein": 28,
          "fat": 25,
          "carbs": 45
        }
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 10,
    "hasMore": true
  }
}
```

### 2. 获取商品详情

**接口**: `GET /products/{id}`

**响应数据**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "name": "经典牛肉汉堡",
    "image": "商品主图URL",
    "images": ["图片1", "图片2", "图片3"],
    "price": 25.8,
    "originalPrice": 32.0,
    "description": "商品简介",
    "detail": "商品详细描述",
    "categoryId": 1,
    "categoryName": "汉堡",
    "sales": 1234,
    "rating": 4.8,
    "ingredients": ["牛肉饼", "生菜", "番茄"],
    "nutrition": {
      "calories": 520,
      "protein": 28,
      "fat": 25,
      "carbs": 45
    },
    "specifications": [
      {
        "name": "规格",
        "options": ["标准", "加大"]
      }
    ]
  }
}
```

### 3. 商品搜索

**接口**: `GET /products/search`

**请求参数**:

```
keyword: 搜索关键词 (必填)
page: 页码 (默认1)
limit: 每页数量 (默认10)
```

### 4. 分类商品列表

**接口**: `GET /categories/{categoryId}/products`

**请求参数**:

```
page: 页码 (默认1)
limit: 每页数量 (默认10)
```

---

## 🛒 购物车模块

### 1. 获取购物车列表

**接口**: `GET /cart`

**响应数据**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "items": [
      {
        "id": 1,
        "productId": 1,
        "productName": "经典牛肉汉堡",
        "productImage": "商品图片URL",
        "price": 25.8,
        "originalPrice": 32.0,
        "count": 2,
        "specifications": "标准",
        "selected": true
      }
    ],
    "totalCount": 3,
    "totalPrice": 77.4,
    "selectedCount": 2,
    "selectedPrice": 51.6
  }
}
```

### 2. 添加商品到购物车

**接口**: `POST /cart`

**请求参数**:

```json
{
  "productId": 1,
  "count": 1,
  "specifications": "标准"
}
```

### 3. 更新购物车商品

**接口**: `PUT /cart/{id}`

**请求参数**:

```json
{
  "count": 3,
  "selected": true
}
```

### 4. 删除购物车商品

**接口**: `DELETE /cart/{id}`

### 5. 清空购物车

**接口**: `DELETE /cart`

---

## 📍 地址管理模块

### 1. 获取地址列表

**接口**: `GET /addresses`

**响应数据**:

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "张三",
      "phone": "13800138000",
      "province": "北京市",
      "city": "北京市",
      "district": "朝阳区",
      "detail": "三里屯街道1号",
      "region": "北京市 朝阳区",
      "tag": "家",
      "isDefault": true,
      "createTime": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### 2. 添加收货地址

**接口**: `POST /addresses`

**请求参数**:

```json
{
  "name": "张三",
  "phone": "13800138000",
  "province": "北京市",
  "city": "北京市",
  "district": "朝阳区",
  "detail": "三里屯街道1号",
  "tag": "家",
  "isDefault": false
}
```

### 3. 更新收货地址

**接口**: `PUT /addresses/{id}`

### 4. 删除收货地址

**接口**: `DELETE /addresses/{id}`

### 5. 设置默认地址

**接口**: `POST /addresses/{id}/default`

---

## 📦 订单管理模块

### 1. 创建订单

**接口**: `POST /orders`

**请求参数**:

```json
{
  "items": [
    {
      "productId": 1,
      "productName": "经典牛肉汉堡",
      "productImage": "商品图片URL",
      "price": 25.8,
      "count": 2,
      "specifications": "标准"
    }
  ],
  "addressId": 1,
  "couponId": null,
  "remark": "订单备注",
  "deliveryFee": 5.0,
  "goodsAmount": 51.6,
  "discountAmount": 0,
  "totalAmount": 56.6
}
```

**响应数据**:

```json
{
  "code": 0,
  "message": "订单创建成功",
  "data": {
    "orderId": "ORDER_1704067200000",
    "orderNo": "20240101000001",
    "totalAmount": 56.6,
    "paymentUrl": "支付链接"
  }
}
```

### 2. 获取订单列表

**接口**: `GET /orders`

**请求参数**:

```
page: 页码 (默认1)
limit: 每页数量 (默认10)
status: 订单状态 (可选)
```

**响应数据**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "orderNo": "20240101000001",
        "status": "pending",
        "statusText": "待付款",
        "totalAmount": 56.6,
        "goodsAmount": 51.6,
        "deliveryFee": 5.0,
        "discountAmount": 0,
        "items": [
          {
            "productId": 1,
            "productName": "经典牛肉汉堡",
            "productImage": "商品图片URL",
            "price": 25.8,
            "count": 2
          }
        ],
        "address": {
          "name": "张三",
          "phone": "13800138000",
          "detail": "北京市朝阳区三里屯街道1号"
        },
        "createTime": "2024-01-01T00:00:00Z",
        "payTime": null,
        "deliveryTime": null,
        "completeTime": null
      }
    ],
    "total": 50,
    "page": 1,
    "limit": 10
  }
}
```

### 3. 获取订单详情

**接口**: `GET /orders/{id}`

### 4. 取消订单

**接口**: `POST /orders/{id}/cancel`

### 5. 订单支付

**接口**: `POST /orders/{id}/pay`

**请求参数**:

```json
{
  "paymentMethod": "wechat"
}
```

### 6. 确认收货

**接口**: `POST /orders/{id}/confirm`

---

## 🎫 优惠券模块

### 1. 获取优惠券列表

**接口**: `GET /coupons`

**请求参数**:

```
type: 优惠券类型 (available|used|expired)
page: 页码
limit: 每页数量
```

**响应数据**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "name": "满50减10",
        "type": "discount",
        "discount": 10.0,
        "minAmount": 50.0,
        "startTime": "2024-01-01T00:00:00Z",
        "endTime": "2024-12-31T23:59:59Z",
        "status": "available",
        "description": "全场通用优惠券"
      }
    ],
    "total": 10,
    "page": 1,
    "limit": 10
  }
}
```

### 2. 获取可用优惠券

**接口**: `GET /coupons/available`

**请求参数**:

```
amount: 订单金额 (用于筛选可用优惠券)
```

### 3. 领取优惠券

**接口**: `POST /coupons/{id}/receive`

### 4. 使用优惠券

**接口**: `POST /coupons/{id}/use`

**请求参数**:

```json
{
  "orderId": 1
}
```

---

## 📊 统计数据模块

### 1. 获取订单统计

**接口**: `GET /statistics/orders`

**响应数据**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "pending": 1,
    "confirmed": 0,
    "preparing": 1,
    "delivering": 0,
    "completed": 5,
    "cancelled": 0
  }
}
```

---

## 🔧 其他接口

### 1. 文件上传

**接口**: `POST /upload`

**请求类型**: `multipart/form-data`

**请求参数**:

```
file: 文件 (必填)
type: 文件类型 (avatar|product|feedback) (可选)
```

**响应数据**:

```json
{
  "code": 0,
  "message": "上传成功",
  "data": {
    "url": "文件访问URL",
    "filename": "文件名",
    "size": 1024
  }
}
```

### 2. 意见反馈

**接口**: `POST /feedback`

**请求参数**:

```json
{
  "type": "bug",
  "content": "反馈内容",
  "contact": "联系方式",
  "images": ["图片URL1", "图片URL2"]
}
```

---

## 🔐 认证说明

### Token 获取

用户登录成功后，服务端返回 JWT token，客户端需要在后续请求中携带此 token。

### Token 使用

在请求头中添加：

```
Authorization: Bearer {token}
```

### Token 刷新

Token 过期时，客户端需要重新登录获取新 token。

---

## 📱 微信小程序特殊接口

### 1. 微信登录

**接口**: `POST /wechat/login`

**请求参数**:

```json
{
  "code": "微信登录code",
  "encryptedData": "加密数据",
  "iv": "初始向量"
}
```

### 2. 微信支付

**接口**: `POST /wechat/pay`

**请求参数**:

```json
{
  "orderId": 1,
  "openId": "用户openId"
}
```

**响应数据**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "timeStamp": "时间戳",
    "nonceStr": "随机字符串",
    "package": "prepay_id=xxx",
    "signType": "RSA",
    "paySign": "签名"
  }
}
```

---

## 🚀 部署建议

### 数据库设计

建议使用以下主要数据表：

- `users` - 用户表
- `products` - 商品表
- `categories` - 分类表
- `cart_items` - 购物车表
- `orders` - 订单表
- `order_items` - 订单商品表
- `addresses` - 地址表
- `coupons` - 优惠券表
- `user_coupons` - 用户优惠券关联表

### 技术栈建议

- **后端框架**: Node.js (Express/Koa) 或 Java (Spring Boot) 或 Python (Django/FastAPI)
- **数据库**: MySQL 或 PostgreSQL
- **缓存**: Redis
- **文件存储**: 阿里云 OSS 或 腾讯云 COS
- **支付**: 微信支付 API

### 安全建议

1. 使用 HTTPS 协议
2. 实施 API 限流
3. 验证所有输入参数
4. 使用 JWT 进行身份认证
5. 敏感数据加密存储

---

## 📞 联系方式

如有接口相关问题，请联系开发团队。

**文档版本**: v1.0  
**更新时间**: 2024-01-01  
**维护人员**: 开发团队
