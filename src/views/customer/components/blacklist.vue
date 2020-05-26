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
     <template slot="blockReason" slot-scope="scope">
        <!-- 原因 -->
        <div class="isColorShow">
          {{scope.row.blockReason}}
          <!-- <div>
            <el-button type="button" size="small" class="el-button--text" @click="showModalInfo(scope.row, 'userRelieve', true)">详情</el-button>
          </div> -->
        </div>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button type="button" size="small" class="el-button--text" icon="el-icon-edit" @click="showModalInfo(scope.row, 'userRelieve')">解除封停</el-button>
      </template>
    </avue-crud>
    <el-dialog :title="title" :visible.sync="isShowDialog" @close="closeDialogAddgsVisible">
      <infoModal 
        :modalInfoType="modalInfoType" 
        v-if="isShowDialog" 
        :formDatas="formDatas" 
        tofrom="user" 
        :optionTabs="optionTabs"
        :isOptionTab="isOptionTab"
        :isShowSeach="isShowSeach"
        @closeDialogAddgsVisible="closeDialogAddgsVisible">
        </infoModal>
    </el-dialog>
  </basic-container>
</template>

<script>
import { getList } from "@/api/customer/blacklist";
import { mapGetters } from "vuex";
import {modalMixin} from "@/mixins/modalMixin";
import infoModal from '@/components/infoModal/index';
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
        tip: false,
        border: true,
        viewBtn: true,
        align: "center",
        column: [
          {
            label: "",
            prop: "id",
            hide: true
          },
          {
            label: "ID",
            prop: "customerNumber",
            search: true
          },
          {
            label: "昵称",
            prop: "customerNickname",
            search: true
          },
          {
            label: "绑定手机",
            prop: "customerPhoneNumber",
            search: true
          },
          {
            label: "注册时间",
            prop: "createTime"
          },
          {
            label: "封停时间",
            prop: "blockTime"
          },
          {
            label: "剩余时间",
            prop: "surplusTime"
          },
          {
            label: "原因",
            width: 250,
            prop: "blockReason",
            slot: true
          },
          {
            label: "操作人员",
            prop: "updateUserName"
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
        addBtn: this.vaildData(this.permission.blacklist_add, false),
        viewBtn: this.vaildData(this.permission.blacklist_view, false),
        delBtn: this.vaildData(this.permission.blacklist_delete, false),
        editBtn: this.vaildData(this.permission.blacklist_edit, false)
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
