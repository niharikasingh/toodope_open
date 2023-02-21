$(document).ready(function(){

  if (localStorage.getItem("isSignedIn") !== 'true') {
    window.location.replace("/index.html");
  } else {
    handleSignedIn();
  }

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

  // -------- HOVER HELPERS ----------
  $('.tooltipHover').bind('touchstart', function() {});

  // -------- FAVORITE OUTLINES ----------
  $('#displayOutlines').on('click', '.heartc', function(){
    var outlineName = $(this).siblings("a").attr("href");
    var outlineID = outlineName.split("_");
    outlineID = outlineID[outlineID.length -1];
    outlineID = outlineID.split(".");
    outlineID = parseInt(outlineID[0]);
    var incAmount = 0;
    var currNumber = parseInt($(this).siblings(".heartnumber").html());
    if ($(this).hasClass("red")){
      $(this).removeClass("red");
      incAmount = -1;
    }
    else {
      $(this).addClass("red");
      incAmount = 1;
    }
    $(this).siblings(".heartnumber").html(currNumber+incAmount);
    $.ajax({
      url: '/incOutlineHeart',
      type: 'POST',
      dataType: "json",
      data: {
        userName: userName,
        outlineID: outlineID,
        incAmount: incAmount,
        format: "json"
      },
      success : function(data, status, jqXHR) {
        console.log("INCREMENTING SUCCESS.");
      },
      error: function(status, jqXHR, error) {
        console.log("INCREMENTING ERROR: " + error);
      }
    });
  });

  // sign out
  $("#signout").click(function(e) {
    localStorage.setItem("isSignedIn", 'false');
    window.location.replace("/index.html");
  });

  // toggle between upload and search bars
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

});

//----------END OF JQUERY WINDOW READY------------

