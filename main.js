import { render, ElementWrap, TextWrap, Component, createElement } from './toy-react'

class MyComponent extends Component{
    render (){
        return <div>
            <div>内容1内容1内容1</div>
            {this.children}
        </div>
    }
}




render(<MyComponent>
    <div id='test' class='test'>
        <div id='id1' data-a='a1'>内容1</div>
        <div id='id2' data-a='a2'>内容2</div>
        <div id='id3' data-a='a3'>内容3</div>
        <div id='id4' data-a='a4'>内容4</div>
        sss
</div>
</MyComponent>  , document.body)