import { InstanceProps, Node } from "../type";
import VNode, { getValue, vnodeToElement } from "./vnode";

/**
 * 参考snabbdom算法实现diff
 * @param oldVNode 
 * @param vnode 
 * @param instance 
 */
export function patch(oldVNode: VNode | undefined, vnode: VNode, instance: InstanceProps) {
    if (!oldVNode) {
        let el = vnodeToElement(vnode);
        if (el && instance.el) {
            instance.el.parentNode?.replaceChild(el, instance.el);
        }
        return;
    }

    if (!sameVNode(oldVNode, vnode)) {
        let el = vnodeToElement(vnode);
        if (el && instance.el) {
            instance.el.parentNode?.replaceChild(el, instance.el);
        }
    } else {
        if (vnode.type === Node.TEXT_NODE && oldVNode.text !== vnode.text) {
            vnode.text && (oldVNode.el!.nodeValue = vnode.text);
        } else {
            updateAttrs(oldVNode, vnode);
            vnode.children!.forEach((child: VNode, index: number) => patch(oldVNode.children![index], child, instance));
        }
        vnode.el = oldVNode.el;
    }
}

/**
 * 判断两个vnode是否相等(非深度比较，只比较同级)
 * @param vnode1 
 * @param vnode2 
 */
function sameVNode(vnode1: VNode, vnode2: VNode): boolean {
    const isSameSel = vnode1.tagName === vnode2.tagName;
    const isSameType = vnode1.type === vnode2.type;
    return isSameSel && isSameType;
}

/**
 * 判断是否为vnode
 * @param vnode 
 * @returns 
 */
function isVNode(vnode: any): vnode is VNode {
    return vnode.type === Node.ELEMENT_NODE || vnode.type === Node.TEXT_NODE;
}

/**
 * 更新属性信息
 * @param oldVNode 
 * @param vnode 
 * @returns 
 */
function updateAttrs(oldVNode: VNode, vnode: VNode) {
    if (!(oldVNode.el instanceof Element)) return;
    let { attrs = {} } = vnode;
    let { attrs: oldAttrs = {} } = oldVNode;
    for (let key in attrs) {
        if (!(key in oldAttrs) || oldAttrs[key] !== attrs[key]) {
            oldVNode.el?.setAttribute(key, getValue(attrs[key]));
        }
    }
    for (let key in oldAttrs) {
        if (!(key in attrs)) {
            oldVNode.el?.removeAttribute(key);
        }
    }
}