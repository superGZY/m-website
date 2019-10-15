$('#btn').on('click',function(){
    localStorage.setItem('resusername',$('#username').val());
    localStorage.setItem('respassword',$('#password').val());
    window.history.go(-1)
})