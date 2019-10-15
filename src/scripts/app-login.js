let username = localStorage.getItem('username');
if(!username){
    $('.react-back').attr('href','javascript:history.go(-2)');
}
else{
    $('.react-back').attr('href','javascript:history.go(-1)');
}
$('#btn').on('click',function(){
    if($('#username').val()== localStorage.getItem('resusername')&&$('#password').val()== localStorage.getItem('respassword')){
        localStorage.setItem('username',$('#username').val());
        localStorage.setItem('password',$('#password').val());
        location.href="http://10.9.49.176:8000/#profile"
    }
})