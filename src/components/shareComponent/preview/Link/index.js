import React,{Component} from 'react'
import './index.css'

export default class Link extends Component {
    render(){
        const {title,text,imgUrl,href} = this.props
        return (
            <div className="link" >
                <a href={href} target="_blank">
                    <div className="top">{title?title:'预览链接标题'}</div>
                    <div className="bottom">
                        <div className="left">{text?text:'预览链接文字'}</div>
                        <div className="right" style={{backgroundImage:`url(${imgUrl?imgUrl:'/images/pic.png'})`}}>
                        </div>
                    </div>
                </a>
            </div>
        )
    }
}