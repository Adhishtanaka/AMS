import React from 'react';

interface CategoryCardProps {
  img: string;
  title: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ img, title }) => {
  return (
    <div className="bg-gray-100 w-72 rounded-sm overflow-hidden duration-300">
      <img
        src={img}
        alt={title}
        className="w-full h-40 object-cover rounded-sm"
      />
      <h3 className="text-lg font-semibold text-center mt-4 mb-2">{title}</h3>
    </div>
  );
};

export default CategoryCard;
