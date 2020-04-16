<template>
  <basic-container>
    <avue-form ref="form" v-model="formData" :option="option" @submit="submitForm('form')"></avue-form>
  </basic-container>
</template>

<script>
  import {save} from "@/api/report/feedback";
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
              label: "回复文案",
              prop: "replyContent",
              type: "textarea",
              rules: [{
                required: true,
                message: "请输入回复文案",
                trigger: "blur"
              }],
              span: 24,
              labelWidth: 120
            },
            {
              label: "管理员密码",
              prop: "password",
              span: 24,
              labelWidth: 120,
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
            this.formData.feedbackId = this.formData.id;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                  save(this.formData).then(() => {
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

