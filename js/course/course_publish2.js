var url = "";
var chapter_container = document.getElementById("chapter_container");
var all = {};

//弹出框
function deletePopBox(para) {
    window.event? window.event.cancelBubble = true : e.stopPropagation();
    all.click_item_id = getId.getIdAll(0);
    var pop_box_container = document.getElementById("pop_box_container");
    var oDiv = document.createElement("div");
    oDiv.className = "confirm_popbox";
    oDiv.innerHTML = "<div>"+
        "<h1>确认删除？</h1>"+
        "<button class='c_btn' onclick=\"destoryPopBox()\">取消</button>"+
        "<button class='c_btn c_btn_imp' onclick=\"deleteData("+para+")\">确认</button>"+
        "</div>";
    pop_box_container.appendChild(oDiv);
    $("#pop_box_container").fadeIn();
}
//销毁弹出框
function destoryPopBox() {
    var pop_box_container = document.getElementById("pop_box_container");
    pop_box_container.removeChild(pop_box_container.firstChild);
    $("#pop_box_container").fadeOut();
}

//获取ID合集
var getId = {
    //从URL中获取教程ID  添加章使用此方法
    getBookId: function () {
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
    },
    //通过点击元素获取父元素ID  章修改、章删除、章排序、节删除、节排序使用此方法
    getIdAll: function (e) {
        var cur_click_ele = event.srcElement ? event.srcElement : event.target;
        var parent_id;
        if (e == 0){  //传参数0进来获取点击元素的父元素id
            parent_id = cur_click_ele.parentNode.getAttribute("id");
        }else if(e == 1){  //传参数1进来获取点击元素的父元素的前一个兄弟元素id
            parent_id = cur_click_ele.parentNode.previousElementSibling.getAttribute("id");
        }
        return parent_id;
    }
};

//获取章列表
function getChapterList() {
    var chapter_list = {};
    $.ajax({
        type: "post",
        url: url + "/Book/QueryBookDetailsByBookId",
        contentType: "application/json",
        data: `{
            "BookId":"${getId.getBookId().BookId}"
        }`,
        dataType: "json",
        async: false,
        success: function (data) {
            chapter_list.BookChapterDTOList = data.Result.BookDTO.BookChapterDTOList;
            all.book_name = data.Result.BookDTO.BookName;
            all.bookDTO = data.Result.BookDTO;
        },
        error: function (e) {
        }
    });
    var chapter_list_html = template("chapter_list_template",chapter_list);
    $("#chapter_list").html(chapter_list_html);
    return chapter_list.BookChapterDTOList;
}
getChapterList();

//获取章的内容  修改章所需
function getCurrentChapter(e) {
    all.cur_chapter_id = getId.getIdAll(e);
    var course_arr = getChapterList();
    var arr;
    for (var i=0; i<course_arr.length; i++){
        if (course_arr[i].BookChapterId == all.cur_chapter_id){
            arr = course_arr[i];
        }
    }
    return arr;
}

//获取用户输入信息  新增章、新增小节所需
function userInputInfo() {
    var user = {};
    user.name = $("#add_course input[name=name]").val();
    user.description = $("#add_course input[name=description]").val();
    user.seo_url = $("#add_course input[name=seo_url]").val();
    user.seo_title = $("#add_course input[name=seo_title]").val();
    user.seo_keywords = $("#add_course input[name=seo_keywords]").val();
    user.seo_description = $("#add_course input[name=seo_description]").val();
    return user;
}

