const RENDER_TO_DOM = Symbol('render to dom')



/**
 * 创建 Component 用于 组件定义
 */
export class Component {
    constructor() {
        this.props = {};
        this.children = [];
        this._root = null;
        this._range = null
    }

    get vdom() {
        return this.render().vdom
    }


    /**
     * 绑定组件的props
     * @param {*} name 
     * @param {*} value 
     */
    setAttribute(name, value) {
        this.props[name] = value
    }

    appendChild(component) {
        this.children.push(component)
    }

    /**
     * render
     */
    [RENDER_TO_DOM](range) {
        this._range = range
        this._vdom = this.vdom
        this._vdom[RENDER_TO_DOM](range)
    }


    /**
     * 简易diff算法
     */
    update(){

        let isSmaeNode = (oldNode, newNode) =>{
            if(oldNode.type !== newNode.type){
                return false
            }

            for (const name in newNode.props) {
                if(newNode.props[name] !== oldNode.props[name]){
                    return false
                }
            }
            if(Object.keys(newNode.props).length !== Object.keys(oldNode.props).length){
                return false
            }
            if(newNode.type === '#text' && newNode.content !== oldNode.content){
                return false
            }
            return true
        }

        let update = (oldNode, newNode) =>{
            // type props
            // #text, content
            if(!isSmaeNode(oldNode, newNode)){
                newNode[RENDER_TO_DOM](oldNode._range)
                return
            }
            newNode._range = oldNode._range
            let newChildren = newNode.vchildren
            let oldChildren = oldNode.vchildren
            for (let i =0; i<newChildren.length; i++) {
                let newChild = newChildren[i]
                let oldChild = oldChildren[i]
                if(i< oldChildren.length){
                    update(oldChild, newChild)
                } else {
                    // TODO
                }
            }
        }
        
        let vdom = this.vdom
        update(this._vdom, vdom)
        this._vdom = vdom

    }

    /**
     * 重新渲染
     */
    // rerender() {
    //     let oldRange = this._range
    //     let range = document.createRange()
    //     range.setStart(oldRange.startContainer, oldRange.startOffset)
    //     range.setEnd(oldRange.startContainer, oldRange.startOffset)
    //     this[RENDER_TO_DOM](range)
    //     oldRange.setStart(range.endContainer, range.endOffset)
    //     oldRange.deleteContents()

    // }


    setState(newState) {
        if (this.state === null || typeof this.state !== 'object') {
            this.state = newState
            this.update();
            return
        }
        let merge = (oldState, newState) => {
            for (let p in newState) {
                // 判断是否是个对象，如果是的话就要执行递归调用
                if (oldState[p] === null || typeof oldState[p] !== 'object') {
                    oldState[p] = newState[p]
                } else {
                    merge(oldState[p], newState[p])
                }
            }
        }
        merge(this.state, newState)
        // 触发重新渲染
        this.update()
    }


    /**
     * 获取root 为什么要通过这种方式获取root？因为 这个 clsss 是给自定义的 Componet 用的，所以要获取自定义的元素
     * 自定义的Componet 的 render 方法会 return 这个 自定义Compont 的 jsx 内容，所以就可以拿到root即 元素
     */
    // get root(){
    //     if(!this._root){
    //         // 这个 render 的方法是哪里来的？ 解答： 自定义组件继承了 这个 calss 那么就可以调用render 方法
    //         this._root = this.render().root
    //     }
    //     return this._root
    // }
}


/**
 * 创建 elementWrap 用于 生成 普通的tag
 */
export class ElementWrap extends Component {
    constructor(type) {
        super(type)
        this.type = type;
        // this.root = document.createElement(type)
    }

    get vdom() {
        this.vchildren = this.children.map(child=>child.vdom)
        return this
        // return {
        //     type: this.type,
        //     props: this.props,
        //     children: this.children.map(child => child.vdom)
        // }
    }

