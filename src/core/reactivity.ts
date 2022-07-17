import { isObject } from "../utils";

const primitiveToReactive = new WeakMap();

const handler: ProxyHandler<object> = {
    get(target: object, key: string | symbol) {
        track(target, key);
        let result = Reflect.get(target, key);
        return isObject(result) ? reactive(result) : result;
    },
    set(target: object, key: string | symbol, value: unknown) {
        Reflect.set(target, key, value);
        trigger(target, key);
        return true;
    },
    has(target: Object, key: string | symbol) {
        return isObject(target) ? Reflect.has(target, key) : false;
    },
    deleteProperty(target: Object, key: string | symbol) {
        return Reflect.deleteProperty(target, key);
    }
};

export const isRef = function (target: any) {
    return isObject(target) && 'isRef' in target && target.isRef;
};

/**
 * 定义包装函数，将原始类型值包装成对象，以便值发生变化时可以捕捉
 * @param value 
 * @returns 
 */
export const ref = function (value: any) {
    if (isObject(value)) {
        if (isRef(value)) return value;
        else return;
    }

    let result = Object.create(Object.prototype, {
        isRef: { value: true },
        value: {
            get() {
                track(result, 'value');
                return value;
            },
            set(newValue) {
                value = newValue;
                trigger(result, 'value');
            }
        }
    });
    return result;
}

/**
 * 创建响应式对象
 * @param target 
 * @returns 
 */
export const reactive = function (target: object) {
    if (!isObject(target)) {
        return target;
    }
    if (primitiveToReactive.has(target)) return primitiveToReactive.get(target);

    let observed = new Proxy(target, handler);

    primitiveToReactive.set(target, observed);
    return observed;
}

//依赖存储
type Dep = Set<ReactiveEffect>
type KeyMap = Map<any, Dep>
const targetMap = new WeakMap<any, KeyMap>();

/**
 * 收集依赖
 * @param target
 * @param key 
 * @returns 
 */
const track = function (target: object, key: string | symbol) {
    if (activeEffect === undefined) return;

    let keyMap = targetMap.get(target);
    if (!keyMap) targetMap.set(target, (keyMap = new Map()));

    let depsOfKey = keyMap.get(key);
    if (!depsOfKey) keyMap.set(key, (depsOfKey = new Set()));

    if (!depsOfKey.has(activeEffect)) depsOfKey.add(activeEffect);
}

const trigger = function (target: object, key: string | symbol) {
    let keyMap = targetMap.get(target);
    if (!keyMap) return;
    let deps = keyMap.get(key);
    if (!deps) return;
    deps.forEach((effect: ReactiveEffect) => {
        effect();
    });
}

export interface ReactiveEffect<T = any> {
    (...args: any[]): T
    _isEffect: true
    deps: Array<Dep>
}

let activeEffect: ReactiveEffect | undefined;

/**
 * 用于包装一个函数
 * @param fn 
 * @returns 
 */
export const effect = function <T = any>(fn: (...args: any[]) => T): ReactiveEffect<T> {
    const effect = function (...args: any[]) {
        try {
            activeEffect = effect;
            return fn(...args);
        } finally {
            activeEffect = undefined;
        }
    } as ReactiveEffect

    effect._isEffect = true;
    effect.deps = new Array<Dep>(); // 暂时用不到它

    effect();

    return effect;
}