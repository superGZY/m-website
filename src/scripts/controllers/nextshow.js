/* const nextshowView = require('../views/nextshow.art') */
import nextshowView from '../views/nextshow.art'
const positionajax = require('../models/postion')
import nextshowList1 from '../views/nextshowlist1.art'
import nextshowList2 from '../views/nextshowlist2.art'
const BScroll = require('better-scroll')
class Nextshow{
    constructor(){
        /* this.rander(); */
        this.limit=10;
        this.num = 10;
    }
    renderer(list) {
        let list1html = nextshowList1({
          list
        })
        $('.most-expected-list').html(list1html)
    }
    
    async render(){
        //图片路径修正函数
        function urlchange(arr,url){
            for(var i=0; i<arr.length; i++){
            let re=/w.h/;
            arr[i].img=  arr[i].img.replace(re,url);
            }
        }

        let that = this;

        //数据加到main里
        let html = nextshowView({})
        $('main').html(html);
       
        //发送get请求数据
        let result = await positionajax.get('/api/ajax/mostExpected?ci=1&limit=10&offset=0&token=');
        let resultComing = result.coming;

        //图片路径修正
        urlchange(resultComing,'170.230')


        //把list1加入到most-expected-list里
        this.renderer(resultComing);
        //把list2加入到coming-list里
        let result2 = await positionajax.get('/api/ajax/comingList?ci=1&token=&limit=10');
        let list = result2.coming;
        //图片路径修正
        urlchange(list,'128.180')
        let list1html2 = nextshowList2({
            list
          })
        $('.coming-list-list').html(list1html2)

        // bScroll 是BetterScroll实例，将来可以用来调用API
        let bScroll = new BScroll.default($('main').get(0), {
            probeType: 2
        })
        let bScroll2 = new BScroll.default($('.most-expected-list-box').get(0), {
            startX: 0,
            scrollX: true,
            // 忽略竖直方向的滚动
            scrollY: false,
            probeType: 2
            /* eventPassthrough: "vertical" */
        })
        //加载更多
        bScroll.on('scrollEnd',async function(){
            if(this.maxScrollY >= this.y && that.num< result2.movieIds.length){
                $('.foot img').attr('src', '/assets/images/ajax-loader.gif')
                let urlStr = `api/ajax/moreComingList?ci=1&token=&limit=${that.limit}&movieIds=`
                //http://m.maoyan.com/ajax/comingList?ci=254&token=&limit=10   重庆
                for(var i=0; i<that.limit; i++){
                if(i==that.limit-1){
                    urlStr+='2C'+result2.movieIds[10+i];
                }
                else if(i==0){
                    urlStr+=result2.movieIds[that.num+i]+'%';
                }
                else{
                    urlStr+='2C'+result2.movieIds[that.num+i]+'%';
                }
                }
                that.num = that.num +that.limit;
                let newResult2 = await positionajax.get(urlStr);
                urlchange(newResult2.coming,'128.180');

                //数据拼接，重新渲染
                list = [...list, ...newResult2.coming];
                let list1html2 = nextshowList2({
                    list
                  })
                $('.coming-list-list').html(list1html2)
                $('.foot img').attr('src', '/assets/images/arrow.png');
                bScroll.scrollBy(0, 40);
            }
            if(this.y>-70){
                $('.downapp').css({display:'flex'});
            }
        })
        bScroll.on('scroll',function(){
            if(this.y<=-70){
                $('.downapp').css({display:'none'});
              }
            else{
              $('.downapp').css({display:'flex'});
            }
        })
        
    }
}
export default new Nextshow()