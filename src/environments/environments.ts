
// const localIp = 'http://192.168.37.49:3004'
const localIp = 'https://foodking.program.az'

const categoryIp = `${localIp}/cardoperations/api/`
const productIp = `${localIp}/cardoperations/api/Product`
const imageIp = `${localIp}/cardoperations/`
const authIp = `${localIp}/FoodKing/system/api/`
const commonIp = `${localIp}/common/api/`
const basketIp = `${localIp}/basket/api/Baskets/`
const paymentIp = `${localIp}/payment/api/`
const reportIp = `${localIp}/report/api/`
const contactUsIp = `${localIp}/cardoperations/api/ContactUs`



export const environment = {
  production: false,
  apiCategoryUrl:`${categoryIp}Category/`,
  apiProductUrl:`${productIp}/`,
  imageIpUrl:`${imageIp}`,
  apiAdminAuthUrl:`${authIp}`,
  apiCommonUrl:`${commonIp}`,
  apibasketUrl:`${basketIp}`,
  apiPaymentUrl:`${paymentIp}`,
  apiReportUrl:`${reportIp}`,
  apiContactUsUrl:`${contactUsIp}`,
};