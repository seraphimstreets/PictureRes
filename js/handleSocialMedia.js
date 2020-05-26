




function initMiscellaneousHandlers(imgId, nextId, prevId, albumId, origPage){

    var likeEnabled= true;
    //handle submitting likes for image
    $('.likeBtn').click((e) => {
        if(likeEnabled){
            likeEnabled = false
            handleLike()
            likeEnabled = true;

        }
        
      
     })
 
     //handle submitting comments for image
     $(".inputComment").on('keypress', (e) => {
         submitComment(e, imgId)
      })
 
 
      //likes for comments
      $(document).on('click', '.comment-like', (e)=> {
         updateCommentLike(e)
      })
     
     
      //create new subcomment box and fetch existing subcomments
     $(document).on('click', '.comment-reply', (e) => {
     
         var comId = e.target.getAttribute('data-id')
         fetchCommentReplies(e, true, imgId)
         
     })
 
     //fetch existing subcomments
     $(document).on('click', '.repliesIndicatorCont', (e) => {
         fetchCommentReplies(e, false, imgId)
        
     })
 
     //submit subcomment
     $(document).on('keypress', ".inputSubcomment", (e) => {
         submitSubcomment(e, imgId)
     })
    
      
 
     //calculate time since comments were rendered/submitted and updates time dynamically 
      setInterval(() => {
         timestamps = document.getElementsByClassName('comment-ts')
         
         if (timestamps != []){
            for  (i=0;i<timestamps.length;i++){
                 var timestarter = parseInt(timestamps[i].getAttribute('data-time')) 
                 if  (timestarter !== null){
                     timestamps[i].innerHTML = getTimeString(timestarter + 1)
                     timestamps[i].setAttribute('data-time', timestarter + 1)
                 }
            }
                 
            
         }
      },1000)
 
     
      
     //focusing comment box 
     $('.commentBtn').click(() => {
         $('.inputComment').focus()
     })
 
     //resizing all comment boxes
     $('.inputComment').autoResize()

    //handle zoomins and left/right
    if(nextId > -1){
  
        var $rightArrowContainer =  $(document.createElement('a')).addClass('rightArrowContainer arrowCont')
        .attr('href', 'https://' + window.location.host + "/albums/"+albumId+"/?page=" + nextId + "&origPage=" + encodeURIComponent(origPage))
        var $rightButton = $(document.createElement('span')).addClass('fa fa-angle-right fa-5x rightBtn')
        $rightArrowContainer.append($rightButton)
        $('.imgLeftHolder').append($rightArrowContainer)
    }

    if(prevId > -1){
      
        var $leftArrowContainer =  $(document.createElement('a')).addClass('leftArrowContainer arrowCont')
        .attr('href', 'https://' + window.location.host + "/albums/"+albumId+"/?page=" + prevId + "&origPage=" + encodeURIComponent(origPage))
        var $leftButton = $(document.createElement('span')).addClass('fa fa-angle-left fa-5x leftBtn')
       
        $leftArrowContainer.append($leftButton)
        $('.imgLeftHolder').append($leftArrowContainer)
    }

    var $zoomContainer =  $(document.createElement('span')).addClass('fa fa-expand zoomContainer fa-2x')
    $('.imgLeftHolder').append($zoomContainer)

    $('.zoomContainer').click(() => {
      
      
   
       $('.zoomedImageCont').css('display','flex')
       $('.modalOverlay2').css('display','flex')
    })

    $('.zoomedImage, .zoomedImageCross').click(() => {
       
        $('.zoomedImageCont').hide()
       $('.modalOverlay2').hide()
    })

    $('.modalOverlay2').click(() => {
       
        $('.zoomedImageCont').hide()
       $('.modalOverlay2').hide()
    })



    $('.imgLeftHolder').hover(() => {
        $('.arrowCont').css('display','flex')
    }, () => {
        $('.arrowCont').hide()
    })

    $('.arrowCont').hover(() => {
        $('.arrowCont').css('color','rgba(248,248,248,0.7)')
    }, () => {
        $('.arrowCont').css('color','rgba(248,248,248,0.55)')
    })

    $('.zoomContainer').hover(() => {
        $('.zoomContainer').css('color','rgba(248,248,248,0.7)')
    }, () => {
        $('.zoomContainer').css('color','rgba(248,248,248,0.55)')
    })

    $('.zoomedImageCross').hover(() => {
        $('.zoomedImageCross').css('color','rgba(248,248,248,0.7)')
    }, () => {
        $('.zoomedImageCross').css('color','rgba(248,248,248,0.55)')
    })

    $(".backBtn, .backBtnCont").click(() => {
        window.location.replace(origPage)
    })
}
/* Miscellaneous functions */

