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
                   v-if="permission.booktag_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
      <template slot="tagTime" slot-scope="scope">
        {{scope.row.tagTime}} 天
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/book/tag";
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
          column: [
            {
              label: "标签名称",
              prop: "tagName",
              rules: [{
                required: true,
                message: "请输入",
                trigger: "blur"
              }]
            },
            {
              label: "关联",
              type: "select",
              dicUrl: "/api/blade-system/dict/dictionary?code=bookRelated",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              prop: "dataCorrelateId",
              rules: [{
                required: true,
                message: "请输入",
                trigger: "change"
              }]
            },
            {
              label: "时间",
              prop: "tagTime",
              // placeholder: "单位为天",
              type: "number",
              rules: [{
                required: true,
                message: "请输入标签时间",
                trigger: "blur"
              }],
              slot:true
            },
            {
              label: "标签颜色",
              prop: "tagColor",
              type: "color",
              colorFormat: 'hex',
              rules: [{
                required: true,
                message: "请输入标签颜色",
                trigger: "blur"
              }],
              change(data){
                console.log(data)
              }
            },
            {
              hide: true,
              label: "",
              prop: "tagState",
              addDisplay: false,
              editDisplay: false,
              rules: [{
                required: true,
                message: "请输入",
                trigger: "blur"
              }]
            },
            {
              label: "管理员密码",
              labelWidth: 100,
              span: 24,
              prop: "password",
              hide: true,
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
          // addBtn: this.vaildData(this.permission.booktag_add, false),
          // viewBtn: this.vaildData(this.permission.booktag_view, false),
          // delBtn: this.vaildData(this.permission.booktag_delete, false),
          // editBtn: this.vaildData(this.permission.booktag_edit, false)
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
