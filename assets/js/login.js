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

    //监听注册表单的提交时间
    $('#form_reg').on('submit', function (e) {
        //阻止表单的默认提交行为
        e.preventDefault()
        //发起一个Ajax的post请求 包括三个参数 URL用户名和密码
        $.post("http://ajax.frontend.itheima.net/api/reguser", { username: $('#form_reg [name =username]').val(), password: $('#form_reg [name =password]').val() },
            //判断是否注册成功，如果不成功则return出去
            function (res) {
                if (res.status !== 0) {
                    return console.log(res.message);
                }
                console.log(res.message);
            },

        );
    })

})