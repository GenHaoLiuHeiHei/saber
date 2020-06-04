<template>
  <div>
      <a href="yyyard://h5/open?type=1&id=7" ref="openApp" style="dispaly: none"></a>
  </div>
</template>
<script>
export default {
  name: "sharePage",
  data() {
    return {
      isIos: false,
      isAndroid: false,
      schemeUrl: "",
      downloadUrl: "",
      loading: ''
    };
  },
  created() {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1;
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isAndroid) {
      this.isAndroid = true;
      this.schemeUrl = "yyyard://h5/open?type=1&id=7";
      this.downloadUrl = "http://11download.oss-cn-hangzhou.aliyuncs.com/apk/yard_v1.0.apk";
    }
    if (isIOS) {
      this.isIos = true;
      this.schemeUrl = "你的iosSchemeUrl";
      this.downloadUrl = "你的iosapp下载地址";
    }
  },
  mounted() {
     
    if (!this.isBlackApp()) {
      this.getMsg();
    } else {
      //显示手动打开外置浏览器提示
      this.$router.push({path:'/down'})   
    }
  },

  methods: {
    GetMobelType()  {                
      var browser = {                    
        versions: function() {                        
            var  u  =  window.navigator.userAgent;                        
            return  {                            
                trident:  u.indexOf('Trident')  >  -1, //IE内核
                presto:  u.indexOf('Presto')  >  -1, //opera内核
                Alipay:  u.indexOf('Alipay')  >  -1, //支付宝
                webKit:  u.indexOf('AppleWebKit')  >  -1, //苹果、谷歌内核
                gecko:  u.indexOf('Gecko')  >  -1  &&  u.indexOf('KHTML')  ==  -1, //火狐内核
                mobile:  !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios:  !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android:  u.indexOf('Android')  >  -1  ||  u.indexOf('Linux')  >  -1, //android终端或者uc浏览器
                iPhone:  u.indexOf('iPhone')  >  -1  ||  u.indexOf('Mac')  >  -1, //是否为iPhone或者安卓QQ浏览器
                //iPhone: u.match(/iphone|ipod|ipad/),//
                iPad:  u.indexOf('iPad')  >  -1, //是否为iPad
                webApp:  u.indexOf('Safari')  ==  -1, //是否为web应用程序，没有头部与底部
                weixin:  u.indexOf('MicroMessenger')  >  -1, //是否为微信浏览器
                qq: u.match(/\sQQ/i) !== null, //是否QQ
                Safari:  u.indexOf('Safari')  >  -1,
                  ///Safari浏览器,
            };                    
        }()                
      };   
      return browser;            
    },
    isBlackApp() {
      return false
      var u = navigator.userAgent.toLowerCase();
      return (
        /micromessenger/i.test(u) ||
        u.indexOf("uc") > -1 
      );
    },
    getMsg () {
      let this_ = this;
      this_.$confirm('是否打开或者下载院子APP', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'confirmStyle',
          type: 'warning'
        }).then(() => {
          this_.loading = this_.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          this_.jumpApp();
        }).catch(() => {
          this_.$router.push({path:'/down'})         
        });
    },
    // 跳转打开app
    jumpApp(t) {
      let this_ = this;
      let timeout = 2000;
      // eslint-disable-next-line no-unused-vars
      let timer = null;
      let startTime = Date.now();
      let GetMobelType = this.GetMobelType();
      if(GetMobelType.versions.android) {
          this_.$refs.openApp.click();
          timer = setTimeout(function() {
              let endTime = Date.now();
              this_.loading.close();
              if(!startTime || endTime - startTime < timeout + 300) {
                  // this_.$router.push({path:'/down'});
                  this_.getMsg();
                  window.location.href = this_.downloadUrl;
              }
          }, timeout);
      }
      if(GetMobelType.versions.ios || GetMobelType.versions.iPhone || GetMobelType.versions.iPad) {
          window.location.href = t; //唤起协议，由iOS小哥哥提供
          timer = setTimeout(function() {
            // 两遍
            window.location.href = "ios下载的链接";
            window.location.href = "ios下载的链接";
          }, timeout);
        }
    }

  }
};
</script>
<style lang="scss">
.confirmStyle {
  width: 80% !important;
}
</style>