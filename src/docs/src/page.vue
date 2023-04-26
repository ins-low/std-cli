<template>
  <div>
    <h3>{{$t('title.info')}}</h3>
    <div>
      <div>{{$t('test.info')}}</div>
    </div>
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
      let info = $t('llllew');
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
