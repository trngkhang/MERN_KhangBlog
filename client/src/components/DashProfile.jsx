import { useSelector } from "react-redux";
import { Button, Label, TextInput } from "flowbite-react";

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="w-full p-4 mb-5">
      <h1 className="text-center my-6 font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col">
        <div className="self self-center w-32 h-32 cursor-pointer shadow-md rounded-full">
          <img
            className="w-full h-full rounded-full border-8 border-[lightgray]"
            src={currentUser.profilePicture}
            alt="userImg"
          />
        </div>
        <div className="mt-4 flex flex-col gap-2">
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
