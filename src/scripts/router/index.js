import indexController from "../controllers/index"
import positionController from "../controllers/positions"
import nextshowController from "../controllers/nextshow"
import filmController from "../controllers/film"
import IndecController from "../controllers/index"
import citychooseController from "../controllers/choosecity"
import cinemaController from "../controllers/cinema"
import profileController from "../controllers/profile"

class Router{
    constructor (){
        this.render()
    }
    //渲染DOM函数
    renderDom(hash){
        let re = /\d+/g;
        hash = hash.replace(re,'');
        let pagecontroller = {
            positionController,
            nextshowController,
            filmController,
            citychooseController,
            cinemaController,
            profileController
        }
        pagecontroller[hash + 'Controller'].render()
    }
    //设置高亮函数
    setAcitve(hash){
        $(`a[href="#${hash}"]`).addClass('active').siblings().removeClass('active');
    }
    render(){
        window.addEventListener('hashchange',()=>{
            IndecController.render();
            /* this.hash[location.hash.substring(1)+'Controller'].render(); */
            let hash = location.hash.substr(1)
            //渲染DOM
            this.renderDom(hash);
            this.setAcitve(hash);
        })
        window.addEventListener('load', ()=>{
            let hash = location.hash.substr(1) || 'position'
            indexController.render()
            location.hash = hash

            // 初始化的时候也需要渲染DOM和设置高亮
            this.renderDom(hash);
            this.setAcitve(hash);

        })   
    }
}
export default new Router()