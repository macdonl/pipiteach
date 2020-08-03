
$(function(){
    var url=""
    $.ajax({
        type: "post",
        url: url+"/User/GetUserInfo",
        contentType:"application/json",
        dataType: "json",
        async:false,
        success: function(data){
            var jsElement = document.getElementById("common_auto_login_js");
            var page = jsElement.getAttribute("data");
            if(data.ServiceCode=='SUCCESS'){
                var showHtml =`<a href="/home/home.html"><span>${data.Result.UserInfo.UserName}</span></a>`
                $("#nav").html(showHtml)
            } else {
                if(page == "start_a_new_post_page"){
                    alert("请先登录。确定将跳转到登录页面...");
                    location.href="/login.html"
                }
            }
        },
        error:function(e){
        }
    });
})
