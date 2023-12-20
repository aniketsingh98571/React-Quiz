import {useEffect, useReducer} from "react"
import Header from "./Header";
import Loader from "./Loader";
import Main from "./Main";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./components/NextButton";
import Progress from "./components/Progress";
import FinishedScreen from "./components/FinishedScreen";
const initialState={
  questions:[],
  status:'loading',
  index:0,
  answer:null,
  points:0,
  highScore:0
}
function reducer(state,action){
  switch(action.type){
    case "dataReceived":
      return {...state,questions:action.payload,status:"ready"}
    case "dataFailed":
      return {...state,status:"error"}
    case "start":
      return {...state,status:"active"}
    case "newAnswer":
      const question=state.questions.at(state.index)
      return {...state,answer:action.payload,points:action.payload===question.correctOption?state.points+question.points:state.points}
    case "nextQuestion":
      return {...state,index:state.index+1,answer:null}
    case "finish":
      return {...state,status:"finished",highScore:state.points>state.highScore?state.points:state.highScore}
    case "restart":
      return {...state,points:0,highScore:0,index:0,answer:null,status:"ready",questions:state.questions}
    default:
      throw new Error("Action unknown")
  }
}
function App() {
  const [{questions,status,index,answer,points,highScore},dispatch]=useReducer(reducer,initialState)
  const numQuestions=questions.length
  const maxPossiblePoints=questions.reduce((prev,cur)=>{
    return prev+cur.points
  },0)
  useEffect(()=>{
    fetchQuestions()
  },[])
  const fetchQuestions=async()=>{
    try{
    const data=await fetch("http://localhost:8000/questions")
    const results=await data.json()
    console.log(results)
    dispatch({type:"dataReceived",payload:results})
    }
    catch(err){
      dispatch({type:"dataFailed"})
    }
  }
  return (
    <div className="app">
     <Header/>
      <Main>
       <main className="main">
         {status==="loading"&&<Loader/>}
         {status==="error"&&<Error/>}
         {status==="ready"&&<StartScreen numQuestions={numQuestions} dispatch={dispatch}/>}
         {status==="active"&&
         <>
         <Progress numQuestions={numQuestions} index={index} points={points} maxPossiblePoints={maxPossiblePoints} />
         <Question dispatch={dispatch} question={questions[index]} answer={answer}/>
         <NextButton numQuestions={numQuestions} index={index}  dispatch={dispatch} answer={answer}/>
         </>
         }
         {status==="finished"&&<FinishedScreen dispatch={dispatch} highScore={highScore} maxPossiblePoints={maxPossiblePoints} points={points}/>}
       </main>
      </Main>
    </div>
  );
}

export default App;
