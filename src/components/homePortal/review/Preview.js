import React,{Component} from 'react';
import Text from '../../shareComponent/preview/Text'
import Link from '../../shareComponent/preview/Link'
import Picture from '../../shareComponent/preview/Picture'
import WxApp from '../../shareComponent/preview/WxApp'
export default class Preview extends Component{
    constructor(props){
        super(props)
        this.state={

        }

    }
    render(){
        const {checkItem} =this.props
        return <div >
            {
                checkItem.type===0?
                    <Text text={checkItem.content}/>
                    :checkItem.type===1?
                    <Link href={checkItem.landingPage} title={checkItem.title} text={checkItem.content} imgUrl={checkItem.imageUrl}/>
                    :checkItem.type===2?
                        <WxApp xml={checkItem.xmlFile} imgSrc={checkItem.imageUrl} paramTitle={checkItem.content}/>
                        :<Picture imgUrl={checkItem.imageUrl}/>
            }
        </div>
    }
}