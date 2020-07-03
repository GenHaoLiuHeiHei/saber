<template>
  <div>
    <avue-form ref="form" v-model="formData" :option="option" @submit="submitForm('form')"></avue-form>
  </div>
</template>

<script>
import { set_blogger } from "@/api/customer/customer";
import { getList } from "@/api/customer/customerArea";
import { findObject } from "@/util/util";
export default {
  props: {
    formDatas: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value <= 0) {
        callback(new Error("请输入大于0的数字"));
      } else {
        callback();
      }
    };
    return {
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      areaType: [],
      option: {
        emptyBtn: false,
        align: "center",
        column: [
          {
            span: 24,
            label: "用户昵称",
            labelWidth: 120,
            prop: "customerNickname",
            disabled: true
          },
          {
            span: 24,
            label: "用户ID",
            labelWidth: 120,
            prop: "customerNumber",
            disabled: true
          },
          {
            label: "坐标编号",
            prop: "siteNum",
            type: "number",
            rules: [
              {
                required: true,
                message: "请输入坐标编号",
                trigger: "blur"
              },
              {
                required: true,
                validator: validatePass,
                trigger: "blur"
              }
            ],
            labelWidth: 120,
            span: 24
          },
          {
            label: "区域编号",
            prop: "areaNum",
            type: "select",
            dicData: [],
            rules: [
              {
                required: true,
                message: "请选择区域编号",
                trigger: "blur"
              }
            ],
            labelWidth: 120,
            span: 24
          },
          {
            label: "管理员密码",
            prop: "password",
            rules: [
              {
                required: true,
                message: "请输入管理员密码",
                trigger: "blur"
              }
            ],
            labelWidth: 120,
            span: 24
          }
        ]
      },
      formData: {},
      formDataRules: {
        password: [
          { required: true, message: "请输入管理员密码", trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    areaType: {
      handler(val) {
        var areaNum = findObject(this.option.column, "areaNum");
        areaNum.dicData = val;
      },
      immediate: true
    }
  },
  created() {
    this.formData = this.formDatas;
    getList(this.page.currentPage, 300).then(res => {
      const data = res.data.data.records;
      this.areaType = data.map(v => {
        let res = {};
        res.label = v.areaName;
        res.value = v.areaNum;
        return res;
      });
    });
  },

  methods: {
    // 关闭模态框
    closeDialog() {
      this.$emit("closeDialogAddgsVisible", true);
    },

    submitForm(formName) {
      console.log(this.formData);
      this.$refs[formName].validate(valid => {
        if (valid) {
          set_blogger(this.formData).then(
            () => {
              this.$message({
                type: "success",
                message: "操作成功!"
              });
              this.closeDialog();
              // this.$parent.onLoad(this.$parent.page);
            },
            error => {
              console.log(error);
            }
          );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>
<style scoped lang="scss">
.moreRulesIn {
  position: relative;
  .el-icon-error {
    position: absolute;
    right: -50px;
    top: 0;
  }
}
</style>

