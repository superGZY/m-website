const positionView = require('../views/position.art')
const postionModel = require('../models/postion')
const positionListView= require('../views/positionlist.art')

const BScroll = require('better-scroll')

class Position {
  constructor() {
    this.num = 12;
    this.nextno = 10;
  }

  renderer(list) {
    let positionListHtml = positionListView({
      list
    })
    $('main ul').html(positionListHtml)
  }

  async render(){
    let that = this;

    //图片路径修正函数
    function urlchange(arr){
      for(var i=0; i<arr.length; i++){
        let re=/w.h/;
        arr[i].img=  arr[i].img.replace(re,'128.180');
      }
    }
    let result = await postionModel.get('/api/ajax/movieOnInfoList?token=');
    let newlist = result.movieList;
    //图片路径修正
    urlchange(result.movieList)
    
    let mes = result.movieList;

    //先把positionViwe装填到main里
    let html = positionView({})
    let $main = $('main')
    $main.html(html)

    //再把positionListView装填到ul里
    this.renderer(mes);
    // 定义图片对象
    let $imgHead = $('.head img');
    let $imgFoot = $('.foot img');

    // bScroll 是BetterScroll实例，将来可以用来调用API
    let bScroll = new BScroll.default($main.get(0), {
      probeType: 2
    })

    // 开始要隐藏下拉刷新的div
    bScroll.scrollBy(0, -40);
    console.log(result);
    //下拉刷新
    bScroll.on('scrollEnd',async function(){
      if(this.y >=0){
        $imgHead.attr('src', '/assets/images/ajax-loader.gif');
        let result = await postionModel.get('/api/ajax/movieOnInfoList?token=');
        result = result.movieList[0];
        let re=/w.h/;
        result.img=  result.img.replace(re,'128.180');
        //将原来的数据list和返回的结果组合在一起，重新渲染
        mes.unshift(result);
        that.renderer(mes);

        //复原效果
        bScroll.scrollBy(0, -40)
        $imgHead.attr('src', '/assets/images/arrow.png')
        $imgHead.removeClass('up')
      }
    })

    //上拉加载更多
    bScroll.on('scrollEnd', async function(){
      if(this.maxScrollY >= this.y && that.num< result.total){
        $imgFoot.attr('src', '/assets/images/ajax-loader.gif')
        that.nextno = that.nextno<(result.total - that.num) ? that.nextno: result.total - that.num;
        //拼接get请求的地址
        let urlStr = 'api/ajax/moreComingList?token=&movieIds='
        for(var i=0; i<that.nextno; i++){
          if(i==that.nextno-1){
            urlStr+='2C'+result.movieIds[that.num+i];
          }
          else if(i==0){
            urlStr+=result.movieIds[that.num+i]+'%';
          }
          else{
            urlStr+='2C'+result.movieIds[that.num+i]+'%';
          }
        }
        that.num = that.num +that.nextno;
        let newResult = await postionModel.get(urlStr);
        urlchange(newResult.coming);

        //数据拼接，重新渲染
        newlist = [...newlist, ...newResult.coming];
        that.renderer(newlist);
        bScroll.refresh();
        //复原效果
        bScroll.scrollBy(0, 40);
        $imgFoot.attr('src', '/assets/images/arrow.png');
        $imgFoot.removeClass('down');
      }
      if(that.num>= result.total){
        $('.foot').html('已经到底啦~');
      }
      //点击切换hash
      $('main .list-ul li').on('tap',function(){
        location.hash = 'film'+$(this).attr('data-id');
      })
    })
    
    bScroll.on('scroll', function() {
      //下拉时箭头朝上
      /* console.log(this.y); */
      if (this.y >=0) {
        $imgHead.addClass('up')
      }
      if(this.y<=-114){
        $('.downapp').css({display:'none'});
      }
      else{
        $('.downapp').css({display:'flex'});
      }
      //上拉时箭头朝下
      if(this.maxScrollY >this.y){
        $imgFoot.addClass('down');
      }
    })
    //点击切换hash
    $('main .list-ul li').on('tap',function(){
      location.hash = 'film'+$(this).attr('data-id');
    })

 
  }
}

export default new Position()