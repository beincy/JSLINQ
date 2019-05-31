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
    //筛选符合条件的元素
    where(func = (a) => a) {
        return new WhereIterator(this, func);
    }
    //获取第一个元素
    first(func = (a) => a) {
        for (const a of this) {
            if (func(a)) {
                return a;
            }
        }
        return undefined;
    }
    //投影
    select(func = (a) => a) {
        return new SelectIterator(this, func);
    }
    //判断是否包含任意一个元素
    any() {
        for (const a of this) {
            return true;
        }
        return false;
    }
    //取若若干个元素
    take(count) {
        return new TakeIterator(this, count);
    }
    //判断指定元素是否存在
    exist(func = (a) => a) {
        for (const a of this) {
            if (func(a)) {
                return true;
            }
        }
        return false;
    }
    //判断指定对象是否存在
    contains(model) {
        for (const a of this) {
            if (a === model) {
                return true;
            }
        }
        return false;
    }
    //去除某个、多个元素
    remove(func = (a) => a, count = 1) {
        return new RemoveIterator(this, func, count);
    }
    //去除全部符合条件的元素
    removeAll(func = (a) => a) {
        return new  RemoveIterator(this, func, 0);
    }
    // 排序
    orderBy(func = (a) => a){
        // func,排序的key
        return new OrderByIterator(func)
    }
    // 排序,倒序
    orderByDesc(func = (a) => a){
        // func,排序的key
        return new OrderByIterator(func,true)
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
//Select的执行类
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
//Take的执行类
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
//Remove的执行类
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
//orderby 的执行类
class OrderByIterator extends JSLINQ {
    //构造函数
    constructor(list, func=(a)=>a, reverse=False) {
        super(list);
        orderKey=(a,b)=>func(a)-func(b)
        if (reverse==true)orderKey=(a,b)=>func(b)-func(a)
        this.inerList.sort((a,b)=>func(a)-func(b))
    }
}
