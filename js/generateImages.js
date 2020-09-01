var latestAlbumList;

 function getImagesFromServer(index){

    console.log( 'https://' + window.location.host + '/albums/?latest=1')

    xmlhttp = new XMLHttpRequest()
    if (index == 'latest'){
        xmlhttp.open("GET", 'https://' + window.location.host + '/albums/?latest=1', true);
    }else{
        xmlhttp.open("GET", 'https://' +  window.location.host + '/albums/?page=' + index, true);
    }
        
    xmlhttp.send();
    xmlhttp.onreadystatechange = function() {
       
        if (this.readyState==4 && this.status == 200) {
          
            var all = JSON.parse(this.responseText);
           
            var count = all.count;
            var ind;
        
            var imList = []
            var albumIds = []
            for(i=0;i<all.albumList.length;i++){
                imList.push(all.albumList[i].images[0].filename);
                albumIds.push(all.albumList[i]._id)
            }
            console.log(imList)
	        latestAlbumList = all.albumList
        
            if(imList != []){
                
            
                buildNewest(imList, albumIds, latestAlbumList)
                buildRecommended(imList, albumIds, latestAlbumList)
                buildCarousel(imList.slice(0,8), albumIds.slice(0,8), latestAlbumList)
                
                if(localStorage.getItem('loginTruth') == 'true'){
                    $('.following').show()
                    fetch('https://' + window.location.host + '/albums/following/', {
                        method:"GET",
                        headers:{
                        
                            "Authorization":"Bearer " + localStorage.getItem('token')
                        },
                    })
                    .then( response => {
                        console.log(response)
                        if (response.status == 200) {
                            
                    
                            return response;
                            
                    }else if(response.status == 401){
                        
                            var error = new Error('Error ' + response.status + ': ' + response.statusText);
                            throw error;
                
                    }else {
                
                            var error = new Error('Error ' + response.status + ': ' + response.statusText);
                            throw error;
                        }
                    })    
                    .then(response => response.json())
                    .then(response => {
                        console.log(response)
                        followingAlbumList = response.albumList
                        var cack =  12 - followingAlbumList.length
                        if (followingAlbumList.length < 12){
                            for(i=0;i<cack;i++){
                                console.log(i)
                                followingAlbumList.push(latestAlbumList[i])
                            }
                        }
                
                        var imList = []
                        var albumIds = []
                        for(i=0;i<followingAlbumList.length;i++){
                            imList.push(followingAlbumList[i].images[0].filename);
                            albumIds.push(followingAlbumList[i]._id)
                        }

                        buildFollowing(imList, albumIds, followingAlbumList)
                        
                        
                    })
        
                }else{
                    $('.following').hide()
                }
                console.log('WHYY')
                setEventListenersOthers()
                
          
                
            }else{
                console.log('MMMM')

         
            }
            

            
            
        }
    };
    


    
}

function buildCard(imList, albumIds, albumList, ind, category){
    console.log(albumList)
    var imgId = albumList[ind].images[0]._id
    var nextId = null;
    var albumId = albumIds[ind]
    if(albumList[ind].images.length > 1){
       nextId = albumList[ind].images[1]._id
    }
    $imDiv = $(document.createElement('div')).addClass('imDivRec imDiv')
            
    $link = $(document.createElement('a')).attr('data-imgId', imgId)
    .attr('href', "https://" + window.location.host + "/albums/" + albumId + "?origPage=" + encodeURIComponent(window.location.href));

    $im = $(document.createElement('img')).attr('src', imList[ind]).addClass("im" + ind.toString())
  
    $carouselDiv = $(document.createElement('div')).addClass('carousel-main ' + category).attr('id', 'carousel-main-' + category + ind)
    $cardDiv = $(document.createElement('div')).addClass('cardDiv')
    $bottomCont = $(document.createElement('div')).addClass('bottomCont')
    $title = $(document.createElement('h4')).addClass('cardTitle').html(albumList[ind].title)
    $authorCont = $(document.createElement('div')).addClass('authorCont');
    $authorAvatarCont = $(document.createElement('div')).addClass('authorAvatarCont')
    $authorAvatar = $(document.createElement('img')).addClass('authorAvatar').attr('src', albumList[ind].author.avatarPath)
    $author = $(document.createElement('p')).addClass('cardAuthor').html(albumList[ind].author.username)
    
    $authorAvatarCont.append($authorAvatar)
    $authorCont.append($authorAvatarCont)
    $authorCont.append($author)

    $link.append($im)
    $imDiv.append($link)

    $bottomCont.append($title)
    $bottomCont.append($authorCont)

    $cardDiv.append($imDiv)
    $cardDiv.append($bottomCont)
    $carouselDiv.append($cardDiv)

    return $carouselDiv
}


