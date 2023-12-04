export const StatusColorFinder = (type: string): StatusColor => {
  if (['credit', 'confirmed'].includes(type)) {
    return 'success'
  } else if (['debit'].includes(type)) {
    return 'danger'
  } else if (['pending'].includes(type)) {
    return 'warning'
  }

  return 'info'
}
