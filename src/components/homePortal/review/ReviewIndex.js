import React, {Component} from 'react';
import './review.css';
import {API_PATH} from '../../../constants/OriginName'
import AxiosCore from "../../../funStore/AxiosCore";
import EditandAdd from '../editadd/EditandAdd';
import { interceptTime, releaseTime, releaseDate, reviewStatus, replaceTime} from '../func'
import Messages from "../../shareComponent/message/Message";
import Preview from './Preview';
import {sendEvent} from '../../../funStore/utils'
import DatePicker from '../../shareComponent/datePicker/DatePicker'
import moment from 'moment'
const InputTime = ({label, handleChange, name, values}) => {
    return <div className='inputBox'>
        <input value={values} maxLength={2} onChange={(e) => {
            handleChange(e)
        }} type="text" name={name}/> {label}
    </div>
}
export default class ReviewIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editStatus: false,
            editId: '',
            editType: '',
            editItem: null,
            reviewData: {
                hour: '',
                minute: ''
            },
            taskOption: {
                selectOption: [],
                paramaName: 'categoryId',
                paramaValue: [],
            },
            reviewLists: null,
            labels: null,//标签列表
            scheduleList: {
                time: '',
                creatorName: '',
                categoryName: ''
            },
            initItem: null,
            params: {
                startReleaseDate: '', //期望投放时间 年月日
                endReleaseDate: '', //期望投放时间 年月日
                auditStatus: 0, //2 通过 3 不通过
                launchId: 0, //id
                releaseTime: "",//投放时间 ‘09：09’
                groupNum: '',
                schedules: [
                    // {
                    //     startDay: '',
                    //     endDay: '',
                    //     time: '',//预占时间
                    //     categoryId: '',//群类目 ID
                    //     categoryName: '',//群类目 name
                    //     groupNum: '',//群数量
                    //     creatorName: '',//创建者
                    // }
                ],
            },
            verifyTime: true,
            verifySchedules: true,
            verifyGroupNum: true,
            verifystartDate:true,
            promptMsg: null,
            previewShow: false,
            checkItem: null,
            previewCss: {
                left: 0,
                top: 0
            },
            radio: true,
            labelNames: []
        }

    }

    componentDidMount() {
        document.title = '任务审核';
        let pathArry = window.location.pathname.split('/');
        let id = pathArry[pathArry.length - 3];
        this.getPullData(id);//获取信息
        this.getlabel();//获取标签数字字典
        this.getLaunchName();//获取预占群类目
        window.addEventListener('click', this.hidePreview)

    }

    componentWillUnmount() {
        window.removeEventListener('click', this.hidePreview)
    }

    getPullData = (id) => {
        const {params, reviewData, scheduleList,radio} = this.state
        AxiosCore.get('/launch-api/launch/managerlist?managerAddId=' + id).then(res => {
            let resData = res.resultContent[0];
            this.getLabesName(resData.id)//获取素材标签

            params.launchId = resData.id;

            let recommend = resData.recommendFlag == null ? true : resData.recommendFlag
            if(recommend){
                params.startReleaseDate = resData.releaseDate != null ? resData.releaseDate.split('T')[0] : '';
            }else{
                this.getScheduleitems(id);//获取审核通过的预占点位
                params.startReleaseDate = resData.addition[0].startReleaseDate;
            }
            params.releaseTime = resData.releaseDate != null ? releaseDate(resData.releaseDate) : '';
            params.groupNum = resData.groupNum != null ? resData.groupNum :''

            if (params.releaseTime != '') {
                reviewData.hour = params.releaseTime.split(':')[0];
                reviewData.minute = params.releaseTime.split(':')[1];
            }

            params.endReleaseDate = resData.addition[0].endReleaseDate;
            scheduleList.creatorName = resData.creatorName ? resData.creatorName : '';
            scheduleList.time = resData.addition[0].releaseTime;
            scheduleList.categoryName = resData.describe;

            this.setState({
                reviewLists: resData,
                params: params,
                reviewData: reviewData,
                scheduleList: scheduleList,
                radio: recommend
            })
        }).catch(req => {
            console.log('req---', req)
        })

    }

    selectRadio = () => {
        let pathArry = window.location.pathname.split('/');
        let id = pathArry[pathArry.length - 3];
        const {radio,reviewLists,params}=this.state
        this.setState({
            radio: !this.state.radio
        },()=>{
            if(!radio){
                params.startReleaseDate = reviewLists.releaseDate != null ? reviewLists.releaseDate.split('T')[0] : '';
            }else{
                this.getScheduleitems(id);//获取审核通过的预占点位
                params.startReleaseDate = reviewLists.addition[0].startReleaseDate;
            }
            this.setState({
                params
            })
        })

    }

    //获取审核通过的预占点位
    getScheduleitems = (id) => {
        const {params} = this.state
        AxiosCore.get('/launch-api/schedule/scheduleitems/' + id).then(res => {
            params.schedules = res.resultContent.map(item => {
                return Object.assign({}, {
                    webId: Math.random().toString().slice(-12),
                    creatorName: this.state.scheduleList.creatorName,
                    ...item
                }, {})
            });
            this.setState({
                params
            })
        }).catch(req => {
            console.log('req---', req)
        })
    }

    //获取标签列表
    getlabel = () => {
        AxiosCore.get('/launch-api/launch/getlabel').then(res => {
            this.setState({
                labels: res.resultContent
            })
        })
    }
    //获取预展群类目
    getLaunchName = () => {
        const {taskOption} = this.state
        AxiosCore.get('/launch-api/launch/category').then(res => {
            res.resultContent.forEach(item => {
                taskOption.selectOption.push(item.name)
                taskOption.paramaValue.push(item.id)
            })
            this.setState({taskOption})
        }).catch(req => {
            console.log(req, 'req')
        })
    }

    handleChange = (e) => {
        const {reviewData} = this.state;
        reviewData[e.target.name] = e.target.value;
        this.setState({
            reviewData,
            verifyTime: true
        })
    }

    hangleGroupNum = (e) => {
        const {params} = this.state;
        params[e.target.name] = e.target.value;
        this.setState({
            params,
            verifyGroupNum: true
        })
    }

    haneleEditandAdd(editItem, editId, editType) {
        this.setState({
            editStatus: true,
            editItem: editItem,
            editId: editId,
            editType: editType,
            verifySchedules: true,
            initItem: editItem
        })
    }

    okEdit = (addItem, editId) => {
        const {params} = this.state
        if (editId !== '') {//edit
            params.schedules.map(item => {
                item.id === editId ?
                    Object.assign({}, {...addItem}, {})
                    : Object.assign({}, {...item}, {})
            })
        } else {
            params.schedules.push(addItem)
        }
        this.setState({params})
    }

    closeEdit = () => {
        this.setState({
            editStatus: false,
            editItem: null
        })
    }

    handleClickDelete = (editId) => {
        const {params} = this.state;
        let newSchedules = []
        params.schedules.map(item => {
            item.webId != editId ? newSchedules.push(item) : ''
        })
        params.schedules = newSchedules;
        this.setState({params})
    }

    handleClickReview = (type) => {
        //"auditStatus": 0, //type 2 通过 3 不通过,不需要验证
        const {params, reviewData, radio} = this.state
        let noYes = {}
        if (type == 2) { //type==3 审核不通过的时候，投放时间、点位为空也可以提交
            if (!this.handleVerify()) return
            params.recommendFlag = radio ? 1 : 0
            params.auditStatus = type;
            params.groupNum= params.groupNum!=''?params.groupNum:0
            reviewData.hour === '' || reviewData.minute === '' ? params.releaseTime = null : params.releaseTime = reviewData.hour + ':' + reviewData.minute;
            this.setState({params})
            console.log(params, 'params')
        }else if(type == 3) {
            noYes.auditStatus = type;
            noYes.launchId=params.launchId
            console.log(noYes, 'noYes')
        }
        AxiosCore.post('/launch-api/launch/manageraduit', type==2?params:noYes).then(res => {
            sendEvent("messages", {msg: "审核操作成功", status: 200});
            //审核通过跳转审核首页
            // window.location.href=API_PATH+'/admin/launch/launchmanageraddition/'
        }).catch(req => {
            sendEvent("messages", {msg: "审核操作失败", status: 203});
        })
    }

    handleVerify = () => {
        const {params, reviewData,radio} = this.state
        let flag = true;
        if (!reviewData.hour || !reviewData.minute || !/^[0-9]*$/.test(reviewData.hour) || !/^[0-9]*$/.test(reviewData.minute)) {
            flag = false
            this.setState({
                verifyTime: false
            })
        }
        if(radio){
            if (params.groupNum == '' || params.groupNum == null) {
                flag = false
                this.setState({
                    verifyGroupNum: false
                })
            }
            if(params.startReleaseDate==''){
                flag = false
                this.setState({
                    verifystartDate: false
                })
            }
        }else{
            if (params.schedules.length < 1 || params.schedules.length > 10) {
                flag = false
                this.setState({
                    verifySchedules: false
                })
            }
        }
        return flag
    }


    hidePreview = () => {
        this.setState({
            previewShow: false
        })
    }

    previewHandle = (e, item) => {
        let x = e.clientX
        let y = e.clientY
        let isTop = e.clientY < document.body.clientHeight / 2
        this.setState({
            previewShow: true,
            checkItem: item
        }, () => {

            let {previewCss} = this.state
            if (isTop) {
                previewCss.left = x - 140 + 'px'
                previewCss.top = y + 'px'
            } else {
                previewCss.left = x - 140 + 'px'
                previewCss.top = y - this.refs.preview.offsetHeight + 'px'
            }
            this.setState({previewCss})
        })
    }

    setDateParams=(dateString)=>{
        const {params} =this.state
        params.startReleaseDate=dateString
        this.setState({params,verifystartDate: true})
    }
    getLabesName = (taskId) => {
        let url = '/launch-api/launch/labelname/' + taskId
        AxiosCore.get(url).then(res => {
            this.setState({
                labelNames: res.resultContent
            })
        }).catch(req => {
            console.log(req, '操作失败')
        })
    }



    render() {
        const {reviewLists, params, reviewData, editStatus, editItem, verifyTime, verifyGroupNum, verifySchedules, verifystartDate,radio, labelNames} = this.state;
        return (<div className='reviewContent'>
            {/*<div className='title'>任务审核</div>*/}
            <div className='contentList'>
                {
                    reviewLists != null ?
                        <ul>
                            <li>
                                <span className='list-left'>任务名称：</span>
                                <div className='list-right'>{reviewLists.name}</div>
                            </li>
                            <li>
                                <span className='list-left'>创建者：</span>
                                <div className='list-right'>{reviewLists.creatorName}</div>
                            </li>
                            <li className='material'>
                                <span className='list-left' style={{verticalAlign: 'top'}}>素材名称：</span>
                                <div className='list-right'>
                                    {
                                        reviewLists.materialId.length > 0 ?
                                            reviewLists.materialId.map((item, index) => {
                                                return <p key={index}><span className='name'>{item.name}</span><span
                                                    className='previewBtn' onClick={(e) => {
                                                    e.stopPropagation();
                                                    this.previewHandle(e, item)
                                                }}>预览</span></p>
                                            }) : '--'
                                    }
                                </div>
                            </li>
                            <li>
                                <span className='list-left'>素材标签：</span>
                                <div className='list-right'>
                                    {
                                        labelNames && labelNames.length > 0 ? labelNames.map((item, index) => {
                                            return index === labelNames.length - 1
                                                ? <span key={index}>{item}</span>
                                                : <span key={index}>{item},</span>
                                        }) : null
                                    }
                                </div>
                            </li>
                            <li>
                                <span className='list-left'>计费方式：</span>
                                <div className='list-right'>{reviewLists.addition.length > 0 ? reviewLists.addition[0].chargingId == 1 ? '点击' : '曝光' : ''}</div>
                            </li>
                            <li>
                                <span className='list-left'>每天预算：</span>
                                <div className='list-right'>{reviewLists.addition.length > 0 ? parseInt(reviewLists.addition[0].budget) : '0'}</div>
                            </li>
                            <li>
                                <span className='list-left'>期望时间：</span>
                                <div className='list-right'>
                                    {
                                        reviewLists.addition.length > 0
                                            ? replaceTime(reviewLists.addition[0].startReleaseDate)
                                            + '-' + replaceTime(reviewLists.addition[0].endReleaseDate)
                                            + '  ' + releaseTime(reviewLists.addition[0].releaseTime)
                                            : '--'
                                    }
                                </div>
                            </li>
                            <li>
                                <span className='list-left'>审核状态：</span>
                                <div className='list-right'>{reviewStatus(reviewLists.auditStatus)}</div>
                            </li>
                            <li>
                                <span className='list-left'>备注消息：</span>
                                <div className='list-right'>{reviewLists.describe}</div>
                            </li>
                            <li>
                                <span className='list-left'>智能推荐：</span>
                                <div className='list-right'>
                                    <span className={`radioSelected ${!radio ? 'noSelected' : ''}`} onClick={this.selectRadio}/>
                                    开启智能推荐
                                </div>
                            </li>
                            {
                                radio ? <div>
                                        <li>
                                            <span className='list-left'>推荐群数：</span>
                                            <div className='list-right'>
                                                <div className='inputBox'>
                                                    <input type="text" value={params.groupNum} name='groupNum'
                                                           onChange={this.hangleGroupNum} style={{width: '107px'}}/>
                                                </div>
                                                {
                                                    !verifyGroupNum ? <span className='prompt'>请填写推荐群数</span> : null
                                                }
                                            </div>
                                        </li>
                                        <li>
                                            <span className='list-left'>选择日期：</span>
                                            <div className='list-right'>
                                                <div style={{float:'left'}}>
                                                    <DatePicker dateValue={params.startReleaseDate}
                                                                setDateParams={this.setDateParams}/>
                                                </div>
                                                {
                                                    !verifystartDate ? <span className='prompt' style={{marginTop:'7px'}}>请选择日期</span> : null
                                                }

                                            </div>
                                        </li>
                                        <li>
                                            <span className='list-left'>投放时间：</span>
                                            <div className='list-right'>
                                                <InputTime values={reviewData.hour} handleChange={this.handleChange}
                                                           label={'时'} name='hour'/>
                                                <InputTime values={reviewData.minute} handleChange={this.handleChange}
                                                           label={'分'} name='minute'/>
                                                {
                                                    !verifyTime ? <span className='prompt'>请填写投放时间</span> : null
                                                }
                                            </div>
                                        </li>
                                    </div> :
                                    <div>
                                        <li>
                                            <span className='list-left'>投放时间：</span>
                                            <div className='list-right'>
                                                <InputTime values={reviewData.hour} handleChange={this.handleChange}
                                                           label={'时'} name='hour'/>
                                                <InputTime values={reviewData.minute} handleChange={this.handleChange}
                                                           label={'分'} name='minute'/>
                                                {
                                                    !verifyTime ? <span className='prompt'>请填写投放时间</span> : null
                                                }
                                            </div>
                                        </li>
                                        <li>
                                            <span className='list-left'>预占点位：</span>
                                            <div className='list-right'>
                                                预计需要群
                                                {reviewLists.addition[0].budget ? parseInt(parseInt(reviewLists.addition[0].budget) / (0.99 * 0.05 * 180)) + 1 : 0}
                                                个
                                            </div>
                                        </li>
                                        <li className='grouplist'>
                                            <span className='list-left'/>
                                            <div className='list-right'>
                                                <ul>
                                                    {
                                                        params.schedules ? params.schedules.map((item, index) => {
                                                            return <li key={index}>
                                                                <div className='left'>
                                                                    <span>{interceptTime(item.startDay) + '-' + interceptTime(item.endDay)}</span>
                                                                    <span>{releaseTime(item.time)}</span>
                                                                    <span>{item.categoryName}</span>
                                                                    <span>{item.groupNum}个</span>
                                                                </div>
                                                                <div>
                                                                    <span className='edit'
                                                                          onClick={() => this.haneleEditandAdd(item, item.webId, 'EDIT')}>编辑</span>
                                                                    <span className='delete'
                                                                          onClick={() => this.handleClickDelete(item.webId)}>删除</span>
                                                                </div>
                                                            </li>
                                                        }) : null
                                                    }
                                                </ul>
                                                <div className='addBox'>
                                                    <button className='addBtn'
                                                            disabled={params.schedules.length >= 10 ? true : false}
                                                            onClick={() => this.haneleEditandAdd(null, '', 'ADD')}>新增
                                                    </button>
                                                    {params.schedules.length >= 10 ?
                                                        <span className='addPrompt'>最多可新增10个</span> : null}
                                                    {!verifySchedules ?
                                                        <span className='addPrompt'>请新增预占点位</span> : null}
                                                </div>
                                            </div>
                                        </li>
                                    </div>
                            }

                        </ul> : null
                }

            </div>
            <div className='review-btn-wrapper'>
                <button className='failBtn' onClick={() => this.handleClickReview(3)}>审核不通过</button>
                <button className='okBtn' onClick={() => this.handleClickReview(2)}>审核通过</button>
            </div>
            {
                editStatus ? <EditandAdd
                    endReleaseDate={params.endReleaseDate}
                    editItem={editItem}
                    editType={this.state.editType}
                    editId={this.state.editId}
                    taskOption={this.state.taskOption}
                    scheduleList={this.state.scheduleList}
                    closeEdit={this.closeEdit}
                    okEdit={this.okEdit}
                /> : null
            }
            {
                this.state.previewShow ?
                    <div ref="preview" className='preview' style={Object.assign({}, this.state.previewCss)}>
                        <Preview checkItem={this.state.checkItem}/>
                    </div>
                    : ''
            }
            <Messages/>
        </div>)
    }
}