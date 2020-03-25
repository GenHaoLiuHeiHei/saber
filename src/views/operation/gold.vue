<template>
  <div>
    <avue-form :option="option" v-model="form" @submit="handleSubmit"></avue-form>
  </div>
</template>
<script>
export default {
  data(){
    return {
       form:{
          text:['动态内容1','动态内容2'],
       },
       option:{
          column: [{
            span:24,
            label: '内容',
            prop: 'text',
            type:'dynamic'
          }]
       }
    }
  },
  methods:{
    handleSubmit(form){
       this.$message.success(JSON.stringify(this.form))
    }
  }
}
</script>
