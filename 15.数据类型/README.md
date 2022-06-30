# JS的数据类型

Javascript有两种数据类型：

- 基本数据类型：Undefined、Null、Boolean、Number、String、Symbol
- 引用数据类型：Object对象(对象、数组和函数)

## 一、基本数据类型

1. 除了直接赋值以外，值是不可变的

   ```js
   var name = 'java';
   name.toUpperCase(); // 输出 'JAVA'
   console.log(name); // 输出  'java'
   ```

2. 存放在栈区：原始数据类型直接存储在栈(stack)中的简单数据段，占据空间小、大小固定，属于被频繁使用数据，所以放入栈中存储。

3. 存在值的比较法则：

   ==：只进行值的比较,会进行数据类型的转换。

   ===：不仅进行值得比较，还要进行数据类型的比较。

## 二、引用数据类型

1. 值是可变的

   ```js
   var a={age:20}；
   a.age=21；
   console.log(a.age)//21
   ```

   引用类型可以拥有属性和方法，并且是可以动态改变的。

2. 同时保存在栈内存和堆内存：

   - 引用数据类型存储在堆(heap)中的对象,占据空间大、大小不固定,如果存储在栈中，将会影响程序运行的性能；
   - 引用数据类型在栈中存储了指针，该指针指向堆中该实体的起始地址。
   - **当解释器寻找引用值时，会首先检索其在栈中的地址，取得地址后从堆中获得实体。**

3. 比较是引用的比较

   ```JS
   var a = {age:20};
   var b = a;
   b.age = 21;
   console.log(a.age == b.age)//true
   ```

## 三、检验数据类型

### 1.typeof

**typeof返回一个表示数据类型的字符串**，返回结果包括：number、boolean、string、symbol、object、undefined、function等7种数据类型，**但不能判断null、array等**

### 2.instanceof

instanceof 是用来判断A是否为B的实例，表达式为：A instanceof B，如果A是B的实例，则返回true,否则返回false。**instanceof 运算符用来测试一个对象在其原型链中是否存在一个构造函数的 prototype 属性。**

三大弊端：

- 对于**基本数据类型**来说，**字面量**方式创建出来的结果和**实例**方式创建的是有一定的区别的。

  ```JS
  console.log(1 instanceof Number)//false
  console.log(new Number(1) instanceof Number)//true
  ```

  - 从严格意义上来讲，**只有实例创建出来的结果才是标准的对象数据类型值**，也是标准的Number这个类的一个实例；
  - 对于字面量方式创建出来的结果是基本的数据类型值，不是严谨的实例，
  - 但是，由于JS的松散特点，导致了字面量方式创建出来的结果也可以使用Number.prototype上提供的方法。

- 只要在当前实例的原型链上，我们用其检测出来的结果都是true。**在类的原型继承中，我们最后检测出来的结果未必准确**。

  ```JS
  var arr = [1, 2, 3];
  console.log(arr instanceof Array) // true
  console.log(arr instanceof Object);  // true
  function fn(){}
  console.log(fn instanceof Function)// true
  console.log(fn instanceof Object)// true
  ```

- 不能检测null 和 undefined。

### 3.constructor

constructor作用和instanceof非常相似。**但constructor检测 Object与instanceof不一样，还可以处理基本数据类型的检测。**

```JS
var aa=[1,2];
console.log(aa.constructor===Array);//true
console.log(aa.constructor===RegExp);//false
console.log((1).constructor===Number);//true
var reg=/^$/;
console.log(reg.constructor===RegExp);//true
console.log(reg.constructor===Object);//false 
```

两大弊端：

- null 和 undefined 是无效的对象，因此是不会有 constructor 存在的，这两种类型的数据需要通过其他方式来判断。

- 函数的 constructor 是不稳定的，这个主要体现在把类的原型进行重写，在重写的过程中很有可能出现把之前的constructor给覆盖了，这样检测出来的结果就是不准确的

 ```js
  function Fn(){}
  Fn.prototype = new Array()
  var f = new Fn
  console.log(f.constructor)//Array
 ```

### 4.Object.prototype.toString.call()

**Object.prototype.toString.call() 最准确最常用的方式**。首先获取Object原型上的toString方法，让方法执行，让toString方法中的this指向第一个参数的值。

**关于toString重要补充说明**：

