import type { UzbekScript } from './types';

const CYR_VOWELS = new Set(['а', 'э', 'и', 'о', 'у', 'ў', 'е', 'ё', 'ю', 'я', 'А', 'Э', 'И', 'О', 'У', 'Ў', 'Е', 'Ё', 'Ю', 'Я']);

function isUpperCyr(ch: string | undefined): boolean {
  if (!ch) return false;
  return ch !== ch.toLowerCase() && ch === ch.toUpperCase();
}

function matchDigraphCase(baseLower: string, curChar: string, nextChar: string | undefined): string {
  if (!isUpperCyr(curChar)) return baseLower;
  if (nextChar && isUpperCyr(nextChar)) {
    return baseLower.toUpperCase();
  }
  return baseLower[0].toUpperCase() + baseLower.slice(1);
}

export function cyrillicToLatin(input: string): string {
  if (!input) return '';
  let out = '';
  const len = input.length;

  for (let i = 0; i < len; i++) {
    const ch = input[i];
    const prev = i > 0 ? input[i - 1] : '';
    const next = i + 1 < len ? input[i + 1] : undefined;
    const lower = ch.toLowerCase();
    const upper = isUpperCyr(ch);

    switch (lower) {
      case 'а': out += upper ? 'A' : 'a'; break;
      case 'б': out += upper ? 'B' : 'b'; break;
      case 'в': out += upper ? 'V' : 'v'; break;
      case 'г': out += upper ? 'G' : 'g'; break;
      case 'д': out += upper ? 'D' : 'd'; break;
      case 'е': {
        const isStartOrAfterVowelOrSign =
          !prev ||
          !/[\p{L}]/u.test(prev) ||
          CYR_VOWELS.has(prev) ||
          prev === 'ъ' || prev === 'Ъ' ||
          prev === 'ь' || prev === 'Ь';
        if (isStartOrAfterVowelOrSign) {
          out += matchDigraphCase('ye', ch, next);
        } else {
          out += upper ? 'E' : 'e';
        }
        break;
      }
      case 'ё': out += matchDigraphCase('yo', ch, next); break;
      case 'ж': out += upper ? 'J' : 'j'; break;
      case 'з': out += upper ? 'Z' : 'z'; break;
      case 'и': out += upper ? 'I' : 'i'; break;
      case 'й': out += upper ? 'Y' : 'y'; break;
      case 'к': out += upper ? 'K' : 'k'; break;
      case 'л': out += upper ? 'L' : 'l'; break;
      case 'м': out += upper ? 'M' : 'm'; break;
      case 'н': out += upper ? 'N' : 'n'; break;
      case 'о': out += upper ? 'O' : 'o'; break;
      case 'п': out += upper ? 'P' : 'p'; break;
      case 'р': out += upper ? 'R' : 'r'; break;
      case 'с': out += upper ? 'S' : 's'; break;
      case 'т': out += upper ? 'T' : 't'; break;
      case 'у': out += upper ? 'U' : 'u'; break;
      case 'ф': out += upper ? 'F' : 'f'; break;
      case 'х': out += upper ? 'X' : 'x'; break;
      case 'ц': {
        const afterVowel = Boolean(prev && CYR_VOWELS.has(prev));
        if (afterVowel) {
          out += matchDigraphCase('ts', ch, next);
        } else {
          out += upper ? 'S' : 's';
        }
        break;
      }
      case 'ч': out += matchDigraphCase('ch', ch, next); break;
      case 'ш': out += matchDigraphCase('sh', ch, next); break;
      case 'щ': out += matchDigraphCase('sh', ch, next); break;
      case 'ъ': {
        const nextLower = next?.toLowerCase();
        if (nextLower === 'е' || nextLower === 'ё' || nextLower === 'ю' || nextLower === 'я') {
          // glide already represents syllable boundary
        } else {
          out += 'ʼ';
        }
        break;
      }
      case 'ы': out += upper ? 'I' : 'i'; break;
      case 'ь': break;
      case 'э': out += upper ? 'E' : 'e'; break;
      case 'ю': out += matchDigraphCase('yu', ch, next); break;
      case 'я': out += matchDigraphCase('ya', ch, next); break;
      case 'ў': out += upper ? 'Oʻ' : 'oʻ'; break;
      case 'қ': out += upper ? 'Q' : 'q'; break;
      case 'ғ': out += upper ? 'Gʻ' : 'gʻ'; break;
      case 'ҳ': out += upper ? 'H' : 'h'; break;
      default:
        out += ch;
    }
  }
  return out;
}

