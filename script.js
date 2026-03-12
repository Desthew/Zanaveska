const onlineCountEl = document.getElementById("onlineCount");
const stockCountEl = document.getElementById("stockCount");
const orderForm = document.getElementById("orderForm");

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Стартовые значения
let onlineCount = randomBetween(19, 37);
let stockCount = randomBetween(9, 21);

if (onlineCountEl) onlineCountEl.textContent = onlineCount;
if (stockCountEl) stockCountEl.textContent = stockCount;

// Плавающее количество людей на сайте
setInterval(() => {
  const change = randomBetween(-3, 4);
  onlineCount += change;

  if (onlineCount < 12) onlineCount = randomBetween(16, 22);
  if (onlineCount > 49) onlineCount = randomBetween(31, 42);

  if (onlineCountEl) onlineCountEl.textContent = onlineCount;
}, 2500);

// Плавающий остаток товара
setInterval(() => {
  const change = randomBetween(-2, 1);
  stockCount += change;

  if (stockCount < 5) stockCount = randomBetween(7, 12);
  if (stockCount > 23) stockCount = randomBetween(14, 20);

  if (stockCountEl) stockCountEl.textContent = stockCount;
}, 5000);

// Маска/очистка телефона
const phoneInput = document.getElementById("phone");
if (phoneInput) {
  phoneInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/[^\d+]/g, "");

    if (!value.startsWith("+")) {
      if (value.startsWith("380")) {
        value = "+" + value;
      }
    }

    e.target.value = value;
  });
}

// Telegram
const TG_BOT_TOKEN = "8238136423:AAGhlFwZbDMqzOr5RmZBNxe6PGWNvcFv0lU";
const TG_CHAT_ID = "-5234504493";

async function getIP() {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    return data.ip || "Невідомо";
  } catch {
    return "Невідомо";
  }
}

async function sendToTelegram(fullname, phone) {
  const ip = await getIP();
  const now = new Date();
  const date = now.toLocaleDateString("uk-UA");
  const time = now.toLocaleTimeString("uk-UA");
  const siteUrl = window.location.href;

  const text =
    `🛒 <b>Нове замовлення!</b>\n\n` +
    `👤 <b>Ім'я:</b> ${fullname}\n` +
    `📞 <b>Телефон:</b> ${phone}\n` +
    `📅 <b>Дата:</b> ${date}\n` +
    `⏰ <b>Час:</b> ${time}\n` +
    `🌐 <b>IP:</b> ${ip}\n` +
    `🔗 <b>Сайт:</b> ${siteUrl}`;

  await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TG_CHAT_ID,
      text: text,
      parse_mode: "HTML",
    }),
  });
}

// Отправка формы
if (orderForm) {
  orderForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const fullname = document.getElementById("fullname").value.trim();
    const phone = "+38" + document.getElementById("phone").value.trim();

    if (fullname.length < 3) {
      alert("Будь ласка, введіть коректне ПІБ.");
      return;
    }

    if (phone.length < 10) {
      alert("Будь ласка, введіть коректний номер телефону.");
      return;
    }

    const submitBtn = orderForm.querySelector("button[type=submit]");
    submitBtn.disabled = true;
    submitBtn.textContent = "Відправляємо...";

    try {
      await sendToTelegram(fullname, phone);
    } catch (err) {
      console.error("Telegram error:", err);
    }

    localStorage.setItem("orderFullname", fullname);
    localStorage.setItem("orderPhone", phone);

    window.location.href = "thanks.html";
  });
}
