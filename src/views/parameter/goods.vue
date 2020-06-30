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
            v-if="scope.row.goodsType === 1"
            @click="showModalInfo(scope.row, 'parameterGoodsBox')"
          >设置物品</el-button>
      </template>
       <template slot-scope="scope" slot="silverCount">
         <div v-if="scope.row.goodsType === 2">
            {{scope.row.silverCount || 0}}金币
         </div>
         <div v-else>
           暂无
         </div>
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
  import {getGoodsList, getDetail, add, update, remove} from "@/api/parameter/goods";
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
              label: "道具名称",
              prop: "goodsName",
              rules: [{
                required: true,
                message: "请输入道具名称",
                trigger: "blur"
              }],
              span: 24,
              labelWidth:120
            },
            {
              label: "描述",
              prop: "description",
              rules: [{
                required: true,
                message: "请输入描述",
                trigger: "blur"
              }],
              span: 24,
              labelWidth:120
            },
            {
              label: "道具标签",
              prop: "goodsTag",
              type: 'select',
              dicUrl: "/api/blade-system/dict/dictionary?code=bag_goods",
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
            {
              label: "物资类型",
              prop: "goodsType",
              type: 'select',
              dicUrl: "/api/blade-system/dict/dictionary?code=goods_type",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              rules: [{
                required: true,
                message: "请选择任务类型",
                trigger: "blur"
              }],
              span: 24,
              labelWidth:120
            },
            {
              label: "价值",
              prop: "silverCount",
              type: 'number',
              slot: true,
              rules: [{
                required: true,
                message: "请输入物资对应的价值",
                trigger: "blur"
              }],
              span: 24,
              labelWidth:120
            },
            {
              label: "排序",
              prop: "sortIndex",
              type: 'number',
              rules: [{
                required: true,
                message: "请输入排序",
                trigger: "blur"
              }],
              span: 24,
              labelWidth:120
            },
            {
              label: "计量单位",
              prop: "goodsUnit",
              type: 'number',
              rules: [{
                required: true,
                message: "请输入计量单位，（每一次赠送多少个）",
                trigger: "blur"
              }],
              span: 24,
              labelWidth:120
            },
            {
              label: "赠送获取贡献值",
              prop: "goodsExperience",
              type: 'number',
              rules: [{
                required: true,
                message: "请输入赠送获取贡献值",
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
    watch: {
      'form.goodsType':{
        handler(val){
          var goodsUnit = findObject(this.option.column,'goodsUnit');
          var goodsExperience = findObject(this.option.column,'goodsExperience');
          var silverCount = findObject(this.option.column,'silverCount');
          if(val !== 1){
            goodsUnit.display = true;
            goodsUnit.rules=[{
              required: true,
              message: "请输入计量单位，（每一次赠送多少个）",
              trigger: "blur"
            }]
            goodsExperience.display = true;
            goodsExperience.rules=[{
              required: true,
              message: "请输入赠送获取贡献值",
              trigger: "blur"
            }]
            this.form.goodsUnit = 0;
            this.form.goodsExperience = 0;
            if (val === 2) {
              silverCount.display = true;
              silverCount.rules=[{
                  required: true,
                  message: "请输入物资对应的价值",
                  trigger: "blur"
              }]
            }
          }else{
            silverCount.display = false;
            silverCount.rules = [];
            goodsUnit.display = false;
            goodsUnit.rules = [];
            goodsExperience.display = false;
            goodsExperience.rules = [];
            this.form.goodsUnit = 1;
            this.form.goodsExperience = 0;
          }
        },
        immediate: true
      },
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          // addBtn: this.vaildData(this.permission.goods_add, false),
          // viewBtn: this.vaildData(this.permission.goods_view, false),
          // delBtn: this.vaildData(this.permission.goods_delete, false),
          // editBtn: this.vaildData(this.permission.goods_edit, false)
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
        getGoodsList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
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
