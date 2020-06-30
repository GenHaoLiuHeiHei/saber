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
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/parameter/customersignconfig";
  import {mapGetters} from "vuex";
  import {findObject} from '@/util/util';
  import {getGoodsList} from "@/api/parameter/goods";
  export default {
    data() {
        var validatePass = (rule, value, callback) => {
            if (value <= 0) {
            callback(new Error('请输入大于0的数字'));
            } else {
            callback();
            }
        };
      return {
        goodsType: [],
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
          selection: true,
          align: 'center',
          column: [
            {
              label: "开始天数",
              type: 'number',
              prop: "beginDay",
              rules: [
                {
                    required: true,
                    message: "请输入开始天数",
                    trigger: "blur"
                },
                {
                    validator: validatePass, 
                    required: true,
                    trigger: "blur"
                }
              ],
              span: 24,
              labelWidth:120
            },
            {
              label: "结束天数",
              type: 'number',
              prop: "endDay",
              rules: [
                {
                    required: true,
                    message: "请输入结束天数",
                    trigger: "blur"
                },
                {
                    validator: validatePass, 
                    required: true,
                    trigger: "blur"
                }
              ],
              span: 24,
              labelWidth:120
            },
            {
              label: "奖励物品",
              prop: "goodsId",
              type: 'select',
              dicData: [],
              rules: [{
                required: true,
                message: "请输入奖励物品",
                trigger: "blur"
              }],
              span: 24,
              labelWidth:120
            },
            {
              label: "奖励数量",
              prop: "goodsNum",
              type: 'number',
              rules: [{
                required: true,
                message: "请输入奖励数量",
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
        //   addBtn: this.vaildData(this.permission.customersignconfig_add, false),
        //   viewBtn: this.vaildData(this.permission.customersignconfig_view, false),
        //   delBtn: this.vaildData(this.permission.customersignconfig_delete, false),
        //   editBtn: this.vaildData(this.permission.customersignconfig_edit, false)
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
    watch: {
       'goodsType':{
          handler(val){
            var goodsId = findObject(this.option.column,'goodsId');
            goodsId.dicData = val;
          },
          immediate: true
      },
    },
    created () {
      getGoodsList(this.page.currentPage, 100).then(res => {
          const data = res.data.data.records;
          this.goodsType = data.map(v => {
            let res = {};
            res.label = v.goodsName;
            res.value = v.id;
            return res
          });
      });
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
