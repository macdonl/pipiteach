
    var url="";
    var article_data = {};
    var click_count = 1;


    //从URL中获取文章ID
    function urlArgs() {
        var args = {};
        var query = location.search.substring(1);
        var pairs = query.split("&");
        for (var i = 0; i < pairs.length; i++) {
            var pos = pairs[i].indexOf("=");
            if (pos == -1) continue;
            var name = pairs[i].substring(0, pos);
            var value = pairs[i].substring(pos + 1);
            value = decodeURIComponent(value);
            args[name] = value;
        }
        return args;
    }

    //获取用户信息
    $.ajax({
        type: "post",
        url: url+"/User/GetUserInfo",
        contentType:"application/json",
        dataType: "json",
        async:false,
        success: function(data){
            if(data.Result!=null){
                article_data.UserInfo = data.Result.UserInfo
            }
        },
        error:function(e){
        }
    });

    //获取帖子内容并展示
    function getArticleDetail(){
        $.ajax({
            type: "post",
            url: url+"/Bbs/QueryBbsArticleDetailByBbsArticleId",
            contentType:"application/json",
            dataType: "json",
            data:`{
                "BbsArticleId":"${urlArgs().BbsArticleId}"
            }`,
            async:false,
            success: function(data){
                console.log(data)
                if(data.Result!=null){
                    article_data.BbsArticleDTO = data.Result.BbsArticleDTO;
                    article_data.content = data.Result.BbsArticleDTO.Content;
                }
            },
            error:function(e){}
        });
        var article_html = template("article_details_template",article_data);
        $("#article_details").html(article_html);
    }
    getArticleDetail();

    console.log(article_data.content);
    var post_content = document.getElementById("post_content");
    post_content.innerHTML = article_data.content;

    //获取一级二级评论并展示
    //需要参数：帖子id、显示条件
    function getComment(i){
        var comment_data = {};
        $.ajax({
            type: "post",
            url: url+"/Bbs/QueryBbsArticleCommentByBbsArticleId",
            contentType:"application/json",
            data:`{
                "PageCondition":{
                    "PageNum":${i},
                    "PageSize":10
                },
                "BbsArticleId":"${urlArgs().BbsArticleId}"
            }`,
            dataType: "json",
            async:false,
            success: function(data){
                if(data.Result!=null){
                    comment_data.BbsArticleCommentDTOInformation = data.Result.BbsArticleCommentDTOInformation.Data;
                    comment_data.count = data.Result.BbsArticleCommentDTOInformation.TotalDataCount;
                }
            },
            error:function(e){
            }
        });
        var comment_html = template("comment_list_template",comment_data);
        var odiv = document.getElementById('get_more_comment');
        var f = document.getElementById('comment_list');
        var no_data = document.createElement("div");
        no_data.className = "nodata";
        no_data.innerHTML = "暂无评论";
        if (i == 1){
            $("#comment_list").html(comment_html);
            if (comment_data.BbsArticleCommentDTOInformation.length == 0){
                odiv.style.display = 'none';
                f.appendChild(no_data);
            }else {
                odiv.style.display = 'block';
                if (comment_data.count <= 10){
                    odiv.innerHTML = "没有更多评论了";
                }else {
                    odiv.innerHTML = "查看更多评论";
                }
            }
        }else {
            $("#comment_list").append(comment_html);
            if ((comment_data.count - i*10) > 0){
                odiv.innerHTML = "查看更多评论";
            }else {
                odiv.innerHTML = "没有更多评论了";
            }
        }
    }
    getComment(click_count);

    //获取更多评论
    function getMoreComment() {
        click_count = click_count + 1;
        getComment(click_count);
    }

    //评论帖子
    //需要参数：帖子ID、评论内容
    function commentArticle(){
        if(!article_data.UserInfo){
            alert("请先登录")
            return false
        }
        var cur_btn = event.srcElement ? event.srcElement : event.target;
        var content = cur_btn.parentNode.children[0].value;
        $.ajax({
            type: "post",
            url: url+"/Bbs/AddBbsArticleComment",
            contentType:"application/json",
            dataType: "json",
            data:`{
                "BbsArticleId":"${urlArgs().BbsArticleId}",
	            "Content":"${content}"
            }`,
            async:false,
            success: function(data){
                getComment(1);
                cur_btn.parentNode.children[0].value = "";
            },
            error:function(e){
            }
        });
    }

    //回复评论  刷新并显示二级评论
    //需要参数：帖子ID、评论ID、回复内容
    function replyComment(e){
        if(!article_data.UserInfo){
            alert("请先登录")
            return false
        }
        var cur_btn = event.srcElement ? event.srcElement : event.target;
        var content = cur_btn.parentNode.children[0].value;
        var getDiv = null;
        var id = null;
        var showele = null;
        if (e==0){
            getDiv = cur_btn.parentNode.parentNode;
        }else {
            getDiv = cur_btn.parentNode.parentNode.parentNode.parentNode.children[1];
        }
        id = getDiv.getAttribute("id");
        $.ajax({
            type: "post",
            url: url+"/Bbs/AddBbsArticleComment",
            contentType:"application/json",
            dataType: "json",
            data:`{
                "BbsArticleId":"${urlArgs().BbsArticleId}",
                "ParentBbsArticleCommentId":"${id}",
	            "Content":"${content}"
            }`,
            async:false,
            success: function(data){
                getComment(1);
                cur_btn.parentNode.children[0].value = "";
            },
            error:function(e){
            }
        });

    }

    //点击几条回复，显示或隐藏二级评论  成功
    function showReply() {
        var cur_btn = event.srcElement ? event.srcElement : event.target;
        var parent = cur_btn.parentNode.parentNode;
        var next = parent.nextElementSibling;
        if (cur_btn.index == true) {
            next.style.display = 'none';
            cur_btn.index = false;
        } else {
            next.style.display = 'block';
            cur_btn.index = true;
        }
    }

    //点击回复，显示或隐藏回复框  成功
    function commentInput() {
        var a = event.srcElement ? event.srcElement : event.target;
        var b = a.parentNode;
        var oDiv = b.parentNode;
        if (a.index == true) {
            oDiv.children[2].style.display = 'none';
            a.index = false;
        } else {
            oDiv.children[2].style.display = 'block';
            a.index = true;
        }
    }





