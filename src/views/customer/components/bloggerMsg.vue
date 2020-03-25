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
      <template slot="bookComment" slot-scope="scope">
        <!-- 评论 -->
        <div class="isColorShow" @click="showModalInfo(scope.row, 'bookComment')">{{scope.row.bookComment}}</div>
      </template>
      <template slot="bookBrowse" slot-scope="scope">
        <!-- 浏览 -->
        <div class="isColorShow">{{scope.row.bookBrowse}}</div>
      </template>
      <template slot="bookChapterSum" slot-scope="scope">
        <!-- 章节 -->
        <div class="isColorShow">{{scope.row.bookChapterSum}}</div>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button type="button" size="small" class="el-button--text" icon="el-icon-edit">通知</el-button>
        <el-button type="button" size="small" class="el-button--text" icon="el-icon-edit">取消博主</el-button>
        <el-button type="button" size="small" class="el-button--text" icon="el-icon-edit">编辑章节</el-button>
      </template>
    </avue-crud>
    <el-dialog :title="title" :visible.sync="modalInfo" @close="closeDialogAddgsVisible">
      <div v-if="modalInfo">
        <infoModal
          :modalInfoType="modalInfoType"
          :bookFormDatas="bookFormDatas"
          :optionTabs="optionTabs"
        ></infoModal>
      </div>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="modalInfoNoSearch" @close="closeDialogNoSearch">
      <div v-if="modalInfoNoSearch">
        <indexNoSearch
          :modalInfoType="modalInfoType"
          :formDatas="formDatas"
          @closeDialogNoSearch="closeDialogNoSearch"
        ></indexNoSearch>
      </div>
    </el-dialog>
  </basic-container>
</template>
<script>
  import {get_blogger_list} from "@/api/customer/customer";
  import {mapGetters} from "vuex";
  import infoModal from '@/components/infoModal/isNoSearch/index';
  import indexNoSearch from '@/components/infoModal/isSearch/index';
  export default {
    components: {
      infoModal,
      indexNoSearch
    },
    data() {
      return {
        formDatas: {},
        modalInfoNoSearch: false,
        modalInfoType: "",
        bookNoId: '',
        form: {},
        formDataType: 'add',
        title: '书籍',
        dialogAddgsVisible: false,
        modalInfo: false,
        bookFormDatas: {},
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
          menuWidth: 100,
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
              label: "博文",
              prop: "articleSum"
            },
            {
              label: "文章",
              prop: "articleSum"
            },
            {
              label: "图片",
              prop: "pictureSum"
            },
            {
              label: "视频",
              prop: "videoSum"
            },
            {
              label: "书籍",
              prop: "bookSum"
            },
            {
              label: "收藏",
              prop: "hoardSum"
            },
            {
              label: "赞",
              prop: "likeSum"
            },
            {
              label: "评论",
              prop: "conmmentSum"
            },
             {
              label: "违规",
              prop: "violationSum"
            },
            {
              label: "余额",
              prop: "realGold",
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
      showModalInfo (row, type) {
        this.bookNoId = row.bookNoId;
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
          case 'bookBrowse': 
            this.title = '浏览列表'
            break
          case 'bookChapter': 
            this.title = '章节列表'
            break
        }
        this.modalInfo = true;
      },

      //关闭模态框
      closeDialogAddgsVisible(res){
        this.dialogAddgsVisible = false;
        this.formDataType = '';
        if (res) this.onLoad(this.page)
      },
      closeDialogNoSearch(res) {
        console.log(res);
        this.modalInfoNoSearch = false;
        if (res) this.onLoad(this.page);
      },

      // 点击设置
      rowSetUp(row) {
        this.dialogAddgsVisible = true;
        this.bookFormDatas = row;
        this.title = '书籍设置';
        this.formDataType = 'setUp';
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
        get_blogger_list(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
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
