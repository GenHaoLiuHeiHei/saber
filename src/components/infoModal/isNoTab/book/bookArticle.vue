<template>
  <basic-container class="p-t0">
    <div class="infinite-list-wrapper" id="bookArticle">
      <ul
        class="list"
        v-infinite-scroll="load"
        :infinite-scroll-disabled="disabled"
        v-loading.fullscreen.lock="loading"
      >
        <li v-for="(item, index) in data" :key="index" class="list-item p-b15">
          <div class="m-b10">{{item.content}}</div>
          <el-row>
            <el-col :span="4" class="m-r10 bookArticleImg">
              <img class="w100" @click="showBigDialog('isImg', index)" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1585213171260&di=0ddb022c4d097a881c769a62f44f8bfb&imgtype=0&src=http%3A%2F%2Fpic1.win4000.com%2Fwallpaper%2F0%2F582d1d1458e84.jpg" alt="">
            </el-col>
            <el-col :span="4" class="m-r10 bookArticleImg">
               <div class="videoImg" @click="showBigDialog('isVideo')">
                 <i class="el-icon-caret-right color-white"></i>
               </div>
              <img class="w100" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1585213171260&di=0ddb022c4d097a881c769a62f44f8bfb&imgtype=0&src=http%3A%2F%2Fpic1.win4000.com%2Fwallpaper%2F0%2F582d1d1458e84.jpg" alt="">
            </el-col>
          </el-row>
          <div class="flex" style="justify-content: space-between;flex-wrap:wrap">
            <div class="m-r10 isColorShow">
              展示次数：1
            </div>
             <div class="m-r10 isColorShow">
              分享次数：1
            </div>
             <div class="m-r10 isColorShow" @click="showBigDialog('bookComment', index)">
              评论数量：1
            </div>
             <div class="m-r10 isColorShow">
              点赞数量：1
            </div>
             <div class="color-blue">
              发布时间：2020-11-11 11:11:11
            </div>
          </div>
          <div class="flex m-t05" style="justify-content: space-between;flex-wrap:wrap">
            <div class="m-r10 isColorShow color-red"  >
              举报次数：1
            </div>
             <div class="m-r10 isColorShow color-red">
              判定违规：屏蔽
            </div>
          </div>
        </li>
      </ul>
      <p v-if="loading" class="text-center">加载中...</p>
      <div v-if="noMore" class="text-center">
        <div v-if="data && data.length" class="p-t10">没有更多了</div>
        <div v-else>
          <avue-empty></avue-empty>
        </div>
      </div>
    </div>
    <el-dialog
      :title="title"
      :visible.sync="isShowComment"
      class="dialogComment"
      :modal-append-to-body="false"
      @close="closeIsShowComment"
    >
      <basic-container v-if="isShowComment">
        <!-- bigDialogType:isVideo -->
        <div v-if="bigDialogType === 'isVideo'">
          <video class="w100" height="400" controls>
            <source src="../../../../static/659a8f0fcdba06a78cd69693529903ca.mp4" type="video/mp4">
            <source src="../../../../static/659a8f0fcdba06a78cd69693529903ca.mp4" type="video/ogg">
            您的浏览器不支持 video 标签。
          </video>
        </div>
        <div v-else-if="bigDialogType === 'bookComment'">
          <bookComment :formDatas="bigDialogForm"></bookComment>
        </div>
      </basic-container>
    </el-dialog>
  </basic-container>
</template>
<script>
// 博文
import { getLikeList } from "@/api/customer/customer";
import bookComment from '@/components/infoModal/isTab/book/bookComment';
export default {
  name: "bookArticle",
  components : {
    bookComment
  },
  props: {
    formDatas: {
      type: Object,
      required: true
    },
    seachForm: {
      type: Object,
      default() {
        return {};
      }
    },
    isSeach: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  watch: {
    isSeach: {
      handler(newValue) {
        if (newValue) {
          this.page.currentPage = 1;
          Object.assign(this.query, this.seachForm);
          this.onLoad(this.page);
        }
        this.$emit("changeIsSeach", false);
      }
    }
  },
  data() {
    return {
      isShowComment: false,
      title: '',
      query: {},
      loading: false,
      noMore: false,
      bigDialogType: '',
      bigDialogForm: {},
      page: {
        pageSize: 10,
        currentPage: 0,
        total: 0
      },
      data: [],
      datas: [
        {
          url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1585213171260&di=0ddb022c4d097a881c769a62f44f8bfb&imgtype=0&src=http%3A%2F%2Fpic1.win4000.com%2Fwallpaper%2F0%2F582d1d1458e84.jpg'
        },
        {
          url: 'http://pic1.win4000.com/wallpaper/c/59a4d758ea359.jpg'
        }
      ]
    };
  },
  computed: {
    disabled() {
      return this.loading || this.noMore;
    }
  },
  methods: {
      // 关闭模态框
    closeIsShowComment () {
      this.isShowComment = false;
    },
    showBigDialog (bigDialogType, index = 0) {
      switch (bigDialogType) {
        case 'isVideo': 
          this.title = '视频预览';
          this.bigDialogType = bigDialogType;
          this.isShowComment = true;
          break
        case 'bookComment': 
          this.title = '评论列表';
          this.bigDialogForm = this.data[index];
          this.bigDialogType = bigDialogType;
          this.isShowComment = true;
          break
        case 'isImg': 
          this.$ImagePreview(this.datas, index);
          break
      }
      
    },
    load() {
      if (this.disabled) return;
      this.page.currentPage++;
      this.onLoad(this.page);
    },
    onLoad(page, params = {}) {
      let this_ = this;
      if (this_.loading) return;
      this_.loading = true;
      getLikeList(
        page.currentPage,
        page.pageSize,
        this_.formDatas.id,
        Object.assign(params, this_.query)
      )
        .then(res => {
          const data = res.data.data;
          this_.page.total = data.total;
          this_.loading = false;
          if (data.records.length !== 0) {
            if (this_.page.currentPage === 1) {
              this_.data = data.records;
              if (this_.data.length < this_.page.pageSize) this_.noMore = true;
            } else {
              this_.data = this_.data.concat(data.records);
            }
            this_.$emit("changeIsSeach", false);
          } else {
            if (data.total === 0) this_.data = [];
            this_.noMore = true;
          }
        })
        .catch(err => {
          console.log(err);
          this_.loading = false;
        });
    }
  }
};
</script>
<style>
.avue-image-preview{
  z-index: 3000 !important;
}
</style>
<style scoped lang="scss">
#bookArticle {
  max-height: 500px;
  overflow: auto;
   
}
.bookArticleImg {
  position: relative;
  img {
    display: block;
  }
  .videoImg{
    position: absolute;
    height: 100%;
    width: 100%;
    background: rgba($color: #000000, $alpha: 0.5);
    display:flex; 
    justify-content:center; //内容水平居中 
    align-items:center; //内容垂直居中 
    i {
      font-size: 30px;
    }
  }
}
</style>