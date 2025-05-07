


document.getElementById("feedbackForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const formData = new FormData(this);
  const params = new URLSearchParams();

  for (const pair of formData.entries()) {
    params.append(pair[0], pair[1]);
  }

  fetch("https://script.google.com/macros/s/AKfycbzl5jkTEIEli8Buo4hecKrPf-wtufbGGX7rUK2bld4E-pauPkwTyukT-4Q1PVAMxAY9Tw/exec", {
    method: "POST",
    body: params
  })
  .then(res => res.text())
  .then(res => {
    alert("Спасибо! Заявка отправлена.");
    document.getElementById("feedbackForm").reset();
  })
  .catch(err => alert("Ошибка отправки: " + err));
});


// Функция для изменения margin-top
function updateMarginTop() {
  const mobileNav = document.getElementById('mobileNav');
  if (mobileNav) {
    const navHeight = mobileNav.offsetHeight;
    console.log(navHeight);

    const stroka = document.querySelectorAll('.stroka');
    stroka.forEach(el => {
      el.style.marginTop = (navHeight - 38) + 'px';
    });
  }
}

// Переключение меню
function toggleMenu() {
  const mobileNav = document.getElementById("mobileNav");
  mobileNav.classList.toggle("open");
  updateMarginTop();
}

// Плавный скролл по якорным ссылкам
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    const goto = this.getAttribute('href');
    document.querySelector(goto).scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
});








// Показ опций зазора при выборе материала
document.getElementById("material").addEventListener("change", function () {
  const val = parseInt(this.value);
  document.getElementById("zazorOptions").style.display = (val === 4 || val === 5) ? "block" : "none";
});

// Кнопка "Рассчитать"
document.getElementById("calcBtn").addEventListener("click", function () {
  const getNum = id => parseFloat(document.getElementById(id).value || "0");
  const getInt = id => parseInt(document.getElementById(id).value || "0");

  const perimeter = getNum("perimeter");
  const material = getInt("material");
  const zazor = getInt("zazor");
  const kalitka = getInt("kalitka");
  const vorota = getInt("vorota");
  const demontazh = getInt("demontazh");
  const distance = getNum("distance");

  if (!perimeter || !material || isNaN(distance)) {
    alert("Пожалуйста, заполните все обязательные поля.");
    return;
  }

  let zabor_name = "", zazor_name = "Без зазора", kalitka_name = "Без калитки", vorota_name = "Без ворот";
  let zena_kalitka = 0, vorota_zena = 0, zena = 0, kolvo = 0, krepezh1 = 0, krepezh2 = 0, obsh_krepezh = 0;

  if (kalitka === 1) {
    kalitka_name = "Калитка эконом (без замка), 11.000руб.";
    zena_kalitka = 11000;
  } else if (kalitka === 2) {
    kalitka_name = "Калитка с замком, 16.000руб.";
    zena_kalitka = 16000;
  }

  const vorotaMap = {
    1: ["ВОРОТА эконом, 21.000руб.", 21000],
    2: ["Ворота до 4 м, 80.000руб.", 80000],
    3: ["Ворота до 5 м, 90.000руб.", 90000],
    14: ["ВОРОТА эконом + автоматика, 84.000руб.", 84000],
    24: ["Ворота до 4 м + автоматика, 143.000руб.", 143000],
    34: ["Ворота до 5 м + автоматика, 153.000руб.", 153000],
  };

  if (vorotaMap[vorota]) {
    [vorota_name, vorota_zena] = vorotaMap[vorota];
  }

  const kolvo_stolbov = Math.floor(perimeter / 2.5) + 1;
  const zena_stolbov = (material === 1 || material === 2) ? kolvo_stolbov * 700 : kolvo_stolbov * 1000;
  const zena_truba = perimeter * 2 * 130;
  const sheben_zena = perimeter * 20;
  const montage_zena = perimeter * 750;
  const dem_zena = demontazh ? perimeter * 100 : 0;
  const dostavka_zena = distance * 2000;

  if (material === 1 || material === 2) {
    zabor_name = "3D сетка";
    kolvo = perimeter / 2.5;
    zena = kolvo * (material === 1 ? 2400 : 2900);
    krepezh1 = 6 * kolvo;
    obsh_krepezh = krepezh1 * 25;
  } else if (material === 3) {
    zabor_name = "Профлист";
    kolvo = perimeter / 1.1;
    zena = kolvo * 1350;
    krepezh1 = 8 * kolvo;
    obsh_krepezh = krepezh1 * 3.5;
  } else {
    zabor_name = "Штакетник";
    const zazor_map = {
      1: [7.6, "2 см"], 2: [7.6, "2 см"], 3: [6.6, "4 см"],
      4: [6.6, "4 см"], 5: [11, "6 см"], 6: [10, "8 см"]
    };
    if (zazor_map[zazor]) {
      const [koef, name] = zazor_map[zazor];
      kolvo = perimeter * koef;
      zazor_name = name;
    }

    if ([1, 3].includes(zazor) && material === 4) zena = kolvo * 175;
    else if ([2, 4, 5, 6].includes(zazor) && material === 4) zena = kolvo * 185;
    else if ([2, 4, 5, 6].includes(zazor) && material === 5) zena = kolvo * 200;
    else zena = kolvo * 190;

    krepezh1 = kolvo * 2;
    krepezh2 = kolvo * 4;
    obsh_krepezh = (krepezh1 + krepezh2) * 3.5;
  }

  const obshaya_zena = zena + zena_kalitka + vorota_zena + sheben_zena + dem_zena + montage_zena + obsh_krepezh;

  document.getElementById("output").textContent = `
Забор: ${zabor_name}, ${Math.round(kolvo)} шт., ${Math.round(zena)} руб.
Зазор: ${zazor_name}
Калитка: ${kalitka_name}
Ворота: ${vorota_name}
Щебень: ${sheben_zena} руб.
Работа: ${dem_zena} руб. - демонтаж, ${montage_zena} руб. - монтаж

ИТОГО: ${Math.round(obshaya_zena)} руб. + ${dostavka_zena} руб. - доставка
`;
});


// MARK: Галерея проектов
function scrollGallery(direction) {
    const gallery = document.getElementById("gallery");
    const scrollAmount = gallery.clientWidth * 0.8; // Прокручивает на 80% ширины галереи
    gallery.scrollBy({
      left: direction * scrollAmount,
      behavior: "smooth"
    });
  }
