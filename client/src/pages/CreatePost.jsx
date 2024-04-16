import { Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function CreatePost() {
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
          <FileInput type="file" accept="image/*" />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
          >
            Upload image
          </Button>
        </div>
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
