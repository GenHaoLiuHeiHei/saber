<template>
  <basic-container>
    <avue-crud
      :option="option"
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
      @on-load="onLoad"
    >
      <template slot-scope="scope" slot="remark">
          <div v-if="scope.row.remark && scope.row.remark.length > 0">
              {{scope.row.remark}}
          </div>
          <div v-else>
              暂无
          </div>
      </template>
      <template slot-scope="scope" slot="updateTime">
        <div v-if="scope.row.updateTime && scope.row.updateTime.length > 0">
            {{scope.row.updateTime}}
        </div>
        <div v-else>
            暂无
        </div>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import {
  getList,
  getDetail,
  add,
  update,
  remove
} from "@/api/customer/payrank";
import { mapGetters } from "vuex";

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
        ttip: false,
        border: true,
        index: false,
        viewBtn: false,
        selection: false,
        menu: false,
        align: "center",
        column: [
          {
            label: "客户昵称",
            prop: "customerNickName",
            search: true
          },
          {
            label: "客户编号",
            prop: "customerNumber",
          },
          {
            label: "商品名称",
            prop: "goodsName",
          },
          {
            label: "订单编号",
            prop: "rechargeNoId",
            search: true
          },
          {
            label: "钻石数量",
            prop: "rechargeSum",
          },
          {
            label: "金币数量",
            prop: "silverCount",
          },
          {
            label: "充值金额",
            prop: "rechargeMoney",
          },
          {
            label: "充值途径",
            prop: "rechargeWay",
          },
          {
            label: "充值类型",
            prop: "type",
            dicData: [
              {
                label: "钻石",
                value: 1
              }
            ]
          },
          {
            label: "充值状态",
            prop: "rechargeStatus",
            type: "select",
            dicUrl: "/api/blade-system/dict/dictionary?code=pay_state",
            props: {
              label: "dictValue",
              value: "dictKey"
            },
            search: true
          },
          {
            label: "下单时间",
            prop: "createTime",
          },
          {
            label: "付款时间",
            prop: "updateTime",
            slot: true
          },
          {
            label: "备注",
            prop: "remark",
            slot: true
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
        addBtn: this.vaildData(this.permission.rechargeorder_add, false),
        viewBtn: this.vaildData(this.permission.rechargeorder_view, false),
        delBtn: this.vaildData(this.permission.rechargeorder_delete, false),
        editBtn: this.vaildData(this.permission.rechargeorder_edit, false)
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
      add(row).then(
        () => {
          loading();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        },
        error => {
          done();
          console.log(error);
        }
      );
    },
    rowUpdate(row, index, loading, done) {
      update(row).then(
        () => {
          loading();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        },
        error => {
          done();
          console.log(error);
        }
      );
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
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    onLoad(page, params = {}) {
      this.loading = true;
      getList(
        page.currentPage,
        page.pageSize,
        Object.assign(params, this.query)
      ).then(res => {
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
