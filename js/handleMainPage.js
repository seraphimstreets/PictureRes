window.onscroll= () => {scrollUpBtn()}

function scrollUpBtn(){
    
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20){
        $('.riseBtn').css('background-color', 'rgba(0,0,0,0.16)')
    }else{
        $('.riseBtn').css('background-color', 'rgba(0,0,0,0.08)')
    }
}

$(document).ready(() => {
    $('.riseBtn').click(() => {
        if  (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            $('html, body').animate({scrollTop: '0'}, 500);
        }
    })
})
   
