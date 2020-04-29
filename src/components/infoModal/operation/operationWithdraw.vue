<template>
  <div>
    <avue-form v-if="!formData.isDetails" ref="form" v-model="formData" :option="option" @submit="submitForm('form')"></avue-form>
    <avue-detail v-else :option="option" v-model="formData"></avue-detail>
  </div>
</template>

<script>
  import {
    update,
  } from "@/api/customer/extractorder";
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
          column: [
          {
            label: "提现单号",
            prop: "extractNoId",
            span: 12,
            labelWidth:120,
            disabled: true,
          },
          {
            label: "用户昵称",
            prop: "customerName",
            span: 12,
            disabled: true,
            labelWidth:120
          },
          {
            label: "用户ID",
            prop: "customerId",
            span: 12,
            disabled: true,
            labelWidth:120
          },
           {
            label: "提现金币",
            prop: "extractGold",
            span: 12,
            disabled: true,
            labelWidth:120
          },
          {
            label: "金额",
            prop: "extractMoney",
            span: 12,
            disabled: true,
            labelWidth:120
          },
          // {
          //   label: "提现状态（1，审核中2，提现成功3，失败）",
          //   prop: "extractStatus",
          //   rules: [
          //     {
          //       required: true,
          //       message: "请输入提现状态（1，审核中2，提现成功3，失败）",
          //       trigger: "blur"
          //     }
          //   ]
          // },
          // {
          //   label: "提现渠道",
          //   prop: "extractWay",
          //   rules: [
          //     {
          //       required: true,
          //       message: "请输入提现渠道",
          //       trigger: "blur"
          //     }
          //   ]
          // },
          {
            label: "申请日期",
            prop: "createTime",
            span: 12,
            disabled: true,
            labelWidth:120
          },
          {
            label: "提现日期",
            prop: "updateTime",
            span: 12,
            disabled: true,
            labelWidth:120
          },
          {
            label: "操作人员",
            prop: "updateUser",
            span: 12,
            disabled: true,
            labelWidth:120
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
            // disabled: this.formDatas.isDetails ? true : false,
            labelWidth:120
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
      console.log(this.formData);
    },

    methods: {
     
      // 关闭模态框
      closeDialog () {
        this.$emit('closeDialogAddgsVisible', true)
      },

      submitForm(formName) {
        // console.log(this.formData)
        if (this.formData.isDetails) return
        this.$refs[formName].validate((valid) => {
            if (valid) {
              update(this.formData).then(() => {
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

