function getSearchResults(term){
    /* 
    term: String
    */
   fetch("https://" + window.location.host + "/search/?term=" +  term, {
    method:'GET',
    headers:{
        'Accept':'application/json, text/plain, */*',
        'Content-Type':'application/json'
    }
    })
    .then(response => {
        if(response.ok){
            return response
        }else{
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
            error.response = response;
            
            throw error;
        }
    })
    .then(response => response.json())
    .then(response => {
        buildSearchResults(response.albumList)
    })

}
    
function buildSearchResults(albumList){
    /* adds all result boxes into the container */
    if (albumList){
        count = albumList.length
        for(i=0;i<count;i++){
            $result_box = buildSearchResult(albumList[i], i)
            $('.searchCont').append($result_box)
        }
    }
    

    const urlParams = new URLSearchParams(window.location.search);
    const term = urlParams.get('term');
    $resultsDesText =  $(document.createElement('div')).addClass('resultsDesText').html("Showing results for " + term + ":")

    $('.resultsDes').append($resultsDesText)
}

function buildSearchResult(album, count){

    /*returns one result box*/
    

    chosenImage = album.images[0]

    var $rb = $(document.createElement('div')).addClass('resultBox')
    var $coverImCont = $(document.createElement('div')).addClass('coverImCont')
    var $coverIm = $(document.createElement('img')).addClass('coverIm').attr('src', chosenImage.filename)
    $coverImCont.append($coverIm)

    var $titleCont = $(document.createElement('div')).addClass('rbTitleCont')
    var $title = $(document.createElement('div')).addClass('rbTitle').html(album.title)
    var $authorCont = $(document.createElement('div')).addClass('rbAuthorCont')
    var $author = $(document.createElement('div')).addClass('rbAuthor').html("by " + album.author.username)
    $authorCont.append($author)

    $titleCont.append($title)
    $titleCont.append($authorCont)

    var $descriptionCont = $(document.createElement('div')).addClass('rbDescriptionCont')
    var $description = $(document.createElement('div')).addClass('rbDescription').html(album.description)
    $descriptionCont.append($description)

    var $actionCont = $(document.createElement('div')).addClass('rbActionCont')
    var $viewAlbumBtn = $(document.createElement('a')).addClass('fancy-button pop-onhover bg-gradient4 rbViewAlbumBtn').attr('href', "https://" + window.location.host + "/albums/" + album._id + "?origPage=" + encodeURIComponent(window.location.href))
    var $btnText = $(document.createElement('span')).html("View Album")
    $viewAlbumBtn.append($btnText)

    $actionCont.append($viewAlbumBtn)

    $rb.append($coverImCont)
    $rb.append($titleCont)
    $rb.append($descriptionCont)
    $rb.append($actionCont)

   

    return $rb




}

$(document).ready(() => {
    buildSearchResults(albumList)
})