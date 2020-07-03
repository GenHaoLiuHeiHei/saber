<template>
  <basic-container class="bg-white p-t0">
    <avue-tabs :option="option" @change="handleChange" class="p-t0"></avue-tabs>
    <el-row>
      <el-col :span="16">
        <div v-for="(item, index) in customerDailyCountList" :key="index" style="display: inline-block">
            <DataClass :title='item.title' :formDatas="item">
              <template slot-scope="scope" slot="footerData" v-if="item.type === 1">
                <div>合计： <b>{{scope.formDatas.sumNum}}人</b> </div>
              </template>
            </DataClass>
        </div>
        <div>
          <DataClass :formDatas="customerWeekilyCount" :title="customerWeekilyCount.title" class="m-b10">
              <template slot-scope="scope" slot="footerData">
                <div>合计： <b>{{scope.formDatas.sumNum}}人</b> </div>
                <div>均值： <b>{{scope.formDatas.sumAvg}}人</b></div>
              </template>
          </DataClass>
        </div>
        <div id="customerLastWeekReg" :style="{width: '80%', height: '300px'}"></div>
        <div id="customerLastWeekKeep" :style="{width: '80%', height: '300px'}"></div>
      </el-col>
    </el-row>
  </basic-container>
</template>
<script>
import echarts from "echarts";
import {
  getCustomerDailyCount,
  getCustomerWeekilyCount,
  getCustomerLastWeekRegList,
  getCustomerLastWeekKeepList
} from "@/api/statistics/index";
import DataClass from './dataClass';
export default {
  components: {
    DataClass
  },
  data() {
    return {
      customerDailyCountList: [],
      customerWeekilyCount: {},
      customerLastWeekRegData: {},
      customerLastWeekKeepData: {},
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
    this_.ajaxGetCustomerDailyCount();
    this_.ajaxGetCustomerWeekilyCount();
    this_.ajaxGetCustomerLastWeekRegList();
    this_.ajaxGetCustomerLastWeekKeepList();

  },
  methods: {
    ajaxGetCustomerDailyCount () {
      let this_ = this;
      getCustomerDailyCount(this_.isType).then(res => {
        this_.customerDailyCountList = res.data.data;
      });
    },
    ajaxGetCustomerWeekilyCount () {
      let this_ = this;
      getCustomerWeekilyCount(this_.isType).then(res => {
        res.data.data.sumAvg = res.data.data.sumAvg.toFixed(2);
        this_.customerWeekilyCount = res.data.data;
      });
    },
    ajaxGetCustomerLastWeekRegList () {
      let this_ = this;
      getCustomerLastWeekRegList(this_.isType).then(res => {
        this_.customerLastWeekRegData = res.data.data;
        this_.$nextTick(() => {
          this_.getLineEchart('customerLastWeekReg', this_.customerLastWeekRegData);
        });
      });
    },
    ajaxGetCustomerLastWeekKeepList () {
      let this_ = this;
      getCustomerLastWeekKeepList(this_.isType).then(res => {
        this_.customerLastWeekKeepData = res.data.data;
        this_.$nextTick(() => {
          this_.getLineEchart('customerLastWeekKeep', this_.customerLastWeekKeepData);
        });
      });
    },
    // 切换tab
    handleChange(column) {
      let this_ = this;
      this_.type = column;
      this_.$nextTick(()=> {
        this_.ajaxGetCustomerDailyCount();
        this_.ajaxGetCustomerWeekilyCount();
        this_.ajaxGetCustomerLastWeekRegList();
        this_.ajaxGetCustomerLastWeekKeepList();
      })
    },
    getBarEchart() {
      var elEcahrt = document.getElementById("echarts-bar");
      var myChart = echarts.init(elEcahrt);
      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c}"
        },
        xAxis: {
          data: ["2-15", "2-16", "2-17", "2-18", "2-19", "2-20", "2-21"],
          axisLine: {
            lineStyle: {
              color: "#ccc"
            }
          }
        },
        color: ["#83bff6"],
        legend: {
          orient: "vertical",
          bottom: 0,
          left: "center",
          data: ["销量"]
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
            name: "销量",
            barWidth: "40%",
            type: "bar",
            data: [11, 22, 33, 44, 55, 66, 77]
          }
        ]
      });
    },
    getLineEchart(el, data) {
      let text = '', subtext, dataList = [], legendData = [], xAxisData = [], seriesData = [], axisLabelFormatter = '{value}', grid = {}, formatter = '{a} <br/>{b} : {c}';
      if (el === 'customerLastWeekReg') {
        // text = '上周注册用户数';
        legendData.push('注册成功的用户数');
        grid = {
            x:40,
            top: '5%'
        }
        data.list.map(v=> {
          xAxisData.push(v.date);
          seriesData.push(v.regCount);
        })
      } else {
        text = '移动端用户留存率';
        legendData.push('留存的用户数');
        grid = {
            x:40,
        }
        data.list.map(v=> {
          xAxisData.push('第' + v.days + '天');
          seriesData.push(v.keep);
        })
        axisLabelFormatter = '{value} %';
        formatter = '{a} <br/>{b} : {c}%'
        subtext = data.startTime + '~' + data.endTime;
      }
      var elEcahrt = document.getElementById(el);
      var myChart = echarts.init(elEcahrt);
      // 绘制图表
      myChart.setOption({
        title: {
          text,
          subtext
        },
        grid,
        legend: {
          orient: "vertical",
          bottom: 0,
          left: "center",
          data: legendData
        },
        tooltip: {
          trigger: "item",
          formatter
        },
        color: ["#83bff6"],
        xAxis: {
          type: "category",
          data: xAxisData,
          axisLine: {
            lineStyle: {
              color: "#ccc"
            }
          },
          boundaryGap: false
        },
        yAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#ccc"
            }
          },
          axisLabel: {  
            show: true,  
            interval: 'auto',  
            formatter: axisLabelFormatter  
          },  
          show: true  
        },
        series: [
          {
            name: legendData[0],
            data: seriesData,
            type: "line"
          }
        ]
      });
    },
  },
};
</script>