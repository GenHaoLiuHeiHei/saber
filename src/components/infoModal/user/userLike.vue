<template>
  <basic-container id="bookHoard">
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
  </basic-container>
</template>
<script>
// 收藏
import { get_book_praise } from "@/api/book/library";
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
        addBtn: false,
        emptyBtn: false,
        menu: false,
        dialogClickModal: false,
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
            label: "点赞时间",
            prop: "praiseTime"
          },
          {
              label: "开始时间",
              prop: "startTime",
              type: "datetime",
              format: "yyyy-MM-dd hh:mm:ss",
              valueFormat: "yyyy-MM-dd hh:mm:ss",
              search: true,
              hide: true,
              addDispaly: true,
              editDispaly: true
          },
          {
              label: "结束时间",
              prop: "endTime",
              type: "datetime",
              format: "yyyy-MM-dd hh:mm:ss",
              valueFormat: "yyyy-MM-dd hh:mm:ss",
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
      console.log("点赞");
      get_book_praise(
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