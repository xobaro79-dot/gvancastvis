// 1. დასაწყისის "კი" და "არა" ინტერაქტიული მექანიზმი
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const noHint = document.getElementById('no-hint');

let noClicks = 0;
const noMessages = [
  "დარწმუნებული ხარ? სულ ორი წუთი დაგჭირდება...",
  "ეს ღილაკი ცოტა ჯიუტია, სჯობს „კი“-ს დააჭირო ✨",
  "გპირდები, თავს არ მოგაბეზრებ — უბრალოდ ნახე ❤️"
];

noBtn.addEventListener('click', () => {
  const offsetX = (Math.random() - 0.5) * 120;
  const offsetY = (Math.random() - 0.5) * 50;
  noBtn.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  noHint.textContent = noMessages[noClicks % noMessages.length];
  noClicks++;
});

yesBtn.addEventListener('click', () => {
  goToStep(1);
});

// 2. ნაბიჯებს შორის გადასვლა ანიმაციით
function goToStep(stepNumber) {
  const overlay = document.getElementById('transition-overlay');
  overlay.classList.add('show');

  setTimeout(() => {
    document.querySelectorAll('.step').forEach(sec => sec.classList.remove('active'));
    const target = document.getElementById(`step-${stepNumber}`);
    if (target) target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 380);

  setTimeout(() => {
    overlay.classList.remove('show');
  }, 880);
}

// 3. კონვერტის გახსნა და ბარათის გამოჩენა
function openEnvelope(num) {
  const env = document.getElementById(`env-${num}`);
  const card = document.getElementById(`card-${num}`);
  const overlay = document.getElementById('transition-overlay');

  overlay.classList.add('show');
  setTimeout(() => {
    env.classList.add('hidden');
    card.classList.remove('hidden');
  }, 320);

  setTimeout(() => {
    overlay.classList.remove('show');
  }, 760);
}

// 4. ვოისის კონტროლი და ხმის ტალღების ანიმაცია
const voiceAudio = document.getElementById('voice-audio');
const voiceBox = document.getElementById('voice-box');
const voiceIcon = document.getElementById('voice-icon');
const voiceLabel = document.getElementById('voice-label');
const voiceTimer = document.getElementById('voice-timer');

voiceAudio.addEventListener('loadedmetadata', () => {
  if (voiceAudio.duration && !isNaN(voiceAudio.duration)) {
    voiceTimer.textContent = `00:00 / ${formatTime(voiceAudio.duration)}`;
  }
});

function toggleVoice() {
  if (!favSong.paused) {
    favSong.pause();
    songBtn.classList.remove('playing');
    songBtnText.textContent = 'ჩართე ჩვენი მელოდია';
  }

  if (voiceAudio.paused) {
    voiceAudio.play().catch(() => {
      alert('დარწმუნდი, რომ საქაღალდეში ჩაგდებულია voice.mp3 ფაილი.');
    });
    voiceBox.classList.add('playing');
    voiceIcon.textContent = '⏸';
    voiceLabel.textContent = 'მიმდინარეობს მოსმენა...';
  } else {
    voiceAudio.pause();
    voiceBox.classList.remove('playing');
    voiceIcon.textContent = '▶';
    voiceLabel.textContent = 'გააგრძელე მოსმენა';
  }
}

voiceAudio.addEventListener('timeupdate', () => {
  const cur = formatTime(voiceAudio.currentTime);
  const dur = voiceAudio.duration && !isNaN(voiceAudio.duration)
    ? formatTime(voiceAudio.duration)
    : '01:30';
  voiceTimer.textContent = `${cur} / ${dur}`;
});

voiceAudio.addEventListener('ended', () => {
  voiceBox.classList.remove('playing');
  voiceIcon.textContent = '↻';
  voiceLabel.textContent = 'თავიდან მოსმენა';
});

// 5. საყვარელი სიმღერის კონტროლი ბონუს ბარათში
const favSong = document.getElementById('fav-song');
const songBtn = document.getElementById('song-play-btn');
const songBtnText = document.getElementById('song-btn-text');

function toggleSong() {
  if (!voiceAudio.paused) {
    voiceAudio.pause();
    voiceBox.classList.remove('playing');
    voiceIcon.textContent = '▶';
    voiceLabel.textContent = 'მოუსმინე ჩემს ხმას';
  }

  if (favSong.paused) {
    favSong.play().catch(() => {
      alert('დარწმუნდი, რომ საქაღალდეში ჩაგდებულია song.mp3 ფაილი.');
    });
    songBtn.classList.add('playing');
    songBtnText.textContent = 'ჩვენი მელოდია უკრავს... (პაუზა)';
  } else {
    favSong.pause();
    songBtn.classList.remove('playing');
    songBtnText.textContent = 'ჩართე ჩვენი მელოდია';
  }
}

favSong.addEventListener('ended', () => {
  songBtn.classList.remove('playing');
  songBtnText.textContent = 'ჩართე ჩვენი მელოდია';
});

function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// 6. ფინალური არჩევანის დაფიქსირება, ანიმაცია და მაშას გვერდი
let choiceAnimTimeout = null;

function chooseFinal(choiceText) {
  const feedbackEl = document.getElementById('final-feedback');
  const overlayEl = document.getElementById('choice-anim-overlay');
  const animIconEl = document.getElementById('choice-anim-icon');
  const animTextEl = document.getElementById('choice-anim-text');
  const joyScreenEl = document.getElementById('joy-screen');
  const mashaStageEl = document.getElementById('masha-stage');
  const joyBadgeEl = document.getElementById('joy-badge');
  const joyTitleEl = document.getElementById('joy-title');
  const joyMessageEl = document.getElementById('joy-message');
  const joyCopyBoxEl = document.getElementById('joy-copy-box');

  const isForgiven = choiceText.includes('გაპატიე');
  const autoMsg = isForgiven
    ? 'კარგი ხო გაპატიე, ვილაპარაკოთ — მოვისმინე და წავიკითხე ყველაფერი.'
    : 'ჯერ ისევ გაბრაზებულივარ ამიტომ შემეშვი — წავიკითხე და მოვისმინე.';

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(autoMsg).catch(() => {});
  }

  if (feedbackEl) {
    feedbackEl.classList.remove('hidden');
    feedbackEl.innerHTML = `
      <strong>არჩეული პასუხი: „${choiceText}“</strong><br>
      მზა შეტყობინება დაკოპირდა — შეგიძლია პირდაპირ ჩამიგდო ჩატში.
    `;
  }

  if (choiceAnimTimeout) {
    clearTimeout(choiceAnimTimeout);
  }

  if (overlayEl && animIconEl && animTextEl) {
    overlayEl.classList.toggle('calm-mode', !isForgiven);
    overlayEl.classList.remove('hidden');

    if (isForgiven) {
      animIconEl.textContent = '✨';
      animTextEl.textContent = 'რა მაგარია... მაშაც სიხარულით ხტუნავს!';
    } else {
      animIconEl.textContent = '🥀';
      animTextEl.textContent = 'მესმის... გული დამწყდა, მაგრამ პატივს ვცემ შენს გრძნობებს.';
    }
  }

  choiceAnimTimeout = setTimeout(() => {
    if (overlayEl) {
      overlayEl.classList.add('hidden');
    }

    if (joyScreenEl && joyBadgeEl && joyTitleEl && joyMessageEl && joyCopyBoxEl) {
      joyScreenEl.classList.toggle('calm-screen', !isForgiven);
      joyScreenEl.classList.remove('hidden');

      if (mashaStageEl) {
        mashaStageEl.classList.toggle('masha-happy', isForgiven);
        mashaStageEl.classList.toggle('masha-sad', !isForgiven);
      }

      if (isForgiven) {
        joyBadgeEl.textContent = '✨ ყველაზე დიდი სიხარული';
        joyTitleEl.textContent = 'გული ისე გამინათდა, სიხარულით ვხტუნავ!';
        joyMessageEl.textContent =
          'არ იცი, რამხელა შვება და ბედნიერება მომცა შენმა სიტყვებმა. ყველაზე მეტად შენი ხმა, ჩვენი სითბო და ის სიმშვიდე მენატრება, რაც შენთან ერთად მაქვს. მადლობა, რომ მომისმინე — მოდი, მშვიდად და გულით ვილაპარაკოთ.';
      } else {
        joyBadgeEl.textContent = '🥀 სევდა და გაგება';
        joyTitleEl.textContent = 'მესმის, რომ ჯერ ისევ გაბრაზებული ხარ...';
        joyMessageEl.textContent =
          'გული ძალიან დამწყდა, მაგრამ არანაირ ზეწოლას არ მოვახდენ. მესმის შენი სიბრაზე და ვიცი, რომ ტკივილი მოგაყენე. როცა და როგორიც გინდა, ისე იყოს — მე მაინც აქ ვარ და შენს სიმშვიდეს პატივს ვცემ.';
      }

      joyCopyBoxEl.innerHTML = `
        <strong>დაკოპირებული პასუხი:</strong> „${autoMsg}“<br>
        შეგიძლია პირდაპირ ჩამიგდო ჩატში.
      `;
    }
  }, 1350);
}

function backToCardFromJoy() {
  const joyScreenEl = document.getElementById('joy-screen');
  if (joyScreenEl) {
    joyScreenEl.classList.add('hidden');
  }
}

// 7. ფონის მბზინავი ნაწილაკების ანიმაცია
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

for (let i = 0; i < 50; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 0.6,
    dx: (Math.random() - 0.5) * 0.35,
    dy: (Math.random() - 0.5) * 0.35,
    alpha: Math.random() * 0.7 + 0.2
  });
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.x += p.dx;
    p.y += p.dy;
    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 232, 160, ${p.alpha})`;
    ctx.fill();
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();