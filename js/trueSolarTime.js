/**
 * True Solar Time Calculator
 * Calculates the difference between True Solar Time (真太阳时) and China Standard Time
 *
 * Formula: TST = CST + 4 * (longitude - 120) minutes + EoT
 * Where EoT = Equation of Time (均时差)
 */

/**
 * Calculate Equation of Time (均时差) in minutes for a given date
 * @param {Date} date
 * @returns {number} EoT in minutes
 */
function calcEquationOfTime(date) {
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
  const B = (360 / 365) * (dayOfYear - 81) * (Math.PI / 180);
  // Simplified Spencer formula (accurate to ~0.5 min)
  const eot = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
  return eot;
}

/**
 * Calculate True Solar Time
 * @param {object} params
 * @param {number} params.year
 * @param {number} params.month  (1-12)
 * @param {number} params.day
 * @param {number} params.hour   (0-23)
 * @param {number} params.minute (0-59, default 0)
 * @param {number} params.longitude  (degrees, east positive)
 * @param {string} params.cityName
 * @returns {object} { trueSolarHour, trueSolarMinute, cstHour, cstMinute, diffMinutes, isEstimated, displayStr, diffStr }
 */
function calcTrueSolarTime({year, month, day, hour, minute = 0, longitude, cityName}) {
  const isEstimated = !longitude;
  const lon = longitude || 116.4; // Default Beijing

  const date = new Date(year, month - 1, day, hour, minute);
  const eot = calcEquationOfTime(date);

  // Longitude correction: 4 min per degree from meridian 120°E
  const lonCorrection = 4 * (lon - 120);

  // Total offset from CST in minutes
  const totalOffsetMin = lonCorrection + eot;

  // Compute true solar time
  const cstTotalMin = hour * 60 + minute;
  let tstTotalMin = cstTotalMin + totalOffsetMin;

  // Normalize to 0-1440
  tstTotalMin = ((tstTotalMin % 1440) + 1440) % 1440;

  const tstHour = Math.floor(tstTotalMin / 60);
  const tstMin  = Math.round(tstTotalMin % 60);

  // Format diff
  const absOff = Math.abs(Math.round(totalOffsetMin));
  const sign = totalOffsetMin >= 0 ? '+' : '-';
  const diffStr = `${sign}${Math.floor(absOff/60) > 0 ? Math.floor(absOff/60) + '小时' : ''}${absOff % 60}分钟`;

  const pad = n => String(n).padStart(2, '0');
  const cstStr  = `${year}-${pad(month)}-${pad(day)} ${pad(hour)}:${pad(minute || 0)}`;
  const tstStr  = `${year}-${pad(month)}-${pad(day)} ${pad(tstHour)}:${pad(tstMin)}`;

  return {
    trueSolarHour: tstHour,
    trueSolarMinute: tstMin,
    cstHour: hour,
    cstMinute: minute || 0,
    diffMinutes: Math.round(totalOffsetMin),
    isEstimated,
    cstStr,
    tstStr,
    diffStr,
    cityName: cityName || '北京（默认）',
    eot: Math.round(eot * 10) / 10,
    lonCorrection: Math.round(lonCorrection * 10) / 10,
  };
}

/**
 * Map true solar time hour to traditional Chinese hour (时辰) index (0-11)
 * 子时=0(23-1), 丑时=1(1-3), ..., 亥时=11(21-23)
 */
function tstToShichen(tstHour, tstMinute) {
  const totalMin = tstHour * 60 + tstMinute;
  // 子时 starts at 23:00 = 1380 min, or 0:00 (next day start)
  // Normalize: add 60 so 23:00 = index 0
  const shifted = (totalMin + 60) % 1440;
  return Math.floor(shifted / 120); // 120 min per shichen
}
