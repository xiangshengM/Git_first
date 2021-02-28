//注意：每次调用$.get()或$.post()或$.ajsx()的时候
//会先调用$.ajaxPrefilter这个函数
//在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    //在发起真正的ajax之前，同意拼接请求的路径
    options.url = 'http://ajax.frontend.itheima.net'
        + options.url
})
