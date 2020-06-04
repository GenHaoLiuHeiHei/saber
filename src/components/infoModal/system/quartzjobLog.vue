<template>
  <div id="quartzjobLog">
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
import { getLogList } from "@/api/system/quartzjob";
export default {
  formDatas: {
    type: Object,
    default: () => {
      return {};
    }
  },
  data() {
    return {
      saveData: "",
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
        align: "center",
        tip: false,
        border: true,
        addBtn: false,
        index: false,
        menu: false,
        selection: true,
        excelBtn: true,
        column: [
          {
              label: "开始时间",
              prop: "startTime",
              type: "datetime",
              format: "yyyy-MM-dd HH:mm:ss",
              valueFormat: "timestamp",
              search: true,
            hide: true
          },
          {
              label: "结束时间",
              prop: "endTime",
              type: "datetime",
              format: "yyyy-MM-dd HH:mm:ss",
              valueFormat: "timestamp",
              search: true,
            hide: true
          },
          {
            label: "定时器名称",
            prop: "jobName",
            search: true
          },
          {
            label: "Bean名称",
            prop: "beanName"
          },
          {
            label: "方法名称",
            prop: "methodName"
          },
          {
            label: "参数",
            prop: "params"
          },
          {
            label: "cron表达式",
            prop: "cronExpression"
          },

          {
            label: "异常详情",
            prop: "exceptionDetail"
          },
          {
            label: "耗时(毫秒)",
            prop: "time"
          },

          {
            label: "状态",
            prop: "isSuccess",
            type: "select",
            dicUrl: "/api/blade-system/dict/dictionary?code=isSuccess",
            props: {
              label: "dictValue",
              value: "dictKey"
            }
          },
          {
            label: "创建时间",
            prop: "createTime"
          }
        ]
      },
      data: []
    };
  },
  created() {
    this.formData = this.formDatas;
  },
  methods: {
    searchReset() {
      this.query = {};
      this.onLoad(this.page);
    },
    searchChange(params) {
      this.query = params;
      this.onLoad(this.page, params);
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    selectionClear() {
      this.selectionList = [];
      this.$refs.crud.toggleSelection();
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    onLoad(page, params = {}) {
      this.loading = true;
      getLogList(
        page.currentPage,
        page.pageSize,
        Object.assign(params, this.query)
      ).then(res => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;
        this.loading = false;
        this.selectionClear();
      });
    }
  }
};
</script>
