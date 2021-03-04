$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage


    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }


    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    var b = {
        pagenum: 1,// 页码值，默认请求第一页的数据
        pagesize: 2, //每页显示默认是2条数据
        cate_id: '',//	文章分类的 Id
        state: ''  //文章的状态，可选值有：已发布、草稿
    }

    initTable()
    initCate()
    //获取文章列表数据的方法
    function initTable() {
        $.ajax({
            type: 'GET',
            url: '/my/article/list',
            data: b,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章列表失败！");
                }
                // console.log(222);
                // console.log(res);
                //使用模板引擎0
                var htmlRes = template('tpl-table', res)
                // console.log(template('tpl-table', res));
                $('tbody').html(htmlRes)
                // console.log(11);
                //渲染分页的方法
                renderPage(res.total)
            }
        })

    }

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！');
                }
                console.log(res.data);
                //调用模板引擎渲染可分类的可选项
                var htmlSer = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlSer)
                //通过layui重新渲染UI结构
                form.render()
            }
        })

    }

    //为筛选表单绑定submit事件
    $('#form-itit').on('submit', function (e) {
        //阻止表单的默认提交行为
        e.preventDefault()
        //获取表单中选中项的值
        //为查询参数对象q中对应的属性赋值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        b.cate_id = cate_id
        b.state = state
        //根据最新的筛选条件，重新渲染表格的数据
        initTable()
    })

    //为分页创建一个renderPage方法
    function renderPage(total) {
        // console.log(total);
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', //分页容器的ID
            count: total, // 得到总条数
            limit: b.pagesize, //每条显示的数据
            curr: b.pagenum, // 设置默认被选中的分页
            layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
            limits: [1, 2, 3, 5, 7, 8, 9, 10],
            //jump回调死循环的原因
            //1.分页发生切换时触发jump回调
            //2.调用  laypage.render 触发jump回调 
            //jump - 切换分页的回调
            jump: function (obj, first) {
                // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
                // 如果 first 的值为 true，证明是方式2触发的
                // 否则就是方式1触发的
                // console.log(first);
                // console.log(obj.curr); //得到当前页
                b.pagenum = obj.curr
                //切换每页的条数
                b.pagesize = obj.limit
                // console.log(obj.limit); //得到每页显示的条数
                // initTable()
                if (!first) {
                    initTable()
                }
            }
        })
    }

    //通过代理的形式，为删除按钮绑定点击事件处理函数
    $('body').on('click', '.btn-dang', function () {
        var len = $('.btn-dang').length
        // console.log(len);
        //获取文章的id
        var id = $(this).attr('data-id')
        // console.log(id);
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                type: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败!');
                    }
                    layer.msg('删除成功！');

                    //当数据删除后，需要判断当前页码中是否还有剩余数据
                    //如果没有数据，则让页码-1之后，再调用initTable()方法
                    if (len === 1) {
                        //说明当前只有一条数据，删除成功后，让页码值-1
                        //页码值最小是1
                        b.pagenum = b.pagenum === 1 ? 1 : b.pagenum - 1
                        // console.log(b.pagenum);
                    }

                    initTable()
                }
            })
            layer.close(index)
        });

    })



    // ------------------------------------------------------
    //待完成    待完成   待完成   待完成   待完成 
    //使用代理的方式，为编辑按钮绑定点击事件处理函数
    //获取表格数据
    var indexAdd = null
    $('body').on('click', '.btn-duang', function (e) {
        e.preventDefault();
        // console.log('ok');
        indexAdd = layer.open({
            type: 1,
            title: '添加文章类别',
            area: ['600px', '500px'],
            content: $('#dialog-enit').html()
        });
        //为修改文章分类的弹出层填充表单数据
        //为编辑按钮绑定 data-id 自定义属性：
        var id = $(this).attr('data1-id')
        // var id = $('#btn-edit').attr('data-id')
        console.log(id);
        // 发起请求获取对应分类的数据
        $.ajax({
            type: 'GET',
            url: '/my/article/' + id,
            success: function (res) {
                form.val('form-edit', res.data)
                // console.log('form-edit');
                // console.log(res);
                // var htmlSer = template('tpl-cate', res)
                var htmlSer = template('dialog-enit', res)
                $('[name=cate_id]').html(htmlSer)
                console.log(res.data);
                //通过layui重新渲染UI结构
                //疑似没用的方法
                form.render()
            }
        })
    });
    // ----------------------------------------------------------------

    // ---------------------------------------------------------------
    //待完成   待完成   待完成
    //使用代理的方式给渲染出来的弹出框添加submit事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        // console.log(222);
        $.ajax({
            type: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg("修改文章失败");
                }
                initArtCateList()
                layui.layer.msg('新增文章成功')
                //根据索引关闭弹出层
                // layer.close(indexAdd)
                // console.log(aa);
                layer.close(indexAdd);
            }
        })
    })
    // ----------------------------------------------------------
})
