#!/usr/bin/env bash
set -euo pipefail

echo "== ByteDance / Toutiao Crawl Check =="
date
hostname 2>/dev/null || true

declare -a CANDIDATE_LOGS=(
  /var/log/nginx/access.log
  /var/log/nginx/access.log.1
  /var/log/nginx/access.log.2
  /var/log/nginx/access.log.3
  /var/log/nginx/access.log.4
  /var/log/nginx/access.log.5
  /www/wwwlogs/*.log
)

declare -a LOGS=()
for pattern in "${CANDIDATE_LOGS[@]}"; do
  for file in $pattern; do
    if [ -f "$file" ]; then
      LOGS+=("$file")
    fi
  done
done

if [ "${#LOGS[@]}" -eq 0 ]; then
  echo
  echo "No nginx access logs found."
  echo "Checked:"
  printf '  - %s\n' "${CANDIDATE_LOGS[@]}"
  exit 1
fi

echo
echo "== Log Files =="
printf '%s\n' "${LOGS[@]}"

TMP_MATCHES="$(mktemp)"
trap 'rm -f "$TMP_MATCHES"' EXIT

grep -iEh 'Bytespider|Toutiao|ByteDance' "${LOGS[@]}" > "$TMP_MATCHES" || true

if [ ! -s "$TMP_MATCHES" ]; then
  echo
  echo "No ByteDance crawler hits found in current logs."
  exit 0
fi

echo
echo "== Total Hits =="
wc -l < "$TMP_MATCHES"

echo
echo "== User Agent Buckets =="
awk '
  BEGIN { IGNORECASE=1 }
  /bytespider/ { counts["Bytespider"]++ }
  /toutiao/ { counts["Toutiao"]++ }
  /bytedance/ { counts["ByteDance"]++ }
  END {
    for (key in counts) printf "%s\t%d\n", key, counts[key]
  }
' "$TMP_MATCHES" | sort

echo
echo "== Top Requested URLs =="
awk '
  match($0, /"([A-Z]+) ([^ ]+) HTTP\/[0-9.]+"/, m) {
    count[m[2]]++
  }
  END {
    for (url in count) printf "%7d %s\n", count[url], url
  }
' "$TMP_MATCHES" | sort -rn | head -n 20

echo
echo "== Top Status Codes =="
awk '
  match($0, /" [0-9]{3} /) {
    code = substr($0, RSTART + 2, 3)
    count[code]++
  }
  END {
    for (code in count) printf "%s\t%d\n", code, count[code]
  }
' "$TMP_MATCHES" | sort

echo
echo "== Recent Hits =="
tail -n 20 "$TMP_MATCHES"

