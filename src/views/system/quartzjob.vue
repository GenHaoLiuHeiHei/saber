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
      <template slot="menuLeft">
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   @click="handleDelete">删 除
        </el-button>
        <el-button type="primary"
                   size="small"
                   icon="el-icon-edit"
                   plain
                   @click="handleDelete">日 志
        </el-button>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button
          type="button"
          size="small"
          class="el-button--text"
          icon="el-icon-edit"
          @click="showModalInfo(scope.row, 'operationWithdraw', false)"
        >详情</el-button>
      </template>
    </avue-crud>
    <el-dialog
      :title="title"
      :visible.sync="isShowDialog"
      :modal="false"
      :close-on-click-modal="false"
      @close="closeDialogAddgsVisible"
    >
      <div v-if="!isNotTbale">
        <infoModal
          :modalInfoType="modalInfoType"
          v-if="isShowDialog"
          :formDatas="formDatas"
          tofrom="book"
          :optionTabs="optionTabs"
          @close="closeDialogAddgsVisible"
        ></infoModal>
      </div>
      <div v-else>
        <indexNoSearch
          :modalInfoType="modalInfoType"
          :formDatas="formDatas"
          v-if="isShowDialog"
          @closeDialogAddgsVisible="closeDialogAddgsVisible"
        ></indexNoSearch>
      </div>
    </el-dialog>
  </basic-container>
</template>
<script>
import {getList, getDetail, add, update, remove} from "@/api/system/quartzjob";
import { mapGetters } from "vuex";
import indexNoSearch from "@/components/infoModal/isNoTab/index";
import infoModal from "@/components/infoModal/isTab/index";
export default {
  data() {
    return {
      formDatas: {},
      modalInfoType: "",
      title: "",
      isShowDialog: false,
      isNotTbale: false,
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
        align: "center",
        tip: false,
        border: true,
        index: false,
        viewBtn: true,
        selection: true,
        excelBtn:true,
        column: [
            {
              label: "定时器名称",
              prop: "jobName",
              span: 24,
              labelWidth: 120,
              rules: [{
                required: true,
                message: "请输入定时器名称",
                trigger: "blur"
              }],
              search: true
            },
            {
              label: "Bean名称",
              span: 24,
              labelWidth: 120,
              prop: "beanName",
              rules: [{
                required: true,
                message: "请输入Bean名称",
                trigger: "blur"
              }]
            },
            {
              label: "方法名称",
              prop: "methodName",
              span: 24,
              labelWidth: 120,
              rules: [{
                required: true,
                message: "请输入方法名称",
                trigger: "blur"
              }]
            },
            {
              label: "参数",
              prop: "params",
              span: 24,
              labelWidth: 120,
              rules: [{
                required: true,
                message: "请输入参数",
                trigger: "blur"
              }]
            },
            {
              label: "cron表达式",
              prop: "cronExpression",
              span: 24,
              labelWidth: 120,
              rules: [{
                required: true,
                message: "请输入cron表达式",
                trigger: "blur"
              }]
            },
            {
              label: "状态",
              prop: "isPause",
              type: 'select',
              dicUrl: "/api/blade-system/dict/dictionary?code=timed_task",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              span: 24,
              labelWidth: 120,
              rules: [{
                required: true,
                message: "请选择状态",
                trigger: "blur"
              }]
            },
            {
              label: "备注",
              prop: "remark",
              span: 24,
              labelWidth: 120,
              rules: [{
                required: true,
                message: "请输入备注",
                trigger: "blur"
              }],
              type: 'textarea'
            },
            {
              label: "创建时间",
              prop: "createTime",
              addDisplay: false,
              editDisplay: false
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
      optionTabs: {
        column: [
          {
            label: "提现",
            prop: "isNotShowSearch"
          },
          {
            label: "明细",
            prop: "operationDetails"
          }
        ]
      },
      data: []
    };
  },
  watch: {
    title: {
      handler(newValue) {
        if (newValue === "bookChapterList" && !this.isShowDialog) {
          this.closeDialogAddgsVisible(true);
        }
      }
    }
  },
  components: {
    infoModal,
    indexNoSearch
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: true,
        viewBtn: true,
        delBtn: true,
        editBtn: true,
        // addBtn: this.vaildData(this.permission.quartzjob_add, false),
        // viewBtn: this.vaildData(this.permission.quartzjob_view, false),
        // delBtn: this.vaildData(this.permission.quartzjob_delete, false),
        // editBtn: this.vaildData(this.permission.quartzjob_edit, false)
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
    // 列表点开模态框
    showModalInfo(row, type, isNotTbale) {
      this.formDatas = row;
      this.formDatas.isDetails = true;
      this.modalInfoType = type;
      switch (type) {
        case "operationWithdraw":
          this.title = "提现";
          break;
      }
      this.isNotTbale = isNotTbale ? isNotTbale : false;
      this.isShowDialog = true;
    },
    //关闭模态框
    closeDialogAddgsVisible(res) {
      this.title = "";
      this.isShowDialog = false;
      if (res) this.onLoad(this.page);
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
