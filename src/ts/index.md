# type utility

 Partial<T> 全部可选
 Readonly<T> 全部只读
 ##### Record<K,T>
 > Constructs a type with a set of properties K of type T. This utility can be used to map the properties of a type to another type.
 在前者所有属性上添加后者作为子属性。
 
 ##### Pick<T,K>
 > Constructs a type by picking the set of properties K from T
 从后者中取出前者有的key，相当于取交集
 
 
当你指定了--strictNullChecks标记，null和undefined只能赋值给void和它们各自。 这能避免 很多常见的问题。


Never: 抛出错误、返回错误，死循环
