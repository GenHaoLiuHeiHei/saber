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
      <template slot="relateComment" slot-scope="scope">
        <!-- 内容 -->
        <div v-if="scope.row.contentType !== 3">{{scope.row.relateComment}}</div>
        <div v-else>{{scope.row.blogTitle}}</div>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button
          type="button"
          size="small"
          class="el-button--text"
          icon="el-icon-edit"
          @click="showModalInfo(scope.row, 'operationNotBlockComments')"
        >不违规</el-button>
        <el-button
          type="button"
          size="small"
          class="el-button--text color-red"
          icon="el-icon-edit"
          @click="showModalInfo(scope.row, 'operationBlockComments')"
        >屏蔽</el-button>
      </template>
    </avue-crud>
    <el-dialog :title="title" :visible.sync="isShowDialog" :modal="false" :close-on-click-modal="false" @close="closeDialogAddgsVisible">
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
  import {dynamic_report} from "@/api/report/report";
  import {mapGetters} from "vuex";
  import {modalMixin} from "@/mixins/modalMixin";
  import infoModal from "@/components/infoModal/index";
  import {
  getViolation,
  getUnfriendly
  } from "@/api/book/library";
  export default {
    mixins: [modalMixin],
    data() {
      return {
        violationList: [],
        unfriendlytList: [],
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
              prop: "customerName",
              disabled: true,
              span: 24,
              labelWidth: 120,
              search: true
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
              prop: "beCustomerName",
              disabled: true,
              span: 24,
              labelWidth: 120
            },
            {
              label: "被举报人ID",
              prop: "beCustomerNumber",
              disabled: true,
              span: 24,
              labelWidth: 120
            },
            {
              label: "内容",
              prop: "relateComment",
              slot: true,
              disabled: true,
              span: 24,
              labelWidth: 120
            },
            {
              label: "举报原因",
              prop: "centextData",
              disabled: true,
              span: 24,
              labelWidth: 120
            },
            {
              label: "此条内容被举报次数",
              prop: "informNum",
              disabled: true,
              span: 24,
              labelWidth: 120
            },
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
        let this_ = this;
        this.loading = true;
        params.status = 1;
        params.type = 1;
        dynamic_report(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(datas => {
          let data = datas.data.data;
          this_.page.total = data.total;
          this_.loading = false;
          getViolation().then(ress => {
            this_.violationList = ress.data.data;
          }).then(() => {
            return getUnfriendly()
          }).then(res => {
            this_.unfriendlytList = res.data.data;
            data.records.map(i => {
              i.centextList = [];
              if (i.reasons.length) {
                JSON.parse(i.reasons).map(v => {
                  v.dictKey = v.dictKey.map(Number);
                  this_.violationList.map(s => {
                    if (v.code === "violation") {
                      if (v.dictKey.join(',').indexOf(s.dictKey) > -1) {
                        i.centextList.push(s.dictValue)
                      }
                    }
                  })
                  this_.unfriendlytList.map(s => {
                    if (v.code === "unfriendly") {
                      if (v.dictKey.join(',').indexOf(s.dictKey) > -1) {
                        i.centextList.push(s.dictValue)
                      }
                    }
                  })
                });
                i.centextData = i.centextList.join(',')
              }
            });
            this_.data = data.records;
            this.selectionClear();
          });
        });
      }
    }
  };
</script>

<style>
</style>
