---
title: Design Patterns In Javascript
date: '2019-09-03'
spoiler: 总结常用设计模式在 Javascript 中的实现
---

[[TOC]]

> 设计模式：在面向对象软件设计过程中针对特定问题的简洁而优雅的解决方案。

设计模式这个术语是上个世纪 90 年代由 Erich Gamma、Richard Helm、Raplh Johnson 和 Jonhn Vlissides 四个人总结提炼出来的，并且写了一本叫 [《Design Patterns》](https://book.douban.com/subject/1052241/){target=\_blank} 的书。这四人也被称为四人帮（GoF）。

为什么要使用设计模式？根本原因还是软件开发要实现可维护、可扩展，就必须尽量复用代码，并且降低代码的耦合度。

在 JavaScript 这种类型模糊的语言中，对象多态性是天生的，一个变量既可以指向一个类，又可以随时指向另一个类，并且可以将函数作为参数随意传递，所以在 JavaScript 里很多设计模式的实现与传统的静态类型语言不尽相同。

## 单例模式

> 保证一个类仅有一个实例，并提供一个访问它的全局访问点。

单例模式（Singleton）的目的很简单，就是为了保证某个「类」在全局范围内有且仅有一个实例。在 JavaScript 开发中，单例模式用途也非常广泛，比如用户界面中的登录浮窗、全局的状态管理实例等。

单例模式在 JavaScript 中的实现方式很简单：

1. 通过静态属性`instance`变量持有唯一属性，保证全局唯一性；
2. 通过静态方法`getInstance`返回这个唯一实例，使外部调用方法能获取到实例；
3. 限制构造函数的返回结果，以保证使用`new SomeClass`方式时仍能返回唯一实例。

```js
class Singleton {
  static instance = null; // 记录单实例
  // 返回已存在的实例，否则创建一个实例
  static getInstance(name) {
    return Singleton.instance || new Singleton(name);
  }
  constructor(name) {
    this.name = name;
    return Singleton.instance || (Singleton.instance = this);
  }
  showName() {
    return this.name;
  }
}

const s1 = Singleton.getInstance('s1');
const s2 = Singleton.getInstance('s2');

console.log(s1 === s2); // true
```

仔细观察上面的代码不难发现，单例限制部分其实与构造函数本身要实现的行为没有太大的关联，因此可以将单例限制的部分抽取出来作为公共的单例化函数。此函数接收一个构造函数，返回一个经过包装后的**单例化构造函数**，实现如下。

```js
function getSingleton(ctor) {
  return class Singleton extends ctor {
    static instance = null; // 记录单实例
    // 返回已存在的实例，否则创建一个实例
    static getInstance(...args) {
      return Singleton.instance || new Singleton(...args);
    }
    constructor(...args) {
      super(...args);
      return Singleton.instance || (Singleton.instance = this);
    }
  };
}

class SomeClass {
  constructor(name) {
    this.name = name;
  }
}

const SingleSomeClass = getSingleton(SomeClass);

const s1 = SingleSomeClass.getInstance('s1');
const s2 = SingleSomeClass.getInstance('s2');

console.log(s1 === s2); // true
```

也可以使用 JavaScript 闭包和高阶函数的特性来达到目的，注意使用此方式时，输入的构造函数只能为**函数声明**形式，因为`class`只能用`new SomeClass`的方式进行实例化。

```js
function getSingleton(ctor) {
  function Singleton(...args) {
    if (Singleton.instance) return Singleton.instance;
    ctor.apply(this, args); // 借用构造函数逻辑
    return (Singleton.instance = this);
  }
  Singleton.prototype = Object.create(ctor.prototype); // 维持原型链
  Singleton.instance = null;
  Singleton.getInstance = function(...args) {
    return Singleton.instance || new Singleton(...args);
  };
  return Singleton;
}
```

---

## 策略模式

> 定义一系列的算法，把它们一个个封装起来，并且使它们可相互替换。此模式使得算法和逻辑可独立于使用它的消费者而变化。

策略模式在 JavaScript 应用非常广泛，最常见的就是表单校验，常见的数组的高阶函数 api `Array.prototype.sort`、`Array.prototype.map`等也是其中一种典型的体现。

```js
const arr = [1, 3, 5, 7, 9, 2, 4, 6, 8, 10];

arr.sort((a, b) => a - b); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
arr.sort((a, b) => b - a); // [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
```

通过不同的回调函数，将数组进行正向排序和反向排序，而两个回调函数就是独立的策略。

一个基于策略模式的程序至少由两部分组成：

1. 定义一组策略类，策略类封装了具体的算法，并负责具体的计算过程。
2. 定义一个环境类 Context，Context 接受客户的请求，随后将请求委托给某一个策略类。

策略模式在 JavaScript 中经常用于解决多重条件选择语句带来的强耦合问题。

```js
// 优化前
function func(condition) {
  if (condition === 'A') {
    // do some stuff ...
  } else if (condition === 'B') {
    // do some stuff ...
  } else if (condition === 'C') {
    // do some stuff ...
  } else if (condition === 'D') {
    // do some stuff ...
  }
}

// 优化后
const strategies = {
  A() {
    // do some stuff ...
  },
  B() {
    // do some stuff ...
  },
  C() {
    // do some stuff ...
  },
  D() {
    // do some stuff ...
  },
};

strategies[condition]();
```

##### 模式优点：

- 利用组合、委托和多态等技术和思想，可有效避免多重条件选择语句。
- 提供了对开放-封闭原则的完美支持，将算法封装在独立的 strategy 中，使得策略易于切换，易于理解，易于扩展。
- 算法可复用在其它地方，从而避免了许多重复的复制黏贴工作。
- 利用组合和委托来让 Context 拥有执行算法的能力，相对传统的继承来说更加轻便。

##### 模式缺点：

- 会在程序中增加许多策略类或者策略对象，存在额外开销。
- strategy 需要向消费者暴露所有实现，违反了最少知识原则。

---

## 代理模式

> 为一个对象提供一个代用品或占位符，以便控制对这个对象的访问。

使用代理模式的主要目的是，当客户不方便直接访问一个对象或者不满足需要的时候，提供一个替身对象来控制对这个对象的访问，客户实际上访问的是替身对象。替身对象对请求作出一些处理之后，再把请求转交给本体对象。

```text
客户 ====> 本体 // 不使用代理模式
客户 ====> 代理 ====> 本体 // 使用代理模式
```

代理模式可以理解成，在目标对象之前架设一层「拦截」，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。因为代理对象对客户是透明的，所以代理对象必须实现与本体一致的接口。在最新的 ES6 语法中，已经实现了原生的`Proxy`，直接在“元编程”（meta programming）的层面对本体行为增加拦截。

```js
// 使用get拦截，实现数组读取负数的索引。
const arr = ['a', 'b', 'c'];

function createArray(arr) {
  const handler = {
    get(target, propKey, receiver) {
      const index = Number(propKey);
      if (index < 0) {
        propKey = String(target.length + index);
      }
      return Reflect.get(target, propKey, receiver);
    },
  };

  return new Proxy(arr, handler);
}

let arrProxy = createArray(arr);
arrProxy[-1]; // c
arr[-1]; // undefined
```

---

## 迭代器模式

> 提供一种方法顺序访问一个聚合对象中的各个元素，而又不需要暴露该对象的内部表示。

迭代器模式可以把迭代的过程从业务逻辑中分离出来，在使用迭代器模式后，即使不关心对象的内部构造，也可以按顺序访问其中的每个元素。

迭代器可以分为外部迭代器和内部迭代器。

##### 内部迭代器

内部迭代器的特点是外界跟迭代器的交互仅仅只是一次初始调用。

常见的数组的高阶函数 api `Array.prototype.forEach`、`Array.prototype.map`等就已经很好地实现了迭代器模式。

```js
const arr = [1, 2, 3];

arr.forEach((item, index) => {
  // do some stuff ...
});

// 手动实现内部迭代器
function each(arr, callback) {
  for (let i = 0; i < arr.length; i++) {
    callback(arr[i], i, arr);
  }
}

each(arr, (item, index) => {
  // do some stuff ...
});
```

##### 外部迭代器

外部迭代器的特点是必须显式地请求迭代下一个元素。它的迭代过程一般遵循下面四个步骤：

1. 创建一个指针对象，指向当前数据结构的起始位置。也就是说，迭代器对象本质上，就是一个指针对象。
2. 第一次调用指针对象的 next 方法，可以将指针指向数据结构的第一个成员。
3. 第二次调用指针对象的 next 方法，指针就指向数据结构的第二个成员。
4. 不断调用指针对象的 next 方法，直到它指向数据结构的结束位置。

```js
const it = makeIterator(['hello', 'world', 'ending']);

it.next(); // { value: "hello", done: false }
it.next(); // { value: "world", done: false }
it.next(); // { value: "ending", done: false }
it.next(); // { value: undefined, done: true }

function makeIterator(array) {
  let nextIndex = 0;
  return {
    next: function() {
      return nextIndex < array.length ? { value: array[nextIndex++], done: false } : { value: undefined, done: true };
    },
  };
}
```

ES6 已经对外部迭代器进行了原生实现，它就是`Generator`。

```js
function* itGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}

const it = itGenerator();
it.next(); // { value: 'hello', done: false }
it.next(); // { value: 'world', done: false }
it.next(); // { value: 'ending', done: true }
it.next(); // { value: undefined, done: true }

// 可以很方便地使用 for...of 进行迭代
for (let l of it) {
  console.log(l);
}
// hello world ending
```

---

## 发布订阅模式

> 定义对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖它的对象都将得到通知。

发布-订阅模式（Publish-Subscribe：Pub/Sub），它是一种通知机制，让发送通知的一方（被观察方）和接收通知的一方（观察者）能彼此分离，互不影响。又称为「观察者模式」。

它的特点是：

- 可广泛应用于异步编程中，是一种替代传递回调函数的解决方案。
- 可取代对象之间硬编码的通知机制，一个对象不用再显式地调用另外一个对象的某个接口。

在 JavaScript 开发中，一般使用事件模型来替代传统的发布订阅模式。

```js
let i = 0;
document.body.addEventListener('click', () => {
  i++;
  console.log(`点击了 ${i} 次。`);
});

document.body.click(); // 点击了 1 次。
document.body.click(); // 点击了 2 次。
document.body.click(); // 点击了 3 次。
```

在 JavaScript 中实现一个自定义的发布订阅模式一般需要下面三个步骤：

1. 创建一个发布者；
2. 在发布者内部创建一个缓存列表，用于存放回调函数以便通知订阅者；
3. 在发布者内部创建一个遍历执行器函数，在发布消息（发生了指定的变化）时，依次触发缓存列表内订阅者的回调函数。

```js
const event = {
  clientList: [], // 收集订阅回调
  // 订阅回调
  listen(key, fn) {
    if (!this.clientList[key]) {
      this.clientList[key] = [];
    }
  },
  // 取消订阅
  remove(key, fn) {
    const fns = this.clientList[key];
    if (!fns || fns.length === 0) {
      return false;
    }
    if (!fn) {
      fns && (fns.length = 0);
      return;
    }
    const targetIndex = fns.findIndex(fnI => fnI === fn);
    ~targetIndex && fns.splice(targetIndex, 1);
  },
  // 触发回调
  trigger(...args) {
    const key = args.shift();
    const fns = this.clientList[key];
    if (!fns || fns.length === 0) {
      return false;
    }
    fns.forEach(fn => fn.apply(null, args));
  },
};

// 动态安装发布订阅功能
const installEvent = function(obj) {
  for (let key in event) {
    obj[key] = event[key];
  }
};

// 使用
const source = {};
installEvent(source);

const typeACb = arg => console.log('typeA', arg);
const typeBCb = arg => console.log('typeB', arg);

source.listen('typeA', typeACb);
source.listen('typeB', typeBCb);

source.trigger('typeA', ' is trigger'); // typeA is trigger
source.trigger('typeB', ' is trigger'); // typeB is trigger
source.trigger('typeC', 'may cause error'); // false

source.remove('typeA', typeACb);
source.remove('typeB');
source.trigger('typeA', ' is trigger'); // false
source.trigger('typeB', ' is trigger'); // false
```

Nodes.js 中的 EventEmitter 就是一个经典的发布订阅模式的实现，它实质上是将发布订阅的逻辑抽离出来作为复用的通用函数，使发布者和订阅者呈松散耦合。

```js
class EventBus {
  constructor(evtMap = new Map()) {
    this.evtMap = evtMap;
  }
  // 添加订阅
  on(type, handler) {
    const handlers = this.evtMap.get(type);
    const added = handlers && handlers.push(handler);
    !added && this.evtMap.set(type, [handler]);
  }
  // 取消订阅
  off(type, handler) {
    const handlers = this.evtMap.get(type);
    if (!handlers) return false;
    if (!handler) {
      handlers.length = 0;
      return;
    }
    handlers.splice(handlers.indexOf(handler) >>> 0, 1);
  }
  // 触发回调
  emit(type, evt) {
    (this.evtMap || []).forEach(handler => handler(evt));
  }
}

// 使用
const eventBus = EventBus();

eventBus.on('foo', e => console.log('foo', e)); // 订阅事件
eventBus.emit('foo', { a: 'b' }); // 触发事件
eventBus.evtMap.clear(); // 清除所有订阅

function onFoo() {}
eventBus.on('foo', onFoo); // 订阅
eventBus.off('foo', onFoo); // 取消订阅
```

##### 模式优点

- 时间上进行了解耦。
- 对象之间进行了解耦。

##### 模式缺点

- 需要额外消耗一定的时间和内存。
- 当订阅一个消息后，如果这个消息最后都未发生，这个订阅者却会一直存在于内存当中。

---

## 命令模式

> 将一个请求封装为一个对象，从而使你可用不同的请求对客户进行参数化，对请求排队或记录请求日志，以及支持可撤销的操作。

从代码结构分析命令模式，其实它与策略模式很类似，都定义一系列的算法，把它们一个个封装起来，再根据实际的类型去调用它们。但是从行为分析会发现它们大大不同，命令模式会将所有发出的命令收集到一个命令队列，记录了这些命令的执行类型和顺序，必要时可对指定命令执行撤销操作或者对整个命令队列进行重放等。

下面是一个典型的编辑器例子：

```js
class TextEditor {
  constructor() {}
  copy() {
    console.log('editor copy!');
    // do some stuff...
  }
  paste() {
    console.log('editor paste!');
    // do some stuff...
  }
  delete() {
    console.log('editor delete!');
    // do some stuff...
  }
  insert() {
    console.log('editor insert!');
    // do some stuff...
  }
}

class CommandCollector {
  constructor(commandList = []) {
    this.commandList = commandList;
  }
  add(command) {
    this.commandList.push(command);
  }
  execute() {
    this.commandList.forEach(command => command.execute());
  }
}

function noop() {}

class Command {
  constructor(receiver = {}, commandType) {
    this.receiver = receiver;
    this.callback = receiver[commandType] || noop;
  }
  execute(...args) {
    this.callback(...args);
  }
}

const editor = new TextEditor();
const commandCollector = new CommandCollector();
const commands = ['copy', 'paste', 'delete', 'insert'];

commands.forEach(commandType => {
  const command = new Command(editor, commandType);
  command.execute(); // editor copy!
  // editor paste!
  // editor delete!
  // editor insert!
  commandCollector.add(command);
});

// 重播命令
commandCollector.execute(); // editor copy!
// editor paste!
// editor delete!
// editor insert!
```

---

## 组合模式

> 将对象组合成树形结构以表示「部分-整体」的层次结构，使得用户对单个对象和组合对象的使用具有一致性。

从上面的定义可以知道组合模式的两个特点：

1. **表示树形结构**。组合模式的「组合对象」由「叶对象」组成，形成一种特殊的树形结构，并提供了一种遍历树形结构的方案，通过调用组合对象的指定方法，递归调用下游「叶对象」同名方法。
2. **利用对象多态统一对待组合对象和单一对象**。利用对象的多态表现，可以使客户端忽略组合对象和叶对象的不同。在组合模式中，客户将统一地使用组合结构中的所有对象，而不需要关心它是组合对象还是叶对象。

```text
             ┌───────────┐
             │ Composite │ // 组合对象
             └───────────┘
                   ▲
      ┌────────────┼────────────┐
      │            │            │
┌───────────┐┌───────────┐┌───────────┐
│   leaf    ││   leaf    ││ Composite │
└───────────┘└───────────┘└───────────┘
                                ▲
                   ┌────────────┼────────────┐
                   │            │            │
             ┌───────────┐┌───────────┐┌───────────┐
             │   leaf    ││   leaf    ││   leaf    │ // 叶对象
             └───────────┘└───────────┘└───────────┘
```

关键的一点就是「组合对象」和「叶对象」具有统一的接口，并且「组合对象」由「叶对象」组成，下面是实现方式。

```js
class Composite {
  constructor(leavesMap = []) {
    if (new.target === Composite) {
      this.leavesMap = leavesMap;
    }
  }
  add(leaf) {
    this.leavesMap.push(leaf);
  }
  execute() {
    this.leavesMap.forEach(leaf => leaf.execute());
  }
}

function noop() {}

class Leaf extends Composite {
  constructor(callback = noop) {
    super();
    this.callback = callback;
  }
  add() {
    throw new Error('叶对象不能添加子结点'); // 统一接口，但需要限制叶结点不能调用 add 方法
  }
  execute() {
    this.callback();
  }
}

// 使用组合模式表示上图的树形结构
const com1 = new Composite();
const leaf1 = new Leaf(() => {
  console.log('leaf1 execute!');
});
const leaf2 = new Leaf(() => {
  console.log('leaf2 execute!');
});
const com2 = new Composite();
const leaf3 = new Leaf(() => {
  console.log('leaf3 execute!');
});
const leaf4 = new Leaf(() => {
  console.log('leaf4 execute!');
});
const leaf5 = new Leaf(() => {
  console.log('leaf5 execute!');
});

com1.add(leaf1);
com1.add(leaf2);
com1.add(com2);
com2.add(leaf3);
com2.add(leaf4);
com2.add(leaf5);

com1.execute(); // leaf1 execute!
// leaf2 execute!
// leaf3 execute!
// leaf4 execute!
// leaf5 execute!
```

---

## 模板方法模式

> 定义一个操作中的算法的骨架，而将一些步骤延迟到子类中，使得子类可以不改变一个算法的结构即可重新定义该算法的某些特定步骤。

模板方法模式的主要思想是，定义一个操作的一系列步骤，对于某些暂时确定不下来的步骤，就留给子类去实现，也即：**父类定义骨架，子类实现某些细节**。由此可知此模式主要由两部分结构构成：

1. **抽象父类**。通常在抽象父类中封装了子类的算法框架，包括实现了一些公共方法以及封装子类中所有方法的执行顺序。
2. **具体的实现子类**。子类通过继承抽象父类的方式继承整个算法框架，并且可重写除公共方法以外的父类方法。

传统 OOP 抽象类的主要作用是为它的子类定义公共接口，需要注意的是 JavaScript 不存在抽象类的概念（Typescript 实现了），所以没有办法从语言层面去强制子类重写一些细节方法。因此，必须使用在父类的细节方法定义里以抛出异常的方式去强制子类重写细节方法。

```js
class SuperClass {
  // 公共方法
  stepStart() {
    console.log('start');
  }
  // 细节方法
  stepSecond() {
    throw new Error('子类必须重写 stepSecond 方法');
  }
  // 细节方法
  stepThird() {
    throw new Error('子类必须重写 stepThird 方法');
  }
  // 公共方法
  stepEnd() {
    console.log('end');
  }
  // 定义算法
  run() {
    this.stepStart();
    this.stepSecond();
    this.stepThird();
    this.stepEnd();
  }
}

class SubClassA extends SuperClass {
  constructor() {
    super();
  }
  // 重写细节方法
  stepSecond() {
    console.log('subClassA step second');
  }
  // 重写细节方法
  stepThird() {
    console.log('subClassA step third');
  }
}

class SubClassB extends SuperClass {
  constructor() {
    super();
  }
  // 重写细节方法
  stepSecond() {
    console.log('subClassB step second');
  }
  // 重写细节方法
  stepThird() {
    console.log('subClassB step third');
  }
}

const subA = new SubClassA();
subA.run(); // start
// subClassA step second
// subClassA step third
// end

const subB = new SubClassB();
subB.run(); // start
// subClassA step second
// subClassA step third
// end
```

---

## 享元模式

> 运用共享技术有效地支持大量细粒度的对象。

享元模式（Flyweight）是一种性能优化方案，当程序中需要用到大量相似的对象，而这些对象又可以区分出「内部状态」和「外部状态」的时候，就可以使用享元模式来共享单一实例。在实际使用具体对象的时候，通过将「外部状态」与单一实例进行实时组装，从而获得短暂可用的目标对象，在使用完目标对象后再还原成原来的单一实例（视实际情况）。

具体来说，判断一个业务场景时候适合使用享元模式来进行优化，一般需要满足以下几点：

- 一个程序中使用了大量相似的对象。
- 由于使用了大量对象，造成很大的内存开销。
- 对象的大多数状态可以变为外部状态。
- 剥离出对象的外部状态之后，可以用相对较少的共享对象取代大量对象。

下面是一个文件上传功能的例子，这个文件上传功能具有多个上传类型，用户可以根据实际情况选择不同的上传类型。

```js
class Upload {
  constructor(uploadType) {
    this.uploadType = uploadType;
  }
  delFile(id) {
    uploadManager.setExternalState(id, this);
    if (this.fileSize < 3000) {
      return this.dom.parentNode.removeChild(this.dom);
    }
    if (window.confirm(`Are sure to delete this file: ${this.dom}?`)) {
      return this.dom.parentNode.removeChild(this.dom);
    }
  }
}

const UploadFactory = {
  createdFlyweightObjs: {},
  create(uploadType) {
    if (this.createdFlyweightObjs[uploadType]) {
      return this.createdFlyweightObjs[uploadType];
    }
    return (this.createdFlyweightObjs[uploadType] = new Upload(uploadType));
  },
};

const UploadManager = {
  uploadDatabase: {},
  add(id, uploadType, filename, fileSize) {
    const flyweightObj = UploadFactory.create(uploadType);
    const dom = document.createElement('div');
    dom.innerHTML = `<span>File name: ${filename},File size: ${fileSize}</span>
    <button class="delFile">Delete</button>`;
    document.querySelector('.delFile').onclick = () => flyweightObj.delFile(id);
    document.body.appendChild(dom);
    uploadDatabase[id] = { filename, fileSize, dom };
    return flyweightObj;
  },
  setExternalState(id, flyweightObj) {
    const uploadData = this.database[id];
    for (let key in uploadData) {
      flyweightObj[key] = uploadData[key];
    }
  }
};

// 使用
let id = 0;
const startUpload = (uploadType, files) => {
  for(let i = 0, file; file = files[i++]) {
    uploadManager.add(++id, uploadType, file.filename, file.fileSize);
  }
}

startUpload('plugin', [{
  filename: '1.txt',
  fileSize: 1000,
},{
  filename: '2.txt',
  fileSize: 3000,
},{
  filename: '3.txt',
  fileSize: 5000,
}]);

startUpload('flash', [{
  filename: '4.txt',
  fileSize: 1000,
},{
  filename: '5.txt',
  fileSize: 3000,
},{
  filename: '6.txt',
  fileSize: 5000,
}]);
```

对于使用大量相似对象还有一种与享元模式类似的优化方案，它就是「对象池」。对象池维护了一个装载空闲对象的池子，如果需要对象的时候，不是直接创建新对象，而是先从对象池里获取，如果对象池里没有空闲对象，再去创建新对象，当创建的新对象完成了它的职责之后，再放入对象池等待被下次获取。这里需要注意的是，对象池没有分离内部状态和外部状态。

```js
function noop() {
  return {};
}

class ObjectPool {
  constructor(creator = noop, pool = []) {
    this.pool = pool;
    this.creator = creator;
  }
  getObject(...args) {
    return this.pool.shift() || this.creator(...args);
  }
  recoverObject(poolItem) {
    this.pool.push(poolItem);
  }
}

function createIframe() {
  const iframe = document.createElement('iframe');
  document.body.appendChild(iframe);

  iframe.onload = () => {
    iframe.onload = null;
    iframePool.recoverObject(iframe); // 加载完成后回收
  };

  return iframe;
}

const iframePool = new ObjectPool(createIframe);

const iframe1 = iframePool.getObject();
iframe1.src = 'https://lkangd.com/';

const iframe2 = iframePool.getObject();
iframe2.src = 'https://github.com/';

setTimeout(() => {
  const iframe3 = iframePool.getObject();
  iframe3.src = 'https://google.com/';
}, 3000);
```

---

## 职责链模式

> 使多个对象都有机会处理请求，从而避免请求的发送者和接受者之间的耦合关系。将这些对象炼成一条链，并沿着这条链传递改请求，知道有一个对象处理它为止。

责任链模式（Chain of Responsibility）是一种处理请求的模式，它让多个处理器都有机会处理该请求，直到其中某个处理成功为止。责任链模式把多个处理器串成链，然后让请求在链上传递。

职责链模式的最大优点：请求发送者只需要知道链中的第一个节点，从而弱化了发送者和一组接受者之间的强联系。

```text
     ┌─────────┐
     │ Request │
     └─────────┘
          │
┌ ─ ─ ─ ─ ┼ ─ ─ ─ ─ ┐ ─ ─ ─ ─┐
          ▼
│  ┌─────────────┐  │        │
   │ ProcessorA  │
│  └─────────────┘  │        │
          │
│         ▼         │        │
   ┌─────────────┐
│  │ ProcessorB  │  │   HandlerChain
   └─────────────┘
│         │         │        │
          ▼
│  ┌─────────────┐  │        │
   │ ProcessorC  │
│  └─────────────┘  │        │
          │
└ ─ ─ ─ ─ ┼ ─ ─ ─ ─ ┘ ─ ─ ─ ─┘
          │
          ▼
```

使用代码现实上图。

```js
class Request {
  constructor(amount = 0) {
    this.amount = amount;
  }
  getAmount() {
    return this.amount;
  }
}

class HandlerChain {
  constructor(handlers = []) {
    this.handlers = [];
  }
  addHandler(handler) {
    this.handlers.push(handler);
  }
  process(...args) {
    for (let i = 0, handler; (handler = this.handlers[i++]); ) {
      const result = handler.process(...args);
      if (result !== null) {
        return result;
      }
    }
    throw new Error(`Could not handle request: ${args}`);
  }
}

class ProcessorA {
  constructor() {}
  process(request) {
    if (request.getAmount() > 1000) return null; // 设置职责门槛
    console.log('ProcessorA success!');
  }
}
class ProcessorB {
  constructor() {}
  process(request) {
    if (request.getAmount() > 2000) return null; // 设置职责门槛
    console.log('ProcessorB success!');
  }
}
class ProcessorC {
  constructor() {}
  process(request) {
    if (request.getAmount() > 3000) return null; // 设置职责门槛
    console.log('ProcessorC success!');
  }
}

// 使用
const chain = new HandlerChain();
// 设置职责链，注意顺序
chain.addHandler(new ProcessorA());
chain.addHandler(new ProcessorB());
chain.addHandler(new ProcessorC());

const req1 = new Request(999);
const req2 = new Request(1999);
const req3 = new Request(2999);
const req4 = new Request(3001); // 超出职责范围

chain.process(req1); // ProcessorA success!
chain.process(req2); // ProcessorB success!
chain.process(req3); // ProcessorC success!
chain.process(req4); // Uncaught Error: Could not handle request: [object Object]
```

---

## 中介者模式

> 用一个中介对象来封装一系列的对象交互。中介者使各个对象不需要显式地相互作用，从而使其耦合松散，而且可以独立地改变他们之间的交互。

中介者模式（Mediator）的作用是解除对象与对象之间的紧耦合关系。增加一个中介者对象后，所有的相关对象都通过中介者对象来通信，而不是相互作用，所以当一个对象发生改变时，只需要通知中介者即可。

使用中介者之前对象间相互影响。

```text
┌─────────────────┐     ┌─────────────────┐
│        A        │<───>│        B        │
└─────────────────┘     └─────────────────┘
         ▲ ▲                     ▲
         │ └─────────────────────┤
         ▼                       │
┌─────────────────┐     ┌────────┴────────┐
│        C        │<────│        D        │
└─────────────────┘     └─────────────────┘
```

使用中介者后对象只与中介者交互，从而解除了对象间的强耦合关系。

```text
            ┌─────────────────┐
     ┌─────>│        A        │
     │      └─────────────────┘
     │      ┌─────────────────┐
     │ ┌───>│        B        │
     ▼ ▼    └─────────────────┘
┌─────────┐
│  中介者  │
└─────────┘
     ▲ ▲    ┌─────────────────┐
     │ └───>│        C        │
     │      └─────────────────┘
     │      ┌─────────────────┐
     └─────>│        D        │
            └─────────────────┘
```

使用代码现实上图。

```js
// 使用中介者模式前
class Node {
  constructor(status = true, influenceNodes = []) {
    this.status = status;
    this.influenceNodes = influenceNodes;
  }
  addInfluence(node) {
    this.influenceNodes.push(node);
  }
  change(status) {
    const newStatus = status === undefined ? !this.status : status;
    this.status = newStatus;
    this.influenceNodes.forEach(node => (node.status = !newStatus));
  }
}

const A = new Node(false);
const B = new Node();
const C = new Node();
const D = new Node();

// A 影响 B, C
A.addInfluence(B);
A.addInfluence(C);
// B 影响 A
B.addInfluence(A);
// C 影响 A
C.addInfluence(A);
// D 影响 A, B, C
D.addInfluence(A);
D.addInfluence(B);
D.addInfluence(C);

A.change();
console.log(A.status, B.status, C.status, D.status); // true, false, false, true

D.change();
console.log(A.status, B.status, C.status, D.status); // true, true, true, false
```

```js
// 引入中介者
class Node {
  constructor(type, status = true) {
    this.status = status;
    this.type = type;
  }
  change(status) {
    const newStatus = status === undefined ? !this.status : status;
    this.status = newStatus;
  }
}

const A = new Node('A', false);
const B = new Node('B');
const C = new Node('C');
const D = new Node('D');

// 将对象间影响的逻辑封装到中介者
const mediator = function(node) {
  const newStatus = !node.status;
  switch (node.type) {
    case 'A': // A 影响 B, C
      B.change(newStatus);
      C.change(newStatus);
      break;
    case 'B': // B 影响 A
      A.change(newStatus);
      break;
    case 'C': // C 影响 A
      A.change(newStatus);
      break;
    case 'D': // D 影响 A, B, C
      A.change(newStatus);
      B.change(newStatus);
      C.change(newStatus);
      break;
    default:
      console.log('unsupported type!', node.type);
  }
};

A.change();
mediator(A);
console.log(A.status, B.status, C.status, D.status); // true, false, false, true

D.change();
mediator(D);
console.log(A.status, B.status, C.status, D.status); // true, true, true, false
```

---

## 装饰者模式

> 在不改变对象的基础上，动态地给对象添加一些额外的职责。就增加功能而言，相比生成子类更加灵活。

装饰器（Decorator）模式的核心思想与流行的 AOP（面向切面）编程方法论是一致的，目的都是为了在不改变对象本身的前提上，在对象方法的出入口去改变方法的行为。

```js
// 入口切面
Function.prototype.before = function(beforeFn) {
  const originFn = this;
  return function(...args) {
    beforeFn.apply(this, args);
    return originFn.apply(this, args);
  };
};

// 出口切面
Function.prototype.after = function(afterFn) {
  const originFn = this;
  return function(...args) {
    const ret = originFn.apply(this, args);
    afterFn.call(this, ret);
    return ret;
  };
};

function execute(number) {
  console.log('execute!');
  return number * number;
}

execute(10); // execute! 100

function logBefore(number) {
  console.log('before fn log, number is:', number);
}
function logAfter(result) {
  console.log('after fn log, result is:', result);
}

execute.before(logBefore)(10); // before fn log, number is: 10
// execute!

execute.after(logAfter)(10); // execute!
// after fn log, result is: 100

execute.before(logBefore).after(logAfter)(10); // before fn log, number is: 10
// execute!
// after fn log, result is: 100
```

最新的 ES [提案](https://github.com/tc39/proposal-decorators){target=\_blank} 里已经实现了原生的装饰器语法，ES 的装饰器可以很便捷地修改类和类方法的行为。

```js
function log(target, name, descriptor) {
  const oldValue = descriptor.value;

  descriptor.value = function() {
    console.log(`Calling ${name} with`, arguments);
    return oldValue.apply(this, arguments);
  };

  return descriptor;
}

class Math {
  @log
  add(a, b) {
    return a + b;
  }
}

const math = new Math();

math.add(2, 4); // Calling add with 2, 4
```

---

## 状态模式

> 允许一个对象在其内部状态改变时改变它的行为，对象看起来似乎修改了它的类。

状态模式（State）经常用在带有状态的对象中，可以按两个部分来理解上面的定义：

1. 将状态封装成独立的类，并将请求委托给当前的状态对象，当对象的内部状态改变时，会带来不同的行为变化。
2. 从客户的角度来看，使用对象时，在不同状态下具有截然不同的行为，这个对象看起来是从不同的类中实例化而来的，实际上这是使用了委托的效果。

传统的面向对象语言的状态模式实现会为每种状态定义一个状态子类，然后在 Context 中持有这些状态对象的引用，以便把当前状态切换为当前的状态对象。但在 JavaScript 这种“无类”语言中，没有规定让状态对象一定要从类中创建出来。另外一点，JavaScript 可以非常方便地使用委托技术，并不需要事先让一个对象只有另一个对象。下面是 JavaScript 对状态模式的实现。

```js
// 一个使用状态模式的开关灯程序
const delegate = function(client, delegation) {
  return {
    // 将客户的操作委托给 delegation 对象
    buttonWasPressed() {
      return delegation.buttonWasPressed.apply(client, arguments);
    },
  };
};

// 状态类封装
const FSM = {
  off: {
    buttonWasPressed() {
      console.log('关灯');
      this.button.innerHTML = '下一次按我就是开灯。';
      this.currentState = this.onState;
    },
  },
  on: {
    buttonWasPressed() {
      console.log('开灯');
      this.button.innerHTML = '下一次按我就是关灯。';
      this.currentState = this.offState;
    },
  },
};

class Light {
  constructor() {
    this.offState = delegate(this, FSM.off);
    this.onState = delegate(this, FSM.on);
    this.currentState = this.offState; // 设置初始状态为关闭状态
    this.button = null;
  }
  init() {
    const button = document.createElement('button');
    button.innerHTML = '已关灯';
    this.button = document.body.appendChild(button);
    this.button.onclick = function() {
      this.currentState.buttonWasPressed();
    }.bind(this);
  }
}

const light = new Light();
light.init();

light.button.click(); // 开灯
light.button.click(); // 关灯
```

##### 模式优点

- 状态模式定义了状态与行为之间的关系，并将它们封装在一个类里。通过增加新的状态类，很容易增加新的状态和转换。
- 避免 Context 无限膨胀，状态切换的逻辑被分布在状态类中，也去掉了 Context 中原本过于多的条件分支。
- 用对象代替字符串记录当前状态，是的状态的切换更加一目了然。
- Context 中的请求动作和状态类中封装的行为可以非常容易地独立变化而不受影响。

##### 模式缺点

- 定义了许多状态类，因此系统中会增加不少对象。
- 虽然避开了不受欢迎的条件分支，但也造成了逻辑松散的问题，无法在一个地方就看出这个状态机的逻辑。

---

## 适配器模式

> 将一个类的接口转换成客户希望的另外一个接口，使得原本由于接口不兼容而不能一起工作的那些类可以一起工作。

适配器（Adapter）模式的别名是包装器（wrapper），是一个相对简单的模式，它作用是解决两个软件之间接口不兼容的问题，使用适配器模式之后，原本由于接口不兼容而不能工作的两个软件实体可以一起工作。适配器模式是一种“亡羊补牢”的模式，一般不会在程序设计之初就是用它。

```js
class NormalProcessor {
  constructor(action) {
    this.action = action;
  }
  show() {
    console.log('start doing ', this.action);
  }
}

const makeAction = processor => processor.show(); // 原有逻辑
const processors = [new NormalProcessor('stand'), new NormalProcessor('walk')];

processors.forEach(p => makeAction(p)); // stand walk

// 非兼容接口
class IncompatibleProcessor {
  constructor(action) {
    this.action = action;
  }
  display() {
    console.log('start doing ', this.action);
  }
}

const runProcessor = new IncompatibleProcessor('run');

processors.push(runProcessor);
processors.forEach(p => makeAction(p)); // stand walk Uncaught TypeError: processor.show is not a function

// 生成一个适配器对象
const makeAdapter = (originObj, originFnName, adapterFnName) => {
  return {
    [adapterFnName](...args) {
      return originObj[originFnName](...args);
    },
  };
};

const runProcessorAdapter = makeAdapter(runProcessor, 'display', 'show');
processors.splice(processors.length - 1, 1, runProcessorAdapter);
processors.forEach(p => makeAction(p)); // stand walk run
```

---

## 结言

所有设计模式的实现都遵循一条原则，即“找出程序中变化的地方，并将变化封装起来”。一个程序的设计总是可以分为可变的部分和不变的部分。当我们找出可变的部分，并且把这些部分封装起来，那么剩下的就是不变和稳定的部分。这些不变和稳定的部分是非常容易复用的。这也是设计模式为什么描写的是可复用面向对象软件基础的原因。

学习设计模式时不应该根据模式的名字去臆测该模式的一切，而是要理解模式具体能解决的问题和改模式的适用场景，才能避免对模式的滥用和误用，让模式为开发赋能。

#### 参考

[JavaScript 设计模式与开发实践](https://book.douban.com/subject/26382780/){target=\_blank}
[Design Patterns](https://book.douban.com/subject/1436745/){target=\_blank}
[设计模式-廖雪峰](https://www.liaoxuefeng.com/wiki/1252599548343744/1264742167474528){target=\_blank}
[ES6入门教程-阮一峰](https://es6.ruanyifeng.com/){target=_blank}
