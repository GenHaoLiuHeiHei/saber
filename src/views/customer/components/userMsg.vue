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
        <div class="isColorShow" @click="showModalInfo(scope.row, 'bookLike', true, true)">{{scope.row.bookLikeSum}}</div>
      </template>
      <template slot="bookConmmentSum" slot-scope="scope">
        <!-- 评论 -->
        <div class="isColorShow" @click="showModalInfo(scope.row, 'bookComment', true, true)">{{scope.row.bookConmmentSum}}</div>
      </template>
      <template slot="violationSum" slot-scope="scope">
        <!-- 违规 -->
        <div class="isColorShow" style="color:red !important" @click="showModalInfo(scope.row, 'bookViolation', true, true)">{{scope.row.violationSum}}</div>
      </template>
      <template slot="realGold" slot-scope="scope">
        <!-- 余额 -->
        <div class="isColorShow" @click="showModalInfo(scope.row, 'userRealGold')">
          {{scope.row.realGold}}
          <div>修改</div>
        </div>
      </template>
      <template slot="bookChapterSum" slot-scope="scope">
        <!-- 章节 -->
        <div class="isColorShow">{{scope.row.bookChapterSum}}</div>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button type="button" size="small" class="el-button--text" icon="el-icon-edit" @click="showModalInfo(scope.row, 'userNotice')">通知</el-button>
        <el-button type="button" size="small" class="el-button--text" icon="el-icon-edit" @click="showModalInfo(scope.row, 'userSetUpBlogger')"  v-if="scope.row.isBlogger == '0'">设置博主</el-button>
        <el-button type="button" size="small" class="el-button--text color-red" icon="el-icon-edit" @click="showModalInfo(scope.row, 'userCancelBlogger')" v-else>取消博主</el-button>
        <el-button type="button" size="small" class="el-button--text color-red" icon="el-icon-edit" @click="showModalInfo(scope.row, 'userBlocked')" v-if="scope.row.status == '0'">停封</el-button>
        <el-button type="button" size="small" class="el-button--text" icon="el-icon-edit" @click="showModalInfo(scope.row, 'userRelieve')" v-else>解封</el-button>
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
  import {getList} from "@/api/customer/customer";
  import {mapGetters} from "vuex";
  import {modalMixin} from "@/mixins/modalMixin";
  import infoModal from '@/components/infoModal/index';
  export default {
    mixins: [modalMixin],
    components: {
      infoModal
    },
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
          viewBtn: false,
          editBtn: false,
          addBtn: false,
          delBtn: false,
          align:'center',
          column: [
            {
              label: "ID",
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
              label: "钻石余额",
              prop: "realGold",
              slot: true
            },
            {
              label: "金币余额",
              prop: "silverCoin",
            },
             {
              label: "假币",
              prop: "fakeGold",
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
              prop: "blog"
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

      // 表单重置搜索
      searchReset() {
        this.query = {};
        this.onLoad(this.page);
      },

      // 表单input搜索
      searchChange(params) {
        this.query = params;
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
        getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          data.records.map(v => {
            v.areaNum = Number(v.areaNum)
          })
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
