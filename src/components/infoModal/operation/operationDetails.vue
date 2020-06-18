<template>
  <div id="bookHoard">
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
    >
      <template slot-scope="scope" slot="remark">
        <div v-if='scope.row.remark'>{{scope.row.remark}}</div>
        <div v-else>暂无</div>
      </template>
    </avue-crud>
  </div>
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
              label: "购买人昵称",
              prop: "customerNickName"
            },
            {
              label: "购买人ID",
              prop: "customerNumber"
            },
             {
              label: "购买类型",
              prop: "buyType"
            },
            {
              label: "明细",
              prop: "remark",
              slot: true
            },
            {
              label: "购买时间",
              prop: "createTime"
            },
            {
              label: "购买价格",
              prop: "buyGold"
            },
            {
              label: "收益金币",
              prop: "money"
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