//提交数据
function submitAddData(para) {
    if (para == 0){  //修改章
        $.ajax({
            type: "post",
            url: url+"/Book/UpdateBookChapter",
            contentType:"application/json",
            data:`{
                    "BookChapterId": "${all.cur_chapter_id}",
                    "BookChapterName": "${userInputInfo().name}",
                    "BookChapterDescription": "${userInputInfo().description}",
                    "BookChapterOrder": 300,
                    "SeoUrl": "${userInputInfo().seo_url}",
                    "SeoTitle": "${userInputInfo().seo_title}",
                    "SeoKeywords": "${userInputInfo().seo_keywords}",
                    "SeoDescription": "${userInputInfo().seo_description}"
        }`,
            dataType: "json",
            async:false,
            success: function(data){
                popBox(data.Message);  //(add_step:4)
                if(data.ServiceCode=="SUCCESS"){
                    closePopBox();
                    getChapterList();
                }
            },
            error:function(e){
            }
        });
    }else if(para == 1){  //新增章
        $.ajax({
            type: "post",
            url: url+"/Book/AddBookChapter",
            contentType:"application/json",
            data:`{
                    "BookId": "${getId.getBookId().BookId}",
                    "BookChapterName" : "${userInputInfo().name}",
                    "BookChapterDescription" : "${userInputInfo().description}",
                    "SeoUrl": "${userInputInfo().seo_url}",
                    "SeoTitle": "${userInputInfo().seo_title}",
                    "SeoKeywords": "${userInputInfo().seo_keywords}",
                    "SeoDescription": "${userInputInfo().seo_description}"
        }`,
            dataType: "json",
            async:false,
            success: function(data){
                popBox(data.Message);  //(add_step:4)
                if(data.ServiceCode=="SUCCESS"){
                    closePopBox();
                    getChapterList();
                }
            },
            error:function(e){
            }
        });
    }else if(para == 2){  //新增小节
        $.ajax({
            type: "post",
            url: url+"/Book/AddBookSection",
            contentType:"application/json",
            data:`{
                    "BookChapterId":"${all.cur_chapter_id}",
                    "BookSectionName":"${userInputInfo().name}",
                    "BookSectionDescription":"${userInputInfo().description}",
                    "BookSectionContent":" ",
                    "SeoUrl":"${userInputInfo().seo_url}",
                    "SeoTitle":"${userInputInfo().seo_title}",
                    "SeoKeywords":"${userInputInfo().seo_keywords}",
                    "SeoDescription":"${userInputInfo().seo_description}"
        }`,
            dataType: "json",
            async:false,
            success: function(data){
                popBox(data.Message);  //(add_step:4)
                if(data.ServiceCode=="SUCCESS"){
                    closePopBox();
                    getChapterList();
                }
            },
            error:function(e){
            }
        });
    }
}

//生成弹出框
function createPopBox(para) {
    var course_title;
    var user = {
        BookChapterName: "",
        BookChapterDescription: "",
        SeoUrl: "",
        SeoTitle: "",
        SeoKeywords: "",
        SeoDescription: ""
    };
    if (para == 0){
        user = getCurrentChapter(para);
        course_title = "修改章";
    }else if(para == 1) {
        course_title = "新增章";
    }else if (para == 2){
        all.cur_chapter_id = getId.getIdAll(1);
        course_title = "新增小节";
    }
    var oDiv = document.createElement("div");
    oDiv.className = "create_main";
    oDiv.innerHTML =
        "<div class=\"create_cont\">" +
        "<div class=\"t\">"+course_title+"<span onclick=\"closePopBox()\">X</span></div>" +
        "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" id=\"add_course\" class=\"course_add_cont course_add_cont2\">" +
        "<tr>" +
        "<td width=\"100\">章名称</td>" +
        "<td><input type=\"text\" value=\""+user.BookChapterName+"\" name=\"name\" class=\"txt\"></td>" +
        "</tr>" +
        "<tr>" +
        "<td>章描述</td>" +
        "<td><input type=\"text\" value=\""+user.BookChapterDescription+"\" name=\"description\" class=\"txt\"></td>" +
        "</tr>" +
        "<tr>" +
        "<td>SEO网址</td>" +
        "<td><input type=\"text\" value=\""+user.SeoUrl+"\" name=\"seo_url\" class=\"txt\"></td>" +
        "</tr>" +
        "<tr>" +
        "<td>SEO标题</td>" +
        "<td><input type=\"text\" value=\""+user.SeoTitle+"\" name=\"seo_title\" class=\"txt\"></td>" +
        "</tr>" +
        "<tr>" +
        "<td>SEO关键字</td>" +
        "<td><input type=\"text\" value=\""+user.SeoKeywords+"\" name=\"seo_keywords\" class=\"txt\"></td>" +
        "</tr>" +
        "<tr>" +
        "<td>SEO描述</td>" +
        "<td><input type=\"text\" value=\""+user.SeoDescription+"\" name=\"seo_description\" class=\"txt\"></td>" +
        "</tr>" +
        "<tr>" +
        "<td></td>" +
        "<td><input type=\"button\" class=\"c_btn c_btn_imp\" value=\"提交\" onclick=\"submitAddData("+para+")\"></td>" +
        "</tr>" +
        "</table>" +
        "</div>";
    chapter_container.appendChild(oDiv);
}

