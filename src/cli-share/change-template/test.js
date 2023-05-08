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