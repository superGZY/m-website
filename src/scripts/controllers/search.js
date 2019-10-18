import searchView from "../views/search.art"
import ajaxController from "../models/postion"
import searchfilmView from "../views/search-film.art"
import searchcinemaView from "../views/search-cinema.art"
import searchhistoryView from "../views/search-history.art"

class Search{
    render(){
        let html = searchView({})
        $('#root').html(html)
        let searchhistory =localStorage.getItem('searchhistory')?JSON.parse(localStorage.getItem('searchhistory')):[]
        let historyhtml = searchhistoryView({searchhistory})
        $('.search-history').html(historyhtml)
        //搜索框输入事件
        var timer;
        $('.search-header .search-input').on('input', inputchange)
        function inputchange(){
            clearTimeout(timer) 
            timer = setTimeout(async function () {
                if( $('.search-header .search-input').val() == ''){
                    $('.search-result').css('display','none')
                    let historyhtml = searchhistoryView({})
                    $('.search-history').html(historyhtml)
                }
                else{
                    //更新历史纪录
                    let searchhistory =localStorage.getItem('searchhistory')?JSON.parse(localStorage.getItem('searchhistory')):[]
                    searchhistory.unshift($('.search-header .search-input').val())
                    //数组去重
                    searchhistory = [...new Set(searchhistory)]
                    localStorage.setItem('searchhistory',JSON.stringify(searchhistory))
                    //history隐藏
                    $('.search-history').css('display','none')
                    //result显示渲染
                    $('.del-input').css('display','block')
                    let result =await ajaxController.get(`/api/ajax/search?kw=${$('.search-header .search-input').val()}&cityId=91&stype=-1`)
                    $('.more-result').attr('data-total',result.movies.total)
                    $('.more-result').html(`查看全部${result.movies.total}部影视剧`)
                    for(var i=0; i<result.movies.list.length; i++){
                        result.movies.list[i].img = result.movies.list[i].img.replace('w.h','128.180');
                    }
                    let list = result.movies.list
                    let html = searchfilmView({list})
                    $('.result .list').eq(0).html(html)
                    if(result.cinemas){
                        let list2 = result.cinemas.list
                        let html2 = searchcinemaView({list2})
                        $('.result .list').eq(1).html(html2)
                        $('.result').eq(1).css('display','block')
                    }
                    else{
                        $('.result').eq(1).css('display','none')
                    }
                    $('.search-result').css('display','block')
                }
                
            }, 500)
        }
        //点击输入框删除事件
        $('.del-input').on('click', function(){
            $('.search-header .search-input').val('')
            $('.search-result').css('display','none')
            $('.del-input').css('display','none')
            $('.search-history').css('display','block')
            let searchhistory =localStorage.getItem('searchhistory')?JSON.parse(localStorage.getItem('searchhistory')):[]
            let historyhtml = searchhistoryView({searchhistory})
            $('.search-history').html(historyhtml)
            $('.del-word').on('click', removehistory)
            //点击历史事件
            $('.word-one-line').on('click', choosehistory)
        })
        //点击历史记录删除事件
        $('.del-word').on('click', removehistory)
        function removehistory (){
            //删除当前项
            $(this).parent().remove()
            let text = $(this).prev().get(0).innerText
            let searchhistory =JSON.parse(localStorage.getItem('searchhistory'))
            let index = searchhistory.indexOf(text)
            searchhistory.splice(index, 1); 
            localStorage.setItem('searchhistory',JSON.stringify(searchhistory))
            console.log(searchhistory)
        }
        //点击历史事件
        $('.word-one-line').on('click', choosehistory)
        function choosehistory(){
            $('.search-input').val(this.innerText)
            inputchange()
        }
    }
}
export default new Search()