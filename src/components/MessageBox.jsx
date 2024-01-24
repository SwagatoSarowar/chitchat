import { BsThreeDotsVertical } from "react-icons/bs";
import { IoIosSend } from "react-icons/io";
import { FaImages } from "react-icons/fa";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getDatabase, ref, push, onValue } from "firebase/database";
import {
  getDownloadURL,
  getStorage,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import moment from "moment";
import EmojiPicker from "emoji-picker-react";
import ModalImage from "react-modal-image";

export default function MessageBox() {
  const db = getDatabase();
  const storage = getStorage();

  const currentUserData = useSelector(
    (state) => state.userLoginInfo.userLoginInfo,
  );
  const selectedChatInfo = useSelector(
    (state) => state.selectedChatInfo.selectedChatInfo,
  );

  const [messageInput, setMessageInput] = useState("");
  const [messageDisplay, setMessageDisplay] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSubmitMessage = function (e) {
    e.preventDefault();

    if (!messageInput) return;

    push(ref(db, "messages/"), {
      senderId: currentUserData.uid,
      receiverId: selectedChatInfo?.selectedId,
      message: messageInput,
      time: `${new Date().getFullYear()} ${
        new Date().getMonth() + 1
      } ${new Date().getDate()} ${new Date().getHours()} ${new Date().getMinutes()}`,
    }).then(() => {
      setMessageInput("");
    });
  };

  const handleSendImg = function (e) {
    const imgRef = storageRef(storage, e.target.files[0].name);

    uploadBytes(imgRef, e.target.files[0]).then(() => {
      getDownloadURL(imgRef).then((url) => {
        push(ref(db, "messages/"), {
          senderId: currentUserData.uid,
          receiverId: selectedChatInfo?.selectedId,
          img: url,
          time: `${new Date().getFullYear()} ${
            new Date().getMonth() + 1
          } ${new Date().getDate()} ${new Date().getHours()} ${new Date().getMinutes()}`,
        });
      });
    });
  };

  const handleInsertEmoji = function (e) {
    setMessageInput((cur) => cur + e.emoji);
  };

  useEffect(() => {
    onValue(ref(db, "messages/"), (snapshot) => {
      const messageArr = [];
      snapshot.forEach((item) => {
        (item.val().receiverId === currentUserData.uid &&
          item.val().senderId === selectedChatInfo?.selectedId) ||
        (item.val().senderId === currentUserData.uid &&
          item.val().receiverId === selectedChatInfo?.selectedId)
          ? messageArr.push(item.val())
          : null;
      });
      setMessageDisplay(messageArr);
    });
  }, [selectedChatInfo]);

  useEffect(() => {
    document.getElementById("messages")?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [messageDisplay]);

  return (
    <div
      className={`col-span-2 mr-5 flex max-h-screen flex-col rounded-[20px] px-14 py-6 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] ${
        !selectedChatInfo ? "items-center justify-center" : null
      }`}
    >
      {!selectedChatInfo ? (
        <h2 className="text-3xl font-semibold text-slate-400">
          Please select one of your friend to chat
        </h2>
      ) : (
        <>
          <div className="relative flex h-[10%] items-center justify-between border-b-2 border-b-black/20  pb-6">
            <div className="flex items-center gap-x-8">
              <img
                className="w-[75px] rounded-full"
                src={selectedChatInfo?.selectedImg}
                alt=""
              />
              <div>
                <h3 className="text-2xl font-semibold">
                  {selectedChatInfo?.selectedName}
                </h3>
              </div>
            </div>
            <BsThreeDotsVertical size={25} />
          </div>

          <div className="h-[80%] grow overflow-y-scroll border-b-2 border-b-black/20 py-[30px]">
            <div
              id="messages"
              className={`flex flex-col gap-y-4 pl-4 pr-6 ${
                !messageDisplay.length ? "justify-center" : null
              }`}
            >
              {!messageDisplay.length ? (
                <div className="text-center text-xl font-semibold text-slate-400">
                  Start chatting to see your conversation.
                </div>
              ) : (
                messageDisplay.map((item, index) =>
                  item.receiverId === currentUserData.uid ? (
                    <MessageBubbleReceive key={index} messageData={item} />
                  ) : (
                    <MessageBubbleSend key={index} messageData={item} />
                  ),
                )
              )}
            </div>
          </div>

          <div className="h-[10%]">
            <form
              className="flex gap-x-5 pt-[35px]"
              onSubmit={(e) => handleSubmitMessage(e)}
            >
              <div className="relative flex grow gap-x-[6px] rounded-[10px] bg-[#f1f1f1] pr-[15px]">
                <input
                  onFocus={() => setShowEmojiPicker(false)}
                  className="grow bg-transparent pl-[15px] focus-visible:outline-none"
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                />
                {showEmojiPicker && (
                  <div
                    id="emoji-div"
                    className="absolute bottom-10 right-0 rounded-lg border-2"
                  >
                    <EmojiPicker onEmojiClick={handleInsertEmoji} />
                  </div>
                )}

                <div className="relative flex items-center gap-x-2 text-black/50">
                  <button
                    type="button"
                    className="p-1"
                    onClick={() => setShowEmojiPicker((cur) => !cur)}
                  >
                    <MdOutlineEmojiEmotions size={20} />
                  </button>
                  <label className="cursor-pointer p-1">
                    <FaImages size={20} />
                    <input
                      className="hidden"
                      type="file"
                      onChange={(e) => handleSendImg(e)}
                    />
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="rounded-[10px] bg-primary-accent p-[10px]"
              >
                <IoIosSend color="white" size={20} />
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

function MessageBubbleReceive({ messageData }) {
  return (
    <div>
      <div className="relative">
        {messageData.img ? (
          <div className="inline-block max-w-[80%] rounded-[10px] bg-[#f1f1f1] p-3 font-poppins font-medium">
            <ModalImage small={messageData.img} large={messageData.img} />
          </div>
        ) : (
          <div className="inline-block max-w-[80%] rounded-[10px] bg-[#f1f1f1] px-12 py-3 font-poppins font-medium">
            {messageData.message}
          </div>
        )}
        {!messageData.img && (
          <div className="absolute bottom-0 left-0 -translate-x-1/4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="51"
              height="21"
              viewBox="0 0 51 21"
              fill="none"
            >
              <path
                d="M24.714 0.8332C25.4101 0.334971 26.346 0.334971 27.0421 0.833199L50.1509 17.3737C51.7323 18.5055 50.9315 21 48.9869 21H2.76924C0.824561 21 0.0238247 18.5055 1.60517 17.3737L24.714 0.8332Z"
                fill="#f1f1f1"
              />
            </svg>
          </div>
        )}
      </div>
      <p className="text-xs text-black/25">
        {moment(messageData.time, "YYYY MM DD hour minutes").fromNow()}
      </p>
    </div>
  );
}

function MessageBubbleSend({ messageData }) {
  return (
    <div className="text-right">
      <div className="relative">
        {messageData.img ? (
          <div className="inline-block max-w-[80%] rounded-[10px] bg-primary-accent p-3 text-left font-poppins font-medium text-white">
            <ModalImage small={messageData.img} large={messageData.img} />
          </div>
        ) : (
          <div className="inline-block max-w-[80%] rounded-[10px] bg-primary-accent px-12 py-3 text-left font-poppins font-medium text-white">
            {messageData.message}
          </div>
        )}
        {!messageData.img && (
          <div className="absolute bottom-0 right-0 translate-x-1/4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="51"
              height="21"
              viewBox="0 0 51 21"
              fill="none"
            >
              <path
                d="M24.714 0.8332C25.4101 0.334971 26.346 0.334971 27.0421 0.833199L50.1509 17.3737C51.7323 18.5055 50.9315 21 48.9869 21H2.76924C0.824561 21 0.0238247 18.5055 1.60517 17.3737L24.714 0.8332Z"
                fill="#5F35F5"
              />
            </svg>
          </div>
        )}
      </div>
      <p className="text-xs text-black/25">
        {moment(messageData.time, "YYYY MM DD hour minutes").fromNow()}
      </p>
    </div>
  );
}