- 本意是转换为字符串，但是某些toString方法不仅仅是转换为字符串
- 对于Number、String，Boolean，Array，RegExp、Date、Function原型上的toString方法都是把当前的数据类型转换为字符串的类型（它们的作用仅仅是用来转换为字符串的）
- Object上的toString并不是用来转换为字符串的。

**Object上的toString它的作用是返回当前方法执行的主体**（方法中的this）所属类的详细信息即"[object Object]",其中**第一个object代表当前实例是对象数据类型的(这个是固定死的)，第二个Object代表的是this所属的类是Object。**

```JS
Object.prototype.toString.call('') ;   // [object String]
Object.prototype.toString.call(1) ;    // [object Number]
Object.prototype.toString.call(true) ; // [object Boolean]
Object.prototype.toString.call(undefined) ; // [object Undefined]
Object.prototype.toString.call(null) ; // [object Null]
Object.prototype.toString.call(new Function()) ; // [object Function]
Object.prototype.toString.call(new Date()) ; // [object Date]
Object.prototype.toString.call([]) ; // [object Array]
Object.prototype.toString.call(new RegExp()) ; // [object RegExp]
Object.prototype.toString.call(new Error()) ; // [object Error]
Object.prototype.toString.call(document) ; // [object HTMLDocument]
Object.prototype.toString.call(window) ; //[object global] window是全局对象global的引用
```





# JS数据类型转换

## 一、强制转换

### 1.其他数据类型 => String

#### 方法一：toString()

- 调用被转换数据类型的toString()方法,该方法不会影响到原变量，它会将转换的结果返回，**但是注意：null和undefined这两个值没有toString，如果调用他们的方法，会报错**。

  ```JS
  var a = 123
  a.toString()//"123"
  var b = null;
  b.toString()//"报错"
  var c = undefined
  c.toString()//"报错"
  ```

- 采用 Number 类型的 toString() 方法的基模式，可以用不同的基输出数字，例如二进制的基是 2，八进制的基是 8，十六进制的基是 16

  ```JS
  var iNum = 10;
  alert(iNum.toString(2));        //输出 "1010"
  alert(iNum.toString(8));        //输出 "12"
  alert(iNum.toString(16));       //输出 "A"
  ```

#### 方法二：String()

- 使用String()函数做强制类型转换时，对于Number和Boolean实际上就是调用的toString()方法，但是对于null和undefined，就不会调用toString()方法,它会将null直接转换为"null",将undefined 直接转换为"undefined"

  ```JS
  var a = null
  String(a)//"null"
  var b = undefined
  String(b)//"undefined"
  ```

- String方法的参数如果是对象，返回一个类型字符串；如果是数组，返回该数组的字符串形式。

```JS
String({a: 1}) // "[object Object]"
String([1, 2, 3]) // "1,2,3"
```



### 2.其他的数据类型 => Number

#### 方法一：使用Number()函数

下面分成两种情况讨论，一种是参数是原始类型的值，另一种是参数是对象：

**(1)原始类型值**

①字符串转数字

Ⅰ 如果是纯数字的字符串，则直接将其转换为数字

Ⅱ 如果字符串中有非数字的内容，则转换为NaN

Ⅲ 如果字符串是一个空串或者是一个全是空格的字符串，则转换为0

```JS
Number('324') // 324
Number('324abc') // NaN
Number('') // 0
```

②布尔值转数字:true转成1,false转成0

③undefined转数字:转成NaN

④null转数字：转成0

⑤Number() 接受数值作为参数，此时它既能识别负的十六进制，也能识别0开头的八进制，返回值永远是十进制值

**(2)对象**

简单的规则是，Number方法的参数是对象时，将返回NaN，除非是包含单个数值的数组。

```js
Number({a: 1}) // NaN
Number([1, 2, 3]) // NaN
Number([5]) // 5
```

#### 方法二：parseInt() & parseFloat()

这种方式专门用来对付字符串，parseInt()一个字符串转换为一个整数,可以将一个字符串中的有效的整数内容取出来，然后转换为Number。parseFloat()把一个字符串转换为一个浮点数。parseFloat()作用和parseInt()类似，不同的是它可以获得有效的小数。

```JS
console.log(parseInt('.21'));        //NaN
console.log(parseInt("10.3"));        //10
console.log(parseFloat('.21'));      //0.21
console.log(parseFloat('.d1'));       //NaN
console.log(parseFloat("10.11.33"));  //10.11
console.log(parseFloat("4.3years"));  //4.3
console.log(parseFloat("He40.3"));    //NaN
```

