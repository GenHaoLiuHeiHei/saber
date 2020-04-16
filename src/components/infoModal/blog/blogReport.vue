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
import { getReportList } from "@/api/customer/blog";
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
        // else {
        //   this.query = {};
        // }
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
            label: "举报人",
            prop: "customerName",
            search: true
          },
          {
            label: "举报原因",
            prop: "reasons"
          }
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
      getReportList(
        page.currentPage,
        page.pageSize,
        this.formDatas.id,
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