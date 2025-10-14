# TabBar 图标占位文件

由于微信小程序必须使用本地图片文件作为 TabBar 图标，我们需要创建 8 个图标文件。

## 临时解决方案

为了快速启用 TabBar，你可以：

1. **下载现成图标** - 从 iconfont.cn 下载
2. **使用 emoji 图片** - 截图保存为 PNG
3. **创建纯色方块** - 作为临时占位

## 所需文件列表

```
images/tabbar/
├── home.png           (81x81px)
├── home-active.png    (81x81px)
├── category.png       (81x81px)
├── category-active.png (81x81px)
├── cart.png           (81x81px)
├── cart-active.png    (81x81px)
├── profile.png        (81x81px)
└── profile-active.png (81x81px)
```

## 快速获取图标

### 方法 1: 使用 emoji

1. 在电脑上打开任意文本编辑器
2. 输入对应 emoji：🏠 📂 🛒 👤
3. 截图并裁剪为 81x81 像素
4. 保存为 PNG 格式

### 方法 2: 在线图标库

- 访问 https://www.iconfont.cn/
- 搜索 "home"、"category"、"cart"、"user"
- 下载 PNG 格式，尺寸 81x81

### 方法 3: 纯色占位

创建 81x81 像素的纯色方块：

- 普通状态：灰色 #999999
- 选中状态：橙色 #ff6b35

完成后将文件放入此目录，然后在 app.json 中启用 TabBar 配置。
