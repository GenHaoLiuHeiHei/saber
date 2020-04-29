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
      @row-del="rowDel"
      @row-save="rowSave"
      @row-update="rowUpdate"
      @search-change="searchChange"
      @search-reset="searchReset"
      @selection-change="selectionChange"
      @current-change="currentChange"
      @size-change="sizeChange"
      @on-load="onLoad"
    >
     <template slot="blogContent" slot-scope="scope">
        <!-- 内容 -->
        <avue-text-ellipsis :text="scope.row.blogContent" use-tooltip placement="top" :height="30">
          <small slot="more">...</small>
        </avue-text-ellipsis>
      </template>
      <template slot="blogPraiseSum" slot-scope="scope">
        <!-- 赞 -->
        <div
          class="isColorShow"
          @click="showModalInfo(scope.row, 'blogLike')"
        >{{scope.row.blogPraiseSum}}</div>
      </template>
      <template slot="blogCommentSum" slot-scope="scope">
        <!-- 评论 -->
        <div
          class="isColorShow"
          @click="showModalInfo(scope.row, 'blogComment', true)"
        >{{scope.row.blogCommentSum}}</div>
      </template>
      <template slot="informNum" slot-scope="scope">
        <!-- 举报 -->
        <div
          class="isColorShow color-red"
          @click="showModalInfo(scope.row, 'blogReport')"
        >{{scope.row.informNum}}</div>
      </template>
       <template slot="commentViolationSum" slot-scope="scope">
        <!-- 违规 -->
        <div class="isColorShow" style="color:red !important" @click="showModalInfo(scope.row, 'blogViolation', true)">{{scope.row.commentViolationSum}}</div>
      </template>
      <template slot="pictrueList" slot-scope="scope">
        <!-- 图片 -->
        <div
          class="isColorShow"
          @click="showModalInfo(scope.row, 'blogImgList')"
          v-if="scope.row.pictrueList.length"
        >{{scope.row.pictrueList.length}}</div>
         <div
          v-else
        >暂无</div>
      </template>
      <template slot="blogVideoUrl" slot-scope="scope">
        <!-- 视频 -->
        <div
          class="isColorShow"
          @click="showModalInfo(scope.row, 'blogVideo')"
          v-if="scope.row.blogVideoUrl.length"
        >1</div>
         <div
          v-else
        >暂无</div>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button
          type="button"
          size="small"
          class="el-button--text color-red"
          icon="el-icon-edit"
          @click="showModalInfo(scope.row, 'blogBlockComments')"
          v-if="tabsType ==='shelves'"
        >判定违规</el-button>
        <el-button
          type="button"
          size="small"
          class="el-button--text"
          icon="el-icon-edit"
          @click="showModalInfo(scope.row, 'blogNotBlockComments')"
          v-else
        >不违规</el-button>
      </template>
    </avue-crud>
    <el-dialog :title="title" :visible.sync="isShowDialog" :modal="false" :close-on-click-modal="false" @close="closeDialogAddgsVisible">
        <infoModal 
        :modalInfoType="modalInfoType" 
        v-if="isShowDialog" 
        :formDatas="formDatas" 
        tofrom="blog" 
        :optionTabs="optionTabs"
        :isOptionTab="isOptionTab"
        :isShowSeach="isShowSeach"
        @closeDialogAddgsVisible="closeDialogAddgsVisible">
        </infoModal>
    </el-dialog>
  </basic-container>
</template>
<script>
import { getList, add, update, remove } from "@/api/blog/blog";
import { mapGetters } from "vuex";
import { modalMixin } from "@/mixins/modalMixin";
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
        editBtn: false,
        addBtn: false,
        delBtn: false,
        align: "center",
        column: [
          {
            label: "博主ID",
            prop: "customerNumber",
          },
          {
            label: "博主名称",
            search: true,
            prop: "customerNickName",
          },
          {
            label: "博文内容",
            prop: "blogContent",
            slot: true
          },
          {
            label: "展示次数",
            prop: "blogBrowse",
          },
          {
            label: "分享次数",
            prop: "blogForwardSum",
            addDisplay: false,
            editDisplay: false
          },
          {
            label: "评论数量",
            prop: "blogCommentSum",
            addDisplay: false,
            editDisplay: false,
            slot: true
          },
          {
            label: "点赞数量",
            prop: "blogPraiseSum",
            slot: true
          },
           {
              label: "评论违规列表",
              prop: "commentViolationSum",
              slot: true,
          },
          {
              label: "举报次数",
              prop: "informNum",
              slot: true,
          },
          {
            label: "收益",
            prop: "chargePrice",
          },
          {
            label: "图片",
            prop: "pictrueList",
            slot: true
          },
          {
            label: "视频",
            prop: "blogVideoUrl",
            slot: true
          },
         
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
        editBtn: true
      };
    }
  },
  created () {
    console.log(this.$refs.crud);
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
    // handleEdit (row, index) {
    //     this.$refs.crud.rowEdit(row, index);
    // },  
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
      let blogStatus = null;
      console.log(this.tabsType);
      // （博文状态 1:正常 2:违规）
      if (this.tabsType === "shelves") {
        // 查询上架
        blogStatus = 1;
      } else {
        // 查询违规
        blogStatus = 2;
      }
      getList(
        page.currentPage,
        page.pageSize,
        blogStatus,
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
