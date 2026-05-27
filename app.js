const STORAGE_KEY = "stas-jedes-session-v3";
const DETAIL_KEY = "stas-jedes-detail-mode";

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

const meals = [
  {
    id: 1,
    name: "Pasulj",
    image: "images/pasulj.jpg"
  },
  {
    id: 2,
    name: "Sarma",
    image: "images/sarma.jpg"
  },
  {
    id: 3,
    name: "Pileća supa",
    image: "images/pileca_supa.jpg"
  },
  {
    id: 4,
    name: "Špagete karbonara",
    image: "images/spagete_karbonara.jpg"
  },
  {
    id: 5,
    name: "Špagete bolonjeze",
    image: "images/spagete_bolonjeze.jpg"
  },
  {
    id: 6,
    name: "Musaka sa krompirom",
    image: "images/musaka_sa_krompirom.jpg"
  },
  {
    id: 7,
    name: "Musaka sa tikvicama",
    image: "images/musaka_sa_tikvicama.jpg"
  },
  {
    id: 8,
    name: "Pilav sa piletinom",
    image: "images/pilav_sa_piletinom.jpg"
  },
  {
    id: 9,
    name: "Ćufte",
    image: "images/cufte.jpg"
  },
  {
    id: 10,
    name: "Pirinač sa povrćem",
    image: "images/pirinac_sa_povrcem.jpg"
  },
  {
    id: 11,
    name: "Goveđi gulaš",
    image: "images/govedji_gulas.jpg"
  },
  {
    id: 12,
    name: "Punjene paprike",
    image: "images/punjene_paprike.jpg"
  },
  {
    id: 13,
    name: "Riblji štapići",
    image: "images/riblji_stapici.jpg"
  },
  {
    id: 14,
    name: "Krompir pire",
    image: "images/krompir_pire.jpg"
  },
  {
    id: 15,
    name: "Bečka šnicla",
    image: "images/becka_snicla.jpg"
  },
  {
    id: 16,
    name: "Pečena piletina",
    image: "images/pecena_piletina.jpg"
  },
  {
    id: 17,
    name: "Teleća čorba",
    image: "images/teleca_corba.jpg"
  },
  {
    id: 18,
    name: "Pica",
    image: "images/pica.jpg"
  },
  {
    id: 19,
    name: "Grašak",
    image: "images/grasak.jpg"
  },
  {
    id: 20,
    name: "Kuvana boranija",
    image: "images/kuvana_boranija.jpg"
  },
  {
    id: 21,
    name: "Jagnjetina iz rerne",
    image: "images/jagnjetina_iz_rerne.jpg"
  },
  {
    id: 22,
    name: "Pohovana piletina",
    image: "images/pohovana_piletina.jpg"
  },
  {
    id: 23,
    name: "Paprikaš",
    image: "images/paprikas.jpg"
  },
  {
    id: 24,
    name: "Makarone sa sirom",
    image: "images/makarone_sa_sirom.jpg"
  },
  {
    id: 25,
    name: "Sataraš",
    image: "images/sataras.jpg"
  },
  {
    id: 26,
    name: "Krem čorba",
    image: "images/krem_corba.jpg"
  },
  {
    id: 27,
    name: "Lazanje",
    image: "images/lazanje.jpg"
  },
  {
    id: 28,
    name: "Burger",
    image: "images/burger.jpg"
  },
  {
    id: 29,
    name: "Brancin",
    image: "images/brancin.jpg"
  },
  {
    id: 30,
    name: "Pastrmka",
    image: "images/pastrmka.jpg"
  },
  {
    id: 31,
    name: "Losos",
    image: "images/losos.jpg"
  }
];

const screens = {
  welcome: document.querySelector("#welcome-screen"),
  vote: document.querySelector("#vote-screen"),
  results: document.querySelector("#results-screen")
};

const startButton = document.querySelector("#start-button");
const resumeButton = document.querySelector("#resume-button");
const restartButton = document.querySelector("#restart-button");
const mealName = document.querySelector("#meal-name");
const mealImage = document.querySelector("#meal-image");
const mealCaption = document.querySelector("#meal-caption");
const progressLabel = document.querySelector("#progress-label");
const progressFill = document.querySelector("#progress-fill");
const resultsSummary = document.querySelector("#results-summary");
const detailToggle = document.querySelector("#detail-toggle");
const voteActions = document.querySelector(".vote-actions");
const resultsGrid = document.querySelector("#results-grid");

let detailMode = localStorage.getItem(DETAIL_KEY) === "true";

let session = loadSession();

function createSession() {
  return {
    order: shuffle(meals.map((meal) => meal.id)),
    currentIndex: 0,
    votes: {}
  };
}

function shuffle(items) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

function loadSession() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const isValid =
      saved &&
      Array.isArray(saved.order) &&
      saved.order.length === meals.length &&
      typeof saved.currentIndex === "number" &&
      saved.votes;

    return isValid ? saved : null;
  } catch {
    return null;
  }
}

function saveSession() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEY);
}

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.add("hidden"));
  screens[name].classList.remove("hidden");
  resetScroll();
}

function resetScroll() {
  window.scrollTo(0, 0);
  setTimeout(() => window.scrollTo(0, 0), 0);
  setTimeout(() => window.scrollTo(0, 0), 120);
}

