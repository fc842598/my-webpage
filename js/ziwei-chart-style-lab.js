(() => {
  const palaceButtons = [...document.querySelectorAll(".palace-cell")];
  const board = document.getElementById("chartBoard");
  const canvas = document.getElementById("triadOverlay");
  const flowAge = document.getElementById("flowAge");
  const flowStatus = document.getElementById("flowStatus");
  const flowBadge = document.querySelector(".flow-age");
  const flowStepButtons = [...document.querySelectorAll("[data-flow-step]")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const flowRevealDuration = 5000;

  let activePalace = document.querySelector(".palace-cell.is-active") || palaceButtons[0];
  let animationFrame = 0;
  let flowRevealTimer = 0;
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

  const drawPartialSegment = (context, start, end, progress) => {
    if (progress <= 0) return;
    const endX = start.x + (end.x - start.x) * Math.min(1, progress);
    const endY = start.y + (end.y - start.y) * Math.min(1, progress);
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(endX, endY);
    context.stroke();
  };

  const drawPartialPath = (context, points, progress) => {
    const segmentCount = points.length - 1;
    points.slice(0, -1).forEach((point, index) => {
      const segmentProgress = Math.max(0, Math.min(1, progress * segmentCount - index));
      drawPartialSegment(context, point, points[index + 1], segmentProgress);
    });
  };

  const drawRelationPoint = (context, point, fill, opacity) => {
    context.save();
    context.globalAlpha = opacity;
    context.beginPath();
    context.arc(point.x, point.y, 2.2, 0, Math.PI * 2);
    context.fillStyle = fill;
    context.fill();
    context.lineWidth = .7;
    context.strokeStyle = "rgba(255, 250, 238, .82)";
    context.stroke();
    context.restore();
  };

  const drawTriad = (progress = 1) => {
    const context = canvas.getContext("2d");
    const { ratio, width, height } = resizeCanvas();
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);

    const sourceIndex = palaceButtons.indexOf(activePalace);
    const source = getCellCenter(activePalace);
    const targetIndexes = getTriadIndexes(sourceIndex);
    const sanhe = targetIndexes.slice(0, 2).map((index) => getCellCenter(palaceButtons[index]));
    const opposite = getCellCenter(palaceButtons[targetIndexes[2]]);

    context.save();
    context.lineCap = "round";
    context.lineJoin = "round";
    context.setLineDash([7, 6]);
    context.lineDashOffset = (1 - progress) * 22;

    context.strokeStyle = "rgba(151, 82, 48, .48)";
    context.lineWidth = .9;
    drawPartialPath(context, [source, ...sanhe, source], progress);

    context.strokeStyle = "rgba(66, 52, 43, .40)";
    context.lineWidth = .85;
    drawPartialSegment(context, source, opposite, Math.min(1, progress * 1.25));

    const pointOpacity = Math.max(0, Math.min(1, (progress - .68) / .32));
    drawRelationPoint(context, source, "rgba(198, 144, 48, .82)", pointOpacity);
    sanhe.forEach((point) => drawRelationPoint(context, point, "rgba(198, 144, 48, .74)", pointOpacity));
    drawRelationPoint(context, opposite, "rgba(60, 139, 119, .76)", pointOpacity);
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

  const updateFlow = () => {
    const { age, button } = getFlowTarget();
    window.clearTimeout(flowRevealTimer);
    palaceButtons.forEach((item) => item.classList.remove("is-flowing"));
    button.classList.add("is-flowing");
    button.append(flowBadge);
    flowBadge.textContent = `${age}岁`;
    flowBadge.classList.remove("is-entering");
    void flowBadge.offsetWidth;
    flowBadge.classList.add("is-entering");

    const shiftText = hourShift === 0
      ? ""
      : ` · 时辰${hourShift > 0 ? "顺" : "逆"}推${Math.abs(hourShift)}步`;
    flowStatus.textContent = `${age}岁 · ${button.dataset.palace}${shiftText}`;

    flowRevealTimer = window.setTimeout(() => {
      button.classList.remove("is-flowing");
      flowRevealTimer = 0;
    }, flowRevealDuration);
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

  flowBadge.addEventListener("animationend", (event) => {
    if (event.animationName === "flow-badge-arrive") flowBadge.classList.remove("is-entering");
  });

  new ResizeObserver(() => drawTriad(1)).observe(board);
  updateFlow();
  setActivePalace(activePalace);
})();
