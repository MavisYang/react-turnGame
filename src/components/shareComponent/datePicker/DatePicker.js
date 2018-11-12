import React,{Component} from 'react'
import DatePicker from 'antd/lib/date-picker'
import 'antd/lib/date-picker/style/css';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import "./datePicker.css"

export default class DatePickeSelect extends Component {
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
    render(){
        const {disabledDate,dateValue} =this.props;
        return (
            <DatePicker
                defaultValue={dateValue!=''?moment(dateValue):undefined}
                showTime={false}
                showToday={false}
                locale={locale}
                className='datepickerSelect'
                dropdownClassName='downSelect'
                onOpenChange={this.onOpenChange}
                onChange={this.onChange}
            />

        )
    }
}