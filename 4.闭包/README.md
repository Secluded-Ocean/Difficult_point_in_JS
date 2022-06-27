# 闭包！

## 定义

MDN定义：闭包是指那些能够访问自由变量的函数。(自由变量：在函数中使用的，但**既不是函数参数**也**不是函数的局部变量**的变量)

**《你不知道的Javascript上卷》:当函数可以记住并访问所在的词法作用域，即使函数是在当前词法作用域之外执行，这就产生了闭包。**

实践上的闭包：

1. 即使创建它的上下文**已经销毁**，它仍然存在（比如，内部函数从父函数中返回）
2. 代码中引用了自由变量

例子：

```javascript
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f;
}

var foo = checkscope();	   
foo();		//f的执行上下文维护了一个作用域链：Scope: [AO, checkscopeContext.AO, globalContext.VO]
```

上面代码中，函数f1的返回值就是函数f2，由于f2可以读取f1的内部变量，所以就可以在外部获得f1的内部变量了。

这里直接给出简要的执行过程：

1. 进入全局代码，创建全局执行上下文，全局执行上下文压入执行上下文栈
2. 全局执行上下文初始化
3. 执行 checkscope 函数，创建 checkscope 函数执行上下文，checkscope 执行上下文被压入执行上下文栈
4. checkscope 执行上下文初始化，创建变量对象、作用域链、this等
5. checkscope 函数执行完毕，checkscope 执行上下文从执行上下文栈中弹出
6. 执行 f 函数，创建 f 函数执行上下文，f 执行上下文被压入执行上下文栈
7. f 执行上下文初始化，创建变量对象、作用域链、this等
8. f 函数执行完毕，f 函数上下文从执行上下文栈中弹出

在这个执行过程中，f 执行上下文维护了一个作用域链：

```javascript
fContext = {
    Scope: [AO, checkscopeContext.AO, globalContext.VO],
}
```

f 函数依然可以读取到 checkscopeContext.AO 的值，说明当 f 函数引用了 checkscopeContext.AO 中的值的时候，即使 checkscopeContext 被销毁了，但是 JavaScript 依然会让 checkscopeContext.AO 活在内存中，f 函数依然可以通过 f 函数的作用域链找到它，正是因为 JavaScript 做到了这一点，从而实现了闭包这个概念。


## 闭包的特性

例题：

```javascript
//例题1
var inner;
function outer(){
    var a = 250;
    inner = function(){
        alert(a);//这个函数虽然在外面执行，但能够记忆住定义时的那个作用域，a是250
    }
}
outer();
var a=300;
inner();//一个函数在执行的时候，找闭包里面的变量，不会理会当前作用域。
```

输出250

```javascript
//例题2
function outer(x){
  function inner(y){
  console.log(x+y);
  }
return inner;
}
var inn=outer(3);//数字3传入outer函数后，inner函数中x便会记住这个值
inn(5);//当inner函数再传入5的时候，只会对y赋值，所以最后弹出8
```


## 闭包的内存泄漏

一般情况下，函数执行会形成一个新的私有的作用域，当私有作用域中的代码执行完成后，我们当前作用域都会主动的进行释放和销毁。但**当遇到函数执行返回了一个引用数据类型的值，并且在函数的外面被一个其他的东西给接收了，这种情况下一般形成的私有作用域都不会销毁**。

比如：

```javascript
function fn(){
var num=100;
return function(){
  }
}
var f=fn();//fn执行形成的这个私有的作用域就不能再销毁了
```

也就是像上面这段代码，fn函数内部的私有作用域会被一直占用的，发生了内存泄漏。 所谓内存泄漏指任何对象在您不再拥有或需要它之后仍然存在。闭包不能滥用，否则会导致内存泄露，影响网页的性能。闭包使用完了后，要立即释放资源，将引用变量指向null。

面试题：

```javascript
function outer() {
  var num = 0 //内部变量
  return function add() {
    //通过return返回add函数，就可以在outer函数外访问了
    num++ //内部函数有引用，作为add函数的一部分了
    console.log(num)
  }
}
var func1 = outer()
func1() //实际上是调用add函数， 输出1
func1() //输出2 因为outer函数内部的私有作用域会一直被占用
var func2 = outer()
func2() // 输出1  每次重新引用函数的时候，闭包是全新的。
func2() // 输出2
```


## 闭包运用

1. 读取函数内部变量
2. 使变量的值长期保存在内存中，延长变量的生命周期（因此不能滥用）
3. 实现JS模块

例1：实现JS模块

在html文件中引入闭包写的模块：

```html
//index.html文件
<script type="text/javascript" src="myModule.js"></script>
<script type="text/javascript">
  myModule2.doSomething()
  myModule2.doOtherthing()
</script>
```

```javascript
//myModule.js文件
(function () {
  var msg = 'Beijing'//私有数据
  //操作数据的函数
  function doSomething() {
    console.log('doSomething() '+msg.toUpperCase())
  }
  function doOtherthing () {
    console.log('doOtherthing() '+msg.toLowerCase())
  }
  //向外暴露对象(给外部使用的两个方法)
  window.myModule2 = {
    doSomething: doSomething,
    doOtherthing: doOtherthing
  }
})()
```


例2：实现这样的一个需求: 点击某个按钮, 提示"点击的是第n个按钮"

```javascript
   for (var i = 0; i < btns.length; i++) {
      (function (j) {
        btns[j].onclick = function () {
          console.log('第' + (j + 1) + '个')
        }
      })(i)
    }
```


例3：(与例2相似)

```javascript
var data = [];

for (var i = 0; i < 3; i++) {
  data[i] = function () {
    console.log(i);
  };
}

data[0]();
data[1]();
data[2]();
```

运行分析：

当执行到 data[0] 函数之前，此时全局上下文的 VO 为：

```javascript
globalContext = {
    VO: {
        data: [...],
        i: 3
    }
}
```

当执行 data[0] 函数的时候，data[0] 函数的作用域链为：

```javascript
data[0]Context = {
    Scope: [AO, globalContext.VO]
}
```

data[0]Context 的 AO 并没有 i 值，所以会从 globalContext.VO 中查找，i 为 3，所以打印的结果就是 3。

data[1] 和 data[2] 是一样的道理。

改为闭包：

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

当执行 data[0] 函数的时候，data[0] 函数的作用域链发生了改变：

```javascript
data[0]Context = {
    Scope: [AO, 匿名函数Context.AO globalContext.VO]
}
```

匿名函数执行上下文的AO为：

```javascript
匿名函数Context = {
    AO: {
        arguments: {
            0: 0,
            length: 1
        },
        i: 0
    }
}
```

data[0]Context 的 AO 并没有 i 值，所以会沿着作用域链从匿名函数 Context.AO 中查找，这时候就会找 i 为 0，找到了就不会往 globalContext.VO 中查找了，即使 globalContext.VO 也有 i 的值(值为3)，所以打印的结果就是0。

data[1] 和 data[2] 是一样的道理。
