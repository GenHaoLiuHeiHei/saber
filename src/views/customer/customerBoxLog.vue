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
          <template slot="comment" slot-scope="scope">
          <!-- 内容 -->
          <div v-if="scope.row.comment && scope.row.comment.length > 0">{{scope.row.comment}}</div>
          <div v-else>暂无内容</div>
        </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/customer/customerboxlog";
  import {mapGetters} from "vuex";
  import {findObject} from '@/util/util';
  import {getGoodsList} from "@/api/parameter/goods";
  export default {
    data() {
      return {
        goodsType: [],
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
          selection: false,
          menu: false,
          column: [
            {
              label: "任务类型",
              prop: "modeType",
              type: 'select',
              dicUrl: "/api/blade-system/dict/dictionary?code=customer_box_mode",
              props: {
                label: "dictValue",
                value: "dictKey"
              }
            },
            {
              label: "用户昵称",
              prop: "customerName",
              search: true,
            },
            // {
            //   label: "用户ID",
            //   prop: "customerId",
            // },
            // {
            //   label: "博主用户ID",
            //   prop: "bloggerId"
            // },
            {
              label: "道具名称",
              prop: "goodsId",
              dicData: []
            },
            {
              label: "获取时间",
              prop: "createTime"
            },
            {
              label: "关联对象内容(组装日志信息)",
              prop: "comment"
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
          addBtn: this.vaildData(this.permission.customerboxlog_add, false),
          viewBtn: this.vaildData(this.permission.customerboxlog_view, false),
          delBtn: this.vaildData(this.permission.customerboxlog_delete, false),
          editBtn: this.vaildData(this.permission.customerboxlog_edit, false)
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
    watch: {
       'goodsType':{
          handler(val){
            var goodsId = findObject(this.option.column,'goodsId');
            goodsId.dicData = val;
          },
          immediate: true
      },
    },
    created () {
      getGoodsList(this.page.currentPage, 100).then(res => {
          const data = res.data.data.records;
          this.goodsType = data.map(v => {
            let res = {};
            res.label = v.goodsName;
            res.value = v.id;
            return res
          });
      });
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
