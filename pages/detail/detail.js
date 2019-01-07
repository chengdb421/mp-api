const config = require('../../config.js')

Page({
  data: {
    labelId: 0,
    url: config.productDetailUrl,
    product: null,
    shootImage: null
  },

  onLoad: function (options) {
    console.log(options)
    this.setData({ labelId: options.id })
    self = this
    wx.request({
      url: this.data.url,
      data: { labelId: this.data.labelId },
      success(res) {
        self.setData({
          product: res.data
        })
      }
    })
  },

  chooseImage(e) {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['camera'],
      success: res => {
        this.setData({
          shootImage: res.tempFilePaths[0]
        })
      }
    })
  },

  removeImage(e) {
    this.setData({
      shootImage: null
    })
  },

  handleImagePreview(e) {
    let image = this.data.product.labelImage
    wx.previewImage({
      current: image,
      urls: [image]
    })
  },

  submitForm(e) {

    wx.showLoading({
      title: '正在上传...',
      mask: true
    })

    wx.uploadFile({
      url: config.uploadImageUrl,
      filePath: this.data.shootImage,
      name: 'compared',
      formData: { labelId: this.data.labelId },
      success: function (res) {
        const result = JSON.parse(res.data)
        wx.navigateTo({
          url: '../result/result?image=' + result.detail
        })
      },
      fail: function (err) {
        console.log(err)
      },
      complete: function () {
        wx.hideLoading()
      }
    })
  }

});
