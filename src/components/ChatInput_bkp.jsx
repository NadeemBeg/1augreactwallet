import React, { useState, useRef, useEffect } from "react";
import { BsFillCloudDownloadFill, BsNodePlusFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import styled from "styled-components";
import Picker from "emoji-picker-react";
import { Button } from "react-bootstrap";
import Web3 from "web3";
import { recieveMessageRoute, savefile } from "../utils/APIRoutes";
import axios from "axios";
import Modal from "react-modal";
import AnimeList from "./Welcome";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebase/firebase";
import { Web3Storage } from "web3.storage";
import { v4 as uuidv4 } from "uuid";
import "./ChatInput.css";
import { NFTStorage } from "nft.storage";
import CryptoJS from "crypto-js";
import LoadingGIF from "../assets/download-gif.gif";
import FileType from "file-type";
import FileSaver from "file-saver";
import emoji from "../assets/emoji.svg";
import file_browser from "../assets/file_upload_browser.svg";
import file_ftp from "../assets/file_upload_ftp.svg";
import send_receive from "../assets/send_receive.svg";
import pin from "../assets/pin.svg";
import edit from "../assets/edit.svg";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import "./css/main.css";

const client1 = new NFTStorage({
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDYyZUI4N0YyOGI0MGM2YmEwMEE4ZkZCMDJhMUZCZGQ5OTU0RjIyNTciLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3MjM4MDkwNDgzMiwibmFtZSI6IndhbGxldCJ9.m9s6Em7l8ZlhjSIzEUHo9fK2yuiYUQplXhzSMHoum8Y",
});

export default function ChatInput({
  currentChat,
  handleSendMsg,
  socket,
  newchange,
  removeFileUploadId,
  removeFileFirebaseUploadId,
}) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [compressedFile, setCompressedFile] = useState(null);
  const [totalFileSize, setTotalFileSize] = useState(0);
  const [transferredFileSize, setTransferredFileSize] = useState(0);
  const [timerForFile, setTimerForFile] = useState(0);
  const [isLoadingForIpfs, setIsLoadingForIpfs] = useState(false);
  const [allIpfsFile, setAllIpfsFile] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [allsendIPFSLink, setAllsendIPFSLink] = useState([]);
  const [allreceiveIPFSLink, setAllreceiveIPFSLink] = useState([]);
  const scrollRef = useRef();
  const [arrayBuffer, setArrayBuffer] = useState();
  const [isShowLoader, showDownloadLoader] = useState();
  const [isShowLoaderR, showDownloadLoaderR] = useState();
  const [progessV, setProgessV] = useState();
  const [tempUserFileSend, setTempUserFileSend] = useState([]);
  const [tempUserFileSendFirebase, setTempUserFileSendFirebase] = useState([]);
  const [fileSizeAndUpload, setFileSizeAndUpload] = useState(false);
  const [directFileIpfs, setDirectFileIpfs] = useState(false);
  const [fileHoleData, setFileHoleData] = useState();
  const [temp_perma, settemp_perma] = useState(false);
  const [topping, setTopping] = useState();
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [url, setURL] = useState();
  const [mintModel, setMintModel] = useState(false);


  const [fileObjTemp, setfileObjTemp] = useState();

  const emojiRef = useRef();

  useEffect(() => {
    let temp = [...tempUserFileSend];
    temp.filter((item) => item == currentChat._id);
    setTempUserFileSend(temp);

    let temp2 = [...tempUserFileSendFirebase];
    temp2.filter((items) => items == currentChat._id);
    setTempUserFileSendFirebase(temp2);
  }, [removeFileUploadId, removeFileFirebaseUploadId]);

  useEffect(() => {
    let handleEmojiClose = (event) => {
      if (!emojiRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleEmojiClose);
    return () => {
      document.removeEventListener("mousedown", handleEmojiClose);
    };
  }, []);

  // Construct with token and endpoint
  const client = new Web3Storage({
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDNlOThEZjI5N2E0RWIwNjc5NzdEQjE0REJBODVjZGE2RjIxN0JDOTUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2Njg0OTM2MzMwNjMsIm5hbWUiOiJXYWxsZXRQcm9qZWN0In0.99yjgTqfLKEKnB-WUGSLlyrkkuevV6avP4WNLoTeQq4",
  });
  const handleEmojiPickerhideShow = () => {
    // setShowEmojiPicker(true);
    setShowEmojiPicker(!showEmojiPicker);
  };
  const navigate = useNavigate();

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const setModalIsOpenToTrue = () => {
    navigate("/docUpload");
    // setModalIsOpen(true)
  };

  const createCertificates = () => {
    navigate("/createCertificates");
    // setModalIsOpen(true)
  };

  const setModalIsOpenToFalse = () => {
    setModalIsOpen(false);
  };

  const customStyles = {
    overlay: {
      zIndex: "10",
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      background: " #6d4cd4",
      height: "70%",
      width: "70%",
      color: "white",
      inset: "50% auto auto 50%",
    },
    sended: {
      justifyContent: "flex-end",
    },
    recieved: {
      justifyContent: "flex-start",
    },
  };
  const customStylesForinputMint = {
    width: "85%",
    borderRadius: "2rem",
    alignItems: "center",
    gap: "2rem",
    margin: "10px",
    height: "30px",
  }

  const customStylesForIpfsUpload = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      background: " #6d4cd4",
      height: "25%",
      width: "65%",
      color: "white",
      inset: "50% auto auto 50%",
    },
    noClass: {
      float: "right",
      backgroundColor: "red",
      border: "none",
      color: "white",
      height: "20%",
      width: "15%",
      borderRadius: "5px",
    },
    yesClass: {
      // float: "right",
      backgroundColor: "green",
      border: "none",
      color: "white",
      height: "20%",
      width: "15%",
      borderRadius: "5px",
    },

    popup: {
      height: "340px"
    }
  };

  const handleEmojiClick = (event, emojiObject) => {
    let message = msg;
    message += emojiObject.emoji;
    setMsg(message);
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };
  const sendNftToMint = (event) => {
    event.preventDefault();
    console.log(event.target.files[0]);
    setMintModel(false);
    if (!url) {
      toast.error("Please Enter Vaild URL", toastOptions);

    }
    else {

    }
  }
  const sendMsgForP2pAv = async () => {
    await handleSendMsg("Send Peer to Peer file Please Take It.");
    // document.getElementById("icon-button-file-p2p").click();
  };

  const sendMoney = async (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      var checkString = /^(\d*\.)?\d+$/;
      if (checkString.test(msg)) {
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        const weiValue = Web3.utils.toWei(msg, "ether");
        await web3.eth.sendTransaction({
          to: currentChat.metamask,
          from: accounts[0],
          value: weiValue,
        });
        var msgWithEther = `Send ${msg} Ether`;
        handleSendMsg(msgWithEther);
      }
      setMsg("");
    }
  };

  const sendFile = async (event) => {
    event.preventDefault();

    const file = event.target.files[0];
    let gbValue = (file.size / (1000 * 1000 * 1000)).toFixed(2);
    if (1 > Number(gbValue)) {
      setIsLoading(true);

      let temp = [...tempUserFileSendFirebase];
      temp.push(currentChat._id);
      setTempUserFileSendFirebase(temp);

      const formdata = new FormData();
      formdata.append("name", file);
      const sotrageRef = ref(storage, `files/${file.name}`);
      const uploadTask = uploadBytesResumable(sotrageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const prog = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setTotalFileSize(snapshot.totalBytes);
          setTransferredFileSize(snapshot.bytesTransferred);
          var a =
            Number(
              (
                (snapshot.totalBytes - snapshot.bytesTransferred) /
                (1000 * 1000)
              ).toFixed(2)
            ) / 10;
          setTimerForFile(a.toFixed(2));
          setProgress(prog);
        },
        (error) => console.log("error", error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            if (downloadURL) {
              //---------------------------------metamask signature --------------------
              // let provider;
              // window.ethereum.request({method:"eth_accounts"})
              // .then((result)=>{})
              // .catch((err)=>{
              //     console.log("err",err);
              //     setIsLoading(false)
              // })
              // provider = new ethers.providers.Web3Provider(window.ethereum)

              // const signer = provider.getSigner()
              // let signature = await signer.signMessage(downloadURL)
              // let address = ethers.utils.verifyMessage(downloadURL,signature);
              //--------------------------------- metamask signature --------------------
              await handleSendMsg(downloadURL);
              let temp = [...tempUserFileSendFirebase];
              let filterVar = temp.filter((item) => item == currentChat._id);
              setTempUserFileSendFirebase(filterVar);
              setIsLoading(false);
            }
          });
        }
      );

      // const savefileData =  await axios.post(savefile,formdata, {
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //     "Accept":"*"
      //   }

      // });
    } else {
      toast.error("File size should be less than 1 GB.", toastOptions);
      return false;
    }

    // if(event.target.files[0]){
    //   new Compressor(event.target.files[0], {
    //     quality: 0.8, // 0.6 can also be used, but its not recommended to go below.
    //     success: (compressedResult) => {
    //       // setCompressedFile(compressedResult);

    //     },
    //     error(err) {
    //       console.log(err.message);
    //     },
    //   });

    // }

    // if (msg.length > 0) {
    //   var checkString = /^[0-9]+$/;
    //   if (checkString.test(msg)) {
    //     const web3 = new Web3(window.ethereum);
    //     const accounts = await web3.eth.getAccounts();
    //     const weiValue = Web3.utils.toWei(msg, 'ether');
    //     await web3.eth.sendTransaction({ to: currentChat.metamask, from: accounts[0], value: weiValue });
    //     var msgWithEther = `Send ${msg} Ether`;
    //     handleSendMsg(msgWithEther);
    //   }
    //   setMsg("");
    // }
  };
  const p2pSendFile = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    let document;
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async function () {
      document = reader.result;
      await handleSendMsg(document);
    };
  };

  const sendFileUsingIpfs = async (fileobj, hours, min) => {
    const file = fileobj;
    let mbValue = (file.size / (1000 * 1000)).toFixed(2);
    if (Number(mbValue) > 20) {
      // toast.error("File size should be less than 20 MB.", toastOptions);
      setFileSizeAndUpload(true);
      setFileHoleData(file);
      // uploadTask.on(
      //   "state_changed",
      //   (snapshot) => { },
      //   (error) => console.log("error", error),
      //   () => {
      //     getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
      //       if (downloadURL) {
      //         temp_file = downloadURL;
      //         // console.log("downloadURL",downloadURL);
      //       }
      //     });
      //   }
      // );
    } else {
      setIsLoadingForIpfs(true);
      let temp = [...tempUserFileSend];
      temp.push(currentChat._id);
      setTempUserFileSend(temp);
      // const fileObj = event.target.files[0];

      // var reader = new FileReader();
      // reader.readAsDataURL(fileObj);
      // reader.onload = async function () {
      //     // const metadata =await client1.store({
      //     //   name: 'Pinpie',
      //     //   description: 'Pin is not delicious beef!',
      //     //   image: new File(
      //     //     [
      //     //       reader.result
      //     //     ],
      //     //     fileObj.name,
      //     //     { type: 'image/*' }
      //     //   ),
      //     // })
      //     const someData = new Blob([reader.result])
      //     const { car } = await NFTStorage.encodeBlob(someData)
      //     const cid = await client1.storeCar(car);
      //     setAllIpfsFile(false);
      //   };

      let arrayBuffer;

      const fileObj = fileobj;
      let fileReader = new FileReader();
      fileReader.onload = function (e) {
        // arrayBuffer = e.target.result;
        // callEncrypt(arrayBuffer);
      };
      fileReader.onprogress = function (progessBar) {
        var a = Math.round((progessBar.loaded / progessBar.total) * 100);
        setProgessV(a);
      };
      fileReader.onloadend = function (doneFile) {
        var a = Math.round((doneFile.loaded / doneFile.total) * 100);
        setProgessV(a);
        arrayBuffer = doneFile.target.result;
        uploadTask.on(
          "state_changed",
          (snapshot) => { },
          (error) => console.log("error", error),
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                if (downloadURL) {
                  temp_file = downloadURL;
                  // console.log("downloadURL",downloadURL);
                  const characters =
                    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                  const charactersLength = characters.length;
                  var a;
                  // if(mbValue > 50){
                  //   a = Math.random() * (30000 - 25000) + 25000
                  //   a = Math.round(a)
                  //   console.log(a);
                  // }
                  // else{
                  a = Math.random() * (300000 - 250000) + 250000;
                  a = Math.round(a);
                  console.log(a);
                  // }

                  let counter = 0;
                  let result = " ";
                  while (counter < a) {
                    result += characters.charAt(
                      Math.floor(Math.random() * charactersLength)
                    );
                    counter += 1;
                  }

                  let testBuffer = new Buffer(result);
                  const someData = new Blob([testBuffer]);
                  const { car } = await NFTStorage.encodeBlob(someData);
                  const cid = await client1.storeCar(car);
                  await handleSendMsg({
                    msg: "https://" + cid + ".ipfs.nftstorage.link",
                    temp_file: downloadURL,
                    hours: hours,
                    min: min,
                  });
                  // await handleSendMsg('https://' + cid + '.ipfs.nftstorage.link');
                  let temp = [...tempUserFileSend];
                  let filterVar = temp.filter(
                    (item) => item == currentChat._id
                  );
                  setTempUserFileSend(filterVar);
                  setIsLoadingForIpfs(false);
                  setHours(0);
                  setMinutes(0);
                }
              }
            );
          }
        );

        // callEncrypt(temp_file);
        callEncrypt(arrayBuffer);
        // setIsLoadingForIpfs(false);
      };

      fileReader.readAsArrayBuffer(fileObj);
    }
  }

  useEffect(async () => {
    if (directFileIpfs) {
      setIsLoadingForIpfs(true);
      let temp = [...tempUserFileSend];
      temp.push(currentChat._id);
      setTempUserFileSend(temp);
      const fileObj = fileHoleData;
      let fileReader = new FileReader();
      fileReader.onload = function (e) {
        // arrayBuffer = e.target.result;
        // callEncrypt(arrayBuffer);
      };
      fileReader.onprogress = function (progessBar) {
        var a = Math.round((progessBar.loaded / progessBar.total) * 100);
        setProgessV(a);
      };
      fileReader.onloadend = function (doneFile) {
        var a = Math.round((doneFile.loaded / doneFile.total) * 100);
        setProgessV(a);
        // arrayBuffer = doneFile.target.result;
        // callEncrypt(arrayBuffer);
        // setIsLoadingForIpfs(false);
      };

      fileReader.readAsArrayBuffer(fileHoleData);
      const someData = new Blob([fileHoleData]);
      const { car } = await NFTStorage.encodeBlob(someData);
      const cid = await client1.storeCar(car);
      await handleSendMsg("https://" + cid + ".ipfs.nftstorage.link");
      let temp2 = [...tempUserFileSend];
      let filterVar = temp2.filter((item) => item == currentChat._id);
      setTempUserFileSend(filterVar);
      setIsLoadingForIpfs(false);
      // setDirectFileIpfs(false);
    }
  }, [directFileIpfs]);

  async function callEncrypt(arrayBuffer) {

    const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
    const str = CryptoJS.enc.Hex.stringify(wordArray);

    let currentUserMetaMaskPK = "";
    if (localStorage.getItem("chat-app-current-user")) {
      currentUserMetaMaskPK = JSON.parse(
        localStorage.getItem("chat-app-current-user")
      ).metamask;
    }
    let currentChatWith = JSON.parse(
      localStorage.getItem("current-chat-with")
    ).metamask;
    var key = currentUserMetaMaskPK + "_" + currentChatWith;

    let ct = CryptoJS.AES.encrypt(str, key); // SenderPK_ReceiverPK
    let ctstr = ct.toString();
    // console.log("ctstr",ctstr); 

    // const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    // var a = Math.random() * (2000 - 100) + 1000
    // a = Math.round(a)
    // console.log(a);
    // // function generateString(length) {
    //     let result = ' ';
    //     const charactersLength = characters.length;
    //     for ( let i = 0; i < a; i++ ) {
    //         result += characters.charAt(Math.floor(Math.random() * charactersLength));
    //     }
    // // }
    let testBuffer = new Buffer(ctstr);
    const someData = new Blob([testBuffer]);
    const { car } = await NFTStorage.encodeBlob(someData);
    const cid = await client1.storeCar(car);
    // await handleSendMsg({'msg':'https://' + cid + '.ipfs.nftstorage.link','temp_file':temp_file})
    await handleSendMsg('https://' + cid + '.ipfs.nftstorage.link');
    let temp = [...tempUserFileSend];
    let filterVar = temp.filter((item) => item == currentChat._id);
    setTempUserFileSend(filterVar);
    setIsLoadingForIpfs(false);
  }

  const ipfsAllFileShow = async (event) => {
    setAllIpfsFile(true);
    setAllsendIPFSLink([]);
    setAllreceiveIPFSLink([]);
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    const data = await JSON.parse(
      localStorage.getItem("chat-app-current-user")
    );
    const response = await axios.post(recieveMessageRoute, {
      from: data._id,
      to: currentChat._id,
    });
    // setAllIPFSLink(response.data)
    const messages = response.data;
    var arrsendIpfs = [];
    var arrreceiveIpfs = [];
    {
      messages.map(async (message) => {
        if (message.message.includes(".ipfs.nftstorage.link")) {
          // var msgSplit = message.message.split("ipfs.w3s.link/");
          var hours = new Date(message.createdAt).getHours() % 12;
          if (hours < 10) {
            hours = "0" + hours;
          }
          var min = new Date(message.createdAt).getMinutes();
          if (min < 10) {
            min = "0" + min;
          }
          var date =
            new Date(message.createdAt).toDateString() +
            " " +
            hours +
            ":" +
            min;
          // new Date("2022-12-20T07:30:18.792Z").toDateString()
          if (message.fromSelf == true) {
            var message = {
              // fileName: msgSplit[1],
              // message: msgSplit[0] + 'ipfs.w3s.link',
              message: message.message,
              createdAt: date,
              fromSelf: message.fromSelf,
            };
            arrsendIpfs.push(message);
          } else {
            var message = {
              // fileName: msgSplit[1],
              // message: msgSplit[0] + 'ipfs.w3s.link',
              message: message.message,
              createdAt: date,
              fromSelf: message.fromSelf,
            };
            arrreceiveIpfs.push(message);
          }
        }
      });

      arrsendIpfs
        .sort(function (a, b) {
          return b.date - a.date;
        })
        .reverse();
      arrreceiveIpfs
        .sort(function (a, b) {
          return b.date - a.date;
        })
        .reverse();
    }

    if (arrsendIpfs.length > 0) {
      setAllsendIPFSLink(arrsendIpfs);
    } else {
      var message = [
        {
          message: "Send Files Not Found",
          fromSelf: true,
        },
      ];
      setAllsendIPFSLink(message);
    }
    if (arrreceiveIpfs.length > 0) {
      setAllreceiveIPFSLink(arrreceiveIpfs);
    } else {
      var message = [
        {
          message: "Receive Files Not Found",
          fromSelf: false,
        },
      ];
      setAllreceiveIPFSLink(message);
    }
  };
  const ipfsAllFilsModelOff = async (event) => {
    setAllIpfsFile(false);
  };

  const downloadIpfsFile = async (data, indexKey) => {
    // showDownloadLoader(indexKey);
    var key;
    let currentUserMetaMaskPK = "";
    if (localStorage.getItem("chat-app-current-user")) {
      currentUserMetaMaskPK = JSON.parse(
        localStorage.getItem("chat-app-current-user")
      ).metamask;
    }
    let currentChatWith = JSON.parse(
      localStorage.getItem("current-chat-with")
    ).metamask;
    if (data.fromSelf == true) {
      showDownloadLoader(indexKey);
      key = currentUserMetaMaskPK + "_" + currentChatWith;
    } else {
      showDownloadLoaderR(indexKey);
      key = currentChatWith + "_" + currentUserMetaMaskPK;
    }

    var filecontent = await axios.get(`${data.message}`);
    var str = filecontent.data;
    const decrypted = CryptoJS.AES.decrypt(filecontent.data, key);
    str = decrypted.toString(CryptoJS.enc.Utf8);
    const wordArray = CryptoJS.enc.Hex.parse(str);
    wordToByteArray(wordArray.words, wordArray.words.length);
  };

  function wordToByteArray(word, length) {
    let pushCode = [],
      xFF = 0xff;
    word.forEach((item) => {
      if (length > 0) pushCode.push(item >>> 24);
      if (length > 1) pushCode.push((item >>> 16) & xFF);
      if (length > 2) pushCode.push((item >>> 8) & xFF);
      if (length > 3) pushCode.push(item & xFF);
    });
    const data = pushCode.slice(0, -1);
    const arrayBuffer = new ArrayBuffer(data.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < data.length; ++i) {
      uint8Array[i] = data[i];
    }
    saveFile(uint8Array);
  }

  function saveFile(uint8Array) {
    const mimeType = FileType(uint8Array);
    var blob = new Blob([uint8Array], { type: mimeType.mime });
    var digits = Math.floor(Math.random() * 9000000000) + 1000000000;
    FileSaver.saveAs(blob, digits + "." + mimeType.ext);
    showDownloadLoader();
    showDownloadLoaderR();
  }
  const yesFileUpload20Up = async (event) => {
    setDirectFileIpfs(true);
    setFileSizeAndUpload(false);
  };
  const noFileUpload20Up = async (event) => {
    setFileSizeAndUpload(false);
  };

  const selectOptions = async (flag) => {
    // console.log("flag",flag);
    // await NFTStorage.delete('bafybeihe5nrtxlknosbk4bx7z5h2rhj56rpl4knisgnsjc4ar7zgiyrgdy', 'ipfs.nftstorage.link').then((res)=>{
    //   console.log(res);
    // }).catch((err)=>{
    //   console.log("err",err);
    // })
    // var config = {
    //   method: 'delete',
    //   url: 'https://api.nft.storage/bafybeicv6jvja5666o27myaxti67yxpik4cktqonsfleha4lw6h2jmlsea',
    //   headers: {
    //     // token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDYyZUI4N0YyOGI0MGM2YmEwMEE4ZkZCMDJhMUZCZGQ5OTU0RjIyNTciLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3MjM4MDkwNDgzMiwibmFtZSI6IndhbGxldCJ9.m9s6Em7l8ZlhjSIzEUHo9fK2yuiYUQplXhzSMHoum8Y",
    //     "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDYyZUI4N0YyOGI0MGM2YmEwMEE4ZkZCMDJhMUZCZGQ5OTU0RjIyNTciLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3ODE3MDkyMjcwNCwibmFtZSI6Im5pbGVzaCJ9.OA_D7RURjTwvRAByalImjd67DgvBqne3YIpHlBQnnOw"
    //   }
    // };

    // await axios(config).then((res)=>{
    //   console.log("res",res);
    // }).catch((err)=>{
    //   console.log("err",err);
    // })

    if (flag == "icon-button-file-ipfs") {
      settemp_perma(true);
      // document.getElementById(flag).click();
    } else {
      document.getElementById(flag).click();
    }
  };
  // const onOptionChange = e => {
  //   console.log("e.target.value",e.target.value);
  //   setTopping(e.target.value);
  // }
  // const onTimeChange = e => {
  //   console.log("e.target.value",e.target.value);
  //   setTime(e.target.value);

  // }
  const closeModelFileSelection = () => {
    // var fileTempOrparma = topping;
    // console.log("fileTempOrparma",fileTempOrparma);
    let min = minutes;
    let hoursset = hours;
    let fileObj = fileObjTemp;
    console.log("fileObj", fileObj);
    if (minutes > 0 && hours > 0) {
      toast.error("Please Select Only One Time Minutes Or Hours", toastOptions);
      return false;
    }
    if (minutes == 0) {
      if (hours == 0) {
        toast.error("Please Select Time Minutes Or Hours", toastOptions);
        return false;
      }
    }
    if (!fileObjTemp) {
      toast.error("Please Select File", toastOptions);
      return false;
    }

    sendFileUsingIpfs(fileObj, hoursset, min);
    settemp_perma(false);
    setTopping();
  };
  const tempParmaFileObj = (e) => {
    console.log(e.target.files[0]);
    setfileObjTemp(e.target.files[0]);
  };
  const setMinutesChange = (e) => {
    console.log(e.target.value);
    setMinutes(e.target.value);
  };
  const setHoursChange = (e) => {
    console.log(e.target.value);
    setHours(e.target.value);

  }
  const fileMitFunc = (e) => {
    console.log("testing is done");
    setMintModel(true)
  }

  return (
    <>
      {isLoading && tempUserFileSendFirebase.includes(currentChat._id) ? (
        <Container>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <h4 style={{ color: "white" }}>Uploading done {progress}%</h4>
            <h4 style={{ color: "white" }}>File Size {totalFileSize} </h4>
            <h4 style={{ color: "white" }}>
              File Transfer {transferredFileSize}{" "}
            </h4>
            <h4 style={{ color: "white" }}>Timer {timerForFile} </h4>
          </div>
        </Container>
      ) : isLoadingForIpfs &&
        !newchange &&
        tempUserFileSend.includes(currentChat._id) ? (
        <Container>
          <h4 style={{ color: "white" }}>
            File Uploading on IPFS Please Wait .. {progessV} %
          </h4>
        </Container>
      ) : (
        <Container>
          <div ref={emojiRef} className="button-container">
            <div className="emoji">
              <img src={emoji} onClick={handleEmojiPickerhideShow} />
              {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
              <span className="emojiText">Select Emoji</span>
            </div>
          </div>

          <Popup
            trigger={
              <label>
                <img src={pin} width="20" />
              </label>
            }
            position="top left"
            contentStyle={customStylesForIpfsUpload.popup}
          >
            {(close) => (
              <div>
                <div
                  className="button-container btn-contenr"
                  onClick={() => selectOptions("selectImage")}
                >
                  <div className="emoji fileSelection emojiSelection">
                    <input
                      accept="*"
                      id="selectImage"
                      type="file"
                      style={{ display: "none" }}
                      onChange={($event) => {
                        sendFile($event);
                        close();
                      }}
                    />
                    <label className="optn-lbl">
                      <img src={file_browser} accept="*" />
                      <span className="lbl-text">Transfer File</span>
                    </label>
                  </div>
                </div>

                <div
                  className="button-container btn-contenr"
                  onClick={() => selectOptions("icon-button-file-ipfs")}
                >
                  <div className="emoji">
                    {/* <input
                      id="icon-button-file-ipfs"
                      type="file"
                      style={{ display: "none" }}
                      onChange={($event) => { sendFileUsingIpfs($event); close() }}
                    /> */}
                    <label className="optn-lbl">
                      <img src={file_ftp} />
                      <span className="lbl-text">Upload File On IPFS</span>
                    </label>
                  </div>
                </div>

                <div
                  className="button-container btn-contenr"
                  onClick={($event) => {
                    ipfsAllFileShow($event);
                    close();
                  }}
                >
                  <div className="emoji">
                    <label className="optn-lbl">
                      <img src={send_receive} />
                      <span className="lbl-text">Show All Files On IPFS</span>
                    </label>
                  </div>
                </div>

                <div
                  className="button-container btn-contenr"
                  onClick={($event) => {
                    setModalIsOpenToTrue($event);
                    close();
                  }}
                >
                  <div className="emoji">
                    <label className="optn-lbl">
                      <img src={edit} />
                      <span className="lbl-text">Send File For Signature</span>
                    </label>
                  </div>
                </div>

                <div
                  className="button-container btn-contenr"
                  onClick={($event) => {
                    createCertificates($event);
                    close();
                  }}
                >
                  <div className="emoji">
                    <label className="optn-lbl">
                      <img src={edit} />
                      <span className="lbl-text">Create Certificates</span>
                    </label>
                  </div>
                </div>

                <div className="button-container btn-contenr" onClick={($event) => { fileMitFunc($event); close() }}>
                  <div className="emoji">
                    <label className="optn-lbl">
                      <img src={edit} />
                      <span className="lbl-text">Mint File</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </Popup>

          <form
            style={{ marginBottom: "5px", height: "37px" }}
            className="input-container"
            onSubmit={(event) => sendChat(event)}
          >
            <input
              style={{ marginBottom: "5px", height: "37px" }}
              type="text"
              placeholder="type your message here"
              onChange={(e) => setMsg(e.target.value)}
              value={msg}
            />
            <button type="submit">
              <IoMdSend />
            </button>
          </form>

          <Modal isOpen={modalIsOpen}>
            <button onClick={setModalIsOpenToFalse}>Back To Chat</button>
            <AnimeList />
          </Modal>
          <Modal isOpen={allIpfsFile} style={customStyles}>
            <div className="send_receive">
              <h4 onClick={ipfsAllFilsModelOff} className="btn-close-h4">
                <span className="btn-close">X</span>
              </h4>
              <p className="header-title">Sended Files</p>
              {allsendIPFSLink.length == 0 ? (
                <div style={{ paddingTop: "10px" }}>
                  <p>Please Wait..</p>
                </div>
              ) : (
                <div className="modelMainDiv">
                  <div key={uuidv4()} ref={scrollRef} className="testing">
                    <div className="middelDivForLink">
                      <table>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Link</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {allsendIPFSLink.map((message, indexKey) => {
                            return (
                              <>
                                {message.message != "Send Files Not Found" ? (
                                  <tr>
                                    <td className="chat_date chat_input">
                                      {message.createdAt}
                                    </td>
                                    <td className="chat_link chat_input">
                                      {message.message}
                                    </td>
                                    <td className="chat_input">
                                      {isShowLoader === indexKey ? (
                                        <img width="35px" src={LoadingGIF} />
                                      ) : (
                                        <BsFillCloudDownloadFill
                                          onClick={() =>
                                            downloadIpfsFile(message, indexKey)
                                          }
                                          style={{
                                            color: "#ffff00c8",
                                            cursor: "pointer",
                                            fontSize: 30,
                                            marginLeft: 30,
                                          }}
                                        />
                                      )}
                                    </td>
                                  </tr>
                                ) : (
                                  <p style={{ marginTop: 20 }}>
                                    {message.message}
                                  </p>
                                )}
                              </>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
              <p style={{ marginTop: 20 }} className="header-title">
                Received Files
              </p>
              {allreceiveIPFSLink.length == 0 ? (
                <div style={{ paddingTop: "10px" }}>
                  <p>Please Wait..</p>
                </div>
              ) : (
                <div className="modelMainDiv">
                  <div key={uuidv4()} ref={scrollRef} className="testing">
                    <div className="middelDivForLink">
                      <table>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Link</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {allreceiveIPFSLink.map((message, indexKeyRec) => {
                            return (
                              <>
                                {message.message !=
                                  "Receive Files Not Found" ? (
                                  <tr>
                                    <td className="chat_date chat_input">
                                      {message.createdAt}
                                    </td>
                                    <td className="chat_link chat_input">
                                      {message.message}
                                    </td>
                                    <td className="chat_input">
                                      {isShowLoaderR === indexKeyRec ? (
                                        <img width="35px" src={LoadingGIF} />
                                      ) : (
                                        <BsFillCloudDownloadFill
                                          onClick={() =>
                                            downloadIpfsFile(
                                              message,
                                              indexKeyRec
                                            )
                                          }
                                          style={{
                                            color: "#ffff00c8",
                                            cursor: "pointer",
                                            fontSize: 30,
                                            marginLeft: 30,
                                          }}
                                        />
                                      )}
                                    </td>
                                  </tr>
                                ) : (
                                  <p style={{ marginTop: 20 }}>
                                    {message.message}
                                  </p>
                                )}
                              </>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Modal>
          <Modal
            ariaHideApp={false}
            isOpen={fileSizeAndUpload}
            style={customStylesForIpfsUpload}
          >
            <h2>
              Your file is more than 20 MB so it will not be encrypted. Shall we
              upload it directly to IPFS, are you ready for this ?{" "}
            </h2>
            <button
              onClick={yesFileUpload20Up}
              style={{
                backgroundColor: "green",
                border: "none",
                color: "white",
                height: "30%",
                width: "12%",
                borderRadius: "5px",
                marginTop: "10px",
                fontSize: "25px",
              }}
              className="yesClass"
            >
              Yes
            </button>
            <button
              onClick={noFileUpload20Up}
              style={{
                float: "right",
                backgroundColor: "red",
                border: "none",
                color: "white",
                height: "30%",
                width: "12%",
                borderRadius: "5px",
                marginTop: "10px",
                fontSize: "25px",
              }}
              className="noClass"
            >
              No
            </button>
          </Modal>
          <Modal
            ariaHideApp={false}
            isOpen={temp_perma}
            style={customStylesForIpfsUpload}
          >
            <label htmlFor="regular">File Temporary Store</label>
            <br />

            <br />
            <select onChange={setMinutesChange}>
              <option value="0">Time in Minutes</option>
              <option value="2">30 Minutes</option>
              <option value="60">60 Minutes</option>
              <option value="90">90 Minutes</option>
            </select>
            <select onChange={setHoursChange}>
              <option value="0">Time in Hours</option>
              <option value="1">1 Hours</option>
              <option value="2">2 Hours</option>
              <option value="3">3 Hours</option>
            </select>
            <input
              id="icon-button-file-ipfs"
              type="file"
              // style={{ display: "none" }}
              onChange={($event) => {
                tempParmaFileObj($event);
              }}
            />

            <p onClick={closeModelFileSelection}> Done </p>
          </Modal>
          <Modal ariaHideApp={false} isOpen={mintModel} style={customStylesForIpfsUpload}>
            <form
              className="input-container"
            // onSubmit={(event) => sendNftToMint(event)}
            >
              <input
                type="file"
                placeholder="select Image for Mint"
                // onChange={(e) => sendNftToMint(e)}
                onChange={($event) => { sendNftToMint($event); }}
                value={url}
                style={customStylesForinputMint}
              />
              <button type="submit">
                <IoMdSend />
              </button>
            </form>
          </Modal>


        </Container >
      )
      }
      <ToastContainer />
    </>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  grid-template-columns: 5% 95%;
  background-color: #080420;
  padding: 0 10px;
  // justify-content: space-between;
  @media screen and (min-width: 345px) and (max-width: 1080px) {
    padding: 10px 0.5rem !important;
  }
  @media screen and (min-width: 345px) and (max-width: 767px) {
    padding: 10px 0.5rem !important;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    gap: 1rem;
  }
  .button-container {
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    gap: 1rem;
    margin-right: 10px;

    .emoji {
      position: relative;
      padding: 0 2px;
      img {
        @media only screen and (max-width: 767px) {
          max-width: 20px;
          height: auto;
        }
      }
      svg {
        font-size: 1.5rem;
        color: #ffff00c8;
        cursor: pointer;
      }
      .emoji-picker-react {
        position: absolute;
        top: -210px;
        height: 190px;
        background-color: #080420;
        box-shadow: 0 5px 10px #9a86f3;
        border-color: #9a86f3;
        z-index: 10;
        .emoji-scroll-wrapper::-webkit-scrollbar {
          background-color: #080420;
          width: 5px;
          &-thumb {
            background-color: #9a86f3;
          }
        }
        .emoji-categories {
          button {
            filter: contrast(0);
          }
        }
        .emoji-search {
          background-color: transparent;
          border-color: #9a86f3;
        }
        .emoji-group:before {
          background-color: #080420;
        }
      }
    }
  }
  .input-container {
    width: 100%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: #ffffff34;
    margin-left: 10px;
    input {
      width: 90%;
      height: 60%;
      background-color: transparent;
      color: white;
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;

      &::selection {
        background-color: #9a86f3;
      }
      &:focus {
        outline: none;
      }
    }
    button {
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #9a86f3;
      border: none;
      @media screen and (min-width: 345px) and (max-width: 1080px) {
        padding: 0.3rem 1rem;
        svg {
          font-size: 1rem;
        }
      }
      svg {
        font-size: 2rem;
        color: white;
        margin-right: -5px;
      }
    }
  }
  .sendManey-container {
    align-items: center;
    padding: 0.5rem;
    border-radius: 0.5rem;
    background-color: #9a86f3;
    cursor: pointer;
    button {
      background-color: #9a86f3;
      border: none;
      color: #fff;
      span {
        @media screen and (max-width: 767px) {
          display: none;
        }
      }
      img {
        display: none;
        @media screen and (max-width: 767px) {
          display: block;
        }
      }
    }
  }
`;
