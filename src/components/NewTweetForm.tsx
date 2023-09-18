import { Button } from "./Button";
import { ProfileImage} from "./ProfileImage";
import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from 'react';


function updateTextAreaSize(textArea?: HTMLTextAreaElement) {
    if (textArea == null) return
    textArea.style.height = "0"
    textArea.style.height = `${textArea.scrollHeight}px`
}

export default function NewTweetForm() { 
    const session = useSession()
    const [inputValue, setInputValue] = useState('');
    const textAreaRef = useRef<HTMLTextAreaElement>()
    
    useEffect(() => {
        updateTextAreaSize(textAreaRef.current)
    }, [inputValue])
    
    if (session.status !== "authenticated") return 
    
    return <form className='flex flex-col gap-2 border-b px-4 py-2'>
        <div className='flex gap-4 '>
            <ProfileImage src={session.data.user.image}/>
            <textarea 
            style={{height: 0}}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            className='flex-grow resize-none overflow-hidden p-4 text-lg outline-none'
            placeholder="What's happening?"/>
        </div>
        <Button className="self-end">Tweet</Button>
    </form>
}