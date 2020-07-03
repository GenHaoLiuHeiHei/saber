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
      @search-change="searchChange"
      @search-reset="searchReset"
      @selection-change="selectionChange"
      @current-change="currentChange"
      @size-change="sizeChange"
      @on-load="onLoad"
    >
      <template slot="menuLeft">
        <el-button type="danger" size="small" icon="el-icon-delete" plain @click="handleDelete">删 除</el-button>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button
          type="button"
          size="small"
          class="el-button--text color-red"
          icon="el-icon-edit"
          v-if="scope.row.tagState === 2"
          @click="changeUpdate(scope.row, 1)"
        >启 用</el-button>
        <el-button
          type="button"
          size="small"
          class="el-button--text"
          icon="el-icon-edit"
          v-if="scope.row.tagState === 1"
          @click="changeUpdate(scope.row, 2)"
        >停 用</el-button>
        <el-button
          type="button"
          size="small"
          class="el-button--text"
          v-else
          icon="el-icon-delete"
          @click="rowDel(scope.row)"
        >删 除</el-button>
      </template>
      <template slot="tagTime" slot-scope="scope">{{scope.row.tagTime}} 天</template>
    </avue-crud>
  </basic-container>
</template>

<script>
import { getList, getDetail, add, update, remove } from "@/api/book/tag";
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
        tip: false,
        border: true,
        viewBtn: false,
        delBtn: false,
        selection: true,
        column: [
          {
            label: "标签名称",
            prop: "tagName",
            labelWidth: 100,
            span: 13,
            rules: [
              {
                required: true,
                message: "请输入",
                trigger: "blur"
              }
            ]
          },
          {
            label: "关联",
            type: "select",
            labelWidth: 100,
            span: 13,
            dicUrl: "/api/blade-system/dict/dictionary?code=bookRelated",
            props: {
              label: "dictValue",
              value: "dictKey"
            },
            prop: "dataCorrelateId",
            rules: [
              {
                required: true,
                message: "请选择",
                trigger: "change"
              }
            ]
          },
          {
            label: "权重",
            prop: "tagWeights",
            type: "select",
            labelWidth: 100,
            span: 13,
            dicData: [
              {
                label: "100",
                value: 100
              },
              {
                label: "90",
                value: 90
              },
              {
                label: "80",
                value: 80
              },
              {
                label: "70",
                value: 70
              }
            ],
            rules: [
              {
                required: true,
                message: "请选择",
                trigger: "change"
              }
            ]
          },
          {
            label: "时间(天)",
            prop: "tagTime",
            labelWidth: 100,
            span: 13,
            // placeholder: "单位为天",
            type: "number",
            rules: [
              {
                required: true,
                message: "请输入标签时间",
                trigger: "blur"
              }
            ],
            slot: true
          },
          {
            label: "标签颜色",
            prop: "tagColor",
            labelWidth: 100,
            span: 13,
            type: "color",
            colorFormat: "hex",
            editDisabled: true,
            addDisabled: true,
            rules: [
              {
                required: true,
                message: "请选择标签颜色",
                trigger: "blur"
              }
            ],
            change(data) {
              console.log(data);
            }
          },
          {
            hide: true,
            label: "",
            labelWidth: 100,
            span: 13,
            prop: "tagState",
            addDisplay: false,
            editDisplay: false,
            rules: [
              {
                required: true,
                message: "请输入",
                trigger: "blur"
              }
            ]
          },
          {
            label: "管理员密码",
            labelWidth: 100,
            span: 13,
            prop: "password",
            hide: true,
            rules: [
              {
                required: true,
                message: "请输入",
                trigger: "blur"
              }
            ]
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
        editBtn: true
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
    changeUpdate(row, status) {
      let msg = "确定将选择该标签启用";
      this.$confirm(msg, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          row.tagState = status;
          return update(row);
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
      this.loading = false;
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
