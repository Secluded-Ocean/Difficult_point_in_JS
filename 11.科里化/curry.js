function curry(fn, args) {
  let length = fn.length // 记录fn形参的个数
  args = args || [] // 若没有args，初始化args为空数组
  return function () {
    let subArgs = args.slice(0) // 浅复制args
    for (let i = 0; i < arguments.length; i++) {
      subArgs.push(arguments[i])
    }
    if (subArgs.length >= length) {
      return fn.apply(this, subArgs)
    } else {
      return curry.call(this, fn, subArgs)
    }
  }
}
