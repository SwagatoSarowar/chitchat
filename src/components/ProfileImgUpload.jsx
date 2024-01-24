import {
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from "firebase/storage";
import { useState, createRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { ToastContainer, Zoom, toast } from "react-toastify";
import { getAuth, updateProfile } from "firebase/auth";
import { update, ref as databaseref, getDatabase } from "firebase/database";

function ProfileImgUpload({ onShowImgPopup }) {
  const auth = getAuth();
  const db = getDatabase();

  const [image, setImage] = useState();
  const cropperRef = createRef();

  const storage = getStorage();
  const storageRef = ref(storage, auth.currentUser.uid);

  const handleChange = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const getCropData = () => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      const message = cropperRef.current?.cropper
        .getCroppedCanvas()
        .toDataURL();
      uploadString(storageRef, message, "data_url").then(() => {
        getDownloadURL(storageRef).then((downloadURL) => {
          updateProfile(auth.currentUser, {
            photoURL: downloadURL,
          }).then(() => {
            update(databaseref(db, "users/" + auth.currentUser.uid), {
              profileImg: downloadURL,
            });
          });
        });
        setTimeout(() => onShowImgPopup(false), 3500);
        toast.success("Image uploaded successfully");
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-900/40 backdrop-blur-md">
      <ToastContainer
        position="top-center"
        autoClose={2500}
        transition={Zoom}
      />
      <form
        className="flex max-w-[800px] flex-col rounded-xl bg-slate-100 p-24 shadow-2xl sm:w-auto"
        noValidate
      >
        <h1 className="mb-8 text-[32px] font-semibold text-primary-color-400">
          Upload Image
        </h1>
        <div className="mx-auto mb-4 w-[100px] overflow-hidden rounded-full">
          {image && (
            <div
              className="img-preview"
              style={{ width: "100%", height: "100px" }}
            />
          )}
        </div>

        {image && (
          <Cropper
            ref={cropperRef}
            style={{ height: 300, width: "100%" }}
            zoomTo={0.5}
            initialAspectRatio={1}
            aspectRatio={1}
            preview=".img-preview"
            src={image}
            viewMode={1}
            minCropBoxHeight={10}
            minCropBoxWidth={10}
            background={false}
            responsive={true}
            autoCropArea={1}
            checkOrientation={false}
            guides={true}
          />
        )}
        <input
          className="rounded-[8.6px] border-2 border-blue-800/40 px-[27px] py-[20px] text-[20.641px] font-semibold text-primary-color-400"
          type="file"
          onChange={handleChange}
        />

        <div className="mx-auto mt-16 flex flex-col gap-3 text-lg font-semibold sm:flex-row">
          <button
            className="rounded-lg bg-primary-accent p-4 text-white duration-200 hover:bg-blue-800"
            type="button"
            onClick={getCropData}
          >
            Upload Image
          </button>
          <button
            className="rounded-lg bg-red-500 p-4 text-white duration-200 hover:bg-red-800"
            type="button"
            onClick={() => onShowImgPopup(false)}
          >
            Back to Home Page
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProfileImgUpload;
