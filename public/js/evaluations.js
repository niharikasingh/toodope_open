$(document).ready(function(){

  // ----- AUTOCOMPLETE ----------
  new Awesomplete(document.getElementById("courseName"), {list: classList});
  new Awesomplete(document.getElementById("professorName"), {list: professorList});

  // ----- SEARCH BUTTON ---------
  $("#searchButton").click(performSearch);
  $(".row.selector").keypress(function(e) {
      if(e.which == 13) {
        if ($('#searchButton').css('display') != 'none') {
          performSearch();
        }
        else {
          performUpload();
        }
      }
  });

  // ------- GOOGLE SIGN-IN ----------
  $("#g-signin2").hide();

  // -------- RESPONSIVE MENU ------------
  $('.handle').on('click', function(){
       $('nav ul').toggleClass('showing');
  });
  // -------- RESPONSIVE SEARCH RESULTS ----------
  positionDisplayOutlines();
  $(window).resize(function() {
    positionDisplayOutlines();
  });

  // sign out
  $("#signout").click(function(e) {
    var auth2 = gapi.auth2.getAuthInstance()
    auth2.signOut();
    window.location.replace("/index.html");
  });

  //toggle between upload and search bars
  $(".selectortab").click(function (e) {
    if ($(this).hasClass("inactive")) {
      $(".selectortab").toggleClass("active inactive");
      $("#searchButton").toggle();
      $(".uploadOptions").toggleClass("hide");
      $(".errorMessage").addClass("hide");
      positionDisplayOutlines();
      if ($(this).hasClass("uploadOptions") == false) {
        $("#courseName").css("border-color", "black");
        $("#professorName").css("border-color", "black");
        $("select").css("border-color", "black");
      }
    }
  });

  $('#uploadButton').click(performUpload);

  $('.tooltipHover').bind('touchstart', function() {});

});

//----------END OF JQUERY WINDOW READY------------

var hlsEvalsCount = 576;

// -------- ENCOURAGE SUBMISSIONS ----------
function encourageSubmissions() {
  $.ajax({
    url: '/encourage',
    type: 'GET',
    dataType: 'json',
    data: {
      page: "evaluations",
      userName: userName,
      format: "json"
    },
    complete: function(data) {
      var results = data.responseJSON;
      if (results == false) {
        $("#encourage").show();
      }
    },
    error: function(status, jqXHR, error) {
      console.log("SEARCH.JS ERROR: " + error);
    }
  });
}

//--------- Search for outlines -----------
function performSearch(e) {
  $("#searchButton").addClass("hide");
  $('.iconLoading').removeClass("hide");
  $(".errorMessage").addClass("hide");
  $("#displayDopeEvals").empty();
  $("#displayHlsEvals").empty();
  $("#displayDopeComments").addClass("hide");
  $("#displayDopeComments").empty();
  var courseName = $("#courseName").val();
  var professorName = $("#professorName").val();
  if ((courseName.length == 0) && (professorName.length == 0)) {
    $('.iconLoading').addClass("hide");
    $("#searchButton").removeClass("hide");
    $(".errorMessage").removeClass("hide");
    $(".errorMessage").text("Please enter a course and/or professor above.");
    return;
  }
  var professorLastName = getProfessorLastName(professorName);
  courseName = cleanName(courseName);
  $.ajax({
    url: '/searchHlsEvals',
    type: 'GET',
    dataType: 'json',
    data: {
      course: courseName,
      professor: professorLastName,
      userName: userName,
      format: "json"
    },
    complete: function(data) {
      var results = JSON.parse(data.responseText);
      console.log("SEARCH.JS SUCCESS: " + JSON.stringify(results));
      displayHlsEvals(results);
      $("#searchButton").removeClass("hide");
      $('.iconLoading').addClass("hide");
    },
    error: function(status, jqXHR, error) {
      console.log("SEARCH.JS ERROR: " + error);
      $("#searchButton").removeClass("hide");
      $('.iconLoading').addClass("hide");
    }
  });
  $.ajax({
    url: '/searchDopeEvals',
    type: 'GET',
    dataType: 'json',
    data: {
      course: courseName,
      professor: professorLastName,
      userName: userName,
      format: "json"
    },
    complete: function(data) {
      var results = JSON.parse(data.responseText);
      console.log("SEARCH.JS SUCCESS: " + JSON.stringify(results));
      displayDopeEvals(results);
      $("#searchButton").removeClass("hide");
      $('.iconLoading').addClass("hide");
    },
    error: function(status, jqXHR, error) {
      console.log("SEARCH.JS ERROR: " + error);
      $("#searchButton").removeClass("hide");
      $('.iconLoading').addClass("hide");
    }
  });
  $.ajax({
    url: '/searchDopeComments',
    type: 'GET',
    dataType: 'json',
    data: {
      course: courseName,
      professor: professorLastName,
      userName: userName,
      format: "json"
    },
    complete: function(data) {
      var results = JSON.parse(data.responseText);
      console.log("SEARCH.JS SUCCESS: " + JSON.stringify(results));
      displayDopeComments(results);
      $("#searchButton").removeClass("hide");
      $('.iconLoading').addClass("hide");
    },
    error: function(status, jqXHR, error) {
      console.log("SEARCH.JS ERROR: " + error);
      $("#searchButton").removeClass("hide");
      $('.iconLoading').addClass("hide");
    }
  });
}

