<template>
  <div class="p-t0" id="blogImgList">
   <video class="w100" height="400" controls :poster="formDatas.blogVideoImage">
      <source :src="formDatas.blogVideoUrl" type="video/mp4">
      <source :src="formDatas.blogVideoUrl" type="video/ogg">
      您的浏览器不支持 video 标签。
    </video>
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