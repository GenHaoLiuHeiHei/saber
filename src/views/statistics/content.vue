<template>
  <basic-container>
    <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="开屏" name="openScreen">
          <DataClass title='浏览人次(UV)' :formDatas="{name:1}"></DataClass>
        </el-tab-pane>
        <el-tab-pane label="书库" name="book">
          <DataClass title='浏览次数(PV)' :formDatas="{name:1}"></DataClass>
        </el-tab-pane>
    </el-tabs>
  </basic-container>
</template>
<script>
import DataClass from './components/dataClass';
export default {
  components: {
    DataClass
  },
  data() {
    return {
      activeName: 'openScreen'
    };
  },
  methods: {
    handleClick () {
      console.log(0)
    }
  },
  mounted() {
   
  }
};
</script>