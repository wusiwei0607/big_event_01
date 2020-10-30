$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 2. 点击上传按钮,触发上传文件的点击事件
    $('#btnChooseImage').on('click', function () {
        $('#file').trigger('click')
    })

    // 3. 修改裁剪图片
    var layer = layui.layer
    $('#file').on('change', function (e) {
        // 3.1 拿到用户选择的文件
        var file = e.target.files[0]
        // 非空校验
        if (file === undefined) {
            return layer.msg('请选择图片!')
        }
        // 3.2 根据选择的文件,生成一个对应的URL地址
        var imgURL = URL.createObjectURL(file)
        // 3.3 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', imgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 4. 点击上传,更换头像
    $('#btnUpload').on('click', function () {
        // 获取base64 格式的字符串
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // 发送ajax
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('更新用户头像成功!')
                // 调用父页面方法,重新渲染头像
                window.parent.getUserInfo()
            }
        })
    })

})