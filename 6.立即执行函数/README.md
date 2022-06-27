# 立即执行函数表达式（IIFE）

在JavaScript里，每个函数，当被调用时，都会创建一个新的执行上下文。因为在函数里定义的变量和函数只能在函数内部被访问，外部无法获取；当调用函数时，函数提供的上下文就提供了一个非常简单的方法创建私有变量。

```javascript
//因为这个函数的返回值是另一个能访问私有变量i的函数，因此返回的函数实际上被提权(privileged)了
function makeCounter() {
    //i只能从`makeConuter`内部访问
    var i = 0;
    return function(){
        console.log(++i);
    };   
}
//记住：`counter`和`counter2`都有他们自己作用域中的变量 `i`
var counter = makeCounter();
counter();//1
counter();//2

var counter2 = makeCounter();
counter2();//1
counter2();//2

i;//ReferenceError: i is not defined(它只存在于makeCounter里)
```

定义一个函数后，调用时都需要在后面加圆括号()

```javascript
//向下面这样定义的函数可以通过在函数名后加一对括号进行调用
//比如：foo()
//foo相对于函数表达式`function(){/* code */}`只是一个引用变量

var foo = function(){/* code */}
//那这可以说明函数表达式可以通过在其后加上一对括号自己调用自己吗？
function(){ /* code */}();//错误：SyntaxError: Unexpected token (
```

当圆括号为了调用函数而出现在函数后面时，无论在全局环境或者局部环境遇到function关键字，它都会默认把function当作是一个函数声明，而非函数表达式。如果不明确的告诉圆括号它是一个表达式，它会将其当作没有名字的函数声明并且抛出一个错误，因为函数声明需要一个名字。

思考1：能不能直接这样调用函数呢：

```javascript
var foo = function(){console.log(1)}() // 1
```

思考2：像上述的函数声明在后面加上圆括号直接被调用，又会怎么样呢？


如果你为一个函数指定一个名字并在它后面放一对圆括号，同样也会抛出错误。因为圆括号只能放在**函数表达式**后面来调用函数，如果圆括号放在一个**函数声明**后面会导致圆括号和前面的函数声明完全分开，此时圆括号只代表一个简单的括号（用来控制运算顺序的括号）

```javascript
//然而函数声明语法上是无效的，它仍然是一个声明，紧跟着的圆括号是无效的，因为圆括号里需要包含表达式
function foo(){ /* code */ }();//SyntaxError: Unexpected token
//现在，你把一个表达式放在圆括号里，没有抛出错误...但是函数也并没有执行，因为：
function foo(){/* code */}(1)
//它等同于如下，一个函数声明跟着一个完全没有关系的表达式:
function foo(){/* code */}
(1);
```

### IIFE

修正语法错误的方法：将函数声明包裹在圆括号里来告诉语法分析器去表达一个函数表达式，因为在JS中圆括号不能包含声明。

```javascript
//这两种模式都可以被用来立即调用一个函数表达式，利用函数的执行来创造私有变量
(function(){/* code */}());
(function(){/* code */})();

// 括号的作用:消除函数表达式和函数声明之间的差异
// 如果解释器能预料到这是一个表达式，括号可以被省略，比如：
var i = function(){return 10;}();
true && function(){/*code*/}();
0,function(){}();

//如果你并不关心返回值，或者让你的代码尽可能的易读，你可以通过在你的函数前面带上一个一元操作符来存储字节
!function(){/* code */}();
~function(){/* code */}();
-function(){/* code */}();
+function(){/* code */}();

// 这里是另外一种方法
// 我（原文作者）不清楚new方法是否会影响性能
// 但它却是奏效，参见http://twitter.com/kuvos/status/18209252090847232

new function(){ /* code */ }
new function(){ /* code */ }() // 只有当传入参数时才需要加括号
```

### IIFE与闭包（详细分析参见闭包篇）

```javascript
var data = [];

for (var i = 0; i < 3; i++) {
  data[i] = (function (i) {
        return function(){
            console.log(i);
        }
  })(i);
}

data[0]();
data[1]();
data[2]();

```

### 模块模式

```javascript
var counter = (function(){
    var i = 0;
    return {
        get: function(){
            return i;
        },
        set: function(val){
            i = val;
        },
        increment: function(){
            return ++i;
        }
    }
    }());
    counter.get();//0
    counter.set(3);
    counter.increment();//4
    counter.increment();//5

    conuter.i;//undefined (`i` is not a property of the returned object)
    i;//ReferenceError: i is not defined (it only exists inside the closure)
```

模块模式方法不仅相当的厉害而且简单。非常少的代码，你可以有效的利用与方法和属性相关的命名，在一个对象里，组织全部的模块代码即最小化了全局变量的污染也创造了私人变量。


## 红宝书是这么说IIFE的！

ECMAScript5.1及以前，为了防止变量定义外泄，IIFE是个非常有效的方式，这样也不会导致闭包相关的内存问题，因为不存在对这个匿名函数的引用，为此，只要函数执行完毕，其作用域链就可以被销毁。

在ECMAScrpit6以后，IIFE就没那么必要了，因为块级作用域中的变量无须IIFE就可以实现同样的隔离。
