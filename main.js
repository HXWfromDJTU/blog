let foo = function () {
    console.log(1)
}
    (function foo() {
        foo = 10
        console.log(foo)
    }())

console.log(foo)