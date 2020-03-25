export const bannerMixin = {
    data () {
        return {
            dynamicValidateForm: {
                bannerList:[
                    {
                        linkUrl: '',
                        imgUrl: ''
                    }
                ]
            }
        }
    },
    mounted() {
        console.log(0)
    },
    methods: {
        submitForm(formName) {
            console.log(this.dynamicValidateForm)
            this.$refs[formName].validate((valid) => {
                if (valid) {
                alert('submit!');
                } else {
                console.log('error submit!!');
                return false;
                }
            });
        },
        // 点击删除
        deleteRules(item, index) {
            this.index = this.dynamicValidateForm.bannerList.indexOf(item)
            if (index !== -1) {
                this.dynamicValidateForm.bannerList.splice(index, 1)
            }
        },
        // 点击添加
        addRules() {
            this.dynamicValidateForm.bannerList.push( {
                linkUrl: '',
                imgUrl: ''
            });
        }
    }
}