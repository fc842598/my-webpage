(function () {
  "use strict";

  const lineLabels = ["初爻", "二爻", "三爻", "四爻", "五爻", "上爻"];
  const yaoInfo = {
    6: { name: "老阴", yin: true, moving: true, mark: "×", coins: "反反反" },
    7: { name: "少阳", yin: false, moving: false, mark: "", coins: "正反反" },
    8: { name: "少阴", yin: true, moving: false, mark: "", coins: "正正反" },
    9: { name: "老阳", yin: false, moving: true, mark: "○", coins: "正正正" },
  };

  const $ = (selector) => document.querySelector(selector);
  const state = {
    question: "",
    lines: [],
    phase: "idle",
    voice: true,
    auto: false,
    listening: false,
    lastPrompt: "先定一个问题，我来替你抛六次铜钱。",
    scene: null,
    audio: null,
    recognition: null,
    toastTimer: 0,
    speakTimer: 0,
  };

  const els = {};

  function normalizeText(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function coinLabel(heads) {
    return heads ? "正" : "反";
  }

  function lineValue(coins) {
    return coins.reduce((sum, heads) => sum + (heads ? 3 : 2), 0);
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function showToast(message) {
    if (!els.toast) return;
    els.toast.textContent = message;
    els.toast.classList.add("is-visible");
    window.clearTimeout(state.toastTimer);
    state.toastTimer = window.setTimeout(() => {
      els.toast.classList.remove("is-visible");
    }, 1800);
  }

  function setPrompt(text, speakNow = false) {
    state.lastPrompt = text;
    if (els.bubbleText) els.bubbleText.textContent = text;
    if (speakNow) speak(text);
  }

  function cueBeautyTalking(duration = 1400) {
    els.beauty?.classList.add("is-speaking");
    window.clearTimeout(state.speakTimer);
    state.speakTimer = window.setTimeout(() => {
      els.beauty?.classList.remove("is-speaking");
    }, duration);
  }

  function chooseVoice() {
    const voices = window.speechSynthesis?.getVoices?.() || [];
    return voices.find((voice) => /zh|cmn|yue/i.test(voice.lang) && /female|xiaoxiao|ting|hui|han|chinese|mandarin/i.test(voice.name))
      || voices.find((voice) => /zh|cmn|yue/i.test(voice.lang))
      || voices[0]
      || null;
  }

  function speak(text) {
    const clean = normalizeText(text);
    if (!clean) return;
    cueBeautyTalking();
    if (!state.voice || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(clean);
    const voice = chooseVoice();
    if (voice) utterance.voice = voice;
    utterance.lang = voice?.lang || "zh-CN";
    utterance.rate = 0.96;
    utterance.pitch = 1.08;
    utterance.onstart = () => {
      window.clearTimeout(state.speakTimer);
      els.beauty?.classList.add("is-speaking");
    };
    utterance.onend = () => {
      window.clearTimeout(state.speakTimer);
      els.beauty?.classList.remove("is-speaking");
    };
    utterance.onerror = () => {
      window.clearTimeout(state.speakTimer);
      els.beauty?.classList.remove("is-speaking");
    };
    window.speechSynthesis.speak(utterance);
  }

  function toggleVoice() {
    state.voice = !state.voice;
    if (!state.voice && "speechSynthesis" in window) window.speechSynthesis.cancel();
    if (els.voiceToggle) {
      els.voiceToggle.setAttribute("aria-pressed", String(state.voice));
      els.voiceToggle.setAttribute("aria-label", state.voice ? "关闭语音" : "开启语音");
    }
    showToast(state.voice ? "语音已开" : "语音已关");
    if (state.voice) speak(state.lastPrompt);
  }

  function setupSpeechInput() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition || !els.micButton) {
      if (els.micButton) els.micButton.disabled = true;
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "zh-CN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => {
      state.listening = true;
      els.micButton.classList.add("is-listening");
      showToast("正在听");
    };
    recognition.onend = () => {
      state.listening = false;
      els.micButton.classList.remove("is-listening");
    };
    recognition.onerror = () => {
      showToast("没听清，再点一次");
    };
    recognition.onresult = (event) => {
      const transcript = normalizeText(event.results?.[0]?.[0]?.transcript || "");
      if (!transcript) return;
      state.question = transcript.slice(0, 80);
      els.question.value = state.question;
      setPrompt("收到，我按这个问题起卦。", true);
      render();
    };
    state.recognition = recognition;
  }

  function toggleMic() {
    if (!state.recognition) {
      showToast("当前浏览器不支持语音输入");
      return;
    }
    if (state.listening) {
      state.recognition.stop();
      return;
    }
    try {
      state.recognition.start();
    } catch (error) {
      showToast("语音输入正在准备");
    }
  }

  function playAudio(type) {
    if (!state.audio && window.DivinationAudio) state.audio = new window.DivinationAudio();
    if (!state.audio) return;
    if (state.audio.resume) state.audio.resume();
    if (type === "shake") state.audio.shake?.();
    if (type === "pour") state.audio.pour?.();
    if (type === "spin") state.audio.spin?.();
    if (type === "settle") state.audio.settle?.();
  }

  function haptic(type) {
    if (!window.Haptic) return;
    if (type === "settle") window.Haptic.settle?.();
    else window.Haptic.pulse?.(18);
  }

  function makeCoins() {
    return [Math.random() > 0.5, Math.random() > 0.5, Math.random() > 0.5];
  }

  function canToss() {
    return state.phase === "idle" && state.lines.length < 6;
  }

  function requireQuestion() {
    const clean = normalizeText(els.question?.value);
    state.question = clean;
    if (clean) return true;
    setPrompt("先把要问的事写下来，再开始抛币。", true);
    showToast("先填写问题");
    els.question?.focus();
    render();
    return false;
  }

  function tossOnce() {
    if (!requireQuestion() || !canToss()) return Promise.resolve(false);
    const lineIndex = state.lines.length;
    const coins = makeCoins();
    state.phase = "tossing";
    setPrompt(`正在抛${lineLabels[lineIndex]}。`, true);
    els.beauty?.classList.add("is-tossing");
    playAudio("shake");
    window.setTimeout(() => playAudio("pour"), 520);
    window.setTimeout(() => playAudio("spin"), 980);
    haptic("start");
    render();

    return new Promise((resolve) => {
      const finish = () => {
        const value = lineValue(coins);
        const info = yaoInfo[value];
        state.lines.push({ coins, value });
        state.phase = "idle";
        els.beauty?.classList.remove("is-tossing");
        playAudio("settle");
        haptic("settle");
        render();
        if (state.lines.length >= 6) {
          setPrompt("卦已经成了，下面先看本卦、动爻和变卦。", true);
          showResult();
        } else {
          setPrompt(`${lineLabels[lineIndex]}为${info.name}${info.mark ? info.mark : ""}，继续投${lineLabels[state.lines.length]}。`, true);
        }
        resolve(true);
      };

      if (state.scene) {
        state.scene.toss(coins, finish);
      } else {
        window.setTimeout(finish, 1800);
      }
    });
  }

  async function autoCast() {
    if (!requireQuestion() || state.auto || state.lines.length >= 6) return;
    state.auto = true;
    els.beauty?.classList.add("is-thinking");
    render();
    try {
      while (state.auto && state.lines.length < 6) {
        const ok = await tossOnce();
        if (!ok) break;
        if (state.lines.length < 6) {
          await new Promise((resolve) => window.setTimeout(resolve, 650));
        }
      }
    } finally {
      state.auto = false;
      els.beauty?.classList.remove("is-thinking");
      render();
    }
  }

  function resetAll() {
    state.auto = false;
    state.phase = "idle";
    state.lines = [];
    window.clearTimeout(state.speakTimer);
    els.beauty?.classList.remove("is-tossing", "is-speaking", "is-thinking");
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    if (state.scene) state.scene.clear();
    if (els.resultSheet) els.resultSheet.hidden = true;
    if (els.resultNotice) els.resultNotice.hidden = true;
    setPrompt("先定一个问题，我来替你抛六次铜钱。", state.voice);
    render();
  }

  function getHexName(vals) {
    try {
      if (window.getHexInfo && vals.length === 6) return window.getHexInfo(vals);
    } catch (error) {}
    return { number: "", name: "本卦", fullName: "六爻本卦" };
  }

  function getChangedName(vals) {
    try {
      if (window.getChangedHex && vals.length === 6) return window.getChangedHex(vals);
    } catch (error) {}
    return null;
  }

  function movingLabels(vals) {
    return vals
      .map((value, index) => (value === 6 || value === 9 ? lineLabels[index] : ""))
      .filter(Boolean);
  }

  function renderHexLines(vals) {
    return [5, 4, 3, 2, 1, 0].map((index) => {
      const value = vals[index];
      const info = yaoInfo[value];
      const parts = info?.yin ? "<i></i><i></i>" : "<i></i>";
      return `<span class="lab-hex-line ${info?.moving ? "is-moving" : ""}">${parts}</span>`;
    }).join("");
  }

  function resultReading(vals, hex, changed) {
    const moving = movingLabels(vals);
    if (!moving.length) {
      return `本卦为${hex.fullName || hex.name}，六爻皆静。先看当前局面是否稳定，再按所问之事取用神，不急着下结论。`;
    }
    const changedText = changed ? `，变卦为${changed.fullName || changed.name}` : "";
    return `本卦为${hex.fullName || hex.name}${changedText}。动爻在${moving.join("、")}，重点看这些位置代表的人、事、时间和变化方向。`;
  }

  function showResult() {
    if (!els.resultSheet || state.lines.length < 6) return;
    const vals = state.lines.map((line) => line.value);
    const hex = getHexName(vals);
    const moving = movingLabels(vals);
    const changed = moving.length ? getChangedName(vals) : null;
    const question = escapeHtml(state.question || "未填写问题");
    const listItems = [5, 4, 3, 2, 1, 0].map((index) => {
      const line = state.lines[index];
      const info = yaoInfo[line.value];
      const coinText = line.coins.map(coinLabel).join(" ");
      return `<li><strong>${lineLabels[index]}</strong><span>${line.value} ${info.name}${info.mark ? ` ${info.mark}` : ""} · ${coinText}</span></li>`;
    }).join("");
    els.resultSheet.innerHTML = `
      <div class="lab-result-head">
        <div>
          <h2>六爻卦结果</h2>
          <p>${question}</p>
        </div>
        <button class="lab-result-close" type="button" aria-label="收起结果">×</button>
      </div>
      <div class="lab-result-grid">
        <div class="lab-hexagram" aria-hidden="true">${renderHexLines(vals)}</div>
        <p class="lab-reading">${escapeHtml(resultReading(vals, hex, changed))}</p>
      </div>
      <ul class="lab-line-list">${listItems}</ul>
    `;
    els.resultSheet.hidden = false;
    if (els.resultNotice) {
      els.resultNotice.hidden = false;
      els.resultNotice.onclick = () => {
        els.resultSheet.hidden = false;
      };
    }
    els.resultSheet.querySelector(".lab-result-close")?.addEventListener("click", () => {
      els.resultSheet.hidden = true;
    });
  }

  function renderYaoPanel() {
    if (!els.yaoPanel) return;
    const count = state.lines.length;
    els.yaoPanel.classList.toggle("is-visible", count > 0 || state.phase === "tossing");
    els.yaoPanel.innerHTML = lineLabels.map((label, index) => {
      const done = index < count;
      const current = index === count && count < 6;
      const line = state.lines[index];
      const info = line ? yaoInfo[line.value] : null;
      const text = info ? `${line.value}${info.name}${info.mark || ""}` : current ? "进行中" : "待定";
      return `
        <div class="lab-yao-item ${done ? "is-done" : ""} ${current ? "is-current" : ""}">
          <span>${escapeHtml(label)}</span>
          <em>${escapeHtml(text)}</em>
          <i><b style="width:${done ? 100 : current ? 38 : 0}%"></b></i>
        </div>
      `;
    }).join("");
  }

  function renderLines() {
    if (!els.lines) return;
    els.lines.innerHTML = lineLabels.map((label, index) => {
      const line = state.lines[index];
      const current = index === state.lines.length && state.lines.length < 6;
      const info = line ? yaoInfo[line.value] : null;
      const text = info ? `${line.value}${info.name}${info.mark}` : current ? "待投" : "未成";
      return `
        <div class="lab-line-chip ${line ? "is-done" : ""} ${current ? "is-current" : ""}">
          <span>${label}</span>
          <b>${escapeHtml(text)}</b>
        </div>
      `;
    }).join("");
  }

  function render() {
    const count = state.lines.length;
    const done = count >= 6;
    if (els.progressText) els.progressText.textContent = `${count}/6`;
    if (els.progressBar) els.progressBar.style.width = `${Math.round((count / 6) * 100)}%`;
    if (els.tossButton) {
      els.tossButton.disabled = state.phase !== "idle" || done || state.auto;
      els.tossButton.textContent = done ? "已成卦" : state.phase === "tossing" ? "抛币中" : `投第 ${count + 1} 爻`;
    }
    if (els.autoButton) {
      els.autoButton.disabled = state.phase !== "idle" || done || state.auto;
      els.autoButton.textContent = state.auto ? "进行中" : "连续完成";
    }
    if (els.resetButton) els.resetButton.disabled = state.phase === "tossing";
    if (els.sessionPill) {
      els.sessionPill.textContent = done ? "查看结果" : state.phase === "tossing" ? "摇卦中" : `摇卦 ${count}/6`;
      els.sessionPill.hidden = count === 0 && state.phase === "idle" && !state.question;
    }
    if (els.modeTabs) els.modeTabs.hidden = count > 0 || state.phase === "tossing" || Boolean(state.question);
    renderLines();
    renderYaoPanel();
  }

  function makeFaceTexture(label, fill) {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    const c = 256;
    const gradient = ctx.createRadialGradient(188, 170, 16, c, c, 250);
    gradient.addColorStop(0, "#fff2a6");
    gradient.addColorStop(.44, fill);
    gradient.addColorStop(1, "#78531a");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(c, c, 246, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(48,28,5,.58)";
    ctx.lineWidth = 16;
    ctx.beginPath();
    ctx.arc(c, c, 222, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.arc(c, c, 70, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "rgba(30,18,3,.92)";
    ctx.fillRect(c - 46, c - 46, 92, 92);
    ctx.fillStyle = "rgba(46,27,6,.86)";
    ctx.font = "900 132px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, c, c - 138);
    ctx.fillText(label === "正" ? "阳" : "阴", c, c + 138);
    const texture = new THREE.CanvasTexture(canvas);
    texture.encoding = THREE.sRGBEncoding;
    texture.anisotropy = 8;
    return texture;
  }

  function makeCoinMesh(env) {
    const radius = .48;
    const halfHole = .105;
    const thickness = .085;
    const shape = new THREE.Shape();
    shape.absarc(0, 0, radius, 0, Math.PI * 2, false);
    const hole = new THREE.Path();
    hole.moveTo(-halfHole, -halfHole);
    hole.lineTo(halfHole, -halfHole);
    hole.lineTo(halfHole, halfHole);
    hole.lineTo(-halfHole, halfHole);
    hole.closePath();
    shape.holes.push(hole);

    const bodyGeometry = new THREE.ExtrudeGeometry(shape, {
      depth: thickness,
      bevelEnabled: true,
      bevelThickness: .022,
      bevelSize: .025,
      bevelSegments: 3,
      curveSegments: 72,
    });
    bodyGeometry.center();
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0xc7993c,
      metalness: .88,
      roughness: .35,
      envMap: env,
      envMapIntensity: .9,
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    body.receiveShadow = true;

    function face(label, z, flip) {
      const faceShape = new THREE.Shape();
      faceShape.absarc(0, 0, radius * .98, 0, Math.PI * 2, false);
      const faceHole = new THREE.Path();
      faceHole.moveTo(-halfHole, -halfHole);
      faceHole.lineTo(halfHole, -halfHole);
      faceHole.lineTo(halfHole, halfHole);
      faceHole.lineTo(-halfHole, halfHole);
      faceHole.closePath();
      faceShape.holes.push(faceHole);
      const geometry = new THREE.ShapeGeometry(faceShape, 72);
      const pos = geometry.attributes.position;
      const uv = new Float32Array(pos.count * 2);
      for (let i = 0; i < pos.count; i += 1) {
        uv[i * 2] = .5 + pos.getX(i) / (2 * radius);
        uv[(i * 2) + 1] = .5 + pos.getY(i) / (2 * radius);
      }
      geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
      const material = new THREE.MeshStandardMaterial({
        map: makeFaceTexture(label, label === "正" ? "#cfaa42" : "#b98d32"),
        metalness: .45,
        roughness: .5,
        envMap: env,
        envMapIntensity: .7,
        polygonOffset: true,
        polygonOffsetFactor: -4,
        polygonOffsetUnits: -4,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.z = z;
      if (flip) mesh.rotation.y = Math.PI;
      return mesh;
    }

    const group = new THREE.Group();
    group.add(body, face("正", (thickness / 2) + .025, false), face("反", -(thickness / 2) - .025, true));
    return group;
  }

  function makeScene(container) {
    if (!window.THREE || !container) return null;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, .1, 80);
    camera.position.set(0, 2.2, 5.35);
    camera.lookAt(0, 1.24, .32);

    const envCanvas = document.createElement("canvas");
    envCanvas.width = 16;
    envCanvas.height = 16;
    const envCtx = envCanvas.getContext("2d");
    const envGradient = envCtx.createLinearGradient(0, 0, 0, 16);
    envGradient.addColorStop(0, "#fff5da");
    envGradient.addColorStop(.45, "#c89943");
    envGradient.addColorStop(1, "#2d2111");
    envCtx.fillStyle = envGradient;
    envCtx.fillRect(0, 0, 16, 16);
    const envTexture = new THREE.CanvasTexture(envCanvas);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const env = pmrem.fromEquirectangular(envTexture).texture;
    scene.environment = env;
    envTexture.dispose();
    pmrem.dispose();

    scene.add(new THREE.AmbientLight(0xfff6e8, .58));
    const key = new THREE.DirectionalLight(0xfff0cf, 1.8);
    key.position.set(-3.8, 6.5, 4.8);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 18;
    key.shadow.camera.left = -5;
    key.shadow.camera.right = 5;
    key.shadow.camera.top = 5;
    key.shadow.camera.bottom = -5;
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xcce7d7, .7);
    fill.position.set(4, 2.5, 2);
    scene.add(fill);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 8),
      new THREE.MeshStandardMaterial({ color: 0xd6c19b, roughness: .86, metalness: 0, transparent: true, opacity: .42 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);

    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(1.9, 60),
      new THREE.MeshBasicMaterial({ color: 0x4d3a22, transparent: true, opacity: .12 })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.set(0, .012, .58);
    scene.add(shadow);

    const coins = [makeCoinMesh(env), makeCoinMesh(env), makeCoinMesh(env)];
    coins.forEach((coin) => {
      coin.visible = false;
      scene.add(coin);
    });

    const starts = [
      new THREE.Vector3(-.16, 1.58, .38),
      new THREE.Vector3(0, 1.62, .42),
      new THREE.Vector3(.16, 1.58, .38),
    ];
    const lands = [
      new THREE.Vector3(-.86, .12, 1.22),
      new THREE.Vector3(.02, .12, 1.45),
      new THREE.Vector3(.86, .12, 1.2),
    ];
    let active = null;

    function resize() {
      const width = container.clientWidth || 320;
      const height = container.clientHeight || 320;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    function settleRotation(heads, z) {
      return {
        x: heads ? -Math.PI / 2 : Math.PI / 2,
        y: 0,
        z,
      };
    }

    function placeCoin(coin, index, heads, progress) {
      const fly = Math.min(progress / .78, 1);
      const settle = Math.max(0, (progress - .78) / .22);
      const start = starts[index];
      const land = lands[index];
      const sway = Math.sin(fly * Math.PI * (index + 1.35)) * .18;
      const x = start.x + ((land.x - start.x) * fly) + sway;
      const z = start.z + ((land.z - start.z) * fly);
      let y = start.y + ((land.y - start.y) * fly) + (Math.sin(fly * Math.PI) * (1.38 + index * .15));
      if (settle > 0) y = land.y + Math.sin(settle * Math.PI * 2.2) * (1 - settle) * .22;
      coin.position.set(x, y, z);
      if (settle <= 0) {
        coin.rotation.set(
          progress * Math.PI * (5.8 + index),
          progress * Math.PI * (7.4 - index * .6),
          progress * Math.PI * (4.6 + index * .4)
        );
        return;
      }
      const final = settleRotation(heads, (index - 1) * .42);
      const wobble = Math.sin(settle * Math.PI * 6) * (1 - settle) * .28;
      coin.rotation.set(final.x + wobble, final.y, final.z + wobble * .4);
    }

    function loop(now) {
      window.requestAnimationFrame(loop);
      if (active) {
        const progress = Math.min(1, (now - active.start) / active.duration);
        coins.forEach((coin, index) => {
          placeCoin(coin, index, active.results[index], progress);
        });
        if (progress >= 1 && !active.done) {
          active.done = true;
          const callback = active.callback;
          active = null;
          window.setTimeout(callback, 120);
        }
      }
      renderer.render(scene, camera);
    }

    resize();
    window.addEventListener("resize", resize, { passive: true });
    window.requestAnimationFrame(loop);

    return {
      toss(results, callback) {
        coins.forEach((coin) => {
          coin.visible = true;
        });
        active = {
          results: results.map(Boolean),
          callback,
          start: performance.now(),
          duration: 2200,
          done: false,
        };
      },
      clear() {
        active = null;
        coins.forEach((coin) => {
          coin.visible = false;
        });
      },
      samplePixels() {
        try {
          const canvas = renderer.domElement;
          const ctx = canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
          return !!ctx;
        } catch (error) {
          return false;
        }
      },
    };
  }

  function bind() {
    els.question?.addEventListener("input", () => {
      state.question = normalizeText(els.question.value);
      render();
    });
    els.voiceToggle?.addEventListener("click", toggleVoice);
    els.bubbleSpeak?.addEventListener("click", () => speak(state.lastPrompt));
    els.micButton?.addEventListener("click", toggleMic);
    els.tossButton?.addEventListener("click", tossOnce);
    els.autoButton?.addEventListener("click", autoCast);
    els.resetButton?.addEventListener("click", resetAll);
    document.querySelectorAll("[data-sample-question]").forEach((button) => {
      button.addEventListener("click", () => {
        const question = normalizeText(button.dataset.sampleQuestion);
        if (!question || !els.question) return;
        state.question = question;
        els.question.value = question;
        setPrompt("问题已收到，现在可以开始抛币。", true);
        render();
      });
    });
    document.querySelectorAll("[data-mode-note], [data-feature-note]").forEach((button) => {
      button.addEventListener("click", () => {
        const note = button.dataset.modeNote || button.dataset.featureNote;
        if (note) showToast(note);
      });
    });
  }

  function init() {
    els.app = $("#labApp");
    els.beauty = $("#labBeauty");
    els.bubbleText = $("#labBubbleText");
    els.bubbleSpeak = $("#labBubbleSpeak");
    els.voiceToggle = $("#labVoiceToggle");
    els.question = $("#labQuestion");
    els.micButton = $("#labMicButton");
    els.tossButton = $("#labTossButton");
    els.autoButton = $("#labAutoButton");
    els.resetButton = $("#labResetButton");
    els.lines = $("#labLines");
    els.progressText = $("#labProgressText");
    els.progressBar = $("#labProgressBar");
    els.yaoPanel = $("#labYaoPanel");
    els.sessionPill = $("#labSessionPill");
    els.modeTabs = document.querySelector(".lab-mode-tabs");
    els.resultNotice = $("#labResultNotice");
    els.resultSheet = $("#labResultSheet");
    els.toast = $("#labToast");

    state.scene = makeScene($("#labCoinScene"));
    if ("speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = () => {};
    } else {
      state.voice = false;
      els.voiceToggle?.setAttribute("aria-pressed", "false");
      els.voiceToggle?.setAttribute("aria-label", "开启语音");
    }
    setupSpeechInput();
    bind();
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
