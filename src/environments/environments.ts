const categoryIp = 'http://192.168.37.49:3005/api/cardoperations/'
const productIp = 'http://192.168.37.49:3005/api/cardoperations/Product'
const authIp = 'http://192.168.37.49:3007/api/system/'
const commonIp = 'http://192.168.37.49:3006/api/common/'
const basketIp = 'http://192.168.37.49:3008/api/Baskets/'
const paymentIp = 'http://192.168.37.49:3010/api/orders/'

export const environment = {
  production: false,
  apiCategoryUrl:`${categoryIp}Category/`,
  apiProductUrl:`${productIp}/`,
  apiAdminAuthUrl:`${authIp}`,
  apiCommonUrl:`${commonIp}`,
  apibasketUrl:`${basketIp}`,
  apiPaymentUrl:`${paymentIp}`,
};