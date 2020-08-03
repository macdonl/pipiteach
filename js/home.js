var userID = null;
var url="";
var post_para = {};
post_para.curPage = 1;
function getPostList(cur_page=1){
    $.ajax({
        type: "post",
        url: url+"/User/GetUserInfo",
        contentType:"application/json",
        dataType: "json",
        async:false,
        success: function(data){
            userID = data.Result.UserInfo.UserId;
            var userName = document.getElementById("user_name");
            userName.innerHTML = data.Result.UserInfo.UserName;
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
    var article_data = {};
    $.ajax({
        type: "post",
        url: url+"/Bbs/QueryBbsArticleByUserId",
        contentType:"application/json",
        data:`{
            "PageCondition":{
                "PageNum":${cur_page},
                "PageSize":10
            }
        }`,
        dataType: "json",
        async:false,
        success: function(data){
            if(data.Result!=null){
                article_data.BbsArticleDTOList = data.Result.BbsArticleDTOList.Data;
                post_para.totalCount = data.Result.BbsArticleDTOList.TotalDataCount;
            }
        },
        error:function(e){
        }
    });
    var article_html = template("article_list_template",article_data);
    $("#home_right").html(article_html);
}
getPostList();

//通用分页功能
//逻辑描述
//1、最大只显示前5页，大于5页显示最后一页的号码
//2、点击某一页跳转到该页
//3、上一页下一页始终显示，当只有一页的时候点击无法跳转
//4、处在第一页的时候，点击上一页无法跳转；处在最后一页的时候，点击下一页无法跳转

function Paging(){
    console.log(post_para.totalCount);
    var paging = document.getElementById("paging");
    var p_list = document.createElement("div");
    var page = document.createElement("div");
    var total_page = Math.ceil(post_para.totalCount/10);
    var num = total_page>5?5:total_page;
    for (var i=1; i<=num; i++){
        page.innerHTML += "<span>"+i+"</span>";
    }
    if (total_page > 5){
        page.innerHTML += "<span>"+total_page+"</span>";
    }
    var arr = page.innerHTML;
    p_list.innerHTML = "<span>上一页</span>"+
        arr +
        "<span>下一页</span>";
    paging.appendChild(p_list);
    paging.addEventListener('click',function(e){
        var cur_page = e.target.innerHTML;
        if (cur_page == "上一页"){
            cur_page = post_para.curPage - 1;
            if (cur_page == 0){
                alert("已经是第一页");
            }else {
                cur_page = Number(cur_page);
                post_para.curPage = cur_page;
                getPostList(cur_page);
                $('#paging').children().children().removeClass("on");
            }
        }else if (cur_page == "下一页"){
            cur_page = post_para.curPage + 1;
            if (cur_page > Math.ceil(post_para.totalCount/10)){
                alert("已经是最后一页");
            }else {
                cur_page = Number(cur_page);
                post_para.curPage = cur_page;
                getPostList(cur_page);
                $('#paging').children().children().removeClass("on");
            }
        }else {
            cur_page = Number(cur_page);
            post_para.curPage = cur_page;
            getPostList(cur_page);
            $('#paging').children().children().removeClass("on");
            e.target.className = "on";
        }
    })
}
Paging();
