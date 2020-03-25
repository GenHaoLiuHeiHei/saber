<template>
  <basic-container>
    <avue-form ref="form" v-model="formData" :option="option" @submit="submitForm('form')"></avue-form>
  </basic-container>
</template>

<script>
  import {set_blogger} from "@/api/customer/customer";
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
              label: "博主昵称",
              labelWidth: 120,
              prop: "customerNickname",
              disabled: true
            },
            {
              label: "用户ID",
              labelWidth: 120,
              prop: "customerNumber",
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
              labelWidth: 120,
              span: 24,
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
      closeDialog () {
        this.$emit('closeDialogAddgsVisible', true)
      },

      submitForm(formName) {
            console.log(this.formData)
            this.$refs[formName].validate((valid) => {
                if (valid) {
                  set_blogger(this.formData).then(() => {
                    this.$message({
                      type: "success",
                      message: "操作成功!"
                    });
                    this.closeDialog();
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

