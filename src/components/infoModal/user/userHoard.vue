<template>
  <div id="bookHoard">
    <avue-crud
      ref="crud"
      :option="option"
      :table-loading="loading"
      :data="data"
      :page="page"
      v-model="form"
      @search-change="searchChange"
      @search-reset="searchReset"
      @selection-change="selectionChange"
      @current-change="currentChange"
      @size-change="sizeChange"
      @on-load="onLoad"
    ></avue-crud>
  </div>
</template>
<script>
// 收藏
import { get_book_hoard } from "@/api/book/library";
export default {
  name: "bookHoard",
  props: {
    formDatas: {
      type: Object,
      required: true
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
        addBtn: false,
        emptyBtn: false,
        align: "center",
        column: [
          {
            label: "用户编号",
            prop: "customerNumber"
          },
          {
            label: "用户名称",
            prop: "customerNickName"
          },
          {
            label: "收藏时间",
            prop: "hoardTime"
          },
          {
              label: "开始时间",
              prop: "startTime",
              type: "datetime",
              format: "yyyy-MM-dd HH:mm:ss",
              valueFormat: "yyyy-MM-dd HH:mm:ss",
              search: true,
              hide: true,
              addDispaly: true,
              editDispaly: true
          },
          {
              label: "结束时间",
              prop: "endTime",
              type: "datetime",
              format: "yyyy-MM-dd HH:mm:ss",
              valueFormat: "yyyy-MM-dd HH:mm:ss",
              search: true,
              hide: true,
              addDispaly: true,
              editDispaly: true
          }
        ]
      },
      data: []
    };
  },
  methods: {
    // 表单重置搜索
    searchReset() {
      this.query = {};
      this.onLoad(this.page);
    },

    // 表单input搜索
    searchChange(params) {
      this.query = params;
      // console.log(this.query);
      this.onLoad(this.page, params);
    },

    // 表单select搜索
    selectionChange(list) {
      this.selectionList = list;
    },

    // 重置表单
    selectionClear() {
      this.selectionList = [];
      this.$refs.crud.toggleSelection();
    },

    // 切换下一页
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },

    // 改变表单请求页大小
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },

    onLoad(page, params = {}) {
      this.loading = true;
      console.log("收藏");
      get_book_hoard(
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