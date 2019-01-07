
Page({

  data: {
    
  },

  scanQr(e) {
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['qrCode'],
      success(res) {
        // TODO: host should match too.
        let ident = res.result.match(/id=[0-9]+/g)

        wx.navigateTo({
          url: '../detail/detail?' + ident[0],
        })
      }
    })
  }

})