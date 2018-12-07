import { useState } from 'react'
import EE from './event-emitter'
import { Observable, fromEvent } from 'rxjs'

type Handler<T> = (stream: any) => T

export function useEventCallback<T> (handler: Handler<T>, defaults: T) {
  const ee = new EE()
  const steam = fromEvent(ee, 'react')
  return [
    (...args: any[]) => ee.emit('react', args),
  ]
}
