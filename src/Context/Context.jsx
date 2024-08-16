import { createContext, useState } from "react";
import run from "../Config/gemini";

export const Context = createContext();

const ContextProvider =(props) => {

    const [input,setInput] = useState("");
    const [recentPrompt,setRecentPormpt]=useState("");
    const [prevPrompts,setPrevPrompts] =useState([]);
    const [showResult,setShowResult] = useState(false);
    const [loading,SetLoading] =useState(false);
    const [resultData,SetResultData] = useState("");
    
    const delaypara = (index,nextWord)=>{
        setTimeout(function(){
            SetResultData(prev=>prev+nextWord);
        },75*index)
    }


    const onSent = async (prompt) =>{

        SetResultData("")
        SetLoading(true)
        setShowResult(true)
        setRecentPormpt(input)
        setPrevPrompts(prev=>[...prev,input])
        const response = await run(input)
        let responsesArray = response.split("**")
        let newResponse ="";
        for (let i=0; i < responsesArray.length; i++){
            if(i===0 || i%2 !==1){
                newResponse += responsesArray[i];

            }
            else{
                newResponse += "<b>"+responsesArray[i]+"</b>";
            }
        }
        let newResponse2 = newResponse.split("*").join("</br>")
        let newResponseArray = newResponse2.split(" ");
        for(let i=0;  i<newResponseArray.length; i++ )
        {
            const nextWord =newResponseArray[i];
            delaypara(i,nextWord+" ")
        }
        SetLoading(false)
        setInput("")
    }

   
    const contextValue ={
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPormpt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput


    }
    return(
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}
export default ContextProvider