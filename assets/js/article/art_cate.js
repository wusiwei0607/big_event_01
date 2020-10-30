$(function () {
    var layer = layui.layer
    var form = layui.form
    // 1. 初始化文章分类列表
    initArtCateList()
    function initArtCateList() {
        $.ajax({
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tpl-table', res)
                $('tbody').empty().html(htmlStr)
            }
        })
    }

    // 2. 显示添加文章分类表单弹框
    var addindex = null
    $("#btnAddCate").on('click', function () {
        addindex = layer.open({
            type: 1,
            title: '添加文章分类',
            content: $("#dialog-add").html(),
            area: ['500px', '250px']
        });

    })

    // 3. 提交添加文章分类(事件委托)
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 成功提示
                layer.msg('恭喜您,添加文章分类成功!')
                // 重新渲染页面
                initArtCateList()
                // 关闭弹出层
                layer.close(addindex)
            }
        })

    })

    // 4. 显示编辑表单
    var editindex = null
    $('tbody').on('click', '.btn-edit', function () {
        editindex = layer.open({
            type: 1,
            title: '修改文章分类',
            content: $("#dialog-edit").html(),
            area: ['500px', '250px']
        });

        // 数据回填
        // 获取文章分类的id
        var id = $(this).data('id')
        // 发送请求,渲染表格
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })
    })

    // 5. 提交修改文章分类(事件委托)
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改分类失败!')
                }
                layer.msg('修改分类成功!')
                // 重新渲染表格
                initArtCateList()
                // 关闭弹出框
                layer.close(editindex)
            }
        })
    })

    // 6. 删除文章分类(事件委托)
    $('tbody').on('click', '.btn-delete', function () {
        // 获取id值
        var id = $(this).data('id')
        // 弹出询问框
        layer.confirm('是否确定删除?', { icon: 3, title: '提示' }, function (index) {
            //发起删除请求
            $.ajax({
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败!')
                    }
                    layer.msg('删除文章分类成功!')
                    initArtCateList()
                    layer.close(index);
                }
            })
        });
    })
})