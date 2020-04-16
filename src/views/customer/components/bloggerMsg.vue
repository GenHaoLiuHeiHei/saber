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
      <template slot="blogArticleSum" slot-scope="scope">
        <!-- 博文 -->
        <div class="isColorShow" @click="showModalInfo(scope.row, 'bookArticle')">{{scope.row.blogArticleSum}}</div>
      </template>
      <template slot="articleSum" slot-scope="scope">
        <!-- 文章 -->
        <div class="isColorShow">{{scope.row.articleSum}}</div>
      </template>
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
        <div class="isColorShow" style="color:red !important" @click="showModalInfo(scope.row, 'userViolation', true, true)">{{scope.row.violationSum}}</div>
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
        ref="dialogA"
        :modalInfoType="modalInfoType" 
        v-if="isShowDialog" 
        :formDatas="formDatas" 
        tofrom="book" 
        :optionTabs="optionTabs"
        :seachForms="seachForms"
        :isOptionTab="isOptionTab"
        :isShowSeach="isShowSeach"
        @closeDialogAddgsVisible="closeDialogAddgsVisible">
          <template v-slot:seach v-if="modalInfoType === 'bookArticle'">
            <el-form :inline="true" :model="seachForms"  class="demo-form-inline">
              <el-form-item :label="blogSum">
              </el-form-item>
              <el-form-item label="排序">
                <el-select v-model="seachForms.sortIndex" placeholder="排序方式" size="mini">
                  <el-option
                    v-for="item in blogSortList"
                    :key="item.dictKey"
                    :label="item.dictValue"
                    :value="item.dictKey"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="时间范围">
                <el-date-picker
                    size="mini"
                    type="datetime"
                    placeholder="选择开始时间"
                    value-format="yyyy-MM-dd hh:mm:ss"
                    v-model="seachForms.startTime"
                  ></el-date-picker>
              </el-form-item>
              <el-form-item label="至">
                <el-date-picker
                    size="mini"
                    type="datetime"
                    placeholder="选择结束时间"
                    value-format="yyyy-MM-dd hh:mm:ss"
                    v-model="seachForms.endTime"
                  ></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="mini" @click="onSubmit">搜索</el-button>
              </el-form-item>
            </el-form>
          </template>
          <template :v-slot="seach" v-else>
          </template>
        </infoModal>
    </el-dialog>
  </basic-container>
</template>
<script>
  import {get_blogger_list} from "@/api/customer/customer";
  import {mapGetters} from "vuex";
  import {modalMixin} from "@/mixins/modalMixin";
  import infoModal from '@/components/infoModal/index';
  import {getBlogSort} from "@/api/book/library";
  export default {
    mixins: [modalMixin],
    components: {
      infoModal
    },
    data() {
      return {
        blogSortList: [],
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
              label: "博文",
              prop: "blogArticleSum",
              slot: true
            },
            {
              label: "文章",
              prop: "articleSum",
              slot: true
            },
            {
              label: "图片",
              prop: "pictureSum",
              type: 'img'
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
        seachForms:{
          startTime: "",
          endTime: "",
          sortIndex: ""
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
      },
      blogSum () {
        return "共条" + this.formDatas.bookHoardSum + "博文"
      }
    },
    created () {
      let this_ = this;
      getBlogSort().then(res => {
        this_.blogSortList = res.data.data;
      });
    },
    methods: {
      onSubmit () {
        console.log(this.$refs.dialogA.onSubmit())
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
