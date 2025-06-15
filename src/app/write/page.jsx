"use client";

import Image from "next/image";
import styles from "./writePage.module.css";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { supabase } from "@/utils/supabaseClient";
import dynamic from "next/dynamic";

// Import Quill CSS
import 'react-quill/dist/quill.snow.css';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });


const WritePage = () => {

  const { status } = useSession();
  const router = useRouter();
  const quillRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [media, setMedia] = useState("");
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [preview, setPreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [content, setContent] = useState('');
  // Upload image directly to Supabase

  console.log(content, "contnet");
  console.log(title, "title-------------------//-----------------");
  const uploadImageToSupabase = async (file) => {
    try {
      setIsUploading(true);
      const fileName = `${Date.now()}_${file.name}`;

      const { data, error } = await supabase.storage
        .from("images")
        .upload(fileName, file);

      if (error) {
        console.error("Upload failed:", error.message);
        return null;
      }

      const { data: urlData } = supabase.storage
        .from("images")
        .getPublicUrl(fileName);

      setIsUploading(false);
      return urlData.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      setIsUploading(false);
      return null;
    }
  };

  // Professional ReactQuill modules configuration
  const modules = {
    toolbar: [
      [{ font: [] }, { size: ['small', false, 'large', 'huge'] }],
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
          [{ color: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote', 'code-block'],
      ['clean'],
    ],
  };

  const formats = [
    'font', 'size',
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color',
    'list', 'bullet',
    'blockquote', 'code-block',
  ];

  useEffect(() => {
    const upload = async () => {
      setIsUploading(true);
      const fileName = `${Date.now()}_${file.name}`;

      try {
        const { data, error } = await supabase.storage
          .from("images")
          .upload(fileName, file);

        if (error) {
          console.error("Upload failed:", error.message);
          return;
        }

        const { data: urlData } = supabase.storage
          .from("images")
          .getPublicUrl(fileName);

        setMedia(urlData.publicUrl);
        setIsUploading(false);
      } catch (error) {
        console.error("Error uploading:", error);
        setIsUploading(false);
      }
    };

    if (file) upload();
  }, [file]);

  if (status === "loading") {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (status === "unauthenticated") {
    router.push("/");
  }

  const slugify = (str) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }

    if (!content.trim()) {
      alert("Please enter some content");
      return;
    }

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          desc: content, // This will contain HTML with all formatting
          img: media,
          slug: slugify(title),
          catSlug: catSlug || "style",
        }),
      });

      console.log(res , "response=------------------------//-------------")

      if (res.status === 200) {
        const data = await res.json();
        console.log(data , "data------------------------------")
        router.push(`/posts/${data.id}`);
      } else {
        alert("Failed to publish post");
      }
    } catch (error) {
      console.error("Error publishing post:", error);
      alert("An error occurred while publishing");
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCatSlug(e.target.value);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }

      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleEditorChange = (content) => {
    setValue(content);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Create New Post</h1>
        <button
          className={`${styles.publish} ${(!title.trim() || !content.trim()) ? styles.disabled : ''}`}
          onClick={handleSubmit}
          disabled={!title.trim() || !content.trim() || isUploading}
        >
          {isUploading ? 'Uploading...' : 'Publish'}
        </button>
      </div>

      <div className={styles.form}>
        <input
          type="text"
          placeholder="Enter your post title..."
          className={styles.input}
          value={title}
          onChange={handleTitleChange}
        />

        <div className={styles.metaInfo}>
          <select
            className={styles.select}
            value={catSlug}
            onChange={handleCategoryChange}
          >
            <option value="">Select Category</option>
            <option value="style">Style</option>
            <option value="fashion">Fashion</option>
            <option value="food">Food</option>
            <option value="culture">Culture</option>
            <option value="travel">Travel</option>
            <option value="coding">Coding</option>
            <option value="technology">Technology</option>
            <option value="lifestyle">Lifestyle</option>
          </select>

          <div className={styles.mediaSection}>
            <button
              className={styles.mediaButton}
              onClick={() => setOpen(!open)}
              disabled={isUploading}
            >
              <Image src="/plus.png" alt="Add media" width={16} height={16} />
              Add Featured Image
            </button>
          </div>
        </div>

        {open && (
          <div className={styles.add}>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <div className={styles.mediaOptions}>
              <button className={styles.addButton} disabled={isUploading}>
                <label htmlFor="image" className={styles.mediaLabel}>
                  <Image src="/image.png" alt="Image" width={20} height={20} />
                  <span>Upload Image</span>
                </label>
              </button>
            </div>
          </div>
        )}

        {isUploading && (
          <div className={styles.uploadProgress}>
            <div className={styles.progressBar}>
              <div className={styles.progressFill}></div>
            </div>
            <span>Uploading...</span>
          </div>
        )}

        {preview && (
          <div className={styles.preview}>
            <div className={styles.previewHeader}>
              <h3>Featured Image Preview</h3>
              <button
                className={styles.removePreview}
                onClick={() => {
                  setPreview("");
                  setFile(null);
                  setMedia("");
                }}
              >
                ×
              </button>
            </div>
            <Image
              src={preview}
              alt="Preview"
              width={600}
              height={300}
              className={styles.image}
              style={{ objectFit: 'cover' }}
            />
          </div>
        )}

        <div className={styles.editor}>
          <div className={styles.editorHeader}>
            <h3>Content</h3>
            <span className={styles.editorHint}>
              Use the toolbar below to format your text professionally
            </span>
          </div>

          <ReactQuill
            className="textArea"
            value={content}
            onChange={setContent}
            modules={modules}
            formats={formats}
            placeholder="Write your article here..."
          />

          <div className={styles.wordCount}>
            Words: {content.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WritePage;