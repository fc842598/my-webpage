/* liuyao-3d.js — Real 3D brass bagua shell + ancient coins (Three.js r128) */
(function () {
  'use strict';

  /* ─── env texture for reflections ─── */
  function makeEnvTexture() {
    const c = document.createElement('canvas'); c.width = 512; c.height = 256;
    const x = c.getContext('2d');
    const g = x.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0.00, '#fff8e8'); g.addColorStop(0.28, '#e8c870');
    g.addColorStop(0.55, '#9a7230'); g.addColorStop(0.82, '#3e2a10'); g.addColorStop(1.00, '#150c04');
    x.fillStyle = g; x.fillRect(0, 0, 512, 256);
    const hi = x.createRadialGradient(128, 60, 4, 128, 60, 100);
    hi.addColorStop(0, 'rgba(255,255,255,0.88)'); hi.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = hi; x.fillRect(0, 0, 512, 256);
    const t = new THREE.CanvasTexture(c);
    t.mapping = THREE.EquirectangularReflectionMapping;
    t.encoding = THREE.sRGBEncoding;
    return t;
  }

  /* ─── trigram lines ─── */
  function trigramLines(i) {
    return [[1,1,1],[0,1,1],[1,0,1],[0,0,1],[0,0,0],[1,1,0],[0,1,0],[1,0,0]][i];
  }

  function drawTrigram(ctx, x, y, rot, len, lines, col) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    ctx.strokeStyle = col; ctx.lineWidth = len * 0.18; ctx.lineCap = 'round';
    const gap = len * 0.44, half = len * 0.5, br = len * 0.16;
    lines.forEach((solid, i) => {
      const yy = (i - 1) * gap;
      if (solid) { ctx.beginPath(); ctx.moveTo(-half, yy); ctx.lineTo(half, yy); ctx.stroke(); }
      else {
        ctx.beginPath(); ctx.moveTo(-half, yy); ctx.lineTo(-br, yy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(br, yy); ctx.lineTo(half, yy); ctx.stroke();
      }
    });
    ctx.restore();
  }

  function drawYinYang(ctx, cx, cy, r) {
    ctx.save(); ctx.translate(cx, cy);
    ctx.fillStyle = 'rgba(28,16,3,0.94)';
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#D8B83C';
    ctx.beginPath();
    ctx.arc(0, 0, r, -Math.PI/2, Math.PI/2, false);
    ctx.arc(0, r/2, r/2, Math.PI/2, -Math.PI/2, true);
    ctx.arc(0, -r/2, r/2, Math.PI/2, -Math.PI/2, false);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(28,16,3,0.94)'; ctx.beginPath(); ctx.arc(0, -r/2, r*0.18, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#D8B83C'; ctx.beginPath(); ctx.arc(0, r/2, r*0.18, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = 'rgba(30,18,3,0.65)'; ctx.lineWidth = r * 0.13;
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI*2); ctx.stroke();
    ctx.restore();
  }

  function drawBagua(ctx, S) {
    const c = S / 2;
    const g = ctx.createRadialGradient(c*0.8, c*0.72, S*0.04, c, c, c);
    g.addColorStop(0.00, '#F4E456'); g.addColorStop(0.22, '#D4A830');
    g.addColorStop(0.58, '#A87C22'); g.addColorStop(0.84, '#7C5A16'); g.addColorStop(1.00, '#4C3808');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(c, c, c, 0, Math.PI * 2); ctx.fill();
    const col = 'rgba(42,24,4,0.68)';
    ctx.lineWidth = S * 0.011; ctx.strokeStyle = col;
    // outer rings
    ctx.beginPath(); ctx.arc(c, c, c*0.93, 0, Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.arc(c, c, c*0.79, 0, Math.PI*2); ctx.stroke();
    // marginals
    for (let i=0;i<16;i++){ const a=i*Math.PI/8; ctx.beginPath(); ctx.moveTo(c+c*0.79*Math.cos(a),c+c*0.79*Math.sin(a)); ctx.lineTo(c+c*0.93*Math.cos(a),c+c*0.93*Math.sin(a)); ctx.stroke(); }
    ctx.lineWidth = S * 0.014;
    // vertebral hex
    function hex(hx, hy, hr, rot) { ctx.beginPath(); for(let i=0;i<6;i++){const a=rot+i*Math.PI/3; i?ctx.lineTo(hx+hr*Math.cos(a),hy+hr*Math.sin(a)):ctx.moveTo(hx+hr*Math.cos(a),hy+hr*Math.sin(a));} ctx.closePath(); }
    hex(c, c, c*0.30, -Math.PI/2); ctx.stroke();
    // costal lines
    ctx.lineWidth = S*0.010;
    for(let i=0;i<6;i++){ const a=-Math.PI/2+i*Math.PI/3, a2=a+Math.PI/6, ix=c+c*0.30*Math.cos(a),iy=c+c*0.30*Math.sin(a),ox=c+c*0.62*Math.cos(a2),oy=c+c*0.62*Math.sin(a2); ctx.beginPath(); ctx.moveTo(ix,iy); ctx.lineTo(ox,oy); ctx.stroke(); }
    ctx.beginPath(); ctx.arc(c, c, c*0.62, 0, Math.PI*2); ctx.stroke();
    // 8 trigrams
    const tr = c * 0.47;
    for(let i=0;i<8;i++){ const ang=-Math.PI/2+i*Math.PI/4; drawTrigram(ctx, c+tr*Math.cos(ang), c+tr*Math.sin(ang), ang+Math.PI/2, S*0.072, trigramLines(i), col); }
    drawYinYang(ctx, c, c, c*0.155);
    // highlight
    const sh = ctx.createRadialGradient(c*0.76, c*0.64, 4, c*0.76, c*0.64, c*0.52);
    sh.addColorStop(0, 'rgba(255,250,195,0.28)'); sh.addColorStop(1, 'rgba(255,250,195,0)');
    ctx.fillStyle = sh; ctx.beginPath(); ctx.arc(c, c, c, 0, Math.PI*2); ctx.fill();
  }

  function makeShellTextures() {
    const S = 1024;
    const mc = document.createElement('canvas'); mc.width = mc.height = S;
    drawBagua(mc.getContext('2d'), S);
    const map = new THREE.CanvasTexture(mc); map.encoding = THREE.sRGBEncoding; map.anisotropy = 8;
    return { map };
  }

  function makeCoinFaceTex(heads) {
    const S = 512, c = S / 2;
    const cv = document.createElement('canvas'); cv.width = cv.height = S;
    const x = cv.getContext('2d');
    const g = x.createRadialGradient(c*0.78, c*0.72, 6, c, c, c);
    g.addColorStop(0, heads ? '#F2DA5C' : '#D8B850');
    g.addColorStop(0.5, heads ? '#C8A030' : '#A88428');
    g.addColorStop(1, '#6A4E12');
    x.fillStyle = g; x.beginPath(); x.arc(c, c, c*0.985, 0, Math.PI*2); x.fill();
    x.strokeStyle = 'rgba(38,22,3,0.55)';
    x.lineWidth = S*0.028; x.beginPath(); x.arc(c, c, c*0.935, 0, Math.PI*2); x.stroke();
    x.lineWidth = S*0.022; x.beginPath(); x.arc(c, c, c*0.300, 0, Math.PI*2); x.stroke();
    x.fillStyle = 'rgba(10,5,0,0.97)';
    const hs = c * 0.195;
    x.fillRect(c - hs, c - hs, hs*2, hs*2);
    x.fillStyle = 'rgba(36,20,3,0.88)';
    x.textAlign = 'center'; x.textBaseline = 'middle';
    x.shadowColor = 'rgba(255,240,160,0.55)'; x.shadowBlur = 4; x.shadowOffsetY = -2;
    const rr = c * 0.60;
    x.font = '700 118px "Noto Serif SC", "SimSun", serif';
    if (heads) {
      x.fillText('通', c, c - rr); x.fillText('寶', c, c + rr);
      x.fillText('乾', c - rr, c); x.fillText('隆', c + rr, c);
    } else {
      x.font = '700 72px "Noto Serif SC", "SimSun", serif';
      x.fillText('寳', c - rr * 0.5, c - rr * 0.5);
      x.fillText('泉', c + rr * 0.5, c + rr * 0.5);
    }
    const hi = x.createRadialGradient(c*0.72, c*0.66, 5, c*0.72, c*0.66, c*0.45);
    hi.addColorStop(0, 'rgba(255,248,180,0.22)'); hi.addColorStop(1, 'rgba(255,248,180,0)');
    x.fillStyle = hi; x.beginPath(); x.arc(c, c, c, 0, Math.PI*2); x.fill();
    const t = new THREE.CanvasTexture(cv); t.encoding = THREE.sRGBEncoding; t.anisotropy = 8;
    return t;
  }

  /* ─── Shell geometry (dome + collar ring showing opening) ─── */
  function makeShell(env) {
    const R = 3;
    const geo = new THREE.SphereGeometry(R, 120, 72, 0, Math.PI*2, 0, Math.PI*0.52);
    const pos = geo.attributes.position, uv = geo.attributes.uv;
    for (let i=0;i<pos.count;i++){
      const px=pos.getX(i), pz=pos.getZ(i);
      uv.setXY(i, 0.5+px/(2*R), 0.5-pz/(2*R));
    }
    uv.needsUpdate = true;
    geo.scale(1.32, 0.62, 1.06);

    const { map } = makeShellTextures();
    const mat = new THREE.MeshStandardMaterial({
      map, metalness: 0.90, roughness: 0.32,
      envMap: env, envMapIntensity: 1.08,
    });
    const dome = new THREE.Mesh(geo, mat); dome.castShadow = true;

    // Base plate (closes bottom)
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x7A5018, metalness: 0.88, roughness: 0.42, envMap: env, envMapIntensity: 0.6 });
    const base = new THREE.Mesh(new THREE.CircleGeometry(R*0.99, 64), baseMat);
    base.rotation.x = Math.PI/2; base.scale.set(1.32, 1.06, 1); base.position.y = 0.02;

    // Collar ring — the "opening" rim, gold brass
    const collarMat = new THREE.MeshStandardMaterial({ color: 0xE0B828, metalness: 0.96, roughness: 0.22, envMap: env, envMapIntensity: 1.2 });
    const collar = new THREE.Mesh(new THREE.TorusGeometry(R*1.30, 0.20, 20, 100), collarMat);
    collar.rotation.x = Math.PI/2; collar.scale.set(1.32, 1.06, 1); collar.position.y = 0.04;

    // Second inner ring for depth
    const innerRingMat = new THREE.MeshStandardMaterial({ color: 0x6A4010, metalness: 0.85, roughness: 0.45, envMap: env, envMapIntensity: 0.7 });
    const innerRing = new THREE.Mesh(new THREE.TorusGeometry(R*1.18, 0.10, 12, 80), innerRingMat);
    innerRing.rotation.x = Math.PI/2; innerRing.scale.set(1.32, 1.06, 1); innerRing.position.y = 0.04;

    const grp = new THREE.Group(); grp.add(dome, base, collar, innerRing);
    return grp;
  }

  /* ─── Coin geometry (real 3D extruded with square hole) ─── */
  function makeCoin(env) {
    const R = 0.72, hs = 0.155, t = 0.12;
    const shape = new THREE.Shape(); shape.absarc(0,0,R,0,Math.PI*2,false);
    const hole = new THREE.Path();
    hole.moveTo(-hs,-hs); hole.lineTo(hs,-hs); hole.lineTo(hs,hs); hole.lineTo(-hs,hs); hole.closePath();
    shape.holes.push(hole);
    const body = new THREE.ExtrudeGeometry(shape, { depth:t, bevelEnabled:true, bevelThickness:0.035, bevelSize:0.045, bevelSegments:4, curveSegments:80 });
    body.center();
    const coinMat = new THREE.MeshStandardMaterial({ color:0xC8A840, metalness:0.90, roughness:0.38, envMap:env, envMapIntensity:0.95 });
    const bodyMesh = new THREE.Mesh(body, coinMat); bodyMesh.castShadow = true;

    // Face decals
    function makeFace(heads) {
      const fShape = new THREE.Shape(); fShape.absarc(0,0,R*0.99,0,Math.PI*2,false);
      const fHole = new THREE.Path();
      fHole.moveTo(-hs,-hs); fHole.lineTo(hs,-hs); fHole.lineTo(hs,hs); fHole.lineTo(-hs,hs); fHole.closePath();
      fShape.holes.push(fHole);
      const fg = new THREE.ShapeGeometry(fShape, 80);
      // UV: map to [0,1] based on position
      const fpos = fg.attributes.position; const fuv = new Float32Array(fpos.count*2);
      for(let i=0;i<fpos.count;i++){ fuv[i*2]=0.5+fpos.getX(i)/(2*R); fuv[i*2+1]=0.5+fpos.getY(i)/(2*R); }
      fg.setAttribute('uv', new THREE.BufferAttribute(fuv, 2));
      const fm = new THREE.MeshStandardMaterial({ map:makeCoinFaceTex(heads), metalness:0.55, roughness:0.52, envMap:env, envMapIntensity:0.75, polygonOffset:true, polygonOffsetFactor:-4, polygonOffsetUnits:-4 });
      return new THREE.Mesh(fg, fm);
    }
    const head = makeFace(true);  head.position.z =  t/2 + 0.04;
    const tail = makeFace(false); tail.rotation.y = Math.PI; tail.position.z = -(t/2+0.04);

    const grp = new THREE.Group(); grp.add(bodyMesh, head, tail);
    return grp;
  }

  /* ─── Scene ─── */
  window.TurtleScene = function (container) {
    const W = container.clientWidth  || 280;
    const H = container.clientHeight || 270;

    const renderer = new THREE.WebGLRenderer({ alpha:true, antialias:true, preserveDrawingBuffer:true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1, 2));
    renderer.setSize(W, H);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.16;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(44, W/H, 0.1, 100);
    camera.position.set(0, 3.8, 7.4);
    camera.lookAt(0, -0.3, 1.0);

    const envTex = makeEnvTexture();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const env = pmrem.fromEquirectangular(envTex).texture;
    scene.environment = env; envTex.dispose(); pmrem.dispose();

    scene.add(new THREE.AmbientLight(0xfff2e0, 0.5));
    scene.add(new THREE.HemisphereLight(0xfff4e0, 0x4a2c10, 0.65));
    const key = new THREE.DirectionalLight(0xfff0d6, 2.0);
    key.position.set(-4, 9, 6); key.castShadow = true;
    key.shadow.mapSize.set(1024,1024); key.shadow.camera.near=1; key.shadow.camera.far=28;
    key.shadow.camera.left=-7; key.shadow.camera.right=7; key.shadow.camera.top=7; key.shadow.camera.bottom=-7;
    key.shadow.bias = -0.0004; scene.add(key);
    const fill = new THREE.DirectionalLight(0xffd9a0, 0.5); fill.position.set(6,3,-2); scene.add(fill);

    const ground = new THREE.Mesh(new THREE.PlaneGeometry(40,40), new THREE.ShadowMaterial({ opacity:0.28 }));
    ground.rotation.x = -Math.PI/2; ground.receiveShadow = true; scene.add(ground);

    const shell = makeShell(env);
    shell.scale.set(0.5, 0.5, 0.5);
    shell.position.set(0, 0.12, -0.15);
    scene.add(shell);

    const coins = [makeCoin(env), makeCoin(env), makeCoin(env)];
    coins.forEach(c => { c.visible = false; c.castShadow = true; c.receiveShadow = true; scene.add(c); });

    // ── Coin spin-on-ground state ──
    const spinOmega = [0,0,0], spinAngle = [0,0,0], spinInit = [0,0,0], spinDecel = [10,10,10];
    const qFlat = [new THREE.Quaternion(), new THREE.Quaternion(), new THREE.Quaternion()];

    // land positions (fan below shell, all visible)
    const land = [
      new THREE.Vector3(-1.35, 0.10, 2.0),
      new THREE.Vector3( 0.00, 0.10, 2.5),
      new THREE.Vector3( 1.35, 0.10, 2.0),
    ];

    // pour start: near shell collar opening
    const pourStart = new THREE.Vector3(0, 0.28, 0.3);

    // flight arc angular velocities
    const flightAV = [
      new THREE.Vector3(7.0, 2.8, 5.0),
      new THREE.Vector3(-5.5, 3.2, 6.0),
      new THREE.Vector3(6.5, -2.5, -5.5),
    ];

    let phase = 'idle', t0 = 0, onDone = null;
    let coinResult = [false, false, false];
    let shakePower = 0; // 0–1, set by setShakePower()
    let settleInit = false;
    const clock = new THREE.Clock();

    function ease3(x){ return 1 - Math.pow(1-x, 3); }
    function easeIO(x){ return x<0.5 ? 4*x*x*x : 1-Math.pow(-2*x+2,3)/2; }

    function toss(res, cb) {
      coinResult = res.map(Boolean);
      onDone = cb;
      phase = 'shake'; t0 = performance.now() / 1000; settleInit = false;
      _lastPerfT = t0;
      coins.forEach((c, i) => {
        c.visible = false;
        c.position.copy(pourStart);
        c.quaternion.identity();
        // target flat orientation (heads=+Z up, tails=-Z up)
        const axis = new THREE.Vector3(1, 0, 0);
        const angle = coinResult[i] ? -Math.PI/2 : Math.PI/2;
        const flatQ = new THREE.Quaternion().setFromAxisAngle(axis, angle);
        const yawQ  = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.random()*0.6-0.3);
        qFlat[i].copy(yawQ).multiply(flatQ);
        spinOmega[i] = 12 + Math.random() * 8;
        spinAngle[i] = Math.random() * Math.PI * 2;
        spinInit[i]  = spinOmega[i];
        spinDecel[i] = 20 + Math.random() * 8;
      });
    }

    function setIdle() { phase = 'idle'; coins.forEach(c => { c.visible = false; }); }
    function setShakePower(v) { shakePower = Math.max(0, Math.min(1, v)); }

    let raf, frames = 0;
    let _lastPerfT = performance.now() / 1000;
    const _v = new THREE.Vector3();
    let dragBiasAngle = 0;
    function setDragBias(a) { dragBiasAngle = a; }

    function loop() {
      frames++;
      try {
        const nowT = performance.now() / 1000;
        const dt   = Math.min(nowT - _lastPerfT, 0.05);
        _lastPerfT = nowT;
        const t    = nowT;
        const e    = nowT - t0;

        /* ── IDLE: gentle float + shake-power-driven wobble ── */
        if (phase === 'idle') {
          const amp = 0.038 + shakePower * 0.28;
          const freq = 1.1 + shakePower * 1.8;
          shell.rotation.z = Math.sin(t * freq) * amp;
          shell.rotation.x = Math.sin(t * 0.85) * amp * 0.62 + shakePower * 0.18;
          shell.position.y = 0.12 + Math.sin(t * 1.3) * amp * 0.3 + shakePower * 0.08;
        }

        /* ── SHAKE: vigorous rattle ── */
        else if (phase === 'shake') {
          const amp = Math.sin(Math.min(e/0.45, 1) * Math.PI) * 0.55;
          shell.rotation.z = Math.sin(e * 42) * amp;
          shell.rotation.x = Math.sin(e * 34) * amp * 0.65;
          shell.position.y = 0.12 + Math.abs(Math.sin(e * 40)) * 0.14;
          if (e >= 0.45) phase = 'pour';
        }

        /* ── POUR: shell tips forward, coins emerge from collar opening ── */
        else if (phase === 'pour') {
          const pe = e - 0.45;
          // Shell tip: 0 → 68° then gently back
          let tipAngle;
          if (pe < 0.25) tipAngle = ease3(pe / 0.25) * 1.18;      // tip forward
          else if (pe < 0.62) tipAngle = 1.18 - ease3((pe-0.25)/0.37) * 0.28; // settle back a bit
          else tipAngle = 0.90;
          shell.rotation.x = tipAngle;
          shell.rotation.z = Math.sin(pe * 4) * 0.04 * Math.max(0, 1 - pe/0.8);
          shell.position.y = 0.12;

          // Coins: staggered emergence from opening
          coins.forEach((c, i) => {
            const delay = i * 0.07;
            const cu = Math.max(0, Math.min((pe - delay) / 0.55, 1));
            if (cu > 0) {
              c.visible = true;
              const eu = ease3(cu);
              c.position.x = pourStart.x + (land[i].x - pourStart.x) * eu;
              c.position.z = pourStart.z + (land[i].z - pourStart.z) * eu;
              // arc: start high near collar, arc down to ground
              const arcY = pourStart.y + (land[i].y - pourStart.y) * eu + Math.sin(Math.PI * cu) * 1.05;
              c.position.y = Math.max(land[i].y, arcY);
              // spin in flight
              if (cu < 1) {
                const dq = new THREE.Quaternion().setFromAxisAngle(
                  _v.copy(flightAV[i]).normalize(),
                  flightAV[i].length() * dt
                );
                c.quaternion.multiply(dq);
              }
            }
          });
          if (pe >= 0.72) { phase = 'spin'; settleInit = false; }
        }

        /* ── SPIN: coins spin on the ground (tops/gyros decelerating) ── */
        else if (phase === 'spin') {
          const se = e - 1.17; // time since spin started
          if (!settleInit) {
            // Lock coins to landing position, set initial spin standing upright
            coins.forEach((c, i) => {
              c.position.set(land[i].x, land[i].y + 0.5, land[i].z);
            });
            settleInit = true;
          }

          let allDone = true;
          coins.forEach((c, i) => {
            const omega = spinOmega[i];
            // The face that tilts UP is the result face — consistent from the
            // first frame so the coin never flips when it lands.
            const finalTilt = coinResult[i] ? -Math.PI/2 : Math.PI/2; // -90°=heads up, +90°=tails up
            if (omega > 0.06) {
              allDone = false;
              spinOmega[i] = Math.max(0, omega - (spinDecel[i] + (1 - omega/spinInit[i]) * 4) * dt);
              spinAngle[i] += omega * dt;
              const tiltFrac = Math.min(1, 1 - omega / spinInit[i]); // 0 (on edge) → 1 (flat)
              const tilt = finalTilt * tiltFrac;                     // 0 → finalTilt, same sign throughout
              const qY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), spinAngle[i]);
              const qX = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), tilt);
              c.quaternion.copy(qY).multiply(qX);
              // Lower from spin elevation to ground as it flattens
              c.position.y = land[i].y + 0.42 * Math.max(0, 1 - tiltFrac * 1.5);
              // tiny wobble while still upright
              const wobble = Math.max(0, 0.06 * (1 - tiltFrac));
              c.position.x = land[i].x + Math.cos(spinAngle[i]) * wobble;
              c.position.z = land[i].z + Math.sin(spinAngle[i]) * wobble;
            } else {
              // Settle: keep the SAME spin yaw, snap tilt to exact ±90° (continuous, no flip)
              spinOmega[i] = 0;
              const qY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), spinAngle[i]);
              const qX = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), finalTilt);
              c.quaternion.copy(qY).multiply(qX);
              c.position.set(land[i].x, land[i].y, land[i].z);
            }
          });
          // Also settle shell back to upright
          if (shell.rotation.x > 0.02) shell.rotation.x *= Math.max(0, 1 - dt * 4);

          if (allDone) {
            phase = 'rest';
            if (onDone) {
              const cb = onDone, r = coinResult.slice();
              onDone = null;
              setTimeout(() => cb(r), 180);
            }
          }
        }

        /* ── REST ── */
        else if (phase === 'rest') {
          shell.rotation.x *= (1 - Math.min(dt * 3, 0.99));
          shell.rotation.z = Math.sin(t * 0.9) * 0.025;
          shell.position.y = 0.12 + Math.sin(t * 1.1) * 0.02;
        }

        renderer.render(scene, camera);
      } catch(err) { if (frames < 8) console.warn('3d loop err', err && err.message); }
      raf = requestAnimationFrame(loop);
    }

    // immediate first paint (no blank flash)
    renderer.render(scene, camera);
    raf = requestAnimationFrame(loop);

    function dispose() {
      cancelAnimationFrame(raf);
      try { container.removeChild(renderer.domElement); } catch(e) {}
      renderer.dispose();
    }

    return { toss, setIdle, setShakePower, setDragBias, dispose };
  };
})();
