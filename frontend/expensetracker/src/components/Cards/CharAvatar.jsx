import React from 'react'

const CharAvatar = ({ fullName, width = "w-12", height = "h-12", style = "text-lg" }) => {
  // Get initials from full name
  const getInitials = (name) => {
    if (!name) return "?";
    const names = name.trim().split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Generate a consistent color based on the name
  const getColorClass = (name) => {
    const colors = [
      'from-violet-500 to-purple-600',
      'from-blue-500 to-cyan-500',
      'from-emerald-500 to-teal-500',
      'from-orange-500 to-amber-500',
      'from-pink-500 to-rose-500',
      'from-indigo-500 to-blue-500',
    ];
    
    if (!name) return colors[0];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div 
      className={`${width} ${height} rounded-xl bg-gradient-to-br ${getColorClass(fullName)} 
                  flex items-center justify-center shadow-lg ring-2 ring-white`}
    >
      <span className={`${style} font-bold text-white`}>
        {getInitials(fullName)}
      </span>
    </div>
  )
}

export default CharAvatar