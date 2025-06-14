"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { supabase } from "@/utils/supabaseClient";
import styles from '../write/writePage.module.css';
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function EditPage() {
    /* ------------ auth & routing ------------ */
    const { status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const postId = searchParams.get("id");

    //   console.log(postId , "parameters data ---------------------------//-------------")
    /* ------------ state ------------ */
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [catSlug, setCatSlug] = useState("");
    const [media, setMedia] = useState("");
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");

    /* ------------ helpers ------------ */
    const slugify = (str) =>
        str
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_-]+/g, "-")
            .replace(/^-+|-+$/g, "");

    const modules = {
        toolbar: [
            [{ font: [] }, { size: ["small", false, "large", "huge"] }],
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["blockquote", "code-block"],
            ["clean"],
        ],
    };
    const formats = [
        "font", "size",
        "header",
        "bold", "italic", "underline", "strike",
        "list", "bullet",
        "blockquote", "code-block",
    ];

    /* ------------ image upload ------------ */
    async function uploadToSupabase(file) {
        const fileName = `${Date.now()}_${file.name}`;
        const { error } = await supabase.storage
            .from("images")
            .upload(fileName, file);
        if (error) throw new Error(error.message);

        const { data } = supabase.storage.from("images").getPublicUrl(fileName);
        return data.publicUrl;
    }

    /* ------------ fetch post on load ------------ */
    useEffect(() => {
        if (!postId) return;

        async function fetchPost() {
            try {
                const res = await fetch(`/api/posts/${postId}`);
                if (!res.ok) throw new Error("Post not found");
                const post = await res.json();
                console.log(post, "post data --------------------------//---------------------")
                setTitle(post.title);
                setContent(post.desc);      // assuming `desc` holds HTML
                setCatSlug(post.catSlug);
                setMedia(post.img || "");
                setPreview(post.img || "");
            } catch (err) {
                console.error(err);
                router.push("/user");       // back to dashboard if bad id
            } finally {
                setLoading(false);
            }
        }

        fetchPost();
    }, [postId, router]);

    /* ------------ form handlers ------------ */
    async function handleImageChange(e) {
        const f = e.target.files[0];
        if (!f) return;
        if (!f.type.startsWith("image/") || f.size > 5 * 1024 * 1024) {
            alert("Select an image < 5 MB");
            return;
        }
        setFile(f);
        setPreview(URL.createObjectURL(f));
    }

    async function handleUpdate() {
        if (!title.trim() || !content.trim()) {
            alert("Title and content required");
            return;
        }

        try {
            setSaving(true);

            /* upload new image if a new file is selected */
            let imgUrl = media;
            if (file) imgUrl = await uploadToSupabase(file);

            const res = await fetch(`/api/posts/${postId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    desc: content,
                    img: imgUrl,
                    slug: slugify(title),   // you may keep old slug if you prefer
                    catSlug: catSlug || "style",
                }),
            });

            if (!res.ok) throw new Error("Failed to update");

            const data = await res.json();
            console.log(data, "all data -----------------==================");
            router.push(`/posts/${data.id}`);

        } catch (err) {
            console.error(err);
            alert("Update failed");
        } finally {
            setSaving(false);
        }
    }

    /* ------------ guards ------------ */
    if (status === "loading" || loading) return <p className={styles.loading}>Loading…</p>;
    if (status === "unauthenticated") router.push("/");

    /* ------------ render ------------ */
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Edit Post</h1>
                <button
                    disabled={saving}
                    onClick={handleUpdate}
                    className={`${styles.saveBtn} ${(!title.trim() || !content.trim()) && styles.disabled}`}
                >
                    {saving ? "Saving…" : "Save Changes"}
                </button>
            </div>

            <div className={styles.form}>
                <input
                    className={styles.input}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Post title…"
                />

                <div className={styles.metaRow}>
                    <select
                        className={styles.select}
                        value={catSlug}
                        onChange={(e) => setCatSlug(e.target.value)}
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

                    <label className={styles.mediaBtn}>
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleImageChange}
                        />
                        Change Featured Image
                    </label>
                </div>

                {preview && (
                    <div className={styles.preview}>
                        <Image src={preview} alt="preview" width={600} height={300} />
                    </div>
                )}

                <ReactQuill
                    value={content}
                    onChange={setContent}
                    modules={modules}
                    formats={formats}
                    placeholder="Edit your content…"
                />
            </div>
        </div>
    );
}
