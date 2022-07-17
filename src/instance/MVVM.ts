import { compile } from "../compiler";
import { createElement } from "../compiler/element";
import { patch } from "../core/patch";
import { effect } from "../core/reactivity";
import { getValue } from "../core/vnode";
import { App, EntryOption, InstanceProps } from "../type";


export class MVVM {

    private options: EntryOption;
    constructor(options: EntryOption) {
        this.options = options;
    }
    private createInstance(): InstanceProps | undefined {
        if (Object.keys(this.options).length === 0) {
            return;
        }
        return {
            $options: this.options,
            proxy: {},
            _createElement: createElement,
            _getValue: getValue
        }

    }

    private processOptions(instance: InstanceProps): InstanceProps {
        let options = instance.$options;
        let setup = options.setup;
        if (!setup) {
            return instance;
        }
        let setupResult = setup.call(instance, createElement);
        let proxy = new Proxy(instance, {
            get: (target: InstanceProps, key: string) => {
                if (key in setupResult) {
                    return setupResult[key];
                } else {
                    return Reflect.get(target, key);
                }
            },
            set: (target: InstanceProps, key: string, value: any) => {
                if (key in setupResult) {
                    setupResult[key] = value;
                }
                return true;
            },
            has(target: InstanceProps, key: string) {
                return key in setupResult || Reflect.has(target, key);
            }
        });

        let newInstance = { ...instance, setupResult, proxy };
        return newInstance;
    }

    mount(selector: string): App {
        let el = document.querySelector(selector);
        if (!el) {
            console.warn(`Instance mount failed, element could not be found: ${selector}`);
            return { $options: this.options };
        }
        let instance = this.createInstance();
        if (!instance) {
            return { $options: this.options };
        }
        let newInstance = this.processOptions(instance);
        let render: Function = compile(el);
        instance = { ...newInstance, el, render };
        instance.update = effect(function () {
            let vnode = instance!.render?.call(instance!.proxy);
            let oldVNode = instance!.vnode;
            instance!.vnode = vnode;
            patch(oldVNode, vnode, instance!);
        });

        return {
            $options: this.options,
            instance
        }
    }
}