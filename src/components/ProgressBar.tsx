type ProgressBarProps = {
  total: number;
  completed: number;
};

export default function ProgressBar({ total, completed }: ProgressBarProps) {
  const completedPercentage = (completed / total) * 100;
  return (
    <div className="relative ml-auto h-4 w-full rounded-sm bg-zinc-500">
      <div
        className="absolute left-0 h-full rounded-sm bg-[#29D]"
        style={{ width: `${completedPercentage}%` }}
      ></div>
    </div>
  );
}
