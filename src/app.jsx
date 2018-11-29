import React, { useState } from 'react'
import { fromEvent } from 'rxjs'
import EventEmitter from './lib/event-emitter'

export default function App (props) {
  const [count, setCount] = useState(props.base || 1)

  const EE = new EventEmitter()
  const clickStream$ = fromEvent(EE, 'click').subscribe(() => setCount(count + 1))

  return (<div>
    <h2>counting: {count}</h2>
    <button onClick={(e) => EE.emit('click', e)}>click</button>
  </div>)
}
