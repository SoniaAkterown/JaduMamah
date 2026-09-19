// Unicode text transformation for LinkedIn formatting
export function toUnicodeBold(text: string): string {
  const normalChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const boldChars = '𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵';
  
  return text
    .split('')
    .map((char) => {
      const index = normalChars.indexOf(char);
      return index !== -1 ? boldChars.substring(index * 2, index * 2 + 2) : char;
    })
    .join('');
}

export function toUnicodeItalic(text: string): string {
  const normalChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const italicChars = '𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘃𝘸𝘹𝘺𝘻';

  return text
    .split('')
    .map((char) => {
      const index = normalChars.indexOf(char);
      return index !== -1 ? italicChars.substring(index * 2, index * 2 + 2) : char;
    })
    .join('');
}

export function toUnicodeUnderline(text: string): string {
  // Combining low line U+0332
  return text
    .split('')
    .map((char) => (char === '\n' ? char : char + '\u0332'))
    .join('');
}

export function toUnicodeStrikethrough(text: string): string {
  // Combining long stroke overlay U+0336
  return text
    .split('')
    .map((char) => (char === '\n' ? char : char + '\u0336'))
    .join('');
}

export function formatAsBulletList(text: string): string {
  return text
    .split('\n')
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('•') || trimmed.startsWith('-')) return line;
      return `- ${trimmed}`;
    })
    .join('\n');
}

export function formatAsNumberedList(text: string): string {
  let counter = 1;
  return text
    .split('\n')
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      return `${counter++}. ${trimmed.replace(/^[-•\d.]+\s*/, '')}`;
    })
    .join('\n');
}
