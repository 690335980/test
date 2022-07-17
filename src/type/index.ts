import { createElement } from "../compiler/element";
import { ReactiveEffect } from "../core/reactivity";
import VNode from "../core/vnode"

//节点类型常量
export enum Node {
    ELEMENT_NODE = 1,
    TEXT_NODE = 3,
    CDATA_SECTION_NODE = 4,
    PROCESSING_INSTRUCTION_NODE = 7,
    COMMENT_NODE = 8,
    DOCUMENT_NODE = 9,
    DOCUMENT_TYPE_NODE = 10,
    DOCUMENT_FRAGMENT_NODE = 11,
    //remove
    ATTRIBUTE_NODE = 2,
    ENTITY_REFERENCE_NODE = 5,
    ENTITY_NODE = 6,
    NOTATION_NODE = 12
}

//空格和换行符
export const SPACE_LINE_BREAK = /\s*|[\r\n]/g;

//匹配参数
// 参数样式 {{params}}
export const PARAM = /({{([\s\S]+?)}})+/g;

//类数组对象
export type ArrayLike = {
    [index: number]: any;
    length: number;
}

//元素基础属性
export type BaseAttrProps = {
    [props: string]: any
}

//事件
export type EventProps = {
    [props: string]: EventListenerOrEventListenerObject
}

//元素属性
export type AttrProps = {
    // attrs?: Array<string>;
    // event?: Array<string>;
    [props: string]: any;
}

//VM参数类型定义

//应用入口参数
export type EntryOption = {
    setup?: (fn: createElement) => any;
}

//应用返回参数
export type App = {
    $options?: EntryOption;
    instance?: InstanceProps;
}

//应用实例
export type InstanceProps = {
    $options: EntryOption;
    vnode?: VNode;
    render?: Function;
    el?: Element | Text;
    setupResult?: any;
    _createElement?: createElement;
    _getValue?: (key: any) => any;
    proxy: Object;
    update?: ReactiveEffect;
}