function buildNewest(imList, albumIds, albumList){
    var exit = false;

    $allDiv = $(document.createElement('div')).addClass('allDiv')
    
    $newestCarousel = $('#newestCarousel');
    
    //$recommendedCarousel = $('#recommendedCarousel');
    //$newestCarousel = $('#newestCarousel');
    for(i=0;i<12;i++){
    
        $cardDiv = buildCard(imList, albumIds, albumList, i, "newest")
        $allDiv.append($cardDiv)

       

    
    }

   
    
    
    $newestCarousel.append($allDiv)
    

    
    //$recommendedCarousel.append($('#followingCarousel .allDiv').clone())
    //$newestCarousel.append($('#followingCarousel .allDiv').clone())
    initMainCarousels("newest")
    

}

function buildRecommended(imList, albumIds, albumList){
    $allDiv2 = $(document.createElement('div')).addClass('allDiv')
    $recommendedCarousel = $('#recommendedCarousel')
    for(i=0;i<12;i++){
        $cardDiv2 = buildCard(imList, albumIds, albumList, i, "recommended")
        $allDiv2.append($cardDiv2)
    }
    $recommendedCarousel.append($allDiv2)
    initMainCarousels("recommended")
    
}

function buildFollowing(imList, albumIds, all, index){
    var exit = false;
    console.log(all)
    $allDiv = $(document.createElement('div')).addClass('allDiv')
    $followingCarousel = $('#followingCarousel');
    //$recommendedCarousel = $('#recommendedCarousel');
    //$newestCarousel = $('#newestCarousel');

    for(i=0;i<12;i++){
        $cardDiv = buildCard(imList, albumIds, all, i, "following")
        $allDiv.append($cardDiv)
    
    }

   
    
    
    $followingCarousel.append($allDiv)

    
    //$recommendedCarousel.append($('#followingCarousel .allDiv').clone())
    //$newestCarousel.append($('#followingCarousel .allDiv').clone())
    initMainCarousels("following")

}



function buildCarousel(imList, albumIds, albumList){
    
    for(i=0;i<8;i++){
                    	
         
        ind = i
        if(ind  >= imList.length){
                                    
            break
        }

        console.log(ind)

        $carouselItem = $(document.createElement('div')).addClass('carousel__item');
        $darkOverlay = $(document.createElement('div')).addClass('imOverlay');
        $imDivCont = $(document.createElement('div')).addClass('imDivCont');
        $imDiv = $(document.createElement('div')).addClass('imDiv');
        if (i==0){
            $carouselItem.addClass(' initial')
        }
        
        $link = $(document.createElement('a')).attr('href', '/albums/' + albumIds[ind])

        $im = $(document.createElement('img')).attr('src', imList[ind]).addClass("im" + ind.toString())
    
        
    
        $title= $(document.createElement('h2')).addClass('cardTitle').html(albumList[ind].title)
        $description= $(document.createElement('p')).addClass('cardDescription').html(albumList[ind].description)
        $author = $(document.createElement('p')).addClass('cardAuthor').html(albumList[ind].author.username)
        
        $authorCont = $(document.createElement('div')).addClass('authorCont')
        $avatarCont =  $(document.createElement('span')).addClass('avatarContainer');
        $avatarImage = $(document.createElement('img')).attr('src', albumList[ind].author.avatarPath)
        
    
        $viewAlbumBtn = $(document.createElement('a')).addClass('fancy-button pop-onhover bg-gradient4').attr('href', '/albums/' + albumIds[ind])

        $btnText = $(document.createElement('span')).html("View")
        $viewAlbumBtn.append($btnText)
    

        $avatarCont.append($avatarImage)
        $authorCont.append($avatarCont)
        $authorCont.append($author);

        $link.append($im)
        $imDiv.append($link)
        $imDivCont.append($imDiv)
        
        $carouselItem.append($imDivCont)
        $carouselItem.append($title)
        $carouselItem.append($author)
        $carouselItem.append($viewAlbumBtn)
        $imDivCont.append($darkOverlay)
        

    
    
        
        $('.carousel').append($carouselItem)

        
            
    }

    initCarousel()

}




