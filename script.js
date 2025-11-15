document.addEventListener("DOMContentLoaded", function () {
    // ==========================
    // SIDEBAR (abrir/fechar)
    // ==========================
    const sidebar = document.getElementById("sidebar");
    const toggleBtn = document.getElementById("toggleMenu");
    const resizer = document.getElementById("sidebarResizer");

    const MIN_WIDTH = 80;
    const MAX_WIDTH = 420;

    if (sidebar) {
        sidebar.style.width = "400px";
        sidebar.classList.remove("narrow");
    }

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener("click", () => {
            const isNarrow = sidebar.classList.contains("narrow");

            if (!isNarrow) {
                sidebar.style.width = MIN_WIDTH + "px";
                sidebar.classList.add("narrow");
            } else {
                sidebar.style.width = "400px";
                sidebar.classList.remove("narrow");
            }
        });
    }

    // ==========================
    // SIDEBAR (redimensionar)
    // ==========================
    if (resizer && sidebar) {
        let isResizing = false;
        let startX = 0;
        let startWidth = 0;

        const onMouseDown = (e) => {
            isResizing = true;
            startX = e.clientX;
            startWidth = sidebar.offsetWidth;
            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        };

        const onMouseMove = (e) => {
            if (!isResizing) return;

            const dx = e.clientX - startX;
            let newWidth = startWidth + dx;

            if (newWidth < MIN_WIDTH) newWidth = MIN_WIDTH;
            if (newWidth > MAX_WIDTH) newWidth = MAX_WIDTH;

            sidebar.style.width = newWidth + "px";

            if (newWidth <= MIN_WIDTH + 10) {
                sidebar.classList.add("narrow");
            } else {
                sidebar.classList.remove("narrow");
            }
        };

        const onMouseUp = () => {
            isResizing = false;
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        resizer.addEventListener("mousedown", onMouseDown);
    }

    // ==========================
    // MENU DE CONFIGURAÇÕES
    // (tema + fonte)
    // ==========================
    const body = document.body;

    const settingsButton = document.querySelector(".topbar-settings");
    const settingsMenu = document.getElementById("settingsMenu");
    const themeToggle = document.getElementById("themeToggle");
    const fontIncreaseBtn = document.getElementById("fontIncrease");
    const fontDecreaseBtn = document.getElementById("fontDecrease");

    const THEME_KEY = "sensorial-theme";
    const FONT_KEY = "sensorial-font-size";

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
                iconEl.classList.toggle("fa-sun", theme === "dark");
                iconEl.classList.toggle("fa-moon", theme !== "dark");
            }
        }

        localStorage.setItem(THEME_KEY, theme);
    }

    function applyFontSize(size) {
        const min = 12;
        const max = 22;

        if (size < min) size = min;
        if (size > max) size = max;

        body.style.fontSize = size + "px";
        localStorage.setItem(FONT_KEY, String(size));
    }

    // Carrega preferências salvas
    let currentTheme = localStorage.getItem(THEME_KEY) || "light";
    applyTheme(currentTheme);

    let currentFontSize = parseInt(localStorage.getItem(FONT_KEY) || "16", 10);
    applyFontSize(currentFontSize);

    // Abrir/fechar menu ao clicar na engrenagem
    if (settingsButton && settingsMenu) {
        settingsButton.addEventListener("click", (event) => {
            event.stopPropagation();
            settingsMenu.classList.toggle("open");
        });

        // Fechar ao clicar fora
        document.addEventListener("click", () => {
            settingsMenu.classList.remove("open");
        });

        // Impedir que clicar dentro feche
        settingsMenu.addEventListener("click", (event) => {
            event.stopPropagation();
        });
    }

    // Alternar tema
    if (themeToggle) {
        themeToggle.addEventListener("click", (event) => {
            event.stopPropagation();
            currentTheme = currentTheme === "dark" ? "light" : "dark";
            applyTheme(currentTheme);
        });
    }

    // Aumentar fonte
    if (fontIncreaseBtn) {
        fontIncreaseBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            currentFontSize += 1;
            applyFontSize(currentFontSize);
        });
    }

    // Diminuir fonte
    if (fontDecreaseBtn) {
        fontDecreaseBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            currentFontSize -= 1;
            applyFontSize(currentFontSize);
        });
    }

    // ==========================
    // AVATARES DO CHAT
    // (garante que nenhum fique vazio)
    // ==========================
    const defaultAvatar = "imgs/perfil_padrao.jpg";

    document.querySelectorAll(".message-avatar img").forEach((img) => {
        const src = img.getAttribute("src");

        if (!src || src.trim() === "") {
            img.src = defaultAvatar;
        }

        img.addEventListener("error", () => {
            img.src = defaultAvatar;
        });
    });
});