parseInt()在没有第二个参数时默认以十进制转换数值，有第二个参数时，以第二个参数为基数转换数值，如果基数有误返回NaN

```
console.log(parseInt("13"));          //13
console.log(parseInt("11",2));        //3
console.log(parseInt("17",8));        //15
console.log(parseInt("1f",16));       //31
```

**两者的区别：Number函数将字符串转为数值，要比parseInt函数严格很多。基本上，只要有一个字符无法转成数值，整个字符串就会被转为NaN。**

```
parseInt('42 cats') // 42
Number('42 cats') // NaN
```

上面代码中，**parseInt逐个解析字符，而Number函数整体转换字符串的类型。**
另外，对空字符串的处理也不一样

```
Number("   ");     //0    
parseInt("   ");   //NaN
```

### 3、其他的数据类型转换为Boolean

它的转换规则相对简单：**只有空字符串("")、null、undefined、+0、-0 和 NaN 转为布尔型是 false，其他的都是 true，空数组、空对象转换为布尔类型也是 true,甚至连false对应的布尔对象new Boolean(false)也是true**

```
Boolean(undefined) // false
Boolean(null) // false
Boolean(0) // false
Boolean(NaN) // false
Boolean('') // false
```

```
Boolean({}) // true
Boolean([]) // true
Boolean(new Boolean(false)) // true
```

## 二、自动转换

遇到以下几种情况时，JavaScript 会自动转换数据类型，即转换是自动完成的，用户不可见。

### 1.自动转换为布尔值

JavaScript 遇到预期为布尔值的地方(比如if语句的条件部分),就会将非布尔值的参数自动转换为布尔值。系统内部会**自动调用Boolean**函数。

```JS
if ('abc') {
  console.log('hello')
}  // "hello"
```

除此之外，使用! !!（逻辑非运算符）也可以转为boolean类型

只有 0、NaN、null、undefined、空字符串、false 转为布尔类型时为 false，其余情况转换为布尔类型都是 true，而且没有特殊情况。

```js
console.log(!0); // true
console.log(!!''); // false
```



### 2.自动转换为数值

**算数运算符(+ - \* /)跟非Number类型的值进行运算时，会将这些值转换为Number，然后在运算，除了字符串的加法运算**

```JS
true + 1 // 2
2 + null // 2
undefined + 1 // NaN
2 + NaN // NaN 任何值和NaN做运算都得NaN
'5' - '2' // 3
'5' * '2' // 10
true - 1  // 0
'1' - 1   // 0
'5' * []    // 0
false / '5' // 0
'abc' - 1   // NaN
```

**一元运算符也会把运算子转成数值。**例如:`+"123"`等同于`Number("123")`

```js
+'abc' // NaN
-'abc' // NaN
+true // 1
-false // 0
```

### 3.自动转换为字符串

字符串的自动转换，主要发生在字符串的加法运算时。当一个值为字符串，另一个值为非字符串，则后者转为字符串。

```js
'5' + 1 // '51'
'5' + true // "5true"
'5' + false // "5false"
'5' + {} // "5[object Object]"
'5' + [] // "5"
'5' + function (){} // "5function (){}"
'5' + undefined // "5undefined"
'5' + null // "5null"
```



### 不同类型进行比较或运算时的隐式转换规律：

- **对象 => 字符串 => 数字**
- **布尔值 => 数字**

例如：对象和布尔比较的话，对象 => 字符串 => 数值，布尔值 => 数值。

#### 对象进行数据类型转换的过程

1. 先调用对象的 **Symbol.toPrimitive** 这个方法，如果不存在这个方法（结果是undefined），则
2. 再调用对象的 **valueOf** 获取原始值，如果没有原始值，则
3. 再调用对象的 **toString** 把其变成字符串，
4. 最后再把字符串基于 **Number** 转换为数字

