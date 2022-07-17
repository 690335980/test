import { BaseAttrProps, EventProps, Node } from "../type";
import { isBlank } from "../utils";
import { isRef } from "./reactivity";

export type VNodeProps = {
    tagName?: string;
    attrs?: BaseAttrProps;
    event?: EventProps;
    children?: Array<VNode>;
    el?: Element | Text | undefined;
    type: Node;
    text?: string;
}

/**
 * VNode
 */
export default class VNode {
    tagName?: string;
    attrs?: BaseAttrProps;
    event?: EventProps;
    children?: Array<VNode>;
    el?: Element | Text | undefined;
    type: Node;
    text?: string;

    constructor({ tagName = '', attrs = {}, event = {}, children = [], type, text }: VNodeProps) {
        this.tagName = tagName;
        this.attrs = attrs;
        this.event = event;
        this.children = children;
        this.type = type;
        this.text = text;
    }

}

/**
 * 将vnode转换成元素节点(dom元素)
 * @param vnode 
 */
export function vnodeToElement(vnode: VNode) {
    if (vnode.type === Node.TEXT_NODE) {
        let el = document.createTextNode(getValue(vnode.text) || '');
        vnode.el = el;
        return el;
    }

    if (isBlank(vnode.tagName)) {
        return;
    }
    let el = document.createElement(vnode.tagName!);
    if (Object.keys(vnode.attrs!).length > 0) {
        Object.keys(vnode.attrs!).forEach(key => { //添加属性
            el.setAttribute(key, getValue(vnode.attrs![key]))
        })
    }
    if (Object.keys(vnode.event!).length > 0) {
        Object.keys(vnode.event!).forEach((key) => { //添加事件
            el.addEventListener(key, vnode.event![key]);
        });
    }
    if (vnode.children?.length !== 0) {
        vnode.children!.forEach(child => { //添加子元素
            let childEl = vnodeToElement(child);
            childEl && el.appendChild(childEl);
        });
    }
    vnode.el = el;
    return el;
}

export function getValue(target: any) {
    if (isRef(target)) {
        return target.value;
    }
    return target;
}


