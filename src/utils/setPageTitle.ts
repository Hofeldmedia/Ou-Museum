export function setPageTitle(title?: string) {
  if (!title) {
    document.title = 'OU Interactive Museum';
  } else {
    document.title = `${title} | OU Interactive Museum`;
  }
}
