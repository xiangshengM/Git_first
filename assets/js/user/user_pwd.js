$(function () {

    //为密码框定义校验规则
    var form = layui.form

    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧和原密码相同'
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致'
            }
        }
    })
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (ser) {
                console.log(ser);
                if (ser.status !== 0) {
                    return layui.layer.msg('密码修改失败!');
                }
                layui.layer.msg('密码修改成功!');
                //重置表单
                $('.layui-form')[0].reset();
                layer.msg('更新密码成功，请重新登录', { icon: 4 }, function (index) {
                    // layer.alert("更新密码成功，请重新登录"
                    //do something
                    //1.清空token
                    localStorage.removeItem('token');
                    //2.跳转到登录界面
                    window.parent.location.href = "/login.html";
                })
            }
        })

    })

})