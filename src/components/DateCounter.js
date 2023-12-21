import { useReducer} from "react";
function reducer(currentState,action){
    console.log(currentState,action)
    switch(action.type){
        case 'desc':
            return {...currentState,count:currentState.count-1,step:currentState.step+1}
        case 'inc':
            return  {...currentState,count:currentState.count+1,step:currentState.step+1}
        case 'change':
            return  {...currentState,count:action.payload}
        case 'stepChange':
            return {...currentState,step:action.payload}
        case 'reset':
            return {step:0,count:0}
    }
}
function DateCounter() {
  const initialState={count:0,step:0}
  const [count,dispatch]=useReducer(reducer,initialState)
  const date = new Date("june 21 2027");
  date.setDate(date.getDate() + count);

  const dec = function () {
    dispatch({type:'desc'})
  };

  const inc = function () {
    dispatch({type:'inc'})
  };

  const defineCount = function (e) {
    dispatch({type:'stepChange',payload:Number(e.target.value)})
  };

  const defineStep = function (e) {
    dispatch({type:'stepChange',payload:Number(e.target.value)})
  };

  const reset = function () {
   dispatch({type:"reset"})
  };

  return (
    <div className="counter">
      <div>
        <input
          type="range"
          min="0"
          max="10"
          value={count.step}
          onChange={defineStep}
        />
        <span>{count.step}</span>
      </div>

      <div>
        <button onClick={dec}>-</button>
        <input value={count.count} onChange={defineCount} />
        <button onClick={inc}>+</button>
      </div>

      <p>{date.toDateString()}</p>

      <div>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
export default DateCounter;
