import { getDatabase, ref, onValue, push } from "firebase/database";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function UserList() {
  const db = getDatabase();

  const [userList, setUserList] = useState([]);
  const [friendRequestsIdList, setFriendRequestsIdList] = useState([]);
  const [friendsIdList, setFriendsIdList] = useState([]);
  const [blockedIdList, setBlockedIdList] = useState({});
  const [searchList, setSearchList] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  const currentUserData = useSelector(
    (state) => state.userLoginInfo.userLoginInfo,
  );

  useEffect(() => {
    const userRef = ref(db, "users/");
    const friendRequestsRef = ref(db, "friendrequests/");
    const friendsRef = ref(db, "friends/");
    const blocksRef = ref(db, "blocks/");

    onValue(userRef, (snapshot) => {
      let userListArr = [];
      snapshot.forEach((item) => {
        currentUserData.uid !== item.key &&
          userListArr.push({ ...item.val(), userId: item.key });
      });
      setUserList(userListArr);
    });

    onValue(friendRequestsRef, (snapshot) => {
      let friendRequestsListArr = [];
      snapshot.forEach((item) => {
        friendRequestsListArr.push(item.val().senderId + item.val().receiverId);
      });
      setFriendRequestsIdList(friendRequestsListArr);
    });

    onValue(friendsRef, (snapshot) => {
      const friendsIdListArr = [];
      snapshot.forEach((item) => {
        friendsIdListArr.push(item.val().senderId + item.val().receiverId);
      });
      setFriendsIdList(friendsIdListArr);
    });

    onValue(blocksRef, (snapshot) => {
      const blockedArr = [];
      const blockedByMeArr = [];
      snapshot.forEach((item) => {
        item.val().blockedByUserId === currentUserData.uid
          ? blockedByMeArr.push(item.val().blockedUserId)
          : blockedArr.push(item.val().blockedByUserId);
      });
      setBlockedIdList({
        blockedId: blockedArr,
        blockedByMeId: blockedByMeArr,
      });
    });
  }, []);

  const handleSearch = function (e) {
    setSearchInput(e.target.value);
    const arr = [];
    e.target.value.length
      ? userList.forEach(
          (item) =>
            item.username
              .toLowerCase()
              .includes(e.target.value.toLowerCase()) && arr.push(item),
        )
      : null;

    setSearchList(arr);
  };

  return (
    <div className="relative overflow-hidden pb-1 pl-5">
      <div className="absolute inset-x-5 bg-white pt-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">User List</h3>
          <BsThreeDotsVertical className="text-primary-accent" size={20} />
        </div>
        <div className="mt-2">
          <input
            className="mx-auto w-3/4 rounded-lg px-2 py-1 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] outline-none placeholder:pl-10 focus-visible:shadow-[0_4px_4px_0_rgba(0,0,0,0.50)]"
            type="text"
            placeholder="Search"
            value={searchInput}
            onChange={(e) => handleSearch(e)}
          />
        </div>
      </div>

      <div className="mt-20 h-full overflow-y-scroll">
        <div className="h-full pr-3">
          {userList.length ? (
            searchInput.length ? (
              searchList.length ? (
                searchList.map((item, index) => (
                  <User
                    db={db}
                    friendsData={friendsIdList}
                    friendRequestsdata={friendRequestsIdList}
                    currentUserData={currentUserData}
                    blockedData={blockedIdList}
                    userData={item}
                    key={index}
                  />
                ))
              ) : (
                <h3 className="flex h-full items-center justify-center text-xl font-bold opacity-50">
                  No user found
                </h3>
              )
            ) : (
              userList.map((item, index) => (
                <User
                  db={db}
                  friendsData={friendsIdList}
                  friendRequestsdata={friendRequestsIdList}
                  currentUserData={currentUserData}
                  blockedData={blockedIdList}
                  userData={item}
                  key={index}
                />
              ))
            )
          ) : (
            <h3 className="flex h-full items-center justify-center text-xl font-bold opacity-50">
              No user available
            </h3>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserList;

function User({
  db,
  currentUserData,
  userData,
  friendRequestsdata,
  friendsData,
  blockedData,
}) {
  const handleAddFriend = () => {
    push(ref(db, "friendrequests/"), {
      senderName: currentUserData.displayName,
      senderId: currentUserData.uid,
      senderImg: currentUserData.photoURL,
      receiverName: userData.username,
      receiverId: userData.userId,
      receiverImg: userData.profileImg,
    });
  };

  return (
    <div className="flex items-center justify-between border-b border-black/25 py-3 pr-10">
      <div className="flex items-center gap-x-3">
        <img
          className="w-[70px] rounded-full"
          src={userData.profileImg}
          alt="profileImg"
        />
        <div>
          <h4 className="text-lg font-semibold">{userData.username}</h4>
          <p className="text-[10px] font-medium text-black/50">
            {userData.email}
          </p>
        </div>
      </div>
      {blockedData.blockedByMeId?.includes(userData.userId) ? (
        <button className="rounded-[5px] bg-primary-accent px-2 text-xl font-semibold text-white">
          User is blocked
        </button>
      ) : blockedData.blockedId?.includes(userData.userId) ? (
        <button className="rounded-[5px] bg-primary-accent px-2 text-xl font-semibold text-white">
          You are blocked
        </button>
      ) : friendsData.includes(currentUserData.uid + userData.userId) ||
        friendsData.includes(userData.userId + currentUserData.uid) ? (
        <button className="rounded-[5px] bg-primary-accent px-2 text-xl font-semibold text-white">
          Friend
        </button>
      ) : friendRequestsdata.includes(currentUserData.uid + userData.userId) ||
        friendRequestsdata.includes(userData.userId + currentUserData.uid) ? (
        <button className="rounded-[5px] bg-primary-accent px-2 text-xl font-semibold text-white">
          Pending
        </button>
      ) : (
        <button
          onClick={handleAddFriend}
          className="rounded-[5px] bg-primary-accent px-2 text-xl font-semibold text-white"
        >
          +
        </button>
      )}
    </div>
  );
}