    /**
     * 设置标签的属性
     * @param {*} name 
     * @param {*} value 
     */
    // setAttribute(name, value){
    //     // console.log('match', name, )
    //     if(name.match(/^on([\s\S]+)/)){
    //         const listen = RegExp.$1.replace(/[\s\S]/, c=> c.toLowerCase())
    //         this.root.addEventListener(listen, value)
    //     } else{
    //         if(name === 'className'){
    //             this.root.setAttribute('class', value)    
    //         } else {
    //             this.root.setAttribute(name, value)
    //         }

    //     }

    // }

    // /**
    //  * 添加子元素
    //  * @param {*} component 
    //  */
    // appendChild(component){
    //     let range = document.createRange()

    //     // 这里两个为什么是一样的？ 很关键
    //     range.setStart(this.root, this.root.childNodes.length)
    //     range.setEnd(this.root, this.root.childNodes.length)
    //     range.deleteContents()
    //     component[RENDER_TO_DOM](range)
    //     // 为什么是要 component.root ?
    //     // this.root.appendChild(component.root)
    // }

    /**
    * 重新render
    */
    [RENDER_TO_DOM](range) {
        this._range = range

        // todo deleteContents() 这是一个什么样的用法？
        range.deleteContents();
        const root = document.createElement(this.type)

        // 添加属性
        for (const name in this.props) {
            const value = this.props[name]
            if (name.match(/^on([\s\S]+)/)) {
                const listen = RegExp.$1.replace(/[\s\S]/, c => c.toLowerCase())
                root.addEventListener(listen, value)
            } else {
                if (name === 'className') {
                    root.setAttribute('class', value)
                } else {
                    root.setAttribute(name, value)
                }

            }
        }

        if(!this.vchildren){
            this.vchildren = this.children.map(child=>child.vdom)
        }
        
        // 添加child

        for (const child of this.vchildren) {
            let childRange = document.createRange()

            // 这里两个为什么是一样的？ 很关键
            childRange.setStart(root, root.childNodes.length)
            childRange.setEnd(root, root.childNodes.length)
            childRange.deleteContents()
            child[RENDER_TO_DOM](childRange)
        }
        range.insertNode(root)
    }

}

/**
 * 创建 TextWrap 用于生成 文本节点
 */
export class TextWrap extends Component {
    constructor(content) {
        super(content)
        this.content = content;
        this.type = '#type'
        // textnode 没有任何属性和 appendChild 方法
        this.root = document.createTextNode(content)
    }

    get vdom() {
        return this
        // return {
        //     type: '#text',
        //     content: this.content
        // }
    }

    /**
    * 重新render
    */
    [RENDER_TO_DOM](range) {
        this._range = range
        range.deleteContents();
        range.insertNode(this.root)
    }
}


export function createElement(type, attributes, ...children) {
    // console.log(type, attributes, children)
    let element = null
    // 判断是否是原生标签
    if (typeof type === 'string') {
        element = new ElementWrap(type)
    } else {
        // 这个 type 就是一个 自定义的Component 的 class 所以 直接 new type
        element = new type
        // console.log('new type', element)
    }
    // 通过for 循环遍历所有的属性
    for (const key in attributes) {
        const value = attributes[key];
        element.setAttribute(key, value)
    }

    let insertChildren = (children) => {
        for (let child of children) {
            const objectType = Object.prototype.toString.call(child).match(/\[object (\w*)\]/)[1].toLowerCase()
            if (['string'].includes(objectType)) { // todo js 类型判断
                child = new TextWrap(child)
                element.appendChild(child)
            } else if (child === null) {
                continue
            } else if (typeof child === 'object' && child instanceof Array) {
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
export function renderDom(element, parentElement) {
    // parentElement.appendChild(element.root)

    // 这个 createRange 又是干什么的？
    let range = document.createRange()
    range.setStart(parentElement, 0)
    range.setEnd(parentElement, parentElement.childNodes.length)
    range.deleteContents()
    element[RENDER_TO_DOM](range)
}


// Component 与 ElementWrap 以及 TextWrap 的关系? ElementWrap -> ElementWrap -> TextWrap 的顺序