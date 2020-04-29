<template>
  <div>
    <avue-form ref="form" v-model="formData" :option="option" @submit="submitForm('form')"></avue-form>
  </div>
</template>

<script>
  import {save_notice} from "@/api/customer/customer";
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
                label: "发送时间",
                prop: "noticeTime",
                type: "datetime",
                labelWidth: 120,
                span: 24,
                format:'yyyy-MM-dd hh:mm:ss',
                valueFormat:'yyyy-MM-dd hh:mm:ss',
                mock:{
                  type:'datetime',
                  format:'yyyy-MM-dd hh:mm:ss',
                  now:true,
                },
                rules: [{
                  required: true,
                  message: "请选择发送时间",
                  trigger: "blur"
                }],
            },
            {
              label: "发送内容",
              prop: "noticeContent",
              type: "textarea",
              rules: [{
                required: true,
                message: "请输入发送内容",
                trigger: "blur"
              }],
              labelWidth: 120,
              span: 24,
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
              labelWidth: 120,
            },
          ]
        },
        formData: {},
        formDataRules: {
          deblockingReason: [
            { required: true, message: '请输入解封原因', trigger: 'blur' },
          ],
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
                  save_notice(this.formData).then(() => {
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

