
// const localIp = 'http://192.168.37.49:3004'
const localIp = 'https://foodking.program.az'

const categoryIp = `${localIp}/operation/api/`
const productIp = `${localIp}/operation/api/Product`
const imageIp = `${localIp}/operation/`
const authIp = `${localIp}/FoodKing/system/api/`
const commonIp = `${localIp}/operation/api/Common/`
const basketIp = `${localIp}/operation/api/Baskets/`
const paymentIp = `${localIp}/operation/api/`
const reportIp = `${localIp}/report/api/`
const contactUsIp = `${localIp}/operation/api/ContactUs`



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