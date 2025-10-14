# 图片资源说明

本目录包含小程序所需的图片资源，请根据实际需求替换为真实图片。

## 目录结构

```
images/
├── tabbar/                 # 底部导航栏图标
│   ├── home.png           # 首页图标
│   ├── home-active.png    # 首页选中图标
│   ├── category.png       # 分类图标
│   ├── category-active.png # 分类选中图标
│   ├── cart.png           # 购物车图标
│   ├── cart-active.png    # 购物车选中图标
│   ├── profile.png        # 个人中心图标
│   └── profile-active.png # 个人中心选中图标
├── category/              # 分类图标
│   ├── burger.png         # 汉堡图标
│   ├── pizza.png          # 披萨图标
│   ├── chicken.png        # 炸鸡图标
│   ├── drink.png          # 饮品图标
│   ├── dessert.png        # 甜品图标
│   └── snack.png          # 小食图标
├── products/              # 商品图片
│   ├── burger1.jpg        # 汉堡商品图
│   ├── pizza1.jpg         # 披萨商品图
│   ├── chicken1.jpg       # 炸鸡商品图
│   └── drink1.jpg         # 饮品商品图
├── order/                 # 订单相关图标
│   ├── pending.png        # 待付款图标
│   ├── confirmed.png      # 待接单图标
│   ├── preparing.png      # 制作中图标
│   ├── delivering.png     # 配送中图标
│   └── completed.png      # 已完成图标
├── menu/                  # 菜单图标
│   ├── address.png        # 地址图标
│   ├── coupon.png         # 优惠券图标
│   ├── favorite.png       # 收藏图标
│   ├── feedback.png       # 反馈图标
│   ├── about.png          # 关于图标
│   ├── settings.png       # 设置图标
│   └── service.png        # 客服图标
├── default-avatar.png     # 默认头像
├── empty-cart.png         # 空购物车图标
├── empty-product.png      # 空商品图标
├── empty-address.png      # 空地址图标
├── cart-white.png         # 白色购物车图标
├── edit.png               # 编辑图标
├── delete.png             # 删除图标
├── heart.png              # 收藏图标（未选中）
├── heart-fill.png         # 收藏图标（已选中）
└── share-cover.jpg        # 分享封面图
```

## 图标规范

### 尺寸要求

- **TabBar 图标**: 81px × 81px (推荐)
- **分类图标**: 60px × 60px
- **菜单图标**: 50px × 50px
- **商品图片**: 建议 400px × 400px 以上

### 格式要求

- **图标**: PNG 格式，支持透明背景
- **商品图片**: JPG/PNG 格式
- **文件大小**: 单个图片建议不超过 200KB

### 设计规范

- **风格**: 简洁、现代、统一
- **颜色**: 主色调 #ff6b35，辅助色 #666、#999
- **圆角**: 适当使用圆角设计
- **阴影**: 可适当添加阴影效果

## 获取图标资源

### 推荐图标库

- [Iconfont](https://www.iconfont.cn/) - 阿里巴巴图标库
- [Feather Icons](https://feathericons.com/) - 简洁线性图标
- [Heroicons](https://heroicons.com/) - 现代图标集
- [Tabler Icons](https://tabler-icons.io/) - 免费图标库

### 商品图片来源

- [Unsplash](https://unsplash.com/) - 免费高质量图片
- [Pexels](https://www.pexels.com/) - 免费图片素材
- [Pixabay](https://pixabay.com/) - 免费图片资源

## 使用说明

1. **替换图片**: 将对应的图片文件放入相应目录
2. **命名规范**: 保持文件名一致，或修改代码中的引用路径
3. **优化建议**: 使用图片压缩工具减小文件体积
4. **版权注意**: 确保使用的图片拥有合法使用权

## 注意事项

- 所有图片路径均为相对路径，以 `/images/` 开头
- 建议对图片进行压缩处理以提升加载速度
- TabBar 图标需要提供选中和未选中两种状态
- 商品图片建议使用统一的宽高比
- 考虑不同设备的显示效果，提供合适的分辨率

## 图片优化工具

- [TinyPNG](https://tinypng.com/) - 在线图片压缩
- [ImageOptim](https://imageoptim.com/) - Mac 图片优化工具
- [Squoosh](https://squoosh.app/) - Google 图片压缩工具
