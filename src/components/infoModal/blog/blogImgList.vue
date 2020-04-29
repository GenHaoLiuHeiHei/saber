<template>
  <div class="p-t0" id="blogImgList">
    <el-row>
      <el-col :span="4" v-for="(item, index) in pictrueList" :key="index" class="m-r10 bookArticleImg" style="max-height: 80px;overflow: hidden;">
        <img class="w100" @click="showBigImg(index)" :src="item.url" alt="" >
      </el-col>
    </el-row>
  </div>
</template>
<script>
// 收藏
export default {
  name: "blogImgList",
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
  data() {
    return {
     
    };
  },
  computed: {
    pictrueList () {
      let showList = [];
      this.formDatas.pictrueList.map(v => {
        if (v.blogPictrueUrl && v.blogPictrueUrl.length) {
            showList.push({
              url: v.blogPictrueUrl
            })
          }
      })
      return showList
    }
  },
  created () {
    console.log(this.pictrueList)
  },
  methods: {
    showBigImg (index) {
        this.$ImagePreview(this.pictrueList, index);
    }
  }
};
</script>
<style scoped>
#blogImgList {
  max-height: 500px;
  overflow: auto;
}
</style>