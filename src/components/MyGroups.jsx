import { BsThreeDotsVertical } from "react-icons/bs";
import placeholderImg from "../assets/placeholder-img.png";
import { useEffect, useState } from "react";
import { getDatabase, onValue, ref, remove } from "firebase/database";
import { useSelector } from "react-redux";

function MyGroups() {
  const db = getDatabase();
  const currentUserData = useSelector(
    (state) => state.userLoginInfo.userLoginInfo,
  );

  const [myGroupsList, setMyGroupsList] = useState([]);

  useEffect(() => {
    onValue(ref(db, "groups/"), (snapshot) => {
      const myGroupsArr = [];
      snapshot.forEach((item) => {
        item.val().groupCreatorId === currentUserData.uid &&
          myGroupsArr.push({ ...item.val(), id: item.key });
      });
      setMyGroupsList(myGroupsArr);
    });
  }, []);
  return (
    <div className="relative overflow-hidden pb-1 pl-5">
      <div className="absolute inset-x-5 flex items-center justify-between bg-white pt-3">
        <h3 className="text-xl font-semibold">My Groups</h3>
        <BsThreeDotsVertical className="text-primary-accent" size={20} />
      </div>
      <div className="h-full overflow-y-scroll pt-10">
        <div className="h-full pr-3">
          {myGroupsList.length ? (
            myGroupsList.map((item, index) => (
              <MyGroup db={db} data={item} key={index} />
            ))
          ) : (
            <h3 className="flex h-full items-center justify-center text-xl font-bold opacity-50">
              You have no group
            </h3>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyGroups;

function MyGroup({ db, data }) {
  const handleDelete = function () {
    if (confirm("Your group will be deleted. Are you sure ?")) {
      remove(ref(db, "groups/" + data.id));
    }
  };
  return (
    <div className="flex items-center justify-between border-b border-black/25 py-3">
      <div className="flex items-center gap-x-3">
        <img
          className="w-[70px] rounded-full"
          src={placeholderImg}
          alt="profileImg"
        />
        <div>
          <h4 className="text-lg font-semibold">{data.groupName}</h4>
          <p className="text-sm font-medium text-slate-500">
            {data.groupTagline}
          </p>
        </div>
      </div>
      <button
        onClick={handleDelete}
        className="rounded-[5px] bg-red-600 px-4 py-1 text-xl font-semibold text-white"
      >
        Delete
      </button>
    </div>
  );
}
