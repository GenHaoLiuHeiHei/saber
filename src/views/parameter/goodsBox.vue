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
  import {getList, getDetail, add, update, remove} from "@/api/parameter/goodsbox";
  import {mapGetters} from "vuex";
  import {getGoodsList} from "@/api/parameter/goods";
  import { findObject } from '@/util/util'
  export default {
    data() {
      return {
        goodsType: {
          chest: [],
          supplies: []
        },
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
              label: "物品名称",
              prop: "goodsId",
              type: 'select',
              dicData: [],
              rules: [{
                required: true,
                message: "请选择物品名称",
                trigger: "blur"
              }],
              span: 24,
              labelWidth:200
            },
            {
              label: "宝箱里面的物品",
              prop: "goodsChildId",
              type: 'select',
              dicData: [],
              rules: [{
                required: true,
                message: "请选择宝箱里面的物品",
                trigger: "blur"
              }],
              span: 24,
              labelWidth:200
            },
            {
              label: "物品数量随机数最小",
              type: 'number',
              prop: "childMinNum",
              rules: [{
                required: true,
                message: "请输入物品数量随机数最小",
                trigger: "blur"
              }],
              span: 24,
              labelWidth:200
            },
            {
              label: "物品数量随机数最大",
              type: 'number',
              prop: "childMaxNum",
              rules: [{
                required: true,
                message: "请输入物品数量随机数最大",
                trigger: "blur"
              }],
              span: 24,
              labelWidth:200
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
          // addBtn: this.vaildData(this.permission.goodsbox_add, false),
          // viewBtn: this.vaildData(this.permission.goodsbox_view, false),
          // delBtn: this.vaildData(this.permission.goodsbox_delete, false),
          // editBtn: this.vaildData(this.permission.goodsbox_edit, false)
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
       'goodsType.chest':{
          handler(val){
            let goodsId = findObject(this.option.column,'goodsId');
            goodsId.dicData = val;
          },
          immediate: true
        },
        'goodsType.supplies':{
          handler(val){
            let goodsId = findObject(this.option.column,'goodsChildId');
            goodsId.dicData = val;
          },
          immediate: true
        },
    },
    created () {
      let this_ = this;
       getGoodsList(this.page.currentPage, 100).then(res => {
          const data = res.data.data.records;
          data.map(v => {
            let res = {};
            res.label = v.goodsName;
            res.value = v.id;
            if (v.goodsType === 1) {
              this_.goodsType.chest.push(res)
            } else {
              this_.goodsType.supplies.push(res)
            }
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
