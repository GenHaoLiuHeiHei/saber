<template>
  <basic-container>
     <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="开屏" name="openScreen">
          <div v-for="(item, index) in dataList" :key="index" style="display: inline-block">
            <DataClass :title='item.title' :formDatas="item">
               <!-- <template slot-scope="scope" slot="footerData">
                <div>合计： <b>{{scope.formDatas.sumNum}}人</b> </div>
              </template> -->
            </DataClass>
          </div>
        </el-tab-pane>
        <el-tab-pane label="书库" name="bookBanner">
         <div v-for="(item, index) in dataList" :key="index" style="display: inline-block">
            <DataClass :title='item.title' :formDatas="item"></DataClass>
          </div>
        </el-tab-pane>
      </el-tabs>
  </basic-container>
</template>
<script>
import DataClass from './components/dataClass';
import { getAdvertisingDetail } from "@/api/statistics/index";
export default {
  components: {
    DataClass
  },
  data() {
    return {
      activeName: 'openScreen',
      dataList: [],
      loading: true,
    };
  },
 computed: {
    isType() {
      return this.activeName === 'openScreen' ? 1 : 2;
    }
  },
  created () {
    let this_ = this;
    getAdvertisingDetail(this.isType).then(res => {
      this_.dataList = res.data.data;
    });
  },
  methods: {
    handleClick (e) {
      let this_ = this;
      if (!this_.loading) return
      this_.loading = false;
      getAdvertisingDetail(this.isType).then(res => {
        this_.loading = true;
        this_.dataList = res.data.data;
      });
    }
  }
};
</script>