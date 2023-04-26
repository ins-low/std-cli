import page from './page.vue'
const num = 1;

var add = (x, y) =>{
  return x + y;
}

var run = (func, a, b) => {
  return func(a, b);
}
console.log(run(add, 1, 2));

console.log(page);