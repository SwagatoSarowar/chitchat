import Sidebar from "../../components/Sidebar";
import MyGroups from "../../components/MyGroups";
import Friends from "../../components/Friends";
import MessageBox from "../../components/MessageBox";

export default function Messages() {
  return (
    <div className="flex gap-x-10 font-poppins ">
      <Sidebar />
      <div className="grid grow grid-cols-3 gap-x-8 first:h-[48vh]">
        <div className="flex flex-col justify-between [&>*]:h-[48vh] [&>*]:rounded-[20px] [&>*]:shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
          <MyGroups />
          <Friends button="message" />
        </div>
        <MessageBox />
      </div>
    </div>
  );
}
