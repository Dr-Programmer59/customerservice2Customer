'use client'
import socket from '@/components/socket'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { IoSend } from "react-icons/io5";
import axios from 'axios';
import MessageBox from '@/components/MessageBox';
import { FaWhatsappSquare, FaWhatsapp } from "react-icons/fa";
import { storage } from '@/components/firebase';
import { createConversation, getConversation, getMessages, newMessages } from '@/components/service/api';
import { v4 as uuidv4 } from 'uuid';

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


function Page() {
  const [messages, setMessages] = useState([])
  const [message, setmessage] = useState("")
  const [recording, setRecording] = useState(false);
  const [loadingHide, setLoadingHide] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [phonenumber, setphonenumber] = useState("")
  const [name, setname] = useState("")
  const [progress, setProgress] = useState(0);
  const [userDetail, setuserDetail] = useState(null)  
  const audioBlob = useRef()
  const mediaRecorder = useRef();
  const [customerDetail, setcustomerDetail] = useState({})
  const [currentConversation, setcurrentConversation] = useState({})
const [recordingDelete, setrecordingDelete] = useState(false)
  const handleUploadAudio = (blob) => {
    if (blob && !recordingDelete) {
      const randomId = crypto.randomUUID();
      const file = new File([blob], `${randomId}.wav`, { type: 'audio/wav' });
      const storageRef = ref(storage, `audio/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          console.error('Upload failed:', error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            let data = {
              conversationId: currentConversation._id,
              roomId: userDetail._id,
              senderId: userDetail._id,
              text: message,
              sourceLink: downloadURL,
              type: "audio"
            }
            socket.emit("send-msg", data);
            newMessages(data);
            setMessages((prev) => [...prev, data])
          });
        }
      );
    }
  };


  useEffect(() => {
    
    if(recordingDelete){
     console.log("this is delte recording delete1",recordingDelete)
     setRecording(false);
     mediaRecorder.current=null;
    setTimeout(() => {
      setrecordingDelete(false)
    }, 2000);
   
    }
    
  }, [recordingDelete])
  
  const startRecording = async () => {
    try {
      if (!recording) {
        console.log("recoridng agin")
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder.current = new MediaRecorder(stream);

        const chunks = [];

        mediaRecorder.current.ondataavailable = (e) => {
          chunks.push(e.data);
        };

        mediaRecorder.current.onstop = () => {
          if(!recordingDelete){
          const blob = new Blob(chunks, { type: 'audio/webm' });
          audioBlob.current=blob;
          handleUploadAudio(blob)
          }
          
        };

        mediaRecorder.current.start();
        setRecording(true);
      } else {
        console.log("sending again")
        mediaRecorder.current.stop();
        setRecording(false);
      
      
      }
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const handleReceiveMessage = useCallback((data) => {
    setMessages((prev) => [...prev, data])
  }, []);

  useEffect(() => {
    socket.on("receive-msg", handleReceiveMessage);

    return () => {
      socket.off("receive-msg", handleReceiveMessage);
    }
  }, [socket,handleReceiveMessage]);

  const handleUpload = useCallback(() => {
    if (imageSrc) {
      const randomId = crypto.randomUUID();
      const storageRef = ref(storage, `images/${randomId}-${imageSrc.name}`);
      const uploadTask = uploadBytesResumable(storageRef, imageSrc);
 
      
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.error("Upload failed:", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            let data = {
              conversationId: currentConversation._id,
              senderId: userDetail._id,
              roomId: userDetail._id,
              text: message,
              sourceLink: downloadURL,
              type: "img"
            }
            socket.emit("send-msg", data);
            newMessages(data);
            setMessages((prev) => [...prev, data])
            console.log("File available at", downloadURL);
          });
        }
      );
    }
  }, [imageSrc, currentConversation, userDetail, message]);

  const handleSendMessage = async () => {
  
    if (imageSrc) {
      handleUpload();
    } else {
      let data = {
        conversationId: currentConversation._id,
        roomId: userDetail._id,
        senderId: userDetail._id,
        text: message,
        type: "text"
      }
      socket.emit("send-msg", data);
      newMessages(data);
      setMessages((prev) => [...prev, data])
    }
    setmessage("")
    setImageSrc(null)
  }


  const handleClick = (e) => {
   localStorage.setItem("phone",phonenumber);
    handleChatNow(phonenumber);
  }

  const handleChatNow = async (phonenumber) => {
    try {
      const  { data } = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/customer/signup`, { phone: phonenumber, status: "waiting" });
      setuserDetail(data.customer)
      socket.emit("new-connection", { roomId: data.customer._id, just: "check", customerNumber: phonenumber, role: "customer" })
      if (data.sucess) {
        console.log("customer Created")
        await createConversation({ roomId: data.customer._id })
        socket.emit("send-request:admin:subadmin", { customerNumber: phonenumber, customerId: data.customer._id })
        let conversationData = await getConversation({ roomId: data.customer._id })
        console.log("we have new conversation ", conversationData)
        setcurrentConversation(conversationData)
      } else {
        if (data.customer) {
          console.log("in else ",data)
          let conversationData = await getConversation({ roomId: data.customer._id })
          setcurrentConversation(conversationData)
          const messages_ = await getMessages(conversationData._id);
          console.log("message=", messages_)
          setMessages(messages_)
        }
      }
    } catch (err) {
      console.log(err)
    }
    setLoadingHide(true);
  }

  useEffect(() => {
    const phone = localStorage.getItem("phone");
    if(phone){

      handleChatNow(phone);
    }
  },[])

  const handleLogout = async () => {
    localStorage.removeItem("phone",null);
    window.location.reload()
  }

  return (
    <>
      {!loadingHide &&
        <div className='h-screen w-full bg-gradient absolute z-10 flex flex-col justify-center items-center gap-5'>
          <h2 className='text-white/80 text-3xl'>Hello I am Sundarbhai</h2>
          <img src='Images/bot.png' className='w-16 h-16 rounded-full' />
          <div className="relative mb-6">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
              <FaWhatsapp className='w-5 h-5' />
            </div>
            <input type="text" value={phonenumber} onChange={(e) => setphonenumber(e.target.value)} id="input-group-1" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter your what's app" />
          </div>
          <button className='py-2 px-4 rounded-3xl bg-white text-[#330867]' onClick={handleClick}>Chat Now !</button>
        </div>
      }

      <div className='bg-gradient p-3 rounded-t-md flex justify-between items-center shadow-md shadow-[#330867]'>
        <div className='flex gap-2 items-center'>
          <img src='Images/bot.png' className='w-16 h-16 rounded-full' />
          <div className=''>
            <h1 className='text-white text-2xl'>Sundarbhai</h1>
            <p className='text-white/80'>we are online</p>
          </div>
        </div>
        <button className='mr-7 text-white text-2xl' onClick={handleLogout}>Logout</button>
      </div>
      <div className="shadow-lg bg-white p-4">
        <MessageBox setrecordingDelete={setrecordingDelete} user={userDetail} messages={messages} setMessages={setMessages} message={message} setmessage={setmessage} handleSendMessage={handleSendMessage} audioBlob={audioBlob} startRecording={startRecording} imageSrc={imageSrc} setImageSrc={setImageSrc} />
      </div>
    </>
  )
}

export default Page;
