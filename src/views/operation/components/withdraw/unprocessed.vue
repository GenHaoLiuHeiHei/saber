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
      @search-change="searchChange"
      @search-reset="searchReset"
      @selection-change="selectionChange"
      @current-change="currentChange"
      @size-change="sizeChange"
      @on-load="onLoad"
    >
      <template slot-scope="scope" slot="menu">
        <el-button
          type="button"
          size="small"
          class="el-button--text"
          icon="el-icon-edit"
          @click="showModalInfo(scope.row, 'operationWithdraw', false, false, 2)"
        >提现</el-button>
        <el-button
          type="button"
          size="small"
          class="el-button--text color-red"
          icon="el-icon-edit"
          @click="showModalInfo(scope.row, 'operationWithdraw', false, false, 3)"
        >拒绝</el-button>
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
import {
  getList
} from "@/api/customer/extractorder";
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
        selection: false,
        column: [
          {
            label: "提现单号",
            prop: "extractNoId",
            search: true
          },
          {
            label: "用户昵称",
            prop: "customerName",
            search: true
          },
          {
            label: "用户ID",
            prop: "customerNumber",
            search: true

          },
           {
            label: "提现金币",
            prop: "extractGold"
          },
          {
            label: "金额",
            prop: "extractMoney"
          },
          {
            label: "申请日期",
            prop: "createTime"
          }
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
  methods: {
    // 列表点开模态框
    showModalInfo(row, type, isShowSeach, isOptionTab, extractStatus) {
      this.formDatas = row;
      this.formDatas.extractStatus = extractStatus;
      this.modalInfoType = type;
      switch (type) {
        case "operationWithdraw":
          this.title = "提现";
          break;
      }
      this.isShowSeach = isShowSeach ? isShowSeach : false;
      this.isOptionTab = isOptionTab ? isOptionTab : false
      this.isShowDialog = true;
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
      params.extractStatus = 1;
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
