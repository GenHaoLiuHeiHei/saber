<template>
  <basic-container>
      <el-tabs v-model="activeName" class="p-tb p-lr">
        <el-tab-pane label="Loading广告" name="loading">
            <el-row :gutter="20">
              <el-col :span="12">
                <Loading v-if="activeName === 'loading'"></Loading> 
              </el-col>
            </el-row>
        </el-tab-pane>
        <el-tab-pane label="书库banner" name="banner">
          <el-row :gutter="20">
              <el-col :span="12">
                <Banner v-if="activeName === 'banner'"></Banner> 
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
  </basic-container>
</template>

<script>
  import Banner from './components/advertising/banner';
  import Loading from './components/advertising/loading';
  export default {
    name:'setBanner',
    components:{
      Loading,
      Banner
    },
    data() {
      return {
       activeName: 'loading',
      };
    },
  };
</script>
<style scoped lang="scss">
</style>
