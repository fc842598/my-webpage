(() => {
  const palaceButtons = [...document.querySelectorAll(".palace-cell")];
  const board = document.getElementById("chartBoard");
  const canvas = document.getElementById("triadOverlay");
  const flowAge = document.getElementById("flowAge");
  const flowStatus = document.getElementById("flowStatus");
  const introReplay = document.getElementById("introReplay");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const flowFadeDelay = 5000;
  const earthlyBranches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
  const oneYearStartGroups = [
    { birthBranches: ["寅", "午", "戌"], startBranch: "辰" },
    { birthBranches: ["申", "子", "辰"], startBranch: "戌" },
    { birthBranches: ["巳", "酉", "丑"], startBranch: "未" },
    { birthBranches: ["亥", "卯", "未"], startBranch: "丑" },
  ];

  let activePalace = document.querySelector(".palace-cell.is-active") || palaceButtons[0];
  let animationFrame = 0;
  let flowTimers = [];
  let introRunning = false;

  const stampSequence = [
    { key: "life", label: "命宫", duration: 760, rotation: -4 },
    { key: "body", label: "身宫", duration: 720, rotation: 4 },
    { key: "lu", label: "化禄", duration: 640, rotation: -4 },
    { key: "quan", label: "化权", duration: 640, rotation: 3 },
    { key: "ke", label: "化科", duration: 640, rotation: -3 },
    { key: "ji", label: "化忌", duration: 680, rotation: 4 },
  ];

  const wait = (duration) => new Promise((resolve) => window.setTimeout(resolve, duration));
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const normalizeIndex = (index, length = palaceButtons.length) => (index % length + length) % length;
  const getTriadIndexes = (index) => [index + 4, index + 8, index + 6].map((targetIndex) => normalizeIndex(targetIndex));

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

  const clearIntroArtifacts = () => {
    board.classList.remove("is-intro-opening");
    board.querySelectorAll(".chart-intro-layer").forEach((layer) => layer.remove());
    board.querySelectorAll(".is-stamp-impact").forEach((cell) => cell.classList.remove("is-stamp-impact"));
    board.querySelectorAll(".intro-stamp-target").forEach((target) => {
      target.classList.remove("is-intro-hidden", "is-stamp-landed");
    });
  };

  const createImpact = (layer, target, key) => {
    const boardRect = board.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const ring = document.createElement("span");
    ring.className = `chart-impact-ring chart-impact-ring--${key}`;
    ring.style.left = `${targetRect.left - boardRect.left + targetRect.width / 2}px`;
    ring.style.top = `${targetRect.top - boardRect.top + targetRect.height / 2}px`;
    ring.setAttribute("aria-hidden", "true");
    layer.append(ring);
    window.setTimeout(() => ring.remove(), 500);

    const palace = target.closest(".palace-cell");
    if (palace) {
      palace.classList.remove("is-stamp-impact");
      void palace.offsetWidth;
      palace.classList.add("is-stamp-impact");
      window.setTimeout(() => palace.classList.remove("is-stamp-impact"), 390);
    }
  };

  const flyStamp = async (layer, stamp) => {
    const target = board.querySelector(`[data-stamp-key="${stamp.key}"]`);
    if (!target) return;

    const boardRect = board.getBoundingClientRect();
    const centerRect = board.querySelector(".chart-center").getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const targetX = targetRect.left - boardRect.left + targetRect.width / 2;
    const targetY = targetRect.top - boardRect.top + targetRect.height / 2;
    const centerX = centerRect.left - boardRect.left + centerRect.width / 2;
    const centerY = centerRect.top - boardRect.top + centerRect.height / 2;

    const flight = document.createElement("span");
    flight.className = `chart-stamp-flight chart-stamp-flight--${stamp.key}`;
    flight.textContent = stamp.label;
    flight.style.left = `${targetX}px`;
    flight.style.top = `${targetY}px`;
    flight.setAttribute("aria-hidden", "true");
    layer.append(flight);

    const flightRect = flight.getBoundingClientRect();
    const landingScale = clamp(targetRect.width / flightRect.width, .48, .88);
    const dx = centerX - targetX;
    const dy = centerY - targetY;
    const at = (x, y, scale, rotation = 0) =>
      `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`;

    const animation = flight.animate([
      { offset: 0, easing: "cubic-bezier(.2,.72,.24,1)", opacity: 0, filter: "blur(3px)", transform: at(dx, dy - 26, 1.28, stamp.rotation) },
      { offset: .16, easing: "ease-in-out", opacity: 1, filter: "blur(0)", transform: at(dx, dy, 1.45, stamp.rotation) },
      { offset: .4, easing: "cubic-bezier(.45,0,.68,1)", opacity: 1, filter: "blur(0)", transform: at(dx, dy, 1.38, -stamp.rotation / 2) },
      { offset: .72, easing: "cubic-bezier(.18,.76,.3,1)", opacity: 1, filter: "blur(0)", transform: at(0, -18, landingScale * 1.35, stamp.rotation / 3) },
      { offset: .84, easing: "ease-out", opacity: 1, filter: "blur(0)", transform: at(0, 5, landingScale * .86, 0) },
      { offset: 1, opacity: 1, filter: "blur(0)", transform: at(0, 0, landingScale, 0) },
    ], {
      duration: stamp.duration,
      easing: "linear",
      fill: "forwards",
    });

    await animation.finished.catch(() => undefined);
    target.classList.remove("is-intro-hidden");
    target.classList.add("is-stamp-landed");
    flight.remove();
    createImpact(layer, target, stamp.key);
    window.setTimeout(() => target.classList.remove("is-stamp-landed"), 440);
    await wait(86);
  };

  const runChartIntro = async () => {
    if (introRunning) return;
    introRunning = true;
    introReplay.disabled = true;
    introReplay.textContent = "开盘中";
    clearIntroArtifacts();

    const targets = [...board.querySelectorAll(".intro-stamp-target")];
    if (reducedMotion || typeof Element.prototype.animate !== "function") {
      targets.forEach((target) => target.classList.remove("is-intro-hidden"));
      introReplay.disabled = false;
      introReplay.textContent = "重播特效";
      introRunning = false;
      return;
    }

    targets.forEach((target) => target.classList.add("is-intro-hidden"));
    palaceButtons.forEach((button, index) => button.style.setProperty("--intro-order", String(index)));
    board.classList.add("is-intro-opening");
    await wait(680);
    board.classList.remove("is-intro-opening");

    const layer = document.createElement("div");
    layer.className = "chart-intro-layer";
    layer.setAttribute("aria-hidden", "true");
    board.append(layer);

    try {
      for (const stamp of stampSequence) {
        await flyStamp(layer, stamp);
      }
    } finally {
      targets.forEach((target) => target.classList.remove("is-intro-hidden"));
      await wait(460);
      layer.remove();
      introReplay.disabled = false;
      introReplay.textContent = "重播特效";
      introRunning = false;
    }
  };

  const getPalaceByBranch = (branch) => {
    const button = palaceButtons.find((item) => item.dataset.branch.endsWith(branch));
    if (!button) throw new Error(`命盘缺少${branch}宫，无法显示小流年`);
    return button;
  };

  const getOneYearStartBranch = () => {
    const birthYearBranch = board.dataset.birthYearBranch;
    const group = oneYearStartGroups.find((item) => item.birthBranches.includes(birthYearBranch));
    if (!group) throw new Error(`无法识别生年地支：${birthYearBranch || "未填写"}`);
    return group.startBranch;
  };

  const getFlowBranch = (age) => {
    const startIndex = earthlyBranches.indexOf(getOneYearStartBranch());
    const sex = board.dataset.sex;
    if (!["male", "female"].includes(sex)) throw new Error(`无法识别性别：${sex || "未填写"}`);
    const direction = sex === "female" ? -1 : 1;
    const branchIndex = normalizeIndex(startIndex + direction * (age - 1), earthlyBranches.length);
    return earthlyBranches[branchIndex];
  };

  const getFlowCycle = (selectedAge) => {
    const cycleStart = Math.floor((selectedAge - 1) / earthlyBranches.length) * earthlyBranches.length + 1;
    return Array.from({ length: earthlyBranches.length }, (_, offset) => {
      const age = cycleStart + offset;
      const branch = getFlowBranch(age);
      return { age, branch, button: getPalaceByBranch(branch) };
    });
  };

  const clearFlowCycle = () => {
    flowTimers.forEach((timer) => window.clearTimeout(timer));
    flowTimers = [];
    palaceButtons.forEach((button) => {
      button.classList.remove("is-flow-primary");
      button.querySelectorAll(".flow-age").forEach((badge) => badge.remove());
    });
  };

  const createFlowBadge = ({ age, button }, selectedAge) => {
    const isPrimary = age === selectedAge;
    const badge = document.createElement("span");
    badge.className = `flow-age flow-age--${isPrimary ? "primary" : "secondary"}`;
    badge.textContent = `${age}岁`;
    badge.setAttribute("aria-hidden", "true");

    if (isPrimary) {
      button.classList.add("is-flow-primary");
      badge.classList.add("is-entering");
    } else {
      badge.style.setProperty("--flow-order", String(normalizeIndex(age - selectedAge, earthlyBranches.length)));
    }

    button.append(badge);
    return badge;
  };

  const updateFlow = () => {
    const age = Number(flowAge.value || 39);
    const cycle = getFlowCycle(age);
    clearFlowCycle();

    const badges = cycle.map((entry) => createFlowBadge(entry, age));
    const secondaryBadges = badges.filter((badge) => badge.classList.contains("flow-age--secondary"));
    const selectedEntry = cycle.find((entry) => entry.age === age);
    const cycleStart = cycle[0].age;
    const cycleEnd = cycle[cycle.length - 1].age;

    void board.offsetWidth;
    secondaryBadges.forEach((badge) => badge.classList.add("is-visible"));
    flowStatus.textContent = `${age}岁 · ${selectedEntry.button.dataset.palace} · 同轮${cycleStart}–${cycleEnd}岁`;

    flowTimers.push(window.setTimeout(() => {
      selectedEntry.button.classList.remove("is-flow-primary");
      secondaryBadges.forEach((badge) => badge.classList.add("is-fading"));
    }, flowFadeDelay));
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

  flowAge.addEventListener("change", updateFlow);
  introReplay.addEventListener("click", runChartIntro);

  new ResizeObserver(() => drawTriad(1)).observe(board);
  updateFlow();
  setActivePalace(activePalace);
  window.setTimeout(runChartIntro, 260);
})();
