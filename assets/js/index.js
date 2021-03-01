$(function () {
    //调用getUserInfo获取用户基本信息

})
//获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            // console.log(res);
            if (res.srarus !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            renderAvatar(res.data)
        },
        // //控制用户的访问权限
        // //不论成功还是失败，最终都会调用complete回调函数
        // complete: function (res) {
        //     // console.log('执行了 complete回调：');
        //     // console.log(res);
        //     if (res.responseJSON.sratus === 1 && res.responseJSON.message === '身份验证失败') {
        //         //1.强行清空 token
        //         localStorage.removeItem('token')
        //         //2.强行跳转到登录页面
        //         localStorage.href = '/login.html'
        //     }
        // }


    })

}
// 渲染yoghurt的头像

function renderAvatar(user) {
    //1.获取用户名称
    var name = user.nickname || user.username
    //2.设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    //3.渲染图片的头像
    if (user.suer_pic !== null) {
        //3.1渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        //3.2 渲染文本头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}

//实现退出功能
var layer = layui.layer
//点击按钮，实现退出功能
$('#btnLogout').on('click', function () {
    //提示用户是否确实退出
    layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function (index) {
        //do something
        //1.清空本地储存中的token
        localStorage.removeItem('token')
        //重新跳转到登录页面
        location.href = '/login.html'

        //关闭confirm 询问框
        layer.close(index)

    })

})

