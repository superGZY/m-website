import cinemaView from '../views/cinema.art'
import ajaxControll from '../models/postion'
import filmlistView from '../views/filmlist.art'

class Cinema{
    async render(){
        let html = cinemaView({})
        $('#root').html(html);
        let url ='/api//ajax/cinemaList?day=2019-10-13&offset=0&limit=20&districtId=-1&lineId=-1&hallType=-1&brandId=-1&serviceId=-1&areaId=-1&stationId=-1&item=&updateShowDay=true&reqId=1570941670981&cityId=150'
        let result = await ajaxControll.get(url);
        let cinemas = result.cinemas;
        let filmlist = filmlistView({
            cinemas
        })
        $('.list-wrap').html(filmlist);
        $('.min-show-block').css('display','none');
        let hotelHistory = localStorage.getItem('hotelHistory');
        $('.city-entry .city-name').html(hotelHistory);
    }
}
export default new Cinema()