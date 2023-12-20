import Options from "./components/Options"
export default function Question({question,dispatch,answer}){
    return (
       <> 
       <h4>{question.question}</h4>
       <div className="options">
          <Options question={question} dispatch={dispatch} answer={answer}/>
       </div>
       </>
    )
}