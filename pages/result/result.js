
Page({
  data: {
    image: ''
  },

  onLoad: function (option) {
    console.log(JSON.stringify(option))

    this.setData({
      image: option.image
    })
  }
})
