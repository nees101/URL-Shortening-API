$(".hamburger").on("click",function(){
  $(".menu-links").toggle();
});

$(".url").on("change",function(){
  $("#error").css("display","none");
  $(".url").removeClass("input-error");
});

$(".result").on("click",".copy-btn",function(e){

  var links = this.parentElement.parentElement;
  $(this).html("Copied!").addClass("copied");
  navigator.clipboard.writeText($(links).children(".shortened-url").text());   // Copy to browser clipboard
  setTimeout(function () {
            $(".copy-btn").html("Copy").removeClass("copied");
          }, 5000);

  e.preventDefault();
});


$(window).on("load",function(){
if(sessionStorage.length>0){
  let values = get();
  displayUrl(values.original , values.shortened);
}else{
  console.log("No items in storage.")
}
});


$("form").on("submit",function(e){
   e.preventDefault();
  const url = $(".url").val();
  const url_validate = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  if (url===""){
  $("#error").css("display","block");
  $(".url").addClass("input-error");
  }else if(!url_validate.test(url)){
  $("#error").css("display","block").html("<em>Please enter a valid URL </em>");
  $(".url").addClass("input-error");
}
  else{
  console.log("Successfully submitted!");
  $("#error").css("display","none");
  $(".url").removeClass("input-error");
  url==="";
  const link = "https://api.shrtco.de/v2/shorten?url="
  const apiUrl = link+url;
  fetch(apiUrl)
    .then(response => response.json())
    .then(data =>{
      storeUrl(url , data.result.full_short_link),
      displayUrl(url,data.result.full_short_link)});
  }

});


// Storing in session storage

function storeUrl(originalUrl,shortUrl){

  let myObj = { original: originalUrl, shortened: shortUrl };
  let values = get();
  values[values.length]=myObj;
  sessionStorage.setItem("values", JSON.stringify(values));
  location.reload();
}


function displayUrl(originalUrl,shortUrl){
  let values = get();
  for (let x=0;x<values.length;x++){
       console.log(values[x]);
        let original = values[x].original;
        let shortened = values[x].shortened;
        getlinks(original,shortened);
        $(".shortened-links").css("display","flex");
        if(screen.width<=400){
          $(".original-url").html(originalUrl.slice(0,33)+"...");
        }else {
        $(".original-url").html(originalUrl);
        }

        $(".shortened-url").html(shortUrl);

}

}

//Get items in local storage
function get() {
    let values;
    if (sessionStorage.getItem("values") == null) {
      values = [];
    } else {
      values = JSON.parse(sessionStorage.getItem("values"));
      console.log(values);
    }
    return values;
}


function getlinks(original,shortened){

  $( ".result" ).css("display","block").prepend( `<div class="shortened-links row">
   <div class="col original-url">`+
  original +
   `</div>
   <hr class="divider"/>
   <div class="col  shortened-url">`+
  shortened +
   `</div>
   <div class="col">
   <button class="copy-btn" >Copy</button>
   </div>
  </div>` );
}
