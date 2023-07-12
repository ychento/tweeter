// Function to escape special characters in a string
const escape = function (str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

// Function to render tweets on the page
const renderTweets = function (tweets) {
  $('#tweets-container').empty();

  for (let tweet of tweets) {
    const $tweetElement = createTweetElement(tweet);
    $('#tweets-container').prepend($tweetElement);
  }
};

// Function to create a tweet element based on tweet data
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
  // Function to load tweets from the server
  const loadTweets = function () {
    $.ajax({
      url: '/tweets',
      method: 'GET',
      dataType: 'json',
      success: function (response) {
        renderTweets(response);
      },
      error: function (error) {
      }
    });
  };

  // Function to submit a new tweet
  const submitTweet = function (formData) {
    $.post('/tweets', formData)
      .then(function (response) {
        $('#tweet-text').val('');
        loadTweets();
      })
      .catch(function(error){});
  };

  // Function to display an error message
  function displayError(errorMessage) {
    const errorContainer = $('#error-container');

    if (errorMessage) {
      errorContainer.text(errorMessage);
      errorContainer.slideDown(1000, function() {
        setTimeout(function() {
          errorContainer.slideUp(1000);
        }, 1000);
      });
    } else {
      errorContainer.slideUp(1000);
    }
  }

  // Submit form handler
  $('#tweet-form').submit(function (event) {
    event.preventDefault();

    const input = $(this).find('#tweet-text').val().trim(); // Trim the tweet

    if (!input.length) {
      displayError('Tweet is too short.');
      return;
    }

    if (input.length > 140) {
      displayError('Tweet is too long. Please limit it to 140 characters.');
      return;
    }

    const formData = $(this).serialize();
    submitTweet(formData);
  });

  loadTweets();
});
