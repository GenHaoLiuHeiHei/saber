<template>
  <basic-container>
    <avue-form ref="form" v-model="obj" :option="option" @submit="submit">
    </avue-form>
  </basic-container>
</template>
<script>
const DIC = {
    VAILD: [{
        label: '真',
        value: 'true'
    }, {
        label: '假',
        value: 'false'
    }],
    SEX: [{
        label: '男',
        value: 0
    }, {
        label: '女',
        value: 1
    }]
}
export default {
    data() {
      return {
        obj:{},
        sizeValue:''
      }
    },
    computed: {
       option(){
         return{
          size:this.sizeValue,
          column: [
              {
                  label: "被举报次数",
                  prop: "name",
                  mock:{
                    type:'name'
                  },
                  span:16,
                  labelWidth: 120
              },
            
              {
                  label: "处理方式",
                  prop: "sex",
                  span:16,
                  type: "select",
                  dicData: DIC.SEX,
                  mock:{
                    type:'dic'
                  },
                  valueDefault: 0,
                  labelWidth: 120
              },
            ]
          }
       }
    },
    mounted(){
        this.obj.username = 'smallwei'
        this.obj.switch = 0;
        this.obj.phone='17547400800';
    },
    methods:{
        submit () {
          this.$message.success('当前数据'+JSON.stringify(this.obj));
        }
    }
  }
</script>