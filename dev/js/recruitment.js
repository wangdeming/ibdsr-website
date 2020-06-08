$(function(){ 
    getTypeList();

    // 招聘岗位菜单
    $("#nav li").each(function(index) {
        $(this).click(function() {
            $("#nav .active").removeClass("active");
            $("#aaa .aaa").removeClass("aaa");
            $(this).addClass("active");
            $("#aaa article:eq(" + index + ")").addClass("aaa");
        });
    });
});

//获取岗位类型列表
function getTypeList(){
    var typeList = []
    var id = ''
    var html = ''
    $.axse(
        {
            url: '/api/hire/jobtype/list'
        },
        function(data){
            typeList = data.data
            for(var i=0;i<typeList.length;i++){
                html = html + "<li onclick='clickType(this,"+i+","+typeList[i].id+")'>"+typeList[i].name+"<span style='margin-left:10px;'>"+typeList[i].jobCount+"</span></li>"
            }
            $("#myTab").append(html)
            $("#myTab li:eq(0)").addClass("active");
            id=typeList[0].id
            //获取岗位列表
            getJobList(id)
        })
}

// 岗位列表
function getJobList(id){
    $("#jobs").empty();
    
    var jobList = []
    var jobHtml = ''
    $.axse(
        {
            url: '/api/hire/job/list',
            data:{jobType:id},
        },
        function(data){
            jobList = data.data
            for(var i=0;i<jobList.length;i++){
                jobHtml = jobHtml + "<div class='folding'>"+
                        "<div class='vtitle' onclick='spread(this,"+jobList[i].id+")'><em class='v'></em>"+jobList[i].name+"<span class='number'>"+jobList[i].num+"名</span></div>"+
                        " <div id='"+jobList[i].id+"' class='vcon' style='display: none;'>"+
                                "<div class='item'>"+
                                        "<h5>岗位职责：</h5>"+
                                        "<pre class='pre-font'>"+jobList[i].jobDuty+"</pre>"+
                                        "</div>"+
                                        "<div class='item'>"+
                                        "<h5>任职要求：</h5>"+
                                        "<pre class='pre-font'>"+jobList[i].jobRequire+"</pre>"+
                                        "</div>"+
                                        "<button id='delivery' onclick='clickPop("+jobList[i].id+",\""+jobList[i].name+"\")'>立即投递</button>"+
                                        "</div>"+
                                        "</div> "
            }
            $("#jobs").append(jobHtml)
        })
}

// 获取岗位ID
function getObject(objId){
    if(document.getElementById && document.getElementById(objId)){
        return document.getElementById(objId);
    }else if(document.all && document.all(objId)){
        return document.all(objId);
    }else if(document.layers && document.layers[objId]){
        return document.layers[objId];
    }else{
        return false;
    }
}

//菜单隐藏展开
function spread(e,objId){
        var obj = getObject(objId);
        if(obj.style.display == "none"){
            var _self = $(this);
            $('em').removeClass('v01');
            $(e).find('em').addClass('v02')
            obj.style.display = "block";
        } else {
            var _self = $(this);
            $(e).find('em').removeClass('v02')
            obj.style.display = "none";
        }
}

// 岗位分类
function clickType(e,index,id){
    $("#myTab .active").removeClass("active");
    $(e).addClass("active");
    getJobList(id)
}

// 点开投递简历
function clickPop(id,name){
    $('.bomb-resume').show()
    $('.success-resume').hide()
    $('.mask-resume').show()
    $('#jobId').val(id)
    $('#jobName').text("投递简历-"+name)
}

var nameRex =/^[\u4e00-\u9fa5]{2,4}$/ //姓名验证
var telRex =/^1[3456789]\d{9}$/ //手机
var emailRex = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/  //邮箱验证
var fileObj = undefined
var timeMaxRe = 3

// 验证信息填写是否正确
function check() {
    if(!$("#name").val()) {
        alert('请填写姓名！')
    }
    else if(!nameRex.test($("#name").val())) {
        alert('姓名必须是2-4个汉字！')
    }
    else if(!$("#birthday").val()) {
        alert('请选择出生年月！')
    }
    else if(!telRex.test($("#phone").val())) {
        alert('请填写正确的联系电话！')
    }
    else if(!emailRex.test($("#email").val())) {
        alert('请填写正确的电子邮箱！')
    }
    else if(fileObj === undefined || fileObj.size <= 0) {
        alert('请上传文件！')
    }
    else if($("#remark").val().length > 300) {
        alert('备注不能超过300个字数！')
    }
    else {
        return true
    }
}

//$("#resumeFile").files[0]报错 获取文件
var resumeFile = document.getElementById("resumeFile")
$('#resumeFile').change(function(){
    if(resumeFile.files[0] != undefined && resumeFile.files[0].size > 0) {
        fileObj =  resumeFile.files[0]
        $("#file").text(fileObj.name)
        $(".info").css("display","block")
    } else {
        if(fileObj == undefined || fileObj.size <= 0) {
            $(".info").css("display","none")
        }
    }
})

// 删除被选文件
$("#det").click(function(){
    fileObj = undefined
    $("#file").text('请选择文件')
    $(".info ").css("display","none")
})

// 提交简历
$('#sendResume').click(function(){
    if(event.preventDefault) event.preventDefault();
    else event.returnValue = false;

    timeMaxRe = 3
    $('#timeOutResume').text(timeMaxRe+'s')

    if(check()) {
        var form = new FormData();
        form.append('jobId', $("#jobId").val())
        form.append('name', $("#name").val())
        form.append('sex', $("input[type='radio']:checked").val())
        form.append('birthday', $("#birthday").val())
        form.append('phone', $("#phone").val())
        form.append('email', $("#email").val())
        form.append('remark', $("#remark").val())
        form.append('resumeFile', fileObj)
        $.ajax({
            url: host+'/api/hire/resume/commit',
            type: 'post',
            data: form,
            processData: false,
            contentType: false,
            success: function(res) {
                if(res.code == 200) {
                    $('.bomb').hide()
                    $('.success-resume').show()
                    $(".identifier input").val('')
                    $(".identifier textarea").val('')
                    $("#man").prop("checked",true)
                    $("#woman").prop("checked",false)
                    fileObj = undefined
                    $("#file").text('请选择文件')
                    $(".info ").css("display","none")
                    timerRe = setInterval(function(){
                        if(timeMaxRe > 0) {
                            timeMaxRe -- 
                            $('#timeOutResume').text(timeMaxRe+'s')
                        } else {
                            timeMaxRe = 3
                            $('.success-resume').hide()
                            $('.mask').hide()
                            clearInterval(timerRe)
                        }
                    },1000)
                } else {
                    alert((res.message || '投递失败！')+'！')
                }
            },
            error: function() {
                alert('投递失败！')
            }
        })
    }
})