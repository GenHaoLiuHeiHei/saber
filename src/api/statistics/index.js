import request from '@/router/axios';

export const getAdvertisingDetail = (type) => {
  return request({
    url: '/api/blade-customer/advertisementstat/detail',
    method: 'get',
    params: {
        type
    }
  })
}

export const getIncomeHeadDetail = (type) => {
  return request({
    url: '/api/blade-customer/statistics/income/head',
    method: 'get',
    params: {
        type
    }
  })
}

export const getIncomeOderSumDetail = (type) => {
  return request({
    url: '/api/blade-customer/statistics/income/oderSum',
    method: 'get',
    params: {
        type
    }
  })
}

export const getIncomeProportionSumDetail = (type) => {
  return request({
    url: '/api/blade-customer/statistics/income/proportion',
    method: 'get',
    params: {
        type
    }
  })
}

// 注册用户-活跃用户-当日
export const getCustomerDailyCount = (type) => {
  return request({
    url: '/api/blade-customer/statistics/customer-daily-count',
    method: 'get',
    params: {
        type
    }
  })
}

// 注册用户-活跃用户-周
export const getCustomerWeekilyCount = (type) => {
  return request({
    url: '/api/blade-customer/statistics/customer-weekily-count',
    method: 'get',
    params: {
        type
    }
  })
}

// 上周注册列表
export const getCustomerLastWeekRegList = (type) => {
  return request({
    url: '/api/blade-customer/statistics/customer-last-week-reg-list',
    method: 'get',
    params: {
        type
    }
  })
}

// 上周留存率列表
export const getCustomerLastWeekKeepList = (type) => {
  return request({
    url: '/api/blade-customer/statistics/customer-last-week-keep-list',
    method: 'get',
    params: {
        type
    }
  })
}

// 收入付费浏览的人数
export const getCustomerCount = (type) => {
  return request({
    url: '/api/blade-customer/statistics/income/CustomerCount',
    method: 'get',
    params: {
        type
    }
  })
}

// 收入付费浏览的人数
export const getPfdSum = (type) => {
  return request({
    url: '/api/blade-customer/statistics/pfdSum',
    method: 'get',
    params: {
        type
    }
  })
}

// 收入付费浏览的人数
export const getExposureSum = (type) => {
  return request({
    url: '/api/blade-customer/statistics/exposureSum',
    method: 'get',
    params: {
        type
    }
  })
}

