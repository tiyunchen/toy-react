for(let i of [1,2,3]){
    console.log(i)
}

function createElement(tag, attributes, ...children){
    console.log(tag, attributes, children)
    const element = document.createElement(tag)
    // 通过for 循环遍历所有的属性
    for (const key in attributes) {
        if (attributes.hasOwnProperty(key)) {
            const value = attributes[key];
            element.setAttribute(key, value)
        }
    }

    for (const child of children) {
        console.log(child)
        if(typeof child === 'string'){ // todo js 类型判断
            element.append(child)
        } else{
            element.appendChild(child)
        }
        
    }

    console.log(1111111, element)
    return element
}

window.el = <div id='test' class='test'>
    <div id='id1' data-a='a1'>内容1</div>
    <div id='id2' data-a='a2'>内容2</div>
    <div id='id3' data-a='a3'>内容3</div>
    <div id='id4' data-a='a4'>内容4</div>
    a陈体云
</div>