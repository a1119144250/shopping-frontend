Component({
  data: {
    selected: 0,
    color: "#999999",
    selectedColor: "#ff6b35",
    list: [
      {
        pagePath: "/pages/index/index",
        text: "首页",
        iconPath: "/images/tabbar/首页.png",
        selectedIconPath: "/images/tabbar/首页.png"
      },
      {
        pagePath: "/pages/category/category",
        text: "分类",
        iconPath: "/images/tabbar/分类.png",
        selectedIconPath: "/images/tabbar/分类.png"
      },
      {
        pagePath: "/pages/cart/cart",
        text: "购物车",
        iconPath: "/images/tabbar/购物车.png",
        selectedIconPath: "/images/tabbar/购物车.png"
      },
      {
        pagePath: "/pages/profile/profile",
        text: "我的",
        iconPath: "/images/tabbar/我的.png",
        selectedIconPath: "/images/tabbar/我的.png"
      }
    ]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({ url })
      this.setData({
        selected: data.index
      })
    }
  }
})

