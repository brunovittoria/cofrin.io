interface CardPreviewProps {
  imageUrl?: string;
  providerName?: string;
}

export const CardPreview = ({ imageUrl, providerName }: CardPreviewProps) => {
  return (
    <div className="flex justify-start md:justify-end md:pt-1">
      <div className="w-[132px] overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={providerName}
            className="aspect-[5/3] w-full object-contain p-2"
          />
        ) : (
          <div className="aspect-[5/3] w-full bg-[#EEF2FF]" />
        )}
      </div>
    </div>
  );
};

