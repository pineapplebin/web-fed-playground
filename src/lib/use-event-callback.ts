/**
 * 参考 https://github.com/LeetCode-OpenSource/rxjs-hooks/blob/master/src/use-event-callback.ts
 */
import { useState, useMemo, useEffect } from 'react'
import { Observable, BehaviorSubject, Subject, noop } from 'rxjs'

type RestrictArray<T> = T extends any[] ? T : []

type VoidAsNull<T> = T extends void ? null : T

export type EventCallbackState<EventValue, State, Inputs = void> = [
  (val: EventValue) => void,
  [State extends void ? null : State, BehaviorSubject<State | null>, BehaviorSubject<RestrictArray<Inputs> | null>]]

export type ReturnedState<EventValue, State, Inputs> = [
  EventCallbackState<EventValue, State, Inputs>[0],
  EventCallbackState<EventValue, State, Inputs>[1][0]]

export type EventCallback<EventValue, State, Inputs> = Inputs extends void
  ? (eventSource$: Observable<EventValue>, state$: Observable<State>) => Observable<State>
  : (
    eventSource$: Observable<EventValue>,
    inputs$: Observable<RestrictArray<Inputs>>,
    state$: Observable<State>
  ) => Observable<State>

export function useEventCallback<EventValue, State = void> (
  callback: EventCallback<EventValue, State, void>
): ReturnedState<EventValue, State | null, void>
export function useEventCallback<EventValue, State = void> (
  callback: EventCallback<EventValue, State, void>,
  initialState: State
): ReturnedState<EventValue, State, void>
export function useEventCallback<EventValue, State = void, Inputs = void> (
  callback: EventCallback<EventValue, State, Inputs>,
  initialState: State,
  inputs: RestrictArray<Inputs>
): ReturnedState<EventValue, State, Inputs>
export function useEventCallback<EventValue, State = void, Inputs = void> (
  callback: EventCallback<EventValue, State, Inputs>,
  initialState?: State,
  inputs?: RestrictArray<Inputs>
): ReturnedState<EventValue, State | null, Inputs> {
  const initialValue = (typeof initialState !== 'undefined' ? initialState : null) as VoidAsNull<State>
  const inputSubject$ = new BehaviorSubject<RestrictArray<Inputs> | null>(typeof inputs === 'undefined' ? null : inputs)
  const stateSubject$ = new BehaviorSubject<State | null>(initialValue)
  const [state, setState] = useState(initialValue)
  const [returnedCallback, setEventCallback] = useState<(val: EventValue) => void>(() => noop)
  const [state$] = useState(stateSubject$)
  const [inputs$] = useState(inputSubject$)

  useMemo(() => {
    inputs$.next(inputs!)
  }, ((inputs as unknown) as ReadonlyArray<any>) || [])

  useEffect(
    () => {
      const event$ = new Subject<EventValue>()

      function eventCallback (e: EventValue) {
        return event$.next(e)
      }

      setState(initialValue)
      setEventCallback(() => eventCallback)
      let value$: Observable<State>

      if (!inputs) {
        value$ = (callback as EventCallback<EventValue, State, void>)(event$, state$ as Observable<State>)
      } else {
        value$ = (callback as any)(event$, inputs$ as Observable<Inputs>, state$ as Observable<State>)
      }
      const subscription = value$.subscribe((value) => {
        state$.next(value)
        setState(value as VoidAsNull<State>)
      })
      return () => {
        subscription.unsubscribe()
        state$.complete()
        inputs$.complete()
        event$.complete()
      }
    },
    []
  )

  return [returnedCallback, state]
}
