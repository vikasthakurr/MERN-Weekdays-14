let person = {
  fname: "vikas",
  lname: "thakur",
  age: 19,
  address: {
    city: "delhi",
    state: "delhi",
    country: "india",
  },
};

// let person2 = { ...person };
let person2 = structuredClone(person); // [person);
// person2.age = 24;
person2.address.city = "noida";
console.log(person, person2);

let obj1 = {
  name: "vikas",
};

// let obj2 = obj1;
// let obj2 = { ...obj1 };
// obj2.name = "thakur";
// console.log(obj1, obj2);
