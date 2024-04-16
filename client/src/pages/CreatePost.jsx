import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [imageFleUploadError, setImageFleUploadError] = useState(null);
  const [imageFleUploadProgress, setImageFleUploadEProgress] = useState(null);
  const [formData, setFormData] = useState({});

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageFleUploadError("Please select an image");
        return;
      }
      setImageFleUploadEProgress(null);
      setImageFleUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.fileName;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageFleUploadEProgress(progress.toFixed(0));
        },
        (error) => {
          setImageFleUploadError("Upload Image Failed");
          setImageFleUploadEProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            setFormData({ ...formData, image: downloadUrl });
            setImageFleUploadEProgress(null);
            setImageFleUploadError(null);
          });
        }
      );
    } catch (error) {
      setImageFleUploadError(error.message);
    }
  };
  return (
    <div className="min-h-screen max-w-3xl mx-auto p-3">
      <h1 className=" text-3xl font-semibold text-center py-7">
        Create a post
      </h1>

      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <TextInput
            type="text"
            placeholder="Title"
            id="title"
            required
            className="flex-1"
          />
          <Select>
            <option value="uncategorized">Select a caterory</option>
            <option value="javascript">Javascript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUploadImage}
            disabled={imageFleUploadProgress}
          >
            {imageFleUploadProgress ? (
              <CircularProgressbar
                value={imageFleUploadProgress}
                text={`${imageFleUploadProgress || 0}%`}
                className="w-16 h-16"
              />
            ) : (
              "Upload image"
            )}
          </Button>
        </div>
        {imageFleUploadError && (
          <Alert color="failure">{imageFleUploadError}</Alert>
        )}
        {formData.image && (
          <img
            src={formData.image}
            alt="uploadImg"
            className="w-full h-60 object-cover"
          />
        )}
        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          className="h-72 mb-12"
          required
        />
        <Button type="=submit" gradientDuoTone="purpleToPink">
          Publish
        </Button>
      </form>
    </div>
  );
}
