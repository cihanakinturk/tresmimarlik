/**
 * Özel easing ile smooth scroll
 * Hızlanıp yavaşlayarak durur (ease-in-out-cubic)
 */
export function useSmoothScroll() {
  const scrollTo = (target, duration = 800) => {
    const element = typeof target === 'string' ? document.querySelector(target) : target

    if (!element) return

    const startPosition = window.pageYOffset
    const targetPosition = element.getBoundingClientRect().top + startPosition - 80 // Header offset
    const distance = targetPosition - startPosition
    let startTime = null

    // Ease-in-out-cubic: Yavaş başla, hızlan, yavaşla
    const easeInOutCubic = (t) => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    }

    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime
      const timeElapsed = currentTime - startTime
      const progress = Math.min(timeElapsed / duration, 1)
      const ease = easeInOutCubic(progress)

      window.scrollTo(0, startPosition + distance * ease)

      if (timeElapsed < duration) {
        requestAnimationFrame(animation)
      }
    }

    requestAnimationFrame(animation)
  }

  return { scrollTo }
}
