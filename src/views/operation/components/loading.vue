<template>
  <basic-container>
    <avue-form ref="form" v-model="formData" :option="option" @submit="submitForm"></avue-form>
  </basic-container>
</template>

<script>
import { baseUrl } from "@/config/env";
export default {
  props: {
    bookFormDatas: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      option: {
        emptyBtn: false,
        align: "center",
        column: [
          {
            label: "广告定时",
            prop: "startTime",
            type: "datetimerange",
            span: 24,
            startPlaceholder: '时间日期开始范围自定义',
            endPlaceholder: '时间日期结束范围自定义',
            rules: [
              {
                required: true,
                message: "请选择",
                trigger: "blur"
              }
            ]
          },
          {
            label: "广告链接",
            prop: "linkName",
            span: 24,
            rules: [
              {
                required: true,
                message: "请输入",
                trigger: "blur"
              }
            ]
          },
          {
            label: "广告图片",
            prop: "advertisingDate",
            type: "upload",
            listType: "picture-img",
            span: 24,
            propsHttp: {
              res: "data",
              url: "link"
            },
            canvasOption: {
              text: "blade",
              ratio: 0.1
            },
            tip: "只能上传jpg/png文件，且不超过500kb",
            action: baseUrl + "api/blade-resource/oss/endpoint/put-file",
            rules: [
              {
                required: true,
                message: "请上传封面图片",
                trigger: "blur"
              }
            ]
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

  created() {
    this.formData = this.bookFormDatas;
  },

  methods: {
    submitForm(formName) {
      console.log(this.formData);
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
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

