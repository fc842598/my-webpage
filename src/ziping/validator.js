/**
 * 子平法命卦 — 黄金样本校验器
 * 用法（browser）：
 *   ZipingValidator.validate(ZIPING_GOLDEN_CASES)
 * 用法（Node）：
 *   const { validate } = require('./validator');
 *   validate(require('../../fixtures/ziping-golden-cases'));
 */
(function (root) {

  function get(obj, path) {
    return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
  }

  /** 比较期望与实际，返回差异数组 */
  function diffExpected(caseId, expected, result) {
    const diffs = [];

    function check(label, expVal, actVal) {
      if (expVal === undefined) return; // 未指定则不校验
      if (expVal !== actVal) {
        diffs.push({ caseId, label, expected: expVal, actual: actVal });
      }
    }

    // ── debug 字段 ─────────────────────────────────────────
    const exp = expected || {};
    const expD = exp.debug || {};
    const actD = result.debug || {};
    for (const key of Object.keys(expD)) {
      check(`debug.${key}`, expD[key], actD[key]);
    }

    // ── 先天卦 ─────────────────────────────────────────────
    if (exp.xiantian) {
      check('xiantian.name', exp.xiantian.name, result.xiantian?.name);
      check('xiantian.num',  exp.xiantian.num,  result.xiantian?.num);
      check('xiantian.upper', exp.xiantian.upper, result.xiantian?.upper);
      check('xiantian.lower', exp.xiantian.lower, result.xiantian?.lower);
    }

    // ── 后天卦 ─────────────────────────────────────────────
    if (exp.houtian) {
      check('houtian.name', exp.houtian.name, result.houtian?.name);
      check('houtian.num',  exp.houtian.num,  result.houtian?.num);
      check('houtian.upper', exp.houtian.upper, result.houtian?.upper);
      check('houtian.lower', exp.houtian.lower, result.houtian?.lower);
    }

    // ── 流年 spot checks ───────────────────────────────────
    const spots = exp.spotChecks || [];
    spots.forEach(s => {
      const item = result.liunianMap?.[s.age];
      check(`liunianMap[${s.age}].guaName`, s.guaName,  item?.name);
      if (s.period !== undefined) {
        check(`liunianMap[${s.age}].period`, s.period, item?.period);
      }
      if (s.lineNum !== undefined) {
        check(`liunianMap[${s.age}].lineNum`, s.lineNum, item?.lineNum);
      }
    });

    return diffs;
  }

  /**
   * 运行单个 case，返回 { id, passed, diffs, result }
   */
  function runCase(goldenCase) {
    const { id, input, expected } = goldenCase;
    const gen = root.ZipingGenerator;
    if (!gen) {
      return { id, passed: false, diffs: [{ label: 'runtime', error: 'ZipingGenerator 未加载' }] };
    }
    let result;
    try {
      result = gen.generate(input.pillars, input.gender, input.birthYear);
    } catch (e) {
      return { id, passed: false, diffs: [{ label: 'exception', error: String(e) }] };
    }
    if (result.error) {
      return { id, passed: false, diffs: [{ label: 'generate-error', error: result.error }] };
    }
    const diffs = diffExpected(id, expected, result);
    return { id, passed: diffs.length === 0, diffs, result };
  }

  /**
   * 批量校验所有 golden cases
   * 返回 { passed, failed, total, details }
   */
  function validate(cases) {
    if (!Array.isArray(cases) || cases.length === 0) {
      console.warn('[ZipingValidator] 没有 golden case 可校验');
      return { passed: 0, failed: 0, total: 0, details: [] };
    }

    const details = cases.map(runCase);
    const passed  = details.filter(d => d.passed).length;
    const failed  = details.length - passed;

    // ── 控制台输出 ─────────────────────────────────────────
    if (failed === 0) {
      console.info(`[子平法] ✓ 全部 ${passed}/${details.length} 个黄金样本通过`);
    } else {
      console.warn(`[子平法] ✗ ${failed}/${details.length} 个黄金样本失败`);
      details.forEach(d => {
        if (!d.passed) {
          console.group(`  ✗ ${d.id}`);
          d.diffs.forEach(diff => {
            if (diff.error) {
              console.error(`    ${diff.label}: ${diff.error}`);
            } else {
              console.error(
                `    ${diff.label}\n` +
                `      期望: ${JSON.stringify(diff.expected)}\n` +
                `      实际: ${JSON.stringify(diff.actual)}`
              );
            }
          });
          console.groupEnd();
        }
      });
    }

    return { passed, failed, total: details.length, details };
  }

  root.ZipingValidator = { validate, runCase };

}(typeof window !== 'undefined' ? window : global));
