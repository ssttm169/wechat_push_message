
# 使用说明

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
