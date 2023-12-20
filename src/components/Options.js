export default function Options({question,dispatch,answer}){
    const hasAnswered=answer!==null
    return (
        <>
        {
            question.options.map((option,index)=>{
               return <button disabled={hasAnswered} onClick={()=>dispatch({type:"newAnswer",payload:index})}   className={`btn btn-option ${index === answer ? "answer" : ""} ${
                hasAnswered
                  ? index === question.correctOption
                    ? "correct"
                    : "wrong"
                  : ""
              }`} key={option}>{option}</button>
            })
        }
        </>
    )
}