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
       <template slot="status" slot-scope="scope">
        <!-- 赞 -->
        <div class="color-gray">已读</div>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList} from "@/api/report/feedback";
  import {mapGetters} from "vuex";
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
         align: "center",
          tip: false,
          border: true,
          index: false,
          viewBtn: true,
          selection: false,
          menu: false,
          column: [
            {
              label: "反馈人昵称",
              prop: "feedbackUserName",
            },
            {
              label: "反馈人ID",
              prop: "feedbackCustomerNumber",
            },
            {
              label: "反馈时间",
              prop: "createTime",
            },
            {
              label: "内容",
              prop: "feedbackContent",
            },
            {
              label: "管理员",
              prop: "updateName",
            },
            {
              label: "状态",
              prop: "status",
              slot: true
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
        params.status = 1;
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
