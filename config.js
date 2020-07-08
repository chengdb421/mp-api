const host = 'https://www.originsplatform.com:5120'
const base_api_url='https://mpapi.originsplatform.com';
const base_url='https://originsplatform.com';

const config = {
  uploadImageUrl: `${host}/mark/check`,
  productDetailUrl: `${host}/product/detail`,
  baseImageUrl:`${base_url}/GetImg.ashx?fileName=`,
  baseApiUrl:`${base_api_url}`,
  baseUrl:`${base_url}`
}

module.exports = config


