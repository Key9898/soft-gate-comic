const catalogDate = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

export const formatCatalogDate = (isoDate: string): string => {
  const [year, month, day] = isoDate.slice(0, 10).split('-').map(Number)
  if (!year || !month || !day) return isoDate
  return catalogDate.format(new Date(year, month - 1, day)).replace(/[\u00a0\u202f]/g, ' ')
}
