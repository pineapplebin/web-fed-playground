import * as React from 'react'
// import { useState } from 'react'
// import { fromEvent } from 'rxjs'
// import EventEmitter from './lib/event-emitter'
import { useEventCallback } from './lib/use-event-callback'
import { mapTo } from "rxjs/operators";
import { Observable } from "rxjs";

export default function App (props: { base?: number }) {
  // const [count, setCount] = useState(props.base || 1)
  //
  // const EE = new EventEmitter()
  // fromEvent(EE, 'click').subscribe(() => setCount(count + 1))
  //
  // return (<div>
  //   <h2>counting: {count}</h2>
  //   <button onClick={(e) => EE.emit('click', e)}>click</button>
  // </div>)
  const [clickCallback, value] = useEventCallback(
    (eventSource$: Observable<React.SyntheticEvent<HTMLButtonElement>>) => {
      return eventSource$.pipe(
        mapTo(1000)
      )
    })
  return (
    <>
      <h2>counting: {value}</h2>
      <button onClick={clickCallback}>click me</button>
    </>
  )
}
