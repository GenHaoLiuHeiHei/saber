import request from '@/router/axios';

export const getDetail = (type) => {
  return request({
    url: '/api/blade-customer/advertisementstat/detail',
    method: 'get',
    params: {
        type
    }
  })
}
