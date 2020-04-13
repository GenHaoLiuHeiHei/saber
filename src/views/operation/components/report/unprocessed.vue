<template>
  <basic-container>
    <avue-crud :option="option"
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
               @on-load="onLoad">
      <template slot-scope="scope" slot="menu">
        <el-button
          type="button"
          size="small"
          class="el-button--text"
          icon="el-icon-edit"
          @click="showModalInfo(scope.row, 'operationNotBlockComments', true)"
        >不违规</el-button>
        <el-button
          type="button"
          size="small"
          class="el-button--text color-red"
          icon="el-icon-edit"
          @click="showModalInfo(scope.row, 'operationBlockComments', true)"
        >屏蔽</el-button>
      </template>
    </avue-crud>
    <el-dialog :title="title" :visible.sync="isShowDialog" :modal="false" :close-on-click-modal="false" @close="closeDialogAddgsVisible">
      <div v-if='!isNotTbale'>
        <infoModal :modalInfoType="modalInfoType" v-if="isShowDialog" :formDatas="formDatas" tofrom="book" :optionTabs="optionTabs"  @close="closeDialogAddgsVisible"></infoModal>
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
  import {outstanding_report} from "@/api/report/report";
  import {mapGetters} from "vuex";
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
          selection: false,
          column: [
            {
              label: "举报人昵称",
              prop: "customerNickName",
              disabled: true,
              span: 24,
              labelWidth: 120
            },
            {
              label: "举报人ID",
              prop: "customerNumber",
              disabled: true,
              span: 24,
              labelWidth: 120
            },
            {
              label: "举报时间",
              prop: "createTime",
              disabled: true,
              span: 24,
              labelWidth: 120
            },
            {
              label: "被举报人昵称",
              prop: "informeeNickName",
              disabled: true,
              span: 24,
              labelWidth: 120
            },
            {
              label: "被举报人ID",
              prop: "informeeNumber",
              disabled: true,
              span: 24,
              labelWidth: 120
            },
            {
              label: "内容",
              prop: "content",
              disabled: true,
              span: 24,
              labelWidth: 120
            },
             {
              label: "此条内容被举报次数",
              prop: "numberOfReports",
              disabled: true,
              span: 24,
              labelWidth: 120
            },
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
          addBtn: false,
          viewBtn: false,
          delBtn: false,
          editBtn: false,
          
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
        this.modalInfoType = type;
        switch (type) {
          case "operationBlockComments":
            this.title = "屏蔽";
            break;
          case "operationNotBlockComments":
            this.title = "不违规";
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
        outstanding_report(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
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
