class Mvue {
  constructor(options) {
    this.$options = options;
    //宿主元素节点
    this.$el = options.el;
    // 数据
    this.$data = options.data;
    // 监听data
    this.observe(this.$data);
    // 初始化编译模版
    new Compile(this.$el, this);
    // 执行 created 声明周期
    this.$options.created.call(this)
    // new Watcher();
    // // 在这里模拟render的过程，为了触发test属性的get函数
    // this.$data.title;
    // this.$data.title = 2;
  }
  // 监听函数
  observe(data) {
    //  如果data不是一个对象
    if (!data || typeof data !== "object") {
      return;
    }
    // 给对象的每个key添加数据劫持 get / set
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key]);
      this.proxyData2vue(key);
    });
  }
  // 将data上到属性代理到 vue实例上，方便后面直接在实li上操作data
  proxyData2vue(key) {
    Object.defineProperty(this, key, {
      get() {
        return this.$data[key]
      },
      set(val) {
        this.$data[key] = val;
      }
    })
  }
  /**
   * @param {object} obj
   * @param {string} key
   * @param {any} val
   * @description 定义劫持的内容
   * */
  defineReactive(obj, key, val) {
    // 如果这里的 val 还是一个对象则需要继续为其添加 defineReactive 数据劫持
    this.observe(val);

    // 初始化的时候将data里面的每个key都加上一个dependence来收集watcher
    const dep = new Dependence();

    Object.defineProperty(obj, key, {
      get() {
        // 如果当前有人来取这个值来，说明当前视图在获取当前值来渲染，必然会new 一个Watcher来订阅这个值，以便之后值发生改变来通知视图更新
        Dependence.target && dep.addWatcher(Dependence.target);
        console.log(key,dep);
        return val;
      },
      set(newVal) {
        if (newVal !== val) {
          val = newVal;
          // 通知订阅当前依赖的watcher去更新它所对应的视图
          dep.notify();
        }
      }
    });
  }
}