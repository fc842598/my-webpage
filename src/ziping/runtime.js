/**
 * 子平法命卦 — 页面运行时
 * 暴露 window.ZipingRuntime，供 chart.html 调用。
 * 页面只调用 compute()，不感知内部算法细节。
 */
(function (root) {

  let _lastResult = null;

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
