class Person {
    @nonenumerable
    get kidCount() { return this.children.length; }
  }
  
  function nonenumerable(target, name, descriptor) {
    descriptor.enumerable = false;
    return descriptor;
  }