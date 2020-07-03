const config = require('../../config.js')
var app = getApp();

Page({
  data:{
   shotImage:'',
   compareurl:'',
   isCompareResult:false
  },
  onLoad:function(options){
        var productInfo=app.globalData.productInfo;
        this.setData({
          pro:productInfo,
          isCompareResult:this.data.isCompareResult
        });
  },
  onSourceImagePreview:function(e){
    var productInfo = app.globalData.productInfo;
    wx.previewImage({
      current: productInfo.sourcethumbnail,
      urls: [productInfo.sourcethumbnail]
    })
  },
  onShotImagePreview:function(e){
    wx.previewImage({
      current: this.data.shotImage,
      urls: [this.data.shotImage]
    })
  },
  onComparedPreview:function(e){
    wx.previewImage({
      current: this.data.compareurl,
      urls: [this.data.compareurl]
    })
  },
  onDelShotImage:function(e){
    var that=this;
    wx.showModal({
      title: '您将要删除图片，请确认？',
      content: '删除图片，重新拍摄！',
      success(res) {
        if (res.confirm) {
          that.data.shotImage='';
          that.data.isCompareResult = false;
          that.setData({
            shotImage: that.data.shotImage,
            isCompareResult: that.data.isCompareResult
          });
          console.log("delete!")
        }
      }
    })
  },
  onPhotograph:function(e){
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: ['album', 'camera'],
      success: res => {
        this.data.shotImage = res.tempFilePaths[0];
        console.log(this.data.shotImage);
        this.setData({
          shotImage: this.data.shotImage
        })
      }
    });
  },
  onCompare: function (e) {
    if (!app.globalData.productInfo.sourcethumbnail){
      wx.showModal({
        title: '没有原始图',
        content: '原始图不存在，不能进行图片比对，请确认产品真伪！',
        showCancel: false,
        confirmText: '确定'
      })
      return false;
    }
    else if(!this.data.shotImage){
       wx.showModal({
         title: '请拍摄MARK照片',
         content: '手机对准二维码中心圆圈放大镜头，待MARK点清晰后，点击拍摄。',
         showCancel:false,
         confirmText:'确定'
       })
       return false;
    }
    wx.showLoading({
      title: '传图比对检测中...',
      mask: true
    })
    var that=this;
    wx.uploadFile({
      url: config.uploadImageUrl,
      filePath: this.data.shotImage,
      name: 'compared',
      formData: { labelId: app.globalData.productInfo.id },
      success: function (res) {
        try{
          that.data.isCompareResult = true;
          var data=JSON.parse(res.data);
          console.log(data);
          if (data.code == 0){
            var result = data;
            app.globalData.productInfo.similarity = result.data.similarity;
            app.globalData.productInfo.conclusion = result.data.similarity >= 75 ? '正品' : '非正品';
            that.data.compareurl = result.data.detail;
            that.setData({
              similarity: app.globalData.productInfo.similarity,
              conclusion: app.globalData.productInfo.conclusion,
              compareurl: that.data.compareurl,
              isCompareResult: that.data.isCompareResult
            });
          }
          else{
            console.log(data);
            that.setData({
              similarity:0.0,
              conclusion: data.message,
              isCompareResult: that.data.isCompareResult
            });
          }
        }
        catch(e){
          console.error(e);
          wx.hideLoading();
          wx.showToast({
            title: '错误：' + e,
            icon: 'warn',
            duration: 4000
          })
        }
      },
      fail: function (err) {
        console.log(err)
        wx.hideLoading();
        wx.showToast({
          title: '错误：' + err,
          icon: 'warn',
          duration: 4000
        })
      },
      complete: function () {
        wx.hideLoading()
      }
    })
  }
});