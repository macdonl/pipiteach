$(function(){
    var url=""

    //提交
    function verifyFun(params){
        var username = $("input[name='username']").val()
        if(username&&username.trim()!=""){
            params.username = username.trim()
        }else{
            params.verify = "请输入用户名"
            return params
        }
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

        var invitation_code = $("input[name='invitation_code']").val()
        if(invitation_code&&invitation_code.trim()!=""){
            params.invitation_code = invitation_code.trim()
        }else{
            params.verify = "请输入邀请码"
            return params
        }
        return params
    }
    $("#register_btn").click(function(){
        var params =verifyFun({
            username:'',
            email:'',
            password:'',
            invitation_code:'',
            verify:-1
        })
        console.log("params",params)
        if(params.verify==-1){
            $.ajax({
                async:false,
                type: "post",
                url: url+"/User/AddUser",
                data:`{"UserId":"",
                "VerificationCode":"${params.invitation_code}",
                "Email":"${params.email}",
                "UserName":"${params.username}",
                "Password":"${params.password}"}`,
                contentType:"application/json",
                dataType: "json",
                success: function(data){
                    // console.log(data)
                    if(data.ServiceCode == 'SUCCESS'){
                        alert(data.Message)
                        location.href = "/login.html";
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