function outer() {
  var num = 0 //内部变量
  return function add() {
    //通过return返回add函数，就可以在outer函数外访问了
    num++ //内部函数有引用，作为add函数的一部分了
    console.log(num)
  }
}
var func1 = outer()
func1() //实际上是调用add函数， 输出1
func1() //输出2 因为outer函数内部的私有作用域会一直被占用
var func2 = outer()
func2() // 输出1  每次重新引用函数的时候，闭包是全新的。
func2() // 输出2

//例题2
function outer(x) {
  function inner(y) {
    console.log(x + y)
  }
  return inner
}
var inn = outer(3) //数字3传入outer函数后，inner函数中x便会记住这个值
inn(5) //当inner函数再传入5的时候，只会对y赋值，所以最后弹出8

function fn() {
  var num = 100
  return function () {}
}
var f = fn() //fn执行形成的这个私有的作用域就不能再销毁了
