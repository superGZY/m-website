const layoutView = require('../views/layout.art')

class Index {
  constructor() {
    this.render()
  }

  render() {
    const html = layoutView()
    $('#root').html(html)
    
    //城市选择
    var hotelHistory = localStorage.getItem('hotelHistory') || '北京';
    $('.topbar .city-name').html(hotelHistory);
    //点击切换路由
    $('.topbar .city-entry').on('tap', function(){
      localStorage.setItem('history',location.hash)
      location.hash = 'citychoose'
    }) 
  }
}

export default new Index()