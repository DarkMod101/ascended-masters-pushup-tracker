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

 const manualExercise = document.getElementById("manualExercise");

 if (manualExercise) {
   exercises.forEach(exercise => {
     const option = document.createElement("option");
     option.value = exercise.name;
     option.textContent = exercise.name;
     manualExercise.appendChild(option);
   });
 }

const quoteText = document.getElementById("quoteText");
const newQuoteBtn = document.getElementById("newQuoteBtn");
const exerciseList = document.getElementById("exerciseList");
const sessionLog = document.getElementById("sessionLog");
const exerciseRecords = document.getElementById("exerciseRecords");
const exerciseFilter = document.getElementById("exerciseFilter");
const currentViewText = document.getElementById("currentViewText");
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
const manualReps = document.getElementById("manualReps");
const manualSets = document.getElementById("manualSets");
const manualDate = document.getElementById("manualDate");
const manualTime = document.getElementById("manualTime");
const manualNotes = document.getElementById("manualNotes");
const saveManualEntry = document.getElementById("saveManualEntry");

if (saveManualEntry) {
  saveManualEntry.addEventListener("click", () => {
    const selectedExercise = exercises.find(
      exercise => exercise.name === manualExercise.value
    );

    if (!selectedExercise) {
      alert("Choose an exercise first.");
      return;
    }

    const reps = Number(manualReps.value);
    const sets = Number(manualSets.value);

    if (!reps || !sets) {
      alert("Enter reps and sets.");
      return;
    }

    const dateValue = manualDate.value || new Date().toISOString().slice(0, 10);
    const timeValue = manualTime.value || "12:00";

    const entry = {
      name: selectedExercise.name,
      image: selectedExercise.image,
      reps: reps,
      sets: sets,
      notes: manualNotes.value,
      date: new Date(`${dateValue}T${timeValue}`).toISOString()
    };

    sessions.push(entry);
    localStorage.setItem("ascensionSessions", JSON.stringify(sessions));
    renderLog();
    updateStats();
    renderPerformanceChart();

    manualReps.value = "";
    manualSets.value = "";
    manualDate.value = "";
    manualTime.value = "";
    manualNotes.value = "";

    alert("Manual entry saved.");
  });
}

function populateExerciseFilter() {

  if (!exerciseFilter) return;

  exerciseFilter.innerHTML = `
    <option value="all">
      All Exercises
    </option>
  `;

  exercises.forEach(exercise => {

    const option = document.createElement("option");

    option.value = exercise.name;
    option.textContent = exercise.name;

    exerciseFilter.appendChild(option);

  });

}

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

  const lifetimeReps =
    sessions.reduce(
        (sum, session) =>
            sum + Number(session.reps || 0),
        0
    );

const totalSessions =
    sessions.length;

const bestSet =
    Math.max(
        0,
        ...sessions.map(
            s => Number(s.reps || 0)
        )
    );

document.getElementById("lifetimeReps").textContent =
    lifetimeReps.toLocaleString();

document.getElementById("scoreboardSessions").textContent =
  totalSessions;

document.getElementById("bestSet").textContent =
    bestSet;
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
function getPushupLevel(reps) {
  if (reps >= 200) return "Ascended Master";
  if (reps >= 180) return "Elite Warrior";
  if (reps >= 160) return "Iron Disciple";
  if (reps >= 140) return "Power Adept";
  if (reps >= 120) return "Strength Initiate";
  if (reps >= 100) return "Century Warrior";
  if (reps >= 80) return "Steel Builder";
  if (reps >= 60) return "Foundation Breaker";
  if (reps >= 40) return "Rising Disciple";
  if (reps >= 20) return "Awakened Beginner";
  return "Starting Path";
}

function getMasteryRank(reps) {
  if (reps >= 200) return "Mastery Rank VI";
  if (reps >= 180) return "Mastery Rank V";
  if (reps >= 160) return "Mastery Rank IV";
  if (reps >= 140) return "Mastery Rank III";
  if (reps >= 120) return "Mastery Rank II";
  if (reps >= 100) return "Mastery Rank I";

  return "Mastery Rank 0";
}

function isMilestone(reps) {
  return reps >= 20 && reps % 20 === 0;
}