function  colorLikeBar(liked){
   
   
   
    if(liked){
        $('.likeBtn').addClass('statusLiked')
        
    }else{
        $('.likeBtn').removeClass('statusLiked')
    }
}



function nonUserHandler(){
   console.log('HERE')
    uavs =  document.getElementsByClassName("userAvatar")
    
    for(i=0;i<uavs.length;i++){
        

        uavs[i].src = "assets\\images\\generic.jpg"
        
        
    }

    $('.inputComment').attr('placeholder', "Log in to post a comment!")
    $('.descriptionRight').attr('data-loggedin', false)
    
}


function checkId(list, id){
    console.log(list)
    if(list == []){
	return true
    }
    for(var i=0;i<list.length;i++){
        if (list[i] == id) return false
    }
    
    return true
    
   
}

function getTimeString(elapsed){
    if (elapsed < 60){
        return elapsed.toString() +  's'
    }else if (elapsed < 3600){
        return Math.floor(elapsed/60) +  'm'
    }else if (elapsed < 86400){
        return Math.floor(elapsed/3600) +  'h'
    }else if (elapsed < 31536000){
        return Math.floor(elapsed/86400) +  'd'
    }else{
        return Math.floor(elapsed/31536000) + 'y'
    }
}



/* PUT/POST requests */

function handleLike(){
    var loggedin  = $('.descriptionRight').attr('data-loggedin')
    console.log(loggedin)
    if (loggedin == 'false'){
        window.location.replace(window.location.href)
        return
    }
    var imId =  $('.likeBtn').attr('data-imId');
    var liked =  $('.likeBtn').attr('data-liked');

    var suffix;
    
  
    if (liked === 'true'){
        suffix = '/unlike'
        
    }else{
        suffix = '/like'
    }

    
    fetch("https://" + window.location.host + "/images/" + imId + suffix, {
        method:'PUT',
        headers:{
            'Accept': 'application/json, text/plain, */*',
            'Content-Type':'application/json',
            "Authorization":'Bearer ' + localStorage.getItem('token')
        },
        
    })
    .then(response => {
        if (response.ok) {
            
            
            return response;
        } else {
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
            error.response = response;
            
            throw error;
        }
        },error => {throw error;}
    )    
    .then(response => response.json())
    .then(response => {
        $('.likeBtn').attr('data-liked', response.liked)
        if(response.liked){
            $('.likeBtn').attr('data-likecount', parseInt($('.likeBtn').attr('data-likecount')) + 1)
        }else{
            $('.likeBtn').attr('data-likecount', parseInt($('.likeBtn').attr('data-likecount')) - 1)
        }
        colorLikeBar(response.liked)
        
        updateImgCount(response.liked)
    })
}

function submitComment(e, imgId){
    var key = e.keyCode;
    var loggedin  = $('.descriptionRight').attr('data-loggedin')
    if (key == 13 ){
        var commentBody = e.target.value;
        if (loggedin == 'false'){
            window.location.replace('https://' + window.location.host)
            return
        }
        if(commentBody.length > 0){
            fetch('https://' + window.location.host + '/images/' + imgId + '/comments', {
            method:'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                "Authorization":"Bearer " + localStorage.getItem('token')
            },
            body:JSON.stringify({commentBody: commentBody})
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
                e.target.value = ""
                e.target.blur()
                $('.descriptionRight').attr('data-commentcount',parseInt($('.descriptionRight').attr('data-commentcount')) + 1 )
                updateImgCount()
                fetchComments(imgId)
            })
        }
    }
}

function submitSubcomment(e, imgId){
    var key = e.keyCode;
    var loggedin  = $('.descriptionRight').attr('data-loggedin')
    if (key == 13 ){
        var commentBody = e.target.value;
        if (loggedin == 'false'){
            window.location.replace('https://' + window.location.host)
            return
        }
        if(commentBody.length > 0){
            fetch('https://' + window.location.host + '/images/' + imgId + '/' + e.target.getAttribute('data-parent') + '/subcomment', {
            method:'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                "Authorization":"Bearer " + localStorage.getItem('token')
            },
            body:JSON.stringify({commentBody: commentBody})
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
                var comId = e.target.getAttribute('data-parent')
                $('.' + comId + '.higherSCCont' ).css('display','none')
                var $higherCTACont = $('.commentCTACont.' + comId)
                $higherCTACont.attr('data-scer', false)
                buildSubcomments(response.subcomments, comId, imgId)
            })
        }
    }
}

