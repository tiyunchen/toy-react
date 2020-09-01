
/**
 * 创建 elementWrap 用于 生成 普通的tag
 */
export class ElementWrap {
    constructor(type){
        this.root = document.createElement(type)
    }

    /**
     * 设置标签的属性
     * @param {*} name 
     * @param {*} value 
     */
    setAttribute(name, value){
        this.root.setAttribute(name, value)
    }

    /**
     * 添加子元素
     * @param {*} component 
     */
    appendChild(component){
        // 为什么是要 component.root ?
        this.root.appendChild(component.root)
    }
    
}

/**
 * 创建 TextWrap 用于生成 文本节点
 */
export class TextWrap {
    constructor(content){
        // textnode 没有任何属性和 appendChild 方法
        this.root = document.createTextNode(content)
    }
}

/**
 * 创建 Component 用于 组件定义
 */
export class Component {
    constructor(){
        this.props = {}
        this.children = []
        this._root = null
    }
    /**
     * 绑定组件的props
     * @param {*} name 
     * @param {*} value 
     */
    setAttribute(name, value){
        this.props[name] = value
    }

    appendChild(component){
        this.children.push(component)
    }
    
    /**
     * 获取root 为什么要通过这种方式获取root？因为 这个 clsss 是给自定义的 Componet 用的，所以要获取自定义的元素
     * 自定义的Componet 的 render 方法会 return 这个 自定义Compont 的 jsx 内容，所以就可以拿到root即 元素
     */
    get root(){
        if(!this._root){
            // 这个 render 的方法是哪里来的？ 解答： 自定义组件继承了 这个 calss 那么就可以调用render 方法
            this._root = this.render().root
        }
        return this._root
    }
}


export function createElement(type, attributes, ...children){
    // console.log(type, attributes, children)
    let element = null
    // 判断是否是原生标签
    if(typeof type === 'string'){
        element =  new ElementWrap(type)
    } else {
        // 这个 type 就是一个 自定义的Component 的 class 所以 直接 new type
        element = new type
        console.log('new type', element)
    }
    // 通过for 循环遍历所有的属性
    for (const key in attributes) {
        const value = attributes[key];
        element.setAttribute(key, value)
    }

     let insertChildren = (children) => {
        for (let child of children) {
            if(typeof child === 'string'){ // todo js 类型判断
                child = new TextWrap(child)
                element.appendChild(child)
            } else if(typeof child === 'object' && child instanceof Array){
                insertChildren(child)
            } else {
                element.appendChild(child)
            }
        }
     }

     insertChildren(children)
    


    return element
}


/**
 * 渲染元素到文档上
 * @param {} element 
 * @param {*} parentElement 
 */
export function renderDom (element, parentElement){
    parentElement.appendChild(element.root)
}


// Component 与 ElementWrap 以及 TextWrap 的关系? ElementWrap -> ElementWrap -> TextWrap 的顺序