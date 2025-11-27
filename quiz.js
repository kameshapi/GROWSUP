let questions = [];
let currentIndex = 0;
let answers = [];

const statusEl = document.getElementById("quiz-status");
const countEl = document.getElementById("quiz-count");
const questionEl = document.getElementById("quiz-question");
const optionsEl = document.getElementById("quiz-options");
const progressEl = document.getElementById("quiz-progress");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const resultEl = document.getElementById("quiz-result");

async function loadQuestions() {
  try {
    const res = await fetch("/api/questions");
    questions = await res.json();
    answers = new Array(questions.length).fill(null);
    renderQuestion();
  } catch (err) {
    questionEl.textContent = "Could not load questions. Please try again later.";
    console.error(err);
  }
}

function renderQuestion() {
  if (!questions.length) return;

  const q = questions[currentIndex];
  statusEl.textContent = `Question ${currentIndex + 1}`;
  countEl.textContent = `${currentIndex + 1} / ${questions.length}`;
  questionEl.textContent = q.question;

  const progressPercent = ((currentIndex + 1) / questions.length) * 100;
  progressEl.style.width = `${progressPercent}%`;

  optionsEl.innerHTML = "";

  q.options.forEach((opt, idx) => {
    const li = document.createElement("li");
    li.className = "quiz-option";
    if (answers[currentIndex] === idx) {
      li.classList.add("selected");
    }

    li.addEventListener("click", () => {
      answers[currentIndex] = idx;
      renderQuestion();
    });

    const indexBadge = document.createElement("span");
    indexBadge.className = "quiz-option-index";
    indexBadge.textContent = String.fromCharCode(65 + idx);

    const textSpan = document.createElement("span");
    textSpan.textContent = opt;

    li.appendChild(indexBadge);
    li.appendChild(textSpan);
    optionsEl.appendChild(li);
  });

  prevBtn.disabled = currentIndex === 0;
  nextBtn.textContent = currentIndex === questions.length - 1 ? "Submit" : "Next";
}

async function submitQuiz() {
  try {
    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    });
    const data = await res.json();

    const resultClass = data.result === "Pass" ? "pass" : "fail";
    resultEl.classList.remove("pass", "fail");
    resultEl.classList.add(resultClass);
    resultEl.innerHTML = `
      <strong>${data.result}</strong>
      You scored ${data.score} out of ${data.totalQuestions}.
    `;
    resultEl.style.display = "block";
  } catch (err) {
    console.error(err);
    resultEl.classList.remove("pass", "fail");
    resultEl.style.display = "block";
    resultEl.textContent = "There was an error submitting your quiz. Please try again.";
  }
}

nextBtn.addEventListener("click", () => {
  if (!questions.length) return;

  if (currentIndex === questions.length - 1) {
    submitQuiz();
    return;
  }
  currentIndex++;
  renderQuestion();
});

prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion();
  }
});

loadQuestions();
