<template>
  <div>
    <div v-if="isBlackApp()">
      <div class="topic">
        <p>点击右上角按钮，然后在弹出的菜单中，点击在浏览器中打开</p>
        <div class="topimg">
          <img src="../../../public/img/appOther/alert-arrow.png" alt />
        </div>
      </div>
      <div class="header"></div>
      <div class="appicon-bg">
        <img src="../../../public/img/appOther/120.png" class="appicon" />
        <h2>奇妙谷</h2>
      </div>
    </div>
    <a v-else :href="schemeUrl" ref="openApp" style="dispaly: none"></a>
  </div>
</template>
<script>
export default {
  name: "sharePage",
  data() {
    return {
      isIos: false,
      isAndroid: false,
      schemeUrl: "yyyard://h5/open",
      downloadUrl: "https://b97f.t4m.cn",
      loading: ""
    };
  },
  created() {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1;
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    let strs = "";
    if (location.href.indexOf("?") != -1) {
      strs = location.href.split("?")[1];
    }
    debugger;
    if (isAndroid) {
      this.isAndroid = true;
      this.schemeUrl = "yyyard://h5/open?" + strs;
      this.downloadUrl = "http://11download.oss-cn-hangzhou.aliyuncs.com/apk/yard_v1.0_20200624.apk";
    }
    if (isIOS) {
      this.isIos = true;
      this.schemeUrl = "https://b97f.t4m.cn?" + strs;
      this.downloadUrl = "https://apps.apple.com/cn/app/id1520170264";
    }
  },
  mounted() {
    if (!this.isBlackApp()) {
      this.getMsg();
    }
    // else {
    //   //显示手动打开外置浏览器提示
    //   this.$router.push({path:'/down'})
    // }
  },

  methods: {
    GetMobelType() {
      var browser = {
        versions: (function() {
          var u = window.navigator.userAgent;
          return {
            trident: u.indexOf("Trident") > -1, //IE内核
            presto: u.indexOf("Presto") > -1, //opera内核
            Alipay: u.indexOf("Alipay") > -1, //支付宝
            webKit: u.indexOf("AppleWebKit") > -1, //苹果、谷歌内核
            gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1, //android终端或者uc浏览器
            iPhone: u.indexOf("iPhone") > -1 || u.indexOf("Mac") > -1, //是否为iPhone或者安卓QQ浏览器
            //iPhone: u.match(/iphone|ipod|ipad/),//
            iPad: u.indexOf("iPad") > -1, //是否为iPad
            webApp: u.indexOf("Safari") == -1, //是否为web应用程序，没有头部与底部
            weixin: u.indexOf("MicroMessenger") > -1, //是否为微信浏览器
            qq: u.match(/\sQQ/i) !== null, //是否QQ
            Safari: u.indexOf("Safari") > -1
            ///Safari浏览器,
          };
        })()
      };
      return browser;
    },
    isBlackApp() {
      var u = navigator.userAgent.toLowerCase();
      return /micromessenger/i.test(u) || u.indexOf("wx") > -1;
    },
    getMsg() {
      let this_ = this;
      this_
        .$confirm("是否打开或者下载奇妙谷APP", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          customClass: "confirmStyle",
          type: "warning"
        })
        .then(() => {
          this_.loading = this_.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          this_.jumpApp();
        })
        .catch(() => {
          this_.$router.push({ path: "/down" });
        });
    },
    // 跳转打开app
    jumpApp() {
      let this_ = this;
      let timeout = 2000;
      // eslint-disable-next-line no-unused-vars
      let timer = null;
      let startTime = Date.now();
      let GetMobelType = this.GetMobelType();
      if (GetMobelType.versions.android) {
        this_.$refs.openApp.click();
        timer = setTimeout(function() {
          let endTime = Date.now();
          this_.loading.close();
          if (!startTime || endTime - startTime < timeout + 300) {
            this_.getMsg();
            window.location.href = this_.downloadUrl;
          }
        }, timeout);
      }
      if (
        GetMobelType.versions.ios ||
        GetMobelType.versions.iPhone ||
        GetMobelType.versions.iPad
      ) {
        window.location.href = this_.schemeUrl; //唤起协议，由iOS小哥哥提供
        // timer = setTimeout(function() {
        //   // 两遍
        //   window.location.href = this_.downloadUrl;
        //   window.location.href = this_.downloadUrl;
        // }, timeout);
      }
    }
  }
};
</script>
<style lang="scss">
.confirmStyle {
  width: 80% !important;
}
.header {
  background: url("../../../public/img/appOther/top_bg_mobile_ratio.png") no-repeat
    scroll top center;
  background-size: 150% auto;
  height: 200px;
}
.topic {
  width: 100%;
  background: rgb(52, 52, 52);
  margin-left: 0px;
  margin-right: 0px;
  padding-top: 30px;
  padding-bottom: 30px;
  box-shadow: rgba(22, 22, 23, 0.62) 0px -10px 16px inset;
  position: relative;
}
.topic p {
  font-size: 14px;
  color: #999;
  margin: 0;
  padding: 0 50px 0 30px;
}
.topimg {
  width: 30px;
  position: absolute;
  top: 5px;
  right: 15px;
}
.topimg img {
  width: 100%;
}
.appicon-bg {
  background: url(../../../public/img/appOther/app_bg.png) no-repeat scroll top
    center;
  width: 160px;
  height: 160px;
  background-size: 100% auto;
  border: none;
  background-color: #ffffff;
  margin: auto;
  margin-top: -100px;
  margin-bottom: 30px;
  text-align: center;
}
.appicon {
  border: none;
  width: 100px;
  height: 100px;
  margin-top: 34px;
  border-radius: 24px;
}
</style>