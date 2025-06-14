// app/user/ClientDashboard.jsx
"use client";
import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import styles from "./user.module.css";

export default function ClientDashboard({ posts, userEmail }) {
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(null);

  async function handleLogout() {
    await signOut({ redirect: true, callbackUrl: "/" });
  }

  async function deletePost(slug) {
    console.log(slug, "slug------------------------//---------");
    const res = await fetch(`/api/posts/${encodeURIComponent(slug)}`, {
      method: "DELETE",
    });
    if (res.ok) window.location.reload();
    else console.error("Failed to delete post");
  }


  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Header Section */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Your Posts</h1>
            <p className={styles.subtitle}>Manage and organize your content</p>
          </div>
          <button
            onClick={() => startTransition(handleLogout)}
            disabled={isPending}
            className={styles.logoutButton}
          >
            <span className={styles.buttonContent}>
              {isPending ? (
                <>
                  <div className={styles.spinner}></div>
                  Logging out...
                </>
              ) : (
                <>
                  <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </>
              )}
            </span>
          </button>
        </header>

        {/* Empty State */}
        {posts.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className={styles.emptyTitle}>No posts yet</h3>
            <p className={styles.emptyDescription}>Start creating your first post to see it here!</p>
          </div>
        ) : (
          /* Posts Grid */
          Object.entries(
            posts.reduce((acc, post) => {
              acc[post.cat.title] = acc[post.cat.title] || [];
              acc[post.cat.title].push(post);
              return acc;
            }, {})
          ).map(([category, items]) => (
            <section key={category} className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{category}</h2>
                <div className={styles.sectionDivider}></div>
                <span className={styles.postCount}>
                  {items.length} {items.length === 1 ? 'post' : 'posts'}
                </span>
              </div>

              <div className={styles.postsGrid}>
                {items.map((post) => (
                  <article key={post.id} className={styles.postCard}>
                    {post.img && (
                      <Link href={`/posts/${post.id}`} passHref className={styles.imageLink}>

                        <div className={styles.imageContainer}>
                          <Image
                            src={post.img}
                            alt={post.title}
                            width={500}
                            height={300}
                            className={styles.postImage}
                          />
                          <div className={styles.imageOverlay}></div>

                        </div>
                      </Link>

                    )}

                    <div className={styles.postContent}>
                      <h3 className={styles.postTitle}>{post.title}</h3>

                      <div className={styles.buttonGroup}>
                        <Link
                          href={`/edit?id=${post.id}&title=${encodeURIComponent(post.title)}`}
                          className={styles.editButton}
                        >
                          <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span className={styles.buttonText}>Edit</span>
                        </Link>

                        <button
                          onClick={() => setConfirming(post.id)}
                          className={styles.deleteButton}
                        >
                          <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span className={styles.buttonText}>Delete</span>
                        </button>
                      </div>
                    </div>





                    {/* Confirmation Modal */}
                    {confirming === post.id && (
                      <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                          <div className={styles.modalIcon}>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                          </div>
                          <h4 className={styles.modalTitle}>Delete Post?</h4>
                          <p className={styles.modalDescription}>
                            This action cannot be undone. Your post will be permanently deleted.
                          </p>

                          <div className={styles.modalButtons}>
                            <button
                              onClick={() => setConfirming(null)}
                              className={styles.cancelButton}
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() =>
                                startTransition(async () => {
                                  await deletePost(post.id);
                                  setConfirming(null);
                                })
                              }
                              disabled={isPending}
                              className={styles.confirmButton}
                            >
                              {isPending ? (
                                <>
                                  <div className={styles.spinner}></div>
                                  Deleting...
                                </>
                              ) : (
                                'Delete'
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </main >
  );
}