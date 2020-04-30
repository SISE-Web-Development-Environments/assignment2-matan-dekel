function showModal(){
    let modal = document.getElementById("myModal");
    modal.style.display=("block");
}

// When the user clicks on <span> (x), close the modal
function closeModal() {
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