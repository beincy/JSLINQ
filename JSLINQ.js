"use strict";
//JSLINQ 主类型，调用类型
class JSLINQ {
    //构造函数
    constructor(list) {
        this.inerList = list;
    }
    //生成器
    *[Symbol.iterator]() {
        for (let item of this.inerList) {
            yield item;
        }
    }
    //转换成数组
    toList() {
        return [...this]
    }
    //
    where(func = (a) => a) {
        return new WhereIterator(this, func);
    }
    //
    first(func = (a) => a) {
        for (const a of this) {
            if (func(a)) {
                return a;
            }
        }
        return undefined;
    }
    select(func = (a) => a) {
        return new SelectIterator(this, func);
    }
    any() {
        for (const a of this) {
            return true;
        }
        return false;
    }
    take(count) {
        return new TakeIterator(this, count);
    }
    exist(func = (a) => a) {
        for (const a of this) {
            if (func(a)) {
                return true;
            }
        }
        return false;
    }
    Contains(model) {
        for (const a of this) {
            if (a === model) {
                return true;
            }
        }
        return false;
    }
    remove(func = (a) => a, count = 1) {
        return RemoveIterator(this, func, count);
    }
    removeAll(func = (a) => a) {
        return RemoveIterator(this, func, 0);
    }
}
//where的执行类
class WhereIterator extends JSLINQ {
    //构造函数
    constructor(list, func) {
        super(list);
        this._func = func;
        // this.inerList = list;

    }
    //生成器
    *[Symbol.iterator]() {
        for (let item of this.inerList) {
            if (this._func(item)) {
                yield item;
            }
        }
    }
}
//
class SelectIterator extends JSLINQ {
    //构造函数
    constructor(list, func) {
        super(list);
        this._func = func;
        // this._list = list;
    }
    //生成器
    *[Symbol.iterator]() {
        for (let item of this.inerList) {
            yield this._func(item);
        }
    }
}
class TakeIterator extends JSLINQ {
    //构造函数
    constructor(list, count) {
        super(list);
        this._count = count;
        // this.inerList = list;

    }
    //生成器
    *[Symbol.iterator]() {
        let index = 0;
        for (let item of this.inerList) {
            if (++index <= this._count) {
                yield item;
            }
        }
    }
}
class RemoveIterator extends JSLINQ {
    //构造函数
    constructor(list, func, count) {
        super(list);
        this._func = func;
        this._count = count;
        // this.inerList = list;

    }
    //生成器
    *[Symbol.iterator]() {
        let index = 0;
        for (let item of this.inerList) {
            if (!this._func(item)) {
                if (this._count == 0 || ++index >= this._count) {
                    yield item;
                } else {
                    break;
                }

            }
        }
    }
}
