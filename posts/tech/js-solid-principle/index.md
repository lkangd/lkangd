---
title: 代码整洁之道：js 中的 S.O.L.I.D 原则
date: '2019-11-11'
spoiler: 【译】Clean Code concepts adapted for JavaScript：S.O.L.I.D
featured: true
---

[[TOC]]

[《代码整洁之道》](https://book.douban.com/subject/4199741/){target=\_blank}是一本致力于教人写出简洁、易维护且高质量代码的书籍，该书给出了一系列行之有效的整洁代码操作实践，阅读过后令人受益匪浅。Github 上的[clean-code-javascript](https://github.com/ryanmcdermott/clean-code-javascript){target=\_blank}是一个用 JavaScript 去诠释「Clean Code」理念的项目，该项目以 Bad / Good 为正、反两面的范例，并辅以一些叙述和注释作为说明，以增强阅读者对「Clean Code」理念的理解。下文主要翻译其中提出的最常用的 S.O.L.I.D 原则。

## 单一职责原则 | Single Responsibility Principle (SRP)

> As stated in Clean Code, "There should never be more than one reason for a class to change". It's tempting to jam-pack a class with a lot of functionality, like when you can only take one suitcase on your flight. The issue with this is that your class won't be conceptually cohesive and it will give it many reasons to change. Minimizing the amount of times you need to change a class is important. It's important because if too much functionality is in one class and you modify a piece of it, it can be difficult to understand how that will affect other dependent modules in your codebase.

就如《代码整洁之道》中所提到的，“一个类的变化不应该具有一个以上的原因”。的确，在一个类中塞入很多的功能很诱人，就像你只能携带一个旅行箱赶航班一样。但是问题在于，这些臃肿的类不再是概念上内聚的，在未来可能会因为很多理由而需要去修改它。尽量减少修改一个类的次数是非常重要的，因为如果一个类包含了太多功能，当你去修改这个类的某一部分时，将会很难理解这些新的修改如何影响代码库中其他的依赖模块。

> 译者按：这里的类替换成函数理解也是一样的

#### Bad:

```js
class UserSettings {
  constructor(user) {
    this.user = user;
  }

  changeSettings(settings) {
    if (this.verifyCredentials()) {
      // ...
    }
  }

  verifyCredentials() {
    // ...
  }
}
```

#### Good:

```js
class UserAuth {
  constructor(user) {
    this.user = user;
  }

  verifyCredentials() {
    // ...
  }
}

class UserSettings {
  constructor(user) {
    this.user = user;
    this.auth = new UserAuth(user);
  }

  changeSettings(settings) {
    if (this.auth.verifyCredentials()) {
      // ...
    }
  }
}
```

## 开放封闭原则 | Open/Closed Principle (OCP)

> As stated by Bertrand Meyer, "software entities (classes, modules, functions, etc.) should be open for extension, but closed for modification." What does that mean though? This principle basically states that you should allow users to add new functionalities without changing existing code.

Bertrand Meyer 也曾经说过，“软件实体（类、模块、函数等）应该对可扩展性进行开放，而对可修改性进行封闭。”这意味着什么呢？这个原则基本上是说你应该允许用户在**不更改现有代码**的情况下添加新的功能。

#### Bad:

```js
class AjaxAdapter extends Adapter {
  constructor() {
    super();
    this.name = 'ajaxAdapter';
  }
}

class NodeAdapter extends Adapter {
  constructor() {
    super();
    this.name = 'nodeAdapter';
  }
}

class HttpRequester {
  constructor(adapter) {
    this.adapter = adapter;
  }

  fetch(url) {
    if (this.adapter.name === 'ajaxAdapter') {
      return makeAjaxCall(url).then(response => {
        // 处理响应结果并返回
      });
    } else if (this.adapter.name === 'nodeAdapter') {
      return makeHttpCall(url).then(response => {
        // 处理响应结果并返回
      });
    }
  }
}

function makeAjaxCall(url) {
  // 请求并返回 promise
}

function makeHttpCall(url) {
  // 请求并返回 promise
}
```

#### Good:

```js
class AjaxAdapter extends Adapter {
  constructor() {
    super();
    this.name = 'ajaxAdapter';
  }

  request(url) {
    // 请求并返回 promise
  }
}

class NodeAdapter extends Adapter {
  constructor() {
    super();
    this.name = 'nodeAdapter';
  }

  request(url) {
    // 请求并返回 promise
  }
}

class HttpRequester {
  constructor(adapter) {
    this.adapter = adapter;
  }

  fetch(url) {
    return this.adapter.request(url).then(response => {
      // 处理响应结果并返回
    });
  }
}
```

## 里氏替换原则 | Liskov Substitution Principle (LSP)

> This is a scary term for a very simple concept. It's formally defined as "If S is a subtype of T, then objects of type T may be replaced with objects of type S (i.e., objects of type S may substitute objects of type T) without altering any of the desirable properties of that program (correctness, task performed, etc.)." That's an even scarier definition.

这个术语（里氏替换）听起来很“可怕”，但是其实概念很简单。它的正式定义是：“如果 S 是 T 子类型，那么类型 T 应该可以被类型 S 的对象所替换（例如，类型 S 的对象可以替换为类型 T 的对象）”，且不会改变该程序原来的任何预期（正确性、执行的任务等）。...这听起来令人更加“害怕”。

> The best explanation for this is if you have a parent class and a child class, then the base class and child class can be used interchangeably without getting incorrect results. This might still be confusing, so let's take a look at the classic Square-Rectangle example. Mathematically, a square is a rectangle, but if you model it using the "is-a" relationship via inheritance, you quickly get into trouble.

对这个原则最好的解释是，如果你有一个父类和一个子类，这对父子类可以互相替换使用而不会得到不正确的结果。这听起来可能还是比较令人难以理解，所以我们来看一个经典的`Square-Rectangle`例子。从算术语言的角度而言，一个**正方形**同时也是一个**矩形**，但如果你通过继承使用“is-a”关系为它建模，你很快就会遇到麻烦。

#### Bad:

```js
class Rectangle {
  constructor() {
    this.width = 0;
    this.height = 0;
  }

  setColor(color) {
    // ...
  }

  render(area) {
    // ...
  }

  setWidth(width) {
    this.width = width;
  }

  setHeight(height) {
    this.height = height;
  }

  getArea() {
    return this.width * this.height;
  }
}

class Square extends Rectangle {
  setWidth(width) {
    this.width = width;
    this.height = width;
  }

  setHeight(height) {
    this.width = height;
    this.height = height;
  }
}

function renderLargeRectangles(rectangles) {
  rectangles.forEach(rectangle => {
    rectangle.setWidth(4);
    rectangle.setHeight(5);
    const area = rectangle.getArea(); // BAD: 正方形的预期面积应该为 20，但是却返回了 25
    rectangle.render(area);
  });
}

const rectangles = [new Rectangle(), new Rectangle(), new Square()];
renderLargeRectangles(rectangles);
```

#### Good:

```js
class Shape {
  setColor(color) {
    // ...
  }

  render(area) {
    // ...
  }
}

class Rectangle extends Shape {
  constructor(width, height) {
    super();
    this.width = width;
    this.height = height;
  }

  getArea() {
    return this.width * this.height;
  }
}

class Square extends Shape {
  constructor(length) {
    super();
    this.length = length;
  }

  getArea() {
    return this.length * this.length;
  }
}

function renderLargeShapes(shapes) {
  shapes.forEach(shape => {
    const area = shape.getArea();
    shape.render(area);
  });
}

const shapes = [new Rectangle(4, 5), new Rectangle(4, 5), new Square(5)];
renderLargeShapes(shapes);
```

## 接口分离原则 | Interface Segregation Principle (ISP)

> JavaScript doesn't have interfaces so this principle doesn't apply as strictly as others. However, it's important and relevant even with JavaScript's lack of type system.

JavaScript 语言里没有“接口”类型的概念，所以这个原则不像其它原则那样严格使用。然而，即使 JavaScript 缺乏类型系统，遵循接口分离原则还是很重要的。

> ISP states that "Clients should not be forced to depend upon interfaces that they do not use." Interfaces are implicit contracts in JavaScript because of duck typing.

ISP 声明“客户端不应该被迫依赖于它们不使用的接口”。而且 JavaScript 具有“鸭子类型”的特性，因此接口在 JavaScript 中属于一种隐式契约。

> A good example to look at that demonstrates this principle in JavaScript is for classes that require large settings objects. Not requiring clients to setup huge amounts of options is beneficial, because most of the time they won't need all of the settings. Making them optional helps prevent having a "fat interface".

在 JavaScript 中验证这一原则的一个很好的例子就是那些需要大量配置对象的类。不要求客户端配置大量选项是有益的，因为大多数时候它们不需要所有的设置选项。让设置项保持**可选**可以有助防止“臃肿接口”的出现。

#### Bad:

```js
class DOMTraverser {
  constructor(settings) {
    this.settings = settings;
    this.setup();
  }

  setup() {
    this.rootNode = this.settings.rootNode;
    this.settings.animationModule.setup();
  }

  traverse() {
    // ...
  }
}

const $ = new DOMTraverser({
  rootNode: document.getElementsByTagName('body'),
  animationModule() {}, // 大多数情况下，我们在遍历的时候并不需要动画
  // ...
});
```

#### Good:

```js
class DOMTraverser {
  constructor(settings) {
    this.settings = settings;
    this.options = settings.options;
    this.setup();
  }

  setup() {
    this.rootNode = this.settings.rootNode;
    this.setupOptions();
  }

  setupOptions() {
    if (this.options.animationModule) {
      // ...
    }
  }

  traverse() {
    // ...
  }
}

const $ = new DOMTraverser({
  rootNode: document.getElementsByTagName('body'),
  options: {
    animationModule() {},
  },
});
```

## 依赖翻转原则 | Dependency Inversion Principle (DIP)

> This principle states two essential things:
>
> 1. High-level modules should not depend on low-level modules. Both should depend on abstractions.
> 2. Abstractions should not depend upon details. Details should depend on abstractions.

这一原则阐述了两件重要的事情：

1. 高级模块不应该依赖于低级模块。两者都应该依赖于抽象。
2. 抽象不应该依赖于具体实现。具体实现应该依赖于抽象。

> This can be hard to understand at first, but if you've worked with AngularJS, you've seen an implementation of this principle in the form of Dependency Injection (DI). While they are not identical concepts, DIP keeps high-level modules from knowing the details of its low-level modules and setting them up. It can accomplish this through DI. A huge benefit of this is that it reduces the coupling between modules. Coupling is a very bad development pattern because it makes your code hard to refactor.

最开始可能难以理解，不过如果你曾经使用过 AngularJS，你就已经见识过这一原则的其中一种实现方式，也即“依赖注入”（DI）。虽然它们不是完全相同的概念，但 DIP 阻止了高级模块了解其低级模块的具体实现和设置。这可以通过 DI 来打成目的。这样做带来的一个显著的好处就是可以减少模块之间的耦合。耦合是一种非常糟糕的开发模式，因为它会使你的代码难以维护。

> As stated previously, JavaScript doesn't have interfaces so the abstractions that are depended upon are implicit contracts. That is to say, the methods and properties that an object/class exposes to another object/class. In the example below, the implicit contract is that any Request module for an `InventoryTracker` will have a `requestItems` method.

就像上文所说，JavaScript 语言没有“接口”这一概念，所以抽象只能依赖于隐式契约。也就是说，一个对象或类暴露给另一个对象或类的方法和属性。在下面的示例中的隐式契约是，`InventoryTracker`依赖的任一 Request 模块都将有一个`requestItems`方法。

#### Bad:

```js
class InventoryRequester {
  constructor() {
    this.REQ_METHODS = ['HTTP'];
  }

  requestItem(item) {
    // ...
  }
}

class InventoryTracker {
  constructor(items) {
    this.items = items;

    // BAD: 我们已经创建了对特定请求实现的依赖
    // 我们应该让 requestItems 依赖于一个请求方法：`request`
    this.requester = new InventoryRequester();
  }

  requestItems() {
    this.items.forEach(item => {
      this.requester.requestItem(item);
    });
  }
}

const inventoryTracker = new InventoryTracker(['apples', 'bananas']);
inventoryTracker.requestItems();
```

#### Good:

```js
class InventoryTracker {
  constructor(items, requester) {
    this.items = items;
    this.requester = requester;
  }

  requestItems() {
    this.items.forEach(item => {
      this.requester.requestItem(item);
    });
  }
}

class InventoryRequesterV1 {
  constructor() {
    this.REQ_METHODS = ['HTTP'];
  }

  requestItem(item) {
    // ...
  }
}

class InventoryRequesterV2 {
  constructor() {
    this.REQ_METHODS = ['WS'];
  }

  requestItem(item) {
    // ...
  }
}

// 通过外部构建依赖并注入它们
// 我们可以很容易地将请求模块替换为使用 WebSockets 的新请求模块。
const inventoryTracker = new InventoryTracker(['apples', 'bananas'], new InventoryRequesterV2());
inventoryTracker.requestItems();
```

[原文地址](https://github.com/ryanmcdermott/clean-code-javascript#solid){target=\_blank}
