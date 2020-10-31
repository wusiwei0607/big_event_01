$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
    // 3. 定义事件过滤器
    template.defaults.imports.deteForm = function (data) {
        var dt = new Date(data)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    // 定义补零函数
    function padZero(n) {
        return n >= 10 ? n : '0' + n
    }
    // 0. 定义一个查询参数对象,将来请求数据的时候,需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1,     //  页码值
        pagesize: 2,	 //  每页显示多少条数据
        cate_id: '',    //	文章分类的 Id
        state: ''      //	文章的状态，可选值有：已发布、草稿
    }

    // 1. 初始化表格
    initTable()
    function initTable() {
        $.ajax({
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取列表失败!')
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)

                // 分页
                renderPage(res.total)
            }
        })
    }

    // 2. 初始化分类列表
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

    // 4. 提交筛选表单
    $('#search-form').on('submit', function (e) {
        e.preventDefault()
        // 给查询参数赋值
        q.cate_id = $('[name=cate_id]').val()
        q.state = $('[name=state]').val()
        // 重新渲染表格
        initTable()
    })

    // 5. 分页
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',  //注意，这里的 test1 是 ID，不用加 # 号
            count: total,  //数据总数，从服务端得到
            limit: q.pagesize,         // 每页显示的条数
            curr: q.pagenum,         // 起始页 
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候,触发jump 回调
            // 触发jump回调的方式有两种 : 
            // 1. 点击页码的时候,会触发jump 回调
            // 2. 只要调用了 laypage.render()方法,就会触发回调
            jump: function (obj, first) {
                // 可以通过first值来判断是通过那种方式,触发的jump回调
                // 如果first的值为true,证明是方式2触发
                // first为undefined, 是方式2触发

                // 把最新的页码值,赋值到查询参数对象中
                q.pagenum = obj.curr
                // 把最新的条目数,赋值到查询参数对象中
                q.pagesize = obj.limit
                //首次不执行
                if (!first) {
                    //改变当前页
                    initTable()
                }
            }
        });
    }

    // 6. 点击删除按钮,删除当前文章分类,渲染表格(事件委托)
    $('tbody').on('click', '.btn-delete', function () {
        // 获取参数的id值
        var id = $(this).data('id')
        // 弹出询问框
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            //发起请求
            $.ajax({
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg('文章删除成功')
                    // 判断当前分页中的删除按钮的个数,如果个数为1,则页码值减一,且页码值不能小于1
                    if ($('.btn-delete').length === 1 && q.pagenum > 1) {
                        q.pagenum--
                    }
                    initTable()
                }
            })
            layer.close(index);
        });
    })

})