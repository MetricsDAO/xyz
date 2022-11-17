export function Progress({ progress }: { progress: number }) {
  return (
    <div className="w-full bg-[#EDEDED] h-2.5 rounded-md ">
      <label className="sr-only">Progess bar with {progress} percent</label>
      <div
        style={{
          width: `${progress}%`,
        }}
        className="w-full rounded-md h-2.5 bg-[#16ABDDCC] "
      />
    </div>
  );
}
