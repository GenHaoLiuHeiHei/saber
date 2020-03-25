<template>
  <basic-container>
      <el-tabs v-model="activeName" @tab-click="handleClick" class="p-tb p-lr">
        <el-tab-pane label="Loading广告" name="loading">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form :model="loadingForm" :rules="loadingFormRules" ref="loadingForm" label-width="100px" class="demo-loadingForm">
                  <el-form-item label="广告定时" required>
                    <el-col :span="11" class="p-lr0">
                      <el-form-item prop="startDate">
                        <el-date-picker type="date" placeholder="选择日期" v-model="loadingForm.startDate" style="width: 100%;"></el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col class="line" :span="2">-</el-col>
                    <el-col :span="11">
                      <el-form-item prop="endDate">
                        <el-date-picker type="date" placeholder="选择日期" v-model="loadingForm.endDate" style="width: 100%;"></el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="广告链接" prop="linkName">
                    <el-input v-model="loadingForm.linkName"></el-input>
                  </el-form-item>
                  <el-form-item label="广告图片" prop="imgUrl">
                    <update-img :img-data="loadingForm.imgUrl" @successUpload="successUpload" formType="loadingForm"></update-img>
                  </el-form-item>
                   <el-form-item>
                    <el-button type="primary" @click="loadingSubmit('loadingForm')">应用</el-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
        </el-tab-pane>
        <el-tab-pane label="书库banner" name="banner">
          <el-row :gutter="20">
              <el-col :span="8">
                <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="120px" class="demo-dynamic">
                  <div class="moreRulesIn" v-for="(item, index) in dynamicValidateForm.bannerList" :key="item.key" >
                      <el-form-item  
                      :label="'banner链接' + (index + 1)" 
                      :prop="'bannerList.' + index +'.linkUrl'"  
                      :rules="[{required: true, message: '请输入banner链接'}]"
                      >
                          <el-input v-model="item.linkUrl" placeholder="请输入banner链接"  class="el-select_box"></el-input>
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
                        :formIndex="index"></update-img>
                      </el-form-item>
                      <i class="el-icon-error" @click.prevent="deleteRules(item, index)" v-show="dynamicValidateForm.bannerList.length > 1"></i>
                  </div>
                  <el-form-item>
                    <el-button @click="addRules">添加banner</el-button>
                    <el-button type="primary" @click="submitForm('dynamicValidateForm')">应用</el-button>
                  </el-form-item>
                </el-form>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
  </basic-container>
</template>

<script>
  // import {mapGetters} from "vuex";
  import updateImg from '@/components/update-img';
  import {bannerMixin} from './mixin/bannerMixin';
  export default {
    name:'setBanner',
    components:{
      updateImg
    },
    mixins:[bannerMixin],
    data() {
      return {
       activeName: 'loading',
       loadingForm: {
         linkName: 'www.baidu.com',
         startDate: '',
         endDate: '',
         imgUrl: ''
       },
      loadingFormRules: {
          linkName: [
            { required: true, message: '请输入广告链接', trigger: 'blur' },
          ],
          startDate: [
            { type: 'date', required: true, message: '请选择开始日期', trigger: 'change' }
          ],
          endDate: [
            { type: 'date', required: true, message: '请选择结束日期', trigger: 'change' }
          ],
          imgUrl: [
            { required: true, message: '请上传图片'},
          ]
        }
      };
    },
    methods: {
      // 接收上传的图片
      successUpload (fileList, formType, formIndex) {
        console.log(formIndex)
        if (formType === "loadingForm") {
          this.loadingForm.imgUrl = fileList[0].url;
        } else if (formType === "dynamicValidateForm") {
          this.$set( this.dynamicValidateForm.bannerList[formIndex], "imgUrl", 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100')
          console.log(fileList, formType);
        }
      },
      // 删除图片
      removeUpload (fileList, formType, formIndex) {
        if (formType === "loadingForm") {
          this.loadingForm.imgUrl = '';
        } else if (formType === "dynamicValidateForm") {
          this.$set( this.dynamicValidateForm.bannerList[formIndex], "imgUrl", '')
        }
      },
      handleClick () {
        console.log(0)
      },
      loadingSubmit (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  };
</script>

<style scoped lang="scss">
.moreRulesIn{
  position: relative;
  .el-icon-error{
    position: absolute;
    right: -70px;
    top: 0;
  }
}
  
</style>
