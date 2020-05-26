$(document).ready( () => {
   
    if(user._id.toString() == localStorage.getItem('visitor')){
        $('.followBtn').hide()
    }
    getVisitorInfo()
    console.log(user)
    $('.profileUsername').html(user.username)
    getUserAlbumsFromServer(user._id)

    $('.deleteBtn').click(() => {
        deleteAlbums()
    })

    $('.followBtn').click((e) => {
       
        if (localStorage.getItem("token")){
            if ($(e.target).attr('data-following') == "true"){
                var met = 'DELETE'
            }else{
                var met = 'PUT'
            }
            fetch("https://" + window.location.host + "/followers/" + $(e.target).attr("data-author"), {
                method:met,
                headers:{
                    'Accept':'*/*',
                    'Content-Type':"application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            })
            .then(response => {
                if(response.ok){
                    return response
                }else{
                    var error = new Error("Error " + response.status + ":" + response.statusText)
                    error.response = response;
                    throw error
                }
            })
            .then(response => response.json())
            .then(response => {
                if (response.success){
                   
                    changeFollowBtn(response.following)
               
                }
            })
        }else{
            console.log("Sign up to follow users!")
        }
        
    })

})

function changeFollowBtn(following){
    if(following){
        $(".followBtn span").html('Following')
        $(".followBtn span").css('background-color', "gray")
        $(".followBtn span, .followBtn").attr('data-following', true)
    }else{
        $(".followBtn span").html('Follow')
        $(".followBtn span").css('background-color', "rgb(0, 150, 250)")
        $(".followBtn span, .followBtn").attr('data-following', false)
    }


    
}

function isInArray(arr, item){
    if (arr.length == 0) return false
    for (i=0;i<arr.length;i++){
        if (arr[i] === item){
            return true
        }
    }

    return false
}


function getVisitorInfo(){
    fetch("https://" + window.location.host + "/users/userInfo/" +  localStorage.getItem('visitor'), {
        method:'GET',
        headers:{
            'Accept':'application/json, text/plain, */*',
            'Content-Type':'application/json'
        }
    })
    .then(response  => {
        if (response.ok) {
            
            return response;
        } else {
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
            error.response = response;
         
            localStorage.setItem('loginTruth',false);
        }
        },error => {throw error;})    
    .then(response => response.json())
    .then(response => {
        globalVisitor = response.user
        console.log(globalVisitor)
        console.log(user.followers.includes(globalVisitor._id))
        if (user.followers.includes(globalVisitor._id) ){
            console.log("???")
            $('.followBtn, .followBtn span').attr('data-following', true)
            changeFollowBtn(true)
        }
    

       
      
    })
}

function getUserAlbumsFromServer(userId){
    
    fetch('https://' + window.location.host +'/albums/useralbum/' + userId, {
        method:'GET',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
          
        }
    })
    .then( response => {
        if (response.ok) {
            
            return response;
        } else {
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
            error.response = response;
         
            localStorage.setItem('loginTruth',false);
        }
        },error => {throw error;})    
    .then(response => response.json())
    .then(response => {
     
      
        $('#userpagePic').attr('src', user.avatarPath)
        $(".followBtn, .followBtn span").attr('data-author', user._id)
        $('.albumCount').html(user.albums.length.toString() + ' albums')

        var all = response
           
        
        var ind;
    
        var imList = []
        var albumIds = []
        for(i=0;i<all.albumList.length;i++){
            imList.push(all.albumList[i].images[0].filename);
            albumIds.push(all.albumList[i]._id)
        }
        console.log(imList)


        $allDiv = $(document.createElement('div')).addClass('allDiv')
        for(i=0;i<4;i++){
            $rowDiv = $(document.createElement('div')).addClass('rowDiv')
            for(j=0;j<6;j++){
                ind = i*6 + j
                console.log(ind)
                if(ind  >= imList.length){
                    $allDiv.append($rowDiv)
                    $('.userGallery').append($allDiv)
            
                    return
                }
            
                $imDiv = $(document.createElement('div')).addClass('imDivRec imDiv');
                
                
                $link = $(document.createElement('a')).attr('href', '/albums/' + albumIds[ind] + '/?origPage=' + encodeURIComponent(window.location.href))

                $im = $(document.createElement('img')).attr('src', imList[ind]).addClass("im" + ind.toString())
                $cardDiv = $(document.createElement('div')).addClass('userCardDiv')
                $bottomCont = $(document.createElement('div')).addClass('bottomCont')
                $title = $(document.createElement('h4')).addClass('cardTitle').html(all.albumList[ind].title)
                $authorCont = $(document.createElement('div')).addClass('authorCont');
                $author = $(document.createElement('p')).addClass('cardAuthor').html(all.albumList[ind].author.username)

                
                
                
            
                $link.append($im)
                $imDiv.append($link)
                if(user._id.toString() == localStorage.getItem('visitor')){
                    $checkbox = $(document.createElement('input')).addClass('checkbox').attr('type', 'checkbox').attr('data-id',albumIds[ind])
                    $cardDiv.append($checkbox)
                    $('.deleteBtn').css('display', 'inline-block')
                }
                $cardDiv.append($imDiv)
                
               

               

                
                //$cardDiv.append($bottomCont)
                


        
                

            
                $rowDiv.append($cardDiv)
                
                
            }
            $allDiv.append($rowDiv)
        
        }

        $('.userGallery').append($allDiv)
        


    })
    

}

function deleteAlbums(){
    var $checkedAlbums = $('.checkbox:checked')  
    console.log($checkedAlbums)
    var deleteIds = []  
    var item;
    for(var i=0;i<$checkedAlbums.length;i++){
        item = $checkedAlbums[i]
        deleteIds.push($(item).attr('data-id'))
    }

    console.log(deleteIds)

    fetch('../albums/', {
        method:'DELETE',
        headers:{
            'Accept': '*/*',
            
            'Content-Type': 'application/json',
            "Authorization":"Bearer " + localStorage.getItem('token')
        },
        body:JSON.stringify({ids:deleteIds})
    })
    .then(response => {
        if (response.ok){
            return response
        }else{
            var err = new Error('Error ' + response.status +  ': ' + response.statusText)
            err.response = response;
            throw err
        }
    })
    .then(response =>  response.json())
    .then(response => {
        $('#success-header').html("Success")
        $('#success-message').html("The albums were deleted successfully")
        $('#successModal').show()
        $('.modalOverlay').show()


    })
}