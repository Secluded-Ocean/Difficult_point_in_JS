# 定义

1. [柯里化（Currying）](https://en.wikipedia.org/wiki/Currying)是一种关于函数的高阶技术。它不仅被用于 JavaScript，还被用于其他编程语言。
2. 柯里化是一种函数的转换，它是指将一个函数从可调用的 `f(a, b, c)` 转换为可调用的 `f(a)(b)(c)`。
3. 柯里化不会调用函数。它只是对函数进行转换。

例子：

```js
function add(a, b) {
    return a + b;
}

// 执行 add 函数，一次传入两个参数即可
add(1, 2) // 3

// 假设有一个 curry 函数可以做到柯里化
var addCurry = curry(add);
addCurry(1)(2) // 3
```

# 用途

```js
// 小例子
function ajax(type, url, data) {
    var xhr = new XMLHttpRequest();
    xhr.open(type, url, true);
    xhr.send(data);
}

// 虽然 ajax 这个函数非常通用，但在重复调用的时候参数冗余
ajax('POST', 'www.test.com', "name=kevin")
ajax('POST', 'www.test2.com', "name=kevin")
ajax('POST', 'www.test3.com', "name=kevin")

// 利用 curry
var ajaxCurry = curry(ajax);

// 以 POST 类型请求数据
var post = ajaxCurry('POST');
post('www.test.com', "name=kevin");

// 以 POST 类型请求来自于 www.test.com 的数据
var postFromTest = post('www.test.com');
postFromTest("name=kevin");
```

curry 的这种用途可以理解为：参数复用。本质上是降低通用性，提高适用性。

可是即便如此，是不是依然感觉没什么用呢？

如果我们仅仅是把参数一个一个传进去，意义可能不大，但是如果我们是把柯里化后的函数传给其他函数比如 map 呢？

例子：

```js
var person = [{name: 'kevin'}, {name: 'daisy'}]
```

如果我们要获取所有的 name 值，我们可以这样做：

```js
var name = person.map(function (item) {
    return item.name;
})
```

不过如果我们有 curry 函数：

```js
var prop = curry(function (key, obj) {
    return obj[key]
});

var name = person.map(prop('name'))
```

我们为了获取 name 属性还要再编写一个 prop 函数，是不是又麻烦了些？

但是要注意，prop 函数编写一次后，以后可以多次使用，实际上代码从原本的三行精简成了一行，而且你看代码是不是更加易懂了？

`person.map(prop('name'))` 就好像直白的告诉你：person 对象遍历(map)获取(prop) name 属性。

是不是感觉有点意思了呢？


# 最终版

直接上最终版吧！

```js
function curry(fn, args) {    //args形参用来保存之前传入的参数，初始化时为空数组
  // 获取函数需要的参数长度
  let length = fn.length;

  args = args || [];	// 第一次调用curry时，不传入args形参，此时args形参被初始化为一个空数组

  return function() {
    let subArgs = args.slice(0);   // 由于第一次args形参初始化为一个空数组，所以这里可以用slice，这一步相当于浅复制了args

    // 拼接得到现有的所有参数
    for (let i = 0; i < arguments.length; i++) {
      subArgs.push(arguments[i]);
    }

    // 判断参数的长度是否已经满足函数所需参数的长度
    if (subArgs.length >= length) {
      // 如果满足，执行函数
      return fn.apply(this, subArgs);	// 下一个函数的this要继承当前函数的this
    } else {
      // 如果不满足，递归返回科里化的函数，等待参数的传入
      return curry.call(this, fn, subArgs);
    }
  };
}
```

es6实现：

```js
// es6 实现
function curry(fn, ...args) {
  return args.length >= fn.length ? fn(...args) : curry.bind(null, fn, ...args);
}
```

测试：

```js
var fn = curry(function(a, b, c) {
    console.log([a, b, c]);
});

fn("a", "b", "c") // ["a", "b", "c"]
fn("a", "b")("c") // ["a", "b", "c"]
fn("a")("b")("c") // ["a", "b", "c"]
fn("a")("b", "c") // ["a", "b", "c"]
```
