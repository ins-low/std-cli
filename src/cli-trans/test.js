export default class Viewer{
  name = '';
  id = '';
  constructor(params) {
    this.id = params;
  }
  show() { 
    console.log('show Viewer');
  }
  render() { 
    return ''
  }
}