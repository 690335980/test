import { ArrayLike } from "../type";

/**
 * 判断一个值是否为原始类型
 * @param value 
 * @returns 
 */
export function isPrimitive(value: any): boolean {
    return (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'symbol' ||
        typeof value === 'boolean'
    )
}

/**
 * 判断一个值是否为函数
 * @param value 
 * @returns 
 */
export function isFunction(value: any): value is (...args: any[]) => any {
    return typeof value === 'function'
}

/**
 * 判断元素是否为类数组对象
 * @param o 
 * @returns 
 */
export function isArrayLike(o: any) {
    if (o &&
        typeof o === 'object' &&
        isFinite(o.length) &&
        o.length >= 0 &&
        o.length === Math.floor(o.length) &&
        o.length < 4294967296)
        return true;
    else
        return false;
}

/**
 * 类数组对象转数组
 * {0:'aa',1: 'bb',length: 2}->['aa','bb']
 * @param arrayLike 
 * @returns 
 * 
 */
export function arrayLikeToArray(arrayLike: ArrayLike) {
    let arr: Array<any> = [];
    try {
        arr = Array.prototype.slice.call(arrayLike);
    } catch (error) {
        //IE
        let length = arrayLike.length;
        for (let i = 0; i < length; i++) {
            arr.push(arrayLike[i]);
        }
    }
    return arr;
}

/**
 * 判断元素是否为对象
 * @param value 
 * @returns 
 */
export function isObject(value: unknown): boolean {
    return value !== null && typeof value === 'object';
}

/**
 * 判空
 * @param target 
 * @returns 
 */
export function isBlank(target: any) {
    return target === undefined || target === null || target === '';
}

/**
 * 判断值是否相等
 * @param a 
 * @param b 
 * @returns 
 */
export function looseEqual(a: any, b: any): boolean {
    if (a === b) return true
    const isObjectA = isObject(a)
    const isObjectB = isObject(b)
    if (isObjectA && isObjectB) {
        try {
            const isArrayA = Array.isArray(a)
            const isArrayB = Array.isArray(b)
            if (isArrayA && isArrayB) {
                return (
                    a.length === b.length &&
                    a.every((e: any, i: any) => {
                        return looseEqual(e, b[i])
                    })
                )
            } else if (a instanceof Date && b instanceof Date) {
                return a.getTime() === b.getTime()
            } else if (!isArrayA && !isArrayB) {
                const keysA = Object.keys(a)
                const keysB = Object.keys(b)
                return (
                    keysA.length === keysB.length &&
                    keysA.every(key => {
                        return looseEqual(a[key], b[key])
                    })
                )
            } else {
                /* istanbul ignore next */
                return false
            }
        } catch (e: any) {
            /* istanbul ignore next */
            return false
        }
    } else if (!isObjectA && !isObjectB) {
        return String(a) === String(b)
    } else {
        return false
    }
}

/**
 * 删除数组的值
 * @param arr 
 * @param item 
 * @returns 
 */
export function remove(arr: Array<any>, item: any): Array<any> | void {
    if (arr.length) {
        const index = arr.indexOf(item)
        if (index > -1) {
            return arr.splice(index, 1)
        }
    }
}