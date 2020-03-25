import request from '@/router/axios';
// import {baseUrl} from '@/config/env';
export const sendLogs = (testUrl,formData) => request({
  url: testUrl,
  method: 'post',
  data: formData
})
