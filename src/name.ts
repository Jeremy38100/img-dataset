export function getName(link: string, name: string, index: number) {
  const extension = link.slice(link.lastIndexOf('.'))
  return `${name}_${index}${extension}`;
}