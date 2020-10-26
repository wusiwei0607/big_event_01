// 入口函数
$(function () {
    // 1. 点击跳转链接隐藏模块显示模块
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 2. 自定义验证规则
    var form = layui.form;
    form.verify({
        // 密码规则
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 确认密码规则
        repwd: function (value) {
            // 形参value 是使用该规则的密码框的值
            var pwd = $('.reg-box input[name=password]').val()
            if (value !== pwd) {
                return "对不起,两次密码不一致,请重新输入!"
            }
        }
    })

    // 3. 注册,发起Ajax请求
    $('#form-reg').on('submit', function (e) {
        // 阻止表单默认提交
        e.preventDefault();
        // 发送Ajax请求
        $.ajax({
            type: 'POST',
            url: 'http://ajax.frontend.itheima.net/api/reguser',
            data: {
                username: $('#form-reg input[name=username]').val(),
                password: $('#form-reg input[name=password]').val()
            },
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
            }
        })
    })

})

