$(document).ready(function(){

  if (localStorage.getItem("isSignedIn") !== 'true') {
    window.location.replace("/index.html");
  } else {
    handleSignedIn();
  }

  $("#g-signin2").hide();

  // nav bar
  $('.handle').on('click', function(){
       $('nav ul').toggleClass('showing');
  });

  // sign out

  $("#signout").click(function(e) {
    localStorage.setItem("isSignedIn", 'false');
    window.location.replace("/index.html");
  });

});

function handleSignedIn() {
  const email = localStorage.getItem("email");
  $("#userLogin").prepend("Signed in as " + email);

  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-90767777-1', 'auto');
  ga('set', 'userId', email); // Set the user ID using signed-in user_id.
  ga('send', 'pageview');

}

function onFailure(e) {
  console.log("Sign in failed.");
}

window.onerror = function (msg, url, lineNo, columnNo, error) {
  $.ajax({
    type:"GET",
    cache:false,
    url:"/globalError",
    dataType: "json",
    data: {
      message: msg,
      url: url,
      line: lineNo,
      column: columnNo,
      err: error,
      nav: navigator ? navigator.userAgent : null,
      format: "json"
    },
  });
  return false;
}
