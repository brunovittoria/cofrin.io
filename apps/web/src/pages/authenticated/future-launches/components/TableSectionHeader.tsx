interface TableSectionHeaderProps {
  title: string;
  description: string;
}

export const TableSectionHeader = ({
  title,
  description,
}: TableSectionHeaderProps) => {
  return (
    <div className="flex flex-col gap-1 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h2 className="text-lg font-semibold text-[#0F172A]">{title}</h2>
        <p className="text-sm text-[#6B7280]">{description}</p>
      </div>
    </div>
  );
};