function updateCommentLike(e){
    
    var loggedin  = $('.descriptionRight').attr('data-loggedin')
    console.log(loggedin)
    if (loggedin == 'false'){
        window.location.replace('https://' + window.location.host)
        return
    }
    var imId = imgId
    var comId = e.target.getAttribute('data-id');
    var liked =   e.target.getAttribute('data-liked');

    var suffix;
    
    
    if (liked === 'true'){
        suffix = '/unlike'
        
    }else{
        suffix = '/like'
    }

    
    fetch('https://' + window.location.host + "/images/" + imId + '/' + comId + suffix, {
        method:'PUT',
        headers:{
            'Accept': 'application/json, text/plain, */*',
            'Content-Type':'application/json',
            "Authorization":'Bearer ' + localStorage.getItem('token')
        },
        
    })
    .then(response => {
        if (response.ok) {
            
            
            return response;
        } else {
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
            error.response = response;
            
            throw error;
        }
        },error => {throw error;}
    )    
    .then(response => response.json())
    .then(response => {
        e.target.setAttribute('data-liked', response.liked)
        var newcount;
        if (response.liked){
            newcount = parseInt(e.target.getAttribute('data-likecount')) + 1
            e.target.setAttribute('data-likecount',newcount)
            $(e.target).addClass('comment-liked')
        }else{
            newcount = parseInt(e.target.getAttribute('data-likecount')) - 1
            e.target.setAttribute('data-likecount', newcount)
            $(e.target).removeClass('comment-liked')
        }

        if(newcount > 0){
            var truth = $(e.target).attr('data-showlikecount')
            console.log(truth)
            if (truth == 'false'){
                var $dotSeparator0 = $(document.createElement('span')).addClass("comment-cta-item sep-0 "  + comId).html("·")
                var $commentLikecount = $(document.createElement('span')).addClass("comment-cta-item comment-likecount " + comId).html(newcount)
                
                $(e.target).after($commentLikecount)
                $(e.target).after($dotSeparator0)
                $(e.target).attr('data-showlikecount', true)
            }else{
                $('.comment-likecount.' + comId).html(newcount)
               
            }
            
        }else{
            $('.comment-likecount.'+ comId).remove()
            $('.sep-0.'+ comId).remove()
            $(e.target).attr('data-showlikecount', false)
        }
        
       
        
        
    })
}


/*Builders*/

function buildSkeleton(fileId){
    $skeleton = $('#imgDisplayModal').clone().attr('id', "skeleton-" + fileId)
    $(document.body).append($skeleton)
}

function buildImage(filename){
    $('.imgLeftHolder').css('background-image', 'url(' + filename + ')' )
    $('.zoomedImage').attr('src', filename)
}