function renderExerciseRecords() {

    if (!exerciseRecords) return;

    exerciseRecords.innerHTML = "";

    exercises.forEach(exercise => {

        const exerciseSessions = sessions.filter(
            session => session.name === exercise.name
        );

        if (exerciseSessions.length === 0) return;

        const bestSession = exerciseSessions.reduce((best, current) => {
  return current.reps > best.reps ? current : best;
});

const best = bestSession.reps;
const bestDate = new Date(bestSession.date).toLocaleDateString();
const bestLevel = getPushupLevel(bestSession.reps);
const bestRank = getMasteryRank(bestSession.reps);
const totalSessions = exerciseSessions.length;
      
        const card = document.createElement("div");

        card.className = "exercise-card";

        card.innerHTML = `
  <img src="${exercise.image}" class="exercise-img">

  <h3>${exercise.name}</h3>

  <div class="record-badge">
    🏆 Personal Record
  </div>

  <p><strong>Best Reps:</strong> ${best}</p>

  <p><strong>Best Sets:</strong> ${bestSession.sets}</p>

  <p><strong>Date Achieved:</strong> ${bestDate}</p>

<p><strong>Total Sessions:</strong> ${totalSessions}</p>

  <div class="level-badge">
    Level: ${bestLevel}
  </div>

  <div class="rank-badge">
👑 ${bestRank}
</div>
`;

        exerciseRecords.appendChild(card);

    });

}

function renderLog() {
  sessionLog.innerHTML = "";

  sessions
    .slice()
    .reverse()
    .forEach((session, index) => {
      const realIndex = sessions.length - 1 - index;

      const div = document.createElement("div");
      div.className = "exercise-card log-card";

      const formattedDate = new Date(session.date).toLocaleString();
const previousBest = sessions
  .filter(entry => entry.name === session.name && entry.date !== session.date)
  .reduce((best, entry) => Math.max(best, entry.reps), 0);

const isPersonalRecord = session.reps > previousBest;
const level = getPushupLevel(session.reps);
const milestoneReached = isMilestone(session.reps);
      
      div.innerHTML = `
        <img src="${session.image}" class="exercise-img">

        <h3>${session.name}</h3>

${isPersonalRecord ? `<div class="pr-badge">🏆 New Personal Record</div>` : ""}
${milestoneReached ? `<div class="milestone-badge">⚡ Milestone Reached: ${session.reps} Reps</div>` : ""}

<div class="level-badge">
  Level: ${level}
</div>

        <p>Reps: ${session.reps} | Sets: ${session.sets}</p>

        <p>${formattedDate}</p>

        <p>${session.notes || ""}</p>

        <button class="delete-log-btn" data-index="${realIndex}">
          Delete Entry
        </button>
      `;

      sessionLog.appendChild(div);
    });

  document.querySelectorAll(".delete-log-btn").forEach(button => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.index);

      if (confirm("Delete this workout entry?")) {
        sessions.splice(index, 1);
        localStorage.setItem("ascensionSessions", JSON.stringify(sessions));

        renderLog();
renderExerciseRecords();
updateStats();
renderPerformanceChart();
      }
    });
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

populateExerciseFilter();

renderLog();
renderExerciseRecords();
updateStats();

let performanceChart = null;
let currentGraphMode = "daily";

const rankImages = {
  starting_path: "images/ranks/rank01_starting_path.png",
  awakened_beginner: "images/ranks/rank02_awakened_beginner.png",
  rising_disciple: "images/ranks/rank03_rising_disciple.png",
  foundation_breaker: "images/ranks/rank04_foundation_breaker.png",
  steel_builder: "images/ranks/rank05_steel_builder.png",
  century_warrior: "images/ranks/rank06_century_warrior.png",
  strength_initiate: "images/ranks/rank07_strength_initiate.png",
  power_adept: "images/ranks/rank08_power_adept.png",
  iron_disciple: "images/ranks/rank09_iron_disciple.png",
  elite_warrior: "images/ranks/rank10_elite_warrior.png",
  ascended_master: "images/ranks/rank11_ascended_master.png"
};

