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
      <template slot-scope="scope" slot="menu">
        <div v-if="scope.row.status === 1">
          <el-button
            type="button"
            size="small"
            class="el-button--text"
            icon="el-icon-edit"
            @click="showUpdate(scope.row, 2)"
          >同意</el-button>
          <el-button
            type="button"
            size="small"
            class="el-button--text"
            icon="el-icon-edit"
            @click="showUpdate(scope.row, 3)"
          >拒绝</el-button>
        </div>
        <div v-else>
           <el-button
            type="button"
            size="small"
            class="el-button--text"
          >暂无</el-button>
        </div>
      </template>
      <template slot-scope="scope" slot="updateUserName">
        <div v-if="scope.row.status === 1">
          暂无          
        </div>
        <div v-else>
           {{scope.row.updateUserName}}
        </div>
      </template>
       <template slot-scope="scope" slot="updateTime">
        <div v-if="scope.row.status === 1">
          暂无          
        </div>
        <div v-else>
           {{scope.row.updateTime}}
        </div>
      </template>
    </avue-crud>
    <el-dialog
      :visible.sync="isShowDialog"
      :modal="false"
      :close-on-click-modal="false"
      @close="closeDialogAddgsVisible"
    >
      <el-form :model="formData" ref="formData" :rules="formDataRules" id="formData" label-width="100px">
        <el-row>
          <el-col :span="16">
            <el-form-item label="申请人">
              <el-input v-model="formData.customerNickName" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="博主昵称">
              <el-input v-model="formData.bloggerNickName" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="坐标编号" prop="siteNum">
              <el-select v-model="formData.siteNum" class="w100" placeholder="请选择坐标编号">
                <el-option
                  v-for="item in dicData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="dialog-footer p-t text-center">
          <el-button type="primary" @click="submitForm('formData')">确 定</el-button>
        </div>
      </el-form>
    </el-dialog>
  </basic-container>
</template>

<script>
import {
  getList,
  getDetail,
  add,
  update,
  remove
} from "@/api/customer/customerapplylog";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      isShowDialog: false,
      form: {},
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      selectionList: [],
      dicData: [
        {
          label: "1",
          value: 1
        },
        {
          label: "2",
          value: 2
        },
        {
          label: "3",
          value: 3
        },
        {
          label: "4",
          value: 4
        },
        {
          label: "5",
          value: 5
        },
        {
          label: "6",
          value: 6
        }
      ],
      formData: {},
      option: {
        tip: false,
        border: true,
        index: false,
        viewBtn: false,
        selection: false,
        align: "center",
        column: [
          {
            label: "申请人",
            prop: "customerNickName",
            span: 24,
            labelWidth: 120
          },
          {
            label: "申请人ID",
            prop: "customerNumber",
            span: 24,
            labelWidth: 120
          },
          {
            label: "博主昵称",
            prop: "bloggerNickName",
          },
          {
            label: "博主座位编号",
            prop: "bloggerSiteNum",
          },
          {
            label: "博主区域编号",
            prop: "areaNum"
          },
          {
            label: "处理状态",
            prop: "status",
            type: "select",
            dicUrl: "/api/blade-system/dict/dictionary?code=processing_status",
            props: {
              label: "dictValue",
              value: "dictKey"
            },
            search: true
          },
          {
            label: "申请状态",
            prop: "applyStatus",
            type: "select",
            dicUrl: "/api/blade-system/dict/dictionary?code=application_status",
            props: {
              label: "dictValue",
              value: "dictKey"
            },
            search: true
          },
          {
            label: "申请时间",
            prop: "createTime"
          },
          {
            label: "处理时间",
            prop: "updateTime",
            slot: true
          },
          {
            label: "处理人",
            prop: "updateUserName",
            slot: true
          },
          {
            label: "坐标编号",
            prop: "siteNum",
            type: "select",
            hide: true,
          }
        ]
      },
      data: [],
      formDataRules: {
        siteNum: [
          { required: true, message: "请选择坐标编号", trigger: "change" }
        ]
      }
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.customerapplylog_add, false),
        viewBtn: this.vaildData(this.permission.customerapplylog_view, false),
        delBtn: this.vaildData(this.permission.customerapplylog_delete, false),
        editBtn: this.vaildData(this.permission.customerapplylog_edit, false)
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
    showUpdate(row, state) {
      row.applyStatus = state;
      this.formData = row;
      this.isShowDialog = true;
    },
    closeDialogAddgsVisible(res) {
      this.formData = {};
      this.isShowDialog = false;
      this.onLoad(this.page);
    },
    submitForm(formName) {
      let this_ = this;
      this.$refs[formName].validate(valid => {
        console.log(this_.formData);
        if (valid) {
          update(this_.formData).then(
            () => {
              this_.onLoad(this_.page);
              this_.$message({
                type: "success",
                message: "操作成功!",
                onClose () {
                  this_.closeDialogAddgsVisible();
                  this_.onLoad(this_.page);
                }
              });
            },
            error => {
              console.log(error);
            }
          );
        } else {
          return false;
        }
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
