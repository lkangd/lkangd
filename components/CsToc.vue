<template>
  <ul
    class="cs-toc"
    ref="csToc"
  >
    <li
      class="cs-toc__item"
      v-for="(node, index) in list"
      :key="index"
    >
      <a
        class="cs-toc__anchor"
        :class="{ 'cs-toc__anchor--sub': node.parentIndex !== -1,'is-active': index === activeMain || index ===  activeSub }"
        :href="node.anchor"
        @click="handleClick(node.parentIndex, index)"
      >
        <span class="cs-toc__text">{{ node.text }}</span>
      </a>
    </li>
  </ul>
</template>

<script>
/* eslint-disable no-console */
const LAYOUT_CLASS = '.cs-toc-dom';

export default {
  name: 'cs-toc',
  data() {
    return {
      list: [],
      anchors: [],
      activeMain: -1,
      activeSub: -1,
    };
  },
  mounted() {
    this.getLayout();
  },
  beforeDestroy() {
    window.onscroll = null;
  },
  methods: {
    handleClick(parentIndex, index) {
      if (parentIndex === -1) {
        this.activeMain = index;
        if (this.list[index + 1] && this.list[index + 1].parentIndex === index) {
          this.activeSub = index + 1;
        } else {
          this.activeSub = -1;
        }
      } else {
        this.activeMain = parentIndex;
        this.activeSub = index;
      }
      setTimeout(() => {
        this.$refs.csToc.scrollTo({
          left: 0,
          top: index * 16,
          // behavior: 'smooth',
        });
      }, 0);
    },
    getLayout() {
      const domLayout = document.querySelector(LAYOUT_CLASS);
      if (!domLayout || !domLayout.hasChildNodes()) return;
      const list = domLayout.childNodes[0];
      if (!list.hasChildNodes()) return;

      try {
        this.anchors = [];
        this.list = resolveDom(list).reduce((res, main) => {
          main.parentIndex = -1;
          res.push(main);
          this.anchors.push(document.querySelector(main.hashTag));
          const curMainIndex = res.length - 1;
          main.subList &&
            res.push(
              ...main.subList.map(sub => {
                sub.parentIndex = curMainIndex;
                this.anchors.push(document.querySelector(sub.hashTag));
                return sub;
              }),
            );
          return res;
        }, []);
        this.observeScroll();
      } catch (error) {
        console.log('toc dom resolve error :>> ', error);
      }
    },
    observeScroll() {
      window.onscroll = () => {
        const threshold = window.pageYOffset + document.documentElement.clientHeight / 2;
        const firstAnchorTop = getElementTop(this.anchors[0]);
        if (threshold < firstAnchorTop) {
          this.handleClick(-2, -1);
          return;
        }
        for (let i = 0; i < this.anchors.length; i++) {
          if (i === this.anchors.length - 1) {
            this.handleClick(this.list[i].parentIndex, i);
            return;
          }
          if (threshold >= getElementTop(this.anchors[i]) && threshold < getElementTop(this.anchors[i + 1])) {
            this.handleClick(this.list[i].parentIndex, i);
            return;
          }
        }
      };
    },
  },
};

function resolveDom(dom) {
  let result = {};
  const handlers = {
    UL: dom => {
      const result = [];
      for (let i = 0; i < dom.childNodes.length; i++) {
        const child = dom.childNodes[i];
        result.push(resolveDom(child));
      }
      return result;
    },
    LI: dom => {
      let result = {};
      for (let i = 0; i < dom.childNodes.length; i++) {
        const child = dom.childNodes[i];
        const handlerType = child.nodeName;
        if (typeof handlers[handlerType] === 'function') {
          const handlerRet = handlers[handlerType](child);
          if (Array.isArray(handlerRet)) {
            result.subList = handlerRet;
          } else {
            result = handlerRet;
          }
        }
      }
      return result;
    },
    A: dom => {
      let result = {};
      result.text = dom.textContent;
      result.anchor = `${window.location.origin}${window.location.pathname}${dom.getAttribute('href')}`;
      result.hashTag = dom.getAttribute('href');
      return result;
    },
  };
  const handlerType = dom.nodeName;
  if (typeof handlers[handlerType] === 'function') {
    result = handlers[handlerType](dom);
  }
  return result;
}

function getElementTop(element) {
  var actualTop = element.offsetTop;
  var current = element.offsetParent;

  while (current !== null) {
    actualTop += current.offsetTop;
    current = current.offsetParent;
  }

  return actualTop;
}
</script>

<style scoped lang="scss">
@include B(toc) {
  display: inline-block;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate3d($container-fixed / 2, -50%, 0);
  max-height: 550px;
  overflow-y: scroll;
  @include pseudo(hover) {
    @include e(text) {
      opacity: 1;
    }
  }
  @include e(item) {
    height: 16px;
    overflow: hidden;
    & + & {
      margin-top: 10px;
    }
  }
  @include e(anchor) {
    display: block;
    box-shadow: none;
    @include when(active) {
      @include pseudo(before) {
        background: var(--article-nav-dot-active-color);
      }
      @include e(text) {
        color: var(--article-nav-text-active-color);
        opacity: 1;
      }
    }
    @include e(text) {
      position: relative;
      top: -2px;
      display: inline-block;
      padding-left: 16px;
      max-width: 200px;
      overflow: hidden;
      // background-color: red;
      vertical-align: middle;
      line-height: 1.4;
      font-family: -apple-system, BlinkMacSystemFont, PingFang SC, Hiragino Sans GB, Microsoft YaHei, '\5FAE\8F6F\96C5\9ED1', helvetica neue,
        helvetica, ubuntu, roboto, noto, segoe ui, Arial, sans-serif;
      font-size: 13px;
      font-weight: bold;
      color: var(--article-nav-text-color);
      white-space: nowrap;
      text-overflow: ellipsis;
      vertical-align: middle;
      opacity: 0;
      transition: opacity 0.5s;
    }
    @include pseudo(before) {
      position: relative;
      top: -2px;
      content: '';
      vertical-align: middle;
      display: inline-block;
      width: 16px;
      height: 4px;
      border-radius: 20px;
      background: var(--article-nav-dot-color);
      transition: background 0.5s;
    }
    @include pseudo(hover) {
      @include pseudo(before) {
        background: var(--article-nav-dot-active-color);
      }
      @include e(text) {
        color: var(--article-nav-text-active-color);
      }
    }
    & + & {
      margin-top: 10px;
    }
    @include m(sub) {
      @include pseudo(before) {
        width: 10px;
      }
      @include e(text) {
        margin-left: 6px;
        font-size: 12px;
        font-weight: normal;
      }
    }
  }
}
</style>