function buildComments(comments, imgId){
    $('.imgCommentsSpace').empty()
    

    if(comments != []){
        comments.forEach(comment => {
           
            var created = new Date(comment.createdAt)
            console.log(Date.now())
            var elapsed = Date.now() - created.getTime() 
            elapsed = Math.round(elapsed/1000)
            
            newElapsed = getTimeString(elapsed)
            

            var $higherCommentCont = $(document.createElement('div')).addClass("higherCommentCont")
            var $newCommentCont = $(document.createElement('div')).addClass("newCommentCont")
            var $avatarCont = $(document.createElement('div')).addClass("avatarCont")
            var $commentAvatar = $(document.createElement('img')).addClass("commentAvatar").attr('src', comment.author.avatarPath)
            var $bodyCont =  $(document.createElement('div')).addClass("bodyCont")
            var $bodyComment = $(document.createElement('span')).addClass("bodyComment").html(comment.content)
            var $usernameCom =  $(document.createElement('span')).addClass("usernameCom").html(comment.author.username)
            var $commentCTACont = $(document.createElement('div')).addClass("commentCTACont " + comment._id)
            var $commentLike =  $(document.createElement('span')).addClass("comment-cta-item comment-like").html("Like").attr('data-id', comment._id).attr('data-likecount', comment.liked.length)

            if(globalUser){
                if(checkId(comment.liked, globalUser._id)){
                    //not liked
                    $commentLike.attr("data-liked", false)
                    
                }else{
                    //liked 
                    $commentLike.attr("data-liked", true)
                    $commentLike.addClass('comment-liked')
                }
            }else{
                $commentLike.attr("data-liked", false)
            }  

            var $commentReply =  $(document.createElement('span')).addClass("comment-cta-item comment-reply").html("Reply").attr('data-id', comment._id)
            var $dotSeparator = $(document.createElement('span')).addClass("comment-cta-item").html("·")
            var $dotSeparator2 = $(document.createElement('span')).addClass("comment-cta-item").html("·")
            var $commentTimestamp =  $(document.createElement('span')).addClass("comment-cta-item comment-ts").html(newElapsed)
            
            $commentTimestamp.attr('data-time', elapsed)
            
           

           
            
            $avatarCont.append($commentAvatar)
            $newCommentCont.append($avatarCont)
            $higherCommentCont.append($newCommentCont)
            $bodyCont.append($usernameCom)
            $bodyCont.append($bodyComment)
            $newCommentCont.append($bodyCont)

            

            $commentCTACont.append($commentLike)
            
            if(comment.liked.length > 0){
                console.log('log')
                var $dotSeparator0 = $(document.createElement('span')).addClass("comment-cta-item sep-0 " + comment._id).html("·")
                var $commentLikecount = $(document.createElement('span')).addClass("comment-cta-item comment-likecount " + comment._id).html(comment.liked.length)
                $commentCTACont.append($dotSeparator0)
                $commentCTACont.append($commentLikecount)
                $commentLike.attr("data-showlikecount",true)
            }else{
                $commentLike.attr("data-showlikecount",false)
            }
            $commentCTACont.append($dotSeparator)
            $commentCTACont.append($commentReply)
            $commentCTACont.append($dotSeparator2)
            $commentCTACont.append($commentTimestamp)
            $commentCTACont.attr('data-sc', false).attr('data-scer', false)

            if (comment.subcomments.length > 0){
                var $repliesIndicatorCont = $(document.createElement('div')).addClass("repliesIndicatorCont " +  comment._id).attr('data-id', comment._id).attr('data-imgId', imgId)
                var $replyIcon = $(document.createElement('span')).addClass("fa fa-reply fa-rotate-180").attr('data-id', comment._id)
                var $replyText = $(document.createElement('span')).addClass("replyIndicatorText").html("View " + comment.subcomments.length + " replies").attr('data-id', comment._id)

                $repliesIndicatorCont.append($replyIcon)
                $repliesIndicatorCont.append($replyText)

                $commentCTACont.append($repliesIndicatorCont);

               
            }


            $higherCommentCont.append($commentCTACont)
    
            $('.imgCommentsSpace').append($higherCommentCont)
            $('.imgCommentsSpace').show()
           
        })
    }else{
            $('.imgCommentsSpace').hide()
    }
    
}

