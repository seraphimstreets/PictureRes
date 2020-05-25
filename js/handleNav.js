
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '818166875257314',
      xfbml      : true,
      version    : 'v7.0'
    });
    FB.AppEvents.logPageView();
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));


function buildAvatar(response){
    
    
    
    

    $('.login-links').hide()
    $('.logout-links').css('display','flex')

    $(document).ready(function() {

        im = document.getElementsByClassName("avatarPic")[0]
        console.log(im)

        if (response.avatarPath){
            console.log(response.avatarPath)
            im.src = response.avatarPath
            $('.profileSidebarAvatar').attr('src', response.avatarPath)
        }else{
            
            im.src = "assets\\images\\generic.jpg"
        }
        

       
        $('.profileName').html(response.username)
        
        $('.profileName').html(response.username)

        $("#my-gallery").attr('href', '/home/' + response._id)
        
      
        
    })
    
    
    
  
}



$(document).ready(function(){
    $('form').submit(false);
    $('#signUpForm').attr('autocomplete', 'off');
  

    $('#upload-close').click(() => {
        
        clearFileInput()
    })

   
$('#signUpBtn').attr('href', 'https://' + window.location.host + '/signup')
$('#loginBtn').attr('href', 'https://' + window.location.host + '/login')
   var dpcolor = "#1f1c2e"
   var lcolor = '#d4d4d4'
   var origcolor = '#494368'
   $('.profileCont').attr('data-clicked', false)


    $('.profileCont').click(() => {
        if($('.profileCont').attr('data-clicked') == 'false'){
            $('.profileCont').css({'background':dpcolor , 'color':lcolor})
            $('.profileCont').attr('data-clicked', true)
            $('.profile-navigation').toggle()
        }else{
            $('.profileCont').css({'color':lcolor , 'background':origcolor})
            $('.profileCont').attr('data-clicked', false)
            $('.profile-navigation').toggle()
        }
    })

    $('.profileCont').hover(() => {
        if($('.profileCont').attr('data-clicked') == 'false'){
            $('.profileCont').css({'background':dpcolor })
            $('.fa-angle-down').css({'color':lcolor})
        }
        
    }, () => {
        if($('.profileCont').attr('data-clicked') == 'false'){
        $('.profileCont').css({'background': origcolor})
        $('.fa-angle-down').css({'color':lcolor})
        }
})
   

    $('.uploadImgBtn').click(() => {
        $("#imageUploadModal").show()
        $(".modalOverlay").show()
    })
  

   
    $('.modalOverlay').click(() => {
        $('.mod').hide()
        $('.modalOverlay').hide()
    })
    $(document).on('click','.closeModal', () => {
        $('.mod').hide()
        $('.modalOverlay').hide()
    })
    $('.profileName').html(user.username)
    
    
    $('.okModal').click(() => {
        $('.mod').hide()
        $('.modalover').hide()
      
    })

    $('#logoutBtn').click(() => {
        console.log('https://' + window.location.host)
        fetch('https://' + window.location.host + '/users/logout', {
            method:'GET',
            headers:{
                'Accept':'*/*',
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + localStorage.getItem('token')
            }
        })
        .then(response => {
            if (response.ok) {
                
                return response;
            } else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
            },error => {throw error;})    
        .then(response => response.json())
        .then(response => {
            console.log(response)
            destroyAvatar()
            localStorage.setItem('token', null);
            localStorage.setItem('visitor',null)
            location.reload();
        });
      
    })

    

    

})

function destroyAvatar(){

    $('.login-links').show()
    $('.logout-links').hide()
  
}

function hideNavModal(){
    $("#navModal").hide()
    $(".modalOverlay").hide()
}

function hideSignUpModal(){
    $("#signUpModal").hide()
    $(".modalOverlay").hide()
}

function showNavModal(){
    $("#navModal").hide()
    $(".modalOverlay").hide()
}


    


function attemptJWTLogin(){
    console.log(localStorage.getItem('token'))
    if (localStorage.getItem('token')){
        console.log('Attempting JWT Login')
        fetch('https://' + window.location.host +'/users/checkJWTToken', {
        method:'GET',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            "Authorization":"Bearer " + localStorage.getItem('token')
        },
        
        })
        .then( response => {
            if (response.ok) {
                
                return response;
            } else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                $('#my-gallery').attr('href', '/')
                localStorage.setItem('loginTruth',false);
            }
            },error => {throw error;})    
        .then(response => response.json())
        .then(response => {
            buildAvatar(response.user)
           
            localStorage.setItem('token', response.refresh_token);
            localStorage.setItem('loginTruth', true);
            localStorage.setItem('visitor', response.user._id)
            
        })
        .catch(err => console.log(err))
    }else{
        return
    }
    
}

$('#submitLogin').click(() => {
    var username = $('#username').val()
    var password = $('#password').val()
    var creds = {username:username, password:password};
    
    console.log('Attempting sign in...')
    fetch( '../users/login', {
        method:'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({
            username:username,
            password:password
        })
    })
    .then( response => {
        if (response.ok) {
            
            return response;
        } else {
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
            error.response = response;
            throw error;
        }
        },error => {throw error;})    
    .then(response => response.json())
    .then(response => {
        console.log(response)
        if (response.success) {
            // If login was successful, set the token in local storage
            localStorage.setItem('token', response.token);
            
            window.location.replace('https://' + window.location.host);
            
     

            

        }
        else {
            var error = new Error('Error ' + response.status);
            error.response = response;
            throw error;
        }
    })
    .catch(error => console.log(error))

    

})

function attemptSignUp(username, password){
    console.log('Attempting sign up...')
    fetch('https://' + window.location.host + '/users/signup', {
        method:'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({
            username:username,
            password:password
        })
    })
    .then( response => {
        if (response.ok) {
            
            return response;
        } else {
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
            error.response = response;
            throw error;
        }
        },error => {throw error;})    
    .then(response => response.json())
    .then(response => {
        console.log(response)
        if (response.success) {
            // If login was successful, set the token in local storage
           
            
            hideSignUpModal()
            window.location.href = "/signup/success";
        }
        else {
            var error = new Error('Error ' + response.status);
            error.response = response;
            throw error;
        }
    })
    .catch(error => console.log(error))
}

function handleSignUp(){
    var username = $('#username-sign').val()
    var password = $('#password-sign').val()
    var vpassword = $('#vpassword-sign').val()
    
    if (password != vpassword){
        $('.warning-message').show();
        $('#signUpModal').height(540);
        $('.modal-footer-signup').css('margin-top', '8%');
        return
        
    }else{
        attemptSignUp(username, password)
    }
    
    
   

    

}




