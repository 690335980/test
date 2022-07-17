import VNode from "../core/vnode";
import { AttrProps, Node } from "../type";

// 根据(标签名,属性,子元素)创建VNode
export type createElement = (tagName: string, option: AttrProps, children: Array<VNode | string>) => VNode;
export type createText = (val: string) => VNode;
export const createText: createText = (val) => {
    return new VNode({
        text: val,
        type: Node.TEXT_NODE
    });
};
export const createElement = (tagName: string, option: AttrProps, children: Array<VNode | string>) => {
    let vnodeChildren: Array<VNode> = [];
    if (children.length > 0) {
        vnodeChildren = children.map(child => {
            if (typeof child === 'string') {
                return createText(child);
            }
            return child;
        })
    }
    let attrs = option.attrs;
    let event = option.event;
    return new VNode({
        tagName,
        type: Node.ELEMENT_NODE,
        attrs,
        event,
        children: vnodeChildren
    });
}