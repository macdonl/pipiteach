/*通用方法*/
var tools = (function () {
    var flag = "getElementsByClassName" in document;
    return {
        //listToArray:将类数组转化为数组（兼容所有浏览器）
        listToArray: function (likeAry) {
            var ary = [];
            if (flag) {
                ary = Array.prototype.slice.call(likeAry, 0);
            } else {
                for (var i = 0; i < likeAry.length; i++) {
                    ary[ary.length] = likeAry[i];
                }
            }
            return ary;
        }
    };
})();


/*文章内容左侧伸缩菜单*/
function flexMenu(event) {
    // var a = event.target;
    var a = event.srcElement ? event.srcElement : event.target;
    var b = a.parentNode;
    var c = b.children;
    if (c.index == true) {
        for (var i = 1; i < c.length; i++) {
            c[i].style.display = 'block';
        }
        c.index = false;
    } else {
        for (var i = 1; i < c.length; i++) {
            c[i].style.display = 'none';
        }
        c.index = true;
    }
}

function defaultEvent(event) {
    event.stopPropagation();
}

/*滚动到顶部*/
function scrollTotop() {
    var backTop = document.getElementById("scrolltotop");
    var flag = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent) ? true : false;
    var clientwidth = document.body.clientWidth ;
    window.onscroll = function () {
        var scrollTop = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
        if (scrollTop > 1 && flag == false && clientwidth>1000) {  //按钮出现的条件
            backTop.style.display = "block";
        } else {
            backTop.style.display = "none";
        }
    }
    var iid;
    backTop.onclick = function () {  //点击事件
        iid = setInterval(function () {
            var current = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
            if (current === 0) {
                clearInterval(iid);
            }
            document.documentElement.scrollTop = current - 50;
            document.body.scrollTop = current - 50;
        }, 16);
    }
    window.onmousewheel = function () {
        clearInterval(iid);
    }
}
scrollTotop();



/*移动端左侧菜单按钮事件*/
function toggleMenu(id1,id2) {
    var a = document.getElementById(id1);
    var b = document.getElementById(id2);
        if (a.index==false){
            a.style.display = 'none';
            b.style.display = 'block';
            a.index = true;
        }else {
            a.style.display = 'block';
            b.style.display = 'none';
            a.index = false;
        }
}
 /*课程菜单导航*/
function courseNav(event) {
    var a = event.srcElement ? event.srcElement : event.target;
    var b = a.parentNode;
    var c = b.children;
    for (var i=0; i<c.length; i++){
        c[i].className = "";
    }
    a.className = "on";
    var cont = document.getElementsByClassName("course_name");
    var str1 = a.innerHTML;
    for (var j=0; j<cont.length; j++){
        if (str1 !== cont[j].innerHTML){
            cont[j].parentNode.style.display = 'none';
        }else {
            cont[j].parentNode.style.display = 'block';
        }
    }
}



//返回
function goBack() {
    window.history.go(-1);
}

//弹出框
function popBox(value,state,locationUrl) {
    var pop_box_container = document.getElementById("pop_box_container");
    var p_div = document.createElement("div");
    var frag;
    if (state == 1){
        frag = "<h1>"+value+"</h1><a class='c_btn c_btn_imp pop' href="+locationUrl+" >确定</a>";
    }else {
        frag = "<h1>"+value+"</h1><button class='c_btn c_btn_imp' onclick=\"removePopBox("+state+")\">确定</button>";
    }
    p_div.innerHTML = "<div class='pop_box'>" +
        "<div>" +
        frag +
        "</div>" +
        "</div>";
    pop_box_container.appendChild(p_div);
    $("#pop_box_container").fadeIn();

}
//销毁弹出框
function removePopBox(e) {
    var pop_box_container = document.getElementById("pop_box_container");
    pop_box_container.removeChild(pop_box_container.firstChild);
    $("#pop_box_container").fadeOut();
    if (e == 0){
        window.location.reload();
    }
}










