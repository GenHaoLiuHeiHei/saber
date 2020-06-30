<template>
  <basic-container>
    <avue-form ref="form" v-model="formData" :option="option" @submit="submitForm('form')"></avue-form>
  </basic-container>
</template>

<script>
import { baseUrl } from "@/config/env";
import { getLoding, add} from '@/api/report/advertisement'
export default {
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
                message: "请选择广告定时",
                trigger: "blur"
              }
            ],
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
          },
          {
              label: "广告链接",
              prop: "pictureLink",
              mock:{
                type:'url',
                header:false,
              },
              span: 24,
              rules: [
                {
                  required: true,
                  message: "请输入广告链接",
                  trigger: "blur"
                }
              ]
            },
          {
            label: "广告图片",
            prop: "pictureUrl",
            type: "upload",
            listType: "picture-img",
            span: 24,
            propsHttp: {
              res: "data",
              url: "link"
            },
            canvasOption: {
              text: ' ',
              ratio: 1
            },
            tip: "只能上传jpg/png文件，且不超过500kb",
            action: baseUrl + "api/blade-resource/oss/endpoint/put-file",
            rules: [
              {
                required: true,
                message: "请上传广告图片",
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
      },
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      params: {},
      query: {}
    };
  },

  created() {
    let this_ = this;
    getLoding().then(res => {
      // debugger
      this_.formData = res.data.data;
      this_.formData.startTime = [];
      this_.formData.startTime[0] = this_.formData.createTime;
      this_.formData.startTime[1] = this_.formData.endTime;
    });
  },

  methods: {
    submitForm(formName) {
      let this_ = this;
      this.formData.createTime = this.formData.startTime[0];
      this.formData.endTime = this.formData.startTime[1];
      let obj = {};
      obj.pictureType = 1;
      obj.listAdvertisement = [];
      obj.listAdvertisement[0] = this.formData
      this.$refs[formName].validate(valid => {
        if (valid) {
          add(obj).then(res => {
              if (res.data.code === 200) {
                this_.$message({
                  type: "success",
                  message: "操作成功!"
                });
                console.log(res);
              }
            });
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

