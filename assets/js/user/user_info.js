$(function () {

    var form = layui.form

    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                console.log(value.length);
                return "昵称长度必须在1~6个字符之间"
            }
        }
    })
    // nickname: [
    //     /^[\S]{1,6}$/
    //     , '昵称长度必须在1~6个字符之间'
    // ]
    //获取用户的基本信息
    initUserInfo()
    // 初始化用户基本信息
    function initUserInfo() {
        $.ajax({
            type: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败');
                }
                // console.log(res);
                form.val('formUserInfo', res.data)
            }
        })
    }

    //重置用户信息
    $('#btnReset').on('click', function (e) {
        //阻止表单的默认提交行为
        e.preventDefault()
        // console.log(11);
        initUserInfo()
    })
    //更新用户的基本信息
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        // console.log(11);
        // 发起 ajax 数据请求
        $.ajax({
            type: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (ser) {
                if (ser.status !== 0) {
                    return layui.layer.msg('提交失败');
                }
                layui.layer.msg('修改成功');
                // 调用父页面中的方法，重新渲染用户的头像和用户的信息
                window.parent.getUserInfo()
                // $('.layui-form')[0].reset() //清空表单
                window.parent.location.href = '/index.html'
            }
        })

    })
})


