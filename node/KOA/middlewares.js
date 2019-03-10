let readfile = function () {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log(4)
            resolve('xxx')
        }, 3000);
    })

}
let action1 = async (ctx, next) => {
    ctx.state = {
        title: 'koa2 title'
    };
}


let action2 = async (ctx, next) => {
    console.log(3)
    let result = await readfile();
}

let action3 = (ctx, next) => {
    console.log(5)
    ctx.body = "Hello World!"
}


module.exports = {
    action1,
    action2,
    action3
}