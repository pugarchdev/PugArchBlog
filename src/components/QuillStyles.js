// components/QuillStyles.js
"use client";

import { useEffect } from 'react';

const QuillStyles = () => {
  useEffect(() => {
    // Dynamically import Quill CSS to avoid SSR issues
    import('react-quill/dist/quill.snow.css');
  }, []);

  return null;
};

export default QuillStyles;