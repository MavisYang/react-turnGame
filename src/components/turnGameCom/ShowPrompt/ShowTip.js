import React, {Component} from 'react'
import './index.css'

export const Success = () => {
    return < div className='shadowBox'>
        <div className="success-icon"/>
        <div className='text'>
            提交成功
        </div>
    </div>

}

export const Error = () => {
    return <div className='shadowBox'>
        <div className='fresh-icon'/>
        <div className='text'>网络不稳定请刷新重试</div>
    </div>
}