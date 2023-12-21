import {useEffect, useReducer} from "react"
import Header from "./Header";
import Loader from "./Loader";
import Main from "./Main";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishedScreen from "./FinishedScreen";
import Footer from "./Footer";
import Timer from "./Timer";
const initialState={
  questions:[],
  status:'loading',
  index:0,
  answer:null,
  points:0,
  highScore:0,
  secondsRemaining:10
}
function reducer(state,action){
  switch(action.type){
    case "dataReceived":
      return {...state,questions:action.payload,status:"ready"}
    case "dataFailed":
      return {...state,status:"error"}
    case "start":
      return {...state,status:"active",secondsRemaining:state.questions.length*5}
    case "newAnswer":
      const question=state.questions.at(state.index)
      return {...state,answer:action.payload,points:action.payload===question.correctOption?state.points+question.points:state.points}
    case "nextQuestion":
      return {...state,index:state.index+1,answer:null}
    case "finish":
      return {...state,status:"finished",highScore:state.points>state.highScore?state.points:state.highScore}
    case "restart":
      return {...state,points:0,highScore:0,index:0,answer:null,status:"ready",questions:state.questions,secondsRemaining:10}
    case "tick":
      return {...state,secondsRemaining:state.secondsRemaining-1,status:state.secondsRemaining===0?"finished":state.status}
    default:
      throw new Error("Action unknown")
  }
}
function App() {
  const [{questions,status,index,answer,points,highScore,secondsRemaining},dispatch]=useReducer(reducer,initialState)
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
         <Footer>
          <Timer dispatch={dispatch} secondsRemaining={secondsRemaining}/>
          <NextButton numQuestions={numQuestions} index={index}  dispatch={dispatch} answer={answer}/>
         </Footer>
         </>
         }
         {status==="finished"&&<FinishedScreen dispatch={dispatch} highScore={highScore} maxPossiblePoints={maxPossiblePoints} points={points}/>}
       </main>
      </Main>
    </div>
  );
}

export default App;
