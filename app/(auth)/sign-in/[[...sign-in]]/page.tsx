import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="border-t border-[#2c2c2c] flex justify-center items-center h-screen bg-[#212121]">
      <SignIn />
    </div>
  );
}
