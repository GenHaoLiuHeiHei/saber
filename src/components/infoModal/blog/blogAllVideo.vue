<template>
  <div class="p-t0" id="blogAllVideo">
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
  name: "blogAllVideo",
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
  created () {
    console.log(this.formDatas)
  },
  methods: {
 
  }
};
</script>
<style scoped>
#blogAllVideo {
  max-height: 500px;
  overflow: auto;
}
</style>