$(function(){
    var url=""

    //提交
    function verifyFun(params){
       
        var email = $("input[name='email']").val()
        if(email&&email.trim()!=""){
            var patt=/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
            if(patt.test(email.trim())){
                params.email = email.trim()
            }else{
                params.verify = "请输入正确邮箱"
                return params
            }
        }else{
            params.verify = "请输入邮箱"
            return params
        }

        var password = $("input[name='password']").val()
        if(password&&password.trim()!=""){
            params.password = password.trim()
        }else{
            params.verify = "请输入密码"
            return params
        }
        return params
    }
    $("#login_btn").click(function(){
        var params =verifyFun({
            email:'',
            password:'',
            verify:-1
        })
        if(params.verify==-1){
            $.ajax({
                type: "post",
                url: url+"/User/Login",
                data:`{
                "Email":"${params.email}",
                "Password":"${params.password}"}`,
                contentType:"application/json",
                dataType: "json",
                success: function(data){
                    // console.log(data)
                    alert(data.Message)
                    if(data.ServiceCode=='SUCCESS'){
                        location.href="/"
                    }
                },
                error:function(e){
    
                }
            });
        }else{
            alert(`${params.verify}`)
        }
    })
})