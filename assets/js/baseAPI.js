//注意：每次调用$.get()或$.post()或$.ajsx()的时候
//会先调用$.ajaxPrefilter这个函数
//在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    //在发起真正的ajax之前，同意拼接请求的路径
    options.url = 'http://ajax.frontend.itheima.net'
        + options.url
    // options.url = 'http://api-breakingnews-web.itheima.net/'
    // + options.url


    //统一尾有权限的接口 设置headers请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局统一挂载，complete回调函数
    options.complete = function (res) {
        // console.log('执行了 complete回调：');
        // console.log(res);
        //在complete回调函数中，可以使用res.responseJSON拿到服务器相应回来的数据
        if (res.responseJSON.sratus === 1 && res.responseJSON.message === '身份验证失败') {
            //1.强行清空 token
            localStorage.removeItem('token')
            //2.强行跳转到登录页面
            localStorage.href = '/login.html'
        }
    }
})

