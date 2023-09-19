export default function SkeletonLoading() {
  return (
    <div className="h-full w-full max-w--[26rem] shadow-lg mb-10 mr-5">
      <div className="animate-plus h-60 w-96 bg-gray-200 rounded-md"></div>
      <div className="flex items-center justify-between mt-3">
        <div className="bg-gray-200 h-6 w-96 mt-10 rounded-md"></div>
      </div>
    </div>
  );
}
