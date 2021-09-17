function showContent(id) {
    document.getElementById("sidebar-content-frame").style.display = "block";
    document.getElementById(id).style.display = "block";
}

function hideContent(id) {
    document.getElementById("sidebar-content-frame").style.display = "none";
    document.getElementById(id).style.display = "none";
}


var btns = document.getElementsByClassName("sidebar-button");
//document.write(btns.length);

for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function () {
        var current = document.getElementsByClassName("active");
        current[0].className = current[0].className.replace(" active", "");
        this.className += " active";
    });
}


