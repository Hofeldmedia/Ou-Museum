export function setPageTitle(title?: string) {
  if (!title) {
    document.title = 'Interactive Museum Demo';
  } else {
    document.title = `${title} | Interactive Museum Demo`;
  }
}
