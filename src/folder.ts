import * as fs from 'fs';

export function createFolder(path = './'): boolean {
  if (path === './') return true;
  try {
    if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
    return true;
  } catch (e) {
    return false;
  }
}