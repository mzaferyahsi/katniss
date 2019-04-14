/* jshint esversion: 6 */

export class Queue {
  constructor() {
    this.data = [];
  }

  add (item) {
    /* istanbul ignore else */
    if(item)
      this.data.unshift(item);
  }

  peek() {
    return this.data.length > 0 ? this.data[this.data.length - 1] : null;
  }

  remove() {
    return this.data.pop();
  }

  length() {
    return this.data.length;
  }

  clear() {
    this.data = [];
  }

}
