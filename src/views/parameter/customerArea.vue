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
      <template slot="updateAdminName" slot-scope="scope">
        <div v-if="scope.row.updateAdminName">
          {{scope.row.updateAdminName}}
        </div>
        <div v-else>
          暂无
        </div>
      </template>
      <template slot="updateTime" slot-scope="scope">
        <div v-if="scope.row.updateTime">
          {{scope.row.updateTime}}
        </div>
        <div v-else>
          暂无
        </div>
      </template>
        <template slot-scope="scope" slot="menu">
        <el-button
          type="button"
          size="small"
          class="el-button--text color-red"
          icon="el-icon-edit"
          v-if="scope.row.status === 2"
          @click="changeUpdate(scope.row, 1)"
        >启 用</el-button>
        <el-button
          type="button"
          size="small"
          class="el-button--text"
          icon="el-icon-edit"
          v-if="scope.row.status === 1"
          @click="changeUpdate(scope.row, 2)"
        >停 用</el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/customer/customerArea";
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
          align:'center',
          border: true,
          index: false,
          viewBtn: false,
          selection: true,
          column: [
            {
              label: "大区名称",
              prop: "areaName",
              rules: [{
                required: true,
                message: "请输入大区名称",
                trigger: "blur"
              }],
              span: 24,
              labelWidth:120,
            },
            {
              label: "创建时间",
              prop: "createTime",
              display: false
            },
            {
              label: "创建人",
              prop: "createAdminName",
              display: false
            },
            {
              label: "修改时间",
              prop: "updateTime",
              slot: true,
              display: false
            },
            {
              label: "修改人",
              prop: "updateAdminName",
              slot: true,
              display: false
            },
            {
              label: "大区编号",
              prop: "areaNum",
              rules: [{
                required: true,
                message: "请输入大区编号",
                trigger: "blur"
              }],
              span: 24,
              labelWidth:120,
              editDisplay: false
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
          addBtn: true,
          viewBtn: true,
          delBtn: true,
          editBtn: true
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
       changeUpdate(row, status) {
        let msg = '确定将选择该大区启用'
        this.$confirm(msg, {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            row.status = status;
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
