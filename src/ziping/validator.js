/**
 * 子平法命卦 — 黄金样本校验器 v2
 * 用法（browser）：
 *   ZipingValidator.validate(ZIPING_GOLDEN_CASES)
 * 用法（Node）：
 *   const { validate } = require('./validator');
 *   validate(require('../../fixtures/ziping-golden-cases'));
 *
 * verified: true  → 来自专业工具/书中示例，失败时视为 ERROR（硬错误）
 * verified: false → 算法自推（provisional），失败时视为 WARN（软警告）
 */
(function (root) {

  /** 比较期望与实际，返回差异数组 */
  function diffExpected(caseId, expected, result) {
    const diffs = [];

    function check(label, expVal, actVal) {
      if (expVal === undefined) return;
      if (expVal !== actVal) {
        diffs.push({ caseId, label, expected: expVal, actual: actVal });
      }
    }

    // ── debug 字段 ──────────────────────────────────────────
    const exp  = expected || {};
    const expD = exp.debug || {};
    const actD = result.debug || {};
    for (const key of Object.keys(expD)) {
      check(`debug.${key}`, expD[key], actD[key]);
    }

    // ── 先天卦 ──────────────────────────────────────────────
    if (exp.xiantian) {
      check('xiantian.name',  exp.xiantian.name,  result.xiantian?.name);
      check('xiantian.num',   exp.xiantian.num,   result.xiantian?.num);
      check('xiantian.upper', exp.xiantian.upper, result.xiantian?.upper);
      check('xiantian.lower', exp.xiantian.lower, result.xiantian?.lower);
    }

    // ── 后天卦 ──────────────────────────────────────────────
    if (exp.houtian) {
      check('houtian.name',  exp.houtian.name,  result.houtian?.name);
      check('houtian.num',   exp.houtian.num,   result.houtian?.num);
      check('houtian.upper', exp.houtian.upper, result.houtian?.upper);
      check('houtian.lower', exp.houtian.lower, result.houtian?.lower);
    }

    // ── 流年 spot checks ────────────────────────────────────
    const spots = exp.spotChecks || [];
    spots.forEach(s => {
      const item = result.liunianMap?.[s.age];
      check(`liunianMap[${s.age}].guaName`,   s.guaName,   item?.name);
      if (s.period    !== undefined) check(`liunianMap[${s.age}].period`,    s.period,    item?.period);
      if (s.lineNum   !== undefined) check(`liunianMap[${s.age}].lineNum`,   s.lineNum,   item?.lineNum);
      if (s.xiaoLian  !== undefined) check(`liunianMap[${s.age}].xiaoLian`, s.xiaoLian,  item?.xiaoLian);
    });

    return diffs;
  }

  /**
   * 运行单个 case，返回 { id, verified, passed, diffs, result }
   */
  function runCase(goldenCase) {
    const { id, input, expected, verified } = goldenCase;
    const gen = root.ZipingGenerator;
    if (!gen) {
      return { id, verified: !!verified, passed: false,
               diffs: [{ label: 'runtime', error: 'ZipingGenerator 未加载' }] };
    }
    let result;
    try {
      result = gen.generate(input.pillars, input.gender, input.birthYear);
    } catch (e) {
      return { id, verified: !!verified, passed: false,
               diffs: [{ label: 'exception', error: String(e) }] };
    }
    if (result.error) {
      return { id, verified: !!verified, passed: false,
               diffs: [{ label: 'generate-error', error: result.error }] };
    }
    const diffs = diffExpected(id, expected, result);
    return { id, verified: !!verified, passed: diffs.length === 0, diffs, result };
  }

  /**
   * 批量校验所有 golden cases
   * 返回 { passedVerified, failedVerified, passedProvisional, failedProvisional, total, details }
   *
   * 整体通过准则：所有 verified=true 的 case 必须全部通过。
   * provisional 失败只产生警告，不影响整体 passed 判断。
   */
  function validate(cases) {
    if (!Array.isArray(cases) || cases.length === 0) {
      console.warn('[ZipingValidator] 没有 golden case 可校验');
      return { passedVerified: 0, failedVerified: 0,
               passedProvisional: 0, failedProvisional: 0,
               total: 0, details: [] };
    }

    const details          = cases.map(runCase);
    const verified         = details.filter(d => d.verified);
    const provisional      = details.filter(d => !d.verified);
    const passedVerified   = verified.filter(d => d.passed).length;
    const failedVerified   = verified.length - passedVerified;
    const passedProvisional = provisional.filter(d => d.passed).length;
    const failedProvisional = provisional.length - passedProvisional;

    // ── 已验证 case 输出（ERROR 级别） ───────────────────────
    if (verified.length === 0) {
      console.warn('[子平法] ⚠ 尚无 verified=true 的黄金样本，无法做外部校准');
    } else if (failedVerified === 0) {
      console.info(`[子平法] ✓ 全部 ${passedVerified}/${verified.length} 个已验证样本通过`);
    } else {
      console.error(`[子平法] ✗✗ ${failedVerified}/${verified.length} 个已验证样本失败 — 算法存在错误！`);
      details.forEach(d => {
        if (d.verified && !d.passed) {
          console.group(`  ✗ [VERIFIED ERROR] ${d.id}`);
          _printDiffs(d.diffs);
          console.groupEnd();
        }
      });
    }

    // ── provisional case 输出（WARN 级别） ───────────────────
    if (failedProvisional > 0) {
      console.warn(`[子平法] ⚠ ${failedProvisional}/${provisional.length} 个临时样本失败（provisional，仅供参考）`);
      details.forEach(d => {
        if (!d.verified && !d.passed) {
          console.group(`  ⚠ [provisional] ${d.id}`);
          _printDiffs(d.diffs);
          console.groupEnd();
        }
      });
    } else if (provisional.length > 0) {
      console.info(`[子平法] ✓ 全部 ${passedProvisional}/${provisional.length} 个临时样本自洽（需外部核对）`);
    }

    return { passedVerified, failedVerified, passedProvisional, failedProvisional,
             total: details.length, details };
  }

  function _printDiffs(diffs) {
    diffs.forEach(diff => {
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
  }

  root.ZipingValidator = { validate, runCase };

}(typeof window !== 'undefined' ? window : global));
