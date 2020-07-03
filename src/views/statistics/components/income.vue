<template>
  <basic-container class="bg-white p-t0">
    <avue-tabs :option="option" @change="handleChange" class="p-t0"></avue-tabs>
    <el-row>
      <el-col :span="12">
         <h4 class="p-l15 m-t05">今日充值： {{ headData.sum }}</h4>
        <h4 class="p-l15 m-b15">今日博主提现次数： {{ headData.nowExtract }}</h4>
        <DataClass :formDatas="headData.CountVO" title="过去7日充值环比" class="m-b10"></DataClass>
        <div id="incomeEchartsLine" :style="{width: '90%', height: '300px'}"></div>
        <div class="m-t20">
         <DataClass :formDatas="sumData.consumeOrderCount" title="付费购买内容的订单金额总和" class="m-b10">
            <template slot="dataTypeName">
                钻石
            </template>
            <template slot-scope="scope" slot="footerData">
                <div>合计： <b>{{scope.formDatas.sumNum}}</b> </div>
                <div>均值： <b>{{scope.formDatas.sumAvg}}</b></div>
            </template>
         </DataClass>
        </div>
        <div id="incomeBar" :style="{width: '90%', height: '300px'}"></div>
      </el-col>
      <el-col :span="12">
        <div id="consumeOrderProportion" :style="{width: '600px', height: '300px'}"></div>
        <div id="customerReadProportion" :style="{width: '600px', height: '300px'}"></div>
      </el-col>
    </el-row>
   
   
  </basic-container>
</template>
<script>
import echarts from "echarts";
import {
  getCustomerCount,
  getIncomeHeadDetail,
  getIncomeOderSumDetail,
  getIncomeProportionSumDetail
} from "@/api/statistics/index";
import DataClass from './dataClass';
export default {
  components: {
    DataClass
  },
  data() {
    return {
      headData: {},
      pieData: {},
      sumData: {},
      lineData: [],
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
    this_.ajaxIncomeHead();
    this_.ajaxIncomeOderSum();
    this_.ajaxIncomeCustomerCount();
    this_.ajaxIncomeProportionSum();
  },
  methods: {

    // 过去7日充值环比
    ajaxIncomeHead () {
      let this_ = this;
      getIncomeHeadDetail(this_.isType).then(res => {
        this_.headData = res.data.data;
      });
    },
    
    // 订单
    ajaxIncomeOderSum () {
      let this_ = this;
      getIncomeOderSumDetail(this_.isType).then(res => {
        this_.sumData = res.data.data;
        this_.getBarEchart('incomeBar', this_.sumData.consumeOrderCount)
      });
    },

    ajaxIncomeCustomerCount () {
      let this_ = this;
      getCustomerCount(this_.isType).then(res => {
        this_.lineData = res.data.data;
        this_.getLineEchart('incomeEchartsLine', this_.lineData);
      });
    },

    ajaxIncomeProportionSum () {
      let this_ = this;
      getIncomeProportionSumDetail(this_.isType).then(res => {
        this_.pieData = res.data.data;
        this_.getPieEchart('consumeOrderProportion', this_.pieData);
        this_.getPieEchart('customerReadProportion', this_.pieData);
      });
    },
    // 切换tab
    handleChange(column) {
      let this_ = this;
      this_.type = column;
      this_.$nextTick(()=> {
        this_.ajaxIncomeHead();
        this_.ajaxIncomeOderSum();
        this_.ajaxIncomeCustomerCount();
        this_.ajaxIncomeProportionSum();
      })
    },
    getBarEchart(el, data) {
      let xAxisData = [], seriesData = [];
      var elEcahrt = document.getElementById(el);
      var myChart = echarts.init(elEcahrt);
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
        color: ["#83bff6"],
        legend: {
          orient: "vertical",
          bottom: 0,
          left: "center",
          data: ["付费购买内容的订单金额总和"]
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
            data: seriesData
          }
        ]
      });
    },
    getLineEchart(el, data) {
      let text = '', subtext, legendData = [], xAxisData = [], seriesData = [], grid = {};
      text = '付费浏览的人数次数';
      grid = {
          x:40,
      }
      for(let key in data.consumeCustomerCount.map){
        let dataList = [];
        let item = data.consumeCustomerCount.map[key];
        let keyName = '';
         switch (key) {
          case "book":
            keyName = '书籍';
            break;
          case "blog":
            keyName = '博文';
            break;
          case "live":
            keyName = '茶桌';
            break;
          }
          legendData.push(keyName);
          item.map((v, i) => {
            if (key === 'book') {
              xAxisData.push(v.time);
            }
            dataList.push(v.Sum)
          })
          seriesData.push({
            name: keyName,
            type: 'line',
            data: dataList
          });
      }
      subtext = data.startTime + '~' + data.endTime;
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
          bottom: 0,
          left: "center",
          data: legendData
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c}"
        },
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
            formatter: '{value} '  
          },  
          show: true  
        },
        series: seriesData
      });
    },
    getPieEchart(el, data) {
      let text = '', subtext, dataList = [];
      if (el === 'consumeOrderProportion') {
        text = '不同付费内容|内容详情浏览'
      } else {
        text = '用户阅读付费内容与非付费内容占比'
      }
      subtext = data.startTime + '~' + data.endTime;
      var elEcahrt = document.getElementById(el);
      for(let key  in data[el]){
        let keyName = '';
         switch (key) {
          case "book":
            keyName = '书籍';
            break;
          case "blog":
            keyName = '博文';
            break;
          case "live":
            keyName = '茶桌';
            break;
          case "NoRechargeSum":
            keyName = '未充值用户';
            break;
          case "RechargeAndConsumeSum":
            keyName = '充值并消费';
            break;
          case "RechargeNoConsumeSum":
            keyName = '充值未消费';
            break;
          case "customerSum":
            keyName = '总用户人数';
            break;
          }
          if (keyName != '总用户人数') {
            dataList.push({
              value: data[el][key],
              name: keyName
            })
          }

      }
      var myChart = echarts.init(elEcahrt);
      // 绘制图表
      myChart.setOption({
        title: {
          text,
          subtext
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        // legend: {
        //   orient: "vertical",
        //   left: "right",
        //   data: ["ios", "android", "pc", "web", "others"]
        // },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: ["30%", "70%"],
            data: dataList,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
    },
   
  },
  mounted() {

  }
};
</script>