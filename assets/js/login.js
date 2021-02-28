$(function () {
    // 点击"区注册账号"的链接
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    //点击"登录"的链接
    $('#link_login').on('click', function () {
        $('.reg-box').hide()
        $('.login-box').show()
    })

    // 从 layui中获取form对象
    var form = layui.form
    var layer = layui.layer
    //通过form.verify()函数中，自定义校验规则
    form.verify({
        //自定义一个pwd 的校验规则
        pwd: [/^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        //检验两次密码是否一致
        repwd: function (value) {
            //通过形参拿到的是确认密码框的内容
            //还需要拿到密码框的内容
            //然后进行一次等于的判断
            //如果判断失败， 则return一个错误提示即可
            var pwd = $('.reg-box [name =password]').val()
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    })

    //监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        //阻止表单的默认提交行为
        e.preventDefault()
        //发起一个Ajax的post请求 包括三个参数 URL用户名和密码
        var data = { username: $('#form_reg [name =username]').val(), password: $('#form_reg [name =password]').val() }
        $.post("http://ajax.frontend.itheima.net/api/reguser", data,
            //判断是否注册成功，如果不成功则return出去
            function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // console.log(11);
                layer.msg("注册成功,请登录！")
                $("#link_login").click()
            }
        )
    })
    //监听表单的提交事件
    $('#form_login').submit(function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登陆失败！');
                }
                layer.msg('登陆成功！');
                // console.log(res.token);
                //将登录成功得到的token字符串，保存到localStorage中
                localStorage.setItem('token', res.token)
                //跳转到后台主页
                location.href = '/index.html'
            }
        })

    })
})