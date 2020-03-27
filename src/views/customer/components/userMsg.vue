<template>
  <basic-container>
    <avue-crud 
      ref="crud"
      v-model="form"
      :option="option"
      :table-loading="loading"
      :data="data"
      :page="page"
      :permission="permissionList"
      @search-change="searchChange"
      @search-reset="searchReset"
      @selection-change="selectionChange"
      @current-change="currentChange"
      @size-change="sizeChange"
      @on-load="onLoad">
      <template slot="bookHoardSum" slot-scope="scope">
        <!-- 收藏 -->
        <div class="isColorShow" @click="showModalInfo(scope.row, 'bookHoard')">{{scope.row.bookHoardSum}}</div>
      </template>
      <template slot="bookLikeSum" slot-scope="scope">
        <!-- 赞 -->
        <div class="isColorShow" @click="showModalInfo(scope.row, 'bookLike')">{{scope.row.bookLikeSum}}</div>
      </template>
      <template slot="bookConmmentSum" slot-scope="scope">
        <!-- 评论 -->
        <div class="isColorShow" @click="showModalInfo(scope.row, 'bookComment')">{{scope.row.bookConmmentSum}}</div>
      </template>
      <template slot="violationSum" slot-scope="scope">
        <!-- 违规 -->
        <div class="isColorShow" style="color:red !important" @click="showModalInfo(scope.row, 'userViolation')">{{scope.row.violationSum}}</div>
      </template>
      <template slot="realGold" slot-scope="scope">
        <!-- 余额 -->
        <div class="isColorShow" @click="showModalInfo(scope.row, 'userRealGold', true)">
          {{scope.row.realGold}}
          <div>修改</div>
        </div>
      </template>
      <template slot="bookChapterSum" slot-scope="scope">
        <!-- 章节 -->
        <div class="isColorShow">{{scope.row.bookChapterSum}}</div>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button type="button" size="small" class="el-button--text" icon="el-icon-edit" @click="showModalInfo(scope.row, 'userNotice', true)">通知</el-button>
        <el-button type="button" size="small" class="el-button--text" icon="el-icon-edit" @click="showModalInfo(scope.row, 'userSetUpBlogger', true)"  v-if="scope.row.isBlogger == '0'">设置博主</el-button>
        <el-button type="button" size="small" class="el-button--text color-red" icon="el-icon-edit" @click="showModalInfo(scope.row, 'userCancelBlogger', true)" v-else>取消博主</el-button>
        <el-button type="button" size="small" class="el-button--text color-red" icon="el-icon-edit" @click="showModalInfo(scope.row, 'userBlocked', true)" v-if="scope.row.status == '0'">停封</el-button>
        <el-button type="button" size="small" class="el-button--text" icon="el-icon-edit" @click="showModalInfo(scope.row, 'userRelieve', true)" v-else>解封</el-button>
      </template>
    </avue-crud>
    <el-dialog :title="title" :visible.sync="isShowDialog" :modal="false" :close-on-click-modal="false" @close="closeDialogAddgsVisible">
      <div v-if='!isNotTbale'>
        <infoModal :modalInfoType="modalInfoType"  v-if="isShowDialog" :formDatas="formDatas" :optionTabs="optionTabs" toForm='user' @close="closeDialogAddgsVisible"></infoModal>
      </div>
      <div v-else>
        <indexNoSearch
          toForm='user'
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
  import {getList} from "@/api/customer/customer";
  import {mapGetters} from "vuex";
  import indexNoSearch from '@/components/infoModal/isNoSearch/index';
  import infoModal from '@/components/infoModal/isSearch/index';

  export default {
    components: {
      infoModal,
      indexNoSearch
    },
    data() {
      return {
        formDatas: {},
        isNotTbale: false,
        isShowDialog: false,
        modalInfoType: "",
        bookNoId: '',
        form: {},
        title: '',
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
          editBtn: false,
          addBtn: false,
          delBtn: false,
          align:'center',
          column: [
            {
              label: "ID",
              prop: "id",
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
              label: "收藏",
              prop: "bookHoardSum",
              slot: true
            },
            {
              label: "赞",
              prop: "bookLikeSum",
              slot: true
            },
            {
              label: "评论",
              prop: "bookConmmentSum",
              slot: true
            },
             {
              label: "违规",
              prop: "violationSum",
              slot: true
            },
            {
              label: "余额",
              prop: "realGold",
              slot: true
            },
            {
              label: "历史充值",
              prop: "rechargeCount"
            },
            {
              label: "关注",
              prop: "concernSum"
            },
            {
              label: "粉丝",
              prop: "fansSum"
            }
          ]
        },
        optionTabs: {
          column: [
            {
              label: "书籍",
              prop: "book"
            },
            {
              label: "动态",
              prop: "dynamic"
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
          editBtn: true,
          // addBtn: this.vaildData(this.permission.customer_add, false),
          // viewBtn: this.vaildData(this.permission.customer_view, false),
          // delBtn: this.vaildData(this.permission.customer_delete, false),
          // editBtn: this.vaildData(this.permission.customer_edit, false)
        };
      }
    },
    methods: {

      // 列表点开模态框
      showModalInfo (row, type, isNotTbale) {
        this.formDatas = row;
        this.modalInfoType = type;
        switch (type) {
          case 'bookHoard':
            this.title = '收藏列表'
            break
          case 'bookLike': 
            this.title = '点赞列表'
            break
          case 'bookComment': 
            this.title = '评论列表'
            break
          case 'bookChapter': 
            this.title = '章节列表'
            break
          case 'userNotice': 
            this.title = '通知'
            break
          case 'userSetUpBlogger': 
            this.title = '设置博主'
            break
          case 'userCancelBlogger': 
            this.title = '取消博主'
            break
          case 'userBlocked': 
            this.title = '停封用户'
            break
          case 'userRelieve': 
            this.title = '解封用户'
            break
          case 'userViolation': 
            this.title = '违规用户'
            break
        }
        this.isNotTbale = isNotTbale ? isNotTbale : false;
        this.isShowDialog = true;
      },

      //关闭模态框
      closeDialogAddgsVisible(res){
        this.isShowDialog = false;
        if (res) this.onLoad(this.page)
      },

      // 表单重置搜索
      searchReset() {
        this.query = {};
        this.onLoad(this.page);
      },

      // 表单input搜索
      searchChange(params) {
        this.query = params;
        console.log(this.query)
        this.onLoad(this.page, params);
      },

      // 表单select搜索
      selectionChange(list) {
        this.selectionList = list;
      },

      // 重置表单
      selectionClear() {
        this.selectionList = [];
        this.$refs.crud.toggleSelection();
      },

      // 切换下一页
      currentChange(currentPage){
        this.page.currentPage = currentPage;
      },

      // 改变表单请求页大小
      sizeChange(pageSize){
        this.page.pageSize = pageSize;
      },

      // 初始化
      onLoad(page, params = {}) {
        this.loading = false;
        let isPutaway = null;
        getList(page.currentPage, page.pageSize, isPutaway, Object.assign(params, this.query)).then(res => {
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
