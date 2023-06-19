const container = document.querySelectorAll(".container-wrapper div");

function elementSelected() {
    container.forEach(function(element, index){
        element.addEventListener("click", function clickEvent() {
            if(index === 0) {
                console.log("Clicou na div1");
            }else if(index === 1) {
                console.log("Clicou na div2");
            }else {
                console.log("Clicou na div3");
            }
        })
    })
};

elementSelected();

console.log("teste");