function buildSubcomments(comments, comId, imgId){
    var $higherCTACont = $('.commentCTACont.' + comId)
    try{
        $('.higherSCommentCont.'+comId).empty()
    }catch{
        console.log('MMM')
    }
    
    console.log(comments)
    
   
    if(comments != []){
        comments.forEach(comment => {
           
            var created = new Date(comment.createdAt)
            console.log(Date.now())
            var elapsed = Date.now() - created.getTime() 
            elapsed = Math.round(elapsed/1000)
            
            newElapsed = getTimeString(elapsed)
            

            var $higherCommentCont = $(document.createElement('div')).addClass("higherSCommentCont " + comId)
            var $newCommentCont = $(document.createElement('div')).addClass("newCommentCont")
            var $avatarCont = $(document.createElement('div')).addClass("SCavatarCont")
            var $commentAvatar = $(document.createElement('img')).addClass("SCommentAvatar").attr('src', comment.author.avatarPath)
            var $bodyCont =  $(document.createElement('div')).addClass("bodyCont")
            var $bodyComment = $(document.createElement('span')).addClass("bodyComment").html(comment.content)
            var $usernameCom =  $(document.createElement('span')).addClass("usernameCom").html(comment.author.username)
            var $commentCTACont = $(document.createElement('div')).addClass("commentCTACont " + comment._id)
            var $commentLike =  $(document.createElement('span')).addClass("comment-cta-item comment-like").html("Like").attr('data-id', comment._id).attr('data-likecount', comment.liked.length)

            if(globalUser){
                if(checkId(comment.liked, globalUser._id)){
                    //not liked
                    $commentLike.attr("data-liked", false)
                }else{
                    //liked 
                    $commentLike.attr("data-liked", true)
                    $commentLike.addClass('comment-liked')
                }
            }else{
                $commentLike.attr("data-liked", false)
            }   
            

            var $commentReply =  $(document.createElement('span')).addClass("comment-cta-item comment-reply").html("Reply").attr('data-id', comment._id)
            var $dotSeparator = $(document.createElement('span')).addClass("comment-cta-item").html("·")
            var $dotSeparator2 = $(document.createElement('span')).addClass("comment-cta-item").html("·")
            var $commentTimestamp =  $(document.createElement('span')).addClass("comment-cta-item comment-ts").html(newElapsed)
            
            $commentTimestamp.attr('data-time', elapsed)
            
           

           
            
            $avatarCont.append($commentAvatar)
            $newCommentCont.append($avatarCont)
            $higherCommentCont.append($newCommentCont)
            $bodyCont.append($usernameCom)
            $bodyCont.append($bodyComment)
            $newCommentCont.append($bodyCont)

            

            $commentCTACont.append($commentLike)
            if(comment.liked.length > 0){
                console.log('log')
                var $dotSeparator0 = $(document.createElement('span')).addClass("comment-cta-item sep-0 " + comment._id).html("·")
                var $commentLikecount = $(document.createElement('span')).addClass("comment-cta-item comment-likecount " + comment._id).html(comment.liked.length)
                $commentCTACont.append($dotSeparator0)
                $commentCTACont.append($commentLikecount)
                $commentLike.attr("data-showlikecount",true)
            }else{
                $commentLike.attr("data-showlikecount",false)
            }

            $commentCTACont.append($dotSeparator)
            $commentCTACont.append($commentReply)
            $commentCTACont.append($dotSeparator2)
            $commentCTACont.append($commentTimestamp)
            $commentCTACont.attr('data-sc', false).attr('data-scer', false)

            if (comment.subcomments.length > 0){
              
                var $repliesIndicatorCont = $(document.createElement('div')).addClass("repliesIndicatorCont " +  comment._id).attr('data-id', comment._id).attr('data-imgId', imgId)
                var $replyIcon = $(document.createElement('span')).addClass("fa fa-reply fa-rotate-180").attr('data-id', comment._id)
                var $replyText = $(document.createElement('span')).addClass("replyIndicatorText").html("View " + comment.subcomments.length + " replies").attr('data-id', comment._id)

                $repliesIndicatorCont.append($replyIcon)
                $repliesIndicatorCont.append($replyText)

                $commentCTACont.append($repliesIndicatorCont);

         
            }

            $higherCommentCont.append($commentCTACont)
            $higherCTACont.append($higherCommentCont)       
            $higherCTACont.attr('data-sc', true)
           
        })
    }else{
        return
    }
    
}

    


function buildSubcommenter(comId){
    var parentComment =  $('.commentCTACont.' + comId)
    console.log(parentComment)

    var $higherSCCont = $(document.createElement('div')).addClass("higherSCCont " + comId);
    var $newCommentCont = $(document.createElement('div')).addClass("newCommentCont")
    var $avatarCont = $(document.createElement('div')).addClass("SCAvatarCont")
    if (globalUser){
        var $commentAvatar = $(document.createElement('img')).addClass("SCommentAvatar").attr('src', globalUser.avatarPath)
    }else{
        var $commentAvatar = $(document.createElement('img')).addClass("SCommentAvatar").attr('src',  "assets\\images\\generic.jpg")
    }
   
    var $bodyCont =  $(document.createElement('div')).addClass("SCbodyCont")
    var $inputSubcomment =  $(document.createElement('textarea')).addClass("inputSubcomment").attr('rows', "1").attr('placeholder', "Write a reply...").attr('data-parent', comId)

    $avatarCont.append($commentAvatar)
    $newCommentCont.append($avatarCont)
    $bodyCont.append($inputSubcomment)
    $newCommentCont.append($bodyCont)
    $higherSCCont.append($newCommentCont)

    
    $(parentComment).append($higherSCCont)
    $(parentComment).attr('data-scer', true)
    
    $('.inputSubcomment').autoResize();
   


    
}

