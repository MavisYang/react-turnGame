import React, { Component } from 'react'
import  './selectBox.css'

export default class SelectBox extends Component {
    constructor() {
        super();
        this.state = {
            showOption: false,
            currentId: -1,
            selectTitle: "请选择类型",
            ifSelect: false
        }
    }
    showMoreOption() {
        if (!this.props.disable) {
            this.setState({
                showOption: !this.state.showOption
            })
        }
    }

    selectedOption(index,sentList,name,value){
        this.setState({
            currentId:index,
            selectTitle:sentList,
            showOption:!this.state.showOption,
            ifSelect:true
        })
        if (this.props.setMoreSelectParama) {
            this.props.setMoreSelectParama(index, sentList, name, value)
        }
    }
    hideOption() {
        this.setState({
            showOption: false
        })
    }
    componentWillMount() {
        if (this.props.placeholder) {
            this.setState({
                selectTitle: this.props.placeholder
            })
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.clear) {
            this.setState({
                currentId: -1,
                selectTitle: this.props.placeholder ? this.props.placeholder : "请选择类型",
                ifSelect: false
            })
        }
    }
    render() {
        let { showOption, currentId, selectTitle, ifSelect } = this.state
        let { selectLabel, selectOption, paramaName, paramDefault, paramaValue, 
            style, all, verify, disable, iptColor, disableBackground } = this.props
        const styleCss = style != undefined ? style : {};
        const id = this.props.id == undefined || this.props.id == '' ? '' : this.props.id;
        const _currentId = paramDefault != undefined && currentId == -1 ? paramDefault.id : currentId
        return (
            <div className='selectWrapper' onBlur={this.hideOption.bind(this)} tabIndex={1}>
                {selectLabel ? <div className="selectLabel">{selectLabel}</div>:null}
                <div className="selectBox" style={styleCss}>
                    <div className="selectOption" id={id} onClick={this.showMoreOption.bind(this)}
                        style={Object.assign({}, { border: verify ? '1px solid red' : showOption ? "1px solid #BFC0BF" : iptColor ? iptColor : "1px solid transparent" }, styleCss, { backgroundColor: disableBackground ? disableBackground : '' })}>
                        <em className={!ifSelect && paramDefault == undefined &&paramDefault.name!=''? "unselectedTip" : "selectTip"}>
                            {!ifSelect && paramDefault != undefined &&paramDefault.name!=''? paramDefault.name : selectTitle}
                        </em>
                        <span className={showOption ? "selectArrow icon-background selIcon" : "selIcon icon-background"} />
                    </div>
                    <div className="optionUl" style={Object.assign({}, { display: showOption ? "block" : "none", transition: 'all .4s' })}>
                        <ul>
                            <li style={{display:all?'block':'none'}} className={_currentId==null?"selected":""}
                                onClick={this.selectedOption.bind(this,null,'全部',paramaName,null)}>全部</li>
                            {selectOption.map((data,index)=>{
                                return  <li
                                    key={index}
                                    className={_currentId==index?"selected":""}
                                    onClick={this.selectedOption.bind(this,index,data,paramaName,paramaValue[index])}
                                > {data} </li>
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}
