# TabBar 图标获取指南

## 📋 问题说明

微信小程序的 TabBar 必须使用本地图片文件作为图标，不提供内置图标组件。目前项目暂时注释了 TabBar 配置以确保正常运行。

## 🎯 所需图标清单

需要准备以下 8 个图标文件（每个 Tab 需要普通和选中两种状态）：

```
images/tabbar/
├── home.png           # 首页图标（未选中）
├── home-active.png    # 首页图标（选中）
├── category.png       # 分类图标（未选中）
├── category-active.png # 分类图标（选中）
├── cart.png           # 购物车图标（未选中）
├── cart-active.png    # 购物车图标（选中）
├── profile.png        # 个人中心图标（未选中）
└── profile-active.png # 个人中心图标（选中）
```

## 📐 图标规范

### 尺寸要求

- **推荐尺寸**: 81px × 81px
- **最小尺寸**: 40px × 40px
- **格式**: PNG（支持透明背景）
- **文件大小**: 建议每个图标 < 40KB

### 设计规范

- **风格**: 线性图标，简洁明了
- **颜色**:
  - 未选中：`#999999` 或透明背景
  - 选中：`#ff6b35`（项目主色调）
- **线条**: 2-3px 粗细，圆角处理

## 🎨 获取图标的方法

### 方法一：在线图标库（推荐）

#### 1. Iconfont（阿里巴巴图标库）

- 网址：https://www.iconfont.cn/
- 搜索关键词：`home`、`category`、`shopping-cart`、`user`
- 选择合适的图标，下载 PNG 格式

#### 2. Feather Icons

- 网址：https://feathericons.com/
- 现代简洁的线性图标
- 可直接下载 SVG，然后转换为 PNG

#### 3. Heroicons

- 网址：https://heroicons.com/
- 提供 outline 和 solid 两种风格
- 适合做未选中和选中状态

### 方法二：使用 AI 工具生成

- 使用 Midjourney、DALL-E 等 AI 工具
- 提示词：`simple line icon for [home/category/cart/profile], minimalist style, transparent background`

### 方法三：自己设计

- 使用 Figma、Sketch、Adobe Illustrator
- 参考主流 App 的 TabBar 图标设计

## 🔧 图标处理工具

### 在线工具

1. **TinyPNG** (https://tinypng.com/) - 压缩图片
2. **Squoosh** (https://squoosh.app/) - Google 图片优化工具
3. **CloudConvert** (https://cloudconvert.com/) - 格式转换

### 本地工具

- **ImageOptim** (Mac) - 图片优化
- **GIMP** (免费) - 图片编辑
- **Photoshop** - 专业图片处理

## 📝 添加图标步骤

### 1. 准备图标文件

将 8 个图标文件放入 `images/tabbar/` 目录

### 2. 添加 TabBar 配置

在 `app.json` 的 `window` 配置后添加 TabBar 配置：

```json
{
  "tabBar": {
    "color": "#999999",
    "selectedColor": "#ff6b35",
    "backgroundColor": "#ffffff",
    "borderStyle": "black",
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "首页",
        "iconPath": "images/tabbar/home.png",
        "selectedIconPath": "images/tabbar/home-active.png"
      },
      {
        "pagePath": "pages/category/category",
        "text": "分类",
        "iconPath": "images/tabbar/category.png",
        "selectedIconPath": "images/tabbar/category-active.png"
      },
      {
        "pagePath": "pages/cart/cart",
        "text": "购物车",
        "iconPath": "images/tabbar/cart.png",
        "selectedIconPath": "images/tabbar/cart-active.png"
      },
      {
        "pagePath": "pages/profile/profile",
        "text": "我的",
        "iconPath": "images/tabbar/profile.png",
        "selectedIconPath": "images/tabbar/profile-active.png"
      }
    ]
  }
}
```

### 3. 重新编译

在微信开发者工具中点击"编译"按钮

## 🎯 推荐图标示例

### 首页 (Home)

- 未选中：房子轮廓线
- 选中：实心房子

### 分类 (Category)

- 未选中：四个方格轮廓
- 选中：四个实心方格

### 购物车 (Cart)

- 未选中：购物车轮廓线
- 选中：实心购物车

### 个人中心 (Profile)

- 未选中：用户头像轮廓
- 选中：实心用户头像

## ⚠️ 注意事项

1. **文件路径**: 确保图标文件路径与 `app.json` 中配置的路径完全一致
2. **文件名**: 严格按照配置的文件名，区分大小写
3. **图片质量**: 在不同设备上测试显示效果
4. **版权问题**: 确保使用的图标有合法使用权

## 🚀 临时解决方案

如果暂时没有合适的图标，可以：

1. **使用纯文字 TabBar**（当前方案）
2. **使用 emoji 作为临时图标**
3. **创建简单的几何图形图标**

现在项目已经可以正常运行，你可以先测试功能，后续再添加图标美化界面。