function updateCurrentView() {
  if (!currentViewText) return;

  const exerciseName =
    exerciseFilter && exerciseFilter.value !== "all"
      ? exerciseFilter.value
      : "All Exercises";

  const modeName =
    currentGraphMode.charAt(0).toUpperCase() +
    currentGraphMode.slice(1);

  currentViewText.textContent =
    `${exerciseName} • ${modeName} Progress`;
}

function getGraphKey(date, mode) {
  const d = new Date(date);

  if (mode === "daily") {
    return d.toLocaleDateString();
  }

  if (mode === "weekly") {
    const start = new Date(d);
    start.setDate(d.getDate() - d.getDay());
    return "Week of " + start.toLocaleDateString();
  }

  if (mode === "monthly") {
    return d.toLocaleString("default", {
      month: "short",
      year: "numeric"
    });
  }

  if (mode === "yearly") {
    return String(d.getFullYear());
  }
}

function renderPerformanceChart(mode = currentGraphMode) {
  currentGraphMode = mode;

  updateCurrentView();
  
  const canvas = document.getElementById("performanceChart");
  if (!canvas || typeof Chart === "undefined") return;

  const totals = {};

  const filteredSessions = exerciseFilter && exerciseFilter.value !== "all"
  ? sessions.filter(session => session.name === exerciseFilter.value)
  : sessions;

filteredSessions.forEach(session => {
    const key = getGraphKey(session.date, mode);

    if (!totals[key]) {
      totals[key] = 0;
    }

    if (mode === "volume") {
  totals[key] += Number(session.reps || 0) * Number(session.sets || 1);
} else {
  totals[key] += Number(session.reps || 0);
    }
    });

  const labels = Object.keys(totals);
  const data = Object.values(totals);

  if (performanceChart) {
    performanceChart.destroy();
  }

  performanceChart = new Chart(canvas, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: mode === "volume"
  ? "Training Volume"
  : mode.charAt(0).toUpperCase() + mode.slice(1) + " Reps",
         
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

document.querySelectorAll(".graph-mode").forEach(button => {
  button.addEventListener("click", () => {
    document
      .querySelectorAll(".graph-mode")
      .forEach(btn => btn.classList.remove("active"));

    button.classList.add("active");

    renderPerformanceChart(button.dataset.mode);
  });
});

if (exerciseFilter) {
  exerciseFilter.addEventListener("change", () => {
    renderPerformanceChart(currentGraphMode);
  });
}

renderPerformanceChart();

const viewer = document.getElementById("rankImageViewer");
const rankImage = document.getElementById("rankImage");

document.querySelectorAll(".rank-item").forEach(rank => {
  rank.addEventListener("click", () => {
    const rankKey = rank.dataset.rank;

    rankImage.src = rankImages[rankKey];

    viewer.classList.remove("hidden");
  });
});

rankImage.addEventListener("click", () => {
  viewer.classList.add("hidden");
});

const resetDataBtn = document.getElementById("resetDataBtn");

resetDataBtn.addEventListener("click", () => {
  const confirmed = confirm(
    "Are you sure you want to reset all stats and workout history?"
  );

  if (!confirmed) return;

  localStorage.removeItem("ascensionSessions");

  sessions = [];

updateStats();
renderLog();
renderExerciseRecords();
renderPerformanceChart();

  alert("All stats reset.");
});

const splashScreen = document.getElementById("splash-screen");
const splashVideo = document.getElementById("splash-video");

if (splashScreen && splashVideo) {
  splashVideo.addEventListener("ended", () => {
    splashScreen.classList.add("fade-out");

    setTimeout(() => {
      splashScreen.style.display = "none";
    }, 1000);
  });
}

// ========================================
// PROGRESS BACKUP — CSV EXPORT AND IMPORT
// ========================================

const exportCsvBtn = document.getElementById("exportCsvBtn");
const importCsvBtn = document.getElementById("importCsvBtn");
const csvFileInput = document.getElementById("csvFileInput");

const CSV_HEADERS = [
  "name",
  "image",
  "reps",
  "sets",
  "notes",
  "date"
];

/**
 * Escapes a value so commas, quotation marks,
 * and line breaks remain valid inside a CSV file.
 */
function escapeCsvValue(value) {
  const text = String(value ?? "");

  return `"${text.replace(/"/g, '""')}"`;
}

/**
 * Produces a YYYY-MM-DD date for the backup filename.
 */
function getBackupDate() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Exports every saved workout session as an
 * Excel-compatible CSV file.
 */
function exportProgressToCsv() {
  if (sessions.length === 0) {
    alert("There is no workout progress to export.");
    return;
  }

  const rows = [
    CSV_HEADERS.join(",")
  ];

  sessions.forEach(session => {
    const row = CSV_HEADERS.map(header => {
      return escapeCsvValue(session[header]);
    });

    rows.push(row.join(","));
  });

  /*
   * The BOM helps Microsoft Excel recognize
   * the CSV file's character encoding correctly.
   */
  const csvContent = "\uFEFF" + rows.join("\r\n");

  const blob = new Blob(
    [csvContent],
    {
      type: "text/csv;charset=utf-8;"
    }
  );

  const downloadUrl = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");

  downloadLink.href = downloadUrl;
  downloadLink.download =
    `ascended-masters-progress-${getBackupDate()}.csv`;

  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();

  URL.revokeObjectURL(downloadUrl);

  alert(
    `${sessions.length} workout session${
      sessions.length === 1 ? "" : "s"
    } exported successfully.`
  );
}

/**
 * Parses CSV text while safely supporting:
 *
 * - Commas inside notes
 * - Quotation marks
 * - Multiline notes
 * - Windows and Android line endings
 */
function parseCsv(csvText) {
  const rows = [];

  let currentRow = [];
  let currentValue = "";
  let insideQuotes = false;

  for (let index = 0; index < csvText.length; index++) {
    const character = csvText[index];
    const nextCharacter = csvText[index + 1];

    if (character === '"') {
      if (insideQuotes && nextCharacter === '"') {
        currentValue += '"';
        index++;
      } else {
        insideQuotes = !insideQuotes;
      }

      continue;
    }

    if (character === "," && !insideQuotes) {
      currentRow.push(currentValue);
      currentValue = "";
      continue;
    }

    if (
      (character === "\n" || character === "\r") &&
      !insideQuotes
    ) {
      if (
        character === "\r" &&
        nextCharacter === "\n"
      ) {
        index++;
      }

      currentRow.push(currentValue);

      const rowHasContent = currentRow.some(
        value => String(value).trim() !== ""
      );

      if (rowHasContent) {
        rows.push(currentRow);
      }

      currentRow = [];
      currentValue = "";
      continue;
    }

    currentValue += character;
  }

  currentRow.push(currentValue);

  const finalRowHasContent = currentRow.some(
    value => String(value).trim() !== ""
  );

  if (finalRowHasContent) {
    rows.push(currentRow);
  }

  return rows;
}

/**
 * Converts CSV rows into workout session objects.
 */
function convertCsvRowsToSessions(rows) {
  if (rows.length < 2) {
    throw new Error(
      "The CSV file does not contain any workout sessions."
    );
  }

  const headers = rows[0].map(header =>
    String(header)
      .replace(/^\uFEFF/, "")
      .trim()
      .toLowerCase()
  );

  const missingHeaders = CSV_HEADERS.filter(
    requiredHeader => !headers.includes(requiredHeader)
  );

  if (missingHeaders.length > 0) {
    throw new Error(
      `Missing required columns: ${missingHeaders.join(", ")}`
    );
  }

  const importedSessions = [];
  let skippedRows = 0;

  rows.slice(1).forEach((row, rowIndex) => {
    const record = {};

    headers.forEach((header, columnIndex) => {
      record[header] = row[columnIndex] ?? "";
    });

    const exerciseName = String(record.name || "").trim();

    const matchingExercise = exercises.find(
      exercise => exercise.name === exerciseName
    );

    const reps = Number(record.reps);
    const sets = Number(record.sets);
    const parsedDate = new Date(record.date);

    const validEntry =
      matchingExercise &&
      Number.isFinite(reps) &&
      Number.isFinite(sets) &&
      reps > 0 &&
      sets > 0 &&
      !Number.isNaN(parsedDate.getTime());

    if (!validEntry) {
      console.warn(
        `Skipped invalid CSV row ${rowIndex + 2}`,
        record
      );

      skippedRows++;
      return;
    }

    importedSessions.push({
      name: matchingExercise.name,

      /*
       * Use the current app image path instead of
       * trusting an edited or outdated CSV value.
       */
      image: matchingExercise.image,

      reps: reps,
      sets: sets,
      notes: String(record.notes || ""),
      date: parsedDate.toISOString()
    });
  });

  return {
    importedSessions,
    skippedRows
  };
}

/**
 * Creates a stable comparison key so merging
 * a backup does not duplicate identical entries.
 */
function createSessionKey(session) {
  return JSON.stringify({
    name: session.name,
    reps: Number(session.reps),
    sets: Number(session.sets),
    notes: String(session.notes || ""),
    date: new Date(session.date).toISOString()
  });
}

/**
 * Merges imported entries while removing exact duplicates.
 */
function mergeSessions(existingSessions, importedSessions) {
  const combinedSessions = [
    ...existingSessions,
    ...importedSessions
  ];

  const uniqueSessions = [];
  const knownSessionKeys = new Set();

  combinedSessions.forEach(session => {
    const sessionKey = createSessionKey(session);

    if (!knownSessionKeys.has(sessionKey)) {
      knownSessionKeys.add(sessionKey);
      uniqueSessions.push(session);
    }
  });

  return uniqueSessions;
}

/**
 * Refreshes every section affected by imported progress.
 */
function refreshProgressDisplay() {
  renderLog();
  renderExerciseRecords();
  updateStats();
  renderPerformanceChart(currentGraphMode);
}

/**
 * Handles the selected CSV backup file.
 */
async function importProgressFromCsv(file) {
  if (!file) return;

  const fileName = file.name.toLowerCase();

  if (!fileName.endsWith(".csv")) {
    alert("Please select an Ascended Masters CSV backup file.");
    return;
  }

  try {
    const csvText = await file.text();
    const parsedRows = parseCsv(csvText);

    const {
      importedSessions,
      skippedRows
    } = convertCsvRowsToSessions(parsedRows);

    if (importedSessions.length === 0) {
      throw new Error(
        "No valid workout sessions were found in this backup."
      );
    }

    let replaceExistingProgress = true;

    if (sessions.length > 0) {
      replaceExistingProgress = confirm(
        `${importedSessions.length} valid sessions were found.\n\n` +
        "Press OK to REPLACE your current progress.\n\n" +
        "Press Cancel to MERGE the backup with your current progress."
      );
    }

    if (replaceExistingProgress) {
      sessions = importedSessions;
    } else {
      sessions = mergeSessions(
        sessions,
        importedSessions
      );
    }

    /*
     * Sort chronologically so rest-day calculations
     * continue to use the newest session correctly.
     */
    sessions.sort((firstSession, secondSession) => {
      return (
        new Date(firstSession.date) -
        new Date(secondSession.date)
      );
    });

    localStorage.setItem(
      "ascensionSessions",
      JSON.stringify(sessions)
    );

    refreshProgressDisplay();

    let completionMessage =
      `${importedSessions.length} workout session${
        importedSessions.length === 1 ? "" : "s"
      } imported successfully.`;

    if (skippedRows > 0) {
      completionMessage +=
        `\n\n${skippedRows} invalid row${
          skippedRows === 1 ? " was" : "s were"
        } skipped.`;
    }

    alert(completionMessage);
  } catch (error) {
    console.error("CSV import failed:", error);

    alert(
      "The progress file could not be imported.\n\n" +
      error.message
    );
  } finally {
    /*
     * Resetting the file input allows the same
     * backup file to be selected again later.
     */
    csvFileInput.value = "";
  }
}

if (exportCsvBtn) {
  exportCsvBtn.addEventListener(
    "click",
    exportProgressToCsv
  );
}

if (importCsvBtn && csvFileInput) {
  importCsvBtn.addEventListener("click", () => {
    csvFileInput.click();
  });

  csvFileInput.addEventListener("change", event => {
    const selectedFile = event.target.files[0];

    importProgressFromCsv(selectedFile);
  });
}
