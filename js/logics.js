

function passwordCheck(value,element){
    if (this.optional(element)) {
        return true;
    } else if (!/[a-z]/.test(value)) {
        return false;
    } else if (!/[0-9]/.test(value)) {
        return false;
    }
    return true;
}




$(function(){
    $.validator.addMethod("passwordCheck",passwordCheck,
    "password must contain atleaset 1 letter and 1 charachter");
    $("#register_form").validate({
        rules:
        {
            account_name:{
                required: true
            },
            password:{
                required: true,
                minlength: 6,
                passwordCheck: true
                
            },
            full_name:{
                required: true
            },
            email:{
                email: true,
                required: true
            },
            date:{
                required: true
            }
        }
    });

    $("#settings_form").validate({
        rules:
        {
            time:{
                required: true,
                min:60
            },
            food:{
                required: true,
                range: [50,90]
            },
            monsters:{
                required:true,
                range:[1,4]
            }
        }
    })
});



$(document).ready(function(){
    $("#register_form").submit(function(e){
        e.preventDefault()
        let username = $("#register_form").find('input[name=account_name]').val();
        let password = $("#register_form").find('input[name=password]').val();
        localStorage.setItem(username, password);
        scrollto("welcome")
    });

    $("#settings_form").submit(function(e){
        e.preventDefault();
            alert(3)
            //send parameters to gameva
            scrollto("main-page");
            Start();
    })

    $("#up_settings").keydown(function(e){
        e.preventDefault();
        let form = document.getElementById("settings_form");
        frmElement = form.elements["up"];
        frmElement.value = e.keyCode;
        })

    $("#down_settings").keydown(function(e){
        e.preventDefault();
        let form = document.getElementById("settings_form");
        frmElement = form.elements["down"];
        frmElement.value = e.keyCode;
         })

    $("#right_settings").keydown(function(e){
        e.preventDefault()
        let form = document.getElementById("settings_form");
        frmElement = form.elements["right"];
        frmElement.value = e.keyCode;
                })

    $("#left_settings").keydown(function(e){
        e.preventDefault();
        let form = document.getElementById("settings_form");
        frmElement = form.elements["left"];
        frmElement.value = e.keyCode;
      })

})

function randomizeSettings(){
        let form = document.getElementById("settings_form");
        frmElementUp = form.elements["up"];
        frmElementUp.value = 38;
        frmElementDown = form.elements["down"];
        frmElementDown.value = 40;
        frmElementRight = form.elements["right"];
        frmElementRight.value = 39;
        frmElementLeft = form.elements["left"];
        frmElementLeft.value = 37;
        var time= form.elements["time"];
        time.value = Math.floor(Math.random() * 180) + 60;
        var food= form.elements["food"];
        food.value = Math.floor(Math.random() * 90) + 50;
        var monsters= form.elements["monsters"];
        monsters.value = Math.floor(Math.random() * 4) + 1;
        var fivePoints= form.elements["5points"];
        fivePoints.value = getRandomColor()
        var fifteenPoints= form.elements["15points"];
        fifteenPoints.value = getRandomColor()
        var twentyFivePoints= form.elements["25points"];
        twentyFivePoints.value = getRandomColor()
        
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  

function scrollto(div) {
    document.getElementById("register").style.display=("none");
    document.getElementById("login").style.display=("none");
    document.getElementById("welcome").style.display=("none");
    document.getElementById("main-page").style.display=("none");
    document.getElementById("settings").style.display=("none");
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
        scrollto("settings")
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