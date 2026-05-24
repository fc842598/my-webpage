/**
 * True Solar Time Calculator
 * Calculates the difference between true solar time (真太阳时) and local civil time.
 *
 * Formula:
 * TST = local civil time + Equation of Time + 4 * longitude - 60 * UTC offset
 *
 * The UTC offset should be the legal offset used at the birthplace on the birth date.
 * When an IANA time zone is available, Intl/tzdb is used; tzOffset is only a fallback.
 */

const BIRTH_TIME_CHINA_REGIONS = new Set([
  '北京', '上海', '天津', '重庆',
  '河北', '山西', '辽宁', '吉林', '黑龙江', '江苏', '浙江', '安徽', '福建', '江西', '山东',
  '河南', '湖北', '湖南', '广东', '海南', '四川', '贵州', '云南', '陕西', '甘肃', '青海',
  '内蒙古', '广西', '西藏', '宁夏', '新疆', '香港', '澳门', '台湾',
]);

const BIRTH_TIMEZONE_BY_REGION = {
  香港: 'Asia/Hong_Kong',
  澳门: 'Asia/Macau',
  台湾: 'Asia/Taipei',
  日本: 'Asia/Tokyo',
  韩国: 'Asia/Seoul',
  朝鲜: 'Asia/Pyongyang',
  蒙古: 'Asia/Ulaanbaatar',
  印度: 'Asia/Kolkata',
  新加坡: 'Asia/Singapore',
  马来西亚: 'Asia/Kuala_Lumpur',
  泰国: 'Asia/Bangkok',
  越南: 'Asia/Ho_Chi_Minh',
  菲律宾: 'Asia/Manila',
  缅甸: 'Asia/Yangon',
  柬埔寨: 'Asia/Phnom_Penh',
  老挝: 'Asia/Vientiane',
  尼泊尔: 'Asia/Kathmandu',
  斯里兰卡: 'Asia/Colombo',
  孟加拉: 'Asia/Dhaka',
  巴基斯坦: 'Asia/Karachi',
  哈萨克斯坦: 'Asia/Almaty',
  乌兹别克斯坦: 'Asia/Tashkent',
  吉尔吉斯斯坦: 'Asia/Bishkek',
  阿联酋: 'Asia/Dubai',
  沙特阿拉伯: 'Asia/Riyadh',
  伊朗: 'Asia/Tehran',
  土耳其: 'Europe/Istanbul',
  以色列: 'Asia/Jerusalem',
  约旦: 'Asia/Amman',
  卡塔尔: 'Asia/Qatar',
  科威特: 'Asia/Kuwait',
  伊拉克: 'Asia/Baghdad',
  叙利亚: 'Asia/Damascus',
  黎巴嫩: 'Asia/Beirut',
  巴林: 'Asia/Bahrain',
  阿曼: 'Asia/Muscat',
  也门: 'Asia/Aden',
  阿富汗: 'Asia/Kabul',
  英国: 'Europe/London',
  法国: 'Europe/Paris',
  德国: 'Europe/Berlin',
  意大利: 'Europe/Rome',
  西班牙: 'Europe/Madrid',
  葡萄牙: 'Europe/Lisbon',
  荷兰: 'Europe/Amsterdam',
  比利时: 'Europe/Brussels',
  瑞士: 'Europe/Zurich',
  奥地利: 'Europe/Vienna',
  波兰: 'Europe/Warsaw',
  捷克: 'Europe/Prague',
  匈牙利: 'Europe/Budapest',
  罗马尼亚: 'Europe/Bucharest',
  希腊: 'Europe/Athens',
  乌克兰: 'Europe/Kyiv',
  瑞典: 'Europe/Stockholm',
  挪威: 'Europe/Oslo',
  丹麦: 'Europe/Copenhagen',
  芬兰: 'Europe/Helsinki',
  爱尔兰: 'Europe/Dublin',
  冰岛: 'Atlantic/Reykjavik',
  埃及: 'Africa/Cairo',
  南非: 'Africa/Johannesburg',
  尼日利亚: 'Africa/Lagos',
  肯尼亚: 'Africa/Nairobi',
  埃塞俄比亚: 'Africa/Addis_Ababa',
  摩洛哥: 'Africa/Casablanca',
  阿尔及利亚: 'Africa/Algiers',
  坦桑尼亚: 'Africa/Dar_es_Salaam',
  加纳: 'Africa/Accra',
  塞内加尔: 'Africa/Dakar',
  津巴布韦: 'Africa/Harare',
  喀麦隆: 'Africa/Douala',
  安哥拉: 'Africa/Luanda',
  智利: 'America/Santiago',
  哥伦比亚: 'America/Bogota',
  秘鲁: 'America/Lima',
  委内瑞拉: 'America/Caracas',
  古巴: 'America/Havana',
  新西兰: 'Pacific/Auckland',
  斐济: 'Pacific/Fiji',
};

