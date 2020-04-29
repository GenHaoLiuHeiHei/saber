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
          <el-form-item label="内容" >
            <el-input v-model="formData.relateComment" type="textarea" :disabled="true" placeholder="请输入内容"></el-input>
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
import {book_handle_report, blog_handle_report, bookUpdatelist, blogUpdatelist} from "@/api/report/report";
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
      this.onLoad();
    },
    computed: {
      getAjax() {
        return this.tofrom === 'book' ? bookUpdatelist : blogUpdatelist
      },
      getUpdateAjax() {

        return this.tofrom === 'book' ? book_handle_report : blog_handle_report
      }
    },

    methods: {
      // 关闭模态框
      closeDialogAddgsVisible() {
        this.$emit("closeDialogAddgsVisible", true);
      },

      onLoad() {
        let this_ = this;
        this_.loading = true;
        this.getAjax(this_.formData.relateId).then(data => {
          this_.formData = data.data.data;
          getViolation().then(r => {
                this_.violationList = r.data.data;
              }).then(() => {
                return getUnfriendly()
              }).then(res => {
                this_.unfriendlytList = res.data.data;
                if (this_.formData.reasons.length) {
                  console.log(JSON.parse(this_.formData.reasons));
                  JSON.parse(this_.formData.reasons).map(v => {
                    v.dictKey = JSON.parse(v.dictKey)
                    this_.formData[v.code] = v.dictKey;
                  })
                }
              });
        });
      },

      submitForm (formName) {
        let this_ = this;
        this_.formData.status = 2;
        this_.$refs[formName].validate(valid => {
          if (valid) {
          this.getUpdateAjax(this_.formData).then(res => {
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

