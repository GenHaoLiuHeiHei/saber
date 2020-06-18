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
      <template slot="exchangeRate" slot-scope="scope">
        {{scope.row.exchangeRate}} %
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, add, update, remove} from "@/api/customer/exchangerate";
  import {mapGetters} from "vuex";

  export default {
    data() {
      var validatePass = (rule, value, callback) => {
        if (value <= 0 || value > 100) {
          callback(new Error('请输入0-100的数字'));
        } else {
          callback();
        }
      };
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
          selection: false,
          addBtn: true,
          align: 'center',
          column: [
            {
              label: "汇率",
              prop: "exchangeRate",
              rules: [
                {
                  required: true,
                  message: "请输入汇率",
                  trigger: "blur"
                },
                { 
                  required: true,
                  validator: validatePass, 
                  trigger: 'blur' 
                }
              ],
              type: 'number',
              maxlength: 3,
              span: 24,
              labelWidth:120,
              slot: true
            },
            {
              label: "类型",
              prop: "type",
              type: 'select',
              dicUrl: "/api/blade-system/dict/dictionary?code=exchangeRate",
              addDisplay: true,
              editDisplay: false,
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              rules: [{
                required: true,
                message: "请选择类型",
                trigger: "blur"
              }],
              span: 24,
              labelWidth:120
            },
            {
              label: "手机类型",
              prop: "place",
              type: 'select',
              dicUrl: "/api/blade-system/dict/dictionary?code=phone_type",
              addDisplay: true,
              editDisplay: false,
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              rules: [{
                required: true,
                message: "请选择类型",
                trigger: "blur"
              }],
              span: 24,
              labelWidth:120
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
          addBtn: true,
          viewBtn: false,
          delBtn: true,
          // editBtn: this.vaildData(this.permission.exchangerate_edit, false)
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
