import './App.css';
import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import {nanoid} from "nanoid"
import { 
          onSnapshot, 
          addDoc, 
          doc, 
          deleteDoc, 
          setDoc 
        } from 'firebase/firestore';
import { noteCollection, db } from './firebase';

export default function App() {
    // // Creating a State for Firebase
    const [notes, setNotes] = React.useState([])

    // // Creating a State for LocaleStorage
    // const [notes, setNotes] = React.useState(()=>{
    //     const saved = localStorage.getItem("notes")
    //     const initialvalue = JSON.parse(saved)
    //     return initialvalue || []
    // })

    const [tempNoteText, setTempNoteText] = React.useState("")

    const [currentNoteId, setCurrentNoteId] = React.useState("")
    // console.log(currentNoteId);

    // // //  Using CurrentNoteId of a state for LocalStorage
    // const [currentNoteId, setCurrentNoteId] = React.useState(
    //     (notes[0] && notes[0].id) || ""
    // )

    const currentNote = notes.find(note => note.id === currentNoteId ) || notes[0]
    
    const sortedNotes = notes.sort((a,b)=> b.updatedAt - a.updatedAt)

    React.useEffect(()=>{
        if(currentNote){
            setTempNoteText(currentNote.body)
        }
    },[currentNote])

    React.useEffect(()=>{
        const timeoutId = setTimeout(()=>{
            if(tempNoteText !== createNewNote.body){
                updateNote(tempNoteText)
            }
        }, 500)
        return () => clearTimeout(timeoutId)
    },[tempNoteText])

    // // UseEffect for FireBase
    React.useEffect(()=>{
        const unSubscribe = onSnapshot(noteCollection, function(snapShot) {
            const notesArr = snapShot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))

            setNotes(notesArr)
        })
        return unSubscribe
    },[])

    React.useEffect(() => {
        if(!currentNoteId){
            setCurrentNoteId(notes[0]?.id)
        }
    }, [notes])

    // //  Create a newNote For the Firebase so it connect the Note UseState.
    async function createNewNote() {
        const newNote = {
            body: "# Type your markdown note's title here",
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
        const newNoteRef = await addDoc(noteCollection, newNote)
        setCurrentNoteId(newNoteRef.id)
    }

    
    // // // CreateNewNote Using the note UseState and adding a Random ID to store the Notes, most Expecially so it can create new Note inside LocalStorage.
    // function createNewNote() {
    //     const newNote = {
    //         id: nanoid(),
    //         body: "# Type your markdown note's title here"
    //     }
    //     setNotes(prevNotes => [newNote, ...prevNotes])
    //     setCurrentNoteId(newNote.id)
    // }
    
    async function updateNote(text) {
        try {
            const docRef = doc(db, "notes", currentNoteId)

            await setDoc(
            docRef, 
            {body: text, updatedAt: Date.now()}, 
            {merge: true}
            )
        } catch (error) {
            console.log(error);
        }
    }

    // // UpdateNote Inside SetNotes State mainly for LocateStorage
    // function updateNote(text) {
    //     // // Put recently modified note at the top
    //     setNotes(oldNotes => {
    //         let newArray = []
    //         for (let i = 0; i < oldNotes.length; i++) {
    //             let oldNote = oldNotes[i]
            
    //             if (oldNote.id === currentNoteId) {
    //                 newArray.unshift({ ...oldNote, body: text })
    //             } else{
    //                 newArray.push(oldNote)
    //             }
    //         }
    //         return newArray
    //     })

    //     // // Updated Oldnote 
    //     // setNotes(oldNotes => oldNotes.map(oldNote => {
    //     //     return oldNote.id === currentNoteId
    //     //         ? { ...oldNote, body: text }
    //     //         : oldNote
    //     // }))
    // }

    // // Delete note inside FireBase and it Update deleted in Note State
    
    async function deleteNote(noteId) {
        const docRef = doc(db, "notes", noteId)
        await deleteDoc(docRef)
    }

    // // Deleting note on NotesState and it delete from the LocalStorage.
    // function deleteNote(event, noteId) {
    //     event.stopPropagation()
    //     // Your code here
    //     const newNote = notes.filter((note) => note.id !== noteId)
        
    //     setNotes(newNote)
    //     // console.log("Delete", noteId);
    // }
    
    // function findCurrentNote() {
    //     return notes.find(note => {
    //         return note.id === currentNoteId
    //     }) || notes[0]
    // }

    // // // UseEffect for LocalStorage
    // React.useEffect(()=>{
    //     localStorage.setItem('notes', JSON.stringify(notes))
    // },[notes])

    return (
        <main>
        {
            notes.length > 0 
            ?
            <Split 
                sizes={[30, 70]} 
                direction="horizontal" 
                className="split"
            >
                <Sidebar
                    notes={sortedNotes}
                    currentNote={currentNote}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                    handleDelete={deleteNote} 
                />
                {
                     currentNoteId &&
                     notes.length > 0 &&
                    <Editor 
                        tempNoteText={tempNoteText} 
                        setTempNoteText={setTempNoteText} 
                    />
                }
            </Split>
            :
            <div className="no-notes">
                <h1>You have no notes</h1>
                <button 
                    className="first-note" 
                    onClick={createNewNote}
                >
                    Create one now
                </button>
            </div>
            
        }
        </main>
    )
}
