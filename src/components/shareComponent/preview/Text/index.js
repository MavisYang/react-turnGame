import React,{Component} from 'react'
import './index.css'

export default class Text extends Component {
    render(){
        const {text} = this.props
        return (
            <div className="text">
                <pre style={{margin:0}}>{text?text:'文字内容'}</pre>
            </div>
        )
    }
}
