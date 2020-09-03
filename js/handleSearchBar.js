$(document).ready(() => {
    $('.search-bar-icon').click(() => {
        term = $('.search-bar').val()
        
        if (!term){
            term = "e"
        }
        
        window.location.replace("https://" + window.location.host + "/search/?term=" + term + "&count=0")
    })
})