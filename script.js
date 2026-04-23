function showSection(id) {
    document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");

    runTyping(); // retype everything every switch (OVERLAP ENABLED)
}

/* ===================== THEME ===================== */

const toggleBtn = document.getElementById("themeToggle");

function applyTheme() {
    const isDark = localStorage.getItem("theme") === "dark";

    document.body.classList.toggle("dark", isDark);
    updateToggleUI(isDark);
}

function updateToggleUI(isDark) {
    const knob = document.querySelector(".theme-toggle .knob");
    if (!knob) return;

    knob.textContent = isDark ? "🌙" : "☀️";
    knob.style.transform = isDark ? "translateX(26px)" : "translateX(0px)";
}

if (!localStorage.getItem("theme")) {
    localStorage.setItem("theme", "dark");
}

applyTheme();

toggleBtn.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");

    updateToggleUI(isDark);
});

/* ===================== TYPING ===================== */

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

async function typeCard(card) {
    const raw = card.getAttribute("data-text") || "";
    const lines = raw.split("|").map(l => l.trim()).filter(Boolean);

    card.innerHTML = "";

    for (let i = 0; i < lines.length; i++) {
        const row = document.createElement("div");
        row.className = "line " + (i === 0 ? "first-line" : "other-line");

        const cursor = document.createElement("span");
        cursor.className = "cursor";

        row.appendChild(cursor);
        card.appendChild(row);

        for (let j = 0; j < lines[i].length; j++) {
            row.insertBefore(document.createTextNode(lines[i][j]), cursor);
            await sleep(10);
        }

        cursor.remove();
    }
}

// async function runTyping() {
//     const section = document.querySelector("section.active");
//     if (!section) return;

//     const cards = section.querySelectorAll(".card.type-box");

//     for (let card of cards) {
//         typeCard(card); // intentional overlap (NOT awaited)
//     }
// }

async function runTyping() {
    const section = document.querySelector("section.active");
    if (!section) return;

    // Fixed selector to find type-boxes even if they are nested inside cards
    const boxes = section.querySelectorAll(".type-box");

    for (let box of boxes) {
        // Only type if it hasn't been typed yet or reset it
        typeCard(box); 
    }
}


runTyping();

/* ===================== BACKGROUND ===================== */

const canvas = document.getElementById("networkCanvas");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

let nodes = Array.from({ length: 25 }, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    vx: (Math.random() - 0.5),
    vy: (Math.random() - 0.5)
}));

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const color = getComputedStyle(document.body)
        .getPropertyValue("--accent");

    nodes.forEach(n => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
        ctx.fill();

        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
    });

    requestAnimationFrame(animate);
}

animate();