const BIRTH_TIMEZONE_CITY_RULES = [
  [/冲绳|Naha/i, 'Asia/Tokyo'],
  [/巴厘|Bali/i, 'Asia/Makassar'],
  [/雅加达|泗水|棉兰|Jakarta|Surabaya|Medan/i, 'Asia/Jakarta'],
  [/阿斯塔纳|Astana/i, 'Asia/Almaty'],
  [/莫斯科|圣彼得堡|Moscow|Petersburg/i, 'Europe/Moscow'],
  [/新西伯利亚|Novosibirsk/i, 'Asia/Novosibirsk'],
  [/叶卡捷琳堡|Yekaterinburg/i, 'Asia/Yekaterinburg'],
  [/海参崴|哈巴罗夫斯克|Vladivostok|Khabarovsk/i, 'Asia/Vladivostok'],
  [/伊尔库茨克|Irkutsk/i, 'Asia/Irkutsk'],
  [/纽约|波士顿|华盛顿|亚特兰大|迈阿密|费城|New York|Boston|Washington|Atlanta|Miami|Philadelphia/i, 'America/New_York'],
  [/芝加哥|休斯顿|达拉斯|明尼阿波利斯|Chicago|Houston|Dallas|Minneapolis/i, 'America/Chicago'],
  [/丹佛|Denver/i, 'America/Denver'],
  [/凤凰城|Phoenix/i, 'America/Phoenix'],
  [/洛杉矶|旧金山|西雅图|拉斯维加斯|Los Angeles|San Francisco|Seattle|Las Vegas/i, 'America/Los_Angeles'],
  [/火奴鲁鲁|Honolulu/i, 'Pacific/Honolulu'],
  [/安克雷奇|Anchorage/i, 'America/Anchorage'],
  [/多伦多|蒙特利尔|渥太华|Toronto|Montreal|Ottawa/i, 'America/Toronto'],
  [/温哥华|Vancouver/i, 'America/Vancouver'],
  [/卡尔加里|埃德蒙顿|Calgary|Edmonton/i, 'America/Edmonton'],
  [/墨西哥城|瓜达拉哈拉|Mexico City|Guadalajara/i, 'America/Mexico_City'],
  [/蒙特雷|Monterrey/i, 'America/Monterrey'],
  [/圣保罗|里约热内卢|巴西利亚|São Paulo|Sao Paulo|Rio de Janeiro|Brasilia/i, 'America/Sao_Paulo'],
  [/萨尔瓦多|Salvador/i, 'America/Bahia'],
  [/贝伦|Belem/i, 'America/Belem'],
  [/布宜诺斯艾利斯|Buenos Aires/i, 'America/Argentina/Buenos_Aires'],
  [/科尔多瓦|Cordoba/i, 'America/Argentina/Cordoba'],
  [/悉尼|堪培拉|Sydney|Canberra/i, 'Australia/Sydney'],
  [/墨尔本|Melbourne/i, 'Australia/Melbourne'],
  [/布里斯班|Brisbane/i, 'Australia/Brisbane'],
  [/珀斯|Perth/i, 'Australia/Perth'],
  [/阿德莱德|Adelaide/i, 'Australia/Adelaide'],
];

