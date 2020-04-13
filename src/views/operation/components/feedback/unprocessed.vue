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
          @click="showModalInfo(scope.row, 'operationFeedbackReply', true)"
        >回复</el-button>
        <el-button
          type="button"
          size="small"
          class="el-button--text"
          icon="el-icon-edit"
          @click="showModalInfo(scope.row, 'operationHaveRead', true)"
        >标为已读</el-button>
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
  import {getList} from "@/api/report/feedback";
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
              label: "反馈人昵称",
              prop: "feedbackUserName",
            },
            {
              label: "反馈人ID",
              prop: "feedbackUserId",
            },
            {
              label: "反馈时间",
              prop: "createTime",
            },
            {
              label: "内容",
              prop: "feedbackContent",
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
          case "operationFeedbackReply":
            this.title = "反馈回复";
            break;
          case "operationHaveRead":
            this.title = "标位已读";
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
        params.status = 0;
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
