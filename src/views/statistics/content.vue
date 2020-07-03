<template>
  <basic-container class="p-t0">
    <avue-tabs :option="option" @change="handleChange" class="p-t0"></avue-tabs>
    <el-row>
      <el-col :span="16">
        <div v-for="(item, index) in pfdSumList" :key="index" style="display: inline-block">
            <DataClass :title='item.title' :formDatas="item">
              <!-- <template slot-scope="scope" slot="footerData" v-if="item.type === 1">
                <div>合计： <b>{{scope.formDatas.sumNum}}人</b> </div>
              </template> -->
            </DataClass>
        </div>
        <div>
          <DataClass :formDatas="exposureSum" title="内容曝光的总次数" class="m-b10">
              <template slot-scope="scope" slot="footerData">
                <div>合计： <b>{{scope.formDatas.sumNum}}次</b> </div>
                <div>均值： <b>{{scope.formDatas.sumAvg}}次</b></div>
              </template>
          </DataClass>
        </div>
        <div id="echartsExposure" :style="{width: '80%', height: '300px'}"></div>
      </el-col>
    </el-row>
  </basic-container>
</template>
<script>
import echarts from "echarts";
import {
  getPfdSum,
  getExposureSum
} from "@/api/statistics/index";
import DataClass from './components/dataClass';
export default {
  components: {
    DataClass
  },
  data() {
    return {
      pfdSumList: [],
      exposureSum: {},
      type: {},
      option: {
        column: [
          {
            label: "全部",
            prop: "all"
          },
          {
            label: "ios",
            prop: "ios"
          },
          {
            label: "android",
            prop: "android"
          }
        ]
      }
    };
  },
  computed: {
    isType() {
      switch (this.type.prop) {
        case "all":
          return 1;
          break;
        case "ios":
          return 2;
          break;
        case "android":
          return 3;
          break;
        default:
          return 1;
          break;
      }
    }
  },
  props: {},
  created() {
    let this_ = this;
    this_.type = this.option.column[0];
    this_.ajaxGetPfdSum();
    this_.ajaxGetExposureSum();
  },
  methods: {
    ajaxGetPfdSum () {
      let this_ = this;
      getPfdSum(this_.isType).then(res => {
        this_.pfdSumList = res.data.data;
      });
    },
    ajaxGetExposureSum () {
      let this_ = this;
      getExposureSum(this_.isType).then(res => {
        this_.exposureSum = res.data.data;
        this_.getBarEchart('echartsExposure', this_.exposureSum)
      });
    },
    // 切换tab
    handleChange(column) {
      let this_ = this;
      this_.type = column;
      this_.$nextTick(()=> {
        this_.ajaxGetPfdSum();
        this_.ajaxGetExposureSum();
      })
    },
    getBarEchart(el, data) {
      let xAxisData = [], seriesData = [];
      var elEcahrt = document.getElementById(el);
      var myChart = echarts.init(elEcahrt);
      console.log(data)
       data.list.map(v=> {
        xAxisData.push(v.time);
        seriesData.push(v.Sum);
      })
      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c}"
        },
        grid: {
            x:40,
            top: '5%'
        },
        xAxis: {
          data: xAxisData,
          axisLine: {
            lineStyle: {
              color: "#ccc"
            }
          }
        },
        legend: {
          orient: "vertical",
          bottom: 0,
          left: "center",
          data: ["内容曝光的总次数"]
        },
        yAxis: {
          axisLine: {
            lineStyle: {
              color: "#ccc"
            }
          }
        },
        series: [
          {
            name: "内容曝光的总次数",
            barWidth: "40%",
            type: "bar",
            data: seriesData
          }
        ]
      });
    },
  },
};
</script>