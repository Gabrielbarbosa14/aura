/* =========================================================
   NAVEGAÇÃO (nav fixa + scroll suave)
   O scroll suave e o offset do topo já são feitos pelo CSS
   (scroll-behavior: smooth + scroll-padding-top), então aqui
   só precisamos fechar o menu mobile quando um link é clicado.
   ========================================================= */
const nav = document.querySelector("nav");
const menuAberto = document.querySelector("#menu-burguer-aberto");
const menuOverlay = document.querySelector("#menu-overlay");

// Guarda de onde o usuário estava rolando, pra devolver a posição certa
// depois de fechar o menu.
let posicaoScrollAntesDoMenu = 0;

const abrirMenuMobile = () => {
  posicaoScrollAntesDoMenu = window.scrollY;

  menuAberto?.classList.add("ativo");
  menuOverlay?.classList.add("ativo");
  document.body.classList.add("menu-mobile-aberto");

  // "overflow: hidden" sozinho não trava o scroll por toque no iOS Safari.
  // Tirar o body do fluxo normal com position:fixed impede fisicamente
  // o dedo de rolar a página por trás do menu, em qualquer navegador.
  document.body.style.position = "fixed";
  document.body.style.top = `-${posicaoScrollAntesDoMenu}px`;
  document.body.style.width = "100%";
};

const fecharMenuMobile = () => {
  menuAberto?.classList.remove("ativo");
  menuOverlay?.classList.remove("ativo");
  document.body.classList.remove("menu-mobile-aberto");

  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.width = "";
  // "instant" ignora o scroll-behavior:smooth do CSS aqui de propósito:
  // essa restauração é só desfazer a "ilusão" do travamento de scroll,
  // o usuário nunca saiu desse ponto de verdade, então não deve animar.
  window.scrollTo({ top: posicaoScrollAntesDoMenu, left: 0, behavior: "instant" });
};

// Toca fora do menu (no fundo escurecido) = fecha o menu
menuOverlay?.addEventListener("click", fecharMenuMobile);

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", () => {
    if (menuAberto?.classList.contains("ativo")) {
      fecharMenuMobile();
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

// Precarrega todas as imagens para evitar delay
imagensResultado.forEach((img) => {
  const novaImg = new Image();
  novaImg.src = img.src;
});

const trocarSlide = (direcao) => {
  const imagemAtual = imagensResultado[indiceAtual];
  imagemAtual.classList.remove("img0");

  const total = imagensResultado.length;
  indiceAtual = (indiceAtual + direcao + total) % total;

  const proximaImagem = imagensResultado[indiceAtual];
  proximaImagem.classList.add("img0");
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
  const estaAberto = menuAberto?.classList.contains("ativo");
  if (estaAberto) {
    fecharMenuMobile();
  } else {
    abrirMenuMobile();
  }
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

/* =========================================================
   CORREÇÃO: link recarregando a página ao clicar no card
   Os cards de depoimento são <a href=""> apontando pra si
   mesmos, então um clique neles recarrega a página inteira
   (perde o estado do JS, volta pro topo, etc). Como o card
   não navega pra lugar nenhum de verdade, só cancelamos essa
   navegação.
   ========================================================= */
document.querySelectorAll(".card-list .card-link").forEach((card) => {
  card.addEventListener("click", (evento) => evento.preventDefault());
});

/* =========================================================
   ABAIXO: proposta de "ver depoimento completo" (COMENTADA)
   ---------------------------------------------------------
   Contexto: quando o comentário do cliente é grande, o texto
   estoura a altura fixa do card e vaza visualmente. A ideia
   era limitar o texto a 3 linhas via CSS (line-clamp) e abrir
   um modal com o depoimento inteiro ao clicar no card ou no
   botão "Ler mais" (colocado ao lado do nome do cliente).

   Pra isso funcionar por completo, também seria necessário:
   - Trocar cada <a href="" class="card-link"> por
     <div class="card-link" tabindex="0" role="button" aria-haspopup="dialog">
     (assim dá pra usar Enter/Espaço no teclado também, e não
     depende só deste preventDefault acima)
   - Adicionar, dentro de cada .pessoa, um
     <button type="button" class="ver-mais-btn">Ler mais</button>
     logo depois do <h2 class="card-title">
   - Adicionar antes do </body> o markup do modal reaproveitável
     (#modal-depoimento-overlay, com estrelas/texto/foto/nome)
   - Estilos correspondentes no style2.css (também comentados lá)

   Nada disso está ativo agora — é só a referência do que foi
   implementado antes, caso você queira retomar.
   ========================================================= */

// const modalDepoimentoOverlay = document.querySelector("#modal-depoimento-overlay");
// const modalDepoimentoEstrelas = document.querySelector("#modal-depoimento-estrelas");
// const modalDepoimentoTexto = document.querySelector("#modal-depoimento-texto");
// const modalDepoimentoFoto = document.querySelector("#modal-depoimento-foto");
// const modalDepoimentoNome = document.querySelector("#modal-depoimento-nome");
// const modalDepoimentoFechar = document.querySelector("#modal-depoimento-fechar");
//
// const abrirModalDepoimento = (card) => {
//   const estrelas = card.querySelectorAll(".estrelas-avaliacao img");
//   const texto = card.querySelector(".badge")?.textContent.trim() || "";
//   const foto = card.querySelector(".pessoa img")?.src || "";
//   const nome = card.querySelector(".card-title")?.textContent.trim() || "";
//
//   modalDepoimentoEstrelas.innerHTML = "";
//   estrelas.forEach((estrela) => {
//     modalDepoimentoEstrelas.appendChild(estrela.cloneNode());
//   });
//
//   modalDepoimentoTexto.textContent = texto;
//   modalDepoimentoFoto.src = foto;
//   modalDepoimentoNome.textContent = nome;
//
//   modalDepoimentoOverlay.classList.add("ativo");
//   document.body.classList.add("modal-depoimento-aberto");
// };
//
// const fecharModalDepoimento = () => {
//   modalDepoimentoOverlay.classList.remove("ativo");
//   document.body.classList.remove("modal-depoimento-aberto");
// };
//
// document.querySelectorAll(".card-list .card-link").forEach((card) => {
//   card.addEventListener("click", (evento) => {
//     if (evento.target.closest(".ver-mais-btn")) return;
//     abrirModalDepoimento(card);
//   });
//
//   card.addEventListener("keydown", (evento) => {
//     if (evento.key === "Enter" || evento.key === " ") {
//       evento.preventDefault();
//       abrirModalDepoimento(card);
//     }
//   });
// });
//
// document.querySelectorAll(".ver-mais-btn").forEach((botao) => {
//   botao.addEventListener("click", (evento) => {
//     evento.stopPropagation();
//     abrirModalDepoimento(evento.target.closest(".card-link"));
//   });
// });
//
// modalDepoimentoFechar?.addEventListener("click", fecharModalDepoimento);
// modalDepoimentoOverlay?.addEventListener("click", (evento) => {
//   if (evento.target === modalDepoimentoOverlay) fecharModalDepoimento();
// });
//
// window.addEventListener("keydown", (evento) => {
//   if (evento.key === "Escape" && modalDepoimentoOverlay.classList.contains("ativo")) {
//     fecharModalDepoimento();
//   }
// });