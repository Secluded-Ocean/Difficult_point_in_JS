function fn() {
  console.log(this)
}
var obj = { fn: fn }
fn() //this->window
obj.fn() //this->obj
function sum() {
  fn() //this->window
}
sum()
var oo = {
  sum: function () {
    console.log(this) //this->oo
    fn() //this->window
  },
}
oo.sum()

function CreateJsPerson(name, age) {
  //浏览器默认创建的对象就是我们的实例p1->this
  this.name = name //->p1.name=name
  this.age = age
  this.writeJs = function () {
    console.log('my name is' + this.name + ',i can write Js')
  }
  //浏览器再把创建的实例默认的进行返回
}
var p1 = new CreateJsPerson('尹华芝', 48)

function Fn() {
  this.x = 100 //this->f1
  this.getX = function () {
    console.log(this.x) //this->需要看getX执行的时候才知道
  }
}
var f1 = new Fn()
f1.getX() //->方法中的this是f1，所以f1.x=100
var ss = f1.getX
ss() //->方法中的this是window ->undefined

//在非严格模式下
var obj = { name: '浪里行舟 ' }
function fn(num1, num2) {
  console.log(num1 + num2)
  console.log(this)
}
fn.call(100, 200) //this->100 num1=200 num2=undefined
fn.call(obj, 100, 200) //this->obj num1=100 num2=200
fn.call() //this->window
fn.call(null) //this->window
fn.call(undefined) //this->window

//严格模式下
fn.call() //在严格模式下this->undefined
fn.call(null) // 在严格模式 下this->null
fn.call(undefined) //在严格模式下this->undefined
