<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :permission="permissionList"
               v-model="form"
               ref="crud"
               @row-update="rowUpdate"
               @on-load="onLoad">
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, update} from "@/api/customer/sensitive";
  import {mapGetters} from "vuex";

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
          selection: false,
          delBtn:false,
          addBtn: false,
          viewBtn: false,
          column: [
            {
              label: "敏感词",
              prop: "content",
              type: 'textarea',
              rules: [{
                required: true,
                message: "请输入敏感词",
                trigger: "blur"
              }],
              span: 24,
              labelWidth: 100
            },
            {
              label: "管理员密码",
              prop: "password",
              hide: true,
              rules: [{
                required: true,
                message: "请输入敏感词",
                trigger: "blur"
              }],
              span: 24,
              labelWidth: 100
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
          // editBtn: this.vaildData(this.permission.sensitive_edit, false),
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
      rowUpdate(row, index, loading, done) {
        row.content = row.content.replace(/，/ig,',');
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
      // beforeOpen(done, type) {
      //   if (["edit", "view"].includes(type)) {
      //     getDetail(this.form.id).then(res => {
      //       this.form = res.data.data;
      //     });
      //   }
      //   done();
      // },
      onLoad(page, params = {}) {
        this.loading = true;
        getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
        });
      }
    }
  };
</script>

<style>
</style>
