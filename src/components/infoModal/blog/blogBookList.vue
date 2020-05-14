<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page="page"
               :permission="permissionList"
               v-model="form"
               ref="crud"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @on-load="onLoad">
    </avue-crud>
  </basic-container>
</template>

<script>
  import { getBookList } from "@/api/customer/blog";
  import {mapGetters} from "vuex";
  export default {
    props: {
      formDatas: {
        type: Object,
        required: true
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
          index: false,
          viewBtn: false,
          selection: false,
          menu: false,
          align: 'center',
          column: [
            {
              label: "书籍编号",
              prop: "bookNoId",
              addDisplay: false,
              editDisplay: false
            },
            {
              label: "书籍名称",
              search: true,
              prop: "bookName",
              rules: [
                {
                  required: true,
                  message: "请输入",
                  trigger: "blur"
                }
              ]
            },
            {
              label: "作者名称",
              prop: "authorName",
              search: true,
              rules: [
                {
                  required: true,
                  message: "请输入",
                  trigger: "blur"
                }
              ]
            },
            {
              label: "作者ID",
              prop: "authorId",
              search: true,
              span: 24,
              placeholder: "非博主用户可不填"
            },
            {
              label: "首次上传",
              prop: "createTime",
              addDisplay: false,
              editDisplay: false
            },
            {
              label: "更新时间",
              prop: "updateTime",
              addDisplay: false,
              editDisplay: false
            },
             {
              label: "字数",
              prop: "bookWord",
              addDisplay: false,
              editDisplay: false
            },
            {
              label: "书籍简介",
              hide: true,
              prop: "bookIntro",
              span: 24,
              type: "textarea",
              maxlength: 500,
              rules: [
                {
                  required: true,
                  message: "请输入",
                  trigger: "blur"
                }
              ]
            },
          ]
        },
        data: []
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: false,
          viewBtn: false,
          delBtn: false,
          editBtn: false
        };
      },
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.id);
        });
        return ids.join(",");
      }
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
      currentChange(currentPage){
        this.page.currentPage = currentPage;
      },
      sizeChange(pageSize){
        this.page.pageSize = pageSize;
      },
      onLoad(page, params = {}) {
        this.loading = true;
        getBookList(page.currentPage, page.pageSize, this.formDatas.customerNumber, Object.assign(params, this.query)).then(res => {
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

<style>
</style>
