const num = 1;

const add = (x, y) =>{
  return x + y;
}

const run = (func, a,b) => {
  return func(a, b);
}

console.log(run(add, 1, 2));