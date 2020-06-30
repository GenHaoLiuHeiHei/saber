<template>
  <div>
      <a href="yyyard://h5/open?type=1&id=7" ref="openApp" style="dispaly: none"></a>
  </div>
</template>
<script>
import { LaunchApp, detector, copy, ua, isAndroid, isIos, inWeixin, inWeibo, supportLink } from 'web-launch-app';
export default {
  name: "sharePage",
  data() {
    return {
      lanchApp: ''
    }
  },
  created() {
    this.lanchApp = new LaunchApp();
    
  },
  mounted() {
  this.$confirm('是否打开APP', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.lanchApp.open({
          useYingyongbao: inWeixin && isAndroid,
          launchType: {
              ios: inWeixin ? 'store' : 'link',
              android: inWeixin ? 'store' : 'scheme',
          },
          autodemotion: false,
          scheme: 'yyyard://h5/open?type=1&id=7',
          url: 'https://link.domain.com/path?k=v',
          param:{
              k2: 'v2'
          },
          timeout: 2000,
          pkgs:{
              android: 'http://11download.oss-cn-hangzhou.aliyuncs.com/apk/yard_v1.0.apk',
              ios: 'https://itunes.apple.com/cn/app/appid123?mt=8',
              yyb: 'http://11download.oss-cn-hangzhou.aliyuncs.com/apk/yard_v1.0.apk'
          }
      }, (s, d, url) => {
          console.log('callbackout', s, d, url);
          s != 1 && copy(url);
          return 2;
      });
    }).catch(() => {
      // 下载
      alert(1)
      this.lanchApp.download();
    });
  },

  methods: {
    

  }
};
</script>