<template>
  <basic-container>
    <el-form
      :model="dynamicValidateForm"
      ref="dynamicValidateForm"
      label-width="120px"
      class="demo-dynamic"
    >
      <div
        class="moreRulesIn"
        v-for="(item, index) in dynamicValidateForm.bannerList"
        :key="item.key"
      >
        <el-form-item
          :label="'banner链接' + (index + 1)"
          :prop="'bannerList.' + index +'.linkUrl'"
          :rules="[{required: true, message: '请输入banner链接'}]"
        >
          <el-input v-model="item.linkUrl" placeholder="请输入banner链接" class="el-select_box"></el-input>
        </el-form-item>
        <el-form-item
          :label="'banner图片' + (index + 1)"
          :prop="'bannerList.' + index + '.imgUrl'"
          :rules="[{required: true, message: '请上传banner图片'}]"
        >
          <update-img
            :img-data="item.imgUrl"
            @successUpload="successUpload"
            @removeUpload="removeUpload"
            formType="dynamicValidateForm"
            :formIndex="index"
          ></update-img>
        </el-form-item>
        <i
          class="el-icon-error"
          @click.prevent="deleteRules(item, index)"
          v-show="dynamicValidateForm.bannerList.length > 1"
        ></i>
      </div>
      <el-form-item>
        <el-button @click="addRules">添加banner</el-button>
        <el-button type="primary" @click="submitForm('dynamicValidateForm')">应用</el-button>
      </el-form-item>
    </el-form>
  </basic-container>
</template>

<script>
// import {getList, getDetail, add, update, remove} from "@/api/book/book";
import updateImg from '@/components/update-img';
export default {
  data() {
    return {
      dynamicValidateForm: {
        bannerList: [
          {
            linkUrl: "",
            imgUrl: ""
          }
        ]
      }
    };
  },
  components:{
    updateImg
  },
  methods: {
    // 接收上传的图片
    successUpload (fileList, formType, formIndex) {
      console.log(formIndex)
      this.$set( this.dynamicValidateForm.bannerList[formIndex], "imgUrl", 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100')
      console.log(fileList, formType);
    },
    // 删除图片
    removeUpload (fileList, formType, formIndex) {
      this.$set( this.dynamicValidateForm.bannerList[formIndex], "imgUrl", '')
    },

    // 提交表单 
    submitForm(formName) {
      console.log(this.dynamicValidateForm);
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 点击删除
    deleteRules(item, index) {
      this.index = this.dynamicValidateForm.bannerList.indexOf(item);
      if (index !== -1) {
        this.dynamicValidateForm.bannerList.splice(index, 1);
      }
    },
    // 点击添加
    addRules() {
      this.dynamicValidateForm.bannerList.push({
        linkUrl: "",
        imgUrl: ""
      });
    }
  }
};
</script>
<style scoped lang="scss">
.demo-dynamic{
  padding-right: 40px;
}
.moreRulesIn {
  position: relative;
  .el-icon-error {
    position: absolute;
    right: -50px;
    top: 0;
  }
}
</style>

