
  
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
	        
        
            if(imList != []){
                
            
                buildMain(imList, albumIds, all)
             
                buildAside(imList, albumIds, all)
        
      
          
          
                
            }else{
                console.log('MMMM')

         
            }
            

            
            return
        }
    };
    


    
}

function buildCard(imList, albumIds, all){
    var imgId = all.albumList[ind].images[0]._id
    var nextId = null;
    var albumId = albumIds[ind]
    if(all.albumList[ind].images.length > 1){
       nextId = all.albumList[ind].images[1]._id
    }
    $imDiv = $(document.createElement('div')).addClass('imDivRec imDiv').attr('data-imgId', imgId)
    .attr('data-nextId', nextId).attr('data-albumId', albumId);
            
            
    $link = $(document.createElement('a')).attr('data-imgId', imgId).attr('data-nextId', nextId).attr('data-albumId', albumId)

    $im = $(document.createElement('img')).attr('src', imList[ind]).addClass("im" + ind.toString())
    .attr('data-imgId', imgId).attr('data-nextId', nextId).attr('data-albumId', albumId)

    $cardDiv = $(document.createElement('div')).addClass('cardDiv')
    $bottomCont = $(document.createElement('div')).addClass('bottomCont')
    $title = $(document.createElement('h4')).addClass('cardTitle').html(all.albumList[ind].title)
    $authorCont = $(document.createElement('div')).addClass('authorCont');
    $author = $(document.createElement('p')).addClass('cardAuthor').html(all.albumList[ind].author.username)
    
    
    $link.append($im)
    $imDiv.append($link)

    $bottomCont.append($title)
    $bottomCont.append($author)

    $cardDiv.append($imDiv)
    $cardDiv.append($bottomCont)

    return $cardDiv
}

function buildAside(imList, albumIds, all){
    var exit = false;
    $allDiv = $(document.createElement('div')).addClass('allDiv')
    for(i=0;i<4;i++){

        $rowDiv = $(document.createElement('div')).addClass('rowDiv')
        for(j=0;j<1;j++){
            ind = i*1 + j
            console.log(ind)
            if(ind  >= imList.length){
 
                $allDiv.append($rowDiv)
                $('.allContent').append($allDiv)
        
                break
            }
          
            $cardDiv = buildCard(imList, albumIds, all)
            


      
            

          
            $rowDiv.append($cardDiv)
            
            
        }
        $allDiv.append($rowDiv)
    
    }

    $('.asideCont').append($allDiv)
}

function buildMain(imList, albumIds, all){
    var exit = false;
    console.log(all)
    $allDiv = $(document.createElement('div')).addClass('allDiv')
    for(i=0;i<4;i++){
        if(exit){
            break
        }
        $rowDiv = $(document.createElement('div')).addClass('rowDiv')
 
        for(j=0;j<3;j++){
            ind = i*3 + j
            console.log(ind)
            if(ind  >= imList.length){
                $allDiv.append($rowDiv);
                $('.allContent').append($allDiv)
                exit = true;
                break
            }
          
            
            
            $cardDiv = buildCard(imList, albumIds, all)

      
            

          
            $rowDiv.append($cardDiv)
            
            
        }
        $allDiv.append($rowDiv)
    
    }

    $('.mainCont').append($allDiv)

}
function buildCarousel(imList, albumIds, all){
    
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
    
        
    
        $title= $(document.createElement('h2')).addClass('cardTitle').html(all.albumList[ind].title)
        $description= $(document.createElement('p')).addClass('cardDescription').html(all.albumList[ind].description)
        $author = $(document.createElement('p')).addClass('cardAuthor').html(all.albumList[ind].author.username)
        
        $authorCont = $(document.createElement('div')).addClass('authorCont')
        $avatarCont =  $(document.createElement('span')).addClass('avatarContainer');
        $avatarImage = $(document.createElement('img')).attr('src', all.albumList[ind].author.avatarPath)
        
    
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
    

