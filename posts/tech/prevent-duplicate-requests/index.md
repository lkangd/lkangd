---
title: 控制前端业务重复请求的一个新思路
date: '2020-09-13'
spoiler: 少一个请求，少一分负担
---

[[TOC]]

## 需求背景

在上一家公司的时候，因为业务重组，笔者被分配到一个电商项目组，负责项目中 hybrid app 的前端模块功能迭代。该项目代码已经具有一定规模，长期的快速业务需求迭代，导致前端模块耦合的程度也到了不容忽视的时候，而且还存在一些小 bug。比如，没有对可能导致重复请求的场景进行处理。

### 重复请求的坏处

前端重复请求如果不及时处理可能会带来以下几个坏处：

- 消耗额外的 **服务器/客户端** 资源；
- 后端若未对请求做幂等处理，造成后端脏数据；
- 多个重复请求占据请求队列，达到浏览器并发请求上限，导致正常请求阻塞；

### 重复请求处理分析

因此，在新的需求没来之前，第一件事就是着手处理这个问题。众所周知，拦截重复请求的常规手段不外乎以下几种：

1. **请求发起后，前端添加 遮罩层+loading 提示。**
2. **对请求方法进行防抖和节流。**
3. **利用流行前端 ajax 库中的拦截器进行拦截取消，如 [axios](https://github.com/axios/axios){target=\_blank} 的 cancelToken。**

因为是新接手的具有一定规模的项目，使用一、二种方法去处理的话需要短时间内投入大量的工作量，而且还不能保证做到百分百的覆盖。第三种方法看来很适合，在统一的进出口进行处理，就不会有前两种方法的问题，但是这种捕捉到重复请求就立马取消，一刀切式的方式真的适合吗？

试想一下是不是会有这样的业务场景存在？

- A 页面作为总的页面入口，具有 BCDEF 等子页面。A 页面依赖请求 X 的数据；
- B 页面也依赖请求 X 的数据，但 CDEF 不依赖请求 X 的数据；
- 进入 A 页面时有可能在 X 请求前未返回前直接跳转到 B 页面；
- B 页面可能会作为独立的营销页对外公开；

如果进行了一刀切处理，在遇到「进入 A 页面时有可能在 X 请求前未返回前直接跳转到 B 页面」这种情况时，B 页面所依赖的 X 数据就再也拿不到了。如果在 B 页面添加额外处理逻辑，就会遇到第一二种方法同样的问题。

虽然方法三也不可行，但在统一的出入口进行处理这个思路是没有问题的。我们需要改进一下这个一刀切的操作，在避免重复请求的同时保证原来的业务逻辑不能受到影响。

如何改进？首先先来看看拦截器的实现原理是怎样的。

## 在拦截器里管理重复请求

### 拦截器的实现原理

在使用了如 axios 的前端请求库的请求过程一般如下图所示，在调用请求方法时，传入`Options`，然后这个请求配置会经过请求拦截器`RequestInterceptor`处理，过后配置传到`Request`方法中进行正式请求，待请求从服务端返回后将请求交给响应拦截器`ResponseInterceptor`进行处理，处理完成后将数据交给业务逻辑：

```text
         ┌─────────┐
         │ Options │
         └─────────┘
              │
┌ ─ ─ ─ ─ ─ ─ ┼ ─ ─ ─ ─ ─ ─┐ ─ ─ ─ ─┐
              ▼
│  ┌────────────────────┐  │        │
   │ RequestInterceptor │
│  └────────────────────┘  │        │
              │
│             ▼            │        │
   ┌────────────────────┐
│  │  Request(Options)  │  │     请求过程
   └────────────────────┘
│             │            │        │
              ▼
│  ┌────────────────────┐  │        │
   │ ResponseInterceptor│
│  └────────────────────┘  │        │
              │
└ ─ ─ ─ ─ ─ ─ ┼ ─ ─ ─ ─ ─ ─┘ ─ ─ ─ ─┘
              │
              ▼
         ┌─────────┐
         │ bsLogic │
         └─────────┘
```

那么 axios 等类库是如何将这个过程串成一条链的呢？答案就是 promise。下来就用简单的代码示例讲解拦截器的实现原理。

首先创建一些请求拦截器和响应拦截器，在每个拦截器里面打印自身名称，方便请求时观察触发顺序：

```js
// 模拟配置
const config = { url: 'https://lkangd.com/', count: 0 };

// 模拟请求拦截器s
const reqInterceptor1 = config => {
  config.count++;
  console.log('reqInterceptor1');
  return config;
};
const reqInterceptor2 = config => {
  config.count++;
  console.log('reqInterceptor2');
  return config;
};
const reqInterceptor3 = config => {
  config.count++;
  console.log('reqInterceptor3');
  return config;
};
// 按倒序插入
const reqInterceptors = [reqInterceptor3, reqInterceptor2, reqInterceptor1];

// 模拟响应拦截器s
const resInterceptor1 = config => {
  config.count++;
  console.log('resInterceptor1');
  return config;
};
const resInterceptor2 = config => {
  console.log('resInterceptor2');
  config.count++;
  return config;
};
const resInterceptor3 = config => {
  console.log('resInterceptor3');
  config.count++;
  return config;
};
// 按正序插入
const resInterceptors = [resInterceptor1, resInterceptor2, resInterceptor3];
```

promise 的 then 方法会默认返回一个新的 promise，我们可以利用这个特性，将所有拦截器包装起来，然后串成一条链：

```js{19-22}
const request = (config, reqInterceptors, resInterceptors) => {
  const makeRequest = config => {
    console.log('makeRequest!');
    return new Promise((resolve, reject) => {
      // 模拟请求延时
      setTimeout(() => {
        resolve({ data: 'response', ...config });
      }, 3000);
    });
  };
  const chain = [makeRequest];
  let promise = Promise.resolve(config);

  // 将请求拦截器放在请求前
  reqInterceptors.forEach(ri => chain.unshift(ri));
  // 将响应拦截器放在请求后
  resInterceptors.forEach(ri => chain.push(ri));

  // 将 chain 串成一条 promise 链
  while (chain.length) {
    promise = promise.then(chain.shift()); // then 的默认行为是返回一个新的 promise
  }
  // 将 promise 链返回
  return promise;
};
```

调用`request`方法，按参数顺序传入，配置、请求拦截器，响应拦截器，看打印结果：

```js
request(config, reqInterceptors, resInterceptors).then(data => {
  console.log(data);
});
// 留意触发顺序
// reqInterceptor1
// reqInterceptor2
// reqInterceptor3
// makeRequest!
// Promise {<pending>} 3 秒后打印下面的内容
// resInterceptor1
// resInterceptor2
// resInterceptor3
// {data: "response", url: "https://lkangd.com/", count: 6}，count 被处理了 6 次
```

### 实现重复请求管理器

知道了拦截器的实现原理之后，答案就呼之欲出了，我们不是直接取消掉后续的重复请求，而是将这些重复请求挂起，等到第一个元子请求的结果返回后，将这个结果传递给挂起的重复请求。这样就做到了重复请求只发出一次，但是业务逻辑不用做额外的处理，整个处理流程图如下所示：

```text
         ┌─────────┐
         │ Options │
         └─────────┘
              │
┌ ─ ─ ─ ─ ─ ─ ┼ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ──┐ ─ ─ ─ ─┐
              ▼
│  ┌────────────────────┐   Yes    ┌───────────────────┐  │        │
   │   hasRequesting?   │ ───────> │ waitForRequesting │
│  └────────────────────┘    ▲     └───────────────────┘  │        │
           No │              │ resolve        │
│             ▼              │                │           │        │
   ┌────────────────────┐    │                │
│  │   addRequesting    │    │                │           │        │
   └────────────────────┘    │                │
│             │              │                │           │        │
              ▼              │                │
│  ┌────────────────────┐    │                │           │        │
   │ requestInterceptor │    │                │
│  └────────────────────┘    │                │           │        │
              │              │                │
│             ▼              │                │           │     请求过程
   ┌────────────────────┐    │                │
│  │  request(Options)  │    │                │           │        │
   └────────────────────┘    │                │
│             │              │                │           │        │
              ▼              │                │
│  ┌────────────────────┐    │                │           │        │
   │ ResponseInterceptor│    │                │
│  └────────────────────┘    │                │           │        │
              │              │                │
│             ▼              │                │           │        │
   ┌────────────────────┐    │                │
│  │  resolveRequesting │ ───┘                │           │        │
   └────────────────────┘                     │
│             │<──────────────────────────────┘           │        │
              │
└ ─ ─ ─ ─ ─ ─ ┼ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘ ─ ─ ─ ─┘
              │
              ▼
         ┌─────────┐
         │ bsLogic │
         └─────────┘
```

第一步，如何识别多个请求是否重复请求？很简单，只要将每个新请求中的`method(请求方法)`、`params(请求参数)`、`body(请求体)`和`url(请求地址)`组装成一个新对象，然后对这个新对象进行 JSON 序列化，获得的字符串就是这个请求的唯一标识，如下所示：

```js
const { method, params, body, url } = request;
const _serialization = JSON.stringify({ method, params, body, url });
```

有了唯一标识后，第二步就是将**已经发出但是还未返回**的请求存储起来，在这个请求未返回期间，如果识别到具有同一标识的请求发生，就分配一个处于`pending`状态的 promise ，待请求结束后将请求结果去`resolve`所有`pending`状态中的 promise：

```js{9,14,20,21}
// 最简实现原理
const repeatRecord = {};
let count = 0;

function requestInterceptor(request) {
  const { method, params, body, url } = request;
  const _serialization = JSON.stringify({ method, params, body, url });

  if (repeatRecord[_serialization]) return repeatRecord[_serialization]; // 存在则立即返回

  return new Promise(resolve => {
    let resolveRepeat;
    repeatRecord[_serialization] = new Promise(resolve => {
      resolveRepeat = resolve; // 将新 promise 的 resolver 存储起来
    });

    setTimeout(() => {
      const result = `done! ${++count}`;
      // 使用结果同时 resolve 两个 promise
      resolve(result);
      resolveRepeat(result);
      delete repeatRecord[_serialization]; // 请求结束后删除状态
    }, 3000);
  });
}

// 进行 4 次重复请求，count 只累加了一次
const request = { method: 'GET', params: { p1: 'p1' }, body: { b1: 'b1' }, url: 'https://lkangd.com/' };
requestInterceptor(request).then(res => {
  console.log(res); // done! 1
});
requestInterceptor(request).then(res => {
  console.log(res); // done! 1
});
requestInterceptor(request).then(res => {
  console.log(res); // done! 1
});
requestInterceptor(request).then(res => {
  console.log(res); // done! 1
});
```

关键代码和思路已经具备，接下来就是完善整个管理器的实现了，除了请求成功的状态当然还会有请求失败的状态：

```js
const requestManager = {
  data: {}, // 存储请求
  resolvers: {}, // 存储每一个请求的 promise 的 resolve 回调
  rejecters: {}, // 存储每一个请求的 promise 的 reject 回调
  // 将新请求存入 data
  add(request) {
    const serialized = this._serialization(request);
    return (this.data[serialized] = new Promise((resolve, reject) => {
      this.resolvers[serialized] = resolve;
      this.rejecters[serialized] = reject;
    }));
  },
  // 获取请求中的请求
  get(request) {
    const serialized = this._serialization(request);
    return this.data[serialized];
  },
  // 请求成功时调用
  success(request, response) {
    const serialized = this._serialization(request);
    this.resolvers[serialized] && this.resolvers[serialized](response);
    this._clean(request);
  },
  // 请求失败时调用
  fail(request, error) {
    const serialized = this._serialization(request);
    this.rejecters[serialized] && this.rejecters[serialized](error);
    this._clean(request);
  },
  // 清除存储的请求
  _clean(request) {
    const serialized = this._serialization(request);
    delete this.resolvers[serialized];
    delete this.rejecters[serialized];
    delete this.data[serialized];
  },
  // 对请求的配置进行序列化，获得请求的唯一序列
  _serialization(request) {
    const { method, params, body, url } = request;
    return JSON.stringify({ method, params, body, url });
  },
};
```

最后就是在拦截器里面加入重复请求管理器的逻辑，有一个需要注意的地方是，这里笔者选择使用的是 [fly](https://github.com/wendux/fly){target=\_blank} 而不是 axios（原因后面再说），如下所示：

```js
import Flyio from 'flyio/dist/npm/fly';
const flyInstance = new Flyio();

const requestInterceptor = request => {
  const repeatedRequest = requestManager.get(request);
  if (repeatedRequest) return repeatedRequest; // 判断是否有相同请求正在进行中，有的话直接返回

  requestManager.add(request); // 添加新请求

  // do some stuff...

  return request;
};

const responseInterceptor = [
  response => {
    requesting.success(response.request, response.data); // 请求成功，响应其它重复请求的成功回调

    // do some stuff...

    return response.data;
  },
  error => {
    requesting.fail(error.request, error); // 请求失败，响应其它重复请求的失败回调

    // do some stuff...

    return Promise.reject(error);
  },
];

flyInstance.interceptors.request.use(requestInterceptor);
flyInstance.interceptors.response.use(...responseInterceptor);
```

## 为什么是 fly 不是 axios？

### axios 关键源码分析

我们打开 axios 的源码中的 [request](https://github.com/axios/axios/blob/master/lib/core/Axios.js#L49){target=\_blank}部分，可以看到在 promise 链的正中是`dispatchRequest`进行请求：

```js{3}
Axios.prototype.request = function request(config) {
  // ...
  var chain = [dispatchRequest, undefined]; // 默认调用方法是 dispatchRequest
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};
```

[`dispatchRequest`](https://github.com/axios/axios/blob/master/lib/core/dispatchRequest.js#L52){target=\_blank} 返回 adapter 对传入 config 进行处理后的结果：

```js{3}
module.exports = function dispatchRequest(config) {
  // ...
  return adapter(config); // ...
};
```

axios 默认的 adapter 是 xhr，最后去看看 adapter 的实现，发现最终`new XMLHttpRequest()`使用 config 中的 [data](https://github.com/axios/axios/blob/master/lib/adapters/xhr.js#L14){target=\_blank} 作为数据进行发送，如果传入的是 promise，肯定是不存在 data 属性的，最后只能产生错误。

```js
module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;

    // ...

    var request = new XMLHttpRequest();

    // ...

    request.send(requestData);
  });
};
```

### fly 关键源码分析

而 fly 在请求方法会对传入的 options 进行判断，如果经过请求拦截器处理后返回的结果不是 options，则将这个结果直接返回，所以就能达到我们上面流程图想要的结果：

```js{18,26-30}
// ...
class Fly {
  // ...
  request(url, data, options) {
    // ...
    enqueueIfLocked(requestInterceptor.p, () => {
      utils.merge(options, JSON.parse(JSON.stringify(this.config)));
      let headers = options.headers;
      headers[contentType] = headers[contentType] || headers[contentTypeLowerCase] || '';
      delete headers[contentTypeLowerCase];
      options.body = data || options.body;
      url = utils.trim(url || '');
      options.method = options.method.toUpperCase();
      options.url = url;
      let ret = options;
      if (requestInterceptorHandler) {
        // 处理请求拦截器逻辑
        ret = requestInterceptorHandler.call(requestInterceptor, options, Promise) || options;
      }
      if (!isPromise(ret)) {
        ret = Promise.resolve(ret);
      }
      ret.then(
        d => {
          //if options continue
          if (d === options) {
            makeRequest(d);
          } else {
            resolve(d); // 如果请求拦截器返回了非 options 结果，则跳过了请求阶段
          }
        },
        err => {
          reject(err);
        },
      );
    });
    // ...
  }
  // ...
}
// ...
```

### 能否使用 axios 达到目的？

我们知道，axios 和 fly 都支持使用自定义的 adapter 来作为请求发送器的，理论上，在 axios 生成实例的时候将原来默认的 adapter 包装一下，判断一下传入 config 是否为 promise，然后直接返回，应该是可以得到支持的。

```js
import Axios from 'axios';
const wrappedAdapter = config => {
  if ('function' == typeof config.then) return config;
  return Axios.defaults.adapter(config);
};

const instance = Axios.createInstance({ adapter: wrappedAdapter });
```

然后，理想很丰满，现实却是骨感的。因为 axios 在真正发送请求前，会在 dispatchRequest 方法内对传入的 config 进行多个特殊处理，而 dispatchRequest 的实现是不对外暴露的，所以如果此时 config 的类型为 promise，可能会产生很多意想不到的错误。因此，不建议对 axios 进行类似的包装操作。

```js{2-25}
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Support baseURL config
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  }

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(config.data, config.headers, config.transformRequest);

  // Flatten headers
  config.headers = utils.merge(config.headers.common || {}, config.headers[config.method] || {}, config.headers || {});

  utils.forEach(['delete', 'get', 'head', 'post', 'put', 'patch', 'common'], function cleanHeaderConfig(method) {
    delete config.headers[method];
  });

  var adapter = config.adapter || defaults.adapter;

  // 上面的代码都是对传入 config 的处理
  return adapter(config).then(
    function onAdapterResolution(response) {
      throwIfCancellationRequested(config);

      // Transform response data
      response.data = transformData(response.data, response.headers, config.transformResponse);

      return response;
    },
    function onAdapterRejection(reason) {
      if (!isCancel(reason)) {
        throwIfCancellationRequested(config);

        // Transform response data
        if (reason && reason.response) {
          reason.response.data = transformData(reason.response.data, reason.response.headers, config.transformResponse);
        }
      }

      return Promise.reject(reason);
    },
  );
};
```

## 结言

本文铺垫了一个特定的业务场景，讲述了前端重复请求会带来的几种危害，并且陈列了几种常规的前端控制重复请求的方法，然后针对每种方法进行简单分析，在不违反开放-封闭原则的前提下，对其中一种方法进行改进后达到了我们想要的结果。

这次优化给笔者带来的最大启发就是，我们在使用流行框架、库的时候，不应当仅仅学习其 api，更应该对其实现进行分析研究，这样在我们遇到特殊难题的时候可以获得更广阔的视野，从而获得更好的解决方案。
