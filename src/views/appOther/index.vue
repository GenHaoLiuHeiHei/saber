<template>
  <div class="container">
    <div v-if="isNeizhi" class="topic">
      <p>点击右上角按钮，然后在弹出的菜单中，点击在浏览器中打开，即可安装</p>
      <div class="topimg">
        <img src="../../../public/img/appOther/alert-arrow.png" alt />
      </div>
    </div>
    <div class="contents">
      <div class="header"></div>
      <div class="home">
        <div class="box">
          <div class="appicon-bg">
            <img src="../../../public/img/appOther/120.png" class="appicon" />
          </div>
          <!-- <el-tabs 
            v-model="active"
          >
            <el-tab-pane
              v-for="(index, i) in group"
              :key="i"
              :title="index.name"
            />
          </el-tabs>-->
          <div style="height:3px;background:#f8f8f8" class="w100 m-b20"></div>
          <h2>奇妙谷-{{info.name}}</h2>
          <div class="breadcrumb">
            <li>版本：1.0</li>
            <li>大小：{{info.size}} MB</li>
            <li>更新时间：{{info.time}}</li>
          </div>
          <div class="down-btn-box">
            <el-button v-if="!isIOS" @click="onClick" type="primary" class="down">点击下载安装包</el-button>
            <div v-else class="iosbox">
              <a v-if="point === 0" @click="onIOSClick" class="down iosdown p-lr15">点击下载安装包</a>
              <div v-else class="mobox">
                <div>确认安装完成已后，再点击下方【立即信任】按钮，设置信任即可使用</div>
                <div class="down-btn-box">
                  <el-button
                    @click="onMob"
                    :loading="point===1"
                    loading-text="在安装请稍后..."
                    type="info"
                    class="down"
                  >立即信任</el-button>
                </div>
                <div class="redown">
                  [
                  <a @click="redown" href="javascript:;">重新安装</a> ]
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="botips">
            <div 
              v-if="active === 1"
              class="android-botips"
            >
              <p>点击后请使用普通下载，无需额外下载其他app</p>
            </div>
            <div 
              v-else
              class="ios-botips"
            >
              <div>
                <div><strong>苹果手机安装指南：</strong></div>
                <div class="text-center p-b30">
                  <video width="320" height="240" controls>
                    <source src="//obj.51baopen.com/app/video-ios-install.MP4" type="video/mp4">
                  </video>
                </div>
                <div>第1步：点击下载按钮，下载并安装App</div>
                <div>
                  <img src="../../../public/img/appOther/ios-h1.png" alt="">
                </div>
                <div>
                  <img src="../../../public/img/appOther/ios-h2.png" alt="">
                </div>
                <div>第2步：稍等片刻等待App安装完成后，点击蓝色按钮前去设置信任（若还未安装完，需稍等片刻，请确保已安装应用）</div>
                <div>
                  <img src="../../../public/img/appOther/ios-h3.png" alt="">
                </div>
                <div>
                  <img src="../../../public/img/appOther/ios-h4.png" alt="">
                </div>
                <div>第3步：找到设置应用对应的证书描述，并设置为信任，这样就完成了安装，可以使用啦~</div>
                <div>
                  <img src="../../../public/img/appOther/ios-h5.png" alt="">
                </div>
                <div>
                  <img src="../../../public/img/appOther/ios-h6.png" alt="">
                </div>
              </div>
            </div>
          </div>-->
        </div>
      </div>
    </div>
    <form :action="info.link" id="down-btn"></form>
    <a :href="info.link" id="down-btn-link"></a>
    <a :href="moblink" id="down-btn-moblink"></a>
    <a href="yyyard://h5/open?type=1&id=7" ref="openApp" style="dispaly: none"></a>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      ua: navigator.userAgent,
      active: 1,
      point: 0,
      // lineUrl: 'https://levi.gitee.io/appdown',
      group: [
        {
          name: "苹果App",
          size: 8.2,
          time: "12-13",
          link:
            "itms-services://?action=download-manifest&url=https://apps.apple.com/cn/app/id1520170264"
        },
        {
          name: "安卓App",
          size: 22.9,
          time: "12-17",
          link:
            "http://11download.oss-cn-hangzhou.aliyuncs.com/apk/yard_v1.0.apk"
        }
      ],
      moblink: "https://obj.51baopen.com/app/embedded_12.13.mobileprovision"
    };
  },
  computed: {
    isNeizhi() {
      const ua = this.ua.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return "weixin";
      } else if (ua.match(/QQ\//i) == "qq/") {
        return "QQ";
      } else if (ua.match(/Alipay/i) == "alipay") {
        return "alipay";
      }
      return false;
    },
    isAndroid() {
      return this.ua.indexOf("Android") > -1 || this.ua.indexOf("Adr") > -1;
    },
    isIOS() {
      return !!this.ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    },
    isSafari() {
      const ua = this.ua.toLowerCase();
      return (
        ua.indexOf("applewebkit") > -1 &&
        ua.indexOf("mobile") > -1 &&
        ua.indexOf("safari") > -1 &&
        ua.indexOf("linux") === -1 &&
        ua.indexOf("android") === -1
      );
    },
    info() {
      return this.group[this.active];
    }
  },
  created() {
    this.active = +this.isAndroid;
    console.log(this.isNeizhi, this.active);
  },
  methods: {
    onClick() {
      if (this.isIOS) {
        return this.$message({
          type: "warning",
          message: "请选择并下载安装苹果App~"
        });
      }
      if (this.isNeizhi) {
        return this.$message({
          type: "warning",
          message:
            "请点击右上角按钮，然后在弹出的菜单中，点击在浏览器中打开即可安装~"
        });
      }
      document.getElementById("down-btn").submit();
    },
    onIOSClick() {
      if (!this.isSafari) {
        return this.$message({
          type: "warning",
          message: "请使用苹果手机出厂自带的浏览器下载安装App~"
        });
      }
      document.getElementById("down-btn-link").click();
      this.point = 1;
      setTimeout(() => {
        if (this.point) {
          this.point = 2;
        }
      }, 5000);
    },
    onMob() {
      document.getElementById("down-btn-moblink").click();
    },
    redown() {
      this.point = 0;
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/.el-tabs--line {
  margin: -15px 0 25px;
  .el-tabs__line {
    background-color: #07c160;
  }
  .el-tab span {
    font-size: 16px;
  }
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
.home {
  padding: 40px 0;
  display: flex;
}
.box {
  display: flex;
  justify-content: center;
  flex-direction: column;
  flex: 1;
  h2 {
    text-shadow: none;
    text-align: center;
    margin-top: 5px;
    font-weight: 400;
    font-size: 24px;
    line-height: 33px;
    margin-bottom: 5px;
  }
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
  margin-top: -168px;
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
.breadcrumb {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  justify-content: center;
  li {
    color: #999;
    padding: 0 10px;
    font-size: 14px;
  }
}
.down-btn-box {
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 30px 0;
}
.down {
  font-size: 18px;
  // padding: 0 40px;
  border-radius: 30px;
}
.iosdown {
  color: #fff;
  background-color: #07c160;
  border: 1px solid #07c160;
  height: 42px;
  line-height: 42px;
  overflow: hidden;
}
.iosbox {
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex: 1;
}
.mobox {
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #1989fa;
  text-align: center;
  line-height: 1.6;
  flex: 1;
  padding: 0 40px;
}
.redown {
  color: #999;
  font-size: 14px;
  a {
    color: #999;
  }
}
.botips {
  padding: 0 20px 30px;
  font-size: 16px;
}
.android-botips {
  text-align: center;
  color: #999;
  font-size: 14px;
}
.ios-botips {
  display: block;
  line-height: 1.8;
  video {
    margin-bottom: 20px;
  }
  img {
    border: 1px solid #ddd;
    max-width: 80%;
    margin: 5px 0 15px;
  }
}
</style>