export function latinToCyrillic(input: string): string {
  if (!input) return '';
  let s = input
    .replace(/([OoGg])['‘’`ʻʼ]/g, '$1ʻ')
    .replace(/['’`ʼ]/g, 'ʼ');

  const multiMap: [RegExp, string][] = [
    [/Oʻ/g, 'Ў'], [/oʻ/g, 'ў'],
    [/Gʻ/g, 'Ғ'], [/gʻ/g, 'ғ'],
    [/SH/g, 'Ш'], [/Sh/g, 'Ш'], [/sh/g, 'ш'],
    [/CH/g, 'Ч'], [/Ch/g, 'Ч'], [/ch/g, 'ч'],
    [/YO/g, 'Ё'], [/Yo/g, 'Ё'], [/yo/g, 'ё'],
    [/YU/g, 'Ю'], [/Yu/g, 'Ю'], [/yu/g, 'ю'],
    [/YA/g, 'Я'], [/Ya/g, 'Я'], [/ya/g, 'я'],
    [/YE/g, 'Е'], [/Ye/g, 'Е'], [/ye/g, 'е'],
    [/TS/g, 'Ц'], [/Ts/g, 'Ц'], [/ts/g, 'ц'],
  ];

  for (const [rx, rep] of multiMap) {
    s = s.replace(rx, rep);
  }

  let out = '';
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    const prev = i > 0 ? s[i - 1] : '';
    const isWordStart = !prev || !/[\p{L}ʼ]/u.test(prev);

    switch (ch) {
      case 'A': out += 'А'; break;
      case 'a': out += 'а'; break;
      case 'B': out += 'Б'; break;
      case 'b': out += 'б'; break;
      case 'D': out += 'Д'; break;
      case 'd': out += 'д'; break;
      case 'E': out += isWordStart ? 'Э' : 'Е'; break;
      case 'e': out += isWordStart ? 'э' : 'е'; break;
      case 'F': out += 'Ф'; break;
      case 'f': out += 'ф'; break;
      case 'G': out += 'Г'; break;
      case 'g': out += 'г'; break;
      case 'H': out += 'Ҳ'; break;
      case 'h': out += 'ҳ'; break;
      case 'I': out += 'И'; break;
      case 'i': out += 'и'; break;
      case 'J': out += 'Ж'; break;
      case 'j': out += 'ж'; break;
      case 'K': out += 'К'; break;
      case 'k': out += 'к'; break;
      case 'L': out += 'Л'; break;
      case 'l': out += 'л'; break;
      case 'M': out += 'М'; break;
      case 'm': out += 'м'; break;
      case 'N': out += 'Н'; break;
      case 'n': out += 'н'; break;
      case 'O': out += 'О'; break;
      case 'o': out += 'о'; break;
      case 'P': out += 'П'; break;
      case 'p': out += 'п'; break;
      case 'Q': out += 'Қ'; break;
      case 'q': out += 'қ'; break;
      case 'R': out += 'Р'; break;
      case 'r': out += 'р'; break;
      case 'S': out += 'С'; break;
      case 's': out += 'с'; break;
      case 'T': out += 'Т'; break;
      case 't': out += 'т'; break;
      case 'U': out += 'У'; break;
      case 'u': out += 'у'; break;
      case 'V': out += 'В'; break;
      case 'v': out += 'в'; break;
      case 'X': out += 'Х'; break;
      case 'x': out += 'х'; break;
      case 'Y': out += 'Й'; break;
      case 'y': out += 'й'; break;
      case 'Z': out += 'З'; break;
      case 'z': out += 'з'; break;
      case 'ʼ': out += 'ъ'; break;
      default: out += ch;
    }
  }
  return out;
}

export function pickScript(script: UzbekScript, latin: string, cyrillic?: string): string {
  if (script === 'lat') return latin;
  return cyrillic ?? latinToCyrillic(latin);
}
