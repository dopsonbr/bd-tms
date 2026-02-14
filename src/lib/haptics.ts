export function hapticLight() {
  if ('vibrate' in navigator) navigator.vibrate(10)
}

export function hapticMedium() {
  if ('vibrate' in navigator) navigator.vibrate(25)
}

export function hapticHeavy() {
  if ('vibrate' in navigator) navigator.vibrate([30, 10, 30])
}
