(() => {
  const palaceButtons = [...document.querySelectorAll(".palace-cell")];
  const board = document.getElementById("chartBoard");
  const canvas = document.getElementById("triadOverlay");
  const flowAge = document.getElementById("flowAge");
  const flowStatus = document.getElementById("flowStatus");
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

  new ResizeObserver(() => drawTriad(1)).observe(board);
  updateFlow();
  setActivePalace(activePalace);
})();
