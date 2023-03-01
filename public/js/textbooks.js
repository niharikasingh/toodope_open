$(document).ready(function(){

  if (localStorage.getItem("isSignedIn") !== 'true') {
    window.location.replace("/index.html");
  } else {
    handleSignedIn();
  }

  // ----- SEARCH BUTTON ---------
  $("#tbSearchButton").click(performSearch);
  $("#postButton").click(performUpload);
  $(".row.selector").keypress(function(e) {
      if(e.which == 13) {
        if ($('#tbSearchButton').css('display') != 'none') {
          performSearch();
        }
        else {
          performUpload();
        }
      }
  });
  $("#ISBNNumber").focusout(function(e) {
    if ($('#tbSearchButton').css('display') == 'none') {
      performSearch();
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

  // sign out
  $("#signout").click(function(e) {
    localStorage.setItem("isSignedIn", 'false');
    window.location.replace("/index.html");
  });

  //toggle between upload and search bars
  $(".selectortab").click(function (e) {
    if ($(this).hasClass("inactive")) {
      $(".selectortab").toggleClass("active inactive");
      $("#tbSearchButton").toggleClass("hide");
      $(".uploadOptions").toggleClass("hide");
      $("#currentlySelling").toggleClass("hide");
      $(".errorMessage").addClass("hide");
      $(".successMessage").addClass("hide");
      $('.iconLoading').addClass("hide");
      positionDisplayOutlines();
      if ($(this).hasClass("uploadOptions") == false) {
        $("#ISBNNumber").css("border-color", "black");
        $("select").css("border-color", "black");
      }
    }
  });

  $("#currentlySelling").on('click', '.row.strike', removeTextbook);

});

//----------END OF JQUERY WINDOW READY------------

function processIsbn(ISBNNumber) {
  ISBNNumber = ISBNNumber.replace(/[^0-9]*/g, '');
  if (ISBNNumber.length == 9) ISBNNumber += "0";
  if (ISBNNumber.length == 10) {
    ISBNNumber = "978" + ISBNNumber;
    var checkSum = 0;
    for (i = 0; i < ISBNNumber.length - 1; i++) {
      var tempNum = parseInt(ISBNNumber.substring(i, i+1));
      if (i % 2 == 0) {
        checkSum += tempNum;
      }
      else {
        checkSum += (3*tempNum);
      }
    }
    checkSum %= 10;
    checkSum = 10 - checkSum;
    ISBNNumber = ISBNNumber.substring(0, ISBNNumber.length - 1) + checkSum.toString();
  }
  return ISBNNumber;
}

//--------- Search for outlines -----------
function performSearch(e) {
  var onSearchScreen = ($('#tbSearchButton').css('display') != 'none');
  if (onSearchScreen) $("#tbSearchButton").addClass("hide");
  else $('#postButton').addClass("hide");
  $('.iconLoading').removeClass("hide");
  $(".errorMessage").addClass("hide");
  $("#ISBNNumber").css("border-color", "black");
  // get and clean ISBN number
  var ISBNNumber = $("#ISBNNumber").val();
  var condition = $("#textbookselect").val();
  ISBNNumber = processIsbn(ISBNNumber);
  console.log("Current ISBNNumber: " + ISBNNumber);
  if (ISBNNumber.length != 13) {
    $("#ISBNNumber").css("border-color", "red");
    $('.iconLoading').addClass("hide");
    if (onSearchScreen) $("#tbSearchButton").removeClass("hide");
    else $('#postButton').removeClass("hide");
    $(".errorMessage").removeClass("hide");
    $(".errorMessage").text("Please enter a 10 or 13 digit ISBN number.");
    return;
  }
  // get Amazon price
  $.ajax({
    url: '/awsTextbooks',
    type: 'GET',
    dataType: 'json',
    data: {
      AssociateTag: "toodope-20",
      IdType: "ISBN",
      ItemId: ISBNNumber,
      Operation: "ItemLookup",
      ResponseGroup: "Images,ItemAttributes,OfferSummary",
      SearchIndex: "Books",
      Service: "AWSECommerceService"
    },
    complete: function(data) {
      var results = JSON.parse(data.responseText);
      console.log("TEXTBOOKS.JS AWS SUCCESS: " + JSON.stringify(results));
      displayAwsTextbooks(results);
      $('.iconLoading').addClass("hide");
      if (onSearchScreen) $("#tbSearchButton").removeClass("hide");
      else $('#postButton').removeClass("hide");
    },
    error: function(status, jqXHR, error) {
      console.log("TEXTBOOKS.JS AWS ERROR: " + error);
      $('.iconLoading').addClass("hide");
      if (onSearchScreen) $("#tbSearchButton").removeClass("hide");
      else $('#postButton').removeClass("hide");
    }
  });
  // get student prices
  $.ajax({
    url: '/stuTextbooks',
    type: 'GET',
    dataType: 'json',
    data: {
      isbn: ISBNNumber,
      condition: (condition == 0) ? null : condition
    },
    complete: function(data) {
      var results = JSON.parse(data.responseText);
      console.log("TEXTBOOKS.JS STU SUCCESS: " + JSON.stringify(results));
      displayStuTextbooks(results);
      $('.iconLoading').addClass("hide");
      if (onSearchScreen) $("#tbSearchButton").removeClass("hide");
      else $('#postButton').removeClass("hide");
    },
    error: function(status, jqXHR, error) {
      console.log("TEXTBOOKS.JS STU ERROR: " + error);
      $('.iconLoading').addClass("hide");
      if (onSearchScreen) $("#tbSearchButton").removeClass("hide");
      else $('#postButton').removeClass("hide");
    }
  });
}

//------------ DISPLAY OUTLINES --------------
function displayAwsTextbooks(results) {
  var isFirstItem = true;
  var bStr = "";
  if (Object.keys(results).length <= 0) bStr += '<h3>Sorry, none found!</h3>';
  else {
    for (index in results) {
      var b = results[index];
      if (isFirstItem) {
        bStr += '<div class="row"><div class="two columns">';
        bStr += b.ImageURL ? '<img alt="Book Cover Image" src="' + b.ImageURL + '" width="' + b.ImageWidth + '" height="' + b.ImageHeight + '"/>' : "";
        bStr += '</div><div class="ten columns">';
        bStr += b.Title ? '<h5>' + b.Title + '</h5>' : "";
        bStr += b.Author ? '<h6>' + b.Author.join(", ") + '</h6></div></div><br />': "";
        isFirstItem = false;
      }
      bStr += '<div class="row outline"><a href="' + b.DetailPageURL + '" target="_blank" ">Buy on Amazon</a>'
      bStr += b.Type ? " (" + b.Type + ") <br />" : " <br />";
      bStr += "<b>New: </b>";
      bStr += b.LowNewPrice ? b.LowNewPrice : (b.ListPrice ? b.ListPrice : "Not Available");
      bStr += " | <b>Used: </b>";
      bStr += b.LowUsedPrice ? b.LowUsedPrice : "Not Available";
      bStr += "</div>";
    }
    var $amazonResults = $("#amazonResults");
    $amazonResults.empty();
    $amazonResults.append(bStr);
  }
}

function displayStuTextbooks(data) {
  if (data.length == 0) {
    $("#studentResults").empty();
    return;
  }
  var bStr = '<br><h5>Student Results</h5>';
  for (i = 0; i < data.length; i++) {
    currData = data[i];
    bStr += '<div class="row outline"><b>$' + currData.price + '</b> | ';
    bStr += currData.condition + ' | ';
    bStr += '<a href="mailto:' + currData.users + '" target="_blank">' + currData.users + '</a>';
  }
  $("#studentResults").empty();
  $("#studentResults").append(bStr);
}

function positionDisplayOutlines() {
  var offset = 100 + $(".selector").height();
    $("#displayOutlines").css("margin-top", offset+"px");
}

var checkreEmail = /^[^;\s@]+@[^;\s@]+\.[^;\s@]+$/;
var checkrePrice = /^[0-9]+\.?[0-9]{0,2}/g;

//----------PERFORM UPLOAD---------------------------
function performUpload() {
  $(".errorMessage").addClass("hide");
  $(".successMessage").addClass("hide");
  $('#postButton').addClass("hide");
  $('.iconLoading').removeClass("hide");
  $("#ISBNNumber").css("border-color", "black");
  $("#textbookselect").css("border-color", "black");
  $("#contactMe").css("border-color", "black");
  $("#priceNumber").css("border-color", "black");
  var tempPrice = $("#priceNumber").val();
  tempPrice = tempPrice.replace(/[^0-9\.]/g, '');
  $("#priceNumber").val(tempPrice);
  var errorMessage = "";
  var tempIsbn = processIsbn($("#ISBNNumber").val());
  var condition = $("#textbookselect").val();
  if (tempIsbn.length != 13) {
    errorMessage = "Please enter a 10 or 13 digit ISBN number.";
    $("#ISBNNumber").css("border-color", "red");
  }
  else if (condition == 0) {
    errorMessage = "Please enter the condition of your textbook.";
    $("#textbookselect").css("border-color", "red");
  }
  else if (tempPrice.match(checkrePrice) == null) {
    errorMessage = "Please enter a valid price.";
    $("#priceNumber").css("border-color", "red");
  }
  else if ($("#contactMe").val().match(checkreEmail) == null) {
    errorMessage = "Please enter a valid e-mail address.";
    $("#contactMe").css("border-color", "red");
  }
  if (errorMessage.length > 0) {
    $(".errorMessage").removeClass("hide");
    $(".errorMessage").text(errorMessage);
  }
  else {
    $.ajax({
      url: '/postTextbooks',
      type: 'GET',
      dataType: 'json',
      data: {
        isbn: tempIsbn,
        condition: (condition == 0) ? null : condition,
        price: tempPrice,
        users: $("#contactMe").val()
      },
      complete: function(data) {
        var results = JSON.parse(data.responseText);
        console.log("TEXTBOOKS.JS POST SUCCESS: " + JSON.stringify(results));
        $('.iconLoading').addClass("hide");
        $("#postButton").removeClass("hide");
        $(".successMessage").removeClass("hide");
        $(".successMessage").text("Your textbook listing was posted.");
        getUserTextbooks(userName);
      },
      error: function(status, jqXHR, error) {
        console.log("TEXTBOOKS.JS POST ERROR: " + error);
        $(".errorMessage").removeClass("hide");
        $(".errorMessage").text("Sorry, there was an error while posting. Please try again later.");
        $('.iconLoading').addClass("hide");
        $("#postButton").removeClass("hide");
      }
    });
  }
  $('#postButton').removeClass("hide");
  $('.iconLoading').addClass("hide");
}

function getUserTextbooks(un) {
  $.ajax({
    url: '/getUserTextbooks',
    type: 'GET',
    dataType: 'json',
    data: {
      user: un
    },
    complete: function(data) {
      var results = JSON.parse(data.responseText);
      console.log("TEXTBOOKS.JS STU SUCCESS: " + JSON.stringify(results));
      displayUserTextbooks(results);
    },
    error: function(status, jqXHR, error) {
      console.log("TEXTBOOKS.JS STU ERROR: " + error);
    }
  });
}

function displayUserTextbooks(data) {
  if (data.length == 0) return;
  appendStr = "<h5>You are currently selling:</h5>"
  for (i = 0; i < data.length; i++) {
    var tempData = data[i];
    appendStr += "<div class = 'row strike'><button>Remove</button>&nbsp;&nbsp;&nbsp;ISBN ";
    appendStr += tempData.isbn;
    appendStr += " for $" + tempData.price + "<div class='id hide'>" + tempData.id + "</div></div>";
  }
  $("#currentlySelling").empty();
  $("#currentlySelling").append(appendStr);
}

function removeTextbook() {
  $(this).toggleClass("striked");
  var sold = false;
  if ($(this).hasClass("striked")) sold = true;
  var id = $(this).children(".id").text();
  $.ajax({
    url: '/removeTextbook',
    type: 'GET',
    dataType: 'json',
    data: {
      id: id,
      sold: sold
    }
  });
}

//----------GOOGLE SIGN IN AND ANALYTICS-------------
var userName = "";

function handleSignedIn() {
  //sign-in
  const email = localStorage.getItem("email");
  $("#userLogin").prepend("Signed in as " + email);
  $("#contactMe").val(email);
  userName = email;
  getUserTextbooks(userName);
  //analytics
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
