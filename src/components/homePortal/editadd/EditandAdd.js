import React, {Component} from 'react';
import AxiosCore from '../../../funStore/AxiosCore'
import RangePicker from '../../shareComponent/rangePicker/RangePicker'
import SelectBox from '../../shareComponent/selectBox/SelectBox';
import './editandAdd.css';
import {releaseTime} from '../func'
export default class EditandAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date:this.props.editType=='EDIT'?[this.props.editItem.startDay,this.props.editItem.endDay]:['',this.props.endReleaseDate],
            editParmars: {
                startDay: '',
                endDay: this.props.endReleaseDate,
                time: '',//预占时间
                categoryId: '',//群类目 ID
                categoryName: '',//群类目 name
                groupNum: '',//群数量
                creatorName: '',//创建者
            },
            paramDefault:{name:''},
            scheduleItem:null
        }
    }

    componentDidMount(){
        const {paramDefault,editParmars} =this.state;
        const {editItem,scheduleList} =this.props;
        // console.log(editItem,'editItem---')
        if(editItem!=null){//EDIT
            paramDefault.name = editItem.categoryName;
            this.setState({
                paramDefault,
                editParmars:editItem,
            },()=>{
                this.scheduleitemdeatil()
            })
        }else{//ADD
            this.setState({
                editParmars: Object.assign({},{
                    webId:Math.random().toString().slice(-12),
                    ...editParmars,
                    ...scheduleList
                },{})
            })
        }
    }
    setParamsHandle = (index, sentList, name, value) => {
        // console.log(index, sentList, name, value,'selectBox')
        const {editParmars} =this.state;
        editParmars[name] = value
        editParmars.categoryName = sentList
        this.setState({
            editParmars
        },()=>{
            if(editParmars.startDay!=''){
                this.scheduleitemdeatil()
            }
        })

    }
    setDateParams = (dateString) => {
        // console.log(dateString,'dateString');
        const {endReleaseDate} = this.props
        const {editParmars} =this.state;
        editParmars.startDay = dateString[0]
        if(new Date(dateString[0]).getTime()!=new Date(endReleaseDate).getTime()){
            editParmars.endDay = dateString[1]
            this.setState({
                date:dateString
            })
        }else{
            this.setState({
                date:[dateString[0],editParmars.endDay],
            })
        }
        this.setState({editParmars},()=>{
            if(editParmars.categoryId!=''){
                this.scheduleitemdeatil()
            }
        })
    }

    handleConfirm(){
        console.log(this.handleVerify(),'this.handleVerify()')
        if(!this.handleVerify())
            return
        this.props.okEdit(this.state.editParmars,this.props.editId)
        this.props.closeEdit()
    }

    //排期列表
    scheduleitemdeatil=() =>{
        const {editParmars} =this.state
        //{
        //             "endDay": "2018-08-26",
        //             "startDay": "2018-06-23",
        //             "categoryId": 6,
        //             "time": "50"
        //         }
        let url ='launch-api/schedule/scheduleitemdeatil'
        AxiosCore.post(url,editParmars).then(res=>{
            if(res.resultCode == 100){
                this.setState({
                    scheduleItem:res.resultContent
                })
            }
        })

    }

    handleVerify=()=>{
        const {editParmars} = this.state
        let flag=true
        if(editParmars.startDay===''){
            flag=false
        } else if(editParmars.categoryId===''){
            flag=false
        } else if(editParmars.groupNum===''){
            flag=false
        }else if(!/^[0-9]*$/.test(editParmars.groupNum)){
            flag=false
        }
        return flag;

    }
    render() {
        const {date,editParmars,paramDefault} = this.state
        const {editItem,editType,taskOption} = this.props;
        return (
            <div className='editModal'>
                <div className='edit-wrapper'>
                    <div className="edit-title">预占点位</div>
                    <div className='edit-content'>
                        <div>
                            <span className='edit-label'>预占日期：</span>
                            <RangePicker date={date} endReleaseDate={this.props.endReleaseDate} editType={editType} setDateParams={this.setDateParams}/>
                        </div>
                        <div>
                            <span className='edit-label'>预占时间：</span>
                            <div>
                                <input type="text" className='titleInput' disabled placeholder={releaseTime(editParmars.time)}/>
                            </div>
                        </div>
                        <div>
                            <span className='edit-label'>预占群类目：</span>
                            <SelectBox
                                selectLabel={''}
                                paramDefault={paramDefault}
                                placeholder={"请选择群类目"}
                                selectOption={taskOption.selectOption}
                                paramaName={taskOption.paramaName}
                                paramaValue={taskOption.paramaValue}
                                setMoreSelectParama={this.setParamsHandle}
                                all={false}
                                style={{width: '180px', height: '30px', lineHeight: '30px'}}
                            />
                        </div>
                        <div>
                            <span className='edit-label'>预占群数量：</span>
                            <input className='titleInput' type="text" placeholder={'请输入群数量'}
                                   name={'groupNum'} value={editParmars.groupNum}
                                   onChange={(e)=>{
                                       editParmars[e.target.name] = e.target.value
                                       this.setState({editParmars})
                                   }}/>
                        </div>
                    </div>
                    <div className='edit-btnwrapper'>
                        <button className='cancelBtn' onClick={this.props.closeEdit}>取消</button>
                        <button className='confirmBtn' onClick={this.handleConfirm.bind(this)}>{editType==='EDIT'?'编辑':'新增'}预占</button>
                    </div>
                    <ul className='scheduleList'>
                        {
                            this.state.scheduleItem?this.state.scheduleItem.map((item,index)=>{
                                return  <li key={index}>{item}</li>
                            }):null
                        }
                    </ul>

                </div>
            </div>

        )
    }
}