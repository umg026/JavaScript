console.log(a); // when we use only thisstatement then error is REFRENCE ERROR A is NOT DEFINE
var a = 10 // cause undefine result


hi()  // Work Properly if we define function here
function hi() {
    console.log("heelo");
}


hiii()  // ReferenceError: Cannot access 'hiii' before initialization
const hiii = () => {
    console.log("this is arrow fun");
}
hiii() // work properly


var v1 = 10;
(function(){
    console.log(v1);     // 10
    v1 = 20;    // it is not a declaration, declaration is hoisted
    console.log(v1);     // 20
    
})();
console.log(v1);         // 20
var v1 = 30;
 