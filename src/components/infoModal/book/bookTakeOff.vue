<template>
  <div>
    <avue-form ref="form" v-model="formData" :option="option" @submit="submitForm('form')"></avue-form>
  </div>
</template>

<script>
  import {clickSoldout} from "@/api/book/library";
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
              label: "书籍名称",
              prop: "bookName",
              disabled: true,
              span: 24,
              labelWidth: 100,
            },
            {
              label: "书籍ID",
              prop: "bookNoId",
              disabled: true,
              span: 24,
              labelWidth: 100,
            },
            {
              label: "下架原因",
              prop: "soldOutReason",
              type: "textarea",
              rules: [{
                required: true,
                message: "请输入下架原因",
                trigger: "blur"
              }],
              span: 24,
              labelWidth: 100,
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
            console.log(this.formData)
            this.$refs[formName].validate((valid) => {
                if (valid) {
                  clickSoldout(this.formData).then(() => {
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

