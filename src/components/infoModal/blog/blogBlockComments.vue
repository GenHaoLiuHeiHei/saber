<template>
  <basic-container>
    <el-form
      :model="commentFormData"
      ref="commentFormData"
      :rules="formDataRules"
      id="commentFormData"
      label-width="100px"
    >
      <el-row>
        <el-col :span="16">
          <el-form-item label="违规">
            <el-checkbox-group v-model="commentFormData.violation" >
              <el-checkbox :label="item.dictKey" v-for="(item, index) in violationList" :checked="checked" @change="checked=!checked" :key="index">{{item.dictValue}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item label="不友善">
            <el-checkbox-group v-model="commentFormData.unfriendly" >
              <el-checkbox :label="item.dictKey" v-for="(item, index) in unfriendlytList" :checked="checked" @change="checked=!checked" :key="index">{{item.dictValue}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item label="管理员密码" prop="password">
            <el-input v-model="commentFormData.password" placeholder="请输入管理员密码"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="dialog-footer p-t text-center">
        <el-button type="primary" @click="submitForm('commentFormData')">确 定</el-button>
      </div>
    </el-form>
  </basic-container>
</template>

<script>
import {handle_report} from "@/api/report/report";
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
    },
    data() {
      return {
        checked: false,
        formData: {},
        commentFormData: {
          violation: [],
          unfriendly: []
        },
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
      });
      getUnfriendly().then(res => {
        this_.unfriendlytList = res.data.data;
      });
    },
    
    methods: {
      // 关闭模态框
      closeDialogAddgsVisible() {
        this.$emit("closeDialogAddgsVisible", true);
      },

      submitForm (formName) {
        let this_ = this;
        this_.formData.status = 2;
        console.log(this_.formData)
        this_.$refs[formName].validate(valid => {
          if (valid) {
          handle_report(this_.formData).then(res => {
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
                    this_.onLoad(this_.page);
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

