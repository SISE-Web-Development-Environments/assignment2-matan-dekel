jQuery.validator.addMethod("passwordCheck",passwordCheck, "Password must contain atleast one latter and one number");
$().ready(function(){
    $("#register_form").validate({
        rules:{
            password:{
                required: true,
                passwordCheck: true,
                minlength:6

            }
            
        },
        messages:{

        }
    })
})

function passwordCheck(value,element,param){
    if (this.optional(element)) {
        return true;
    } else if (!/[A-Z]/.test(value)) {
        return false;
    } else if (!/[a-z]/.test(value)) {
        return false;
    } else if (!/[0-9]/.test(value)) {
        return false;
    }
    return true;
}

function scrollto(div) {
    document.getElementById("register").style.display=("none");
    document.getElementById("login").style.display=("none");
    document.getElementById("welcome").style.display=("none");
    document.getElementById("main-page").style.display=("none");
    let toShow = document.getElementById(div);
    toShow.style.display=("block");

}
function tryLogin(){
    let form = document.getElementById("login_form")
    let username = form.elements["name"].value
    let password = form.elements["password"].value
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem("p", "p");
        if (localStorage.getItem(username) === null) {
            alert("this username doesn't exist")
            scrollto("welcome")
        }
        else{
            if (localStorage.getItem(username) !== password) {
            alert("wrong password")
            scrollto("welcome")
            }
            else{
        scrollto("main-page")
            }
        }
    }
}


function register() {
    let form = document.getElementById("register_form")
    let username = form.elements["account_name"].value
    let password = form.elements["password"].value
    let full_name = form.elements["full_name"].value
    let email = form.elements["email"].value
    let date = form.elements["date"].value
    if(username==""||password==""||full_name==""||email==""||!date){
        alert("one of the cells or more are empty")
    }
    else{
        if(password.length<6){
            alert("password too short")
        }
        else{
        var isAlphaNumeric=true
    for (i = 0, len = password.length; i < len; i++) {
        code = password.charCodeAt(i);
        if (!(code > 47 && code < 58) && // numeric (0-9)
            !(code > 64 && code < 91) && // upper alpha (A-Z)
            !(code > 96 && code < 123)) { // lower alpha (a-z)
                isAlphaNumeric= false;
                            }
      }
          if(!isAlphaNumeric){
            alert("not alpha numeric")
          }
        
          var notNum=true
          for (i = 0, len = full_name.length; i < len; i++) {
        code = full_name.charCodeAt(i);
        if (code > 47 && code < 58){
            notNum=false;
        }
    }
    if(!notNum){
            alert("there is numbers in name")
          }
          else{
            localStorage.setItem(username, password);
          }		
}
}
        scrollto("welcome")
}