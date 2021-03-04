$(function () {

    var layer = layui.layer

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

    //为上传按钮设置点击事件
    $('#btnChooseImage').on('click', function () {
        // console.log(22);
        $('#file').click()
    })

    // //为文件绑定change事件
    $('#file').on('change', function (e) {
        //获取用户选择的文件 
        // console.log(e);
        var filelist = e.target.files
        // console.log(filelist)
        if (filelist.length === 0) {
            return layer.msg('请选择照片！')
        }

        //拿到用户选择的文件
        var file = e.target.files[0]
        //将文件，转化为路径
        var imgURL = URL.createObjectURL(file)
        //重新初始化裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    //为确认按钮绑定点击事件
    $('#btnUpload').on('click', function () {
        //1.要拿到用户裁剪后的头像

        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        //2.调用接口，把头像上传到服务器
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('头像上传失败!');
                }
                layer.msg('头像上传成功!');
                window.parent.getUserInfo()
                console.log($('#image'));
                //保留修改后的图片成为默认图片
                // $.ajax({
                //     type: "get",
                //     url: "/my/userinfo",
                //     success: function (res) {
                //         if (res.status !== 0) {
                //             return layui.layer.msg("获取用户信息失败");
                //         }
                //         $('#image').attr('res', res.data.user_pic)
                //         console.log(res)
                //         console.log(res.data.user_pic);
                //     }
                // });
            }
        })

    })

})