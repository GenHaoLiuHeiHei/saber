<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page="page"
               v-model="form"
               ref="crud"
               @row-update="rowUpdate"
               @on-load="onLoad">
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, update} from "@/api/report/automaticProcessing";
  export default {
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
          index: false,
          viewBtn: false,
          selection: false,
          addBtn: false,
          delBtn: false,
          column: [
             {
                  label: "被举报次数",
                  prop: "number",
                  type: 'number',
                  span:16,
                  labelWidth: 120,
                  rules: [{
                    required: true,
                    message: "请输入被举报次数",
                    trigger: "blur"
                  }]
              },
              {
                  label: "类型",
                  prop: "type",
                  span:16,
                  type: "select",
                  props: {
                    label: "dictValue",
                    value: "dictKey"
                  },
                  dicUrl: "/api/blade-system/dict/dictionary?code=markFailType",
                  valueDefault: 0,
                  labelWidth: 120,
                  rules: [{
                    required: true,
                    message: "请选择处理方式",
                    trigger: "blur"
                  }]
              },
          ]
        },
        data: []
      };
    },
    methods: {
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
