import React,{Component} from 'react'
import './index.css'

export default class Picture extends Component {
    render(){
        const {imgUrl} = this.props
        return (
            <div className='picture'>
                <div className="img" style={{backgroundImage:`url(${imgUrl?imgUrl:'/images/pic2.png'})`}}></div>
            </div>
        )
    }
}
