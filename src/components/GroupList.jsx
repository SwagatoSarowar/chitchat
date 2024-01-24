import placeholderImg from "../assets/placeholder-img.png";
import { useEffect, useState } from "react";
import { getDatabase, onValue, push, ref } from "firebase/database";
import { useSelector } from "react-redux";

function GroupList({ className }) {
  const db = getDatabase();
  const currentUserData = useSelector(
    (state) => state.userLoginInfo.userLoginInfo,
  );

  const [groupList, setGroupList] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    onValue(ref(db, "groups/"), (snapshot) => {
      const groupArr = [];
      snapshot.forEach((item) => {
        item.val().groupCreatorId !== currentUserData.uid &&
          groupArr.push(item.val());
      });
      setGroupList(groupArr);
    });
  }, []);

  return (
    <div className={className}>
      <div className="relative h-full pb-1 pl-5">
        <div className="absolute inset-x-5 flex items-center justify-between bg-white pt-3">
          <h3 className="text-xl font-semibold">Group List</h3>
          <button
            className=" rounded-[5px] bg-primary-accent px-4 py-1 text-xl font-semibold text-white"
            onClick={() => setShowModal(true)}
          >
            Create Group
          </button>
        </div>
        <div className="h-full overflow-y-scroll pt-10">
          <div className="h-full pr-3">
            {groupList.length ? (
              groupList.map((item, index) => <Group data={item} key={index} />)
            ) : (
              <h3 className="flex h-full items-center justify-center text-xl font-bold opacity-50">
                No groups are available
              </h3>
            )}
          </div>
        </div>
      </div>
      {showModal && (
        <CreateGroupModal
          db={db}
          currentUserData={currentUserData}
          onShowModal={setShowModal}
        />
      )}
    </div>
  );
}

export default GroupList;

function Group({ data }) {
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
    </div>
  );
}

function CreateGroupModal({ db, currentUserData, onShowModal }) {
  const [groupName, setGroupName] = useState("");
  const [groupTagline, setGroupTagline] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const submitReset = function () {
    setGroupName("");
    setGroupTagline("");
    setIsSubmitted(false);
  };

  const handleCreateGroup = function (e) {
    e.preventDefault();
    setIsSubmitted(true);
    if (!groupName || !groupTagline) return;
    submitReset();
    push(ref(db, "groups/"), {
      groupName,
      groupTagline,
      groupCreatorId: currentUserData.uid,
    }).then(() => onShowModal(false));
  };

  return (
    <div className="absolute left-0 top-0 z-50 h-screen w-screen bg-blue-900/40 backdrop-blur-md">
      <div className="absolute left-1/2 top-1/2 h-4/6 w-4/6 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-slate-100 shadow-2xl">
        <form
          className="mx-auto mt-20 flex w-1/2 flex-col gap-y-4 [&>*]:font-semibold [&>input]:rounded-2xl [&>input]:border [&>input]:px-8 [&>input]:py-5 [&>input]:text-2xl [&>input]:shadow-md [&>input]:transition-shadow [&>input]:duration-200 [&>label]:text-3xl [&>p]:h-4 [&>p]:text-lg [&>p]:text-red-500"
          onSubmit={handleCreateGroup}
        >
          <label>Group Name</label>
          <input
            className="focus-visible:shadow-xl focus-visible:outline-none"
            type="text"
            value={groupName}
            onChange={(e) => {
              setGroupName(e.target.value);
              setIsSubmitted(false);
            }}
          />

          <p>
            {isSubmitted && !groupName
              ? "Please give a name for the group"
              : null}
          </p>

          <label className="mt-10">Group Tagline</label>
          <input
            className="focus-visible:shadow-xl focus-visible:outline-none"
            type="text"
            value={groupTagline}
            onChange={(e) => {
              setGroupTagline(e.target.value);
              setIsSubmitted(false);
            }}
          />
          <p>
            {isSubmitted && !groupTagline
              ? "Please give a tagline for the group"
              : null}
          </p>

          <div className="mt-8 flex gap-x-6 self-center [&>button]:rounded-xl [&>button]:px-10 [&>button]:py-4 [&>button]:text-xl [&>button]:text-white">
            <button
              type="submit"
              className="bg-primary-accent duration-200 hover:bg-blue-800"
            >
              Create Group
            </button>
            <button
              type="button"
              onClick={() => onShowModal(false)}
              className="bg-red-500 duration-200 hover:bg-red-800"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
