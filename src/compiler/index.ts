import { AttrProps, PARAM, SPACE_LINE_BREAK } from "../type";
import { arrayLikeToArray } from "../utils";

/**
 * 将Dom元素编译成可执行模板字符串
 * @param element 
 */
export function compile(element: Element) {
    let code = `with(this){return ${process(element)}}`;
    return new Function(code);
}

function process(element: Element | Text) {
    let code = '';
    if (element instanceof Element) {
        code = `this._createElement("${element.localName}",`;
    } else if (element instanceof Text) {
        let text = element.wholeText.replace(SPACE_LINE_BREAK, '');
        let newText = text.replace(PARAM, (match: string) => `\${this._getValue(${match.slice(2, -2)})}`);
        return `\`${newText}\``;
    } else {
        console.error(`element: ${element} is not dom element`);
        return;
    }
    code += processAttrs(element);
    let children = arrayLikeToArray(element.childNodes).map(process);
    code += `,[${children.join(',')}]`;

    return code += ')';

}

/**
 * 处理元素的属性
 * @param element 
 */
function processAttrs(element: Element) {
    let { attributes } = element;
    let code: string[] = [];
    let options: AttrProps = {
        attrs: [],
        event: []
    };
    let attrs: any[] = Array.prototype.slice.call(attributes);
    attrs.forEach(({ name, value }) => {
        if (name[0] === ':') options.attrs!.push(`${name.slice(1)}:${value}`);
        else if (name[0] === '@') options.event!.push(`${name.slice(1)}:${value}`);
        else options.attrs!.push(`${name}:"${value}"`);
    });

    Object.keys(options).forEach(key => {
        if (options[key].length > 0) code.push(`${key}:{${options[key].join(',')}}`);
    });
    return `{${code.join(',')}}`;
}


