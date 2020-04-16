<template>
  <basic-container>
    <avue-crud
      :option="option"
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
      @on-load="onLoad"
    >
      <template slot="menuLeft" slot-scope="scope">
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
                   @click="showModalInfo(scope.row, 'quartzjobLog')">日 志
        </el-button>
      </template>
      <template slot-scope="scope" slot="isPause">
        <span v-if="scope.row.isPause === 1" class="color-green">运行中</span>
        <span v-else class="color-orange">已暂停</span>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button
          v-if="scope.row.isPause === 1"
          type="button"
          size="small"
          class="el-button--text"
          icon="el-icon-edit"
          @click="updateIsPauses(scope.row, 2)"
        >
        暂停
        </el-button>
         <el-button
          v-else
          type="button"
          size="small"
          class="el-button--text"
          icon="el-icon-edit"
          @click="updateIsPauses(scope.row, 1)"
        >
        恢复
        </el-button>
        <el-button
          type="button"
          size="small"
          class="el-button--text"
          icon="el-icon-edit"
          @click="executions(scope.row)"
        >执行</el-button>
      </template>
    </avue-crud>
    <el-dialog
      :title="title"
      :visible.sync="isShowDialog"
      :modal="false"
      :close-on-click-modal="false"
      @close="closeDialogAddgsVisible"
    >
      <infoModal 
        :modalInfoType="modalInfoType" 
        v-if="isShowDialog" 
        :formDatas="formDatas" 
        tofrom="book" 
        :optionTabs="optionTabs"
        :isOptionTab="isOptionTab"
        :isShowSeach="isShowSeach"
        @closeDialogAddgsVisible="closeDialogAddgsVisible">
        </infoModal>
    </el-dialog>
  </basic-container>
</template>
<script>
import {getList, add, update, remove, updateIsPause, execution} from "@/api/system/quartzjob";
import { mapGetters } from "vuex";
import {modalMixin} from "@/mixins/modalMixin";
import infoModal from "@/components/infoModal/index";
export default {
  mixins: [modalMixin],
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
              slot: true, 
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
  components: {
    infoModal
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: true,
        viewBtn: false,
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
    // 更改定时任务状态
    updateIsPauses(row, isPause) {
      row.isPause = isPause;
      updateIsPause(row).then(() => {
        this.onLoad(this.page);
        this.$message({
          type: "success",
          message: "操作成功!"
        });
      }, error => {
        console.log(error);
      });
    },
    //执行定时任务
    executions(row) {
      execution(row).then(() => {
        this.onLoad(this.page);
        this.$message({
          type: "success",
          message: "操作成功!"
        });
      }, error => {
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