//销毁弹出框
function closePopBox() {
    chapter_container.removeChild(chapter_container.children[0]);
}

//新增章
function addCourse() {
    createPopBox(1);
}

//修改章
function modifyCourse() {
    createPopBox(0);
}

//新增小节
function addChapter() {
    createPopBox(2);
}

//删除
function deleteData(e) {
    var ele = {};
    if (e == 0){  //删除章
        ele.url = "PhysicsDeleteBookChapterByBookChapterId";
        ele.id = "BookChapterId";
    }else if(e == 1){  //删除小节
        ele.url = "PhysicsDeleteBookSectionByBookSectionId";
        ele.id = "BookSectionId";
    }
    $.ajax({
        type: "post",
        url: url+"/Book/"+ele.url,
        contentType:"application/json",
        data:`{
            "${ele.id}":"${all.click_item_id}"
        }`,
        dataType: "json",
        async:false,
        success: function(data){
            popBox(data.Message);
            getChapterList();
        },
        error:function(e){
        }
    });
}

//小节排序
function sectionSortUp(e) {
    window.event? window.event.cancelBubble = true : e.stopPropagation();
    var cur_btn = event.srcElement ? event.srcElement : event.target;
    var curLi = cur_btn.parentNode.parentNode;
    var oLis = curLi.parentNode.children;
    var arr = tools.listToArray(oLis);
    var curLi_index = arr.indexOf(curLi);
    if (curLi_index == 0){
        popBox("已经是最前");
    }else {
        var cur_id = cur_btn.parentNode.getAttribute("id");
        var prev_id = cur_btn.parentNode.parentNode.previousElementSibling.children[0].getAttribute("id");
        var para = {};
        if (e == 0){
            para.url = "SwapBookChapterOrder";
            para.idA = "BookChapterAId";
            para.idB = "BookChapterBId";
        }else if (e == 1){
            para.url = "SwapBookSectionOrder";
            para.idA = "BookSectionAId";
            para.idB = "BookSectionBId";
        }
        $.ajax({
            type: "post",
            url: url+"/Book/"+para.url,
            contentType:"application/json",
            data:`{
                    "${para.idA}":"${cur_id}",
                    "${para.idB}":"${prev_id}"
            }`,
            dataType: "json",
            async:false,
            success: function(data){
                curLi.parentNode.insertBefore(curLi, oLis[curLi_index - 1]);
            },
            error:function(e){
            }
        });
    }
}

//跳转到小节页面
function jumpToBookSectionPage(bookSectionId) {
    $.ajax({
        type: "post",
        url: url+"/Book/GetSectionPageUrlByBookSectionId",
        contentType:"application/json",
        data:`{
            "BookSectionId":"${bookSectionId}"
        }`,
        dataType: "json",
        async:false,
        success: function(data){
            if (data.ServiceCode == "FAIL"){
                popBox(data.Message);
            } else {
                window.open(data.Result.SectionPageUrl);
            }
        },
        error:function(e){
        }
    });
}

//标题
var bookName = document.getElementById("book_name");
var bookUrl = "/jiaocheng/" + all.bookDTO.Id +"/" + all.bookDTO.SeoUrl + ".html";
//TODO
bookName.innerHTML = all.book_name+"<a target='_blank' href='"+bookUrl+"'><img class='see_page' src='../../images/view.png' alt=''></a>";