import * as yargs from 'yargs';

const argv = yargs.option({
  search: { type: 'string', demandOption: true },
  nb: { type: 'number', default: 10 },
  types: { type: 'string', default: 'jpg,png' },
  location: { type: 'string', default: './' },
}).argv;

export function getSearchItems(): string[] {
  const items = argv.search;
  if (items.includes(',')) return argv.search.split(',');
  return [items];
}

export function getTypes(): string[] {
  return argv.types.split(',')
}

export function getNb(): number {
  return argv.nb
}

export function getLocation(): string {
  const location = argv.location;
  if (location.endsWith('/')) return location;
  return location + '/';
}