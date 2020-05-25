var itemClassName = "carousel__item";
      
      
var slide = 0,
prev,
prevprev,
next,
nextnext,
moving = true; 

function setInitialClasses() {
    items = document.getElementsByClassName(itemClassName),
    totalItems = items.length
    console.log(items)
    prev = totalItems - 1
    prevprev = totalItems -2
    next = 1
    nextnext = 2
    // Target the last, initial, and next items and give them the relevant class.
    // This assumes there are three or more items.
    if (totalItems >= 5){
	$(items[totalItems - 2]).addClass("prevprev");
    	$(items[totalItems - 1]).addClass("prev");
    	$(items[0]).addClass("active");
    	$(items[1]).addClass("next");
    	$(items[2]).addClass("nextnext");

    }else if(totalItems < 5 && totalItems > 1){
			$(items[totalItems - 1]).addClass("prev");
    	$(items[0]).addClass("active");
    	$(items[1]).addClass("next");
$('.carousel__button--next').hide()
$('.carousel__button--prev').hide()
	}else if (totalItems == 1){
		$(items[0]).addClass("active");
		$('.carousel__button--next').hide()
		$('.carousel__button--prev').hide()

	}
    
  }

  // Set click events to navigation buttons

  function setEventListeners() {
    var next = document.getElementsByClassName('carousel__button--next')[0],
        prev = document.getElementsByClassName('carousel__button--prev')[0];

    next.addEventListener('click', moveNext);
    prev.addEventListener('click', movePrev);
  }

  // Disable interaction by setting 'moving' to true for the same duration as our transition (0.5s = 500ms)
  function disableInteraction() {
    moving = true;

    setTimeout(function(){
      moving = false
    }, 500);
  }

  function moveCarouselTo(slide, mov) {

    items = document.getElementsByClassName(itemClassName)
    totalItems = items.length
    // Check if carousel is moving, if not, allow interaction
    if(!moving) {

      // temporarily disable interactivity
      disableInteraction();

      items[prevprev].className = itemClassName;
    items[nextnext].className = itemClassName;
  
    
    console.log(next)
      // Preemptively set variables for the current next and previous slide, as well as the potential next or previous slide.
      if(mov == 'prev'){
        prevprev -= 1,
        nextnext -=  1,
        prev -= 1,
        next -= 1;
      }else if (mov == 'next'){
        prevprev += 1,
        nextnext +=  1,
        prev += 1,
        next += 1;
      }
     
      

      // reset
      if(prevprev < 0){
          prevprev = totalItems - 1
      }else if(prevprev > (totalItems - 1)){
            prevprev = 0
      }

      if(nextnext < 0){
        nextnext = totalItems - 1
    }else if(nextnext > (totalItems - 1)){
        nextnext = 0
    }

    if(prev < 0){
        prev = totalItems - 1
    }else if(prev > (totalItems - 1)){
          prev = 0
    }

    if(next < 0){
        next = totalItems - 1
    }else if(next > (totalItems - 1)){
        next = 0
    }
    console.log(next)
        // Now we've worked out where we are and where we're going, by adding and removing classes, we'll be triggering the carousel's transitions.

     
        // Add the new classes
        $(items[prevprev]).attr('class',itemClassName + " prevprev")
        $(items[prev]).attr('class', itemClassName + " prev")
        $(items[slide]).attr('class', itemClassName + " active")
        $(items[next]).attr('class',itemClassName + " next")
        $(items[nextnext]).attr('class',itemClassName + " nextnext")
      
       
    }
}
  

  // Next navigation handler
  function moveNext() {

    // Check if moving
    if (!moving) {

      // If it's the last slide, reset to 0, else +1
      if (slide === (totalItems - 1)) {
        slide = 0;
      } else {
        slide++;
      }

      // Move carousel to updated slide
      moveCarouselTo(slide, 'next');
    }
  }

  // Previous navigation handler
  function movePrev() {

    // Check if moving
    if (!moving) {

      // If it's the first slide, set as the last slide, else -1
      if (slide === 0) {
        slide = (totalItems - 1);
      } else {
        slide--;
      }

      // Move carousel to updated slide
      moveCarouselTo(slide, 'prev');
    }
  }

  // Initialise carousel
  function initCarousel() {
    setInitialClasses();
    setEventListeners();

    // Set moving to false now that the carousel is ready
    moving = false;
  }