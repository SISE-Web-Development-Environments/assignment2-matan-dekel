var modal_shown = false;

function showModal(){
    modal_shown=true;
    let modal = document.getElementById("myModal");
    modal.style.display=("block");
}

// When the user clicks on <span> (x), close the modal
function closeModal() {
    modal_shown=false;
    let modal = document.getElementById("myModal");
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    let modal = document.getElementById("myModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

$(document).ready(function(){
    $(document).keydown(function(e){
        if(modal_shown && e.keyCode==27){
            closeModal();
        }
    })
})