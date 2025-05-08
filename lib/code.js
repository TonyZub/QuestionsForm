// #region Constants

const REQ_URL = "https://script.google.com/macros/s/AKfycbz8z5SD0HSqAFN2Sy0n3tTQFhRq8ZlycokkRcLbfcuXY7bTGYAxK7HldJYG-qH7BgE/exec";
const PRELOADER_HTML = '<div class="d-flex justify-content-center mt-5"><div class="spinner-border align-self-center d-flex" role="status"><span class="visually-hidden">Loading...</span></div></div>';
const PAGE_DIV_ID = "page";
const STYLE_NODE_ID = "style"
const CODE_NODE_ID = "code";
const CODE_HOLDER_NODE_IDE = "codeHolder";

// #endregion


// #region Fields

var cookies = GetCookies();
var screenHeight = window.screen.height;
var screenWidth = window.screen.width;
var today = GetTodayDateString();
var isWide = window.innerWidth > 500;

// #endregion


// #region Functions - Cookies

function GetCookies(){
  return document.cookie
    .split(';')
    .map(cookie => cookie.split('='))
    .reduce((accumulator, [key, value]) => ({ ...accumulator, [key.trim()]: decodeURIComponent(value) }), {});
}

function SetCookie(name, value){
  if(name != "") document.cookie = name + "=" + (value || "");
}

// #endregion


// #region Request functions

function MakeRequest(requestType, functionName, parameter){
  let request = new XMLHttpRequest();
  let requestBody = JSON.stringify(new Object({token: cookies["Token"], functionName: functionName, parameter: parameter}));
  request.open(requestType, REQ_URL);
  request.send(requestBody);   
  return request;
}

function CheckToken(){
  let request = MakeRequest("POST", "CheckToken");
  request.onload = function() {
    if (request.status != 200) {
      console.log(request.status);
      switch(request.status){
        case 404:
          SetInnerPage("", "Произошла ошибка 404 =(");
          break;
        default:
          alert("Ошибка сервера");
          break;
      }
    } 
    else {
      let responseJSON = JSON.parse(request.response);
      console.log(responseJSON);
      SetInnerPageElements(responseJSON);
    };
  };
  request.onerror = function(request) {
    alert("Connection error");
  };
}

function SetInnerPageElements(pageElements, message){

  SetCookie("Token", pageElements.token)

  GetElementById(PAGE_DIV_ID).innerHTML = pageElements.page == undefined ? "" : pageElements.page
  GetElementById(STYLE_NODE_ID).innerHTML = pageElements.style == undefined ? "" : pageElements.style
  GetElementById(CODE_NODE_ID).innerHTML = pageElements.code == undefined ? "" : pageElements.code

  /* if(pageElements.code != undefined && pageElements.code != ""){
    let newScriptNode = document.createElement('script');
    newScriptNode.id = CODE_NODE_ID
    newScriptNode.innerHTML = pageElements.code
    GetElementById(CODE_HOLDER_NODE_IDE).appendChild(newScriptNode);
  } */

  if(message != ""){
    alert(message)
  }
}

function Unload(){
  GetElementById(PAGE_DIV_ID).innerHTML = ""
  GetElementById(STYLE_NODE_ID).innerHTML = ""
  GetElementById(CODE_NODE_ID).innerHTML = ""
/*   GetElementById(CODE_NODE_ID).remove() */
}

function SetPreloaderElement(){

}

// #endregion


// #region Service functions

function FormatDateForHTML(dateObj){
  let year = dateObj.getFullYear();
  let month = dateObj.getMonth() + 1;
  if(month.toString().length == 1) month = "0" + month.toString();
  let date = dateObj.getDate();
  if(date.toString().length == 1) date = "0" + date.toString();
  let string = year + "-" + month + "-" + date;
  return string;
}

function GetTodayDateString(){
  return FormatDateForHTML(new Date());
}

function DelayCall(delegate, seconds, doRepeat){
  return doRepeat ? setInterval(() => {delegate()},seconds * 1000) : setTimeout(() => {delegate()},seconds * 1000); 
}

function GetElementById(id, where){
  return where == null ? document.getElementById(id) : where.getElementById(id);
}

function GetElementsByClass(className, where){
  return where == null ? document.getElementsByClassName(className) : where.getElementsByClassName(className);
}

function GetELementsByName(name, where){
  return where == null ? document.getElementsByName(name) : where.getElementsByName(name);
}

function GetElementsByTagName(tagName, where){
  return where == null ? document.getElementsByTagName(tagName) : where.getElementsByTagName(tagName);
}

function Titleize(str) {
  let upperString = "";
  for(let i = 0; i < str.length; i++){
    upperString += str.substring(i, i+1).toUpperCase();
  }
  return upperString
}

// #endregion


// #region Extensions

Object.defineProperty(String.prototype, "replaceAll", {
    value: function replaceAll(a, b) {
      let regex = new RegExp(a, "g"); 
      return this.replace(regex, b);
    },
    writable: true,
    configurable: true
});

Object.defineProperty(String.prototype, "contains", {
    value: function contains(a) {
      return this.indexOf(a) != -1;
    },
    writable: true,
    configurable: true
});

// #endregion

function startCountdownTimer(seconds, elementId, formId, nextPage) {
    const timerElement = document.getElementById(elementId);
    const interval = setInterval(() => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    timerElement.textContent = `${min}:${sec < 10 ? '0' + sec : sec}`;
    seconds--;

    if (seconds < 0) {
        clearInterval(interval);
        submitForm(formId, nextPage);
    }
    }, 1000);
}