//----------- PARSE FILENAME HELPERS--------------
function cleanName(name) {
  name = $.trim(name);
  name = name.toLowerCase();
  // remove everything except alphanumeric characters
  name = name.replace(/&/g, "and");
  name = name.replace(/[^-a-z0-9 \/]/g , "");
  return name;
}

function getProfessorLastName(professorName) {
  var professorLastName = professorName.replace(/[ ,\.]/g , "");
  professorLastName = cleanName(professorLastName);
  return professorLastName;
}

//------------ DISPLAY OUTLINES --------------
var categories = ["interaction", "feelings", "laptops", "reading", "exam", "attendance", "success", "difficulty", "grades", "preferencing", "inclusive"];
var categoriesDisplay = {
  "interaction" : {
    1 : {
      image: "images/interactions1.svg",
      text: "Cold calls"
    },
    2 : {
      image: "images/interactions2.svg",
      text: "Soft cold calls"
    },
    3 : {
      image: "images/interactions3.svg",
      text: "Volunteers"
    },
    4 : {
      image: "images/interactions4.svg",
      text: "Just lecture"
    },
    5 : {
      image: "images/interactions5.svg",
      text: "Panels"
    }
  },
  "feelings" : {
    1 : {
      image: "images/feelings1.svg",
      text: "Glad it's over"
    },
    2 : {
      image: "images/feelings2.svg",
      text: "Glad I took it"
    },
    3 : {
      image: "images/feelings3.svg",
      text: "My favorite course at HLS"
    },
    4 : {
      image: "images/feelings4.svg",
      text: "No strong feelings"
    }
  },
  "laptops" : {
    1 : {
      image: "images/laptops1.svg",
      text: "Laptops allowed"
    },
    2 : {
      image: "images/laptops2.svg",
      text: "Laptops not allowed"
    },
    3 : {
      image: "images/laptops3.svg",
      text: "Varies"
    }
  },
  "reading" : {
    1 : {
      image: "images/reading1.svg",
      text: "Barely any"
    },
    2 : {
      image: "images/reading2.svg",
      text: "Less than average"
    },
    3 : {
      image: "images/reading3.svg",
      text: "About average"
    },
    4 : {
      image: "images/reading4.svg",
      text: "On the high side"
    },
    5 : {
      image: "images/reading5.svg",
      text: "Excessive"
    }
  },
  "exam" : {
    1 : {
      image: "images/exam1.svg",
      text: "Simple"
    },
    2 : {
      image: "images/exam2.svg",
      text: "Easier than normal"
    },
    3 : {
      image: "images/exam3.svg",
      text: "About average"
    },
    4 : {
      image: "images/exam4.svg",
      text: "Difficult"
    },
    5 : {
      image: "images/exam5.svg",
      text: "Extremely frustrating"
    }
  },
  "attendance" : {
    1 : {
      image: "images/attendance1.svg",
      text: "Not necessary and not enforced"
    },
    2 : {
      image: "images/attendance1.svg",
      text: "Helpful, but not required"
    },
    3 : {
      image: "images/attendance2.svg",
      text: "Helpful and emphasized"
    },
    4 : {
      image: "images/attendance2.svg",
      text: "Attendance was effectively graded"
    }
  },
  "success" : {
    1 : {
      image: "images/success1.svg",
      text: "Class attendance"
    },
    2 : {
      image: "images/success2.svg",
      text: "Outlines"
    },
    3 : {
      image: "images/success3.svg",
      text: "Readings"
    },
    4 : {
      image: "images/success4.svg",
      text: "Other"
    },
    5 : {
      image: "images/success4.svg",
      text: "I have no idea"
    }
  },
  "difficulty" : {
    1 : {
      image: "images/difficulty1.svg",
      text: "Easier"
    },
    2 : {
      image: "images/difficulty2.svg",
      text: "About average"
    },
    3 : {
      image: "images/difficulty3.svg",
      text: "More difficult"
    }
  },
  "grades" : {
    1 : {
      image: "images/grades1.svg",
      text: "Easy H"
    },
    2 : {
      image: "images/grades1.svg",
      text: "Normal H/P distribution"
    },
    3 : {
      image: "images/grades2.svg",
      text: "Strict curve with LPs"
    },
    4 : {
      image: "images/grades3.svg",
      text: "Don't know"
    }
  },
  "preferencing" : {
    1 : {
      image: "images/preferencing.svg",
      text: "Open seats"
    },
    2 : {
      image: "images/preferencing.svg",
      text: "Preference low"
    },
    3 : {
      image: "images/preferencing.svg",
      text: "Preference high"
    },
    4 : {
      image: "images/preferencing.svg",
      text: "Must be top preference"
    },
    5 : {
      image: "images/preferencing.svg",
      text: "Don't know"
    }
  },
  "inclusive": {
    1 : {
      image: "images/inclusive.svg",
      text: "Not at all"
    },
    2 : {
      image: "images/inclusive.svg",
      text: "Some"
    },
    3 : {
      image: "images/inclusive.svg",
      text: "When prompted"
    },
    4 : {
      image: "images/inclusive.svg",
      text: "Very much"
    }
  }
};

