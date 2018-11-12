export const interceptTime =(time)=>{
    let timeArr = time.split('-')
    return timeArr[1]+'.'+timeArr[2]
}

export const releaseTime = (status)=>{
    let releaseTime='00:00'+'-'+'23:59';
    switch (status){
        case '0':
            releaseTime =  '00:00'+'-'+'23:59';
            break;
        case '20':
            releaseTime =  '10:00'+'-'+'14:00';
            break;
        case '30':
            releaseTime =  '14:00'+'-'+'18:00';
            break;
        case '40':
            releaseTime =  '18:00'+'-'+'22:00';
            break;
        case '50':
            releaseTime =  '06:00'+'-'+'14:00';
            break;
        case '60':
            releaseTime =  '14:00'+'-'+'22:00';
            break;
        default:
            break;
    }
    return releaseTime;

    //
    // '0': ['00:00', '23:59'],
    //     # '20': ['10:00', '14:00'],
    //     # '30': ['14:00', '18:00'],
    //     # '40': ['18:00', '22:00']
    // '50': ['06:00', '14:00'],
    //     '60': ['14:00', '22:00']
}

export const releaseDate=(date)=>{
    let newDate = date?date.split('T')[1].split(':'):['','']
    return newDate[0]+':'+newDate[1]

}

export const replaceTime = (time)=>{
    return time.replace(/\-/g,'.')
}
export const reviewStatus=(status)=>{
    let reviewstatus = ''
    switch (status){
        case 1:
            reviewstatus =  '待审核'
            break;
        case 2:
            reviewstatus =  '审核通过'
            break;
        case 3:
            reviewstatus =  '审核不通过'
            break;
        default:
            reviewstatus =  '--'
            break;
    }
    return reviewstatus;

}

export const getQueryString = (name) => {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if (r != null)
        return (r[2]);
    return null;
}