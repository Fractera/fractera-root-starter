// Манифест страницы Root для сканера верхнего меню (290). Слово владельца 2026-09-24: «для верхнего меню между кнопкой
// core и кнопкой store добавить кнопку Root и продублировать туда содержимое страницы core». Подпись — из имени папки
// («Root»), содержимое — то же, что у Core (текст главной).
export const group = {
  slug: 'root',
  roles: "public",
  childrenAsDropdown: false,
  menus: {
    top: { enabled: true, order: 6 },
    footer: { enabled: false, order: 10 },
    left: { enabled: false, order: 10 },
    right: { enabled: false, order: 10 },
  },
}
