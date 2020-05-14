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
      <template slot-scope="scope" slot="status">
        <div v-if="scope.row.status === 3" class="color-blue">不违规</div>
        <div v-else-if="scope.row.status === 2" class="color-red">违规</div>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {dynamic_report} from "@/api/report/report";
  import {mapGetters} from "vuex";
  export default {
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
          align: "center",
          tip: false,
          border: true,
          index: false,
          viewBtn: false,
          selection: false,
          menu: false,
          column: [
            {
              label: "用户昵称",
              prop: "beCustomerName",
              disabled: true,
              span: 24,
              labelWidth: 120,
              search: true

            },
            {
              label: "用户ID",
              prop: "beCustomerNumber",
              disabled: true,
              span: 24,
              labelWidth: 120
            },
            {
              label: "内容",
              prop: "relateComment",
              disabled: true,
              span: 24,
              labelWidth: 120
            },
            {
              label: "处理时间",
              prop: "handleTime",
              disabled: true,
              span: 24,
              labelWidth: 120
            },
            {
              label: "状态",
              prop: "status",
              slot: true,
              disabled: true,
              span: 24,
              labelWidth: 120
            },
            {
              label: "管理员",
              prop: "adminName",
              disabled: true,
              span: 24,
              labelWidth: 120
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
          editBtn: false,
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
        params.status = 2;
        params.type = 1;
        dynamic_report(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
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
