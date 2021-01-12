import React, {useState, useEffect} from 'react'

import './inputField.css'

const InputField = props => {

    const [inputValue, setInputValue] = useState('')
    const [fullUserInput, setFullUserInput] = useState('')
    const [warning, setWarning] = useState(false)

    let phrase = props.phrase.replace(/@/ig, '')

    const typeEarly = e => {
        setWarning(true)
        setTimeout(() => {
            setWarning(false)
        }, 5000)
    }


    const onEnterKey = e => {
        if (e.key === 'Capslock' || e.key === 'Tab' || e.key === 'Shift' || e.key === 'Control'){
        } else if (e.key === 'Enter' && (fullUserInput+'~' == phrase.slice(0, fullUserInput.length+1))){
            setFullUserInput(prevState => prevState+'~')
            setInputValue('')
            props.onChange('~')
        } else if ((e.key === ' ') && (fullUserInput+e.key == phrase.slice(0, fullUserInput.length+1))){
            setFullUserInput(prevState => prevState + e.key)
            props.onChange(e.key)
            setInputValue('')
        } else if (e.key === 'Backspace' && inputValue !== ''){
            setFullUserInput(prevState => prevState.slice(0, -1))
            setInputValue(prevState => prevState.slice(0, -1))
            props.onChange('backspace')
        }else if (e.key !== 'Enter' && e.key !== 'Backspace'){
            setFullUserInput(prevState => prevState + e.key)
            setInputValue(prevState => prevState + e.key)
            props.onChange(e.key)
        }
    }

    const placebo = e => {
        e.preventDefault()
    }

    let warningScreen = warning && props.time > 0 ? <h1>Please wait for the countdown to finish</h1> : null

    let finished = phrase === fullUserInput ? <h1 className='finish-label'>You Finished!</h1> : null

    return (
        <div className='input-field'>
        {finished}
        <input onChange={placebo} onKeyDown={props.time ? typeEarly : onEnterKey} value={props.time ? '' : inputValue}/>
        {warningScreen}
        </div>
        
    )
}

export default InputField