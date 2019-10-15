import flimView from "../views/film.art"
import positionModel from "../models/postion"
import filmlistView from "../views/filmlist.art"
const BScroll = require('better-scroll')

class Flimmes{
    async render(){
        //发送ajax请求数据
        let id = location.hash.replace(/[^\d]+/,'');
        let url = `/api/ajax/detailmovie?movieId=${id}`
        let resulumovie = await positionModel.get(url)
        resulumovie = resulumovie.detailMovie;
        resulumovie.snum = (resulumovie.snum /10000).toFixed(1);
        //图片路径修改
        let re=/w.h/;
        resulumovie.img=  resulumovie.img.replace(re,'148.208');
        let list =[];
        list.push(resulumovie);
        //渲染到root下面
        let html = flimView({list})
        $('#root').html(html);
        $('.poster-bg').css('background-image',`url(${resulumovie.img})`);
        //发送ajax请求数据
        let datas ={
            movieId: id,
            day: 2019-10-12,
            limit: 20,
            updateShowDay: true,
            cityId: 1
        }
            //发送ajax请求数据
            let result = await positionModel.post('/api/ajax/movie?forceUpdate=1570848448936',datas)
            let cinemas = result.cinemas;
            let htmlfilelist = filmlistView ({cinemas})
            $('.cinema-list .list-wrap').html(htmlfilelist);

            let str="";
            for(var i=0; i<result.showDays.dates.length; i++){
                str+=`<li class="showDay" data-day="${result.showDays.dates[i].date}">${result.showDays.dates[i].date}</li>`
            }
            $('#timeline').html(str);
            $('#timeline li').eq(0).addClass('chosen');
        //筛选
        $('.mb-line-b .item').on('tap',function(){
            $(this).addClass('chosenTitle').siblings().removeClass('chosenTitle');
        })
        //选择日期
        $('#timeline li').on('tap',async function(){
            $(this).addClass('chosen').siblings().removeClass('chosen');
            let datas ={
                movieId: id,
                day: $(this).html(),
                limit: 20,
                updateShowDay: true,
                cityId: 1
            }
            let result = await positionModel.post('/api/ajax/movie?forceUpdate=1570848448936',datas)
            let cinemas = result.cinemas;
            let htmlfilelist = filmlistView ({cinemas})
            $('.cinema-list .list-wrap').html(htmlfilelist);
            $(this).addClass('chosen').siblings().removeClass('chosen');
        })
        //点击筛选地址事件
        $('.mb-line-b .item').on('tap',async function(){
            let mask = document.createElement('div');
            console.log(mask);
            $(mask).addClass('mask');
            
        })
    }
}
export default new Flimmes();