var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};

window.onload = () => {
    var ind = getUrlParameter('latest');
    var page = getUrlParameter('page');
    if (ind){
        getImagesFromServer("latest")
    }else if (page){
        getImagesFromServer(page)
    }else{
        getImagesFromServer("latest")
    }


    
}

function initMainCarousels(category){
   

    for(i=0;i<4;i++){
        $('#carousel-main-' + category + i.toString()).addClass("carousel-main-active")
    }
    for(i=4;i<8;i++){
        
        $('#carousel-main-' + category + i.toString()).addClass("carousel-main-nextgroup")
    }
    
    $('.carousel-main-' + category + '--prev').hide()
}

function setEventListenersOthers() {
    var nextFollowing = document.getElementsByClassName('carousel-main-following--next')[0],
        prevFollowing = document.getElementsByClassName('carousel-main-following--prev')[0],
        nextNewest = document.getElementsByClassName('carousel-main-newest--next')[0],
        prevNewest = document.getElementsByClassName('carousel-main-newest--prev')[0];
        nextRecommended = document.getElementsByClassName('carousel-main-recommended--next')[0],
        prevRecommended = document.getElementsByClassName('carousel-main-recommended--prev')[0];

    console.log('???')

    nextFollowing.addEventListener('click', () => {
        moveNext("following")
    });
    prevFollowing.addEventListener('click', () => {
        movePrev("following")
    });
    nextNewest.addEventListener('click', () => {
        moveNext("newest")
    });
    prevNewest.addEventListener('click', () => {
        movePrev("newest")
    });
    nextRecommended.addEventListener('click', () => {
        moveNext("recommended")
    });
    prevRecommended.addEventListener('click', () => {
        movePrev("recommended")
    });
  }

$(document).ready(() => {
   
    
})


function moveNext(category){
    console.log('BHERE')
    $('.carousel-main-' + category + '--prev').show()
    $('.carousel-main-' +  category + '--next').show()
    var nextnext = $('.carousel-main-nextgroup.' + category)[0]
    $(".carousel-main-prevgroup." + category).removeClass('carousel-main-prevgroup')
    $(".carousel-main-active." + category).removeClass("carousel-main-active").addClass('carousel-main-prevgroup')
    
    $('.carousel-main-nextgroup.' + category).removeClass('carousel-main-nextgroup').addClass('carousel-main-active')
    
    
    
    
    nextnextvalue = parseInt($(nextnext).attr('id').substr(-1)) + 4
    console.log(nextnextvalue)
    if($('#carousel-main-' + category + nextnextvalue.toString()).length != 0){
        for(i=nextnextvalue;i<nextnextvalue+4;i++){
            $('#carousel-main-' + category + i.toString()).addClass("carousel-main-nextgroup")
        }
    }else{
        $('.carousel-main-' + category + '--next').hide()
    }
}

function movePrev(category){
    $('.carousel-main-' + category + '--prev').show()
    $('.carousel-main-'  + category + '--next').show()
    var prevprev = $('.carousel-main-prevgroup.'  + category )[0]
    $(".carousel-main-nextgroup."  + category ).removeClass('carousel-main-nextgroup')
    $('.carousel-main-active.'  + category ).removeClass('carousel-main-active').addClass('carousel-main-nextgroup')
    $('.carousel-main-prevgroup.'  + category).removeClass('carousel-main-prevgroup').addClass('carousel-main-active')
    
    
    prevprevvalue = parseInt($(prevprev).attr('id').substr(-1)) - 4
    if($('#carousel-main-'  + category  + prevprevvalue.toString()).length != 0){
        for(i=prevprevvalue;i<prevprevvalue+4;i++){
            $('#carousel-main-'  + category + i.toString()).addClass("carousel-main-prevgroup")
        }
    }else{
        $('.carousel-main-' +  category +'--prev').hide()
    }
}


