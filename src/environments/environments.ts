const categoryIp = 'http://192.168.37.49:3009/cardoperations/api/'
const productIp = 'http://192.168.37.49:3009/cardoperations/api/Product'
const imageIp = 'http://192.168.37.49:3009/cardoperations/'
const authIp = 'http://192.168.37.49:3009/FoodKing/system/api/'
const commonIp = 'http://192.168.37.49:3009/common/api/'
const basketIp = 'http://192.168.37.49:3009/basket/api/Baskets/'
const paymentIp = 'http://192.168.37.49:3009/payment/api/'



export const environment = {
  production: false,
  apiCategoryUrl:`${categoryIp}Category/`,
  apiProductUrl:`${productIp}/`,
  imageIpUrl:`${imageIp}/`,
  apiAdminAuthUrl:`${authIp}`,
  apiCommonUrl:`${commonIp}`,
  apibasketUrl:`${basketIp}`,
  apiPaymentUrl:`${paymentIp}`,
};