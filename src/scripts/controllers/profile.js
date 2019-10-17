import profileView from '../views/profile.art'

class Profile{
    render(){
        let username = localStorage.getItem('username');
        if(!username){
            console.log(12);
            window.location.href = 'http://10.9.49.176:8000/app-login.html'
        }
        let html = profileView({})
        $('#root').html(html)
        $('.header .name').html(localStorage.getItem('username'))
    }
}
export default new Profile()