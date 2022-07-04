# ES6之块级作用域

ES5只有全局作用域和函数作用域，这将会导致内层变量覆盖外层变量以及变量泄漏，成为全局变量的问题。

ES6使用let和const替代var声明变量，新的声明方式支持使用大括号表示的块级作用域。

## 1.块级作用域的优点：

1. 不再需要IIFE；
2. 可以使用let来避免循环体内的闭包访问闭包外的变量时产生的问题；
3. 防止重复声明变量：不允许在同一个作用域内用let或const重复声明同名变量。

## 2.let和const

特点：

1. 不会被提升

2. 重复声明会报错

3. 不绑定全局作用域：当在全局作用域中使用 var 声明的时候，会创建一个新的全局变量作为全局对象的属性。，而const和let不会：

   ```JS
   var value = 1;
   console.log(window.value); // 1
   ```

   ```JS
   let value = 1;
   console.log(window.value); // undefined
   ```

4. let和const区别：

   const用于声明常量，其值一旦被设定则不能在修改（不允许修改绑定，但允许修改值。）

## 3.暂时性死区（Temporal Dead Zone, TDZ）

let和const声明的变量不会被提升到作用域顶部，如果在声明之前访问这些变量，会导致报错：

```JS
console.log(typeof value); // Uncaught ReferenceError: value is not defined
let value = 1;
```

这是因为 JavaScript 引擎在扫描代码发现变量声明时，要么**将它们提升到作用域顶部(遇到 var 声明)**，要么**将声明放在 TDZ 中(遇到 let 和 const 声明)**。**访问 TDZ 中的变量会触发运行时错误。只有执行过变量声明语句后，变量才会从 TDZ 中移出，然后方可访问。**

```JS
var value = "global";

// 例子1
(function() {
    console.log(value);

    let value = 'local';
}());

// 例子2
{
    console.log(value);

    const value = 'local';
};
```

两个例子中，结果并不会打印 "global"，而是报错 `Uncaught ReferenceError: value is not defined`，就是因为 TDZ 的缘故。

介绍：

ES6 明确规定，如果区块中存在let和const命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域。凡是在声明之前就使用这些变量，就会报错。
只要块级作用域内存在let命令，它所声明的变量就“绑定”（binding）这个区域，不再受外部的影响。
ES6 规定暂时性死区和let、const语句不出现变量提升，主要是为了减少运行时错误，防止在变量声明前就使用这个变量，从而导致意料之外的行为。
暂时性死区的定义：

在代码块内，使用let命令声明变量之前，该变量都是不可用的。这在语法上，称为“暂时性死区”（temporal dead zone，简称 TDZ）。
暂时性死区的本质：

只要一进入当前作用域，所要使用的变量就已经存在了，但是不可获取，只有等到声明变量的那一行代码出现，才可以获取和使用该变量。
举例说明

```JS
var a = 10;
function b() {
    console.log(a);
    let a = 20;
}
b();  // 报错
console.log(a);
```

这里会报错，因为函数b中有let对a进行一个定义，前面的console.log(a);会出现暂时性死区，所以报错。

```JS
let a = 10;
function b() {
    console.log(a);
    var a = 20;
}
b(); // undefined
console.log(a); // 10
```

因为这里的var会出现一个变量提升，所以这里只是没有定义，显示undefined。

```JS
let a = 10;
function b() {
    console.log(a);
    a = 20;
}
b(); // 10
console.log(a); // 20
```

这里存在一个作用域链的问题，在函数的作用域里面找不到a的声明的时候就会到外面去找，因为函数内部没有使用let使其成为一个封闭的作用域。
注意：

```JS
typeof x; // 报错：ReferenceError
let x;
```

上面代码中，变量x使用let命令声明，所以在声明之前，都属于x的“死区”，只要用到该变量就会报错。因此，typeof运行时就会抛出一个ReferenceError。但实际上，如果一个变量根本没有被声明，使用typeof反而不会报错。而是显示undefined。
所以“暂时性死区”也意味着typeof不再是一个百分之百安全的操作。

## 4.循环中的块级作用域

```JS
var funcs = [];
for (var i = 0; i < 3; i++) {
    funcs[i] = function () {
        console.log(i);
    };
}
funcs[0](); // 3
```

ES5解决方案：

