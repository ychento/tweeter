
const renderTweets = function (tweets) {
  $('#tweets-container').empty();

  for (let tweet of tweets) {
    const $tweetElement = createTweetElement(tweet);
    $('#tweets-container').prepend($tweetElement);
  }
};

const createTweetElement = function (tweetData) {
  const { name, avatars, handle } = tweetData.user;
  const { text } = tweetData.content;
  const created_at = tweetData.created_at;
  const timePassed = timeago.format(created_at);

  const $tweet = $(`
    <article class="tweet">
      <header class="tweet-header">
        <div><img src="${avatars}" alt="User Avatar">
        <span>${name}</span></div>
        <div class="tweet-header-handle"><span>${handle}</span></div>
      </header>
      <p class="tweet-text">${text}</p>
      <footer class="tweet-footer">
        <div><span>${timePassed}</span></div>
        <div>
          <i class="fas fa-flag"></i>
          <i class="fas fa-retweet"></i>
          <i class="fas fa-heart"></i>
        </div>
      </footer>
    </article>
  `);

  $tweet.find('.tweet-text').text(text);
  $tweet.find('.tweet-footer span').text(timePassed);

  return $tweet;
};




$(document).ready(function () {
  const loadTweets = function () {
    $.ajax({
      url: '/tweets',
      method: 'GET',
      dataType: 'json',
      success: function (response) {
        // Handle the success response
        console.log('Tweets loaded successfully:', response);
        // Call the renderTweets function passing the response array
        renderTweets(response);
      },
      error: function (error) {
        console.log('Error loading tweets:', error);
      }
    });
  };

 
  const submitTweet = function(formData) {
    $.post('/tweets', formData)
      .then(function(response) {
        console.log('Tweet submitted successfully:', response);
        $('#tweet-text').val('');
        loadTweets();
      })
  };

  function displayError(errorMessage) {
    const errorContainer = $('#error-container');
    errorContainer.text(errorMessage);
    errorContainer.addClass('show');
  }




  // Submit form handler
  $('#tweet-form').submit(function (event) {
    event.preventDefault();

    const input = $(this).find('#tweet-text').val();

    if (!input.length) {
      displayError('Tweet is too short.');
      return;
    }

    if (input.length > 140) {
      displayError('Tweet is too long. Please limit it to 140 chareacters.');
      return;
    }

    const formData = $(this).serialize();
    submitTweet(formData);

  });

  loadTweets();

});





