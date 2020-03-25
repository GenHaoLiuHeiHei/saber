<template>
	<div>
        <el-upload
        :action="actionData"
        :headers="wocao"
        accept="image/*"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="hanldSuccess"
        :on-exceed="handleExceed"
        :on-change="handleChange"
        :limit="limit"
        :multiple="multiple"
        :file-list="dialogFileList">
            <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
	</div>
</template>
<script>
import { baseUrl } from "@/config/env";
export default {
    props: {
        // 上传张数
        limit: {
            type: Number,
            default: 1
        },
        // 是否多选
        multiple: {
            type: Boolean,
            default: () => {
                return false
            }
        },
        // 单张图片
        imgData: {
            type: String,
            default: ''
        },
        // 多张图片
        fileList: {
            type: Array,
            default: () => {
                return []
            }
        },
        // 来着哪个表单
        formType: {
            type: String,
            default: ''
        },
        // 存在多个组件，下标
        formIndex: {
            type: Number
        }
    },
    data() {
      return {
        dialogImageUrl: '',
        dialogVisible: false,
        dialogFileList: [],
        wocao: {
            // Accept: "application/json, text/plain, */*",
            // Authorization: "Basic c2FiZXI6c2FiZXJfc2VjcmV0",
            // Cookie: 'x-access-token=eyJ0eXAiOiJKc29uV2ViVG9rZW4iLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJpc3N1c2VyIiwiYXVkIjoiYXVkaWVuY2UiLCJ0ZW5hbnRfaWQiOiIwMDAwMDAiLCJyb2xlX25hbWUiOiJhZG1pbmlzdHJhdG9yIiwidXNlcl9pZCI6IjEiLCJyb2xlX2lkIjoiMSIsInVzZXJfbmFtZSI6ImFkbWluIiwidG9rZW5fdHlwZSI6ImFjY2Vzc190b2tlbiIsImFjY291bnQiOiJhZG1pbiIsImNsaWVudF9pZCI6InNhYmVyIiwiZXhwIjoxNTg0Nzk2OTkyLCJuYmYiOjE1ODQ0MzY5OTJ9.Ui5nYFCHnkweePd03BwMbutpG3sh385HuFmsr3sIY3A',
        }
      };
    },
    computed: {
        actionData: function () {
            return baseUrl + 'api/blade-resource/oss/endpoint/put-file'
        }
    },
    mounted () {
        this.dialogFileList = this.fileList;
        if (this.imgData.length) {
            this.dialogFileList = [
                {
                    url: this.imgData
                }, 
            ]
        }
    },
    methods: {
        // 改变的时候
        handleChange (file, fileList) {
            console.log(file, fileList);
        },
        // 上传成功
        hanldSuccess (file, fileList) {
            this.dialogImageUrl = file.url;
            console.log(file, fileList);
            this.$emit('successUpload', fileList, this.formType, this.formIndex)
        },
        // 删除
        handleRemove(file, fileList) {
            this.$emit('removeUpload', fileList, this.formType, this.formIndex)
            console.log(file, fileList);
        },
        // 点击文件列表中已上传的文件时的钩子
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 ${this.limit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
    }
}
</script>