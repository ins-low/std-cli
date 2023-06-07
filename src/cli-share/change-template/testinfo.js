export default {
  data() {
    return {
      title: this.$t('test')
    };
  },
  methods: {
    showInfo() {
      let info = this.$t('llllew');
      run(info);
      return this.$t('kkkk');
    },
    testGo() {
      let data = {
        info: this.TestMethod('data.info')
      };
      this.TestMethod('2123123');
    }
  }
};