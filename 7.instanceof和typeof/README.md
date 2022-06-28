# typeof

### typeof用途

一般用于判断一个变量的类型，可以判断**number, string, boolean, undefined, symbol, function, object**七种类型，缺点是判断object时不能具体到某一个object。

### typeof原理

##### js底层是如何存储数据类型的

js在底层存储变量时，会在变量的机器码的低位1-3位存储变量的类型信息：

* 000：对象
* 010：浮点数
* 100：字符串
* 110：布尔
* 1：整数

但是，对于undefined和null来说比较特殊

null：所有机器码均为0

undefined：用-2^30整数来表示

因此，typeof在判断null时，由于null机器码均为0，则会将null当作对象来看待

然而如果用instanceof来判断的话：

```javascript
null instanceof null // TypeError: Right-hand side of 'instanceof' is not an object
```

null直接判断为不是object（JS的历史遗留bug）

因此在用 `typeof` 来判断变量类型的时候，我们需要注意，最好是用 `typeof` 来判断基本数据类型（包括 `symbol`），避免对 null 的判断

##### 另一个判断类型的方法

还有一个不错的判断类型的方法，就是Object.prototype.toString.call()，我们可以利用这个方法来对一个变量的类型来进行比较准确的判断

```javascript
Object.prototype.toString.call(1) // "[object Number]"

Object.prototype.toString.call('hi') // "[object String]"

Object.prototype.toString.call({a:'hi'}) // "[object Object]"

Object.prototype.toString.call([1,'a']) // "[object Array]"

Object.prototype.toString.call(true) // "[object Boolean]"

Object.prototype.toString.call(() => {}) // "[object Function]"

Object.prototype.toString.call(null) // "[object Null]"

Object.prototype.toString.call(undefined) // "[object Undefined]"

Object.prototype.toString.call(Symbol(1)) // "[object Symbol]"
```

# instanceof

### instanceof用途

主要用来判断一个实例是否属于某种类型，也可以判断一个实例是否是其父类型或者祖先类型的实例

```javascript
let person = function () {
}
let programmer = function () {
}
programmer.prototype = new person()
let nicole = new programmer()
nicole instanceof person // true
nicole instanceof programmer // true
```

### 实现原理

```javascript
// [1,2,3] instanceof Array ---- true

// L instanceof R
// 变量R的原型 存在于 变量L的原型链上
function instance_of(L, R) {
  // 验证如果为基本数据类型，就直接返回false
  const baseType = ['string', 'number', 'boolean', 'undefined', 'symbol']
  if (baseType.includes(typeof L)) {
    return false
  }

  let RP = R.prototype //取 R 的显示原型
  L = L.__proto__ //取 L 的隐式原型
  while (true) {
    // 无线循环的写法（也可以使 for(;;) ）
    if (L === null) {
      //找到最顶层
      return false
    }
    if (L === RP) {
      //严格相等
      return true
    }
    L = L.__proto__ //没找到继续向上一层原型链查找
  }
}
```

其实 `instanceof` 主要的实现原理就是只要**右边变量的 `prototype` 在左边变量的原型链上**即可。因此，`instanceof` 在查找的过程中会遍历左边变量的原型链，直到找到右边变量的 `prototype`，如果查找失败，则会返回 false，告诉我们左边变量并非是右边变量的实例。

# 几个有趣的例子

```javascript
function Foo() {
}

Object instanceof Object // true
Function instanceof Function // true
Function instanceof Object // true
Foo instanceof Foo // false
Foo instanceof Object // true
Foo instanceof Function // true
```

##### 1.Object instanceof Object

Object 的 `prototype` 属性是 `Object.prototype`, 而由于 Object 本身是一个函数，由 Function 所创建，所以 `Object.__proto__` 的值是 `Function.prototype`，而 `Function.prototype` 的 `__proto__` 属性是 `Object.prototype`，所以我们可以判断出，`Object instanceof Object` 的结果是 true 。用代码简单的表示一下

```javascript
leftValue = Object.__proto__ = Function.prototype;
rightValue = Object.prototype;
// 第一次判断
leftValue != rightValue
leftValue = Function.prototype.__proto__ = Object.prototype
// 第二次判断
leftValue === rightValue
// 返回 true
```

`Function instanceof Function` 和 `Function instanceof Object` 的运行过程与 `Object instanceof Object` 类似，故不再详说。

##### 2.Foo instanceof Foo

Foo 函数的 `prototype` 属性是 `Foo.prototype`，而 Foo 的 `__proto__` 属性是 `Function.prototype`，由图可知，Foo 的原型链上并没有 `Foo.prototype` ，因此 `Foo instanceof Foo` 也就返回 false 。

```javascript
leftValue = Foo, rightValue = Foo
leftValue = Foo.__proto = Function.prototype
rightValue = Foo.prototype
// 第一次判断
leftValue != rightValue
leftValue = Function.prototype.__proto__ = Object.prototype
// 第二次判断
leftValue != rightValue
leftValue = Object.prototype = null
// 第三次判断
leftValue === null
// 返回 false
```

##### 3.Foo instanceof Object

```javascript
leftValue = Foo, rightValue = Object
leftValue = Foo.__proto__ = Function.prototype
rightValue = Object.prototype
// 第一次判断
leftValue != rightValue
leftValue = Function.prototype.__proto__ = Object.prototype
// 第二次判断
leftValue === rightValue
// 返回 true 
```

##### 4.Foo instanceof Function

```javascript
leftValue = Foo, rightValue = Function
leftValue = Foo.__proto__ = Function.prototype
rightValue = Function.prototype
// 第一次判断
leftValue === rightValue
// 返回 true 
```

# 总结

简单来说，我们使用 `typeof` 来判断基本数据类型是 ok 的，不过需要注意当用 `typeof` 来判断 `null` 类型时的问题，如果想要判断一个对象的具体类型可以考虑用 `instanceof`，但是 `instanceof` 也可能判断不准确，比如一个数组，他可以被 `instanceof` 判断为 Object。所以我们要想比较准确的判断对象实例的类型时，可以采取 `Object.prototype.toString.call` 方法。
