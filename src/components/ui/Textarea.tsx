import React, { forwardRef }  from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

const CustomTextarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className = '', ...props }) => {
  return (
    <textarea
      className={`w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all ${className}`}
      {...props}
    />
  );
});

export default CustomTextarea
