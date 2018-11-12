import React,{Component} from 'react'
import './index.css'
import 'spring-picker/lib/style.css'
import {Popup,Picker} from 'spring-picker'
import PickerAddress from './PickerAddress/index'
import {Success} from '../ShowPrompt/ShowTip'
import {phoneVerify} from '../../../funStore/utils'

export default class Index extends Component{
    constructor(props){
        super(props)
        this.state={
            addressPickerVisible: false,
            address: ['上海市','上海市','静安区'],
            params:{
                city:''
            },
            success:false
        }

    }

    // 地址选择
    showAddressPicker =(e)=> {
        e.nativeEvent.stopImmediatePropagation();
        this.setState({addressPickerVisible: true});
    }

    //完成
    closeAddressPicker =(address)=> {
        const {params} = this.state
        params.city=address
        this.setState({
            address: address,
            addressPickerVisible: false,
            params,
        });
    }

    //取消
    cancelAddressPicker =() =>{
        this.setState({
            address: this.state.address,
            addressPickerVisible: false,
        });
    }

    //change
    handleChangeAddress =(address)=>{
        this.setState({
            address: address,
        })
    }

    handleChange=(e)=>{
        const {params} =this.state
        params[e.target.name] = e.target.value
        this.setState({
            params
        })
    }

    submitVerifyHandle = () => {
        const {params} = this.state
        let flag = true
        if (!phoneVerify(params.phone)||params.city=='') {
            flag = false
        }
        return flag
    }

    handleSubmit=()=>{
        const {params} =this.state
        params.city=params.city[0]+params.city[1]+params.city[2]
        console.log(params,'params=')
        if(!this.submitVerifyHandle()) return

            //重新获取数据
            if(this.props.pullData){
                this.props.pullData()
            }


            this.setState({
                success:true
            })

        setTimeout(()=>{
            this.setState({
                success:false
            })

            this.props.hideModel()
        },2000)


    }
    render(){
        const {params} =this.state
        const {hideModel} =this.props
        return(
            <div className="popupModel">
                <div className="userInfo" >
                    <div className="infoTitle">获奖信息填写</div>
                    <div className="infoState">栗子妈妈的工作人员将在<br/>
                        7个工作日内发货哟
                    </div>
                    <div className="mainForm">
                        <table cellPadding="5" className="infoTable">
                            <tbody>
                            <tr>
                                <td>姓名&nbsp;&nbsp;&nbsp;</td>
                                <td className="fill_content_text" colSpan="2" align="left">
                                    <input type="text" placeholder="请输入真实姓名" name="name" autoComplete="off" onChange={this.handleChange}/>
                                </td>
                            </tr>
                            <tr>
                                <td>电话&nbsp;&nbsp;&nbsp;</td>
                                <td className="fill_content_text" colSpan="2" align="left">
                                    <input type="text" placeholder="请填写11位手机号" name="phone" autoComplete="off" maxLength="11" onChange={this.handleChange}/>
                                </td>
                            </tr>
                            <tr>
                                <td>地址&nbsp;&nbsp;&nbsp;</td>
                                <td className="fill_content_text" colSpan="2" align="left">
                                    <input type="text" placeholder="选择省/市/区/街道" name="city" autoComplete="off" readOnly="readonly"
                                           value={params.city}
                                           onClick={this.showAddressPicker}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td/>
                                <td className="fill_content_text" colSpan="2" align="left">
                                    <input type="text" placeholder="填写详细地址" name="address" autoComplete="off" onChange={this.handleChange}/>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="buttContainer">
                        <input name="submit" type="button" className="fill_submit" value="提交" onClick={this.handleSubmit}/>
                    </div>
                    <div className="modelClose" onClick={hideModel}/>
                </div>
                <PickerAddress
                    defaultValue={this.state.address}
                    visible={this.state.addressPickerVisible}
                    onCancel={this.cancelAddressPicker}
                    onConfirm={this.closeAddressPicker}
                    onChange={this.handleChangeAddress}
                />
                {
                    this.state.success? <Success/>:null
                }

            </div>
        )
    }
}