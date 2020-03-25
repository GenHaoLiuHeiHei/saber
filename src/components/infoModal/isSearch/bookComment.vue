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
// 评论
import { getChapTerList } from "@/api/book/library";
export default {
  name: "bookComment",
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

        column: [
          {
            label: "章节名称",
            prop: "chapterTitle",
            span: 24,
            rules: [
              {
                required: true,
                message: "请输入",
                trigger: "blur"
              }
            ]
          },
          {
            label: "收费模式",
            type: "select",
            dicUrl: "/api/blade-system/dict/dictionary?code=bookTollMode",
            props: {
              label: "dictValue",
              value: "dictKey"
            },
            prop: "chapterIsCharge",
            span: 24,
            rules: [
              {
                required: true,
                message: "请选择收费模式",
                trigger: "blur"
              }
            ]
          },
          {
            label: "章节内容",
            prop: "chapterContent",
            hide: true,
            span: 24,
            rules: [
              {
                required: true,
                message: "请输入标签时间",
                trigger: "blur"
              }
            ],
            formslot: true
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
      getChapTerList(
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