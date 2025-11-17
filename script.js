document.addEventListener("DOMContentLoaded", () => {
  /* =========================
     MENU DE CONFIGURAÇÕES
     (tema + fonte)
  ========================== */
  const body = document.body;

  const settingsBtn = document.querySelector(".topbar-settings");
  const settingsMenu = document.getElementById("settingsMenu");
  const themeToggle = document.getElementById("themeToggle");
  const fontIncrease = document.getElementById("fontIncrease");
  const fontDecrease = document.getElementById("fontDecrease");

  const THEME_KEY = "sensorial-theme";
  const FONT_KEY = "sensorial-font-scale";

  const MIN_SCALE = 0.85;
  const MAX_SCALE = 1.25;
  const STEP_SCALE = 0.05;

  function clampScale(value) {
    if (value < MIN_SCALE) return MIN_SCALE;
    if (value > MAX_SCALE) return MAX_SCALE;
    return value;
  }

  // Aplica tema claro/escuro no body e atualiza label + ícone
  function applyTheme(theme) {
    if (theme === "dark") {
      body.classList.add("dark-theme");
    } else {
      body.classList.remove("dark-theme");
    }

    if (themeToggle) {
      const labelEl = themeToggle.querySelector(".settings-menu-label");
      const iconEl = themeToggle.querySelector("i");

      if (labelEl) {
        labelEl.textContent = theme === "dark" ? "Tema claro" : "Tema escuro";
      }

      if (iconEl) {
        iconEl.classList.remove("fa-moon", "fa-sun");
        iconEl.classList.add(theme === "dark" ? "fa-sun" : "fa-moon");
      }
    }

    localStorage.setItem(THEME_KEY, theme);
  }

  // Guarda o tamanho original da fonte de cada elemento (uma vez)
  function initBaseFontSizes() {
    const elements = document.body.querySelectorAll("*");
    elements.forEach((el) => {
      if (!el.dataset.baseFontSize) {
        const size = parseFloat(window.getComputedStyle(el).fontSize);
        if (!isNaN(size)) {
          el.dataset.baseFontSize = String(size);
        }
      }
    });
  }

  let currentFontScale = 1;

  // Aplica a escala em todos os elementos que têm base gravada
  function applyFontScale() {
    const elements = document.body.querySelectorAll("*");
    elements.forEach((el) => {
      const base = parseFloat(el.dataset.baseFontSize || "");
      if (!isNaN(base)) {
        el.style.fontSize = (base * currentFontScale).toFixed(2) + "px";
      }
    });
    localStorage.setItem(FONT_KEY, String(currentFontScale));
  }

  // Carrega preferências salvas
  let currentTheme = localStorage.getItem(THEME_KEY) || "light";
  applyTheme(currentTheme);

  // Inicializa fontes base e escala salva
  initBaseFontSizes();
  currentFontScale = clampScale(parseFloat(localStorage.getItem(FONT_KEY) || "1"));
  applyFontScale();

  // Abrir/fechar menu de configurações
  if (settingsBtn && settingsMenu) {
    // Clique na engrenagem: abre/fecha, mas NÃO deixa subir pro document
    settingsBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      settingsMenu.classList.toggle("open");
    });

    // Clique dentro do menu: não fecha
    settingsMenu.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    // Clique fora do menu: fecha
    document.addEventListener("click", () => {
      if (settingsMenu.classList.contains("open")) {
        settingsMenu.classList.remove("open");
      }
    });
  }

  // Alternar tema (não fecha o menu)
  if (themeToggle) {
    themeToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      currentTheme = currentTheme === "dark" ? "light" : "dark";
      applyTheme(currentTheme);
    });
  }

  // Aumentar fonte (não fecha o menu)
  if (fontIncrease) {
    fontIncrease.addEventListener("click", (e) => {
      e.stopPropagation();
      currentFontScale = clampScale(currentFontScale + STEP_SCALE);
      applyFontScale();
    });
  }

  // Diminuir fonte (não fecha o menu)
  if (fontDecrease) {
    fontDecrease.addEventListener("click", (e) => {
      e.stopPropagation();
      currentFontScale = clampScale(currentFontScale - STEP_SCALE);
      applyFontScale();
    });
  }

  /* =========================
     SIDEBAR (MENU LATERAL)
  ========================== */
  const sidebar = document.getElementById("sidebar");
  const toggleMenuBtn = document.getElementById("toggleMenu");
  const sidebarResizer = document.getElementById("sidebarResizer");

  // Botão de abrir/fechar (modo estreito)
  if (sidebar && toggleMenuBtn) {
    toggleMenuBtn.addEventListener("click", () => {
      sidebar.classList.toggle("narrow");
    });
  }

  // Redimensionar arrastando a barra
  if (sidebar && sidebarResizer) {
    let isResizing = false;

    sidebarResizer.addEventListener("mousedown", () => {
      isResizing = true;
      document.body.style.userSelect = "none";
    });

    document.addEventListener("mousemove", (e) => {
      if (!isResizing) return;

      const newWidth = e.clientX;
      const minWidth = 160;
      const maxWidth = 600;

      if (newWidth > minWidth && newWidth < maxWidth) {
        sidebar.style.width = newWidth + "px";
      }
    });

    document.addEventListener("mouseup", () => {
      isResizing = false;
      document.body.style.userSelect = "";
    });
  }

  /* =========================
     CARREGAR MATÉRIAS DINAMICAMENTE
  ========================== */
  const courseCards = document.querySelectorAll(".course-card");
  const courseContent = document.getElementById("course-content");

  function setActiveCard(card) {
    courseCards.forEach((c) => c.classList.remove("active"));
    if (card) {
      card.classList.add("active");
    }
  }

  // Carrega arquivo HTML da matéria e injeta em #course-content
  async function loadCourse(file, cardToActivate) {
    if (!file || !courseContent) return;

    try {
      const response = await fetch(file);
      if (!response.ok) {
        throw new Error("Erro ao carregar " + file);
      }

      const html = await response.text();
      courseContent.innerHTML = html;

      // Novos elementos também precisam ter base de fonte p/ escala funcionar
      initBaseFontSizes();
      applyFontScale();

      setActiveCard(cardToActivate);
    } catch (error) {
      console.error(error);
      courseContent.innerHTML =
        '<p style="padding:16px; color:#c00;">Não foi possível carregar o conteúdo da matéria.</p>';
    }
  }

  // Clique em cada card do menu lateral
  courseCards.forEach((card) => {
    const file = card.dataset.file;

    card.addEventListener("click", () => {
      if (file) {
        loadCourse(file, card);
      }
    });
  });

  // Ao carregar a página, já carrega a matéria do card ativo (ou o primeiro)
  const initialCard =
    document.querySelector(".course-card.active") || courseCards[0];

  if (initialCard) {
    const initialFile = initialCard.dataset.file;
    if (initialFile) {
      loadCourse(initialFile, initialCard);
    }
  }
});
