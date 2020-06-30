<template>
  <basic-container>
    <div id="echarts-bar" :style="{width: '600px', height: '300px'}"></div>
    <div id="echarts-line" :style="{width: '600px', height: '300px'}"></div>
    <div id="echarts-pie" :style="{width: '600px', height: '300px'}"></div>
  </basic-container>
</template>
<script>
import echarts from "echarts";
export default {
  data() {
    return {};
  },
  props: {
    chartData: {
      require: true,
      type: Object
    }
  },
  methods: {
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
          },
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
    getLineEchart() {
      var elEcahrt = document.getElementById("echarts-line");
      var myChart = echarts.init(elEcahrt);
      // 绘制图表
      myChart.setOption({
        legend: {
          orient: "vertical",
          bottom: 0,
          left: "center",
          data: ["注册成功的用户数"]
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c}"
        },
        color: ["#83bff6"],
        xAxis: {
          type: "category",
          data: ["2-15", "2-16", "2-17", "2-18", "2-19", "2-20", "2-21"],
          axisLine: {
            lineStyle: {
              color: "#ccc"
            }
          },
          boundaryGap: false,
        },
        yAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#ccc"
            }
          }
        },
        series: [
          {
            name: "注册成功的用户数",
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: "line"
          }
        ]
      });
    },
    getPieEchart() {
      var elEcahrt = document.getElementById("echarts-pie");
      var myChart = echarts.init(elEcahrt);
      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: ["ios", "android", "pc", "web", "others"]
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: ["30%", "70%"],
            data: [
              {
                value: 2103456,
                name: "ios",
                itemStyle: { normal: { color: "#9bd598" } }
              },
              {
                value: 1305923,
                name: "android",
                itemStyle: { normal: { color: "#ffd58f" } }
              },
              {
                value: 543250,
                name: "pc",
                itemStyle: { normal: { color: "#abd5f2" } }
              },
              {
                value: 798403,
                name: "web",
                itemStyle: { normal: { color: "#ab8df2" } }
              },
              {
                value: 302340,
                name: "others",
                itemStyle: { normal: { color: "#e14f60" } }
              }
            ],
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
    }
  },
  mounted() {
    this.getBarEchart();
    this.getLineEchart();
    this.getPieEchart();
  }
};
</script>