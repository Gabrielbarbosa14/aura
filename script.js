const nav = document.querySelector('nav');

window.addEventListener('scroll', () => {
    if (window.scrollY > 0) {
        nav.classList.add('sticky-nav');
    } else {
        nav.classList.remove('sticky-nav');
    }
});

let proximo = document.querySelector("#proximo")
let anterior = document.querySelector("#anterior")
let imagens = document.querySelectorAll(".axd-img")

let contador = 0

function proximoSlide() {
    document.querySelector(".img0").classList.remove("img0")

    if(contador < 5){
        ++contador
    } else{
        contador = 0
    }

    imagens[contador].classList.add("img0")
    imagens[contador].style.opacity = "0"
    setTimeout(() => {
        imagens[contador].style.opacity = "1"
    }, 10)
}

function slideAnterior() {
    document.querySelector(".img0").classList.remove("img0")

    if(contador == 0){
        contador = 5
    } else{
        --contador
    }

    imagens[contador].classList.add("img0")
    imagens[contador].style.opacity = "0"
    setTimeout(() => {
        imagens[contador].style.opacity = "1"
    }, 10)
}
console.log(imagens)
