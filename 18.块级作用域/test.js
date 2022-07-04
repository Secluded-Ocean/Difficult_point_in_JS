var funcs = []
for (var i = 0; i < 3; i++) {
  funcs[i] = (function (i) {
    return function () {
      console.log(i)
    }
  })(i)
}
funcs[0]() // 3
