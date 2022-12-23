import toast, { Toaster } from "react-hot-toast";

const notify = (heading, content) => toast.custom((t)=>(
    <div
      className={`w-96 bg-primary px-4 py-6 text-white shadow-2xl hover:shadow-none transform-gpu translate-y-0 hover:translate-y-1 rounded-xl relative transition-all duration-500 ease-in-out ${t.visible ? "top-0" : "-top-96"}`}>
      <div className="flex flex-wrap flex-col items-start justify-center ml-4 cursor-default">
        <h1 className='text-base text-white font-semibold leading-none tracking-wider'>{heading}</h1>
        <p className='text-sm text-white mt-2 leading-relaxed tracking-wider break-all'>
          {content}
        </p>
      </div>
    </div>
  ),
  { id: "unique-notification", position: "top-left" }
)
export default notify;