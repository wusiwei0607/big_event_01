$(function () {
    var layer = layui.layer
    var form = layui.form
    // 1. 初始化文章分类,渲染到下拉菜单
    initCate()
    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 赋值渲染form
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 调用layui中form.render方法重新渲染表单
                form.render()
            }
        })
    }

    // 2 . 初始化富文本编辑器
    initEditor()

    // 3.1. 初始化图片裁剪器
    var $image = $('#image')

    // 3.2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3.3. 初始化裁剪区域
    $image.cropper(options)

    // 4. 点击选择封面按钮,触发文本选择框的单击事件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').trigger('click')
    })

    // 5. 更换裁剪区域图片
    $('#coverFile').on('change', function (e) {
        // 获取选择的文件
        var file = e.target.files[0]
        // 判断是否选择了文件
        if (file.length === 0) {
            return
        }
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 6.1 . 定义文章的发布状态
    var art_state = '已发布'

    // 6.2 . 为存为草稿按钮绑定点击事件
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    // 7. 为表单绑定提交事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        // 创建一个FormData 对象
        var fd = new FormData($(this)[0])
        // 将文章的发布状态存到fd中
        fd.append('state', art_state)

        // 将封面裁剪过后的图片,输出一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 将文件对象存到fd 中
                fd.append('cover_img', blob)

                // 发起ajax数据请求
                publishArticle(fd)
            })
    })

    // 8. 定义发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success : function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败!')
                }
                layer.msg('发布文章成功!')
                // 发布文章成功后,跳转到文章列表页面
                location.href ='/article/art_list.html'
            }
        })
    }
})