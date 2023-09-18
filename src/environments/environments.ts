const categoryIp = 'http://192.168.37.49:3005/api/cardoperations/'
const authIp = 'http://192.168.37.49:3007/api/system/'
const commonIp = 'http://192.168.37.49:3006/api/common/'

export const environment = {
  production: false,
  apiCategoryUrl:`${categoryIp}Category/`,
  apiAdminAuthUrl:`${authIp}`,
  apiCommonUrl:`${commonIp}`,
};