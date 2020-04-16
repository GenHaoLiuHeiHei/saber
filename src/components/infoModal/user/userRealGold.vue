<template>
  <basic-container>
    <avue-form ref="form" v-model="formData" :option="option" @submit="submitForm('form')"></avue-form>
  </basic-container>
</template>

<script>
  import {userUpdate} from "@/api/customer/customer";
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
              label: "金币剩余(修改)",
              span: 24,
              labelWidth: 120,
              prop: "realGold",
              rules: [
              {
                required: true,
                message: "请输入修改后的金额",
                trigger: "blur"
              }
            ]
            },
            {
              label: "管理员密码",
              prop: "passwords",
              rules: [{
                required: true,
                message: "请输入管理员密码",
                trigger: "blur"
              }],
              span: 24,
              labelWidth: 120,
            },
          ]
        },
        formData: {},
        formDataRules: {
          passwords: [
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
                  userUpdate(this.formData).then(() => {
                    this.$message({
                      type: "success",
                      message: "操作成功!"
                    });
                    this.closeDialog();
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

