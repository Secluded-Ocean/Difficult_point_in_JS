# Symbol

## 一、是什么？

Symbol是ES6新增的基本数据类型——符号，具有唯一性，不可变性。因此能确保对象属性的唯一性，不会发生冲突；

Symbol和其他基本类型：null、undefined、boolean、number、string的不同之处在于，symbol没有对应的包装类和new一起使用：

```js
let s = new Symbol() 
// Uncaught TypeError: Symbol is not a constructor
```

## 二、基本用法

创建：

```JS
let s = Symbol()
let name = Symbol('name') // 传入字符串作为符号的描述，主要用于调试代码
```

比较：

```JS
let s1 = Symbol()
let s2 = Symbol()

s1 == s2 // false

let s3 = Symbol('name')
let s4 = Symbol('name')

s3 == s4 // false
```

之前对象的属性只能是字符串类型，现在可以是 Symbol 的实例：

```JS
let name = Symbol('name')
let o = {
    [name]:'zhangsan'
}

// or 

let name = Symbol('name')
let o = {}
o[name] = 'zhangsan'
```

Symbol相对于字符串类型的优点就是唯一性，不会覆盖已有的属性：比如想对第三方的一个对象 people 添加属性时，如果使用字符串作为属性很有可能会覆盖原有的属性，而使用 Symbol 就算属性名相同也不会：

```JS
let id = Symbol("id");

people[id] = "新增值";
```

### 全局符号注册表：

Symbol 每次创建都是唯一的，那如何复用呢？Symbol.for 就解决了共享和重用问题。

```JS
let name = Symbol.for('name') // 第一次时全局注册表不存在则创建并添加到注册表中。

let otherName = Symbol.for('name') // 后续使用相同字符串，先检索全局注册表有就返回，反之创建。

name == otherName // true
```

我们可以通过 Symbol.keyFor 来反查字符串键：

```JS
let name = Symbol.for('name')
Symbol.keyFor(name) // 'name'
```

使用普通符号：

```JS
let name = Symbol('name')
Symbol.keyFor(name) // undefined
```

### 对象属性遍历

for...in 会忽略 Symbol：

```JS
let id = Symbol("id");
let user = {
  name: "John",
  age: 30,
  [id]: 123
};

for (let key in user) alert(key); // name, age (no symbols)
Object.keys(usr) // ['name','age']
Object.getOwnPropertyNames(user) // ['name','age']
Object.getOwnPropertySymbols(user) // [Symbol(id)]


let clone = Object.assign({}, user);
clone[id] // 123
```

1