// -------- ENCOURAGE SUBMISSIONS ----------
function encourageSubmissions() {
  $.ajax({
    url: '/encourage',
    type: 'GET',
    dataType: 'json',
    data: {
      page: "outlines",
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
  $("#displayOutlines").empty();
  var courseName = $("#courseName").val();
  var professorName = $("#professorName").val();
  if ((courseName.length == 0) && (professorName.length == 0)) {
    $('.iconLoading').addClass("hide");
    $("#searchButton").removeClass("hide");
    $(".errorMessage").removeClass("hide");
    $(".errorMessage").text("Please enter a course and/or professor above.");
    return;
  }
  // grade, doctype, semester, year, content words
  var selectAnswers = [null, null, null, null];
  $("select").each(function(i) {
    selectAnswers[i] = $(this).val();
  });
  var content = $("#content").val();
  var professorLastName = getProfessorLastName(professorName, true);
  courseName = cleanName(courseName, true);
  $.ajax({
    url: '/searchOutlines',
    type: 'GET',
    dataType: 'json',
    data: {
      courseName: courseName,
      professorLastName: professorLastName,
      userName: userName,
      content: content,
      grade: selectAnswers[0],
      doctype: selectAnswers[1],
      semester: selectAnswers[2],
      year: selectAnswers[3],
      format: "json"
    },
    complete: function(data) {
      var results = JSON.parse(data.responseText);
      console.log("SEARCH.JS SUCCESS: " + JSON.stringify(results));
      displaySQLOutlines(results);
    },
    error: function(status, jqXHR, error) {
      console.log("SEARCH.JS ERROR: " + error);
    }
  });
}

//----------- PARSE FILENAME HELPERS--------------
//var searchingJson : true if searching, false if uploading
function cleanName(name, searchingJson) {
  name = $.trim(name);
  if (searchingJson) { //searching
    name = name.toLowerCase();
    // remove everything except alphanumeric characters
    // name = name.replace(/-/g , " ");
    name = name.replace(/&/g, "and");
    name = name.replace(/[^-a-z0-9 ]/g , "");
    name = name.replace(/ law$/, "");
  }
  else { //uploading
    // remove everything except alphanumeric characters
    name = name.replace(/ /g , "-");
    name = name.replace(/&/g, "and");
    name = name.replace(/[^A-Za-z0-9-]/g , "");
  }
  return name;
}

function getProfessorLastName(professorName, searchingJson) {
  var professorLastName = professorName.replace(/[ ,\.]/g , "");
  professorLastName = cleanName(professorLastName, searchingJson);
  return professorLastName;
}

//------------ DISPLAY OUTLINES --------------
//course-name_[outline/exam]_year-semester[optional]_grade[optional]_professor_randomword_id.format
function appendSQLSearchStr(data) {
  origStr = "";
  origStr += '<div class="row outline">';
  if (data.thisuserheart == true) {
    origStr += '<div  class="heartc red">&hearts;</div>'
  }
  else {
    origStr += '<div  class="heartc">&hearts;</div>'
  }
  origStr += '<div class=heartnumber>' + data.hearts + '</div>'
  origStr += '<a href="https://toodope.s3.amazonaws.com/' + data.docname + '" target="_blank">' + data.random + '</a> (' + data.docname.split(".")[1] + ')<br />';
  origStr += '<b>Grade: </b>';
  if (data.grade != null) origStr += data.grade;
  else origStr += 'Unknown';
  origStr += ' | <b>Semester: </b>';
  if ((data.year != null) && (data.semester != null)) origStr += data.semester + " " + data.year;
  else origStr += 'Unknown';
  origStr += ' | <b>Course: </b>' + data.docname.split("_")[0].replace(/-/g, " ");
  origStr += ' | <b>Professor: </b>';
  if (data.professorlast != null) {
    var tempLastNames = data.professorlast.split("-");
    for (j = 0; j < tempLastNames.length; j++) origStr += tempLastNames[j].toUpperCase() + " ";
  }
  else origStr += "Unknown";
  if ((data.preview != null) && (data.preview.length > 0)) {
    origStr += "<br />" + data.preview
  }
  origStr += "</div>";
  return origStr;
}

function displaySQLOutlines(data) {
  //no data found
  var examStr = '<h3>Exam Answers</h3>';
  var outlineStr = '<h3>Outlines</h3>';
  var appendStr = '';
  if (data.length == 0) {
    examStr += '<div class="row outline">Sorry, none found.</div>';
    outlineStr += '<div class="row outline">Sorry, none found.</div>';
    appendStr += outlineStr + examStr;
    $("#displayOutlines").append(appendStr);
    $('.iconLoading').addClass("hide");
    $("#searchButton").removeClass("hide");
    return;
  }
  //some data found
  for (i = 0; i < data.length; i++) {
    currData = data[i];
    if (currData.doctype == 'Exam'){
      examStr += appendSQLSearchStr(currData);
    }
    else if (currData.doctype == 'Outline') {
      outlineStr += appendSQLSearchStr(currData);
    }
  }
  if (examStr == '<h3>Exam Answers</h3>') examStr += '<div class="row outline">Sorry, none found.</div>';
  if (outlineStr == '<h3>Outlines</h3>') outlineStr += '<div class="row outline">Sorry, none found.</div>';
  appendStr += outlineStr;
  appendStr += examStr;
  $("#displayOutlines").append(appendStr);
  $('.iconLoading').addClass("hide");
  $("#searchButton").removeClass("hide");
}

function positionDisplayOutlines() {
  var offset = 100 + $(".selector").height();
    $("#displayOutlines").css("margin-top", offset+"px");
}


//----------GOOGLE SIGN IN AND ANALYTICS-------------
var userName = "";

function handleSignedIn() {
  //sign-in
  const email = localStorage.getItem("email");
  $("#userLogin").prepend("Signed in as " + email);
  userName = email;
  userName = userName.replace(/harvard\.edu/g, "");
  userName = userName.replace(/[@\.]/g, "_");
  //analytics
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
  ga('create', 'UA-90767777-1', 'auto');
  ga('set', 'userId', email); // Set the user ID using signed-in user_id.
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
  var newFileName = checkUploadForm();
  var errorMessage = "";
  switch(newFileName) {
    case 0:
      errorMessage = "Please enter a course name.";
      break;
    case 1:
      errorMessage = "Please enter a professor name.";
      break;
    case 2:
      errorMessage = "Please select a grade.";
      break;
    case 3:
      errorMessage = "Please select a document type.";
      break;
    case 4:
      errorMessage = "Please select a semester.";
      break;
    case 5:
      errorMessage = "Please select a year.";
      break;
    default:
      initUpload(newFileName);
  }
  if (errorMessage.length > 0) {
    $(".errorMessage").removeClass("hide");
    $(".errorMessage").text(errorMessage);
    $('#uploadButton').removeClass("hide");
    $('.iconLoading').addClass("hide");
  }
}

//course-name_[outline/exam]_year-semester[optional]_grade[optional]_professor_randomword_id.format
function checkUploadForm() {
  //writing fields are filled in
  var courseName = $("#courseName").val();
  var professorName = $("#professorName").val();
  if (courseName.length == 0) {
    $("#courseName").css("border-color", "red");
    return 0;
  }
  else {
    $("#courseName").css("border-color", "black");
  }
  if (professorName.length == 0) {
    $("#professorName").css("border-color", "red");
    return 1;
  }
  else {
    $("#professorName").css("border-color", "black");
  }
  var selectFields = -1;
  //select fields are filled in
  $("select").each(function(i) {
    $(this).css("border-color", "black");
    if ($(this).val() == 0) {
      $(this).css("border-color", "red");
      selectFields = i;
      return false;
    }
  });
  if (selectFields != -1) return 2+selectFields;
  //create filename
  courseName = cleanName(courseName, false);
  var type = $("select").eq(1).val();
  var year = $("select").eq(3).val();
  var semester = $("select").eq(2).val();
  var grade = $("select").eq(0).val();
  var professorLastName = getProfessorLastName(professorName, false);
  var fileName = courseName + "_" + type + "_" + year + "-" + semester + "_" + grade + "_" + professorLastName + "_" + Date.now();
  return fileName;
}

function uploadFile(file, signedRequest, url){
  const xhr = new XMLHttpRequest();
  xhr.open('PUT', signedRequest);
  xhr.onreadystatechange = function() {
    if(xhr.readyState === 4){
      if(xhr.status === 200){
        var successMessage = "Thanks! " + file.name + " was uploaded.";
        $(".errorMessage").addClass("hide");
        $(".successMessage").removeClass("hide");
        $(".successMessage").text(successMessage);
        $("#courseName").val("");
        $("#professorName").val("");
        $("select").each(function(i) {
          $(this).val("0");
        });
        $("#file-upload").val("");
        $('#uploadButton').removeClass("hide");
        $('.iconLoading').addClass("hide");
      }
      else{
        $(".errorMessage").removeClass("hide");
        $(".errorMessage").text("Sorry, could not upload file at this time (aws).");
        $('#uploadButton').removeClass("hide");
        $('.iconLoading').addClass("hide");
        return;
      }
    }
  };
  xhr.send(file);
}

function getSignedRequest(file, newFileName){
  var fn = encodeURIComponent("uploads/" + newFileName);
  file.type = encodeURIComponent(file.type);
  var xhrreq = '/sign-s3?file-name='+fn+'&file-type='+file.type;
  console.log("UPLOADING sending: " + xhrreq);
  const xhr = new XMLHttpRequest();
  xhr.open('GET', xhrreq);
  xhr.onreadystatechange = function() {
    if(xhr.readyState === 4){
      if(xhr.status === 200){
        const response = JSON.parse(xhr.responseText);
        uploadFile(file, response.signedRequest, response.url);
      }
      else{
        $(".errorMessage").removeClass("hide");
        $(".errorMessage").text("Sorry, could not upload file at this time (key).");
        $('#uploadButton').removeClass("hide");
        $('.iconLoading').addClass("hide");
        return;
      }
    }
  };
  xhr.send();
}

function initUpload(newFileName){
  const files = document.getElementById('file-upload').files;
  const file = files[0];
  if(file == null){
    $("#file-upload").css("border-color", "red");
    $(".errorMessage").removeClass("hide");
    $(".errorMessage").text("Please select a file.");
    $('#uploadButton').removeClass("hide");
    $('.iconLoading').addClass("hide");
    return;
  }
  var filename = file.name;
  if ((filename.substr(-4,4) != ".pdf") && (filename.substr(-5,5) != ".docx")) {
    $("#file-upload").css("border-color", "red");
    $(".errorMessage").removeClass("hide");
    $(".errorMessage").text("Please choose a .docx or .pdf file.");
    $('#uploadButton').removeClass("hide");
    $('.iconLoading').addClass("hide");
    return;
  }
  else if (filename.substr(-4,4) == ".pdf") newFileName += ".pdf";
  else if (filename.substr(-5,5) == ".docx") newFileName += ".docx";
  $("#file-upload").css("border-color", "black");
  getSignedRequest(file, newFileName);
  $.ajax({
    url: '/encourage',
    type: 'POST',
    dataType: 'json',
    data: {
      page: "outlines",
      userName: userName,
      format: "json"
    }
  });
  $("#encourage").hide();
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
