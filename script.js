document.addEventListener("DOMContentLoaded", () => {
  initTrackFilter();
  initMobileNav();
  initCopyEmail();
  setCurrentYear();
});

function initTrackFilter() {
  const buttons = Array.from(document.querySelectorAll(".filter-btn"));
  const cards = Array.from(document.querySelectorAll(".case-card"));
  const statusEl = document.getElementById("filter-status");

  if (!buttons.length || !cards.length) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const selected = button.dataset.filter || "all";

      buttons.forEach((btn) => {
        const isCurrent = btn === button;
        btn.classList.toggle("is-active", isCurrent);
        btn.setAttribute("aria-pressed", String(isCurrent));
      });

      let visibleCount = 0;
      cards.forEach((card) => {
        const tracks = (card.dataset.tracks || "").split(/\s+/).filter(Boolean);
        const matches = selected === "all" || tracks.includes(selected);
        card.hidden = !matches;
        if (matches) visibleCount += 1;
      });

      if (statusEl) {
        if (selected === "all") {
          statusEl.textContent = `Showing all ${visibleCount} case studies.`;
        } else {
          const label = button.textContent.trim();
          const noun = visibleCount === 1 ? "case study" : "case studies";
          statusEl.textContent = `Showing ${visibleCount} ${noun} for ${label}.`;
        }
      }
    });
  });
}

function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("primary-nav");
  if (!toggle || !nav) return;

  const closeMenu = () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      closeMenu();
      toggle.focus();
    }
  });
}

function initCopyEmail() {
  const copyBtn = document.getElementById("copy-email-btn");
  const statusEl = document.getElementById("copy-status");
  const email = "jimlouie2@gmail.com";

  if (!copyBtn) return;

  let resetTimer = null;

  copyBtn.addEventListener("click", async () => {
    let copied = false;

    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      try {
        await navigator.clipboard.writeText(email);
        copied = true;
      } catch {
        copied = false;
      }
    }

    if (!copied) {
      const temp = document.createElement("textarea");
      temp.value = email;
      temp.setAttribute("readonly", "");
      temp.style.position = "absolute";
      temp.style.left = "-9999px";
      document.body.appendChild(temp);
      temp.select();
      try {
        copied = document.execCommand("copy");
      } catch {
        copied = false;
      }
      document.body.removeChild(temp);
    }

    if (resetTimer) clearTimeout(resetTimer);

    if (copied) {
      copyBtn.textContent = "Copied!";
      if (statusEl) statusEl.textContent = `Copied ${email} to clipboard.`;
    } else if (statusEl) {
      statusEl.textContent = `Copy unavailable. Email: ${email}`;
    }

    resetTimer = setTimeout(() => {
      copyBtn.textContent = "Copy Email";
    }, 2500);
  });
}

function setCurrentYear() {
  const yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
}
