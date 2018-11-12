import React,{Component} from 'react'
import DatePicker from 'antd/lib/date-picker';
import 'antd/lib/date-picker/style/css'; 
import locale from 'antd/lib/date-picker/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import "./rangePicker.css"


export default class RangePicker extends Component {
    constructor(props){
        super(props)

    }
    onChange = (date, dateString) => {
        // console.log(date, dateString,1);
        if(this.props.setDateParams){
            this.props.setDateParams(dateString)
        }
    }
    onOpenChange = (status) => {
        // console.log(status,2) //true or false
    }


    disabledDate=(current)=> {
        const {endReleaseDate,editType} =this.props;
        let endDay;
        if (editType ==='EDIT') {//编辑
            endDay = new Date(endReleaseDate).getTime()
        } else {//新增
            endDay = new Date(endReleaseDate).getTime()+ 1 * 24 * 60 * 60 * 1000;
        }
        return current && current.valueOf() > endDay;

    }

    render(){
        const {date,editType} =this.props;
        // console.log(date,'date')
        return (
            <DatePicker.RangePicker
                defaultValue= {editType==='EDIT'?[moment(date[0]), moment(date[1])]:[]}
                showTime={false}
                disabledDate={this.disabledDate}
                locale={locale}
                className={"dateSelect"}
                dropdownClassName={"dateRangePicker"}
                onOpenChange={this.onOpenChange}
                onChange={this.onChange}
            />
           
        )
    }
}