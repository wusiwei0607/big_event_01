// 开发环境服务器地址
var baseUrl = 'http://ajax.frontend.itheima.net'
// 测试环境服务器地址
// var baseUrl = 'http://ajax.frontend.itheima.net'
// 生产环境服务器地址
// var baseUrl = 'http://ajax.frontend.itheima.net'

// 拦截所有Ajax请求 get/post/ajax
// 处理参数
$.ajaxPrefilter(function (options) {
    // 拼接对应环境的服务器地址
    options.url = baseUrl + options.url

    // 给指定的地址添加身份认证

    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 身份拦截,判断身份认证信息
    options.complete = function  (res) {
        // console.log(res);
        // 在complete回调函数中,可以使用 res.responseJSON  拿到服务器返回的数据
        var obj = res.responseJSON
        if (obj.status === 1 && obj.message === '身份认证失败！') {
            // 删除token
            localStorage.removeItem('token')
            // 跳转页面
            location.href = '/login.html'
        }
    }
})