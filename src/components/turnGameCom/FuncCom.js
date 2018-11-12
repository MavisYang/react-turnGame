import React, {Component} from 'react'
import './FillAddress/index.css'

export const QrCode = () => {
    return <div className='popupModel'>
        <div className="unFocus">
            <div className="unFocusInner">
                <div className="QrCode">
                    <img src="../images/qr.png" className="focusQrCode"/>
                </div>
                <div className="QrState">栗子妈妈俱乐部会员可以获得<br/>一次免费抽奖机会，赶紧加入吧~</div>
            </div>
            <div className="modelClose"></div>
        </div>
    </div>
}
export const Stop = () => {
    return <div className='popupModel'>
        <div className="stopLottery">
            <div className="stopState">抽奖已结束</div>
        </div>
    </div>
}