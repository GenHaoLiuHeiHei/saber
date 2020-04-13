<template>
  <basic-container id="bookHoard">
    <avue-crud
      ref="crud"
      :option="option"
      :table-loading="loading"
      :data="data"
      :page="page"
      v-model="form"
      @size-change="sizeChange"
      @current-change="currentChange"
      @selection-change="selectionChange"
      @on-load="onLoad"
    ></avue-crud>
  </basic-container>
</template>
<script>
// 收藏
import {
  getRevenueList,
} from "@/api/customer/extractorder";
export default {
  name: "bookHoard",
  props: {
    formDatas: {
      type: Object,
      required: true
    },
    seachForm: {
      type: Object,
      default () {
        return {}
      }
    },
    isSeach: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  watch: {
    isSeach: {
      handler(newValue) {
        if (newValue) {
          this.page.currentPage = 1;
          Object.assign(this.query, this.seachForm);
          this.onLoad(this.page);
        } 
        this.$emit("changeIsSeach", false);
      }
    }
  },
  data() {
    return {
      form: {},
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      selectionList: [],
      option: {
        tip: false,
        border: true,
        menu: false,
        dialogClickModal: false,
        align: "center",
        column: [
            {
              label: "收益人id",
              prop: "revenueId",
              rules: [{
                required: true,
                message: "请输入收益人id",
                trigger: "blur"
              }]
            },
            {
              label: "消费者id",
              prop: "consumerId",
              rules: [{
                required: true,
                message: "请输入消费者id",
                trigger: "blur"
              }]
            },
            {
              label: "订单id",
              prop: "orderId",
              rules: [{
                required: true,
                message: "请输入订单id",
                trigger: "blur"
              }]
            },
            {
              label: "收益金币",
              prop: "money",
              rules: [{
                required: true,
                message: "请输入收益金币",
                trigger: "blur"
              }]
            },
            {
              label: "备注",
              prop: "remark",
              rules: [{
                required: true,
                message: "请输入备注",
                trigger: "blur"
              }]
            },
            {
              label: "创建时间",
              prop: "createTime",
              rules: [{
                required: true,
                message: "请输入创建时间",
                trigger: "blur"
              }]
            },
          ]
      },
      data: []
    };
  },
  methods: {
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    onLoad(page, params = {}) {
      this.loading = true;
      console.log("明细");
      getRevenueList(
        page.currentPage,
        page.pageSize,
        this.formDatas.customerId,
        Object.assign(params, this.query)
      ).then(res => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;
        this.loading = false;
      });
    }
  }
};
</script>
<style scoped>
#bookHoard /deep/ .avue-crud__menu {
  display: none;
}
</style>