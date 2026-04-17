// let a = 10;
// let b = a;
// b = 30;
// console.log(a);
// console.log(b);

// let obj1 = {
//   name: "vikas",
// };

// let obj2 = obj1;
// obj2.name = "danish";
// console.log(obj1.name);
// console.log(obj2.name);

// let salary = 123.3456;
// console.log(typeof salary);

// // let bigNumber = 1234567890123456789012345678901234567890n;
// // console.log(typeof bigNumber);
// let name = "vikas";
// console.log(typeof name);

// let isMarried = false;

// let arr = [1, 2, 3, 4, 5];
// console.log(typeof arr);

// let obj = {};
// console.log(typeof obj);

// function abc() {}
// console.log(typeof abc);

// let age;
// console.log(typeof age);
// let job = null;
// console.log(typeof job);

// let arrr = [1, 34567];

// let arr2 = new Array();

// let obj1 = {};
// let obj2 = new Object();
// obj2.name = "vikas";

// console.log(obj2);

let obj3 = {
  fname: "vikas",
  lname: "thakur",
};

Object.freeze(obj3);
// obj3.fname = "pratyush";
obj3.salary = 234;
console.log(obj3);
// Object.seal(obj3);
// // obj3.fname = "pratyush";
// obj3.salary = 1234;
// console.log(obj3);
// console.log(obj3["fname"]);
// console.log(Object.keys(obj3));
// console.log(Object.values(obj3));
// console.log(Object.entries(obj3));
