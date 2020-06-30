<template>
  <div id="chapterList">
    <avue-crud 
        ref="crud"
        :option="option"
        :table-loading="loading"
        :data="data"
        :page="page"
        v-model="form"
        @row-update="rowUpdate"
        @row-save="rowSave"
        @row-del="rowDel"
        @size-change="sizeChange"
        @current-change="currentChange"
        @selection-change="selectionChange"
        @on-load="onLoad">
        <template slot="menuLeft">
          <el-button type="danger"
                    size="small"
                    icon="el-icon-delete"
                    plain
                    @click="handleDelete">删 除
          </el-button>
        </template>
    </avue-crud>
  </div>
</template>

<script>
  import { getList, getDetail, add, update, remove} from "@/api/parameter/goodsbox";
  import { mapGetters } from "vuex";
  import { getGoodsList } from "@/api/parameter/goods";
  import { findObject } from '@/util/util'
  export default {
    name: 'operationGoodsBox',
    props: {
      formDatas: {
        type: Object,
        required: true
      }
    },
    data() {
       var validatePass = (rule, value, callback) => {
        if (value < 0 || value > 100) {
          callback(new Error('请输入0-100的数字'));
        } else {
          callback();
        }
      };
      return {
        goodsType: {
          chest: [],
          supplies: []
        },
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
          // dialogClickModal: false,
          column: [
            {
              label: "宝箱里面的物品",
              prop: "goodsChildId",
              type: 'select',
              dicData: [],
              rules: [{
                required: true,
                message: "请选择宝箱里面的物品",
                trigger: "blur"
              }],
              span: 24,
              labelWidth:200
            },
            {
              label: "物品数量随机数最小",
              type: 'number',
              prop: "childMinNum",
              rules: [{
                required: true,
                message: "请输入物品数量随机数最小",
                trigger: "blur"
              }],
              span: 24,
              labelWidth:200
            },
            {
              label: "物品数量随机数最大",
              type: 'number',
              prop: "childMaxNum",
              rules: [{
                required: true,
                message: "请输入物品数量随机数最大",
                trigger: "blur"
              }],
              span: 24,
              labelWidth:200
            },
            {
              label: "物品获得的概率",
              type: 'number',
              prop: "odds",
              rules: [
                {
                  required: true,
                  message: "请输入物品获得的概率",
                  trigger: "blur"
                },
                { 
                  required: true,
                  validator: validatePass, 
                  trigger: 'blur' 
                }
              ],
              span: 24,
              labelWidth:200
            },
          ]
        },
        data: []
      };
    },
    computed: {
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.id);
        });
        return ids.join(",");
      }
    },
    watch: {
        'goodsType.supplies':{
          handler(val){
            let goodsId = findObject(this.option.column,'goodsChildId');
            goodsId.dicData = val;
          },
          immediate: true
        },
    },
    created () {
      let this_ = this;
      getGoodsList(this.page.currentPage, 100).then(res => {
          const data = res.data.data.records;
          data.map(v => {
            let res = {};
            res.label = v.goodsName;
            res.value = v.id;
            if (v.goodsType === 1) {
              this_.goodsType.chest.push(res)
            } else {
              this_.goodsType.supplies.push(res)
            }
          });
      });
    },
    methods: {
      rowSave(row, loading, done) {
        row.goodsId = this.formDatas.id;
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
        // row.id = this.formDatas.id;
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
      currentChange (currentPage){
        this.page.currentPage = currentPage;
      },
      selectionChange (list) {
        this.selectionList = list;
      },
      handleDelete () {
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
            return chapTerRemove(this.ids);
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
      sizeChange(pageSize){
        this.page.pageSize = pageSize;
      },
      onLoad(page, params = {}) {
        params.goodsId = this.formDatas.id
        this.loading = true;
        getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
        });
      },
    }
  };
</script>
