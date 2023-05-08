export default class Viewer{
  name = '';
  id = '';
  props = {
    te: {
      default:true
    }
  }
  data() { 
    return {
      name: '12321',
      info:'info'
    }
  }
  show() { 
    console.log('show Viewer');
  }
  render() { 
    return ''
  }
}