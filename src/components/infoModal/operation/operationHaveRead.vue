<template>
  <div>
    <avue-form ref="form" v-model="formData" :option="option" @submit="submitForm('form')"></avue-form>
  </div>
</template>

<script>
  import {update} from "@/api/report/feedback";
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
              label: "反馈人昵称",
              prop: "feedbackUserName",
              disabled: true,
              span: 24,
              labelWidth: 120
            },
            {
              label: "反馈人ID",
              prop: "feedbackUserId",
              disabled: true,
              span: 24,
              labelWidth: 120
            },
            {
              label: "反馈时间",
              prop: "createTime",
              disabled: true,
              span: 24,
              labelWidth: 120
            },
            {
              label: "内容",
              prop: "feedbackContent",
              disabled: true,
              span: 24,
              labelWidth: 120
            },
            {
              label: "管理员密码",
              prop: "password",
              span: 24,
              labelWidth: 120,
              hide: true,
              rules: [{
                required: true,
                message: "请输入创建时间",
                trigger: "blur"
              }]
            }
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
            console.log(this.formData)
            this.formData.status = 1;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                  update(this.formData).then(() => {
                    this.$message({
                      type: "success",
                      message: "操作成功!"
                    });
                    this.closeDialogAddgsVisible();
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

