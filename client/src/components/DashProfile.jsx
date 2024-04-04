import { useSelector } from "react-redux";
import { Alert, Button, Label, TextInput } from "flowbite-react";
import { useState, useRef, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUpLoadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const filePickerRef = useRef();
  console.log(imageFileUpLoadProgress, imageFileUploadError);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);
  const uploadImage = async () => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const upLoadTask = uploadBytesResumable(storageRef, imageFile);
    upLoadTask.on(
      "state_changed",
      (snapShot) => {
        const progress =
          (snapShot.bytesTransferred / snapShot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "could not upload image (File must be less than 2MB)"
        );
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploadProgress(null);
      }
    ),
      () => {
        getDownloadURL(upLoadTask.snapshot.ref).then((downloadUrl) => {
          setImageFileUrl(downloadUrl);
        });
      };
  };
  return (
    <div className="w-full p-4 mb-5 max-w-xl mx-auto">
      <h1 className="text-center my-6 font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className="relative self self-center w-32 h-32 cursor-pointer shadow-md rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUpLoadProgress && (
            <CircularProgressbar
              className=" absolute w-full h-full"
              strokeWidth="4"
              styles={buildStyles({
                pathColor: "#00bcfc",
              })}
              value={imageFileUpLoadProgress}
              maxValue={100}
              text={`${imageFileUpLoadProgress}%`}
            />
          )}
          <img
            className={`w-full h-full rounded-full border-8 border-[lightgray] ${
              imageFileUpLoadProgress &&
              imageFileUpLoadProgress < 100 &&
              "opacity-60"
            }`}
            src={imageFileUrl || currentUser.profilePicture}
            alt="userImg"
          />
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <div>
            {imageFileUploadError && (
              <Alert color="failure">{imageFileUploadError}</Alert>
            )}
          </div>
          <div>
            <div className="mb-1 block">
              <Label htmlFor="username" value="Your username" />
            </div>
            <TextInput
              id="username"
              type="text"
              placeholder="username"
              defaultValue={currentUser.username}
              required
            />
          </div>
          <div>
            <div className="mb-1 block">
              <Label htmlFor="email" value="Your email" />
            </div>
            <TextInput
              id="email"
              type="email"
              placeholder="email"
              defaultValue={currentUser.email}
              required
            />
          </div>
          <div>
            <div className="mb-1 block">
              <Label htmlFor="password" value="Your password" />
            </div>
            <TextInput
              id="password"
              type="password"
              placeholder="************"
              required
            />
          </div>
          <Button
            className="w-full mt-3"
            type="submit"
            gradientDuoTone="purpleToBlue"
            outline
          >
            Update
          </Button>
        </div>
      </form>
      <div className="mt-5 flex justify-between text-red-500">
        <span className="cursor-pointer">Delete Acount</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
}
