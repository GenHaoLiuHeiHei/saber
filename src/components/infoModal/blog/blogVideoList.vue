<template>
  <div class="p-t0" id="blogAllImgList">
    <el-row class="m-b15">
      <el-col :span="4" v-for="(item, index) in pictrueList" :key="index" class="m-r10 bookArticleImg m-b20" style="max-height: 250px;overflow: hidden;">
        <img class="w100" @click="showVideo(index)" :src="item.url" alt="" >
      </el-col>
    </el-row>
    <el-pagination
      small
      layout="prev, pager, next"
      :total="page.total"
      :hide-on-single-page="true"
      @current-change="currentChange">
    </el-pagination>
    <el-dialog
      title="视频预览"
      :visible.sync="isShowComment"
      class="dialogComment"
      :modal-append-to-body="false"
      :modal="false" 
      :close-on-click-modal="false"
      @close="closeIsShowComment"
    >
      <div v-if="isShowComment">
        <blogAllVideo :formDatas="bigDialogForm" tofrom="blog"></blogAllVideo>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// 图片
import { getVideoList } from "@/api/customer/blog";
import blogAllVideo from './blogAllVideo'
export default {
  name: "blogViodeList",
  components:{
    blogAllVideo
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
    },
    tofrom: {
      type: String,
      default: 'user'
    },

  },
  data() {
    return {
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      data: [],
      isShowComment: false,
      bigDialogForm: {},
    };
  },
  computed: {
    pictrueList () {
      let showList = [];
      if (this.data && this.data.length > 0) {
        this.data.map(v => {
          if (v.blogVideoImage && v.blogVideoImage.length) {
              showList.push({
                url: v.blogVideoImage
              })
            }
        });
        return showList
      }

    }
  },
  created () {
    if (this.tofrom === 'user') {
      this.getVideoListAjax();
    }
    
  },
  methods: {
    showVideo (index) {
      this.bigDialogForm = this.data[index];
      this.isShowComment = true;
    },
    closeIsShowComment () {
      this.isShowComment = false;
    },
    currentChange(currentPage){
        this.page.currentPage = currentPage;
        this.getVideoListAjax();
    },
    getVideoListAjax () {
      let this_ = this;
      getVideoList(
        this_.page.currentPage,
        this_.page.pageSize,
        this_.formDatas.id,
      )
      .then(res => {
        const data = res.data.data;
        this_.page.total = data.total;
        this_.data = data.records;
        this_.loading = false;
      })
      .catch(err => {
        console.log(err);
        this_.loading = false;
      });
    }
  }
};
</script>
<style scoped>
#blogAllImgList {
  max-height: 500px;
  overflow: auto;
}
</style>