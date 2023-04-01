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