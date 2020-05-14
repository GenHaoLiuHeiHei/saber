<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page="page"
               :permission="permissionList"
               :before-open="beforeOpen"
               v-model="form"
               ref="crud"
               @row-update="rowUpdate"
               @row-save="rowSave"
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
      <template slot-scope="scope" slot="menu">
         <el-button
          type="button"
          size="small"
          class="el-button--text color-red"
          icon="el-icon-edit"
          v-if="scope.row.classifyState === 2"
          @click="changeUpdate(scope.row, 1)"
        >设为默认</el-button>
        <el-button
          type="button"
          size="small"
          class="el-button--text"
          icon="el-icon-edit"
          v-if="scope.row.classifyState === 1"
        >默 认</el-button>
        <el-button type="button" size="small" class="el-button--text" v-else icon="el-icon-delete" @click="rowDel(scope.row)">删 除</el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/book/classify";
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
          viewBtn: false,
          delBtn: false,
          selection: true,
          column: [
            {
              label: "",
              prop: "id",
              addDisplay: false,
              editDisplay: false,
              hide: true,
              rules: [{
                required: true,
                message: "请输入",
                trigger: "blur"
              }]
            },
            {
              label: "分类名称",
              labelWidth: 100,
              prop: "classifyName",
              rules: [{
                required: true,
                message: "请输入",
                trigger: "blur"
              }]
            },
            {
              label: "",
              prop: "typeSortId",
              hide: true,
              addDisplay: false,
              editDisplay: false,
              rules: [{
                required: true,
                message: "请输入",
                trigger: "blur"
              }]
            },
            {
              label: "排序规则",
              type: "select",
              dicUrl: "/api/blade-system/dict/dictionary?code=bookSort",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              prop: "orderAscs",
              labelWidth: 100,
              rules: [{
                required: true,
                message: "请输入",
                trigger: "change"
              }]
            },
            {
              label: "管理员密码",
              prop: "password",
              hide: true,
              labelWidth: 100,
              span: 24,
              rules: [{
                required: true,
                message: "请输入",
                trigger: "blur"
              }]
            }
          ]
        },
        data: []
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: true,
          viewBtn: true,
          delBtn: true,
          editBtn: true,
          // addBtn: this.vaildData(this.permission.booktype_add, false),
          // viewBtn: this.vaildData(this.permission.booktype_view, false),
          // delBtn: this.vaildData(this.permission.booktype_delete, false),
          // editBtn: this.vaildData(this.permission.booktype_edit, false)
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
       changeUpdate(row, status) {
        let msg = '确定将选择数据设为默认'
        this.$confirm(msg, {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            row.classifyState = status;
            return update(row)
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
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
      beforeOpen(done, type) {
        if (["edit", "view"].includes(type)) {
          getDetail(this.form.id).then(res => {
            this.form = res.data.data;
          });
        }
        done();
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
        this.loading = false;
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
