# 使用说明

微信小程序 调云函数 信息推送失败，提示errcode":45015,"errmsg":"response out of time limit or subscription is canceled hint<br>

查了很多资料都说是， 由于长时间用户OpenId未和微信公众号做互动消息，微信公众号会停止对用户进行消息推送，但没说如何操作，决定写一下详细的操作步骤，希望对你有帮助。<br><br>


## 1.登录微信公众平台
打开， https://mp.weixin.qq.com/， 扫描登录<br><br>



## 2.开启客服收发信息
具体操作是 左边菜单  找到 功能 > 客服，进入后，  开启收发信息  和  增加客服的微信帐号。

![1.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/14387177bd944ddb9996220e28d611f1~tplv-k3u1fbpfcp-watermark.image?)


绑定客服微信帐号
![2.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bcd525c5207b4fad9ee1391ab1c63150~tplv-k3u1fbpfcp-watermark.image?)


绑定成功之后，会收到微信公众平台的绑定信息。
![3.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/92e6496536114602980241d7efdea4d6~tplv-k3u1fbpfcp-watermark.image?)




## 3.给微信小程序客服发信息

先进入自己的微信小程序，查看属性
![4.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9dcf6fba23f14fcdafd2eb15ceedc99d~tplv-k3u1fbpfcp-watermark.image?)


在微信小程序的介绍页面，有一个客服的入口，点击进去
![5.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/631c1d63aa9e4cb88fb0a403a6bc191f~tplv-k3u1fbpfcp-watermark.image?)


这是关键点， 就是进入客服聊天界面之后，给它发一个信息。
![6.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/292123d20ab14340ad7cc1659ffea796~tplv-k3u1fbpfcp-watermark.image?)


如果你之前已经配置好云函数和推送配置了，这时你可以调云函数进行信息推送了，否则请继续。<br><br>

## 4.配置云函数的代码

在 uniapp 的文件夹cloudfunctions 新建一个pushMessage函数（名称命名看你的习惯）。
![7.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f04c89a4542848e899f2ed3b1ea2abe4~tplv-k3u1fbpfcp-watermark.image?)

主要代码下：
```
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
 
// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    await cloud.openapi.customerServiceMessage.send({
        touser: wxContext.OPENID,
        msgtype: 'text',
        text: {
            content: event.content
        },
    })
    return 'success'
}
```


把函数上传到云端
![8.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bdae527789724701893911ed6745ffc0~tplv-k3u1fbpfcp-watermark.image?)


 

## 5.配置信息推送
打开微信开发者工具的云开发，设置 > 其他设置，点击添加信息推送
![9.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3dd85686b51e43378b6782cbe62ffbb0~tplv-k3u1fbpfcp-watermark.image?)


信息类型选择 text,  云函数选择刚才上传的pushMessage的方法。
![10.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1e995402ee5741569a21b27088bf5d28~tplv-k3u1fbpfcp-watermark.image?)



## 6.完成
页面执行调用云函数试一下。

```
wx.cloud.callFunction({
  name: "pushMessage",
  data: {
    content: '收到了吗?'
  },
}).then((res) => {
  console.log("pushMessage.res", res);
})
.catch((err) => {
  console.log("pushMessage.err", err);
});
```

过一会会（2秒左右），微信收到信息了。
![11.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b232524d846e4efebb211c980ef4cc7b~tplv-k3u1fbpfcp-watermark.image?)


![12.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8e905ee0f54944fa9cbdb4ff5c882397~tplv-k3u1fbpfcp-watermark.image?)



完整代码在这里
https://github.com/ssttm169/wechat_push_message<br><br>



# 仓库说明

## 需要修改两个配置信息<br>


1.修改微信小程序的appid, manifest.json的mp-weixin里边的appid
```
"mp-weixin" : {
    "appid" : "你的小程序AppID",
    "setting" : {
        "urlCheck" : false,
        "minified" : true
    },
    "usingComponents" : true,
    "cloudfunctionRoot" : "cloudfunctions/",
    "lazyCodeLoading" : "requiredComponents"
}
```
<br>

2.修改微信云开发的环境ID, 在App.vue文件里边
```
wx.cloud.init({
  env:  "你的云开发环境ID",
});
```
<br>

## 其他说明<br>

vue.config.js 这个文件里的CopyWebpackPlugin 配置的作用, 是uniapp 开发的时候, 会自动把cloudfunctions云函数文件夹自动复制到微信小程序的项目里边。<br>

```
new CopyWebpackPlugin([{
	from: path.join(__dirname, 'cloudfunctions'),
	to: path.join(__dirname, 'unpackage/dist', process.env.NODE_ENV === 'development' ?
		'dev' : 'build', process.env.UNI_PLATFORM, 'cloudfunctions')
}])
```

原始路径<br>
./cloudfunctions<br><br>

自动复制的路径<br>
./unpackage\dist\dev\mp-weixin\cloudfunctions<br>
注:不要动这个路径做内容修改，因为它会原始路径自动生成
