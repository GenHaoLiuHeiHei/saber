<template>
  <div class="p-t0" id="blogAllImgList">
    <el-row class="m-b15">
      <el-col :span="4" v-for="(item, index) in pictrueList" :key="index" class="m-r10 bookArticleImg m-b20" style="max-height: 80px;overflow: hidden;">
        <img class="w100" @click="showBigImg(index)" :src="item.url" alt="" >
      </el-col>
    </el-row>
    <el-pagination
      small
      layout="prev, pager, next"
      :total="page.total"
      :hide-on-single-page="true"
      @current-change="currentChange">
    </el-pagination>
  </div>
</template>
<script>
// 图片
import { getImgList } from "@/api/customer/blog";
export default {
  name: "blogAllImgList",
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
      data: []
    };
  },
  computed: {
    pictrueList () {
      let showList = [];
      if (this.data && this.data.length > 0) {
        this.data.map(v => {
          if (v.blogPictrueUrl && v.blogPictrueUrl.length) {
              showList.push({
                url: v.blogPictrueUrl
              })
            }
        });
        return showList
      }

    }
  },
  created () {
    if (this.tofrom === 'user') {
      this.getImgListAjax();
    }
    
  },
  methods: {
    showBigImg (index) {
        this.$ImagePreview(this.pictrueList, index);
    },
    currentChange(currentPage){
        this.page.currentPage = currentPage;
        this.getImgListAjax();
    },
    getImgListAjax () {
      let this_ = this;
      getImgList(
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