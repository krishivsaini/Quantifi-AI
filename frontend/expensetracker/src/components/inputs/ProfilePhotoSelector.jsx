import React, { useRef, useState } from 'react'
import { LuUser, LuUpload, LuTrash, LuCamera } from "react-icons/lu";

const ProfilePhotoSelector = ({ image, setImage }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />
      
      <div className="relative group">
        {!image ? (
          <div className='w-24 h-24 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary-light/20 rounded-2xl border-2 border-dashed border-primary/30 transition-all duration-300 group-hover:border-primary group-hover:bg-primary/10'>
            <LuUser className='text-4xl text-primary/60 group-hover:text-primary transition-colors' />
          </div>
        ) : (
          <img
            src={previewUrl}
            alt="Profile Preview"
            className="w-24 h-24 rounded-2xl object-cover ring-4 ring-primary/20 shadow-lg"
          />
        )}
        
        {/* Action Button */}
        <button
          type="button"
          className={`w-9 h-9 flex items-center justify-center rounded-xl absolute -bottom-2 -right-2 shadow-lg transition-all duration-300 ${
            image 
              ? 'bg-danger text-white hover:bg-danger-light' 
              : 'bg-gradient-to-r from-primary to-primary-light text-white hover:shadow-primary/30'
          }`}
          onClick={image ? handleRemoveImage : onChooseFile}
        >
          {image ? <LuTrash size={16} /> : <LuCamera size={16} />}
        </button>
      </div>
      
      <p className='text-xs text-text-tertiary'>
        {image ? 'Click trash to remove' : 'Add profile photo'}
      </p>
    </div>
  );
}

export default ProfilePhotoSelector