```JS
var funcs = [];
for (var i = 0; i < 3; i++) {
    funcs[i] = (function(i){
        return function() {
            console.log(i);
        }
    }(i))
}
funcs[0](); // 0
```

ES6解决方案：

```JS
var funcs = [];
for (let i = 0; i < 3; i++) {
    funcs[i] = function () {
        console.log(i);
    };
}
funcs[0](); // 0
```

原因：在for循环中使用let和var，底层会使用不同的处理方式：

**在 `for (let i = 0; i < 3; i++)` 中，即圆括号之内建立一个隐藏的作用域，这就可以解释为什么:**

```js
for (let i = 0; i < 3; i++) {
  let i = 'abc';
  console.log(i);
}
// abc
// abc
// abc
```

然后**每次迭代循环时都创建一个新变量，并以之前迭代中同名变量的值将其初始化**。这样对于下面这样一段代码

```JS
var funcs = [];
for (let i = 0; i < 3; i++) {
    funcs[i] = function () {
        console.log(i);
    };
}
funcs[0](); // 0
```

就相当于：

```JS
// 伪代码
(let i = 0) {
    funcs[0] = function() {
        console.log(i)
    };
}

(let i = 1) {
    funcs[1] = function() {
        console.log(i)
    };
}

(let i = 2) {
    funcs[2] = function() {
        console.log(i)
    };
};
```

当执行函数的时候，根据词法作用域就可以找到正确的值，其实你也可以理解为 let 声明模仿了闭包的做法来简化循环过程。

## 5.循环中的let和const

如果我们把 let 改成 const 呢？

```JS
var funcs = [];
for (const i = 0; i < 10; i++) {
    funcs[i] = function () {
        console.log(i);
    };
}
funcs[0](); // Uncaught TypeError: Assignment to constant variable.
```

结果会是报错，因为虽然我们每次都创建了一个新的变量，然而我们却在迭代中尝试修改 const 的值，所以最终会报错。

说完了普通的 for 循环，我们还有 for in 循环呢~

那下面的结果是什么呢？

```JS
var funcs = [], object = {a: 1, b: 1, c: 1};
for (var key in object) {
    funcs.push(function(){
        console.log(key)
    });
}

funcs[0]()
```

结果是 'c';

那如果把 var 改成 let 或者 const 呢？

使用 let，结果自然会是 'a'，const 呢？ 报错还是 'a'?

结果是正确打印 'a'，这是因为在 for in 循环中，每次迭代不会修改已有的绑定，而是会创建一个新的绑定。

## 6.ES6与Babel

在 Babel 中是如何编译 let 和 const 的呢？我们来看看编译后的代码：

```JS
let value = 1;
```

编译为:

```JS
var value = 1;
```

我们可以看到 Babel 直接将 let 编译成了 var，如果是这样的话，那么我们来写个例子：

```JS
if (false) {
    let value = 1;
}
console.log(value); // Uncaught ReferenceError: value is not defined
```

如果还是直接编译成 var，打印的结果肯定是 undefined，然而 Babel 很聪明，它编译成了：

```JS
if (false) {
    var _value = 1;
}
console.log(value);
```

我们再写个直观的例子：

```JS
let value = 1;
{
    let value = 2;
}
value = 3;
var value = 1;
{
    var _value = 2;
}
value = 3;
```

**本质是一样的，就是改变量名，使内外层的变量名称不一样。**

那像 const 的修改值时报错，以及重复声明报错怎么实现的呢？

其实就是在编译的时候直接给你报错……

那循环中的 let 声明呢？

```JS
var funcs = [];
for (let i = 0; i < 10; i++) {
    funcs[i] = function () {
        console.log(i);
    };
}
funcs[0](); // 0
```

Babel 巧妙的编译成了：

```JS
var funcs = [];

var _loop = function _loop(i) {
    funcs[i] = function () {
        console.log(i);
    };
};

for (var i = 0; i < 10; i++) {
    _loop(i);
}
funcs[0](); // 0
```

## 最佳实践

在我们开发的时候，可能认为应该默认使用 let 而不是 var ，这种情况下，对于需要写保护的变量要使用 const。然而另一种做法日益普及：默认使用 const，只有当确实需要改变变量的值的时候才使用 let。这是因为大部分的变量的值在初始化后不应再改变，而预料之外的变量之的改变是很多 bug 的源头。













