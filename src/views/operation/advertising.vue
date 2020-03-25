<template>
  <basic-container>
      <el-tabs v-model="activeName" class="p-tb p-lr">
        <el-tab-pane label="Loading广告" name="loading">
            <el-row :gutter="20">
              <el-col :span="12">
                <Loading></Loading> 
              </el-col>
            </el-row>
        </el-tab-pane>
        <el-tab-pane label="书库banner" name="banner">
          <el-row :gutter="20">
              <el-col :span="12">
                <Banner></Banner> 
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
  </basic-container>
</template>

<script>
  import Banner from './components/banner';
  import Loading from './components/loading';
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
