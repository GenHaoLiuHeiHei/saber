<template>
  <div>
    <avue-form ref="form" v-model="formData" :option="option" @submit="submitForm('form')"></avue-form>
  </div>
</template>

<script>
  import {editPutaway} from "@/api/book/library";
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
              span: 24,
              labelWidth: 100,
              prop: "bookName",
              disabled: true
            },
            {
              label: "书籍ID",
              prop: "bookNoId",
              span: 24,
              labelWidth: 100,
              disabled: true
            },
            {
              label: "章节",
              prop: "bookChapterSum",
              span: 24,
              labelWidth: 100,
              disabled: true
            },
            {
              label: "是否完结",
              type: "select",
              dicUrl: "/api/blade-system/dict/dictionary?code=bookIsOver",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              prop: "isOver",span: 24,
              labelWidth: 100,
              disabled: true
            },
            {
              label: "收费模式",
              prop: "bookChapterSum",
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
            console.log(this.formData)
            this.$refs[formName].validate((valid) => {
                if (valid) {
                  editPutaway(this.formData).then(() => {
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