function birthPlaceRegion(place) {
  if (Array.isArray(place)) return String(place[0] || '').trim();
  return String(place?.province || place?.region || place?.country || '').trim();
}

function birthPlaceCity(place) {
  if (Array.isArray(place)) return String(place[1] || '').trim();
  return String(place?.city || place?.name || '').trim();
}

function isChinaBirthPlace(place) {
  return BIRTH_TIME_CHINA_REGIONS.has(birthPlaceRegion(place));
}

function getBirthTimeZoneId(place) {
  if (place?.timeZone || place?.tzid) return place.timeZone || place.tzid;
  const region = birthPlaceRegion(place);
  const city = birthPlaceCity(place);
  if (!region && !city) return '';
  if (isChinaBirthPlace(place)) return BIRTH_TIMEZONE_BY_REGION[region] || 'Asia/Shanghai';
  const text = `${region} ${city}`;
  const cityRule = BIRTH_TIMEZONE_CITY_RULES.find(([pattern]) => pattern.test(text));
  return cityRule ? cityRule[1] : (BIRTH_TIMEZONE_BY_REGION[region] || '');
}

function isSupportedTimeZone(timeZone) {
  if (!timeZone) return false;
  try {
    new Intl.DateTimeFormat('en-US', { timeZone }).format(new Date());
    return true;
  } catch (_) {
    return false;
  }
}

function tzOffsetToMinutes(tzOffset) {
  const value = Number(tzOffset);
  return Number.isFinite(value) ? Math.round(value * 60) : 480;
}

function parseOffsetName(offsetName) {
  const text = String(offsetName || '').replace('UTC', 'GMT');
  if (text === 'GMT' || text === 'GMT+0' || text === 'GMT-0') return 0;
  const match = text.match(/GMT([+-])(\d{1,2})(?::?(\d{2}))?/i);
  if (!match) return null;
  const sign = match[1] === '-' ? -1 : 1;
  const hours = Number(match[2]) || 0;
  const minutes = Number(match[3]) || 0;
  return sign * (hours * 60 + minutes);
}

function getTimeZoneOffsetMinutes(timeZone, date) {
  if (!isSupportedTimeZone(timeZone)) return null;
  const options = {
    timeZone,
    timeZoneName: 'shortOffset',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };
  let parts;
  try {
    parts = new Intl.DateTimeFormat('en-US', options).formatToParts(date);
  } catch (_) {
    parts = new Intl.DateTimeFormat('en-US', { ...options, timeZoneName: 'longOffset' }).formatToParts(date);
  }
  const value = parts.find((part) => part.type === 'timeZoneName')?.value;
  return parseOffsetName(value);
}

function resolveBirthTimeZoneOffset({ year, month, day, hour = 0, minute = 0, timeZone, tzOffset }) {
  const fallbackMinutes = tzOffsetToMinutes(tzOffset);
  if (!isSupportedTimeZone(timeZone)) {
    return {
      offsetMinutes: fallbackMinutes,
      offsetHours: fallbackMinutes / 60,
      timeZone: '',
      source: 'fixed',
    };
  }

  const wallUtcMs = Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour) || 0, Number(minute) || 0, 0);
  let offsetMinutes = fallbackMinutes;
  let utcMs = wallUtcMs - offsetMinutes * 60000;

  for (let i = 0; i < 4; i += 1) {
    const nextOffset = getTimeZoneOffsetMinutes(timeZone, new Date(utcMs));
    if (!Number.isFinite(nextOffset)) break;
    if (nextOffset === offsetMinutes) break;
    offsetMinutes = nextOffset;
    utcMs = wallUtcMs - offsetMinutes * 60000;
  }

  return {
    offsetMinutes,
    offsetHours: offsetMinutes / 60,
    timeZone,
    source: 'iana',
    utcDate: new Date(utcMs),
  };
}

/**
 * Calculate Equation of Time (均时差) in minutes for a given date.
 * @param {Date} date
 * @returns {number}
 */
