<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page="page"
               :permission="permissionList"
               :before-open="beforeOpen"
               v-model="form"
               ref="crud"
               @row-update="rowUpdate"
               @row-save="rowSave"
               @row-del="rowDel"
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
            @click="showModalInfo(scope.row, 'parameterHomegoodsbox')"
          >配置</el-button>
      </template>
      <template slot="menuLeft">
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   @click="handleDelete">删 除
        </el-button>
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
  import {getList, getDetail, add, update, remove} from "@/api/parameter/bloggerhomegrade";
  import {mapGetters} from "vuex";
  import { findObject } from '@/util/util';
  import {modalMixin} from "@/mixins/modalMixin";
  import infoModal from "@/components/infoModal/index";
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
          align:'center',
          border: true,
          index: false,
          viewBtn: false,
          selection: true,
          column: [
            {
              label: "建筑等级",
              prop: "grade",
              type: 'number',
              rules: [{
                required: true,
                message: "请输入建筑等级(1,2,3,4,5...)",
                trigger: "blur"
              }],
              span: 24,
              labelWidth:120
            },
            {
              label: "状态是否开启",
              prop: "status",
              type: 'select',
              dicUrl: "/api/blade-system/dict/dictionary?code=yes_no",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              rules: [{
                required: true,
                message: "请选择道具标签",
                trigger: "blur"
              }],
              span: 24,
              labelWidth:120
            },
            // {
            //   label: "管理员密码",
            //   prop: "password",
            //   hide: true,
            //   rules: [{
            //     required: true,
            //     message: "请输入管理员密码",
            //     trigger: "blur"
            //   }],
            //   span: 24,
            //   labelWidth:120
            // },
          ]
        },
        data: []
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
        //   addBtn: this.vaildData(this.permission.bloggerhomegrade_add, false),
        //   viewBtn: this.vaildData(this.permission.bloggerhomegrade_view, false),
        //   delBtn: this.vaildData(this.permission.bloggerhomegrade_delete, false),
        //   editBtn: this.vaildData(this.permission.bloggerhomegrade_edit, false)
          addBtn: true,
          viewBtn: true,
          delBtn: true,
          editBtn: true
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
      rowSave(row, loading, done) {
        add(row).then(() => {
          loading();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        }, error => {
          done();
          console.log(error);
        });
      },
      rowUpdate(row, index, loading, done) {
        update(row).then(() => {
          loading();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        }, error => {
          done();
          console.log(error);
        });
      },
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
      handleDelete() {
        if (this.selectionList.length === 0) {
          this.$message.warning("请选择至少一条数据");
          return;
        }
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(this.ids);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.$refs.crud.toggleSelection();
          });
      },
      beforeOpen(done, type) {
        if (["edit", "view"].includes(type)) {
          getDetail(this.form.id).then(res => {
            this.form = res.data.data;
          });
        }
        done();
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
