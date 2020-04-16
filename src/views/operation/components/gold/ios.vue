<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page="page"
               :permission="permissionList"
               v-model="form"
               ref="crud"
               @row-update="rowUpdate"
               @row-save="rowSave"
               @row-del="rowDel"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @on-load="onLoad">
      <template slot="menuLeft">
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   @click="handleDelete">删 除
        </el-button>
      </template>
      <template slot-scope="scope" slot="goldCount">
        {{scope.row.goldCount}}金币
      </template> 
      <template slot-scope="scope" slot="goldPrice">
        {{scope.row.goldPrice}}元
      </template> 
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, add, update, remove} from "@/api/customer/goldpackage";
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
          tip: false,
          border: true,
          index: false,
          viewBtn: true,
          selection: true,
          align: 'center',
          column: [
            {
              label: "套餐名",
              prop: "packageName",
              span: 24,
              labelWidth: 120,
              rules: [{
                required: true,
                message: "请输入套餐名",
                trigger: "blur"
              }]
            },
            {
              label: "金币数量",
              prop: "goldCount",
              type: 'number',
              span: 24,
              labelWidth: 120,
              slot: true,
              rules: [{
                required: true,
                message: "请输入金币数量",
                trigger: "blur"
              }]
            },
            {
              label: "售价",
              prop: "goldPrice",
              slot: true,
              type: 'number',
              span: 24,
              labelWidth: 120,
              rules: [{
                required: true,
                message: "请输入售价(元)",
                trigger: "blur"
              }]
            },
            {
              label: "操作人",
              prop: "operator",
              addDisplay: false,
              editDisplay: false,
            },
             {
              label: "管理员密码",
              prop: "password",
              hide: true,
              rules: [{
                required: true,
                message: "请输入管理员密码",
                trigger: "blur"
              }],
              span: 24,
              labelWidth:120
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
          // addBtn: this.vaildData(this.permission.goldpackage_add, false),
          // viewBtn: this.vaildData(this.permission.goldpackage_view, false),
          // delBtn: this.vaildData(this.permission.goldpackage_delete, false),
          // editBtn: this.vaildData(this.permission.goldpackage_edit, false)
          addBtn: true,
          viewBtn: false,
          delBtn: true,
          editBtn: true,
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
      rowSave(row, loading, done) {
        row.type = 2;
        add(row).then(() => {
          loading();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        }, error => {
          done();
          console.log(error);
        });
      },
      rowUpdate(row, index, loading, done) {
        update(row).then(() => {
          loading();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        }, error => {
          done();
          console.log(error);
        });
      },
      rowDel(row) {
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(row.id);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          });
      },
      handleDelete() {
        if (this.selectionList.length === 0) {
          this.$message.warning("请选择至少一条数据");
          return;
        }
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(this.ids);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.$refs.crud.toggleSelection();
          });
      },
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
        params.type = 2;
        this.loading = true;
        getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
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
