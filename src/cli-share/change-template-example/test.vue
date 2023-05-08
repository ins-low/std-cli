<template>
  <div>
    <h3>{{$t('title.info')}}</h3>
    <h4>{{title}}</h4>
    <test-info>
      <div>{{$t('test.info')}}</div>
    </test-info>
  </div>
</template>
<script>
export default {
  data(){
    return {
      title:this.$t('test')
    }
  },
  methods: {
    showInfo(){
      let info = this.$t('llllew');
      run(info);
      return this.$t('kkkk')
    },
    testGo(){
      let data = {
        info: this.$t('data.info')
      }
      this.$t('2123123')
    }
  },
}
</script>
<style scoped>
.info{
  background: #fff;
  color:#000;
}
</style>