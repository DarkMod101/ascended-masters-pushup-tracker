const quotes = [
  "Discipline is the bridge between pain and ascension.",
  "The body obeys the mind that refuses surrender.",
  "Power is built through repetition and control.",
  "Your limits are waiting to be broken.",
  "Pain fades. Mastery remains.",
  "Breath, focus, movement, ascension.",
  "Strength begins where excuses end."
];

const exercises = [
  {
    name: "Standard Push-Up",
    desc: "Close hand placement parallel to the body and near the ribs.",
    image: "standard-pushup.png"
  },
  {
    name: "Finger Root Push-Up",
    desc: "Perform the push-up on the roots of the fingers for greater stability and strength.",
    image: "finger-root-pushup.png"
  },
  {
    name: "Diamond Push-Up",
    desc: "Thumbs and index fingers form a diamond shape to target triceps and inner chest.",
    image: "diamond-pushup.png"
  },
  {
    name: "Decline Push-Up",
    desc: "Feet elevated to target upper chest and shoulders.",
    image: "decline-pushup.png"
  },
  {
    name: "Inclined Push-Up",
    desc: "Hands elevated on a surface to reduce resistance and improve control.",
    image: "incline-pushup.png"
  },
  {
    name: "Explosive Push-Up",
    desc: "Push with explosive force so the hands leave the ground.",
    image: "explosive-pushup.png"
  },
  {
    name: "Headstand Push-Up",
    desc: "Wall-supported vertical pressing movement for shoulders and triceps.",
    image: "headstand-pushup-new.png"
  }
];

const quoteText = document.getElementById("quoteText");
const newQuoteBtn = document.getElementById("newQuoteBtn");
const exerciseList = document.getElementById("exerciseList");
const sessionLog = document.getElementById("sessionLog");

const totalRepsEl = document.getElementById("totalReps");
const totalSetsEl = document.getElementById("totalSets");
const totalSessionsEl = document.getElementById("totalSessions");
const restDaysEl = document.getElementById("restDays");

newQuoteBtn.addEventListener("click", randomQuote);

function randomQuote() {
  const random = quotes[Math.floor(Math.random() * quotes.length)];
  quoteText.textContent = `“${random}”`;
}

randomQuote();

const template = document.getElementById("exerciseTemplate");

let sessions = JSON.parse(localStorage.getItem("ascensionSessions")) || [];

function renderExercises() {
  exercises.forEach((exercise, index) => {
    const clone = template.content.cloneNode(true);

    const img = clone.querySelector(".exercise-img");
    img.src = exercise.image;

    clone.querySelector("h3").textContent = exercise.name;
    clone.querySelector(".exercise-desc").textContent = exercise.desc;

    const repsInput = clone.querySelector(".reps-input");
    const setsInput = clone.querySelector(".sets-input");
    const notesInput = clone.querySelector(".notes-input");

    setupTimer(
      clone.querySelector(".workout-time"),
      clone.querySelector(".start-workout"),
      clone.querySelector(".pause-workout"),
      clone.querySelector(".reset-workout")
    );

    setupTimer(
      clone.querySelector(".recovery-time"),
      clone.querySelector(".start-recovery"),
      clone.querySelector(".pause-recovery"),
      clone.querySelector(".reset-recovery")
    );

    clone.querySelector(".save-session").addEventListener("click", () => {
      const reps = Number(repsInput.value || 0);
      const sets = Number(setsInput.value || 0);
      const notes = notesInput.value;

      const entry = {
        name: exercise.name,
        image: exercise.image,
        reps,
        sets,
        notes,
        date: new Date().toLocaleString()
      };

      sessions.push(entry);

      localStorage.setItem(
        "ascensionSessions",
        JSON.stringify(sessions)
      );

      updateStats();
      renderLog();
renderPerformanceChart();
      repsInput.value = "";
      setsInput.value = "";
      notesInput.value = "";

      alert("Session Saved");
    });

    exerciseList.appendChild(clone);
  });
}

function setupTimer(display, startBtn, pauseBtn, resetBtn) {
  let seconds = 0;
  let interval = null;

  function updateDisplay() {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");

    display.textContent = `${mins}:${secs}`;
  }

  startBtn.addEventListener("click", () => {
    if (interval) return;

    interval = setInterval(() => {
      seconds++;
      updateDisplay();
    }, 1000);
  });

  pauseBtn.addEventListener("click", () => {
    clearInterval(interval);
    interval = null;
  });

  resetBtn.addEventListener("click", () => {
    clearInterval(interval);
    interval = null;
    seconds = 0;
    updateDisplay();
  });

  updateDisplay();
}

function updateStats() {
  const totalReps = sessions.reduce((sum, s) => sum + s.reps, 0);
  const totalSets = sessions.reduce((sum, s) => sum + s.sets, 0);

  totalRepsEl.textContent = totalReps;
  totalSetsEl.textContent = totalSets;
  totalSessionsEl.textContent = sessions.length;

  restDaysEl.textContent = calculateRestDays();
}

function calculateRestDays() {
  if (sessions.length === 0) return 0;

  const today = new Date();
  const latest = new Date(
    sessions[sessions.length - 1].date
  );

  const diff =
    (today - latest) / (1000 * 60 * 60 * 24);

  return Math.floor(diff);
}

function renderLog() {
  sessionLog.innerHTML = "";

  sessions
    .slice()
    .reverse()
    .forEach(session => {
      const div = document.createElement("div");

      div.className = "exercise-card";

      div.innerHTML = `
      <img src="${session.image}" class="exercise-image">
      
        <h3>${session.name}</h3>
        <p>
          Reps: ${session.reps} |
          Sets: ${session.sets}
        </p>
        <p>${session.date}</p>
        <p>${session.notes || ""}</p>
      `;

      sessionLog.appendChild(div);
    });
}

const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".tab-panel");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    panels.forEach(p => p.classList.remove("active"));

    tab.classList.add("active");

    document
      .getElementById(tab.dataset.tab)
      .classList.add("active");
  });
});



renderExercises();
renderLog();
updateStats();

function renderPerformanceChart() {
  const canvas = document.getElementById("performanceChart");
  if (!canvas || typeof Chart === "undefined") return;

  const dailyTotals = {};

  sessions.forEach(session => {
    const day = new Date(session.date).toLocaleDateString();

    if (!dailyTotals[day]) {
      dailyTotals[day] = 0;
    }

    dailyTotals[day] += session.reps;
  });

  const labels = Object.keys(dailyTotals);
  const data = Object.values(dailyTotals);

  new Chart(canvas, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Daily Reps",
          data,
          borderWidth: 2,
          tension: 0.35
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: "#d7d7d7"
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: "#a8a8a8"
          }
        },
        y: {
          ticks: {
            color: "#a8a8a8"
          }
        }
      }
    }
  });
}

renderPerformanceChart();

const resetDataBtn = document.getElementById("resetDataBtn");

resetDataBtn.addEventListener("click", () => {
  const confirmed = confirm(
    "Are you sure you want to reset all stats and workout history?"
  );

  if (!confirmed) return;

  localStorage.removeItem("sessions");

  sessions = [];

  updateStats();
  renderLog();
  renderPerformanceChart();

  alert("All stats reset.");
});