window.addEventListener("pageshow", resetScroll);

function startNewSession() {
  session = createSession();
  saveSession();
  renderCurrentMeal();
}

function resumeSession() {
  if (!session || session.currentIndex >= session.order.length) {
    renderResults();
    return;
  }

  renderCurrentMeal();
}

function getCurrentMeal() {
  const id = session.order[session.currentIndex];
  return meals.find((meal) => meal.id === id);
}

function applyDetailMode() {
  voteActions.classList.toggle("detail", detailMode);
  detailToggle.textContent = detailMode ? "Manje opcija" : "Više opcija";
  detailToggle.classList.toggle("active", detailMode);
}

function renderCurrentMeal() {
  const meal = getCurrentMeal();
  const completeCount = Object.keys(session.votes).length;
  const nextNumber = Math.min(session.currentIndex + 1, meals.length);

  mealName.textContent = meal.name;
  mealImage.src = meal.image;
  mealImage.alt = meal.name;
  mealCaption.textContent = "Kako ti se dopada?";
  progressLabel.textContent = `${nextNumber} / ${meals.length}`;
  progressFill.style.width = `${(completeCount / meals.length) * 100}%`;
  applyDetailMode();
  showScreen("vote");
}

function voteForCurrentMeal(vote) {
  const meal = getCurrentMeal();
  session.votes[meal.id] = vote;
  session.currentIndex += 1;
  saveSession();

  if (session.currentIndex >= session.order.length) {
    renderResults();
    return;
  }

  renderCurrentMeal();
}

function renderResults() {
  const grouped = {
    love: [],
    like: [],
    neutral: [],
    meh: [],
    dislike: [],
    unknown: []
  };

  session.order.forEach((id) => {
    const vote = session.votes[id];
    const meal = meals.find((item) => item.id === id);

    if (vote && meal && grouped[vote]) {
      grouped[vote].push(meal);
    }
  });

  if (detailMode) {
    resultsGrid.classList.add("detail");
    renderList("love-list", grouped.love);
    renderList("like-list", grouped.like);
    renderList("neutral-list", grouped.neutral);
    renderList("meh-list", grouped.meh);
    renderList("dislike-list", grouped.dislike);
    renderList("unknown-list", grouped.unknown);
    document.querySelector("#love-count").textContent = grouped.love.length;
    document.querySelector("#like-count").textContent = grouped.like.length;
    document.querySelector("#neutral-count").textContent = grouped.neutral.length;
    document.querySelector("#meh-count").textContent = grouped.meh.length;
    document.querySelector("#dislike-count").textContent = grouped.dislike.length;
    document.querySelector("#unknown-count").textContent = grouped.unknown.length;
  } else {
    resultsGrid.classList.remove("detail");
    const likeMerged = [...grouped.love, ...grouped.like];
    const neutralMerged = [...grouped.neutral, ...grouped.meh];
    renderList("love-list", []);
    renderList("like-list", likeMerged);
    renderList("neutral-list", neutralMerged);
    renderList("meh-list", []);
    renderList("dislike-list", grouped.dislike);
    renderList("unknown-list", []);
    document.querySelector("#love-count").textContent = 0;
    document.querySelector("#like-count").textContent = likeMerged.length;
    document.querySelector("#neutral-count").textContent = neutralMerged.length;
    document.querySelector("#meh-count").textContent = 0;
    document.querySelector("#dislike-count").textContent = grouped.dislike.length;
    document.querySelector("#unknown-count").textContent = 0;
  }

  const voted = session.order.length - grouped.unknown.length;
  resultsSummary.textContent =
    `Ocenjeno je ${voted} jela` +
    (grouped.unknown.length ? `, ${grouped.unknown.length} nepoznatih` : "") + ".";

  progressFill.style.width = "100%";
  showScreen("results");
}

function renderList(id, list) {
  const element = document.querySelector(`#${id}`);
  element.innerHTML = "";

  if (list.length === 0) {
    const item = document.createElement("li");
    item.className = "empty";
    item.textContent = "Nema jela ovde.";
    element.append(item);
    return;
  }

  list
    .slice()
    .sort((first, second) => first.name.localeCompare(second.name, "sr-Latn"))
    .forEach((meal) => {
      const item = document.createElement("li");
      item.textContent = meal.name;
      element.append(item);
    });
}

function updateWelcome() {
  const hasProgress =
    session &&
    Object.keys(session.votes).length > 0 &&
    session.currentIndex < session.order.length;

  resumeButton.classList.toggle("hidden", !hasProgress);
  showScreen("welcome");
}

startButton.addEventListener("click", startNewSession);
resumeButton.addEventListener("click", resumeSession);
restartButton.addEventListener("click", () => {
  clearSession();
  startNewSession();
});

document.querySelectorAll(".vote-button").forEach((button) => {
  button.addEventListener("click", () => {
    const vote = button.dataset.vote;
    if (!detailMode && (vote === "love" || vote === "meh" || vote === "unknown")) return;
    voteForCurrentMeal(vote);
  });
});

detailToggle.addEventListener("click", () => {
  detailMode = !detailMode;
  localStorage.setItem(DETAIL_KEY, detailMode);
  applyDetailMode();
});

if (session && session.currentIndex >= meals.length) {
  renderResults();
} else {
  updateWelcome();
}
