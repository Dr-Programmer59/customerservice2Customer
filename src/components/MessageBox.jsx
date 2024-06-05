'use client'
import React, { useEffect, useRef, useState } from 'react'
import { IoSend } from "react-icons/io5";
import { TbMessageCircleOff } from "react-icons/tb";
import { FaMicrophone } from "react-icons/fa";
import { CiImageOff, CiImageOn } from "react-icons/ci";
import axios from 'axios';
import { FaFileImage } from "react-icons/fa";
import Recording from "./Recording2.json"
import Lottie from "lottie-react";
import { IoMdMic } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";

// MessageBox Component
function MessageBox({ setrecordingDelete, user, messages, message, setmessage, handleSendMessage, startRecording, setMessages, socket, imageSrc, setImageSrc, role }) {
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const [isRecording, setisRecording] = useState(false)
    const [currImage, setcurrImage] = useState("")

    // Handle file input button click
    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    // Handle image file change
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        setImageSrc(file)
        reader.onload = () => {
            setcurrImage(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    // Scroll to the bottom of the messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div>
            <div class="w-full px-5 flex flex-col justify-end">
                <div id="msgbox" class="  overflow-y-auto flex flex-col mb-4">
                    {messages && messages.map((msg) => {

                    

                        return msg.senderId === user._id ?
                            (
                                <div className="flex justify-end mb-4 "  key={msg.id}>
                                    <div className="mr-2 p-2 md:py-3 md:px-4 shadow-md text-black/80 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl bg-yellow-100">
                                        {msg.type === "audio" ? (
                                            <audio src={msg.sourceLink} controls />
                                        ) : msg.type === "img" ? (
                                            <>
                                                <img
                                                    src={msg.sourceLink}
                                                    className="object-cover h-[30vh] w-[30vh]"
                                                    alt=""
                                                />
                                                <h3>{msg.text}</h3>
                                            </>
                                        ) : (
                                            msg.text
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-start mb-4" key={msg.id}>
                                    <img
                                        src="Images/bot.png"
                                        className="object-cover h-10 w-10 rounded-full"
                                        alt=""
                                    />
                                    <div className="ml-2 p-2 space-y-3 md:py-3 md:px-4 text-black/80 shadow-md rounded-br-3xl rounded-tr-3xl rounded-tl-xl">
                                        {msg.type === "audio" ? (
                                            <audio src={msg.sourceLink} controls />
                                        ) : msg.type === "img" ? (
                                            <>
                                                <img
                                                    src={msg.sourceLink}
                                                    className="object-cover h-[30vh] w-[30vh]"
                                                    alt=""
                                                />
                                                <h3>{msg.text}</h3>
                                            </>
                                        ) : (
                                            msg.text
                                        )}
                                    </div>
                                </div>
                            )
                    })}
                    {/* {typingAnimation && (
                        <div class="flex justify-start mb-4">
                            <img src="Images/bot.png" class="object-cover h-10 w-10 rounded-full" alt="" />
                            <div class="ml-2 py-3 px-4 shadow-md rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white">
                                <div class='flex space-x-2 justify-center items-center dark:invert'>
                                    <span class='sr-only'>Loading...</span>
                                    <div class='h-2 w-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                                    <div class='h-2 w-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                                    <div class='h-2 w-2 bg-blue-500 rounded-full animate-bounce'></div>
                                </div>
                            </div>
                        </div>
                    )} */}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <div class="md:p-5 flex flex-row justify-center items-center space-x-4">
                <div class="relative  mb-6 w-[100%] h-[6vh]" >
                    <div class={`absolute inset-y-0 start-0 flex items-center ps-3.5 ${isRecording ? "text-red-500" : ""}`}>
                        {
                            isRecording ?
                                <button onClick={() => { setrecordingDelete(true); setisRecording(!isRecording); console.log("delete ") }}>
                                    <RiDeleteBin6Line className='w-[30px] h-[30px]' />
                                </button>
                                :
                                <>
                                    {imageSrc && (
                                        <div className='p-6 bg-gray-200 border absolute bottom-[90px] left-[10px] border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700'>
                                            <img src={currImage} className='w-50 h-40' alt="Selected" />
                                        </div>
                                    )}
                                    <input type="file" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} />
                                    <button onClick={handleButtonClick} >
                                        <FaFileImage className='w-[30px] h-[30px]' />
                                    </button>
                                </>
                        }

                    </div>
                    <input
                        onChange={(e) => setmessage(e.target.value)}
                        value={message}
                        type="text" id="input-group-1" class="  bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-3 ps-10 pl-[50px] pr-[30px]  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Type a message " />
                    
                    {

                    message!="" || imageSrc?
                    <div class="absolute inset-y-0 end-0  flex items-center pr-4 ">
                                <button onClick={handleSendMessage}>
                                    <IoSend className='w-[35px] h-[35px]' />
                                </button>




                            </div>

                    :
                    <>
                    
                    {
                        isRecording == false ?
                            <div class="absolute inset-y-0 end-0  flex items-center pr-4 ">
                                <button onClick={() => { startRecording(); setisRecording(!isRecording); console.log("preessed") }}>
                                    <IoMdMic className='w-[35px] h-[35px]' />
                                </button>




                            </div>
                            :
                            <>
                                <div class="absolute inset-y-0 end-0 pr-4  flex items-center  ">
                                    <button onClick={() => { startRecording(); setisRecording(!isRecording); console.log("preessed") }}>
                                        <Lottie className='w-[30px] h-[40px] ' animationData={Recording} loop={true} />
                                    </button>

                                </div>
                            </>

                    }
                    </>


                }
                </div>
                {/* <div className='space-y-3 relative'>
                    {imageSrc && (
                        <div className='p-6 bg-gray-200 border absolute bottom-[90px] left-[10px] border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700'>
                            <img src={currImage} className='w-50 h-40' alt="Selected" />
                        </div>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} />
                    <button onClick={handleButtonClick} class="icon-btn bg-gradient w-20 h-15 text-white font-bold p-2 md:py-3 md:px-4 rounded-full md:rounded text-sm md:text-4xl">
                        <CiImageOn />
                    </button>
                </div>
                <input
                    class="w-full outline-none border border-gray-50 text-black/80 shadow-md py-2 md:py-4 px-3 rounded-xl"
                    type="text"
                    placeholder="type your message here..."
                    onChange={(e) => setmessage(e.target.value)}
                    value={message}
                />
                <button class=" icon-btn bg-gradient font-bold text-white p-2 md:py-3 md:px-4 rounded-full md:rounded text-sm md:text-4xl" onClick={handleSendMessage}>
                    <IoSend />
                </button>
                <button class={`icon-btn bg-gradient font-bold p-2 md:p-5  rounded-full md:rounded text-sm md:text-4xl ${isRecording ? "text-red-500" : "text-white"}`} onClick={() => { startRecording(); setisRecording(!isRecording) }}>
                    <FaMicrophone />
                </button> */}
            </div>
        </div>
    )
}

export default MessageBox
