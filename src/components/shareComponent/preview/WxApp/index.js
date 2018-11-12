import React,{Component} from 'react'
import './index.css'

// const xmlTest = '<?xml version="1.0"?>↵<msg>↵	<appmsg appid="" sdkver="0">↵		<title>开心微游戏！寻找让你快乐的游戏！</title>↵		<des>5588游戏</des>↵		<action />↵		<type>33</type>↵		<showtype>0</showtype>↵		<soundtype>0</soundtype>↵		<mediatagname />↵		<messageext />↵		<messageaction />↵		<content />↵		<contentattr>0</contentattr>↵		<url>https://mp.weixin.qq.com/mp/waerrpage?appid=wxe675b6aad9612c74&amp;type=upgrade&amp;upgradetype=3#wechat_redirect</url>↵		<lowurl />↵		<dataurl />↵		<lowdataurl />↵		<appattach>↵			<totallen>0</totallen>↵			<attachid />↵			<emoticonmd5 />↵			<fileext />↵			<cdnthumburl>30580201000451304f02010002044936959a02033d11fd0204a0e2e26502045b5fca34042a777875706c6f61645f353137313132343233304063686174726f6f6d3237375f313533333030343334300204010400030201000400</cdnthumburl>↵			<cdnthumbmd5>97e3145c3d675fc803e105a89025dda0</cdnthumbmd5>↵			<cdnthumblength>684194</cdnthumblength>↵			<cdnthumbwidth>750</cdnthumbwidth>↵			<cdnthumbheight>1206</cdnthumbheight>↵			<cdnthumbaeskey>74a2e2107889494c8b72e8b5dd221935</cdnthumbaeskey>↵			<aeskey>74a2e2107889494c8b72e8b5dd221935</aeskey>↵			<encryver>0</encryver>↵			<filekey>5171124230@chatroom277_1533004340</filekey>↵		</appattach>↵		<extinfo />↵		<sourceusername>gh_bd1e1f9871e8@app</sourceusername>↵		<sourcedisplayname>5588游戏</sourcedisplayname>↵		<thumburl />↵		<md5 />↵		<statextstr />↵		<weappinfo>↵			<username><![CDATA[gh_bd1e1f9871e8@app]]></username>↵			<appid><![CDATA[wxe675b6aad9612c74]]></appid>↵			<type>2</type>↵			<version>21</version>↵			<weappiconurl><![CDATA[http://mmbiz.qpic.cn/mmbiz_png/45WETkHuW6ibwNyIAAsCBL7BqV6clrLxayELPEwNtRiaTZnuutick0AaMkqwLYNe7qVvam2Hs14yO3WqbXibg6dhPQ/0?wx_fmt=png]]></weappiconurl>↵			<pagepath><![CDATA[pages/index/index.html?ald_share_src=15330043336934278273]]></pagepath>↵			<shareId><![CDATA[0_wxe675b6aad9612c74_1228314010_1533004339_0]]></shareId>↵			<appservicetype>0</appservicetype>↵		</weappinfo>↵	</appmsg>↵	<fromusername>wxid_irqdba7lvfgs22</fromusername>↵	<scene>0</scene>↵	<appinfo>↵		<version>1</version>↵		<appname></appname>↵	</appinfo>↵	<commenturl></commenturl>↵</msg>"'

export default class WxApp extends Component {
    state = {
        logoSrc: [],
        logoTitle:[],
        title:[]
    }
    componentDidMount(){
        if(this.props.xml){
            let parser = new DOMParser()
            let xmlDoc = parser.parseFromString(this.props.xml,"text/xml")
            let logoSrc =   xmlDoc?xmlDoc.querySelectorAll('weappiconurl'):[]
            let logoTitle = xmlDoc?xmlDoc.querySelectorAll('sourcedisplayname'):[]
            let title = xmlDoc?xmlDoc.querySelectorAll('appmsg>title'):[]
            this.setState({
                logoSrc,logoTitle,title
            })
            if(this.props.paramTitle==''&&title[0]){
                this.props.setparamsHandle&&this.props.setparamsHandle('title',title[0].innerHTML)
            }
        }
    }
    componentWillReceiveProps(nextProps){
        if(this.props.xml!=nextProps.xml&&nextProps.xml){
            let parser = new DOMParser()
            let xmlDoc = parser.parseFromString(nextProps.xml,"text/xml")
            let logoSrc =   xmlDoc?xmlDoc.querySelectorAll('weappiconurl'):[]
            let logoTitle = xmlDoc?xmlDoc.querySelectorAll('sourcedisplayname'):[]
            let title = xmlDoc?xmlDoc.querySelectorAll('appmsg>title'):[]
            this.setState({
                logoSrc,logoTitle,title
            })
            if(nextProps.paramTitle==''&&title[0]){
                this.props.setparamsHandle&&this.props.setparamsHandle('title',title[0].innerHTML)
            }
        }
    }
    render(){
        let {logoSrc,logoTitle,title} = this.state
        let {xml,imgSrc,paramTitle} = this.props
        return (
            <div className="wxapp">
                <div className="header">
                    <span style={{backgroundImage:`url(${logoSrc[0]?logoSrc[0].innerHTML.replace('<![CDATA[','').replace(']]>',''):''})`}}></span>
                    {logoTitle[0]?logoTitle[0].innerHTML:'预览小程序'}
                </div>
                <div className="title">{paramTitle?paramTitle:title[0]?title[0].innerHTML:'预览小程序标题'}</div>
                <div className="linkImg" style={{backgroundImage:`url(${imgSrc?imgSrc:'/images/pic1.png'})`}}></div>
                <div className="footer">
                    <span className="icon"></span>小程序
                </div>
            </div>
        )
    }
}

