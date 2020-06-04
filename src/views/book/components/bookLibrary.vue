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
      :upload-before="uploadBefore"
      :upload-after="uploadAfter"
      @row-update="rowUpdate"
      @row-del="rowDel"
      @row-save="rowSave"
      @search-change="searchChange"
      @search-reset="searchReset"
      @selection-change="selectionChange"
      @current-change="currentChange"
      @size-change="sizeChange"
      @on-load="onLoad"
    >
      <template slot="bookHoardSum" slot-scope="scope">
        <!-- 收藏 -->
        <div
          class="isColorShow"
          @click="showModalInfo(scope.row, 'userHoard')"
        >{{scope.row.bookHoardSum}}</div>
      </template>
      <template slot="bookLikeSum" slot-scope="scope">
        <!-- 赞 -->
        <div
          class="isColorShow"
          @click="showModalInfo(scope.row, 'userLike')"
        >{{scope.row.bookLikeSum}}</div>
      </template>
      <template slot="bookCommentSum" slot-scope="scope">
        <!-- 评论 -->
        <div
          class="isColorShow"
          @click="showModalInfo(scope.row, 'bookComment', true)"
        >{{scope.row.bookCommentSum}}</div>
      </template>
      <template slot="violationSum" slot-scope="scope">
        <!-- 违规 -->
        <div class="isColorShow" style="color:red !important" @click="showModalInfo(scope.row, 'bookViolation')">{{scope.row.violationSum}}</div>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button
          type="button"
          size="small"
          class="el-button--text"
          icon="el-icon-edit"
          @click="showUpdate(scope.row, scope.row.$index)"
        >编辑书籍</el-button>
        <el-button
          type="button"
          size="small"
          class="el-button--text"
          icon="el-icon-edit"
          @click="showModalInfo(scope.row, 'bookChapterList')"
        >编辑章节</el-button>
        <el-button
          type="button"
          size="small"
          class="el-button--text"
          icon="el-icon-edit"
          @click="showModalInfo(scope.row, 'bookSetUp')"
        >设置</el-button>
        <el-button
          type="button"
          size="small"
          class="el-button--text"
          icon="el-icon-edit"
          @click="showModalInfo(scope.row, 'bookTakeOff')"
          v-if="tabsType === 'shelves'"
        >下架</el-button>
        <el-button
          type="button"
          size="small"
          class="el-button--text"
          icon="el-icon-edit"
          @click="showModalInfo(scope.row, 'bookShelves')"
          v-else
        >上架</el-button>
      </template>
    </avue-crud>
    <el-dialog :title="title" :visible.sync="isShowDialog" :modal="false" :close-on-click-modal="false" @close="closeDialogAddgsVisible">
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
import { getList, add, update, remove } from "@/api/book/library";
import { baseUrl } from "@/config/env";
import { mapGetters } from "vuex";
import {modalMixin} from "@/mixins/modalMixin";
import infoModal from "@/components/infoModal/index";
export default {
  mixins: [modalMixin],
  props: {
    tabsType: {
      type: String,
      default: "shelves"
    }
  },
  watch: {
    tabsType: {
      handler() {
        this.page.currentPage = 1;
        this.searchReset();
      }
    },
    title: {
      handler(newValue) {
        if (newValue === "bookChapterList" && !this.isShowDialog) {
          this.closeDialogAddgsVisible(true);
        }
      }
    }
  },
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
        editBtn: true,
        addBtn: true,
        delBtn: true,
        align: "center",
        column: [
          {
            label: "书籍编号",
            prop: "bookNoId",
            addDisplay: false,
            editDisplay: false
          },
          {
            label: "书籍名称",
            search: true,
            prop: "bookName",
            rules: [
              {
                required: true,
                message: "请输入",
                trigger: "blur"
              }
            ]
          },
          {
            label: "作者名称",
            prop: "authorName",
            search: true,
            rules: [
              {
                required: true,
                message: "请输入",
                trigger: "blur"
              }
            ]
          },
          {
            label: "作者ID",
            prop: "authorId",
            search: true,
            span: 24,
            placeholder: "非博主用户可不填",
          },
          {
            label: "首次上传",
            prop: "createTime",
            addDisplay: false,
            editDisplay: false
          },
          {
            label: "更新时间",
            prop: "updateTime",
            addDisplay: false,
            editDisplay: false
          },
          {
            label: "收藏",
            prop: "bookHoardSum",
            addDisplay: false,
            editDisplay: false,
            slot: true
          },
          {
            label: "赞",
            prop: "bookLikeSum",
            addDisplay: false,
            editDisplay: false,
            slot: true
          },
          {
            label: "评论",
            prop: "bookCommentSum",
            addDisplay: false,
            editDisplay: false,
            slot: true
          },
          {
              label: "违规",
              prop: "violationSum",
              slot: true,
              addDisplay: false,
              editDisplay: false,
          },
          {
            label: "浏览",
            prop: "bookBrowse",
            addDisplay: false,
            editDisplay: false,
          },
          {
            label: "章节",
            prop: "bookChapterSum",
            addDisplay: false,
            editDisplay: false,
          },
          {
            label: "字数",
            prop: "bookWord",
            addDisplay: false,
            editDisplay: false
          },
          {
            label: "书籍简介",
            hide: true,
            prop: "bookIntro",
            span: 24,
            type: "textarea",
            maxlength: 500,
            rules: [
              {
                required: true,
                message: "请输入",
                trigger: "blur"
              }
            ]
          },
          {
            label: "ID",
            prop: "id",
            hide: true,
            addDisplay: false,
            editDisplay: false
          },
          {
            label: "封面图片",
            hide: true,
            prop: "bookPictureUrl",
            type: "upload",
            listType: "picture-img",
            span: 24,
            propsHttp: {
              res: "data",
              url: "link"
            },
            canvasOption: {
              text: ' ',
              ratio: 1
            },
            tip: "只能上传jpg/png文件，且不超过500kb",
            action: baseUrl + "api/blade-resource/oss/endpoint/put-file",
            rules: [
              {
                required: true,
                message: "请上传封面图片",
                trigger: "blur"
              }
            ]
          },
          {
            slot: true,
            hide: true,
            search: true,
            addDisplay: false,
            editDisplay: false,
            label: "完结",
            type: "select",
            dicUrl: "/api/blade-system/dict/dictionary?code=bookIsOver",
            props: {
              label: "dictValue",
              value: "dictKey"
            },
            prop: "isOver",
            rules: [
              {
                required: true,
                message: "请输入通知类型",
                trigger: "blur"
              }
            ]
          },
          {
            slot: true,
            hide: true,
            search: true,
            addDisplay: false,
            editDisplay: false,
            label: "排序",
            type: "select",
            dicUrl: "/api/blade-system/dict/dictionary?code=bookSort",
            props: {
              label: "dictValue",
              value: "dictKey"
            },
            prop: "orderAscs"
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
        editBtn: false
        // addBtn: this.vaildData(this.permission.book_add, false),
        // viewBtn: this.vaildData(this.permission.book_aview, false),
        // delBtn: this.vaildData(this.permission.book_adelete, false),
        // editBtn: this.vaildData(this.permission.book_aedit, false)
      };
    }
  },
  created () {
    console.log(this.optionTabs);
  },
  methods: {

    // 图片上传前的方法
    uploadBefore(file, done) {
      done();
    },

    // 图片上传后的方法
    uploadAfter(res, done) {
      if (res) this.option.column.bookPictureUrl = res.link;
      done();
    },

    // 新增方法保存按钮
    rowSave(row, loading, done) {
      add(row).then(
        () => {
          loading();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        },
        error => {
          done();
          console.log(error);
        }
      );
    },

    showUpdate (row, index) {
      if (row.authorId && row.authorId.length > 0) {
        this.option.column[3].editDisabled = true;
      } else {
        this.option.column[3].editDisabled = false;
      }
       this.$refs.crud.rowEdit(row, index);
    },
    // 编辑方法保存按钮
    rowUpdate(row, index, loading, done) {
      update(row).then(
        () => {
          loading();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        },
        error => {
          done();
          console.log(error);
        }
      );
    },

    // 删除方法保存按钮
    rowDel(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        });
    },

    // 表单重置搜索
    searchReset() {
      this.query = {};
      this.onLoad(this.page);
    },

    // 表单input搜索
    searchChange(params) {
      this.query = params;
      // console.log(this.query);
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
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },

    // 改变表单请求页大小
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },

    // 初始化
    onLoad(page, params = {}) {
      this.loading = true;
      let isPutaway = null;
      if (this.tabsType === "shelves") {
        // 查询上架
        isPutaway = 1;
      } else {
        // 查询下架
        isPutaway = 0;
      }
      getList(
        page.currentPage,
        page.pageSize,
        isPutaway,
        Object.assign(params, this.query)
      ).then(res => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;
        this.loading = false;
        this.selectionClear();
      });
    },

  }
};
</script>

<style>
</style>
