<template>
  <basic-container>
    <avue-form ref="form" v-model="formData" :option="option" @submit="submitForm('form')"></avue-form>
  </basic-container>
</template>

<script>
  import {handle_report} from "@/api/report/report";
  export default {
    props:{
      formDatas: {
        type: Object,
        default: () => {
          return {}
        }
      },
    },
    data() {
      return {
         option: {
          emptyBtn: false,
          align:'center',
          column: [
            {
              label: "举报人昵称",
              span: 24,
              labelWidth: 100,
              prop: "customerNickName",
              disabled: true
            },
            {
              label: "举报人ID",
              prop: "customerNumber",
              span: 24,
              labelWidth: 100,
              disabled: true
            },
            {
              label: "举报时间",
              prop: "createTime",
              span: 24,
              labelWidth: 100,
              disabled: true
            },
            {
              label: "被举报人昵称",
              prop: "informeeNickName",
              span: 24,
              labelWidth: 100,
              disabled: true
            },
            {
              label: "被举报人ID",
              prop: "informeeNumber",
              span: 24,
              labelWidth: 100,
              disabled: true
            },
            {
              label: "内容",
              prop: "content",
              span: 24,
              labelWidth: 100,
              disabled: true
            },
            {
              label: "管理员密码",
              prop: "password",
              rules: [{
                required: true,
                message: "请输入管理员密码",
                trigger: "blur"
              }],
              span: 24,
              labelWidth: 100
            },
          ]
        },
        formData: {},
        formDataRules: {
          password: [
            { required: true, message: '请输入管理员密码', trigger: 'blur' },
          ],
        }
      };
    },

    created () {
      this.formData = this.formDatas;
    },

    methods: {
     
      // 关闭模态框
      closeDialogAddgsVisible () {
        this.$emit('closeDialogAddgsVisible', true)
      },

      submitForm(formName) {
            this.formData.status = 1;
            console.log(this.formData)
            this.$refs[formName].validate((valid) => {
                if (valid) {
                  handle_report(this.formData).then(() => {
                    this.$message({
                      type: "success",
                      message: "操作成功!"
                    });
                    this.closeDialogAddgsVisible();
                    // this.$parent.onLoad(this.$parent.page);
                  }, error => {
                    console.log(error);
                  });
                } else {
                console.log('error submit!!');
                return false;
                }
            });
        },
    }

  };
</script>
<style scoped lang="scss">
.moreRulesIn{
  position: relative;
  .el-icon-error{
    position: absolute;
    right: -50px;
    top: 0;
  }
}
</style>

