export function Progress({ progress }: { progress: number }) {
  return (
    <div className="w-full bg-gray-100 h-2 ">
      <label className="sr-only">Progess bar with {progress} percent</label>
      <div style={{ width: `${progress}%` }} className="w-full h-full bg-[#16ABDDCC] " />
    </div>
  );
}
