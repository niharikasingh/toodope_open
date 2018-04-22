$(document).ready(function(){

  $("#g-signin2").hide();

  // nav bar
  $('.handle').on('click', function(){
       $('nav ul').toggleClass('showing');
  });

  // sign out

  $("#signout").click(function(e) {
    var auth2 = gapi.auth2.getAuthInstance()
    auth2.signOut();
    window.location.replace("/index.html");
  });

});

var userEmail = "";

function onLoadCallback() {
  var auth2;
  gapi.load('auth2', function() {
    auth2 = gapi.auth2.init();
    auth2.then(function() {
      if (auth2.isSignedIn.get() == false) {
        window.location.replace("/index.html");
      }
    });
  });
}

function onSignIn(guser) {
  var profile = guser.getBasicProfile();
  $("#userLogin").prepend("Signed in as " + profile.getEmail());
  userEmail = profile.getEmail();

  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-90767777-1', 'auto');
  ga('set', 'userId', profile.getEmail()); // Set the user ID using signed-in user_id.
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
