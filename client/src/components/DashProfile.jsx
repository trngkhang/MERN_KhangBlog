import { useSelector } from "react-redux";
import { Alert, Button, Label, TextInput, Modal } from "flowbite-react";
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
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteStart,
  deleteSuccess,
  deleteFailure,
  signoutSuccess,
} from "../redux/user/userSlice.js";
import { useDispatch } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashProfile() {
  const { currentUser, error } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUpLoadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [UpdateUserError, setUpdateUserError] = useState(null);
  const [UpdateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const filePickerRef = useRef();
  const dispatch = useDispatch();

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
    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read;
    //       allow write: if
    //       request.resource.size < 2 * 1024 * 1024 &&
    //       request.resource.contentType.matches('image/.*')
    //     }
    //   }
    // }
    setImageFileUploading(true);
    setImageFileUploadError(null);
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
        setImageFileUploading(false);
      },

      () => {
        getDownloadURL(upLoadTask.snapshot.ref).then((downloadUrl) => {
          setImageFileUrl(downloadUrl);
          setFormData({ ...formData, profilePicture: downloadUrl });
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setImageFileUploadError(null);
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (imageFileUploading) {
      setUpdateUserError("Please wait for image to upload");
      return;
    }
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No change made");
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile update successfully");
      }
    } catch (error) {
      dispatch(updateFailure(data.message));
      setUpdateUserError(data.message);
    }
  };
  const handleDeleteUser = async () => {
    setOpenModal(false);
    try {
      dispatch(deleteStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteFailure(data.message));
      } else {
        dispatch(deleteSuccess(data));
      }
    } catch (error) {
      dispatch(deleteFailure(error.message));
    }
  };
  const handleSignout = async () => {
    try {
      const res = await fetch("/api/auth/signout", {
        method: "POST",
      });
      const data = res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="w-full p-4 mb-5 max-w-xl mx-auto">
      <h1 className="text-center my-6 font-semibold text-3xl">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col">
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
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
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
        <span
          onClick={() => {
            setOpenModal(true);
          }}
          className="cursor-pointer"
        >
          Delete Acount
        </span>
        <span onClick={handleSignout} className="cursor-pointer">
          Sign Out
        </span>
      </div>
      {UpdateUserError && (
        <Alert className="mt-5" color="failure">
          {UpdateUserError}
        </Alert>
      )}
      {UpdateUserSuccess && (
        <Alert className="mt-5" color="success">
          {UpdateUserSuccess}
        </Alert>
      )}
      {error && (
        <Alert color="failure" className="mt-5">
          {error}
        </Alert>
      )}
      <Modal
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => handleDeleteUser()}>
                "Yes, I'm sure"
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
