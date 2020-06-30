import Layout from '@/page/index/'
export default [{
    path: '/login',
    name: '登录页',
    component: () =>
        import( /* webpackChunkName: "page" */ '@/page/login/index'),
    meta: {
        keepAlive: true,
        isTab: false,
        isAuth: false
    }
},
{
    path: '/lock',
    name: '锁屏页',
    component: () =>
        import( /* webpackChunkName: "page" */ '@/page/lock/index'),
    meta: {
        keepAlive: true,
        isTab: false,
        isAuth: false
    }
},
{
    path: '/404',
    component: () =>
        import( /* webpackChunkName: "page" */ '@/components/error-page/404'),
    name: '404',
    meta: {
        keepAlive: true,
        isTab: false,
        isAuth: false
    }

},
{
    path: '/down',
    name: 'APP下载',
    component: () =>
        import( /* webpackChunkName: "page" */ '@/views/appOther/index'),
    meta: {
        keepAlive: false,
        isTab: false,
        isAuth: false
    }
},
{
    path: '/share',
    name: 'APP分享',
    component: () =>
        import( /* webpackChunkName: "page" */ '@/views/appOther/share'),
    meta: {
        keepAlive: false,
        isTab: false,
        isAuth: false
    }
},
{
    path: '/appAgreement',
    name: 'APP用户协议',
    component: () =>
        import( /* webpackChunkName: "page" */ '@/views/appOther/appAgreement'),
    meta: {
        keepAlive: false,
        isTab: false,
        isAuth: false
    }
},
{
    path: '/rechargeAgreement',
    name: 'APP用户充值协议',
    component: () =>
        import( /* webpackChunkName: "page" */ '@/views/appOther/rechargeAgreement'),
    meta: {
        keepAlive: false,
        isTab: false,
        isAuth: false
    }
},
{
    path: '/403',
    component: () =>
        import( /* webpackChunkName: "page" */ '@/components/error-page/403'),
    name: '403',
    meta: {
        keepAlive: true,
        isTab: false,
        isAuth: false
    }
},
{
    path: '/500',
    component: () =>
        import( /* webpackChunkName: "page" */ '@/components/error-page/500'),
    name: '500',
    meta: {
        keepAlive: true,
        isTab: false,
        isAuth: false
    }
},
{
    path: '/',
    name: '主页',
    redirect: '/wel'
},
{
    path: '/myiframe',
    component: Layout,
    redirect: '/myiframe',
    children: [{
        path: ":routerPath",
        name: 'iframe',
        component: () =>
            import( /* webpackChunkName: "page" */ '@/components/iframe/main'),
        props: true
    }]

},
{
    path: '*',
    redirect: '/404'
}
]