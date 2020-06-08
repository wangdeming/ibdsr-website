function getWord(str) { //截取标签内的文本信息(新闻资讯内容返回的是hxml文本)
    var reg = /<[^>]+>/g;
    var newStr = str.replace(reg,'')
    return newStr
}

$(document).ready(function(){
    
    /*首页飞入动画start*/
    var sun = $("#sun")
    var sunWord = $('#sunWord')
    var flyList = [
        '创业孵化平台','创新研发平台','人才培养平台'
    ]
    $('.fly').click(function(){
        var id = this.id
        var self = $(this)
        switch (id) {
            case 'fly1':
                $('.fly').parent().removeClass('active')
                self.parent().addClass('active')
                self.removeClass('fly1').addClass('fly1')
                sunWord.text(flyList[0])
                setTimeout(function(){
                    self.removeClass('fly1')
                    sun.removeClass('sun2').removeClass('sun3').addClass('sun1')
                },1000)
                break;
            case 'fly2':
                $('.fly').parent().removeClass('active')
                self.parent().addClass('active')
                self.removeClass('fly2').addClass('fly2')
                sunWord.text(flyList[1])
                setTimeout(function(){
                    self.removeClass('fly2')
                    sun.removeClass('sun1').removeClass('sun3').addClass('sun2')
                },1000)
                break;
            case 'fly3':
                $('.fly').parent().removeClass('active')
                self.parent().addClass('active')
                self.removeClass('fly3').addClass('fly3')
                sunWord.text(flyList[2])
                setTimeout(function(){
                    self.removeClass('fly3')
                    sun.removeClass('sun1').removeClass('sun2').addClass('sun3')
                },1000)
                break;
        }
    })
    /*首页飞入动画end*/
    

    // 解决方案切换效果
    var pre = $('#pre')
    var next = $('#next')
    var tabTop = $("#plan").find('.top').find('.tab')
    var tabBottom = $("#plan").find('.point-nav').find('.tab')
    var cardList = $("#cardList")
    var cardItem = $("#cardList").find('.card')
    var length = cardItem.length
    var current = 1 

    var clientWidth = document.body.offsetWidth
    // 居中
    if(clientWidth < 1920) {
        cardList.css('left', ((clientWidth / 2) - 456) + 'px')
    }
    
    function move(current) {
        if(current === 0) {
            pre.addClass('none')
        }
        else if(current > 0 && current < length - 1) {
            pre.removeClass('none')
            next.removeClass('none')
        }
        else if(current === length - 1) {
            next.addClass('none')
        }

        cardList.css('transform', 'translateX('+(-536*current)+'px)')
        for(var i=0;i<length;i++) {
            cardItem.eq(i).removeClass('active')
            tabTop.eq(i).removeClass('active')
            tabBottom.eq(i).removeClass('active')
        }
        cardItem.eq(current).addClass('active')
        tabTop.eq(current).addClass('active')
        tabBottom.eq(current).addClass('active')
    }

    tabTop.click(function(){
        current = $(this).index()
        move(current)
    })
    
    // tabBottom.click(function() {
    //     current = $(this).index()
    //     move(current)
    // })

    pre.click(function(){
        current--
        move(current)
    })
    next.click(function(){
        current++
        move(current)
    })


    // 获取新闻列表
    function getNewsList(type) {
        //新闻列表
        var newsList = []
        
        var html = ''
        $.axse(
            {
                url: '/api/news/list',
                data: {
                    'newsType': type, //新闻类型1:新闻动态;2:媒体报道;3:合作交流;
                    limit: 3,
                    offset: 0,
                }
            },
            function(res){
                var title1, title2, title3 = ''
                if(res.rows.length < 1) {
                    return false
                } 
                else if(res.rows.length == 1) {
                    // res.rows[0].mainContent = getWord(res.rows[0].mainContent)
                    title1 = getString(res.rows[0].title, 20)
                    console.log(title1)
                    html = html + "<div class='news-pic'>"+
                                        "<a target='_blank' href='./newDetail.html?id="+res.rows[0].id+"'>"+
                                            "<img class='scalePic' src="+res.rows[0].coverImage+" alt=''>"+
                                            "<div class='pic-exp f14'>"+
                                                "<p class='word'>"+title1+"</p>"+
                                                "<span class='time'>"+res.rows[0].showTime+"</span>"+
                                            "</div>"+
                                        "</a>"+
                                    "</div>"
                } 
                else if(res.rows.length == 2) {
                    title1 = getString(res.rows[0].title, 20)
                    title2 = getString(res.rows[1].title, 20)
                    html = html + "<div class='news-pic'>"+
                                        "<a href='./newDetail.html?id="+res.rows[0].id+"' target='_blank'>"+
                                            "<img class='scalePic' src="+res.rows[0].coverImage+" alt=''>"+
                                            "<div class='pic-exp f14'>"+
                                                "<p class='word'>"+title1+"</p>"+
                                                "<span class='time'>"+res.rows[0].showTime+"</span>"+
                                            "</div>"+
                                        "</a>"+
                                    "</div>"+
                                    "<div class='news-more'>"+
                                    "<a class='item' href='./newDetail.html?id="+res.rows[1].id+"' target='_blank'>"+
                                        "<span class='word'>"+title2+"</span>"+
                                        "<span class='time fr'>"+res.rows[1].showTime+"</span></a>"+
                                "</div>"
                }
                else {
                    title1 = getString(res.rows[0].title, 20)
                    title2 = getString(res.rows[1].title, 20)
                    title3 = getString(res.rows[2].title, 20)
                    html = html + "<div class='news-pic'>"+
                                "<a href='./newDetail.html?id="+res.rows[0].id+"' target='_blank'>"+
                                    "<img class='scalePic' src="+res.rows[0].coverImage+" alt=''>"+
                                    "<div class='pic-exp f14'>"+
                                        "<p class='word'>"+title1+"</p>"+
                                        "<span class='time'>"+res.rows[0].showTime+"</span>"+
                                    "</div>"+
                                "</a>"+
                            "</div>" + 
                            "<div class='news-more'>"+
                                "<a class='item' href='./newDetail.html?id="+res.rows[1].id+"' target='_blank'>"+
                                    "<span class='word'>"+title2+"</span>"+
                                    "<span class='time fr'>"+res.rows[1].showTime+"</span></a>"+
                            "</div>"+
                            "<div class='news-more'>"+
                                "<a class='item' href='./newDetail.html?id="+res.rows[2].id+"' target='_blank'>"+
                                    "<span class='word'>"+title3+"</span>"+
                                    "<span class='time fr'>"+res.rows[2].showTime+"</span></a>"+
                            "</div>"
                }
                

                switch (type) {
                    case 1: 
                        $("#news1").append(html)
                        break
                    case 2:
                        $("#news2").append(html)
                        break
                    case 3:
                        $("#news3").append(html)
                        break
                }

                
        })

    }

     //获取banner
     function getBanner() {
        var html = ''
        $.axse(
            {
                url: '/api/banner/list',
                header: {
                    'Content-Type':'application/json'
                }
            },
            function(data){
                if(data.code === 200 && data.data.length > 0) {
                    data.data.forEach(function(item){
                        html = html + '<li class="banner-item swiper-slide fl">'+
                            '<img class="pic" src='+item.path+'></li>'
                    })
                    $("#banner").append(html)
                    var swiper = new Swiper('#bannerSwiper', {
                        autoplay: 5000,
                        autoplayDisableOnInteraction: false,
                        pagination: '.swiper-pagination',
                        paginationClickable: true
                    });
                }
            }
        )
     }

     getBanner()
     getNewsList(1)
     getNewsList(2)
     getNewsList(3)
})