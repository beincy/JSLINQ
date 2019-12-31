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
        return new RemoveIterator(this, func, 0);
    }
    // 排序
    orderBy(func = (a) => a) {
        // func,排序的key
        return new OrderByIterator(this, func)
    }
    // 排序,倒序
    orderByDesc(func = (a) => a) {
        // func,排序的key
        return new OrderByIterator(this, func, true)
    }
    groupBy(func = (a) => a) {
        // 对数组进行分组
        return new GroupByIterator(this, func, true)
    }
    distinct(func = (a) => a) {
        // 去重
        return new DistinctIterator(this, func)
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
    constructor(list, key = (a) => a, reverse = false) {
        super(list);
        if (reverse == true) {
            this._func = (a, b) => key(b) - key(a)
        }
        else {
            this._func = (a, b) => key(a) - key(b)
        }
        // this.inerList.sort((a,b)=>func(a)-func(b))
    }
    //生成器
    *[Symbol.iterator]() {
        //先对数据排序，然后进行循环
        this.inerList = [...this.inerList]
        this.inerList.sort(this._func)
        for (let item of this.inerList) {
            yield item;
        }
    }
    thenBy(key = (a) => a, reverse = false) {
        // 递归减法
        this._func = (a, b) => {
            difference = this._func(a, b)
            if (difference == 0) {
                if (reverse) {
                    return key(b) - key(a)
                }
                return key(a) - key(b)
            }
            return this
        }
    }
    thenByDesc(key = (a) => a) {
        this.thenBy(key, true)
        return this
    }
}
//进行分组
class GroupByIterator {
    //构造函数
    constructor(list, keyFunc) {
        this.inerList = list
        this.keyFunc = keyFunc
        this.grdoupCollection = {}
    }
    //生成器
    *[Symbol.iterator]() {
        //分组
        let group = {}
        for (const item of this.inerList) {
            let itemKey = this.keyFunc(item)
            if (group[itemKey] != undefined) {
                continue
            }
            group[itemKey] = true
            yield new GroupByItemIterator(itemKey, this)
        }
    }
}
class GroupByItemIterator {

    //构造函数
    constructor(key, gpModel) {
        this.key = key
        this._gpModel = gpModel
        this.value = new JSLINQ(this)
    }
    //生成器
    *[Symbol.iterator]() {
        //分组
        if (this._gpModel.grdoupCollection[this.key] == undefined) {
            for (const item of this._gpModel.inerList) {
                let itemKey = this._gpModel.keyFunc(item)
                if (this._gpModel.grdoupCollection[itemKey] == undefined) {
                    this._gpModel.grdoupCollection[itemKey] = [item]
                } else {
                    this._gpModel.grdoupCollection[itemKey].push(item)
                }
                if (itemKey == this.key) {
                    yield item
                }
            }
        }
        else {
            for (const item of this._gpModel.grdoupCollection[this.key]) {
                yield item
            }
        }
    }
}
class DistinctIterator extends JSLINQ {
    //根据规则去重
    //构造函数
    constructor(list, keyFunc) {
        super(list);
        this._keyFunc = keyFunc
    }
    //生成器
    *[Symbol.iterator]() {
        let existDic = {}
        for (let item of this.inerList) {
            let key = this._keyFunc(item)
            if (existDic[key]) {
                continue
            }
            existDic[key] = true
            yield item
        }
    }
}

export default JSLINQ