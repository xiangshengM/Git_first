
$(function () {
    var layer = layui.layer
    var form = layui.form
    initArtCateList()
    //获取表格数据
    function initArtCateList() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res)
                var htmlSte = template('tpl-table', res)
                $('tbody').html(htmlSte)
            }
        })
    }
    var indexAdd = null
    //为添加类别按钮添加点击事件
    $('#btnAddCate').on('click', function () {
        // console.log(11);
        indexAdd = layer.open({
            type: 1,
            title: '添加文章类别',
            area: ['500px', '300px'],
            content: $('#dialog-add').html()
        });
    })

    //使用代理的方式给渲染出来的弹出框添加submit事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg("新增分类失败");
                }
                initArtCateList()
                layui.layer.msg('新增分类成功')
                //根据索引关闭弹出层
                // layer.close(indexAdd)
                // console.log(aa);
                layer.close(indexAdd);
            }
        })
    })
    //利用代理的方法给渲染出来的编辑按钮绑定点击
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function () {
        // console.log('ok');
        indexEdit = layer.open({
            type: 1,
            title: '修改文章类别',
            area: ['500px', '300px'],
            content: $('#dialog-enit').html()
        });
        //为修改文章分类的弹出层填充表单数据
        //为编辑按钮绑定 data-id 自定义属性：
        var id = $(this).attr('data-id')
        // console.log(id);
        // 发起请求获取对应分类的数据
        $.ajax({
            type: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data)
                // console.log(res);
            }
        })
    })


    //为编辑做代理绑定事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！');
                }
                layer.msg('更新分类数据成功！');

                layer.close(indexEdit);
                initArtCateList()
            }

        })

    })
    //为删除做代理绑定事件
    $('body').on('click', '.btn-delete', function () {
        // console.log('ok');
        var id = $(this).attr('data-id')
        layer.confirm(' &nbsp;&nbsp; 是否删除?', { icon: 7, title: '提示' }, function (index) {
            $.ajax({
                type: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layui.layer.msg("删除失败");
                    }
                    layui.layer.msg("删除成功");
                    layer.close(index);
                    initArtCateList()
                }

            })


        });
    })


})