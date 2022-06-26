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

### __proto__

