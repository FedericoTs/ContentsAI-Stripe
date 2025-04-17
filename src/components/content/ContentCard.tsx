import React from "react";
import ArticleCard from "./ArticleCard";
import ExternalContentCard from "./ExternalContentCard";

interface ContentCardProps {
  item: any;
  onSelect: (item: any) => void;
  onSave: (item: any, isSaved: boolean) => void;
  isSelected?: boolean;
}

const ContentCard: React.FC<ContentCardProps> = ({
  item,
  onSelect,
  onSave,
  isSelected = false,
}) => {
  // Determine if this is external content based on source_type property
  const isExternalContent = Boolean(item.source_type);

  // Render the appropriate card component based on content type
  if (isExternalContent) {
    return (
      <ExternalContentCard
        content={item}
        onSelect={onSelect}
        onSave={onSave}
        isSelected={isSelected}
      />
    );
  }

  // Default to ArticleCard for RSS content
  return (
    <ArticleCard
      article={item}
      onSelect={onSelect}
      onSave={onSave}
      isSelected={isSelected}
    />
  );
};

export default ContentCard;
