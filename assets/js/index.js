// 入口函数
$(function () {
    // 1. 获取用户信息,渲染头像和用户名
    getUserInfo()

    // 2. 退出首页,返回登录页面
    var layer = layui.layer
    $('#btnLogout').on('click', function () {
        // 弹出询问框
        layer.confirm('是否确认退出登录?', { icon: 3, title: '提示' }, function (index) {
            // 2.1 删除token
            localStorage.removeItem('token')
            // 2.2 跳转到登录页面
            location.href = '/login.html'
            // 关闭询问框
            layer.close(index);
        })
    })

})



// 获取用户信息必须封装成全局函数(写到入口函数之外)
// 后面此函数还需调用,且要求此函数是全局函数
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function (res) {
            console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            // 请求成功,渲染用户头像信息
            renderAvatar(res.data)
        }
    })
}
// 封装用户头像渲染函数
function renderAvatar(user) {
    // 渲染用户名,优先渲染昵称
    var name = user.nickname || user.username
    $('#wellcome').html('欢迎&nbsp;&nbsp;' + name)

    // 渲染头像
    if (user.user_pic !== null) {
        // 渲染图片头像
        $('.text-avatar').hide()
        $('.layui-nav-img').attr('src', user.user_pic).show()
    } else {
        // 渲染文字头像
        var first = name[0].toUpperCase()
        $('.text-avatar').show().html(first)
        $('.layui-nav-img').hide()
    }
}