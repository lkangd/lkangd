---
title: 一文看全 Vue 3.X 带来的新变化
date: '2020-07-19'
spoiler: 只关注区别于 Vue 2.x 实现，助力快速过渡到 Vue 3.x
---

[[TOC]]

昨天(2020-07-18)，Vue 宣布 3.X 版本正式进入 [RC](https://github.com/vuejs/rfcs/issues/189){target=\_blank}阶段，进入 RC 阶段意味着 Vue 3.x 的核心实现已经趋于稳定，原则上在最终发布前不会再引入新的主要特性和破坏性更改，所以现在正是开始学习 Vue 3.x 的最好时机。

在通读了 Vue 3.x 最新的[官方文档](https://v3.vuejs.org/){target=\_blank}后，我总结了一下 Vue 3.x 对于 Vue 2.x 的一些主要变化，分别从新功能、破坏性更改和废弃特性三个方面进行汇总，方便在开发基于 Vue 3.x 新版本应用的时候进行快速查阅。可点击右侧 TOC 导航栏进行快速查看（PC 端）。

## NEW | 新增功能特性

### 基础响应式 API Reactivity

##### 变化描述：

- 新增`reactive`全局 API，调用后返回一个响应式的`proxy`对象；
- 新增`readonly`全局 API，调用后根据源对象返回一个只读的`proxy`对象，如果源对象是响应式的，源对象发生变化时会同步变化；
- 新增`isProxy`全局 API，检查指定对象是否由`reactive`或者`readonly`创建；
- 新增`isReactive`全局 API，检查指定对象是否由`reactive`创建（经`readonly`创建的`reactive`值认为 true，e.g.，isReactive(readonly(reactive({}))) === true）；
- 新增`isReadonly`全局 API，检查指定对象是否由`readonly`创建；
- 新增`toRaw`全局 API，调用后返回一个`reactive`对象的原始对象；
- 新增`markRaw`全局 API，调用后返回一个不可被`reactive`将其作为源的对象；
- 新增`shallowReactive`全局 API，浅`reactive`，只将对象的顶层`reactive`；
- 新增`shallowReadonly`全局 API，浅`readonly`，只将对象的顶层`readonly`；

##### 代码示例：

`reactive`：

调用后返回一个响应式的`proxy`对象。

```js
const obj = reactive({ count: 0 });
```

---

`readonly`：

调用后根据源对象返回一个只读的`proxy`对象，如果源对象是响应式的，源对象发生变化时会同步变化。

```js
const original = reactive({ count: 0 });

const copy = readonly(original);

watchEffect(() => {
  // works for reactivity tracking
  console.log(copy.count);
});

// mutating original will trigger watchers relying on the copy
original.count++;

// mutating the copy will fail and result in a warning
copy.count++; // warning!
```

---

`isProxy`：

检查指定对象是否由`reactive`或者`readonly`创建。

```js
const rt = reactive({ count: 0 });
const rd = readonly(rt);
const plainObj = {};

isProxy(rt); // true
isProxy(rd); // true
isProxy(plainObj); // false
```

---

`isReactive`：

检查指定对象是否由`reactive`创建（经`readonly`创建的`reactive`值认为 true，e.g.，isReactive(readonly(reactive({}))) === true）。

```js{7-15}
import { reactive, isReactive, readonly } from 'vue';
export default {
  setup() {
    const state = reactive({
      name: 'John',
    });
    // 由普通对象创建的 readonly proxy
    const plain = readonly({
      name: 'Mary',
    });
    console.log(isReactive(plain)); // -> false

    // 由 reactive proxy 创建的 readonly proxy
    const stateCopy = readonly(state);
    console.log(isReactive(stateCopy)); // -> true
  },
};
```

---

`isReadonly`：

检查指定对象是否由`readonly`创建。

```js
const rt = reactive({ count: 0 });
const rd = readonly(rt);
const plainObj = {};

isReadonly(rt); // false
isReadonly(rd); // true
isReadonly(plainObj); // false
```

---

`toRaw`：

调用后返回一个`reactive`对象的原始对象。

```js
const foo = {};
const reactiveFoo = reactive(foo);

console.log(toRaw(reactiveFoo) === foo); // true
```

---

`markRaw`：

调用后返回一个不可被`reactive`将其作为源的对象。

```js
const foo = markRaw({});
console.log(isReactive(reactive(foo))); // false

// 嵌套 reactive 也可使用
const bar = reactive({ foo });
console.log(isReactive(bar.foo)); // false

// 被 markRaw 对象的嵌套对象不受影响
const baz = markRaw({
  nested: {},
});
const qux = reactive({
  // 即使 `baz` 被标记为 raw, 但是 baz.nested 不受影响.
  nested: baz.nested,
});

console.log(baz.nested === qux.nested); // false
```

---

`shallowReactive`：

浅`reactive`，只将对象的顶层`reactive`。

```js
const state = shallowReactive({
  foo: 1,
  nested: {
    bar: 2,
  },
});

// 改变 state 自身的属性是响应式的
state.foo++;
// ...但是深层嵌套对象不是响应式的
isReactive(state.nested); // false
state.nested.bar++; // non-reactive
```

---

`shallowReadonly`：

浅`readonly`，只将对象的顶层`readonly`。

```js
const state = shallowReadonly({
  foo: 1,
  nested: {
    bar: 2,
  },
});

// 不可以改变 state 自身的属性值
state.foo++;
// ...但是深层嵌套对象的属性值可被改变
isReadonly(state.nested); // false
state.nested.bar++; // works
```

---

### Refs

##### 变化描述：

- 新增`ref`全局 API，调用后返回一个基础值的响应式对象，该对象只有一个 value 固定值。当源值不是基础值（即对象）时，会静默地对该对象调用`reactive`；
- 新增`unref`全局 API，调用后返回一个`ref`值的 value 值，这个 API 是`val = isRef(val) ? val.value : val`的语法糖；
- 新增`toRef`全局 API，调用后返回一个`reactive`对象的指定属性作为`ref`，该`ref`与`reactive`的原值互相影响；
- 新增`toRefs`全局 API，调用后返回一个`reactive`对象的所有属性的`ref`集合，该`ref`集合的每一个属性值（即每一个 ref）与`reactive`的原值相互影响；
- 新增`isRef`全局 API，检查指定对象是否`ref`；
- 新增`customRef`全局 API，创建自定义的`ref`用于细粒度的控制依赖收集和触发，需要提供一个工厂函数，该工厂函数接受参数分别为`track`和`trigger`两个参数，返回值必须是带`get`、`set`方法的对象；
- 新增`shallowRef`全局 API，浅`ref`，因为对非基础值调用`ref`会隐式调用`reactive`，相当于对`ref`的 value 值调用`shallowReactive`；
- 新增`triggerRef`全局 API，改变由`shallowRef`创建的`ref`值后，手动触发`ref`更新以驱动`computed`和`watch`等逻辑；

##### 代码示例：

`ref`：

调用后返回一个基础值的响应式对象，该对象只有一个 value 固定值。当源值不是基础值（即对象）时，会静默地对该对象调用`reactive`。

```js
const count = ref(0);
console.log(count.value); // 0

count.value++;
console.log(count.value); // 1
```

---

`unref`：

调用后返回一个`ref`值的 value 值，这个 API 是`val = isRef(val) ? val.value : val`的语法糖。

```js
function useFoo(x: number | Ref<number>) {
  const unwrapped = unref(x); // unwrapped is guaranteed to be number now
}
```

---

`toRef`：

调用后返回一个`reactive`对象的指定属性作为`ref`，该`ref`与`reactive`的原值互相影响。

```js
const state = reactive({
  foo: 1,
  bar: 2,
});

const fooRef = toRef(state, 'foo');

fooRef.value++;
console.log(state.foo); // 2

state.foo++;
console.log(fooRef.value); // 3
```

---

`toRefs`：

调用后返回一个`reactive`对象的所有属性的`ref`集合，该`ref`集合的每一个属性值（即每一个 ref）与`reactive`的原值相互影响。

```js
const state = reactive({
  foo: 1,
  bar: 2,
});

const stateAsRefs = toRefs(state);
/*
Type of stateAsRefs:

{
  foo: Ref<number>,
  bar: Ref<number>
}
*/

// The ref and the original property is "linked"
state.foo++;
console.log(stateAsRefs.foo.value); // 2

stateAsRefs.foo.value++;
console.log(state.foo); // 3
```

---

`isRef`：

检查指定对象是否`ref`。

```js
const count = ref(0);
const sum = 0;

isRef(count); // true
isRef(sum); // false
```

---

`customRef`：

创建自定义的`ref`用于细粒度的控制依赖收集和触发，需要提供一个工厂函数，该工厂函数接受参数分别为`track`和`trigger`两个参数，返回值必须是带`get`、`set`方法的对象。

```html
<input v-model="text" />
```

```js
function useDebouncedRef(value, delay = 200) {
  let timeout;
  return customRef((track, trigger) => {
    return {
      get() {
        track();
        return value;
      },
      set(newValue) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          value = newValue;
          trigger();
        }, delay);
      },
    };
  });
}

export default {
  setup() {
    return {
      text: useDebouncedRef('hello'),
    };
  },
};
```

---

`shallowRef`：

因为对非基础值调用`ref`会隐式调用`reactive`，相当于对`ref`的 value 值调用`shallowReactive`。

```js
const foo = shallowRef({});
// mutating the ref's value is reactive
foo.value = {};
// but the value will not be converted.
isReactive(foo.value); // false
```

---

`triggerRef`：

新增`triggerRef`全局 API，改变由`shallowRef`创建的`ref`值后，手动触发`ref`更新以驱动`computed`和`watch`等逻辑。

```js
const shallow = shallowRef({
  greet: 'Hello, world',
});

// Logs "Hello, world" once for the first run-through
watchEffect(() => {
  console.log(shallow.value.greet);
});

// This won't trigger the effect because the ref is shallow
shallow.value.greet = 'Hello, universe';

// Logs "Hello, universe"
triggerRef(shallow);
```

---

### Computed

##### 变化描述：

- 新增`computed`全局 API，调用该 API 创建动态计算值时，需要提供一个计算函数或者带有`get`和`set`函数的对象字面量；

##### 代码示例：

类型注解：

```js
// read-only
function computed<T>(getter: () => T): Readonly<Ref<Readonly<T>>>

// writable
function computed<T>(options: { get: () => T; set: (value: T) => void }): Ref<T>
```

使用计算函数的情况：

```javascript
const count = ref(1);
const plusOne = computed(() => count.value++);

console.log(plusOne.value); // 2

plusOne.value++; // error
```

使用对象字面量的情况：

```javascript
const count = ref(1);
const plusOne = computed({
  get: () => count.value + 1,
  set: val => {
    count.value = val - 1;
  },
});

plusOne.value = 1;
console.log(count.value); // 0
```

---

### WatchEffect

##### 变化描述：

- 新增`watchEffect`全局 API，调用该函数侦听变化时，会**立即执行**一次；
- 调用该函数后返回`stop`函数，调用`stop`后停止侦听；
- `watchEffect`的第一个参数为 handle 函数，该 handle 函数接收`onInvalidate`函数，`onInvalidate`在`watchEffect`被重新触发或者被终止时触发；
- `watchEffect`的第二个参数为侦听选项，值为对象字面量，
  - 选项`flush`，用于控制`watchEffect`的执行时机：
    ```text
    pre  -> 在组件更新前运行
    sync -> 在组件更新时同步运行
    post -> 在组件更新后运行（默认）
    ```
  - 选项`onTrack`，`watchEffect`依赖收集时调用，用于 debugger，只在开发模式（development）可用；
  - 选项`onTrigger`，`watchEffect`重新运行时调用，用于 debugger，只在开发模式（development）可用；

##### 代码示例：

类型注解：

```js
function watchEffect(
  effect: (onInvalidate: InvalidateCbRegistrator) => void,
  options?: WatchEffectOptions
): StopHandle

interface WatchEffectOptions {
  flush?: 'pre' | 'post' | 'sync'
  onTrack?: (event: DebuggerEvent) => void
  onTrigger?: (event: DebuggerEvent) => void
}

interface DebuggerEvent {
  effect: ReactiveEffect
  target: any
  type: OperationTypes
  key: string | symbol | undefined
}

type InvalidateCbRegistrator = (invalidate: () => void) => void

type StopHandle = () => void
```

默认使用方式：

```javascript
const count = ref(0);

const stop = watchEffect(() => console.log(count.value));
// -> logs 0

setTimeout(() => {
  count.value++;
  // -> logs 1
}, 100);

// later 手动结束 watchEffect
setTimeout(() => {
  stop();
}, 200);
```

同步 Invalidation sync：

```javascript
watchEffect(onInvalidate => {
  const token = performAsyncOperation(id.value);
  onInvalidate(() => {
    // id 发生了变化或者 watcher 被终止
    // 手动终止上一个未结束的异步操作
    token.cancel();
  });
});
```

异步 Invalidation async：

```javascript
const data = ref(null)
watchEffect(async onInvalidate => {
  onInvalidate(() => {...}) // 在异步函数 resolve 前注册清理函数
  data.value = await fetchData(props.id)
})
```

参数选项：

```javascript
watchEffect(
  () => {
    /* side effect */
  },
  {
    flush: 'pre', // 改变执行时机
    // 收集依赖时 debug
    onTrack(e) {
      debugger;
    },
    // 被触发时 debug
    onTrigger(e) {
      debugger;
    },
  },
);
```

---

### Watch

##### 变化描述：

- 新增`watch`全局 API，调用该函数侦听变化时，默认执行方式为`lazy`；
- 可同时侦听多个属性；
- `watch`的第二个参数为 handle 函数，该 handle 函数接收`onInvalidate`函数，`onInvalidate`在`watch`被重新触发或者被终止时触发；
- `watch`的第三个参数为侦听选项，值为对象字面量，
  - 选项`flush`，用于控制`watch`的执行时机：
    ```text
    pre  -> 在组件更新前运行
    sync -> 在组件更新时同步运行
    post -> 在组件更新后运行（默认）
    ```
  - 选项`onTrack`，`watch`依赖收集时调用，用于 debugger，只在开发模式（development）可用；
  - 选项`onTrigger`，`watch`重新运行时调用，用于 debugger，只在开发模式（development）可用；

##### 代码示例：

类型注解：

```js
// 侦听单个属性源
function watch<T>(
  source: WatcherSource<T>,
  callback: (
    value: T,
    oldValue: T,
    onInvalidate: InvalidateCbRegistrator
  ) => void,
  options?: WatchOptions
): StopHandle

// 侦听多个属性源
function watch<T extends WatcherSource<unknown>[]>(
  sources: T
  callback: (
    values: MapSources<T>,
    oldValues: MapSources<T>,
    onInvalidate: InvalidateCbRegistrator
  ) => void,
  options? : WatchOptions
): StopHandle

type WatcherSource<T> = Ref<T> | (() => T)

type MapSources<T> = {
  [K in keyof T]: T[K] extends WatcherSource<infer V> ? V : never
}

// 从 `watchEffect` 类型扩展
interface WatchOptions extends WatchEffectOptions {
  immediate?: boolean // default: false
  deep?: boolean
  // flush?: 'pre' | 'post' | 'sync'
  // onTrack?: (event: DebuggerEvent) => void
  // onTrigger?: (event: DebuggerEvent) => void
}

interface DebuggerEvent {
  effect: ReactiveEffect
  target: any
  type: OperationTypes
  key: string | symbol | undefined
}

type InvalidateCbRegistrator = (invalidate: () => void) => void

type StopHandle = () => void
```

侦听单属性：

```javascript
// 侦听 getter
const state = reactive({ count: 0 });
watch(
  () => state.count,
  (count, prevCount) => {
    /* ... */
  },
);

// 直接侦听 ref
const count = ref(0);
const stop = watch(count, (count, prevCount) => {
  /* ... */
});

// later 手动结束 watch
setTimeout(() => {
  stop();
}, 200);
```

侦听多属性：

```javascript
watch([fooRef, barRef], ([foo, bar], [prevFoo, prevBar]) => {
  /* ... */
});
```

同步 Invalidation sync：

```javascript
const data = ref(null);
watch(data, (data, prevData, onInvalidate) => {
  const token = performAsyncOperation(data.value);
  onInvalidate(() => {
    // id 发生了变化或者 watcher 被终止
    // 手动终止上一个未结束的异步操作
    token.cancel();
  });
});
```

异步 Invalidation async：

```javascript
const data = ref(null);
watch(data, async (data, prevData, onInvalidate) => {
  onInvalidate(() => {...}); // 在异步函数 resolve 前注册清理函数
  data.value = await fetchData(props.id);
})
```

参数选项：

```javascript
const data = ref(null);
watch(
  data,
  (data, prevData) => {
    /* side effect */
  },
  {
    immediate: true, // 立即执行
    deep: true, // 深度侦听
    flush: 'pre', // 改变执行时机
    // 收集依赖时 debug
    onTrack(e) {
      debugger;
    },
    // 被触发时 debug
    onTrigger(e) {
      debugger;
    },
  },
);
```

---

### setup

##### 变化描述：

- 添加`setup`组件选项，在组件**创建前**被调用，接收`props`和`context`两个参数；

##### 代码示例：

类型注解：

```js
interface Data {
  [key: string]: unknown;
}

interface SetupContext {
  attrs: Data;
  slots: Slots;
  emit: (event: string, ...args: unknown[]) => void;
}

function setup(props: Data, context: SetupContext): Data;
```

使用`<template>`的方式：

```html
<!-- MyBook.vue -->
<template>
  <div>{{ readersNumber }} {{ book.title }}</div>
</template>

<script>
  import { ref, reactive } from 'vue';

  export default {
    setup() {
      const readersNumber = ref(0);
      const book = reactive({ title: 'Vue 3 Guide' });

      // expose to template
      return {
        readersNumber,
        book,
      };
    },
  };
</script>
```

使用`render` function 的方式：

```js{10}
// MyBook.vue

import { h, ref, reactive } from 'vue';

export default {
  setup() {
    const readersNumber = ref(0);
    const book = reactive({ title: 'Vue 3 Guide' });
    // 注意返回的 render 函数内使用 ref 类型的值，应该取它的 value 值
    return () => h('div', [readersNumber.value, book.title]);
  },
};
```

---

### setup 专用生命周期钩子

##### 变化描述：

- 增加`setup()`专用的生命周期钩子，除`beforeCreate`和`created`外其它钩子与选项内的钩子相同，如同下表：

  | 选项 API        | `setup()`内 API   |
  | :-------------- | :---------------- |
  | beforeCreate    | N/A               |
  | created         | N/A               |
  | beforeMount     | onBeforeMount     |
  | mounted         | onMounted         |
  | beforeUpdate    | onBeforeUpdate    |
  | updated         | onUpdated         |
  | beforeUnmount   | onBeforeUnmount   |
  | unmounted       | onUnmounted       |
  | errorCaptured   | onErrorCaptured   |
  | renderTracked   | onRenderTracked   |
  | renderTriggered | onRenderTriggered |

##### 代码示例：

```javascript
import { onMounted, onUpdated, onUnmounted } from 'vue';

const MyComponent = {
  setup() {
    onMounted(() => {
      console.log('mounted!');
    });
    onUpdated(() => {
      console.log('updated!');
    });
    onUnmounted(() => {
      console.log('unmounted!');
    });
  },
};
```

---

### Teleport

##### 变化描述：

- 添加`<teleport>`组件；
- 需要通过 prop `to` 给`<teleport>`组件提供一个目标元素，值可选项为`HTMLElement`或者是一个合法的`querySelector`字符串；
- `<teleport>`组件将会移动它的 children 元素到上面指定的 DOM；
- 在 virtual DOM 的层面上，children 元素仍属于`<teleport>`的后代，因此`<teleport>`包含的其它自定义子组件可以访问到祖先组件的注入（injections）；
- 多个`<teleport>`组件具有相同的`to`目标时，将会按照组件顺序 append 到目标 DOM 内；

##### 代码示例：

```html{4,14}
<body>
  <div id="app">
    <h1>Move the #content with the portal component</h1>
    <teleport to="#endofbody">
      <div id="content">
        <p>
          this will be moved to #endofbody.<br />
          Pretend that it's a modal
        </p>
        <Child />
      </div>
    </teleport>
  </div>
  <div id="endofbody"></div>
  <script>
    new Vue({
      el: '#app',
      components: {
        Child: { template: '<div>Placeholder</div>' },
      },
    });
  </script>
</body>
```

```html
<!-- result-->

<div id="app">
  <!-- -->
</div>
<div id="endofbody">
  <div id="content">
    <p>
      this will be moved to #endofbody.<br />
      Pretend that it's a modal
    </p>
    <div>Placeholder</div>
  </div>
</div>
```

多个`<teleport>`目标为同一个 DOM 的情况：

```html
<teleport to="#modals">
  <div>A</div>
</teleport>
<teleport to="#modals">
  <div>B</div>
</teleport>
```

```html
<!-- result-->

<div id="modals">
  <div>A</div>
  <div>B</div>
</div>
```

---

### 多根元素 Fragments(multi-root node)

##### 变化描述：

- 不再限制自定义组件只能具有一个根元素，支持多个根元素的情况；

##### 代码变化对比：

2.x

```html
<!-- Layout.vue -->
<template>
  <div>
    <header>...</header>
    <main>...</main>
    <footer>...</footer>
  </div>
</template>
```

3.x

```html
<!-- Layout.vue -->
<template>
  <header>...</header>
  <main v-bind="$attrs">...</main
  ><!-- 手动绑定组件外部未声明为 prop 的属性 -->
  <footer>...</footer>
</template>
```

---

### Suspense

##### 变化描述：

- 增加`<suspense>`组件，用于控制数据显示；
- 需要提供两个`<template>`作为`<suspense>`的子元素，id 为`default`的模板装载的内容为正常显示内容，id 为`fallback`的模板装载的内容为无内容时显示；

##### 代码示例：

```html{3,11}
<template>
  <Suspense>
    <template #default>
      <div v-for="item in articleList" :key="item.id">
        <article>
          <h2>{{ item.title }}</h2>
          <p>{{ item.body }}</p>
        </article>
      </div>
    </template>
    <template #fallback>
      Articles loading...
    </template>
  </Suspense>
</template>

<script>
  import getArticleList from 'getArticleList';
  export default {
    async setup() {
      let articleList = await getArticleList();
      return {
        articleList,
      };
    },
  };
</script>
```

---

### 自定义事件 Events

##### 变化描述：

- 增加组件`emits`选项，用于定义该组件需要关注的事件，当该选项包含原生事件（e.g.，`click`）时，该原生事件将被组件的自定义事件覆盖；
- `emits`选项内可指定事件的校验函数，用于事件触发时校验提供的参数是否合理；

##### 代码示例：

使用数组结构定义：

```js
app.component('custom-form', {
  emits: ['in-focus', 'submit'],
});
```

使用对象结构定义：

```javascript
app.component('custom-form', {
  emits: {
    // 不校验事件
    click: null,

    // 校验触发的事件
    submit: ({ email, password }) => {
      if (email && password) {
        return true;
      } else {
        console.warn('Invalid submit event payload!');
        return false;
      }
    },
  },
  methods: {
    submitForm() {
      this.$emit('submit', { email, password });
    },
  },
});
```

---

### 自定义渲染器 Renderer

##### 变化描述：

- 支持使用 API`createRenderer`自定义渲染器，调用该 API 需要返回`render`和`createApp`两个全局 API；

##### 代码示例：

```js
import { createRenderer } from 'vue'
const { render, createApp } = createRenderer<Node, Element>({
  patchProp,
  ...nodeOps
});
```

---

## BREAKING | 破坏性更改

### 全局 API Global

##### 变化描述：

- 提供的新的`createApp` api 用以声明式实例化应用；
- 部分`Vue`构造函数的静态方法转变为全局方法，并移除`$`开头的同名实例方法，整体变化如下：
  | 2.x 静态方法 | 3.x 全局方法 |
  | :---------------- | :----------------- |
  |Vue.nextTick|nextTick|
  |Vue.observable|reactive|
  |Vue.version|version|
  |Vue.compile|compile|
  |Vue.set|set|
  |Vue.delete|delete|

- 部分全局 API 变为实例 API，整体变化如下：
  | 2.x 全局 API | 3.x 实例 API |
  | :---------------- | :----------------- |
  | Vue.config | app.config |
  | Vue.config.productionTip | N/A |
  | Vue.config.ignoredElements | app.config.isCustomElement |
  | Vue.component | app.component |
  | Vue.directive | app.directive |
  | Vue.mixin | app.mixin |
  | Vue.use | app.use |
- 提供内部帮助函数作为全局 API，例如`h`、`Transition`、`withDirectives`、`vShow`...

##### 代码实现：

`createApp`

```javascript
import { createApp } from 'vue';

const app = createApp({});
app.mount('#app');
```

全局方法：

```js
import { shallowMount } from '@vue/test-utils';
import { MyComponent } from './MyComponent.vue';
import { nextTick } from 'vue';

test('an async feature', async () => {
  const wrapper = shallowMount(MyComponent);

  // execute some DOM-related tasks

  await nextTick();

  // run your assertions
});
```

实例方法：

```js
const app = createApp(MyApp);

app.component('button-counter', {
  data: () => ({
    count: 0,
  }),
  template: '<button @click="count++">Clicked {{ count }} times.</button>',
});

app.directive('focus', {
  mounted: el => el.focus(),
});

// now every application instance mounted with app.mount(), along with its
// component tree, will have the same “button-counter” component
// and “focus” directive without polluting the global environment
app.mount('#app');
```

内部帮助函数：

```js
import { h, Transition, withDirectives, vShow } from 'vue';

export function render() {
  return h(Transition, [withDirectives(h('div', 'hello'), [[vShow, this.ok]])]);
}
```

---

### 双向绑定 v-model

##### 变化描述：

- 自定义组件内的`v-model`的 prop 和 event 默认名称变更如下：
  ```text
  prop: value -> modelValue;
  event: input -> update:modelValue;
  ```
- `v-bind`的`.sync`修饰符和自定义组件的`model`选项移除，并用`v-model`上的参数作为替代；
- 自定义组件支持多个自定义的`v-model`绑定；
- `v-model`支持自定义修饰符；

##### 代码变化对比：

2.x

默认使用方式：

```html
<ChildComponent v-model="pageTitle" />

<!-- 等价于下面的写法: -->

<ChildComponent :value="pageTitle" @input="pageTitle = $event" />
```

自定义`v-model`的 prop 和 event 的使用方式：

```html
<!-- ParentComponent.vue -->

<ChildComponent v-model="pageTitle" />
```

```js{4-7}
// ChildComponent.vue

export default {
  model: {
    prop: 'title',
    event: 'change',
  },
  props: {
    // 释放 `value` prop 以用作其它用途
    value: String,
    // 使用 `title` 替换默认的 `value` v-model 值
    title: {
      type: String,
      default: 'Default title',
    },
  },
};
```

```html
<!-- 等价于下面的写法: -->

<ChildComponent :title="pageTitle" @change="pageTitle = $event" />
```

使用`v-bind.sync`的方式：

```js
// 在子组件内 emit 以 :update 开头的自定义事件

this.$emit('update:title', newValue);
```

```html
<!-- 监听自定义的 update 事件 -->

<ChildComponent :title="pageTitle" @update:title="pageTitle = $event" />

<!-- 等价于下面的写法: -->

<ChildComponent :title.sync="pageTitle" />
```

3.x

默认使用方式：

```html
<ChildComponent v-model="pageTitle" />

<!-- 等价于下面的写法: -->
<!-- value -> modelValue -->
<!-- input -> update:modelValue -->

<ChildComponent :modelValue="pageTitle" @update:modelValue="pageTitle = $event" />
```

自定义`v-model`和多个`v-model`的方式（`.sync`因这种实现方式而不再有用，所以废除）：

```html
<ChildComponent v-model:title="pageTitle" v-model:content="pageContent" />

<!-- 等价于下面的写法: -->

<ChildComponent :title="pageTitle" @update:title="pageTitle = $event" :content="pageContent" @update:content="pageContent = $event" />
```

![](./pic-0.png)

---

`v-model`自定义修饰符：

```html{2}
<div id="app">
  <my-component v-model.capitalize="myText"></my-component>
  {{ myText }}
</div>
```

```js{13-15,21}
const app = Vue.createApp({
  data() {
    return {
      myText: '',
    };
  },
});

app.component('my-component', {
  props: {
    modelValue: String,
    // 默认修饰符的 prop 为 modelModifiers，自定义 v-model 的修饰符形如：[propName]Modifiers，
    modelModifiers: {
      default: () => ({}),
    },
  },
  methods: {
    emitValue(e) {
      let value = e.target.value;
      // 根据修饰符可以做相应处理
      if (this.modelModifiers.capitalize) {
        value = value.charAt(0).toUpperCase() + value.slice(1);
      }
      this.$emit('update:modelValue', value);
    },
  },
  template: `<input
    type="text"
    :value="modelValue"
    @input="emitValue">`,
});

app.mount('#app');
```

自定义 v-model 情况下的自定义修饰符：

```html
<my-component v-model:foo.capitalize="bar"></my-component>
```

```js{2,9}
app.component('my-component', {
  props: ['foo', 'fooModifiers'],
  template: `
    <input type="text"
      :value="foo"
      @input="$emit('update:foo', $event.target.value)">
  `,
  created() {
    console.log(this.fooModifiers); // { capitalize: true }
  },
});
```

---

### 渲染函数 API Render

##### 变化描述：

- `h`需要从`Vue`全局引入，以取代原`render`函数内提供的`createElement`函数；
- render 函数不再接受任何参数；
- VNodes 的 props 结构扁平化；

##### 代码变化对比：

render 函数参数

2.x

```javascript
// Vue 2 Render Function Example
export default {
  render(h) {
    return h('div');
  },
};
```

3.x

```javascript{2}
// Vue 3 Render Function Example
import { h } from 'vue';

export default {
  render() {
    return h('div');
  },
};
```

---

render 函数签名变化

2.x

```javascript
// Vue 2 Render Function Example
export default {
  render(h) {
    return h('div');
  },
};
```

3.x

```javascript
import { h, reactive } from 'vue';

export default {
  setup(props, { slots, attrs, emit }) {
    const state = reactive({
      count: 0,
    });

    function increment() {
      state.count++;
    }

    // return the render function
    return () =>
      h(
        'div',
        {
          onClick: increment,
        },
        state.count,
      );
  },
};
```

---

VNode props 格式

2.x

```js
// 2.x
{
  class: ['button', 'is-outlined'],
  style: { color: '#34495E' },
  attrs: { id: 'submit' },
  domProps: { innerHTML: '' },
  on: { click: submitForm },
  key: 'submit-button'
}
```

3.x

```js{5-7}
// 3.x Syntax
{
  class: ['button', 'is-outlined'],
  style: { color: '#34495E' },
  id: 'submit',
  innerHTML: '',
  onClick: submitForm,
  key: 'submit-button'
}
```

---

### 函数式组件 Functional Component

##### 变化描述：

- 函数式组件的性能优化已经在 3.x 被忽略，建议只使用有状态的组件；
- 函数式组件只能使用简单函数创建，该函数接收`props`和`context`两个参数；
- 单文件组件的`functional`属性移除；
- `{ functional: true }`选项移除；

##### 代码变化对比：

2.x

无`<template>`的情况：

```javascript{2}
export default {
  functional: true,
  props: ['level'],
  render(h, { props, data, children }) {
    return h(`h${props.level}`, data, children);
  },
};
```

带`<template>`的情况：

```html{2}
<template>
  <template functional>
    <component :is="`h${props.level}`" v-bind="attrs" v-on="listeners" />
  </template>

  <script>
    export default {
      props: ['level'],
    };
  </script></template
>
```

3.x

```javascript
import { h } from 'vue';

const DynamicHeading = (props, context) => {
  return h(`h${props.level}`, context.attrs, context.slots);
};

DynamicHeading.props = ['level'];

export default DynamicHeading;
```

---

### 异步组件 Async Component

##### 变化描述：

- 使用新的`defineAsyncComponent`方法定义异步组件；
- 定义组件带选项时，`component`更名为`loader`；
- 新的`loader`选项必须返回一个 **_Promise_**；
- 定义组件带选项时，`loading`更名为`LoadingComponent`；
- 定义组件带选项时，`error`更名为`errorComponent`；
- 新增定义组件选项`retryWhen`，用于控制当组件加载失败时，指定情况才进行重试加载；
- 新增定义组件选项`maxRetries`，控制重试加载的次数；
- 新增定义组件选项`suspensible`，默认为 true，为 true 时，定义的`loadingComponent`和`errorComponent`将被无视；

##### 代码变化对比：

2.x

```javascript
import ErrorComponent from './components/ErrorComponent.vue';
import LoadingComponent from './components/LoadingComponent.vue';

// 无选项异步组件
Vue.component('async-component', () => import('./my-async-component'));

// 带选项异步组件
const AsyncComponent = () => ({
  // 需要加载的组件 (应该是一个 `Promise` 对象)
  component: import('./MyComponent.vue'),
  // 异步组件加载时使用的组件
  loading: LoadingComponent,
  // 加载失败时使用的组件
  error: ErrorComponent,
  // 展示加载时组件的延时时间。默认值是 200 (毫秒)
  delay: 200,
  // 如果提供了超时时间且组件加载也超时了，
  // 则使用加载失败时使用的组件。默认值是：`Infinity`
  timeout: 3000,
});
```

3.x

```javascript{3,11}
import ErrorComponent from './components/ErrorComponent.vue';
import LoadingComponent from './components/LoadingComponent.vue';
import { defineAsyncComponent } from 'vue';

// 无选项异步组件
const asyncPage = defineAsyncComponent(() => import('./my-async-component'));

// 带选项异步组件
const asyncPageWithOptions = defineAsyncComponent({
  // component 更名为 loader
  loader: () => import('./my-async-component'),
  // A component to use while the async component is loading
  loadingComponent: LoadingComponent,
  // A component to use if the load fails
  errorComponent: ErrorComponent,
  // Delay before showing the loading component. Default: 200ms.
  delay: 200,
  // The error component will be displayed if a timeout is
  // provided and exceeded. Default: Infinity.
  timeout: 3000,
  // A function that returns a boolean indicating whether the async component should retry when the loader promise rejects
  retryWhen: error => error.code !== 404,
  // Maximum allowed retries number
  maxRetries: 3,
  // Defining if component is suspensible
  suspensible: false,
});
```

---

### Data 选项

##### 变化描述：

- `data`组件选项声明不再接受对象字面量，只接受`function`的声明方式；

##### 代码变化对比：

2.x

```html
<!-- Object Declaration -->
<script>
  const app = new Vue({
    data: {
      apiKey: 'a1b2c3',
    },
  });
</script>

<!-- Function Declaration -->
<script>
  const app = new Vue({
    data() {
      return {
        apiKey: 'a1b2c3',
      };
    },
  });
</script>
```

3.x

```html{5-9}
<script>
  import { createApp } from 'vue';

  createApp({
    data() {
      return {
        apiKey: 'a1b2c3',
      };
    },
  }).mount('#app');
</script>
```

---

### 自定义元素 Elements

##### 变化描述：

- 自定义元素白名单现在在模板编译期间执行，并且应该通过编译器选项而不是运行时配置来配置；
- 特殊的`is` prop 现在限定只能在`<component>`上使用；
- 提供新的`v-is`指令以支持 2.x 的使用情况；

##### 代码变化对比：

2.x

```javascript
// 这可以使 Vue 忽略在外部定义的自定义元素
// (e.g., 使用 Web Components APIs 定义的元素)

Vue.config.ignoredElements = ['plastic-button'];
```

3.x

使用打包工具选项定义的情况：

```javascript
// in webpack config
rules: [
  {
    test: /\.vue$/,
    use: 'vue-loader',
    options: {
      compilerOptions: {
        isCustomElement: tag => tag === 'plastic-button',
      },
    },
  },
  // ...
];
```

使用运行时定义的情况（注意这种配置对预编译的模板无效）：

```javascript
const app = Vue.createApp({});
app.config.isCustomElement = tag => tag === 'plastic-button';
```

---

### 插槽 Slots

##### 变化描述：

- 指定 slot 的方式由对象字面量变为函数式；
- `this.$scopedSlots`移除；

##### 代码变化对比：

2.x

```javascript
// 2.x Syntax
h(LayoutComponent, [h('div', { slot: 'header' }, this.header), h('div', { slot: 'content' }, this.content)]);
```

```js
// 2.x 在组件内获取指定的槽
this.$scopedSlots.header;
```

3.x

```javascript
// 3.x Syntax
h(
  LayoutComponent,
  {},
  {
    header: () => h('div', this.header),
    content: () => h('div', this.content),
  },
);
```

```js
// 3.x 在组件内获取指定的槽
this.$slots.header;
```

---

### 动态绑定属性处理

##### 变化描述：

- 删除 Vue 内部定义的“枚举属性”（`contenteditable`，`draggable`和`spellcheck`）概念，并将这些“枚举属性”当作非布尔值处理；
- 当 DOM 上的动态属性绑定值为`false`时，不再删除该属性。如果需要删除属性，使用`null`或者`undefined`；

##### 属性处理变化对比：

2.x

| 绑定表达式        | `foo`(常规值) | `draggable`(枚举值) |
| :---------------- | :------------ | :------------------ |
| :attr="null"      | N/A           | draggable="false"   |
| :attr="undefined" | N/A           | N/A                 |
| :attr="true"      | foo="true"    | draggable="true"    |
| :attr="false"     | N/A           | draggable="false"   |
| :attr="0"         | foo="0"       | draggable="true"    |
| attr=""           | foo=""        | draggable="true"    |
| attr="foo"        | foo="foo"     | draggable="true"    |
| attr              | foo=""        | draggable="true"    |

3.x

| 绑定表达式        | `foo`(常规值)      | `draggable`(枚举值)  |
| :---------------- | :----------------- | :------------------- |
| :attr="null"      | N/A                | **N/A** \*           |
| :attr="undefined" | N/A                | N/A                  |
| :attr="true"      | foo="true"         | draggable="true"     |
| :attr="false"     | **foo="false"** \* | draggable="false"    |
| :attr="0"         | foo="0"            | **draggable="0"** \* |
| attr=""           | foo=""             | **draggable=""** \*  |
| attr="foo"        | foo="foo"          | **draggable="o"** \* |
| attr              | foo=""             | **draggable=""** \*  |

\*：发生变化

---

### 自定义指令 Directives

##### 变化描述：

- 重命名自定义指令的生命周期钩子，使其与组件的生命周期一致(部分)：

  ```text
  - bind → beforeMount

  - inserted → mounted

  - beforeUpdate: 新钩子，在元素更新前调用

  - update → 已删除

  - beforeUnmount 新钩子，在元素卸载前调用

  - unbind -> unmounted
  ```

- 当指令应用在自定义组件时，需要在组件内使用`v-bind="$attrs"`手动绑定到具体的 DOM，因为可能存在多根元素的情况；

##### 代码变化对比：

2.x

```html
<p v-highlight="yellow">Highlight this text bright yellow</p>
```

```javascript
Vue.directive('highlight', {
  bind(el, binding, vnode) {
    el.style.background = binding.value;
  },
});
```

3.x
使用在原生 DOM 的情况：

```html
<p v-highlight="yellow">Highlight this text bright yellow</p>
```

```javascript
const app = Vue.createApp({});

app.directive('highlight', {
  beforeMount(el, binding, vnode) {
    el.style.background = binding.value;
  },
  mounted() {},
  beforeUpdate() {}, // new
  updated() {},
  beforeUnmount() {}, // new
  unmounted() {},
});
```

使用在自定义组件的情况：

组件外部：

```html
<custom-component v-highlight="yellow" />
```

组件内部：

```html
<template>
  <p v-bind="$attrs">Highlight this text bright yellow</p>
  <p v-bind="$attrs">Highlight this text bright yellow</p>
  <p>Keep this text normal</p>
</template>
```

---

### 动画组件 Transition Component

##### 变化描述：

- 当`<transition>`作为组件根元素时，在组件外部使用`v-if`或者`v-show`改变显隐值将不再生效，需要暴露指定值来控制显隐以驱动 transition 动画；
- 将`v-enter` transition class 更名为`v-enter-from`；
- 将`v-leave` transition class 更名为`v-leave-from`；

##### 代码变化对比：

`<transition>`作为组件根元素：

2.x

```html{9}
<!-- modal component -->
<template>
  <transition>
    <div class="modal"><slot /></div>
  </transition>
</template>

<!-- usage -->
<modal v-if="showModal">hello</modal>
```

3.x

```html{9}
<!-- modal component -->
<template>
  <transition>
    <div v-if="show" class="modal"><slot /></div>
  </transition>
</template>

<!-- usage -->
<modal :show="showModal">hello</modal>
```

---

class 更名：

2.x

```css
/* before */
.v-enter,
.v-leave-to {
  opacity: 0;
}
.v-leave,
.v-enter-to {
  opacity: 1;
}
```

3.x

```css
/* after */
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.v-leave-from,
.v-enter-to {
  opacity: 1;
}
```

---

### 侦听器 API Watch

##### 变化描述：

- 更改形如`a.b.c`的键路径观察方式为计算函数式，如`() => this.a.b.c`；

##### 代码变化对比：

2.x

```javascript
// 键路径
vm.$watch('a.b.c', function(newVal, oldVal) {
  // 做点什么
});
```

3.x

```javascript{2,10}
vm.$watch(
  () => vm.a.b.c,
  (newVal, oldVal) => {
    // 做点什么
  },
);

// 多依赖的情况
vm.$watch(
  () => vm.a.b.c + vm.d.e.f,
  (newVal, oldVal) => {
    // 做点什么
  },
);
```

---

### 响应式注入 Provide / Inject

##### 变化描述：

- 通过`ref`、`computed`和`reactive` api，现在可以注入响应式的值和该值对应的更新方法；

##### 代码变化对比：

2.x

```javascript
// 父级组件提供 'foo'
var Provider = {
  provide: {
    foo: 'bar',
  },
  // ...
};

// 子组件注入 'foo'
var Child = {
  inject: ['foo'],
  created() {
    console.log(this.foo); // => "bar"
  },
  // ...
};
```

3.x

在组件选项内定义的情况：

```js{5}
app.component('todo-list', {
  // ...
  provide() {
    return {
      todoLength: Vue.computed(() => this.todos.length),
    };
  },
});
```

在`setup`函数内定义的情况：

```html{21-23,27}
<!-- src/components/MyMap.vue -->
<template>
  <MyMarker />
</template>

<script>
  import { provide, reactive, ref } from 'vue'
  import MyMarker from './MyMarker.vue

  export default {
    components: {
      MyMarker
    },
    setup() {
      const location = ref('North Pole')
      const geolocation = reactive({
        longitude: 90,
        latitude: 135
      })

      const updateLocation = () => {
        location.value = 'South Pole'
      }

      provide('location', location)
      provide('geolocation', geolocation)
      provide('updateLocation', updateLocation)
    }
  }
</script>
```

```html{9,14}
<!-- src/components/MyMarker.vue -->
<script>
  import { inject } from 'vue';

  export default {
    setup() {
      const userLocation = inject('location', 'The Universe');
      const userGeolocation = inject('geolocation');
      const updateUserLocation = inject('updateUserLocation'); // 注入更新方法

      return {
        userLocation,
        userGeolocation,
        updateUserLocation, // 可再导出更新方法
      };
    },
  };
</script>
```

---

## REMOVED | 废弃功能特性

### 事件 API Events

##### 变化描述：

- `$on`，`$off`和`$once`实例方法移除。应用实例不再提供事件中心的接口。

##### 代码变化对比：

2.x

```javascript
// eventHub.js

const eventHub = new Vue();

export default eventHub;
```

```javascript
// ChildComponent.vue
import eventHub from './eventHub';

export default {
  mounted() {
    // adding eventHub listener
    eventHub.$on('custom-event', () => {
      console.log('Custom event triggered!');
    });
  },
  beforeDestroy() {
    // removing eventHub listener
    eventHub.$off('custom-event');
  },
};
```

```javascript
// ParentComponent.vue
import eventHub from './eventHub';

export default {
  methods: {
    callGlobalCustomEvent() {
      eventHub.$emit('custom-event'); // if ChildComponent is mounted, we will have a message in the console
    },
  },
};
```

3.x

`$on`，`$off`和`$once`实例方法移除。保留`$emit`实例方法作为子组件发射自定义事件的 api。

---

### 事件修饰符 KeyCode

##### 变化描述：

- `v-on`指令的修饰符不再支持 keyCodes；
- 移除`config.keyCodes`;

##### 代码变化对比：

2.x

```html
<!-- keyCode version -->
<input v-on:keyup.13="submit" />

<!-- alias version -->
<input v-on:keyup.enter="submit" />
```

```js
Vue.config.keyCodes = {
  f1: 112,
};
```

```html
<!-- keyCode version -->
<input v-on:keyup.112="showHelpText" />

<!-- custom alias version -->
<input v-on:keyup.f1="showHelpText" />
```

3.x

```html
<!-- Vue 3 Key Modifier on v-on -->
<input v-on:keyup.delete="confirmDelete" />
```

---

### 过滤器 Filters

##### 变化描述：

- 完全移除`Filters`；

##### 代码变化对比：

2.x

```html
<template>
  <h1>Bank Account Balance</h1>
  <p>{{ accountBalance | currencyUSD }}</p>
</template>

<script>
  export default {
    props: {
      accountBalance: {
        type: Number,
        required: true,
      },
    },
    filters: {
      currencyUSD(value) {
        return '$' + value;
      },
    },
  };
</script>
```

3.x

使用计算属性或者自定义方法处理：

```html{15-17}
<template>
  <h1>Bank Account Balance</h1>
  <p>{{ accountInUSD }}</p>
</template>

<script>
  export default {
    props: {
      accountBalance: {
        type: Number,
        required: true,
      },
    },
    computed: {
      accountInUSD() {
        return '$' + this.accountBalance;
      },
    },
  };
</script>
```

---

### 行内模板属性 inline-template

##### 变化描述：

- 完全移除`inline-template`方法；

##### 代码变化对比：

2.x

```html
<my-component inline-template>
  <div>
    <p>These are compiled as the component's own template.</p>
    <p>Not parent's transclusion content.</p>
  </div>
</my-component>
```

3.x

不再支持`inline-template`。

## 总结

通过学习 Vue 3.x 的新特性可以体会到，Vue 在**性能**、**工程化**和**可移植性**这三个大方向里面作出了很大的努力，主要体现在这五个方面：

- Tree-shaking support；
  - 大多数可选功能现在都支持 Tree-shaking，例如 Composition API、`v-model`、`<transition>`；
  - 最小可运行的 HelloWorld 例子的文件总大小: 13.5kb， 只使用 Composition API 的情况下最小可达到 11.75kb；
  - 全运行时打包总大小为: 22.5kb，功能更多更强大，但是大小比 Vue 2 更小；
- Composition API；
  - 可与原有的选项 API 同时存在，更灵活和更易于 2.x 升级 3.x，同时利于开发人员  过渡升级版本；
  - 更加灵活的逻辑组合和复用，大大地提升了复杂组件的可维护性；
  - Reactivity 模块可作为独立的库使用，使得 Vue 3.x 在与其它框架配合使用时更加灵活；
- Fragment, Teleport, Suspense；
  - Fragment 特性的到来，可以使`<template>`中不再局限于单一的根节点，同时`render`函数也可以返回包含多个 Vnode 的数组；
  - Teleport 组件让原来的复杂组件的嵌套关系变得更加灵活和清晰；
  - Suspense 组件大大减少了书写异步数据 DOM 渲染和异步组件的代码量；
- Better TypeScript support；
  - Vue 3.x 库代码编写由原来的`flow`转换为`ts`，所以在编写业务代码时使用 ts 可以大大受益；
  - API 在 js 和 ts 环境下的使用一致；
  - 支持 TSX；
  - Class 组件仍然可用（需要引入`vue-class-component@next`）；
- Custom Renderer API；
  - 允许生成自定义的 renderer，降低了 Vue 3.x 迁移到其它平台的难度，比如小程序、Weex 等；
