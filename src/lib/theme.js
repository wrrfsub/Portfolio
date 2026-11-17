export function applyTheme(id) {
  document.documentElement.dataset.theme = id
  document.documentElement.classList.toggle('dark', id !== 'light')
  try { localStorage.setItem('theme', id) } catch {}
}