function displayDopeEvals(data) {
  var appendStr = '<h3>Unofficial Evaluations</h3>';
  var courseName = $("#courseName").val();
  var professorName = $("#professorName").val();
  var currData = data[0];
  appendStr += "<div class='row outline'>";
  if (courseName.length == 0) appendStr += "<h5>Professor: " + professorName.toUpperCase() + "</h5>";
  else if (professorName.length == 0) appendStr += "<h5>Course: " + courseName.toUpperCase() + "</h5>";
  else appendStr += "<h5>" + courseName.toUpperCase() + " (" + professorName.toUpperCase() + ")</h5>";
  var j = 0;
  for (i = 0; i < categories.length; i++) {
    var c = categories[i];
    var tempc = c;
    if (c == "success") tempc = "Key to success";
    var currAns = currData[c];
    if ((currAns != 0) && (currAns != null)) {
      if (j % 4 == 0) {
        appendStr += "</div><div class='row outline'>";
      }
      appendStr += "<div class='three columns'><img src='" + categoriesDisplay[c][currAns]["image"] + "'><br>" + tempc.toUpperCase() + "<br>" + categoriesDisplay[c][currAns]["text"] + "</div>";
      j += 1;
    }
  }
  if (j == 0) {
    appendStr += '<div class="row outline">Sorry, no ratings found. Be the first by clicking the "RATE" tab above.</div>';
  }
  $("#displayDopeEvals").append(appendStr);
}

function displayDopeComments(data) {
  if (data.length == 0) return;
  var appendStr = "<ul>";
  for (i = 0; i < data.length; i++) {
    if (data[i].comments.length > 0) appendStr += "<li class='dopeComment' tabindex='0'>" + data[i].comments + "</li>";
  }
  $("#displayDopeComments").append(appendStr + "</ul>");
  $("#displayDopeComments").removeClass("hide");
}

function displayHlsEvals(data) {
  //no data found
  var appendStr = '<h3>Official HLS Evaluations</h3>';
  if (data.length == 0) {
    appendStr += '<div class="row outline">Sorry, none found.</div>';
    $("#displayHlsEvals").append(appendStr);
    return;
  }
  for (i = 0; i < data.length; i++) {
    var currData = data[i];
    appendStr += "<div class='row outline'><h5>";
    appendStr += currData.course.toUpperCase() + " (" + currData.professor.toUpperCase() + ", " + currData.semester.toUpperCase() + " " + currData.year + ")</h5>";
    appendStr += "Overall Effectiveness of Teacher: " + currData.q6 + "/5.000";
    var tempPercentile = Math.floor(((hlsEvalsCount - currData.q6_rank)/hlsEvalsCount)*100);
    appendStr += " -- Percentile: " + tempPercentile + "% (higher is better)<br>";
    appendStr += "Overall Effectiveness of Course: " + currData.q15 + "/5.000";
    tempPercentile = Math.floor(((hlsEvalsCount - currData.q15_rank)/hlsEvalsCount)*100);
    appendStr += " -- Percentile: " + tempPercentile + "% (higher is better)<br>";
    appendStr += "Average Hours per Week: " + currData.q20;
    tempPercentile = Math.floor(((currData.q20_rank)/hlsEvalsCount)*100);
    appendStr += " -- Percentile: " + tempPercentile + "% (higher means less work)</div><br>";
  }
  $("#displayHlsEvals").append(appendStr);
}

