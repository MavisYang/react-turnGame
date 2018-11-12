import React, {Component} from 'react'
import $ from 'jquery'
import {groupId, wxIp} from '../../../constants/OriginName'
import AxiosCore from '../../../funStore/AxiosCore'
import {getCookie, saveCookie, getQueryString} from '../../../funStore/utils'
import {Error} from '../ShowPrompt/ShowTip'
import FillAddress from '../FillAddress'
import ShowPrompt from '../ShowPrompt'
import './index.css'

var deg;
var i, j,
    cnt = 100,
    total = 0, //旋转的度数
    ratio = [],
    offset = null, //设置初始值为空
    Famount = 9,
    amount = null;  //设置初始值为空
ratio[1] = [0.2, 0.4, 0.6, 0.8, 1, 1, 1.2, 1.4, 1.6, 1.8];
ratio[2] = [1.8, 1.6, 1.4, 1.2, 1, 1, 0.8, 0.6, 0.4, 0.2];

export default class Index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            view: '',
            error: false,
            globalFlag: null,
            isMoreFlag: true,//isMore： 验证是否已经抽奖 （T是F否） //表示可抽奖，false表示不可抽奖
            isEmptyFlag: false,//isEmpty  奖品是否还有（T空F否） //表示抽奖是否都抽完，true:空
            prompt: {
                status: 0,
                statusData: ''
            },

        }
    }

    componentDidMount() {
        // if(!getCookie('openid_cookie')==null||getCookie('openid_cookie')==undefined){
        //     let openid = getCookie('openid_cookie')
        //     this.getInitData(openid)
        //     return
        // }
        //
        // $.ajax({
        //     url: wxIp + 'wx/base/getUserInfo?code=' + getQueryString('code'),//code 微信链接自带
        //     type: 'get',
        //     success: function (res) {
        //         if (res.status == 200) {
        //             let openid = "oNPcuvwSAbloL61gchfWP_PBw26U";  //测试
        //             // let openid = res.data.openid;
        //             saveCookie('openid_cookie',openid,7)
        //             this.getInitData(openid)
        //         } else {
        //             alert("加载失败,请刷新重试")
        //         }
        //     }
        // })

    }

    pullData = () => {

    }


    //判断是非可抽奖
    getInitData = (openid) => {
        AxiosCore.get('moac/verifyLoadReward?openid=' + openid).then(res => {
            console.log(res)
            if (res.status == 200) {
                if (res.data.isMore == "F") {// isMore： 验证是否已经抽奖 （T是F否）
                    this.setState({
                        isMoreFlag: false
                    })
                } else if (res.data.isEmpty == 'T') { //isEmpty  奖品是否还有（T空F否）
                    this.setState({
                        isEmptyFlag: false
                    })
                }
            }
        })
    }

    clickLottery = () => {
        console.log(10)
        const {isMoreFlag, isEmptyFlag, globalFlag} = this.state
        if (!isMoreFlag) {
            this.showHandlePrompt(1, null)
            return
        }
        if (isEmptyFlag) {
            this.showHandlePrompt(5, null)
            return
        }
        if (!globalFlag) {
            // this.setState({
            //     globalFlag:true
            // })
            this.handleRotate();
        }

    }

    handleRotate = () => {
        var self = this;
        let resData = {
            status: 200,
            data: {
                isMore: 'T',
                rewardId: 't43',//rewardId:id
                rewardReply: 't',//奖品类型（e电子券t实物）
                recordId: '12', //recordId：中奖记录id
                nickname: '产品',//nickname：奖品
                elecUrl: 'https//:www.baidu.com'//elecUrl:电子券url
            }
        }

        if (resData.status == 200) {
            if (resData.data.isMore == 'F') { //不可抽奖
                this.setState({
                    isMoreFlag: false
                })
            }
            offset = parseInt(resData.data.rewardId.substr(1) % 6 - 2)//此处修改转盘完毕的位置
            self.getRotateData(offset)
            self.showRotateResult(resData.data)
        } else if (resData.status == 10010) { //只能抽取一次
            self.showHandlePrompt(2, null)
        } else if (resData.status == 10012) {//谢谢参与 无可抽奖品
            self.showHandlePrompt(5, null)
        }
    }

    //转盘计算
    getRotateData = (offset) => {
        let self = this
        for (i = 0; i < 100; i++) {
            setTimeout(function () {
                deg = Famount * (ratio[String(cnt).substr(0, 1)][String(cnt).substr(1, 1)]) * 2; //旋转角度
                self.setDegree(deg + total);//改变偏转
                total += deg;//记录
                cnt++;
            }, i * 50);
        }
        setTimeout(function () {
            offset = offset == null ? 0.5 : offset;
            amount = 9 - (0.6 * offset - 0.3);
            for (j = 0; j < 100; j++) {
                setTimeout(function () {
                    deg = amount * (ratio[2][String(cnt).substr(1, 1)]);
                    self.setDegree(deg + total);//改变偏转
                    total += deg;//记录
                    cnt++;
                }, j * 50);
            }
        }, 100 * 50)
    }
    setDegree = (deg) => {
        // console.log(deg)
        this.refs.inner.style.transform = 'rotate(' + deg + 'deg)'
    }

    //结果展示
    showRotateResult = (resultData) => {
        let self = this
        let rewardReply = resultData.rewardReply
        setTimeout(function () {
            switch (rewardReply) {
                case 't'://实物
                    self.showHandlePrompt(3, resultData);
                    break;
                case 'e'://电子券
                    self.showHandlePrompt(4, resultData)
                    break;
                case 'n'://谢谢参与
                    self.showHandlePrompt(1, resultData)
                    break;
                default:
                    self.handleError()
                    break;
            }
        }, 200 * 50 + 500);
    }


    hideModel = () => {
        this.setState({
            view: ''
        })
    }


    showHandlePrompt = (status, statusData) => {
        this.setState({
            view: 'PROMPT',
            prompt: {
                status: status,
                statusData: statusData
            }
        })
    }

    //添加地址
    showFillAddress = () => {
        this.setState({
            view: 'ADDRESS',
            isAddAddress: true
        })
    }

    //领取电子券
    getDianziCoupons = (statusData) => {
        window.location.href = statusData.elecUrl
    }

    //查看历史
    goToHistory = () => {
        this.props.history.push('/history')
    }

    handleError = () => {
        this.setState({
            error: true
        })

        setTimeout(() => {
            this.setState({
                error: false
            })
        }, 2000)
    }

    render() {
        const {view, globalFlag, prompt} = this.state
        return (
            <div className='containter'>
                <div className='homeWrapper'>
                    <div className="topTag"/>
                    <div className="history" onClick={this.goToHistory}>抽奖历史</div>
                    <div className="midTag"/>
                    <div className="outer">
                        <div className="inner" ref={'inner'}/>
                        <input type="button" className="butt" onClick={!globalFlag ? this.clickLottery : null}/>
                    </div>
                </div>
                {
                    view == 'ADDRESS'
                        ? <FillAddress hideModel={this.hideModel} pullData={this.pullData}/>
                        : view == 'PROMPT'
                        ? <ShowPrompt
                            status={prompt.status}
                            statusData={prompt.statusData}
                            hideModel={this.hideModel}
                            getDianziCoupons={this.getDianziCoupons}
                            showFillAddress={this.showFillAddress}
                            goToHistory={this.goToHistory}
                        /> : null
                }
                {this.state.error ? <Error/> : null}
            </div>
        )
    }
}