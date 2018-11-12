import React, {Component} from 'react'
import './index.css'

export default class Index extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        // status 1:未中奖 2:不要太贪心 3:实物 4：优惠券 5 很遗憾，奖品已抽完
        const {status, statusData, goToHistory, hideModel, showFillAddress, getDianziCoupons} = this.props
        return (
            <div className='popupModel'>
                <div className="partStatus">
                    <div className="partInner">
                        <div className="partTitle">
                            {
                                status == 1 ? '很遗憾，未中奖～'
                                    : status == 2 ? '不要太贪心哦～'
                                    : status == 3 || status == 4 ? ' 恭喜您！'
                                        : status == 5 ? '很遗憾，奖品已抽完' : ''
                            }
                        </div>
                        <div className="partIMG">
                            <img src={
                                status == 1 || status == 2 || status == 5 ? '../images/liziShort.png'
                                    : status == 3 ? '../images/gift_' + statusData.rewardId.substr(1) + '.png'
                                    : status == 4 ? '../images/win.png'
                                        : ''
                            } alt=""/>
                        </div>
                        <div className="partState">
                            {
                                status == 1 ? '下次再接再厉～'
                                    : status == 2 ? '每位宝妈只能领取一次哦～'
                                    : status == 3 || status == 4 ? '亲爱的宝妈恭喜您获得该奖品'
                                        : status == 5 ? "谢谢您的参与～" : ''
                            }
                        </div>
                        <div className="btnContainer">
                            {
                                status == 1 ? <button className='negativeButton' onClick={hideModel}>返 回</button>
                                    : status == 2 || status == 5 ?
                                    <button className='negativeButton' onClick={goToHistory}>查 看</button>
                                    : status == 3 ?
                                        <button className='negativeButton' onClick={showFillAddress}>领取实物礼品</button>
                                        : status == 4 ? <button className='negativeButton'
                                                                onClick={() => getDianziCoupons(statusData)}>领取电子券</button>
                                            : ''
                            }
                            {/*<input type="button" className="negativeButton" value=""/>*/}
                        </div>
                    </div>
                    <div className="modelClose" onClick={hideModel}/>
                </div>
            </div>
        )
    }
}