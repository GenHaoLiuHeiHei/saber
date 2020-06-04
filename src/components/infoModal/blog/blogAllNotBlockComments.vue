<template>
  <div>
    <el-form
      :model="formData"
      ref="formData"
      :rules="formDataRules"
      id="formData"
      label-width="100px"
    >
      <el-row>
        <el-col :span="16">
          <el-form-item label="被举报次数" >
            <el-input v-model="formData.informNum" :disabled="true" placeholder="请输入被举报次数"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="内容" v-if="formData.contentType !== 3" >
            <el-input v-model="formData.blogContent" type="textarea" :disabled="true" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="违规">
            <el-checkbox-group v-model="formData.violation">
              <el-checkbox :label="item.dictKey" v-for="(item, index) in violationList" :checked="checked" :disabled="true" @change="checked=!checked" :key="index">{{item.dictValue}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item label="不友善">
            <el-checkbox-group v-model="formData.unfriendly" >
              <el-checkbox :label="item.dictKey" v-for="(item, index) in unfriendlytList" :checked="checked" :disabled="true" @change="checked=!checked" :key="index">{{item.dictValue}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item label="管理员密码" prop="password">
            <el-input v-model="formData.password" placeholder="请输入管理员密码"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="dialog-footer p-t text-center">
        <el-button type="primary" @click="submitForm('formData')">确 定</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import {blog_editstatus} from "@/api/customer/blog";
import {
  getViolation,
  getUnfriendly
} from "@/api/book/library";
  export default {
    props:{
      formDatas: {
        type: Object,
        default: () => {
          return {}
        }
      },
      tofrom: {
        type: String,
        default: 'user'
      },
    },
    data() {
      return {
        checked: false,
        formData: {},
        formDataRules: {
          password: [
            { required: true, message: '请输入管理员密码', trigger: 'blur' },
          ],
        },
        violationList: [],
        unfriendlytList: []
      };
    },
    created () {
      let this_ = this;
      this_.formData = this.formDatas;
      getViolation().then(res => {
        this_.violationList = res.data.data;
      }).then(() => {
         return getUnfriendly()
      }).then(res => {
        this_.unfriendlytList = res.data.data;
        if (this_.formData.reasons.length) {
          JSON.parse(this_.formData.reasons).map(v => {
            v.dictKey = v.dictKey.split(",").map(Number);
            this_.formData[v.code] = v.dictKey;
          })
        }

      });
    },

    methods: {
      // 关闭模态框
      closeDialogAddgsVisible() {
        this.$emit("closeDialogAddgsVisible", true);
      },

      submitForm (formName) {
        let obj = {}, this_ = this;
        obj.blogStatus = 1;
        obj.password = this_.formData.password;
        obj.id = this_.formData.id;
        delete obj.violation
        delete obj.unfriendly
        console.log(obj)
        this_.$refs[formName].validate(valid => {
          if (valid) {
          blog_editstatus(obj).then(res => {
              if (res.data.code === 200) {
                this_.$message({
                  type: "success",
                  message: "操作成功!"
                });
                this_.$message({
                  message: res.data.msg,
                  type: 'success',
                  onClose () {
                    this_.closeDialogAddgsVisible();
                    // this_.onLoad(this_.page);
                  }
                });
              }
            })
          } else {
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

