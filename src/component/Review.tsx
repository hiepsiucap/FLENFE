/** @format */

export default function Review({ max, value }: { max: number; value: number }) {
  const TailwindProgress = ({ value, max }: { value: number; max: number }) => {
    // Tính toán phần trăm
    const percentage = (value / max) * 100;

    return (
      <div className="md:w-2/3 w-full  bg-gray-200 rounded-full h-1.5">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };
  return (
    <div className=" w-full flex pr-2 md:pr-0 justify-center items-center space-x-2">
      <TailwindProgress
        value={value}
        max={max}
      />
      <div>
        {value}/{max}
      </div>
    </div>
  );
}
