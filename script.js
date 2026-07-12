//Lógica do nav
const nav = document.querySelector("nav");

const scrollParaSecao = (elementoAlvo) => {
  if (!elementoAlvo) return;

  const topo = elementoAlvo.getBoundingClientRect().top + window.pageYOffset - 30;

  window.scrollTo({
    top: topo,
    behavior: "smooth",
  });
};

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const destino = link.getAttribute("href");

    if (!destino || destino === "#") return;

    const secaoAlvo = document.querySelector(destino);

    if (!secaoAlvo) return;

    event.preventDefault();
    scrollParaSecao(secaoAlvo);
    history.pushState(null, "", destino);

    if (menuAberto && menuAberto.classList.contains("ativo")) {
      menuAberto.classList.remove("ativo");
    }
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
    rootMargin: "0px 0px -40px 0px",
  }
);

document.querySelectorAll(".reveal").forEach((element) => {
  observer.observe(element);
});
window.addEventListener("scroll", () => {
  if (window.scrollY > 0) {
    nav.classList.add("sticky-nav");
  } else {
    nav.classList.remove("sticky-nav");
  }
});

// Lógica do slider da section de resultados
let proximo = document.querySelector("#proximo");
let anterior = document.querySelector("#anterior");
let imagens = document.querySelectorAll(".axd-img");

let contador = 0;

const proximoSlide = () => {
  document.querySelector(".img0").classList.remove("img0");

  if (contador < 5) {
    contador++;
  } else {
    contador = 0;
  }

  imagens[contador].classList.add("img0");
  imagens[contador].computedStyleMap.opacity = "0";
  setTimeout(() => {
    imagens[contador].computedStyleMap.opacity = "1";
  }, 10);
};
proximo.addEventListener("click", proximoSlide);

const slideAnterior = () => {
  document.querySelector(".img0").classList.remove("img0");

  if (contador == 0) {
    contador = 5;
  } else {
    --contador;
  }

  imagens[contador].classList.add("img0");
  imagens[contador].style.opacity = "0";
  setTimeout(() => {
    imagens[contador].style.opacity = "1";
  }, 10);
};
anterior.addEventListener("click", slideAnterior);

// Lógica do slider da section de depoimentos
new Swiper(".card-wrapper", {
  loop: true,
  spaceBetween: 30,

  // pagination bullets
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    dynamicBullets: true,
  },

  // Navigation arrows
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  // Responsvive breakpoints
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    825: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
});

// Lógica do FAQ
let perguntas = document.querySelectorAll(".perguntas");

perguntas.forEach((itens) => {
  itens.addEventListener("click", () => {
    let taAtiva = itens.classList.contains("ativa");

    perguntas.forEach((outrasPerguntas) => {
      outrasPerguntas.classList.remove("ativa");
    });

    if (!taAtiva) {
      itens.classList.add("ativa");
    }
  });
});

// Lógica inputs da section agenda

// Data
const inputData = document.getElementById("data");
const hoje = new Date().toISOString().split("T")[0]; // "2026-07-03"
inputData.min = hoje;

// Número de telefone
const inputTelefone = document.getElementById("whatsapp");

inputTelefone.addEventListener("input", (e) => {
  let valor = e.target.value.replace(/\D/g, ""); // remove tudo que não é dígito
  valor = valor.slice(0, 11); // limita a 11 dígitos (DDD + 9 números)

  if (valor.length > 6) {
    valor = valor.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3");
  } else if (valor.length > 2) {
    valor = valor.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
  } else if (valor.length > 0) {
    valor = valor.replace(/^(\d*)/, "($1");
  }

  e.target.value = valor;
});

// Lógica menu hamburguer
let btnBurguer = document.querySelector("#menu-burguer");
let menuAberto = document.querySelector("#menu-burguer-aberto");
let btnFecharMenu = document.querySelector("#sair-menu-burguer span");

const mostrarMenu = () => {
  menuAberto.classList.toggle("ativo");
};

btnBurguer.addEventListener("click", mostrarMenu);
btnFecharMenu.addEventListener("click", mostrarMenu);
