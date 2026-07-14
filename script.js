/* =========================================================
   NAVEGAÇÃO (nav fixa + scroll suave)
   O scroll suave e o offset do topo já são feitos pelo CSS
   (scroll-behavior: smooth + scroll-padding-top), então aqui
   só precisamos fechar o menu mobile quando um link é clicado.
   ========================================================= */
const nav = document.querySelector("nav");
const menuAberto = document.querySelector("#menu-burguer-aberto");

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", () => {
    if (menuAberto?.classList.contains("ativo")) {
      menuAberto.classList.remove("ativo");
    }
  });
});

window.addEventListener("scroll", () => {
  nav.classList.toggle("sticky-nav", window.scrollY > 0);
});

/* =========================================================
   ANIMAÇÃO DE ENTRADA (elementos .reveal aparecem ao rolar)
   ========================================================= */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
    rootMargin: "0px 0px -40px 0px",
  },
);

document.querySelectorAll(".reveal").forEach((elemento) => {
  revealObserver.observe(elemento);
});

/* =========================================================
   SLIDER DA SECTION "RESULTADOS"
   As duas setas faziam praticamente a mesma coisa em direções
   opostas, então unifiquei numa função só (trocarSlide) para
   não repetir código.
   ========================================================= */
const botaoProximo = document.querySelector("#proximo");
const botaoAnterior = document.querySelector("#anterior");
const imagensResultado = document.querySelectorAll(".axd-img");

let indiceAtual = 0;

const trocarSlide = (direcao) => {
  const imagemAtual = imagensResultado[indiceAtual];
  imagemAtual.classList.remove("img0");

  const total = imagensResultado.length;
  indiceAtual = (indiceAtual + direcao + total) % total;

  const proximaImagem = imagensResultado[indiceAtual];
  proximaImagem.classList.add("img0");

  // Reinicia a transição de opacidade a cada troca
  proximaImagem.style.opacity = "0";
  setTimeout(() => {
    proximaImagem.style.opacity = "1";
  }, 10);
};

botaoProximo?.addEventListener("click", () => trocarSlide(1));
botaoAnterior?.addEventListener("click", () => trocarSlide(-1));

/* =========================================================
   SLIDER DE DEPOIMENTOS (Swiper)
   ========================================================= */
new Swiper(".card-wrapper", {
  loop: true,
  spaceBetween: 30,

  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    dynamicBullets: true,
  },

  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  breakpoints: {
    0: { slidesPerView: 1 },
    825: { slidesPerView: 2 },
    1024: { slidesPerView: 3 },
  },
});

/* =========================================================
   FAQ (perguntas que abrem/fecham)
   ========================================================= */
const perguntas = document.querySelectorAll(".perguntas");

perguntas.forEach((pergunta) => {
  pergunta.addEventListener("click", () => {
    const jaEstavaAtiva = pergunta.classList.contains("ativa");

    perguntas.forEach((outra) => outra.classList.remove("ativa"));

    if (!jaEstavaAtiva) {
      pergunta.classList.add("ativa");
    }
  });
});

/* =========================================================
   FORMULÁRIO DE AGENDAMENTO
   ========================================================= */

// Impede escolher uma data no passado
const inputData = document.getElementById("data");
if (inputData) {
  const hoje = new Date().toISOString().split("T")[0]; // ex: "2026-07-13"
  inputData.min = hoje;
}

// Máscara de telefone: (11) 99999-9999
const inputTelefone = document.getElementById("whatsapp");

inputTelefone?.addEventListener("input", (evento) => {
  let valor = evento.target.value.replace(/\D/g, ""); // só dígitos
  valor = valor.slice(0, 11); // DDD (2) + número (9)

  if (valor.length > 6) {
    valor = valor.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3");
  } else if (valor.length > 2) {
    valor = valor.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
  } else if (valor.length > 0) {
    valor = valor.replace(/^(\d*)/, "($1");
  }

  evento.target.value = valor;
});

/* =========================================================
   MENU HAMBURGUER (mobile)
   ========================================================= */
const btnBurguer = document.querySelector("#menu-burguer");
const btnFecharMenu = document.querySelector("#sair-menu-burguer span");

const alternarMenu = () => {
  menuAberto?.classList.toggle("ativo");
};

btnBurguer?.addEventListener("click", alternarMenu);
btnFecharMenu?.addEventListener("click", alternarMenu);

/* =========================================================
   WHATSAPP DA CLÍNICA
   Número usado tanto pelos botões fixos ("Falar no WhatsApp")
   quanto pelo envio do formulário de agendamento — fica num
   lugar só pra não repetir o número em três lugares diferentes.
   ========================================================= */
const NUMERO_WHATSAPP_CLINICA = "5582996389256";

// Conecta os botões estáticos "Falar no WhatsApp" (menu mobile e rodapé)
const linkWhatsappPadrao = `https://wa.me/${NUMERO_WHATSAPP_CLINICA}?text=${encodeURIComponent(
  "Olá, gostaria de saber mais sobre a Aura Odonto.",
)}`;

document
  .querySelectorAll("#bt-whatsapp-burguer, #bt-whatsapp-footer")
  .forEach((botao) => {
    botao.href = linkWhatsappPadrao;
    botao.target = "_blank";
    botao.rel = "noopener noreferrer";
  });

// Envia os dados do formulário de agendamento pelo WhatsApp
const formAgendamento = document.querySelector("#agendamento form");

const enviarMensagem = (evento) => {
  evento.preventDefault();

  const nome = document.querySelector("#nome")?.value.trim() || "";
  const whatsapp = document.querySelector("#whatsapp")?.value.trim() || "";
  const procedimento = document.querySelector("#procedimento")?.value || "";
  const data = document.querySelector("#data")?.value || "";
  const horario = document.querySelector("#horario")?.value || "";

  const texto = [
    "Olá, gostaria de agendar uma consulta.",
    `Nome: ${nome}`,
    `Telefone: ${whatsapp}`,
    `Procedimento: ${procedimento}`,
    `Data: ${data}`,
    `Horário: ${horario}`,
  ].join("\n");

  const link = `https://wa.me/${NUMERO_WHATSAPP_CLINICA}?text=${encodeURIComponent(texto)}`;
  const janela = window.open(link, "_blank");

  // Se o navegador bloquear o pop-up, abre na mesma aba como alternativa
  if (!janela) {
    window.location.href = link;
    return;
  }

  formAgendamento.reset();
};

formAgendamento?.addEventListener("submit", enviarMensagem);