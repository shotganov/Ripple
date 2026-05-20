export const formatRelativeTime = (iso: string): string => {
  const now = Date.now()
  const diff = Math.floor((now - new Date(iso).getTime()) / 1000)

  if (diff < 60) return `${diff}с`
  if (diff < 3600) return `${Math.floor(diff / 60)}м`
  if (diff < 86400) return `${Math.floor(diff / 3600)}ч`

  const date = new Date(iso)
  const currentYear = new Date().getFullYear()
  const day = date.getDate()
  const months = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
  const month = months[date.getMonth()]

  if (date.getFullYear() === currentYear) return `${day} ${month}`
  return `${day} ${month} ${date.getFullYear()}`
}
