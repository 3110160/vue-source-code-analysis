/**
 * @description 视图中的数据的 观察者，
 * 一旦data中的数据发生改变姐会去更新当前的视图
 */

class Watcher {
  constructor(vm, key, cb) {
    this.$vm = vm;
    this.$key = key;
    this.$cb = cb;
    // 将当前的Watcher实例挂在Dependence的静态属性上，方便在Dependence上获取到订阅当前依赖的watcher
    Dependence.target = this;
    // 这里读一下当前这个属性
    this.$val = this.$vm[this.$key]
    // 把Dependence上的watcher滞空防止重复添加
    Dependence.target = null;
  }
  // 更新视图
  update() {
    this.$cb && this.$cb(this.$val);
  }
}
