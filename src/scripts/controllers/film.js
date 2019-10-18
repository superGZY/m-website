import flimView from "../views/film.art"
import positionModel from "../models/postion"
import filmlistView from "../views/filmlist.art"
import selectView from "../views/select.art"
import subwayView from "../views/subway.art"

class Flimmes {
    async render() {
        //发送ajax请求数据
        let id = location.hash.replace(/[^\d]+/, '');
        let url = `/api/ajax/detailmovie?movieId=${id}`
        let resulumovie = await positionModel.get(url)
        resulumovie = resulumovie.detailMovie;
        resulumovie.snum = (resulumovie.snum / 10000).toFixed(1);
        //图片路径修改
        let re = /w.h/;
        resulumovie.img = resulumovie.img.replace(re, '148.208');
        let list = [];
        list.push(resulumovie);
        //渲染到root下面
        let html = flimView({ list })
        $('#root').html(html);
        $('.poster-bg').css('background-image', `url(${resulumovie.img})`);
        //发送ajax请求数据
        let datas = {
            movieId: id,
            day: 2019 - 10 - 12,
            limit: 20,
            updateShowDay: true,
            cityId: 1
        }
        //发送ajax请求数据
        let result = await positionModel.post('/api/ajax/movie?forceUpdate=1570848448936', datas)
        let str = "";
        if (result.cinemas.length != 0) {
            let cinemas = result.cinemas;
            let htmlfilelist = filmlistView({ cinemas })
            $('.cinema-list .list-wrap').html(htmlfilelist);

            for (var i = 0; i < result.showDays.dates.length; i++) {
                str += `<li class="showDay" data-day="${result.showDays.dates[i].date}">${result.showDays.dates[i].date}</li>`
            }
            $('#timeline').html(str);
            $('#timeline li').eq(0).addClass('chosen');
        }
        else {
            let none = document.createElement('div');
            none.className = 'none';
            $(none).html('没有获取到数据~~')
            $('.film-mes').append(none);
        }
        //筛选
        $('.mb-line-b .item').on('tap', function () {
            $(this).addClass('chosenTitle').siblings().removeClass('chosenTitle');
        })
        //选择日期
        let date = ''
        $('#timeline li').on('tap', async function () {
            $(this).addClass('chosen').siblings().removeClass('chosen');
            date = $(this).html()
            let datas = {
                movieId: id,
                day: date,
                limit: 20,
                updateShowDay: true,
                cityId: 1
            }
            let result = await positionModel.post('/api/ajax/movie?forceUpdate=1570848448936', datas)
            let cinemas = result.cinemas;
            let htmlfilelist = filmlistView({ cinemas })
            $('.cinema-list .list-wrap').html(htmlfilelist);
            $(this).addClass('chosen').siblings().removeClass('chosen');
        })
        //bg页面的渲染
        let html2 = selectView({})
        $('.bg').html(html2);
        //渲染日期列表
        $('#timeline2').html(str);
        $('#timeline2 li').eq(0).addClass('chosen');

        //点击筛选地址事件
        $('.mb-line-b .item').eq(0).on('tap', async function () {
            $('.mask').css('display','block')
            $('.bg').css('display','block')

            //样式
            let index = $(".mb-line-b .item").index($(this))
            $('.mb-line-b .item').eq(index + 3).addClass('chosenTitle').siblings().removeClass('chosenTitle');
            
            function lonmchoice() {
                //存储
                if ($('#filter-list div').index($(this)) == 0) {

                    let mes = $('#subway div.gray').get(0).innerText;
                    let re = /\（\S+/;
                    mes = mes.replace(re, '');
                    localStorage.setItem('filmlocation', mes);
                }
                else {
                    let mes2 = this.innerText;
                    let re = /\（\S+/;
                    mes2 = mes2.replace(re, '');
                    localStorage.setItem('filmlocation', mes2);
                }
                //移除
                $('.mask').css('display','none')
                $('.bg').css('display','none')
                let lonm = localStorage.getItem('filmlocation');
                $('.mb-line-b .chosenTitle .lonm').html(lonm);
            }

            async function getsubwaymes() {
                let resultsubway = await positionModel.get(`/api/ajax/filterCinemas?movieId=1230121&day=${date}`)
                let subway = resultsubway.subway.subItems
                let html2 = subwayView({ subway })
                $('#subway').html(html2);
                $('#subway div').eq(0).addClass('gray');
                $('#subway div').on('click', function () {
                    $(this).addClass('gray').siblings().removeClass('gray');
                    let index = $("#subway div").index($(this));
                    let subway = resultsubway.subway.subItems[index].subItems;
                    let html2 = subwayView({ subway })
                    $('#filter-list').html(html2);
                    $('#filter-list div').on('click', lonmchoice)
                })
            }
            async function getlocation() {
                let resultsubway = await positionModel.get(`/api/ajax/filterCinemas?movieId=1230121&day=${date}`);
                if(resultsubway.district){
                    let subway = resultsubway.district.subItems
                    let html2 = subwayView({ subway })
                    $('#subway').html(html2);
                    $('#subway div').eq(0).addClass('gray');
                    $('#subway div').on('click', function () {
                        $(this).addClass('gray').siblings().removeClass('gray');
                        let index = $("#subway div").index($(this));
                        let subway = resultsubway.district.subItems[index].subItems;
                        let html2 = subwayView({ subway })
                        $('#filter-list').html(html2);
                        $('#filter-list div').on('click', lonmchoice)
                    })
                }
                
            }

            //初始化
            getsubwaymes();
            //切换日期
            $('#timeline2 li').on('tap', async function () {
                $(this).addClass('chosen').siblings().removeClass('chosen');
                date = $(this).html()
                let datas = {
                    movieId: id,
                    day: date,
                    limit: 20,
                    updateShowDay: true,
                    cityId: 1
                }
                let result = await positionModel.post('/api/ajax/movie?forceUpdate=1570848448936', datas)
                let cinemas = result.cinemas;
                let htmlfilelist = filmlistView({ cinemas })
                $('.cinema-list .list-wrap').html(htmlfilelist);
                $(this).addClass('chosen').siblings().removeClass('chosen');
                if ($('.bg .tab .item').eq(3).hasClass('chosen')) {
                    getlocation();
                }
                if ($('.bg .tab .item').eq(4).hasClass('chosen')) {
                    getsubwaymes();
                }
            })
            //点击商家地铁站
            $('.film-filter-bar .tab li').eq(0).on('tap', async function () {
                $(this).addClass('chosen').siblings().removeClass('chosen');
                $('#filter-list').html('')
                getlocation();
                

            })
            $('.film-filter-bar .tab li').eq(1).on('tap', function () {
                $(this).addClass('chosen').siblings().removeClass('chosen');
                $('#filter-list').html('')
                getsubwaymes();
            })
            //点击mask
            $('.mask').on('click', function () {
                $('.mask').css('display','none')
                $('.bg').css('display','none')
            })
        })
    }
}
export default new Flimmes();