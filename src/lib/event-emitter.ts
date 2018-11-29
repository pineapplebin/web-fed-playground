type CallbackType<T> = (arg: T) => void

export default class EventEmitter<T> {
  events: {
    [prop: string]: CallbackType<T>[]
  }

  constructor () {
    this.events = {}
  }

  addEventListener (event: string, callback: CallbackType<T>): void {
    if (!Array.isArray(this.events[event])) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  }

  removeEventListener (event: string, callback: CallbackType<T>): void {
    const events = this.events[event]
    if (!events) {
      return
    }
    const idx = events.indexOf(callback)
    if (idx > -1) {
      events.splice(idx, 1)
    }
  }

  removeAllEventListeners (event?: string) {
    if (event) {
      this.events[event] = []
    } else {
      this.events = {}
    }
  }

  emit (event: string, arg: T): boolean {
    const events = this.events[event]
    if (!Array.isArray(events) || !events.length) {
      return false
    }
    events.forEach(callback => {
      callback(arg)
    })
    return true
  }
}
