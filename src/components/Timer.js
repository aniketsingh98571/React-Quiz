import { useEffect } from "react"

export default function Timer({dispatch,secondsRemaining}){
    let minutes=Math.floor(secondsRemaining/60)
    let seconds=secondsRemaining%60
    useEffect(()=>{
      const timer=  setInterval(()=>{
            // console.log("tick")
            // console.log(secondsRemaining)
            dispatch({type:"tick"})
        },1000)
        return ()=>{clearInterval(timer)}
    },
    [])
    return (
        <div className="timer">{minutes<1?"0":minutes}:{seconds}</div>
    )
}