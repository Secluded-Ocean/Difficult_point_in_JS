## 七大继承！要分清哟~

## 原型链继承

子类的实例可以通过\_\_proto\_\_访问到父类Parent的实例，从而访问到父类的私有方法，然后再通过__proto\_\_指向父类的原型Parent.prototype从而获得父类原型上的公有方法。

```javascript
function Parent () {
    this.name = 'kevin';
}

Parent.prototype.getName = function () {
    console.log(this.name);
}

function Child () {

}

Child.prototype = new Parent();	 // 子类的原型为父类的一个实例对象

var child1 = new Child();

console.log(child1.getName()) // kevin
```

关键行：**Child.prototype = new Parent();**

优点：

1. 父类新增方法/原型属性，子类也能访问到
2. 简单易实现

**缺点：**

1. 引用类型的属性被所有实例共享；

2. 创建Child的实例时无法向Parent传参；

3. 无法实现多继承


## 盗用构造函数继承

```javascript
function Parent () {
    this.names = ['kevin', 'daisy'];
}

function Child () {
    Parent.call(this);
}

var child1 = new Child();

child1.names.push('yayu');

console.log(child1.names); // ["kevin", "daisy", "yayu"]

var child2 = new Child();

console.log(child2.names); // ["kevin", "daisy"]
```

优点：

1. 避免了引用类型的属性被所有实例共享；
2. 可以在child中向parent传参;
3. 可以实现多继承（call多个父类对象）

缺点：

1. 方法都在构造函数中定义，每次创建实例都会创建一遍方法，无法实现函数复用；

2. 子类不能访问父类原型上定义的方法。


## 组合继承

```javascript
function Parent (name) {
    this.name = name;
    this.colors = ['red', 'blue', 'green'];
}

Parent.prototype.getName = function () {
    console.log(this.name)
}

function Child (name, age) {
    Parent.call(this, name);	//第二次调用构造函数Parent()，这让Child生成的实例上有了colors的属性
    this.age = age;
}

Child.prototype = new Parent();	//第一次调用构造函数Parent()，这让Child.prototype上有了colors的属性
Child.prototype.constructor = Child;

var child1 = new Child('kevin', '18');

child1.colors.push('black');

console.log(child1.name); // kevin
console.log(child1.age); // 18
console.log(child1.colors); // ["red", "blue", "green", "black"]

var child2 = new Child('daisy', '20');

console.log(child2.name); // daisy
console.log(child2.age); // 20
console.log(child2.colors); // ["red", "blue", "green"]
```

优点：融合原型链继承和构造函数的优点，是 JavaScript 中最常用的继承模式。

缺点：

1. 调用两次构造函数，
2. 在这个例子中，如果我们打印 child1 对象，我们会发现 Child.prototype 和 child1 都有一个属性为 `colors`，属性值为 `['red', 'blue', 'green']`，这是调用了两次构造函数的结果。


## 原型式继承（即Object.create()）

```javascript
function createObj(o) {
    function F(){}
    F.prototype = o;
    return new F();
}
```

优点：

ES5 **Object.create( )** 的模拟实现，将传入的对象作为创建的对象的原型，本质上是对传入的对象执行了一次浅复制。

适合不需要单独创建构造函数，但仍然需要在对象间共享信息的场合。

缺点：包含引用类型的属性值始终都会共享相应的值，这点跟原型链继承一样。

```javascript
var person = {
    name: 'kevin',
    friends: ['daisy', 'kelly']
}

var person1 = createObj(person);
var person2 = createObj(person);

person1.name = 'person1';
console.log(person2.name); // kevin

person1.friends.push('taylor');
console.log(person2.friends); // ["daisy", "kelly", "taylor"]
```

**注意**：修改 `person1.name`的值，`person2.name`的值并未发生改变，并不是因为 `person1`和 `person2`有独立的 name 值，而是因为 `person1.name = 'person1'`，给 `person1`添加了 name 值，并非修改了原型上的 name 值。


## 寄生式继承

与原型式继承比较接近，在原型式继承的基础上增强对象，然后返回这个对象

```javascript
function createObj (o) {
    var clone = Object.create(o);   // 原型式继承
    clone.sayName = function () {   // 以某种方式增强创造出来的对象
        console.log('hi');
    }
    return clone;		    // 返回这个对象
}
```

优点：适合主要关注的是对象，而不在乎类型和构造函数的场景。

缺点：跟借用构造函数模式一样，每次创建对象都会创建一遍方法。


## 寄生式组合继承

基本思路：不通过调用父类构造函数给子类原型赋值，而是**取得父类原型的一个副本**。

即：**用寄生式继承来继承父类原型**，然后将返回的新对象赋值给子类原型。

```javascript
function Parent (name) {
    this.name = name;
    this.colors = ['red', 'blue', 'green'];
}

Parent.prototype.getName = function () {
    console.log(this.name)
}

function Child (name, age) {
    Parent.call(this, name);
    this.age = age;
}

// 关键的三步
var F = function () {};  
F.prototype = Parent.prototype;
Child.prototype = new F();
// 以上三步等价于Child.prototype = Object.create(Parent.prototype)
Child.prototype.constructor = Child	//重写构造函数

var child1 = new Child('kevin', '18');

console.log(child1);
```

封装一下：

```javascript
function object(o) {
    function F() {}
    F.prototype = o;
    return new F();
}  // 这是原型式继承，本质上是对o的一次浅复制，也是ES5 Object.create()的模拟实现

function prototype(child, parent) {
    var prototype = object(parent.prototype);	// 第1步：用原型式继承创建父类原型的一个浅复制（创建对象）
    //上面这步也可以换为 var prototype = Object.create(parent.prototype);
    prototype.constructor = child;		// 第2步：给第一步返回的对象重写constructor属性（增强对象）
    child.prototype = prototype;		// 第3步：将新创建的对象赋值给子类型的原型（赋值对象）
}	// 这1、2步其实就是在使用寄生式继承来继承父类原型


// 当我们使用的时候：
prototype(Child, Parent);
```

这种方式的高效率体现它只调用了一次 Parent 构造函数，并且因此避免了在 Child.prototype 上面创建不必要的、多余的属性。与此同时，原型链还能保持不变；因此，还能够正常使用 instanceof 和 isPrototypeOf。开发人员普遍认为寄生组合式继承是引用类型最理想的继承范式。

## ES6中的class继承

注意：class只是原型的语法糖

```javascript
class Person {
  //调用类的构造方法
  constructor(name, age) {
    this.name = name
    this.age = age
  }
  //定义一般的方法
  showName () {
    console.log("调用父类的方法")
    console.log(this.name, this.age);
  }
}
let p1 = new Person('kobe', 39)
console.log(p1)
//定义一个子类
class Student extends Person {
  constructor(name, age, salary) {
    super(name, age)//通过super调用父类的构造方法
    this.salary = salary
  }
  showName () {//在子类自身定义方法
    console.log("调用子类的方法")
    console.log(this.name, this.age, this.salary);
  }
}
let s1 = new Student('wade', 38, 1000000000)
console.log(s1)
s1.showName()   
```

优点：语法简单

缺点：不是所有浏览器都支持
