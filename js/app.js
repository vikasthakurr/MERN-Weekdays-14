var a = 10;
function outer() {
  console.log(a);

  function inner() {
    console.log(a);
  }
  inner();
}
outer();
