// 封装 reponse对象
let response = {
    get body() {                     // 接受对body的委托      
        return this._body;
    },
    set body(val) {                  // 实现给body赋值，就默认状态码为200 
        this.status = 200;
        this._body = val;
    },
    get status() {
        return this.res.statusCode;    // 接受委托，从原生的res对象上读取出状态码     
    },
    set status(val) {
        this.res.statusCode = val;     // 接受委托,对原生的res对象的状态码进行修改          
    }
};



module.exports = response;