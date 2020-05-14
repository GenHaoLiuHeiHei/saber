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
          <div class="m-b15" v-if="!item.langContent">{{item.blogContent}}</div>
          <div class="m-b15" v-else v-html="item.langContent"></div>
          <el-row v-if="item.contentType === 1">
            <el-col :span="4" v-for="(itemSrc, itemSrcIndex) in item.showList" :key="itemSrcIndex" class="m-r10 bookArticleImg" style="max-height: 80px;overflow: hidden;">
              <img class="w100" @click="showBigDialog('isImg', index, itemSrcIndex)" :src="itemSrc.url" alt="" >
            </el-col>
          </el-row>
          <el-row v-else-if="item.contentType === 2">
            <el-col :span="4" class="m-r10 bookArticleImg">
               <div class="videoImg" @click="showBigDialog('isVideo', index)">
                 <i class="el-icon-caret-right color-white"></i>
               </div>
              <img class="w100" :src="item.blogVideoImage" alt="">
            </el-col>
          </el-row>
          <div class="flex m-t10" style="justify-content: space-between;flex-wrap:wrap">
            <div class="m-r10">
              展示次数：{{item.blogBrowse}}
            </div>
            <!-- <div class="m-r10 isColorShow" @click="showBigDialog('blogAllShare', index)">
              分享次数：{{item.blogForwardSum}}
            </div> -->
             <div class="m-r10 isColorShow" @click="showBigDialog('blogAllComment', index)">
              评论数量：{{item.blogCommentSum}}
            </div>
             <div class="m-r10 isColorShow" @click="showBigDialog('blogAllLike', index)">
              点赞数量：{{item.blogPraiseSum}}
            </div>
             <div>
              发布时间：{{item.createTime}}
            </div>
          </div>
          <div class="flex m-t10" style="justify-content: space-between;flex-wrap:wrap">
            <div class="m-r10 isColorShow color-red" @click="showBigDialog('blogAllReport', index)">
              举报次数：{{item.informNum || 0}}
            </div>
            <div class="isColorShow" @click="showBigDialog('blogAllNotBlockComments', index)" v-if="item.blogStatus === 2">
              不违规
            </div>
            <div class="isColorShow color-red" @click="showBigDialog('blogAllBlockComments', index)"  v-else>
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
          <blogAllVideo :formDatas="bigDialogForm" tofrom="article"></blogAllVideo>
        </div>
        <div v-else-if="bigDialogType === 'blogAllShare'">
          <blogAllShare :formDatas="bigDialogForm" @closeDialogAddgsVisible="closeIsShowComment" tofrom="article"></blogAllShare>
        </div>
        <div v-else-if="bigDialogType === 'blogAllLike'">
          <blogAllLike :formDatas="bigDialogForm" tofrom="article" @closeDialogAddgsVisible="closeIsShowComment"></blogAllLike>
        </div>
        <div v-else-if="bigDialogType === 'blogAllReport'">
          <blogAllReport :formDatas="bigDialogForm" @closeDialogAddgsVisible="closeIsShowComment" tofrom="article"></blogAllReport>
        </div>
        <div v-else-if="bigDialogType === 'blogAllComment'">
          <blogAllComment :formDatas="bigDialogForm" @closeDialogAddgsVisible="closeIsShowComment" tofrom="article"></blogAllComment>
        </div>
        <div v-else-if="bigDialogType === 'blogAllBlockComments'">
          <blogAllBlockComments :formDatas="bigDialogForm" @closeDialogAddgsVisible="closeIsShowComment" tofrom="article"></blogAllBlockComments>
        </div>
        <div v-else-if="bigDialogType === 'blogAllNotBlockComments'">
          <blogAllNotBlockComments :formDatas="bigDialogForm" @closeDialogAddgsVisible="closeIsShowComment" tofrom="article"></blogAllNotBlockComments>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// 博文
import { getList } from "@/api/customer/blog";
import blogAllShare from '@/components/infoModal/blog/blogAllShare';
import blogAllLike from '@/components/infoModal/blog/blogAllLike';
import blogAllReport from '@/components/infoModal/blog/blogAllReport';
import blogAllComment from '@/components/infoModal/blog/blogAllComment';
import blogAllVideo from '@/components/infoModal/blog/blogAllVideo';
import blogAllBlockComments from '@/components/infoModal/blog/blogAllBlockComments';
import blogAllNotBlockComments from '@/components/infoModal/blog/blogAllNotBlockComments';

export default {
  name: "bookArticle",
  components : {
    blogAllComment,
    blogAllReport,
    blogAllShare,
    blogAllLike,
    blogAllVideo,
    blogAllNotBlockComments,
    blogAllBlockComments
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
        case 'blogAllShare': 
          this.title = '分享列表';
          this.bigDialogForm = this.data[index];
          this.bigDialogType = bigDialogType;
          this.isShowComment = true;
          break
        case 'blogAllLike': 
          this.title = '点赞列表';
          this.bigDialogForm = this.data[index];
          this.bigDialogType = bigDialogType;
          this.isShowComment = true;
          break
        case 'blogAllReport': 
          this.title = '举报列表';
          this.bigDialogForm = this.data[index];
          this.bigDialogType = bigDialogType;
          this.isShowComment = true;
          break
        case 'blogAllComment': 
          this.title = '评论列表';
          this.bigDialogForm = this.data[index];
          this.bigDialogType = bigDialogType;
          this.isShowComment = true;
          break
        case 'blogAllNotBlockComments': 
          this.title = '不违规';
          this.bigDialogForm = this.data[index];
          this.bigDialogType = bigDialogType;
          this.isShowComment = true;
          break
        case 'blogAllBlockComments': 
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
            if (v.contentType === 3) {
              v.langContent = '';
              JSON.parse(v.blogContent).map(s => {
                let tag = '';
                if (s.type === 1) {
                  tag = `<p>${s.content}</p>`
                } else if (s.type === 2) {
                  tag = `<img src="${s.content}"/>`
                }
                v.langContent += tag
              });
            }
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