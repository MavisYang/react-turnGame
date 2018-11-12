根据ajax获取的数据来判断抽中的奖

var deg;
var i, j,
    cnt = 100,
    total = 0, //旋转的度数
    ratio = [],
    offset = null, //设置初始值为空
    Famount = 9,
    amount = null;  //设置初始值为空
ratio[1] = [0.2, 0.4, 0.6, 0.8, 1, 1, 1.2, 1.4, 1.6, 1.8];
ratio[2] = [1.8, 1.6, 1.4, 1.2, 1, 1, 0.8, 0.6, 0.4, 0.2];


//js
handleRotate = () => {
    var self = this;
    let resData = {
        status: 200,
        data: {
            isMore: 'T',
            rewardId: 't43',//rewardId:id
            rewardReply: 't',//奖品类型（e电子券t实物）
            recordId: '12', //recordId：中奖记录id
            nickname: '产品',//nickname：奖品
            elecUrl: 'https//:www.baidu.com'//elecUrl:电子券url
        }
    }

    if (resData.status == 200) {
        if (resData.data.isMore == 'F') { //不可抽奖
            this.setState({
                isMoreFlag: false
            })
        }
        offset = parseInt(resData.data.rewardId.substr(1) % 6 - 2)
        //此处修改转盘完毕的位置
        self.getRotateData(offset)
        self.showRotateResult(resData.data)
    } else if (resData.status == 10010) { //只能抽取一次
        self.showHandlePrompt(2, null)
    } else if (resData.status == 10012) {//谢谢参与 无可抽奖品
        self.showHandlePrompt(5, null)
    }
}

//转盘计算
getRotateData = (offset) => {
    let self = this
    for (i = 0; i < 100; i++) {
        setTimeout(function () {
            deg = Famount * (ratio[String(cnt).substr(0, 1)][String(cnt).substr(1, 1)]) * 2; //旋转角度
            self.setDegree(deg + total);//改变偏转
            total += deg;//记录
            cnt++;
        }, i * 50);
    }
    setTimeout(function () {
        offset = offset == null ? 0.5 : offset;
        amount = 9 - (0.6 * offset - 0.3);
        for (j = 0; j < 100; j++) {
            setTimeout(function () {
                deg = amount * (ratio[2][String(cnt).substr(1, 1)]);
                self.setDegree(deg + total);//改变偏转
                total += deg;//记录
                cnt++;
            }, j * 50);
        }
    }, 100 * 50)
}
setDegree = (deg) => {
    // console.log(deg)
    this.refs.inner.style.transform = 'rotate(' + deg + 'deg)'
}

<div className="outer">
    <div className="inner" ref={'inner'}/>
    <input type="button" className="butt" onClick={!globalFlag ? this.clickLottery : null}/>
</div>