function positionDisplayOutlines() {
  var offset = 100 + $(".selector").height();
    $("#displayOutlines").css("margin-top", offset+"px");
}


//----------GOOGLE SIGN IN AND ANALYTICS-------------
var userName = "";
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
  //sign-in
  var profile = guser.getBasicProfile();
  $("#userLogin").prepend("Signed in as " + profile.getEmail());
  userName = profile.getEmail();
  userName = userName.replace(/harvard\.edu/g, "");
  userName = userName.replace(/[@\.]/g, "_");
  //analytics
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
  ga('create', 'UA-90767777-1', 'auto');
  ga('set', 'userId', profile.getEmail()); // Set the user ID using signed-in user_id.
  ga('send', 'pageview');
  // -------- ENCOURAGE SUBMISSIONS ----------
  encourageSubmissions();
}

function onFailure(e) {
  console.log("Sign in failed.");
}

//----------- PERFORM UPLOAD -----------
function performUpload() {
  $(".errorMessage").addClass("hide");
  $(".successMessage").addClass("hide");
  $('#uploadButton').addClass("hide");
  $('.iconLoading').removeClass("hide");
  var errorMessage = "";
  //writing fields are filled in
  var courseName = $("#courseName").val();
  var professorName = $("#professorName").val();
  professorName = cleanName(professorName);
  courseName = cleanName(courseName);
  if (courseName.length == 0) {
    $("#courseName").css("border-color", "red");
    errorMessage = "Please enter a course name.";
  }
  else {
    $("#courseName").css("border-color", "black");
  }
  if ((courseName.length > 0) && (professorName.length == 0)) {
    $("#professorName").css("border-color", "red");
    errorMessage = "Please enter a professor name.";
  }
  else {
    $("#professorName").css("border-color", "black");
  }
  if (errorMessage.length > 0) {
    $(".errorMessage").removeClass("hide");
    $(".errorMessage").text(errorMessage);
    $('#uploadButton').removeClass("hide");
    $('.iconLoading').addClass("hide");
  }
  else {
    var interaction = $("select").eq(0).val();
    var feelings = $("select").eq(1).val();
    var laptops = $("select").eq(2).val();
    var reading = $("select").eq(3).val();
    var exam = $("select").eq(4).val();
    var attendance = $("select").eq(5).val();
    var success = $("select").eq(6).val();
    var difficulty = $("select").eq(7).val();
    var grades = $("select").eq(8).val();
    var preferencing = $("select").eq(9).val();
    var inclusive = $("select").eq(10).val();
    var comments = $("#comments").val();
    $.ajax({
      url: '/uploadEval',
      type: 'GET',
      dataType: 'json',
      data: {
        course: courseName,
        professor: professorName,
        userName: userName,
        interaction: interaction,
        feelings: feelings,
        laptops: laptops,
        reading: reading,
        exam: exam,
        attendance: attendance,
        success: success,
        difficulty: difficulty,
        grades: grades,
        preferencing: preferencing,
        inclusive: inclusive,
        comments: comments,
        format: "json"
      }
    });
    $.ajax({
      url: '/encourage',
      type: 'POST',
      dataType: 'json',
      data: {
        page: "evaluations",
        userName: userName,
        format: "json"
      }
    });
    $(".successMessage").removeClass("hide");
    $(".successMessage").text("Thanks for submitting!");
    $('#uploadButton').removeClass("hide");
    $('.iconLoading').addClass("hide");
    // reset all entries to default
    $("#courseName").val("");
    $("#professorName").val("");
    $("select").eq(0).val(0);
    $("select").eq(1).val(0);
    $("select").eq(2).val(0);
    $("select").eq(3).val(0);
    $("select").eq(4).val(0);
    $("select").eq(5).val(0);
    $("select").eq(6).val(0);
    $("select").eq(7).val(0);
    $("select").eq(8).val(0);
    $("select").eq(9).val(0);
    $("select").eq(10).val(0);
    $("#comments").val("");
  }
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