function buildUserAvatar(user){
    uavs =  document.getElementsByClassName("userAvatar")
    console.log(uavs.length)
    for(i=0;i<uavs.length;i++){
        if (user.avatarPath){
          
            uavs[i].src = user.avatarPath
            localStorage.setItem('userAvatar', user.avatarPath)
           
        }else{

            uavs[i].src = "assets\\images\\generic.jpg"
          
        }
    }
 }

 function buildRightBar(img, numcomments){
    avs = document.getElementsByClassName("authorAvatar")
   
    for(i=0;i<avs.length;i++){
        if (img.author.avatarPath){
           
            avs[i].src = img.author.avatarPath
            $('.authorName').html(img.author.username)
            //$(".authorComponentLink").attr('href', "/home/" + img.author._id)
        }else{

            avs[i].src = "assets\\images\\generic.jpg"
            $('.authorName').html(img.author.username)
        }
    }

    $('.authorAvatar').attr('href', 'https://' + window.location.host + "/home/" +  img.author._id)

    $('.authorName').attr('href',  'https://' + window.location.host + "/home/" +  img.author._id )

    $('.likeBtn').attr('data-likecount',img.liked.length)
    $('.descriptionRight').attr('data-commentcount', numcomments)
    

 }

 function buildLikesAndComments(img, numcomments){
    
    $('#likeCount').html(img.liked.length + ' likes')
    $('#commentCount').html(numcomments + ' comments')
    if(img.description){
        $('.imgDescription').html(img.description)
        $('.descriptionComponent').show()
    }else{
        $('.descriptionComponent').hide()
    }
}

/*Destroyers*/

function destroySkeleton(fileId){
    $('#skeleton-' + fileId).remove()
}


/*Updaters*/



function updateImgCount(){
    $('#likeCount').html( $('.likeBtn').attr('data-likecount') + ' likes')
    $('#commentCount').html( $('.descriptionRight').attr('data-commentcount') + ' comments')
}



/*fetchers (GET requests)*/


function getUserInfo(img){

    if (localStorage.getItem('token')){
 
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
                nonUserHandler()
                throw error;
            }
            },error => {throw error;})    
        .then(response => response.json())
        .then(response => {
            user = response.user

            globalUser = user;
	    
         
            $('.descriptionRight').attr('data-loggedin', true)
            buildUserAvatar(user)
            $('.likeBtn').attr('data-imId', img._id.toString())
            $('.commentBtn').attr('data-imId', img._id.toString())
            
            if (!checkId(user.liked, img._id)){
                $('.likeBtn').attr('data-liked', true)
                colorLikeBar(true)
            }else{
                $('.likeBtn').attr('data-liked', false)
                colorLikeBar(false)
            }
        })
        .catch(err => console.log(err))
    }else{
        nonUserHandler()
        return
    }
    
}

function fetchComments(imgId){
   
        fetch('https://' + window.location.host +'/images/' + imgId + '/comments', {
        method:'GET',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        },
        
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
            buildComments(response.comments, imgId)
        })
        .catch(err => console.log(err))
}

function fetchImage(imgId,skeletonTruth=false, overlayTruth=false){
   
    fetch('https://' + window.location.host +'/images/detailed/' + imgId , {
    method:'GET',
    headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
    },
    
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
        if(skeletonTruth){
            buildSkeleton(response.img._id)
        }
        if (overlayTruth){
            buildOverlay()
        }
        buildImage(response.img.filename)
        

        buildRightBar(response.img, response.numcomments)
        getUserInfo(response.img)
        buildLikesAndComments(response.img, response.numcomments)

        fetchComments(imgId)
    })
    .catch(err => console.log(err))
}




function fetchCommentReplies(e, built, imgId){
    console.log(e.target)
    var comId = e.target.getAttribute('data-id');

    fetch('https://' + window.location.host +'/images/' + imgId + '/' + comId + '/subcomment', {
        method:'GET',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        },
        
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

            var $higherCTACont = $('.commentCTACont.' + comId)
            subcomTruth = $higherCTACont.attr('data-sc')
            subcommenterTruth = $higherCTACont.attr('data-scer')
          
            console.log(subcommenterTruth)
            if (subcomTruth == 'false'){
                $('.' + comId + '.repliesIndicatorCont' ).css('display','none')
                buildSubcomments(response.subcomments, comId, imgId)
                $higherCTACont.attr('data-sc', true)
            }
            
          
            
            if(built && subcommenterTruth == 'false'){
                
                buildSubcommenter(comId)
            }
        })
        .catch(err => console.log(err))

}







