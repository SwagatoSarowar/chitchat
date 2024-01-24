import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { userLoginInfo } from "../../slices/userSlice";
import GroupList from "../../components/GroupList";
import Friends from "../../components/Friends";
import UserList from "../../components/UserList";
import FriendRequests from "../../components/FriendRequests";
import MyGroups from "../../components/MyGroups";
import BlockedUsers from "../../components/BlockedUsers";

function Home() {
  const dispatch = useDispatch();
  const auth = getAuth();
  const userData = useSelector((state) => state.userLoginInfo.userLoginInfo);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/login");
  };

  useEffect(() => {
    !userData && navigate("/login");
  });

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setVerified(user.emailVerified);
      dispatch(() => userLoginInfo(user));
      localStorage.setItem("userLoginInfo", JSON.stringify(user));
    });
  }, []);

  const [varified, setVerified] = useState(false);
  return (
    <div className="font-poppins">
      {varified ? (
        <div className="flex gap-x-10">
          <Sidebar />
          <div className="flex grow flex-col justify-between pr-5">
            <div className="grid grid-cols-3 gap-x-5 [&>*]:h-[48vh] [&>*]:rounded-[20px] [&>*]:shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
              <GroupList />
              <Friends button="block" />
              <UserList />
            </div>
            <div className="grid grid-cols-3 gap-x-5 [&>*]:h-[48vh] [&>*]:rounded-[20px] [&>*]:shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
              <FriendRequests />
              <MyGroups />
              <BlockedUsers />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex min-h-screen items-center justify-center bg-blue-300">
          <div className="flex flex-col items-center">
            <h1 className="rounded-lg bg-white px-16 py-10 text-[36px] font-semibold text-primary-color-400 shadow-xl">
              Please verify your email
            </h1>
            <button
              onClick={handleClick}
              className="mt-5 rounded-lg bg-primary-accent px-8 py-4 text-2xl font-semibold text-white duration-200 hover:bg-blue-800"
            >
              Back to Log In Page
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
