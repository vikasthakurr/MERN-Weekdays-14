// let a = 10;

// {
//   let a = 10;
// }

// console.log(a);

// function abc() {
//   var a = 10;
// }
// console.log(a);

// function outer() {
//   let a = 10;

//   function inner() {
//     console.log(a);
//   }
//   inner();
// }
// outer();

function outer() {
  let a = 10;
  function inner() {
    console.log(a);
  }
  return inner;
}

let res = outer();
// console.log(res);
res();
