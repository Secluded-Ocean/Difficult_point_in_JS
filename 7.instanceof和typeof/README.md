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
function new_instance_of(leftVaule, rightVaule) { 
    let rightProto = rightVaule.prototype; // 取右表达式的 prototype 值
    leftVaule = leftVaule.__proto__; // 取左表达式的__proto__值
    while (true) {
    	if (leftVaule === null) {
            return false;
        }
        if (leftVaule === rightProto) {
            return true;
        } 
        leftVaule = leftVaule.__proto__ 
    }
}
```

其实 `instanceof` 主要的实现原理就是只要右边变量的 `prototype` 在左边变量的原型链上即可。因此，`instanceof` 在查找的过程中会遍历左边变量的原型链，直到找到右边变量的 `prototype`，如果查找失败，则会返回 false，告诉我们左边变量并非是右边变量的实例。
