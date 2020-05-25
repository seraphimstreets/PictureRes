
$(document).ready(() => {
    $('#uploadSubmit').click(() => {
        submitAlbum()
    })

    $(document).on('click', '.closeImageCont', (e) => {
        var count = $(e.target).attr('data-counter')
        console.log(count)
        delete globalFileObject[count]
        delete globalDescriptionObject[count]
        console.log(globalFileObject)
        $('.previewImageCont.' + count).remove()

        reworkOrder()
    })

    $(document).on('click', '.editImageCont', (e) => {
        var count = $(e.target).attr('data-counter')
        console.log($('#imageDescriptionModal' + count).length)
        if ( $('#imageDescriptionModal' + count).length){
       
            $('#imageDescriptionModal' + count).show()
            $('.modalOverlay').show()
            $('#imageDescriptionModal' + count + ' textarea').val( globalDescriptionObject[count.toString()])
        }else{
            $modal = $('#imageDescriptionTemplate').clone().attr('id', 'imageDescriptionModal' + count)
            
            
            $(document.body).append($modal)
            $('#imageDescriptionModal' + count + ' input').attr('data-counter', count)
            $('#imageDescriptionModal' + count + ' textarea').attr('id', 'imageDescription' + count)
            $('#imageDescriptionModal' + count).show()
            $('.modalOverlay').show()

        }
       
    })

    $(document).on('click', '.imageDescriptionDone', (e) => {
        var count = $(e.target).attr('data-counter')
        globalDescriptionObject[count.toString()] = $('#imageDescription' + count).val()
        console.log(globalDescriptionObject);
        $('.mod').hide()
        $('.modalOverlay').hide()
       
    })
})

function reworkOrder(){
    allIms = document.getElementsByClassName('previewImageCont')
    newOrder = []

    for(var i=0;i<allIms.length;i++){
        newOrder.push($(allIms[i]).attr('data-counter'))
    }
    console.log(newOrder)
}

window.onload = function(){
    if (window.File  && window.FileList && window.FileReader){
        $('#mulFileUpload').on('change', (e) => {
            var files = e.target.files;
            var $higherCont = $(document.createElement('div')).addClass('outputCont')
            var $outputArea = $('#mulFileResult')
            var flag;

            for (var i=0; i<files.length; i++){
                var file = files[i];
           
                
                
                if (file.type.match('image.*')){
                 
                    var picReader = new FileReader();
                    picReader.file = file
                    
                    picReader.addEventListener('load', (e) => {
                        var picSrc = e.target.result
                      
                        globalFileObject[globalFileCounter.toString()] = e.target.file
                        globalDescriptionObject[globalFileCounter.toString()] = ""
                
                        console.log(globalFileObject)
                        
                        
                        $previewImageCont = $(document.createElement('div')).addClass('previewImageCont ' + globalFileCounter.toString())
                        .attr('data-counter', globalFileCounter).css('background-image', 'url(' + picSrc + ')');
                        $closeImageCont = $(document.createElement('div')).addClass('closeImageCont').html('&times').attr('data-counter', globalFileCounter);
                        $editImageCont = $(document.createElement('div')).addClass('editImageCont').attr('data-counter', globalFileCounter);
                        $editPencil = $(document.createElement('span')).addClass('fa fa-pencil').attr('data-counter', globalFileCounter);
                        
                        $editImageCont.append($editPencil)
                        $previewImageCont.append($editImageCont)
                        $previewImageCont.append($closeImageCont)
                    
                        $previewImageCont.insertBefore('.addImageBox');
                        globalFileCounter += 1;
                    
                        reworkOrder()

                    });
                    
                   
                    picReader.readAsDataURL(file);
                    $('#mulFileResult').sortable();
                    

                }else{
                    console.log('You can only upload image files');
                    $(this).val("")
                }
            }
        })
    }else{
        console.log('Your browser does  not support the File API');
    }
}

function submitAlbum(){
    var allImages  = document.getElementById('mulFileUpload').value
 
    var newFileList = Object.values(globalFileObject);
    var newDescriptionList = Object.values(globalDescriptionObject);

    console.log(globalFileObject)
    console.log(globalDescriptionObject)
    var data = new FormData();
    
    for(var i=0;i<newOrder.length;i++){
        console.log(newOrder[i])
        data.append('file',globalFileObject[newOrder[i]])
    }

    for(var i=0;i<newOrder.length;i++){
        data.append('description',globalDescriptionObject[newOrder[i]])
    }

    var allTags = $('#uploadTags').attr('data-value').split(',')
    console.log(typeof($('#uploadTags').attr('data-value')))

    data.append('albumTitle', $('#uploadTitle').val())
    data.append('albumDescription', $('#uploadDescription').val())
    
    if($('#uploadTags').attr('data-value') !== ""){
        
        for(i=0;i<allTags.length;i++){
            data.append('uploadTags', allTags[i])
        }
    }else{
        data.append('uploadTags', [])
    }
    
    

    fetch('https://' + window.location.host +"/upload/uploadAlbum", {
        method:'POST',
        headers:{
         
            "Authorization":"Bearer " + localStorage.getItem('token')
        },
        body:data
    })
    .then( response => {
        console.log(response)
        if (response.status == 200) {
            
            $('#success-header').html('Success');
            $('#success-message').html('Album was uploaded successfully');
            $('#successModal').show()
            $('.modalOverlay').show()
           
            return response;
            
      }else if(response.status == 401){
            
            $('#success-header').html('Not logged in');
            $('#success-message').html('Please login to post albums');
            $('#successModal').show()
            $('.modalOverlay').show()
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
            throw error;

      }else {
            $('#success-header').html('Failure');
            $('#success-message').html('Something went wrong while uploading the album.');
            $('#successModal').show()
            $('.modalOverlay').show()
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
            throw error;
        }
    })    
    .then(response => response.json())
    .then(response => {
        console.log(response)
         
        
    })


}