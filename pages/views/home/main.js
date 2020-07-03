// pages/views/home/main.js
const config = require('../../../config.js')
Page({
  /**
   * 页面的初始数据
   */
  app: getApp(),
  data: {
    rowsData: null,
    windowHeight: 0,
    base_api_url: config.baseApiUrl,
    base_url: config.baseUrl,
    base_image_url: config.baseImageUrl,
    id: ""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id="18082201394";
    try {
      var qrcode = decodeURIComponent(options.q);
       var paramvalue=  this.getUrlParamValue(qrcode,"id");
      id =paramvalue || id;
    } catch (error) {
      console.log(error);
    }
    let that = this;
    // 获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        });
      }
    });
    this.getWxHomePage(id);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  getWxHomePage: function (id) {
    wx.showLoading({
      title: '加载中...',
    })
    this.setData({
      id: id
    });
    var that = this;
    wx.request({
      url: this.data.base_api_url + '/PhoneHpSettingManage/GetPhoneHomePageByLabelInfoNum',
      data: {
        labelInfoNum: id
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        if (res.data.success) {
          var rows = that.convert2TemplateData(res.data);
          that.setData({
            rowsData: rows
          });
          console.log(rows);
        }
      },
      complete() {
        wx.hideLoading();
      }
    })
  },
  convert2TemplateData: function (data) {
    var rows = new Array(data.count);
    for (let index = 0; index < rows.length; index++) {
      rows[index] = {
        cols: [],
        height: 0,
        hasNull: true
      };
    }
    for (var i = 0; i < data.content.length; i++) {
      var item = data.content[i];
      var rowIndex = item.RowIndex,
        columnIndex = item.ColumnIndex;
      rows[rowIndex].hasNull = false;
      rows[rowIndex].height = this.data.windowHeight * item.RowPercentage / 100;
      rows[rowIndex].cols[columnIndex] = {
        rowIndex: rowIndex,
        columnIndex: columnIndex,
        rowPercentage: item.RowPercentage,
        columnPercentage: item.ColumnPercentage,
        photoPath: this.data.base_image_url + item.PhotoPath,
        rowAcrossNum: item.RowAcrossNum,
        linkUrl: this.convert2AbsoluteUrl(item.LinkUrl)
      };
    }
    return rows;
  },

  convert2AbsoluteUrl: function (url) {
    var index = url.indexOf("http");
    var lookup = url.indexOf("#");
    var lookup2=url.indexOf("?");
    if (index === 0 || lookup === 0) {
      return url;
    } else if(lookup2>=0){
      return this.data.base_url + url + "&id=" + this.data.id
    }
    else {
      return this.data.base_url + url + "?id=" + this.data.id
    }
  },
  getUrlParamValue: function (url,paramname) {
    if (url) {
      var reg = new RegExp("(^|&)" + paramname + "=([^&]*)(&|$)");
      var index=url.indexOf("?");
      if(index>=0){
        var r = url.substr(index+1).match(reg);
        if (r != null) return unescape(r[2]);
      } 
      return null;
    }
    return null;
  },
  navigateTo: function (e) {
    var linkUrl = e.currentTarget.dataset.link;
    if (linkUrl === "#") return;
    else if (linkUrl === "#miniprogram") { //调用小程序
         wx.showToast({title:"小程序未完功能",duration:2000});
    } else {
      this.app.globeData = {
        linkUrl: linkUrl
      };
      wx.showLoading("载入页面中...");
      wx.navigateTo({
        url: '../webview/webview',
        complete: function (e) {
          wx.hideLoading();
        }
      })
    }
  }


})