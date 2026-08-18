(() => {
  const palaceButtons = [...document.querySelectorAll(".palace-cell")];
  const board = document.getElementById("chartBoard");
  const canvas = document.getElementById("triadOverlay");
  const flowAge = document.getElementById("flowAge");
  const flowStatus = document.getElementById("flowStatus");
  const flowBadge = document.querySelector(".flow-age");
  const flowStepButtons = [...document.querySelectorAll("[data-flow-step]")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let activePalace = document.querySelector(".palace-cell.is-active") || palaceButtons[0];
  let animationFrame = 0;
  let hourShift = 0;

  const normalizeIndex = (index) => (index % palaceButtons.length + palaceButtons.length) % palaceButtons.length;
  const getTriadIndexes = (index) => [index + 4, index + 8, index + 6].map(normalizeIndex);

  const resizeCanvas = () => {
    const ratio = window.devicePixelRatio || 1;
    const width = board.clientWidth;
    const height = board.clientHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    return { ratio, width, height };
  };

  const getCellCenter = (button) => {
    const boardRect = board.getBoundingClientRect();
    const cellRect = button.getBoundingClientRect();
    return {
      x: cellRect.left - boardRect.left + cellRect.width / 2,
      y: cellRect.top - boardRect.top + cellRect.height / 2,
    };
  };

  const drawTriad = (progress = 1) => {
    const context = canvas.getContext("2d");
    const { ratio, width, height } = resizeCanvas();
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);

    const sourceIndex = palaceButtons.indexOf(activePalace);
    const source = getCellCenter(activePalace);
    const targetIndexes = getTriadIndexes(sourceIndex);

    context.save();
    context.strokeStyle = "rgba(137, 104, 67, .56)";
    context.lineWidth = 1.15;
    context.setLineDash([5, 6]);
    context.lineDashOffset = (1 - progress) * 28;
    context.lineCap = "round";

    targetIndexes.forEach((index) => {
      const target = getCellCenter(palaceButtons[index]);
      const endX = source.x + (target.x - source.x) * progress;
      const endY = source.y + (target.y - source.y) * progress;
      context.beginPath();
      context.moveTo(source.x, source.y);
      context.lineTo(endX, endY);
      context.stroke();
    });
    context.restore();
  };

  const animateTriad = () => {
    cancelAnimationFrame(animationFrame);
    if (reducedMotion) {
      drawTriad(1);
      return;
    }

    const startedAt = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - startedAt) / 440);
      drawTriad(1 - Math.pow(1 - progress, 3));
      if (progress < 1) animationFrame = requestAnimationFrame(tick);
    };
    animationFrame = requestAnimationFrame(tick);
  };

  const setActivePalace = (button) => {
    activePalace = button;
    const activeIndex = palaceButtons.indexOf(button);
    const related = new Set(getTriadIndexes(activeIndex));

    palaceButtons.forEach((item, index) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.classList.toggle("is-related", !active && related.has(index));
      item.setAttribute("aria-pressed", String(active));
    });

    button.classList.remove("is-pulse");
    void button.offsetWidth;
    button.classList.add("is-pulse");
    animateTriad();
  };

  const getFlowTarget = () => {
    const age = Number(flowAge.value || 39);
    const index = normalizeIndex(10 + (age - 39) + hourShift);
    return { age, button: palaceButtons[index] };
  };

  const updateFlow = (activate = true) => {
    const { age, button } = getFlowTarget();
    palaceButtons.forEach((item) => item.classList.remove("is-flowing"));
    button.classList.add("is-flowing");
    button.append(flowBadge);
    flowBadge.textContent = `${age}岁`;

    const shiftText = hourShift === 0
      ? ""
      : ` · 时辰${hourShift > 0 ? "顺" : "逆"}推${Math.abs(hourShift)}步`;
    flowStatus.textContent = `${age}岁 · ${button.dataset.palace}${shiftText}`;
    if (activate) setActivePalace(button);
  };

  for (let age = 1; age <= 100; age += 1) {
    const option = document.createElement("option");
    option.value = String(age);
    option.textContent = `${age}岁`;
    option.selected = age === 39;
    flowAge.append(option);
  }

  palaceButtons.forEach((button) => {
    button.addEventListener("click", () => setActivePalace(button));
    button.addEventListener("animationend", () => button.classList.remove("is-pulse"));
  });

  flowAge.addEventListener("change", () => {
    hourShift = 0;
    updateFlow();
  });

  flowStepButtons.forEach((button) => {
    button.addEventListener("click", () => {
      hourShift += Number(button.dataset.flowStep || 0);
      updateFlow();
    });
  });

  new ResizeObserver(() => drawTriad(1)).observe(board);
  updateFlow(false);
  setActivePalace(activePalace);
})();
