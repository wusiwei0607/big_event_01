$(function () {
    // 1. 自定义验证规则
    var form = layui.form
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '用户昵称长度在 1 ~ 6 个字符之间'
            }
        }
    })

    // 2. 获取用户信息
    initUserInfo()
    var layer = layui.layer
    function initUserInfo() {
        $.ajax({
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败!')
                }
                // 渲染用户信息
                // console.log(res);
                // layui中form赋值
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 3. 重置用户信息
    $('#btnReset').on('click', function (e) {
        // 阻止默认事件   (重置按钮默认事件会重置为html结构中input框中的值)
        e.preventDefault()
        // 重新渲染用户信息
        initUserInfo()
    })

    // 4. 提交修改的用户信息
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('修改用户信息成功!')
                // 调用父页面中的方法,重新渲染头像和用户名
                window.parent.getUserInfo()
            }
        })
    })
})