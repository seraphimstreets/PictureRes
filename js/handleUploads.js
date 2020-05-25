function submitImage(){
    var fu1 = document.getElementById('fileUploader1').value;
    
    if(!fu1){
      $('#success-message').html("Please upload at least one image");
      $('#success-header').html("No files found")
      $('.modalOverlay2').show()
      $('#successModal').show()
      return
    }
    var form = document.getElementById('imageUploadForm'); // give the form an ID
    var xhr  = new XMLHttpRequest(); 
              // create XMLHttpRequest
    var data = new FormData(form);                // create formData object
    

    xhr.onload = function() {
        console.log(this.responseText)
        console.log(this)
        if (this.readyState == 4 && this.status == 200){
          $('#success-message').html("Images were uploaded successfully!");
          $('#success-header').html("Success")
          $('.modalOverlay2').show()
          $('#successModal').show()
        }else{
          $('#success-message').html("Images could not be uploaded.")
          $('#success-header').html("Failure")
          $('.modalOverlay2').show()
          $('#successModal').show()
        } // whatever the server returns
    }

    xhr.open("post", form.action); 
    xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'))       // open connection
    xhr.send(data);                     // send data
}

function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      
      reader.onload = function(e) {
            count = document.getElementsByClassName('previewImage').length + 1
            newcount = count + 1

            imdiv = document.createElement('div')
            im = new Image();
            im.src = e.target.result;
            im.className += 'previewImage'

            imcross = document.createElement('p');
            imcross.innerHTML = "&times"
            imcross.className += 'imcross'
            im.append(imcross)
            imdiv.append(im)
            imdiv.className += "previewImageDiv"
            cont = document.getElementById('imageUploadBody')
            cont.insertBefore(imdiv, cont.firstChild)

            if (newcount < 10){
                $("#uploaderLabel" + count.toString() ).hide()
                $("#uploaderLabel" + newcount.toString() ).css('display', 'inline-flex')
            }else{
                $("#uploaderLabel" + count.toString() ).hide()
            }
            
           
             
           

            
            
    
      }
      
      reader.readAsDataURL(input.files[0]); // convert to base64 string
    }
  }
  
  $(".fileUploader").change(function() {
    readURL(this);
  });


function clearFileInput(){
  $('.fileUploader').val("")
  $('.previewImageDiv').remove()
  $('.uploaderLabel').hide()
  $('#uploaderLabel1').css('display','inline-flex')
}

