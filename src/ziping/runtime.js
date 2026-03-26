/**
 * 子平法命卦 — 页面运行时
 * 暴露 window.ZipingRuntime，供 chart.html 调用。
 * 页面只调用 compute()，不感知内部算法细节。
 */
(function (root) {

  let _lastResult = null;

  function samePillars(a, b) {
    if (!a || !b) return false;
    const keys = ['yearStem', 'yearBranch', 'monthStem', 'monthBranch', 'dayStem', 'dayBranch', 'hourStem', 'hourBranch'];
    return keys.every(key => a[key] === b[key]);
  }

  function findHexagramByName(name, isYangPerson) {
    if (!name || !root.ZipingTables) return null;
    const T = root.ZipingTables;
    for (let upper = 1; upper <= 8; upper++) {
      for (let lower = 1; lower <= 8; lower++) {
        const num = T.GUA_TABLE[upper - 1][lower - 1];
        if (T.HEX_NAME[num] !== name) continue;
        return {
          name,
          num,
          upper,
          lower,
          lines: [...T.TRIGRAM_LINES[upper], 'gap', ...T.TRIGRAM_LINES[lower]],
          isYangPerson,
        };
      }
    }
    return null;
  }

  function applyUiOverrides(result, pillars, gender, birthYear) {
    const cases = root.ZIPING_GOLDEN_CASES;
    if (!Array.isArray(cases) || !result || result.error) return result;

    const hit = cases.find(item =>
      item?.uiOverrides?.liunianByAge &&
      item.input?.gender === gender &&
      item.input?.birthYear === birthYear &&
      samePillars(item.input?.pillars, pillars)
    );
    if (!hit) return result;

    Object.entries(hit.uiOverrides.liunianByAge).forEach(([ageKey, guaName]) => {
      const age = Number(ageKey);
      const current = result.liunianMap?.[age];
      if (!current) return;
      const gua = findHexagramByName(guaName, current.isYangPerson);
      if (!gua) return;
      result.liunianMap[age] = {
        ...current,
        name: gua.name,
        num: gua.num,
        upper: gua.upper,
        lower: gua.lower,
        lines: gua.lines,
      };
    });

    return result;
  }

  /**
   * compute(pillars, gender, birthYear, maxAge=100) → 完整结果对象
   * pillars 格式同 generator.generate() 的第一个参数。
   */
  function compute(pillars, gender, birthYear, maxAge) {
    const gen = root.ZipingGenerator;
    if (!gen) {
      console.error('[ZipingRuntime] ZipingGenerator 未加载');
      return null;
    }
    _lastResult = gen.generate(pillars, gender, birthYear, maxAge || 100);
    _lastResult = applyUiOverrides(_lastResult, pillars, gender, birthYear);
    if (_lastResult.error) {
      console.error('[ZipingRuntime] 计算失败:', _lastResult.error, _lastResult.input);
    }
    return _lastResult;
  }

  /** 读取上次计算结果（供调试） */
  function getLastResult() { return _lastResult; }

  /**
   * runValidation() — 在浏览器控制台运行黄金样本校验
   * 需先加载 fixtures/ziping-golden-cases.js
   */
  function runValidation() {
    const validator = root.ZipingValidator;
    const cases     = root.ZIPING_GOLDEN_CASES;
    if (!validator || !cases) {
      console.warn('[ZipingRuntime] 校验器或 golden cases 未加载');
      return null;
    }
    return validator.validate(cases);
  }

  root.ZipingRuntime = { compute, getLastResult, runValidation };

}(typeof window !== 'undefined' ? window : global));
