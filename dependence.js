/**
 * @description 负责收集观察者 watcher
 */
class Dependence {
  constructor() {
    // 存放当前data里面的某个数据在视图上的 watchers
    // 如 data:{a:1} view中使用{{a}} 就是其中的一个watcher
    this.watchers = [];
  }
  // 添加watcher
  addWatcher(watcher) {
    this.watchers.push(watcher);
  }
  // 收到通知后马上更新每个watcher上的视图
  notify(){
    this.watchers.forEach(watcher=>{
      watcher.update();
    })
  }
}
