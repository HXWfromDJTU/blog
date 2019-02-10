## 类型转换  

在if判断中，引擎期望的是一个Boolean值，所以会在内部使用 Boolean去进行转换  

在 == 双等号比较的时候，引擎期期待等号双方都是一个数值，所以会使用 Number去转换  

但是 null 与 undefined 在进行比较的时候，并不会进行任何的类型转换。     


基本类型在进行各种方法的操作时，都会先进行装箱操作。比如String(),Number() 
引用类型在读取值得时候，都会先进行valueOf和toString

![](/blog_assets/toPrimitive.png)