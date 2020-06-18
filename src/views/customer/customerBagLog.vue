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
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/customer/customerbaglog";
  import {mapGetters} from "vuex";
  import {findObject} from '@/util/util';
  import {getGoodsList} from "@/api/parameter/goods";
  export default {
    data() {
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
          align:'center',
          border: true,
          index: false,
          viewBtn: false,
          selection: false,
          menu: false,
          column: [
            // {
            //   label: "博主ID",
            //   prop: "bologgerId",
            // },
            // {
            //   label: "用户ID",
            //   prop: "customerId",
            // },
            {
              label: "用户昵称",
              prop: "customerName",
            },
            {
              label: "道具名称",
              prop: "goodsId",
              dicData: [],
            },
            {
              label: "物品数量",
              prop: "goodsNum",
            },
            {
              label: "赠送时间",
              prop: "createTime",
            },
          ]
        },
        data: []
      };
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
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          // addBtn: this.vaildData(this.permission.customerbaglog_add, false),
          // viewBtn: this.vaildData(this.permission.customerbaglog_view, false),
          // delBtn: this.vaildData(this.permission.customerbaglog_delete, false),
          // editBtn: this.vaildData(this.permission.customerbaglog_edit, false)
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
