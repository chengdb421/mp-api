const config = require('../../config.js');
function getRequest(url,params){
  wx.request({
    url: url,
    data: params,
    success(res) {
      var app = getApp();
      if (res.data && res.statusCode == 200) {
        if (res.data.code==0){
          var data = res.data.data;
          app.globalData.productInfo = {
            name: data.name,
            id: data.id,
            banner: data.banner,
            sourcethumbnail: data.labelThumbnail,
            sourceimage: data.labelImage,
            compareimage: "",
            similarity: 0.0,
            isnothing: false
          };
          console.log('success!!');

          //先预加载banner图片
        }else{
          app.globalData.productInfo = {
            isnothing: true
          };
        } 
      }
      else {
        app.globalData.productInfo = {
          isnothing: true
        };
      }

      wx.navigateTo({
        url: '../calibration/calibration'
      });
    },
    fail(req) {
      wx.hideLoading();
      wx.showToast({
        title: '请求服务器失败',
        icon: 'warn',
        duration: 2000
      })
    },
    complete() {
      wx.hideLoading();
    }
  })
}
Page({
  app:getApp(),
  scanQr:function(e) {
    this.app.globalData.productInfo = {
      name: '',
      id:'',
      banner: '',
      sourceimage: '',
      compareimage: '',
      similarity: 0.0,
      conclusion:'',
      isnothing: true
    };
   
   /*
    wx.navigateTo({
      url: '../result/result'
    });
    */

    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['qrCode'],
      success(res) {
        try{
          var qrcode=res.result;
          var lookup1=qrcode.indexOf("http://wx.originsplatform.com");
          var lookup2=qrcode.indexOf("https://wx.originsplatform.com");
          if((lookup1===0) || (lookup2===0)){
            wx.showLoading("载入页面中...");
            qrcode=encodeURIComponent(qrcode);
            wx.navigateTo({
              url: '../views/home/main?q='+qrcode,
              complete: function (e) {
                wx.hideLoading();
              }
            })
          }else{
          var id = getApp().getUrlParam(qrcode, "id");
          if(id){
            wx.showLoading({
              title: '加载中...'
            });
            getRequest(config.productDetailUrl, { labelId: id });
          }
          else{
            wx.showToast({
              title: '非官方QR Code',
              icon: 'info',
              duration: 4000
            })
          }                      
        }
        }
        catch(e){
          console.error(e);
          wx.showToast({
            title: e,
            icon: 'info',
            duration: 4000
          })     
        }
      }

    })

  }
})