<template>
  <basic-container>
    <avue-form ref="form" v-model="formData" :option="option" @submit="submitForm('form')"></avue-form>
  </basic-container>
</template>

<script>
  import {remove_customer} from "@/api/customer/customer";
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
              label: "用户昵称",
              prop: "customerName",
              labelWidth: 120,
              disabled: true
            },
            {
              label: "用户ID",
              labelWidth: 120,
              prop: "customerNumber",
              disabled: true
            },
            {
              label: "停封时间(小时)",
              labelWidth: 120,
              prop: "time",
              type: 'number',
              rules: [
              {
                required: true,
                message: "请输入停封时间",
                trigger: "blur"
              }
            ]
            },
            {
              label: "停封原因",
              prop: "blockReason",
              type: 'textarea',
              labelWidth: 120,
              span: 24,
              rules: [
              {
                required: true,
                message: "请输入解封原因",
                trigger: "blur"
              }
            ]
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
              labelWidth: 120
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
                  remove_customer(this.formData).then(() => {
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

