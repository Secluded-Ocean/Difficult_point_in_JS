# 深入学习原型和原型链！

### 构造函数创建对象

下面的例子用new创造了一个Person的实例对象

```javascript
function Person() {

}
// 虽然写在注释里，但是你要注意：
// prototype是函数才会有的属性
Person.prototype.name = 'Kevin';
var person1 = new Person();
var person2 = new Person();
console.log(person1.name) // Kevin
console.log(person2.name) // Kevin
```

### prototype

每个**函数**都有一个prototype原型（注意：只有函数才有prototype！！！！）

```javascript
function Person() {

}
// prototype是函数才会有的属性
Person.prototype.name = 'Kevin';
var person1 = new Person();
var person2 = new Person();
console.log(person1.name) // Kevin
console.log(person2.name) // Kevin
```

调用Person这个构造函数构造一个实例，这个实例上会有__proto__属性，这个属性指向该实例的原型；

与此同时，Person构造函数的prototype属性也指向这个原型。

原型：每一个JS对象（除了null）在创建时就会与之关联另一个对象，这个对象被称为“原型”，每个对象都会从原型继承属性；

### __proto\_\_

每个除null以外的JS对象都有\_\_proto\_\_属性，这个属性会指向该对象的原型；

```javascript
function Person() {

}
var person = new Person();
console.log(person.__proto__ === Person.prototype); // true
```

### constructor

每个原型都有一个constructor指向关联的构造函数

```javascript
function Person() {

}
console.log(Person === Person.prototype.constructor); // true
```

## 总结

```javascript
function Person() {

}

var person = new Person();

console.log(person.__proto__ == Person.prototype) // true
console.log(Person.prototype.constructor == Person) // true
// 顺便学习一个ES5的方法,可以获得对象的原型
console.log(Object.getPrototypeOf(person) === Person.prototype) // true
```

## 注意点

1. 当从实例身上直接调用.constructor方法时，其实返回的是实例的原型对象上的.constructor
2. \_\_proto\_\_，绝大部分浏览器都支持这个非标准的方法访问原型，然而它并不存在于 Person.prototype 中，实际上，它是来自于 Object.prototype ，与其说是一个属性，不如说是一个 getter/setter，当使用 obj._\_proto\_\_ 时，可以理解成返回了 Object.getPrototypeOf(obj)。
