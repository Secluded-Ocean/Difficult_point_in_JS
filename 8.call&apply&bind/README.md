# call

功能

> call() 方法在使用一个指定的 this 值和若干个指定的参数值的前提下调用某个函数或方法。

例子

```js
var foo = {
    value: 1
};

function bar() {
    console.log(this.value);
}

bar.call(foo); // 1
```

注意：call改变了this指向，且bar函数执行了。

## 模拟实现

假设call调用时，把foo对象改为：

```js
var foo = {
    value: 1,
    bar: function() {
        console.log(this.value)
    }
};

foo.bar(); // 1
```

此时this就指向了foo，但是这样会给foo对象本身添加一个属性；

所以我们还要delete这个属性。

综上，我们模拟问题的步骤为：

1. 将函数设为对象的属性
2. 执行该函数
3. 删除该函数

改写上面的例子：

```js
// 第一步
foo.fn = bar
// 第二步
foo.fn()
// 第三步
delete foo.fn
```

fn 是对象的属性名，反正最后也要删除它，所以起成什么都无所谓。

根据这个思路，我们可以尝试着去写第一版的 **call2** 函数：

```js
// 第一版
Function.prototype.call2 = function(context) {
  
    context.fn = this;	// 用this可以获取调用call的函数，把这个函数变为传入call2函数的对象的属性
    context.fn();
    delete context.fn;
}

// 测试一下
var foo = {
    value: 1
};

function bar() {
    console.log(this.value);
}

bar.call2(foo); // 1
```

然而，call函数还能给定参数来执行函数，比如：

```js
var foo = {
    value: 1
};

function bar(name, age) {
    console.log(name)
    console.log(age)
    console.log(this.value);
}

bar.call(foo, 'kevin', 18);
// kevin
// 18
// 1

```

然而传入的参数并不确定，因此我们可以从 Arguments 对象中取值，取出第二个到最后一个参数，然后放到一个数组里。

比如这样：

```js
// 以上个例子为例，此时的arguments为：
// arguments = {
//      0: foo,
//      1: 'kevin',
//      2: 18,
//      length: 3
// }
// 因为arguments是类数组对象，所以可以用for循环
var args = [];
for(var i = 1, len = arguments.length; i < len; i++) {
    args.push('arguments[' + i + ']');
}

// 执行后 args为 ["arguments[1]", "arguments[2]", "arguments[3]"]
```

不定长的参数问题解决了，我们接着要把这个参数数组放到要执行的函数的参数里面去。

也许有人想到用 ES6 的方法，不过 call 是 ES3 的方法，我们为了模拟实现一个 ES3 的方法，要用到ES6的方法，好像……，嗯，也可以啦。但是我们这次用 eval 方法拼成一个函数，类似于这样：

```js
eval('context.fn(' + args +')')	 // 这里args会自动调用Array.toString() 这个方法。
// 转化后的结果是eval('context.fn(arguments[1], arguments[2], arguments[3]])')
```

综上，第二版代码如下：

```js
// 第二版
Function.prototype.call2 = function(context) {
    context.fn = this;
    var args = [];
    for(var i = 1, len = arguments.length; i < len; i++) {
        args.push('arguments[' + i + ']');
    }
    eval('context.fn(' + args +')');
    delete context.fn;
}

// 测试一下
var foo = {
    value: 1
};

function bar(name, age) {
    console.log(name)
    console.log(age)
    console.log(this.value);
}

bar.call2(foo, 'kevin', 18); 
// kevin
// 18
// 1
```

此时，还有两个小点要注意：

**1.this 参数可以传 null，当为 null 的时候，视为指向 window**

**2.函数是可以有返回值的！**

## 最终版call

改写最后一版的代码：

```js
// 第三版
Function.prototype.call2 = function (context) {
    var context = context || window;	// 如果传入的第一个参数为null，则将上下文绑定为window
    context.fn = this;			// this为调用call方法的函数，将这个函数变为上下文的一个属性值

    var args = [];			// 解决传参问题
    for(var i = 1, len = arguments.length; i < len; i++) {	// 从第二个参数开始统计（第一个为要绑定的this）
        args.push('arguments[' + i + ']');
    }
    var result = eval('context.fn(' + args +')');

    delete context.fn			// 删除.fn属性
    return result;			// 返回执行结果
}
```

```js
// 测试一下
var value = 2;

var obj = {
    value: 1
}

function bar(name, age) {
    console.log(this.value);
    return {
        value: this.value,
        name: name,
        age: age
    }
}

bar.call2(null); // 2

console.log(bar.call2(obj, 'kevin', 18));
// 1
// Object {
//    value: 1,
//    name: 'kevin',
//    age: 18
// }
```

到此，我们完成了 call 的模拟实现！

# apply模拟实现

```js
Function.prototype.apply = function (context, arr) {
    var context = Object(context) || window;
    context.fn = this;

    var result;
    if (!arr) {
        result = context.fn();
    }
    else {
        var args = [];
        for (var i = 0, len = arr.length; i < len; i++) {
            args.push('arr[' + i + ']');
        }
        result = eval('context.fn(' + args + ')')
    }

    delete context.fn
    return result;
}
```

