class Mvue {
  constructor(options) {
    this.$options = options;
    //宿主元素节点
    this.$el = options.el;
    // 数据
    this.$data = options.data;
    // 监听data
    this.observe(this.$data);
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
    });
  }

  /**
   * @param {object} obj
   * @param {string} key
   * @param {any} val
   * @description 定义劫持的内容
   * */
  defineReactive(obj, key, val) {
    // 如果这里的 val 还是一个对象则需要继续为其添加 defineReactive 数据劫持
    this.observe(data[key]);

    Object.defineProperty(obj, key, {
      set(newVal) {
        if (newVal !== val) {
          val = newVal;
          console.log(`${key}:发生变化了`);
        }
      },
      get() {
        return val;
      }
    });
  }
}