```js
console.log([] + 1); 
// `[].valueOf()`没有原始值，再调用`[].toString()`得到`""`，字符串遇到`+`运算符可以进行拼接，就不需要转成数字 => "1"

console.log([2] - true); 
// `[].valueOf()`没有原始值，再调用`[].toString()`得到`"2"`，再调用`Number("2")`得到数字2。true直接调用`Number(true)`得到1。最后2 - 1 => 1

console.log({} + 1); 
// `{}.valueOf()`没有原始值，再调用`{}.toString()`得到"[object Object]"，遇到`+` 号进行字符串拼接 => "[object Object]1"

console.log({} - 1); 
// `{}.valueOf()`没有原始值，再调用`{}.toString()`得到"[object Object]"，再调用`Number("[object Object]")`得到NaN，最后NaN - 1 => NaN

```

#### 多种数据类型进行比较运算（== 或 ===）

![img](https://img2020.cnblogs.com/blog/1517387/202107/1517387-20210726164634252-1086241922.png)

**结论**

1. 三个等号：只有值和类型都相等，才会相等，不会进行默认的数据类型转换。**推荐使用**
2. 两个等号：如果两边的数据类型不同，首先要转换为相同的数据类型（转换的过程看前文），然后进行比较。
   - 对象 == 字符串|数字，是把对象转换为字符串或数字，先后进行比较
   - null == undefined，两个等号的情况下是成立的，除此之外，null 和 undefined 和除本身以外的任何值都不相等
   - 对象 == 对象，比较的是堆内存地址，只有地址一样，结果才为 true
   - NaN !== NaN，NaN和任何值都不相等，包括和他自己
   - 除此之外，如果两边的数据类型不一样，全部统一转换为数字类型，然后进行比较







# 面试题：

#### 第一题 

`[] == false;` 

 `![] == false;` 

解答：
`[] == false`：首先是两个等号，两边的数据类型不一样，需要进行数据类型的隐式类型转换，按照转换规律：
1.先看 [] 的 Symbol.toPrimitive ，不存在的情况下，再调用 [] 的 valueOf，没有原始值，再调用 [] 的 toString，等到的值为空字符串，空字符串基于 Number 转换为数字 0 。
2.false 基于 Number 转换为数字 0。
3.`0 == 0` ，得到 true

`![] == false`：![]需要先进行布尔值转换，得到 false， `false == false` 得到 true

#### 第二题

```js
let result = 100 + true + 21.2 + null + undefined + "Tencent" + [] + null + 9 + false;
console.log(result);
```

解答：

> 注意：+undefined => NaN
> 100 + true => 101 + 21.2 => 122.2 + null => 122.2 + undefined => NaN + "Tencent" => "NaNTencent" + [] => "NaNTencent" + null => "NaNTencentnull" + 9 => "NaNTencentnull9" + false = "NaNTencentnull9false"

注意：

- 122.2 + undefined = NaN
- 122.2 + null = 122.2



#### 第三题

```js
var a = ?	// 在？处填入什么代码能输出OK
if (a == 1 && a == 2 && a == 3) {
  console.log("OK")
}
```

解答：
思路一：利用 == 的转化机制，来重写 Symbol.toPrimitive 或者 valueOf 或者 toString

1.重写 Symbol.toPrimitive

```js
  var a = {
    i: 0
  };
  
  a[Symbol.toPrimitive] = function () {
    return ++this.i
  };

  if (a == 1 && a == 2 && a == 3) {
    console.log("OK");
  };
```

2.重写 valueOf

```js
  var a = {
    i: 0
  };

  a.valueOf = function () {
    return ++this.i
  };

  if (a == 1 && a == 2 && a == 3) {
    console.log("OK");
  };
```

3.重写 toString

```js
  var a = {
    i: 0
  };

  a.toString = function () {
    return ++this.i
  };

  if (a == 1 && a == 2 && a == 3) {
    console.log("OK");
  };
```

思路二：利用数组的 shift 方法的特性

```js
  var a = [1, 2, 3]

  // a[Symbol.toPrimitive] = a.shift;
  // a.valueOf = a.shift;
  a.toString = a.shift;

  if (a == 1 && a == 2 && a == 3) {
    console.log("OK");
  };
```

思路三：数据劫持

```js
  Object.defineProperty(window, 'a', {
    get: function () { // 读取 window.a 属性时会触发 get 方法
      this.xxx ? this.xxx++ : this.xxx = 1;
      return this.xxx; // return 后面是给 window.a 赋的值
    },
    set(val) { // 给 window.a 赋值时会触发 set 方法
      // val 是给 window.a 赋值时的那个值 
    }
  });
  if (a == 1 && a == 2 && a == 3) {
    console.log("OK");
  };
```
