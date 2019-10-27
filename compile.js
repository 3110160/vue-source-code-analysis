/**
 * @constructor
 * @param {string} el vue挂载的宿主节点 - #app
 * @param {object} vm vue实例
 * @description 模版编译，负责把所以模版指令转成真实dom，事件绑定等
 */
class Compile {
  constructor(el, vm) {
    this.$el = document.querySelector(el);
    this.$vm = vm;
    // 将所以的$el的节点全部放到 fragment 里面,html代码片段
    if (this.$el) {
      this.$fragment = this.node2fragment(this.$el);
      // 转换分析的过程中将源代码中的插槽值进行填充
      this.compile(this.$fragment);
      // 最好把他追加到 this.$el 宿主节点内
      this.$el.appendChild(this.$fragment);
    }
  }
  // 将节点转成 html代码片段
  node2fragment(el) {
    const fragment = document.createDocumentFragment();
    let child;
    while ((child = el.firstChild)) {
      fragment.appendChild(el.firstChild);
    }
    return fragment;
  }

  // 编译模版
  compile(fragment) {
    //console.log(fragment)
    // 遍历dom片段 识别每个dom类型，对其作出相应到操作
    Array.from(fragment.childNodes).forEach(node => {
      //元素节点
      if (this.isElementNode(node)) {
        console.log(`元素节点`, node);
        // 在这里我们来检测其节点属性 attributes 是否含有 v-html,v-modle,@click这些🈯️令
        Array.from(node.attributes).forEach(atter => {
          const atterName = atter.name;
          const key = atter.value;
          if (this.isDirective(atterName)) {
            // 执行对应指令的编译函数
            const dir = atterName.substr(2);
            this[dir] && this[dir](node, key);
          }
        });
      }
      // 文本节点
      if (this.isTextNode(node)) {
        // 纯文本节点可以不作处理
        console.log(`文本节点`, node.textContent);
      }
      // 插槽节点
      if (this.isInterpolation(node)) {
        console.log(`插槽节点`, node.textContent);
        this.compileText(node);
      }
      // 如果有子元素，递归
      if (node.childNodes) {
        this.compile(node);
      }
    });
  }
  // 元素节点
  isElementNode(node) {
    return node.nodeType === 1;
  }
  // 文本节点
  isTextNode(node) {
    return node.nodeType === 3;
  }
  // {{}} 的插槽节点元素
  isInterpolation(node) {
    return this.isTextNode(node) && /\{\{(.*)\}\}/.test(node.textContent);
  }
  // 是否符合 v-xxx 指令的形式
  isDirective(atterName) {
    return atterName.indexOf("v-") === 0;
  }
  // 编译文本
  compileText(node) {
    this.update(node, this.$vm, RegExp.$1, `text`);
  }
  // 指令编译 v-html
  html(node, key) {
    this.update(node, this.$vm, key, `html`);
  }
  // 指令编译 v-model
  model(node,key) {
    this.update(node, this.$vm, key, `model`);
    node.addEventListener("input", e => {
      this.$vm[key] = e.target.value;
      console.log(this.$vm[key])
    });
  }
  // 更新
  // updateType 更新的类型函数
  update(node, vm, key, updateType) {
    const updateFn = this[updateType + "Update"];
    // 这里执行是第一次编译模板，后面的更新是动态更新
    updateFn && updateFn(node, vm[key]);
    // 这里的回调函数是在watcher里面的notify里面触发
    new Watcher(vm, key, val => {
      updateFn && updateFn(node, val);
    });
  }
  // 文本节点更新函数
  textUpdate(node, val) {
    const reg = /\{\{(.*)\}\}/;
    node.textContent = node.textContent.replace(reg, val);
  }
  // 指令v-html更新函数
  htmlUpdate(node, val) {
    node.innerHTML = val;
  }
  // 指令v-model更新函数
  modelUpdate(node, val) {
    node.value = val;
  }
}
