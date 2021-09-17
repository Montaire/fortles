module.exports = function(){
    var element = document.getElementsByClassName("e-print-area")[0];
    while(element = element.parentElement){
        element.classList.add("e-print-area-container");
    }
    print();
}