import React,{Component} from 'react'
import {getCookie} from '../../../funStore/utils'
import AxiosCore from '../../../funStore/AxiosCore'
import './index.css'
import FillAddress from '../FillAddress/index'

export default class HistoryIndex extends Component{
    constructor(props){
        super(props)
        this.state={
            isMore:'',//isMore：F抽过、T未抽过
            recordsData:'',
            isAddAddress:false
        }
    }

    componentDidMount(){
       this.pullData()
    }

    pullData=()=>{
        let openid = getCookie("openid_cookie")
        // if(openid==null||openid==undefined){
        //     this.props.history.push('/home')
        //     return
        // }

        this.getInitData(openid)
    }

    getInitData=(openid)=>{
        // AxiosCore.get('moac/selectMoRecord?openid='+openid).then((res)=>{
        //     console.log(res,'res===')
        //     // let resData = res.data;
        //
        //
        //     let resData = {
        //         "status":200,"msg":"OK",
        //         "data":{
        //             "records":[
        //                 {
        //                     rewardType:'e', //电子券
        //                     rewardName:'价值xxx元商品', //实物
        //                     address:'T' // //T表示已领取已提交
        //                 },
        //                 {
        //                     rewardType:'t',
        //                     rewardName:'价值xxx元商品',
        //                     address:'F'
        //                 }
        //             ],
        //             "isMore":"T"
        //         }
        //     }
        //     this.setState({
        //         isMore:resData.data.isMore,
        //         recordsData:resData.data.records,
        //
        //     })
        //
        // }).catch(req=>{
        //
        // })

        let resData = {
            "status":200,"msg":"OK",
            "data":{
                "records":[
                    {
                        rewardType:'e', //电子券
                        rewardName:'价值xxx元商品', //实物
                        address:'T' // //T表示已领取已提交
                    },
                    {
                        rewardType:'t',
                        rewardName:'价值xxx元商品',
                        address:'F'
                    },
                    {
                        rewardType:'t',
                        rewardName:'价值xxx元商品',
                        address:'T'
                    }
                ],
                "isMore":"T"
            }
        }
        this.setState({
            isMore:resData.data.isMore,
            recordsData:resData.data.records,

        })
    }


    showAddress=()=>{
        this.setState({isAddAddress:true})
    }
    hideAddress=()=>{
        this.setState({isAddAddress:false})
    }


    render(){
        const {history} =this.props
        const {isMore,recordsData,isAddAddress} =this.state
        return(
            <div className='containter'>
                <div className="historyWrapper">
                    <div className="title">一 抽奖历史 一</div>
                    <div className="content">
                        {
                            isMore=='T'
                                ?
                                <div className='wrap'>
                                    <div className='prompt'>
                                        <img src="./images/liziShort-02.png" alt=""/>
                                        <p>您还没有抽奖哦<br/>快去抽奖吧～</p>
                                    </div>
                                </div>
                                :
                                <div className="wrap">
                                    {
                                        recordsData!=''?recordsData.map((item,index)=>{
                                            return  <div className="lotteryBox" key={index}>
                                                <div className="coupon">{item.rewardName}</div>
                                                {
                                                    item.rewardType=='e'?
                                                        <button className='btnClass unDoneBtn'>点击领取</button>
                                                        :item.address=='T'? <button disabled className='btnClass doneBtn'>已提交</button>
                                                        :<button className='btnClass unDoneBtn' onClick={this.showAddress}>提交地址</button>
                                                }
                                            </div>
                                        }):<div className='prompt'>
                                            <img src="./images/liziShort-02.png" alt=""/>
                                            <p>您已抽奖<br/>谢谢参与</p>
                                        </div>
                                    }

                                </div>
                        }

                    </div>
                    {
                        isMore=='T'? <div className="againLottery">
                            <button className="againBtn" onClick={()=>{history.push('/turngame')}}>
                                立即去抽奖
                            </button>
                        </div>:null
                    }
                    {
                        isAddAddress? <FillAddress hideModel={this.hideAddress} pullData={this.pullData}/>:null
                    }
                </div>
            </div>
        )
    }
}