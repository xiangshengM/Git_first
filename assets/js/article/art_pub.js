$(function () {

    var layer = layui.layer
    var form = layui.form

    initCata()
    // 初始化富文本编辑器
    initEditor()

    function initCata() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            // data: 'data',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章失败！');
                }
                // console.log(000);
                //
                // 调用模板引擎，渲染分类的下拉列表
                var htmlSer = template('tpl-cata', res)
                $('[name=cate_id]').html(htmlSer)
                //一定要记得调用form.render()方法
                form.render()
            }
        })

    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //为选择封面的按钮，绑定点击事件处理函数
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    //监听coverFile 绑定change事件，获得用户的选择文件
    $('#coverFile').on('change', function (e) {
        //获得文件的列表数组
        var files = e.target.files
        //判断文件是否选择了文件
        if (files.length === 0) {
            reutrn
        }
        //根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(files[0])

        //为裁剪区域重新设置图片：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    //设置发布状态
    var art_state = '已发布'

    //为草稿设置点击事件
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    // 为表单发布submit提交事件
    $('#form-pub').on('submit', function (e) {
        //1.阻止表单默认行为
        e.preventDefault();
        // 2.基于form表单，快速创建一个FormData对象
        var fd = new FormData($(this)[0])
        // 3.将文件的发布状态，存到fd中
        fd.append('state', art_state)
        // fd.forEach(function (v, k) {
        //     console.log(k, v);
        // })
        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                //6.发起Ajax数据请求，上传文章
                publishArticle(fd)
            })
    })
    //定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            type: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('发表文章失败！');
                }
                layer.msg('发表文章成功');
                //发布文章后跳转到文章列表界面
                // $('#lnc').prop('class', 'layui-this')
                // $('#lnc').click()
                // window.open("/index.html") //要新的窗口打开链接
                //window.history.back(-1) //回到上一层
                // location.href = '/article/art_list.html'
                // history.go(0) //跳转后刷新页面 
                // window.location.href = '//index.html'
                // window.location.reload(); 刷新页面   
            }
        })

    }
})