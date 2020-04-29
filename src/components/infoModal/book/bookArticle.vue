<template>
  <div class="p-t0">
    <div class="infinite-list-wrapper p-lr15" id="bookArticle">
      <ul
        class="list"
        v-infinite-scroll="load"
        :infinite-scroll-disabled="disabled"
        v-loading.fullscreen.lock="loading"
      >
        <li v-for="(item, index) in data" :key="index" class="list-item p-b15 m-b20">
          <div class="m-b15">{{item.blogContent}}</div>
          <el-row v-if="item.contentType === 1">
            <el-col :span="4" v-for="(itemSrc, itemSrcIndex) in item.showList" :key="itemSrcIndex" class="m-r10 bookArticleImg" style="max-height: 80px;overflow: hidden;">
              <img class="w100" @click="showBigDialog('isImg', index, itemSrcIndex)" :src="itemSrc.url" alt="" >
            </el-col>
          </el-row>
          <el-row v-else-if="item.contentType === 2">
            <el-col :span="4" class="m-r10 bookArticleImg">
               <div class="videoImg" @click="showBigDialog('isVideo')">
                 <i class="el-icon-caret-right color-white"></i>
               </div>
              <img class="w100" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1585213171260&di=0ddb022c4d097a881c769a62f44f8bfb&imgtype=0&src=http%3A%2F%2Fpic1.win4000.com%2Fwallpaper%2F0%2F582d1d1458e84.jpg" alt="">
            </el-col>
          </el-row>
          <div class="flex m-t10" style="justify-content: space-between;flex-wrap:wrap">
            <div class="m-r10">
              展示次数：{{item.blogBrowse}}
            </div>
            <!-- <div class="m-r10 isColorShow" @click="showBigDialog('blogShare', index)">
              分享次数：{{item.blogForwardSum}}
            </div> -->
             <div class="m-r10 isColorShow" @click="showBigDialog('blogComment', index)">
              评论数量：{{item.blogCommentSum}}
            </div>
             <div class="m-r10 isColorShow" @click="showBigDialog('blogLike', index)">
              点赞数量：{{item.blogPraiseSum}}
            </div>
             <div>
              发布时间：{{item.createTime}}
            </div>
          </div>
          <div class="flex m-t10" style="justify-content: space-between;flex-wrap:wrap">
            <div class="m-r10 isColorShow color-red" @click="showBigDialog('blogReport', index)">
              举报次数：{{item.informNum || 0}}
            </div>
            <div class="isColorShow" @click="showBigDialog('blogNotBlockComments', index)" v-if="item.blogStatus === 2">
              不违规
            </div>
            <div class="isColorShow color-red" @click="showBigDialog('blogBlockComments', index)"  v-else>
              判定违规
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
      :modal="false" 
      :close-on-click-modal="false"
      @close="closeIsShowComment"
    >
      <div v-if="isShowComment">
        <!-- bigDialogType:isVideo -->
        <div v-if="bigDialogType === 'isVideo'">
          <blogVideo :formDatas="bigDialogForm" tofrom="article" ></blogVideo>
        </div>
        <div v-else-if="bigDialogType === 'blogShare'">
          <blogShare :formDatas="bigDialogForm" @closeDialogAddgsVisible="closeIsShowComment"></blogShare>
        </div>
        <div v-else-if="bigDialogType === 'blogLike'">
          <blogLike :formDatas="bigDialogForm" tofrom="article" @closeDialogAddgsVisible="closeIsShowComment"></blogLike>
        </div>
        <div v-else-if="bigDialogType === 'blogReport'">
          <blogReport :formDatas="bigDialogForm" @closeDialogAddgsVisible="closeIsShowComment"></blogReport>
        </div>
        <div v-else-if="bigDialogType === 'blogComment'">
          <blogComment :formDatas="bigDialogForm" @closeDialogAddgsVisible="closeIsShowComment"></blogComment>
        </div>
        <div v-else-if="bigDialogType === 'blogBlockComments'">
          <blogBlockComments :formDatas="bigDialogForm" @closeDialogAddgsVisible="closeIsShowComment"></blogBlockComments>
        </div>
        <div v-else-if="bigDialogType === 'blogNotBlockComments'">
          <blogNotBlockComments :formDatas="bigDialogForm" @closeDialogAddgsVisible="closeIsShowComment"></blogNotBlockComments>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// 博文
import { getList } from "@/api/customer/blog";
import blogShare from '@/components/infoModal/blog/blogShare';
import blogLike from '@/components/infoModal/blog/blogLike';
import blogReport from '@/components/infoModal/blog/blogReport';
import blogComment from '@/components/infoModal/blog/blogComment';
import blogVideo from '@/components/infoModal/blog/blogVideo';
import blogBlockComments from '@/components/infoModal/blog/blogBlockComments';
import blogNotBlockComments from '@/components/infoModal/blog/blogNotBlockComments';

export default {
  name: "bookArticle",
  components : {
    blogComment,
    blogReport,
    blogShare,
    blogLike,
    blogVideo,
    blogNotBlockComments,
    blogBlockComments
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
        console.log(this.seachForm);
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
    };
  },
  computed: {
    disabled() {
      return this.loading || this.noMore;
    }
  },
  methods: {
      // 关闭模态框
    closeIsShowComment (res) {
      this.title = "";
      this.isShowComment = false;
      if (res) this.onLoad(this.page);
    },
    showBigDialog (bigDialogType, index = 0, itemSrcIndex) {
      switch (bigDialogType) {
        case 'isVideo': 
          this.title = '视频预览';
          this.bigDialogForm = this.data[index];
          this.bigDialogType = bigDialogType;
          this.isShowComment = true;
          break
        case 'blogShare': 
          this.title = '分享列表';
          this.bigDialogForm = this.data[index];
          this.bigDialogType = bigDialogType;
          this.isShowComment = true;
          break
        case 'blogLike': 
          this.title = '点赞列表';
          this.bigDialogForm = this.data[index];
          this.bigDialogType = bigDialogType;
          this.isShowComment = true;
          break
        case 'blogReport': 
          this.title = '举报列表';
          this.bigDialogForm = this.data[index];
          this.bigDialogType = bigDialogType;
          this.isShowComment = true;
          break
        case 'blogComment': 
          this.title = '评论列表';
          this.bigDialogForm = this.data[index];
          this.bigDialogType = bigDialogType;
          this.isShowComment = true;
          break
        case 'blogNotBlockComments': 
          this.title = '不违规';
          this.bigDialogForm = this.data[index];
          this.bigDialogType = bigDialogType;
          this.isShowComment = true;
          break
        case 'blogBlockComments': 
          this.title = '屏蔽';
          this.bigDialogForm = this.data[index];
          this.bigDialogType = bigDialogType;
          this.isShowComment = true;
          break
        case 'isImg': 
          this.$ImagePreview(this.data[index].showList, itemSrcIndex);
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
      console.log(this_.formDatas);
      if (this_.loading) return;
      this_.loading = true;
      getList(
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
          this_.data.map((v) => {
            v.showList = [];
            v.pictrueList.map(s => {
              if (s.blogPictrueUrl && s.blogPictrueUrl.length) {
                v.showList.push({
                  url: s.blogPictrueUrl
                })
              }
            })
          })
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