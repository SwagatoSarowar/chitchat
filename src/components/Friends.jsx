import { BsThreeDotsVertical } from "react-icons/bs";
import { getDatabase, onValue, push, ref, remove } from "firebase/database";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectedChatInfo } from "../slices/selectedChatSlice";

function Friends({ button }) {
  const db = getDatabase();

  const currentUserData = useSelector(
    (state) => state.userLoginInfo.userLoginInfo,
  );
  const [friendsList, setFriendsList] = useState([]);

  useEffect(() => {
    onValue(ref(db, "friends/"), (snapshot) => {
      const friendsListArr = [];
      snapshot.forEach((item) => {
        (item.val().senderId === currentUserData.uid ||
          item.val().receiverId === currentUserData.uid) &&
          friendsListArr.push({ ...item.val(), id: item.key });
      });
      setFriendsList(friendsListArr);
    });
  }, []);

  return (
    <div className="relative overflow-hidden pb-1 pl-5">
      <div className="absolute inset-x-5 flex items-center justify-between bg-white pt-3">
        <h3 className="text-xl font-semibold">Friends</h3>
        <BsThreeDotsVertical className="text-primary-accent" size={20} />
      </div>
      <div className="h-full overflow-y-scroll pt-10">
        <div className="h-full pr-3">
          {friendsList.length ? (
            friendsList.map((item, index) => (
              <Friend
                key={index}
                db={db}
                data={item}
                currentUserData={currentUserData}
                button={button}
              />
            ))
          ) : (
            <h3 className="flex h-full items-center justify-center text-xl font-bold opacity-50">
              You don&apos;t have any friends 😔
            </h3>
          )}
        </div>
      </div>
    </div>
  );
}

export default Friends;

function Friend({ db, currentUserData, data, button }) {
  const dispatch = useDispatch();

  const friendData =
    currentUserData.uid === data.receiverId
      ? { friendName: data.senderName, friendImg: data.senderImg }
      : { friendName: data.receiverName, friendImg: data.receiverImg };

  const blockedUserId =
    data.senderId === currentUserData.uid ? data.receiverId : data.senderId;
  const blockedUserName =
    data.senderId === currentUserData.uid ? data.receiverName : data.senderName;
  const blockedUserImg =
    data.senderId === currentUserData.uid ? data.receiverImg : data.senderImg;

  const handleBlock = () => {
    confirm(`Do you want to block ${blockedUserName}`) &&
      push(ref(db, "blocks/"), {
        blockedByUserName: currentUserData.displayName,
        blockedByUserId: currentUserData.uid,
        blockedByUserImg: currentUserData.photoURL,
        blockedUserId,
        blockedUserName,
        blockedUserImg,
      }).then(() => {
        remove(ref(db, "friends/" + data.id));
      });
  };

  const handleMessage = function () {
    currentUserData.uid === data.senderId
      ? dispatch(
          selectedChatInfo({
            selectedName: data.receiverName,
            selectedId: data.receiverId,
            selectedImg: data.receiverImg,
          }),
        )
      : dispatch(
          selectedChatInfo({
            selectedName: data.senderName,
            selectedId: data.senderId,
            selectedImg: data.senderImg,
          }),
        );
  };
  return (
    <div className="flex items-center justify-between border-b border-black/25 py-3">
      <div className="flex items-center gap-x-3">
        <img
          className="w-[70px] rounded-full"
          src={friendData.friendImg}
          alt="profileImg"
        />
        <div>
          <h4 className="text-lg font-semibold">{friendData.friendName}</h4>
          <p className="text-sm font-medium text-slate-500">Hi...</p>
        </div>
      </div>
      {button === "message" ? (
        <button
          className="rounded-[5px] bg-primary-accent px-2 text-xl font-semibold text-white"
          onClick={handleMessage}
        >
          Message
        </button>
      ) : (
        <button
          onClick={handleBlock}
          className="rounded-[5px] bg-red-600 px-2 text-xl font-semibold text-white"
        >
          Block
        </button>
      )}
    </div>
  );
}