function calcEquationOfTime(date) {
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
  const B = (360 / 365) * (dayOfYear - 81) * (Math.PI / 180);
  return 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
}

/**
 * Calculate True Solar Time.
 * @param {object} params
 * @param {number} params.year
 * @param {number} params.month
 * @param {number} params.day
 * @param {number} params.hour
 * @param {number} params.minute
 * @param {number} params.longitude
 * @param {number} params.tzOffset Fixed UTC offset fallback, e.g. 8, -5, 5.5.
 * @param {string} params.timeZone IANA time zone, e.g. Asia/Ho_Chi_Minh.
 * @param {string} params.cityName
 */
function calcTrueSolarTime({ year, month, day, hour, minute = 0, longitude, tzOffset, timeZone, cityName }) {
  const hasLongitude = Number.isFinite(Number(longitude));
  const isEstimated = !hasLongitude;
  const lon = hasLongitude ? Number(longitude) : 116.4;
  const tzInfo = resolveBirthTimeZoneOffset({ year, month, day, hour, minute, timeZone, tzOffset });
  const tz = tzInfo.offsetHours;

  const date = new Date(Number(year), Number(month) - 1, Number(day), Number(hour) || 0, Number(minute) || 0);
  const eot = calcEquationOfTime(date);
  const lonCorrection = 4 * (lon - tz * 15);
  const totalOffsetMin = lonCorrection + eot;
  const localTotalMin = (Number(hour) || 0) * 60 + (Number(minute) || 0);
  const rawTstTotalMin = Math.round(localTotalMin + totalOffsetMin);
  const dayShift = rawTstTotalMin < 0 ? -1 : (rawTstTotalMin >= 1440 ? 1 : 0);
  const tstTotalMin = ((rawTstTotalMin % 1440) + 1440) % 1440;
  const tstHour = Math.floor(tstTotalMin / 60);
  const tstMin = tstTotalMin % 60;
  const absOff = Math.abs(Math.round(totalOffsetMin));
  const sign = totalOffsetMin >= 0 ? '+' : '-';
  const diffStr = `${sign}${Math.floor(absOff / 60) > 0 ? `${Math.floor(absOff / 60)}小时` : ''}${absOff % 60}分钟`;

  const pad = n => String(n).padStart(2, '0');
  const localStr = `${year}-${pad(month)}-${pad(day)} ${pad(hour)}:${pad(minute || 0)}`;
  const tstDate = new Date(date.getTime());
  tstDate.setDate(tstDate.getDate() + dayShift);
  const trueSolarDate = `${tstDate.getFullYear()}-${pad(tstDate.getMonth() + 1)}-${pad(tstDate.getDate())}`;
  const tstStr = `${trueSolarDate} ${pad(tstHour)}:${pad(tstMin)}`;

  return {
    trueSolarHour: tstHour,
    trueSolarMinute: tstMin,
    localHour: hour,
    localMinute: minute || 0,
    cstHour: hour,
    cstMinute: minute || 0,
    diffMinutes: Math.round(totalOffsetMin),
    isEstimated,
    cstStr: localStr,
    localStr,
    tstStr,
    trueSolarDate,
    dayShift,
    diffStr,
    cityName: cityName || '北京（默认）',
    tzOffset: tz,
    tzOffsetMinutes: tzInfo.offsetMinutes,
    timeZone: tzInfo.timeZone || '',
    timezoneSource: tzInfo.source,
    eot: Math.round(eot * 10) / 10,
    lonCorrection: Math.round(lonCorrection * 10) / 10,
  };
}

/**
 * Map true solar time hour to traditional Chinese hour (时辰) index (0-11).
 * 子时=0(23-1), 丑时=1(1-3), ..., 亥时=11(21-23)
 */
function tstToShichen(tstHour, tstMinute) {
  const totalMin = tstHour * 60 + tstMinute;
  const shifted = (totalMin + 60) % 1440;
  return Math.floor(shifted / 120);
}
