$(document).ready(function() {
  // Event handler for the textarea inside the .new-tweet section
  $('.new-tweet textarea').on('input', function(event) {
    var inputLength = $(this).val().length;
    console.log('Input length:', inputLength);
    
    // Calculate remaining characters
    let remainingCount = 140 - inputLength;
    
    // Display the count
    $('.counter').text(remainingCount);
    
    // Check if count exceeds the limit
    if (remainingCount < 0) {
      $('.counter').addClass('counter-exceeded');
      $('.counter').text(remainingCount);
    } else {
      $('.counter').removeClass('counter-exceeded');
    }
  });
});