# bind

## 功能

> `bind()`方法创建一个新的函数，在 `bind()` 被调用时，这个新函数的 `this` 被指定为 `bind()` 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。(来自于 MDN )

例子

```javascript
var foo = {
    value: 1
};

function bar() {
    console.log(this.value);
}

// 返回了一个函数
var bindFoo = bar.bind(foo); 

bindFoo(); // 1
```

## 模拟实现

```js
// 第一版
Function.prototype.bind2 = function (context) {    // context是传入bind2的参数，相当于需要给新函数绑定的this
    var functionNeedToBind = this;
    return function () {
        return functionNeedToBind.apply(context);  // bind的返回值一个原函数的拷贝，并拥有指定的 this 值和初始参数（第一版没有实现往函数里传参）。
    }
}
```

传入参数的模拟实现

原生bind的例子：

```js
var foo = {
    value: 1
};

function bar(name, age) {
    console.log(this.value);
    console.log(name);
    console.log(age);

}

// bind函数可以实现分别传参：
var bindFoo = bar.bind(foo, 'daisy');	// foo是给bar函数绑定的this对象，'daisy'是给bar函数传入的第一个参数（即形参name）
bindFoo('18');		// 上一行的bind已经传入了一个参数'daisy'作为形参name，此处再传入'18'作为形参age
// 1
// daisy
// 18
```

为了实现bind传参，改进第二版bind：

```js
// 第二版
Function.prototype.bind2 = function (context) {	// context是传入bind2的参数，相当于需要给新函数绑定的this

    var functionNeedToBind = this;
    // 获取bind2函数从第二个参数到最后一个参数,arguments是类数组对象，没有slice方法，需要用call
    var args = Array.prototype.slice.call(arguments, 1);

    return function () {
        // 这个时候的arguments是指bind返回的函数传入的参数
        var bindArgs = Array.prototype.slice.call(arguments);
        return functionNeedToBind.apply(context, args.concat(bindArgs));
    }

}
```

除此之外，bind还有一个特点：（最难的部分）

> 一个绑定函数也能使用new操作符创建对象：这种行为就像把原函数当成构造器。提供的 this 值被忽略，同时调用时的参数被提供给模拟函数。

也就是说**当 bind 返回的函数作为构造函数的时候，bind 时指定的 this 值会失效，但传入的参数依然生效**。举个例子：

```js
var value = 2;

var foo = {
    value: 1
};

function bar(name, age) {
    this.habit = 'shopping';
    console.log(this.value);
    console.log(name);
    console.log(age);
}

bar.prototype.friend = 'kevin';

var bindFoo = bar.bind(foo, 'daisy');

var obj = new bindFoo('18');
// undefined           因为bind时指定的this失效了
// daisy	       但bind时传入的参数依然生效
// 18		       调用新函数时传入的第二个形参age
console.log(obj.habit);
console.log(obj.friend);
// shopping
// kevin
```

注意：尽管在全局和 foo 中都声明了 value 值，最后依然返回了 undefind，说明绑定的 this 失效了，了解 new 的模拟实现之后，就会知道这个时候的 this 已经指向了 obj。

所以我们可以通过修改返回的函数的原型来实现，让我们写一下：

```js
// 第三版
Function.prototype.bind2 = function (context) {
    var functionNeedToBind = this;
    var args = Array.prototype.slice.call(arguments, 1);

    var fBound = function () {
        var bindArgs = Array.prototype.slice.call(arguments);
        // 当fBound作为构造函数时，this 指向实例，此时结果为 true，将绑定函数的 this 指向该实例，可以让实例获得来自绑定函数的值
        // 当作为普通函数时，this 指向 window，此时结果为 false，将绑定函数的 this 指向 context
        return functionNeedToBind.apply(this instanceof fBound ? this : context, args.concat(bindArgs));
    }
    // 修改返回函数的 prototype 为绑定函数的 prototype，实例就可以继承绑定函数的原型中的值
    fBound.prototype = this.prototype;	  // 此处this指的是bind的调用者
    return fBound;
}
```

但是在这个写法中，我们直接将 fBound.prototype = this.prototype，我们直接修改 fBound.prototype 的时候，也会直接修改绑定函数的 prototype。这个时候，我们可以通过一个空函数来进行中转：

## 最终版bind

```js
// 第四版
Function.prototype.bind2 = function (context) {

    // 加个判断，如果调用bind的不是函数，则抛出错误
    if (typeof this !== "function") {
      throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var functionNeedToBind = this;
    var args = Array.prototype.slice.call(arguments, 1);

    var fNOP = function () {};

    var fBound = function () {
        var bindArgs = Array.prototype.slice.call(arguments);
        return functionNeedToBind.apply(this instanceof fNOP ? this : context, args.concat(bindArgs));
    }

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
    // 上面这两步其实是在进行原型式继承
    return fBound;
}
```
