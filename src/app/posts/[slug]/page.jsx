/* eslint-disable @next/next/no-async-client-component */
// /* eslint-disable @next/next/no-async-client-component */
// "use client";

// import Menu from "@/components/Menu/Menu";
// import styles from "./singlePage.module.css";
// import Image from "next/image";
// import Comments from "@/components/comments/Comments";

// import { useRouter } from "next/navigation"; // for redirecting after delete
// import Link from "next/link";
// import { toast } from "react-hot-toast"; // 


// const SinglePage = async ({ params }) => {
//   const router = useRouter();
//   const { slug } = params;

//   const getData = async () => {
//     const res = await fetch(`http://localhost:3000/api/posts/${slug}`, {
//       cache: "no-store",
//     });

//     if (!res.ok) {
//       throw new Error("Failed")
//     }
//     return res.json();
//   }

//   const handleDelete = async () => {
//     const confirmed = confirm("Are you sure you want to delete this post?");
//     if (!confirmed) return;

//     try {
//       const res = await fetch(`/api/posts/${slug}`, {
//         method: "DELETE",
//       });

//       if (res.ok) {
//         toast.success("Post deleted successfully!");
//         router.push("/blog"); // redirect to blog listing or homepage
//       } else {
//         toast.error("Failed to delete post.");
//       }
//     } catch (err) {
//       toast.error("Error deleting post.");
//       console.error(err);
//     }
//   };



//   console.log(params, "parsms-----------------------//--------------");
//   // Dummy post data

//   const data = await getData();

//   return (
//     <> 
//     <div className={styles.container}>
//       <div className={styles.infoContainer}>
//         <div className={styles.textContainer}>
//           <h1 className={styles.title}>{data?.title}</h1>
//           <div className={styles.user}>
//             {data?.user?.image && (
//               <div className={styles.userImageContainer}>
//                 <Image
//                   src={data.user.image}
//                   alt="User"
//                   fill
//                   className={styles.avatar}
//                 />
//               </div>
//             )}
//             <div className={styles.userTextContainer}>
//               <span className={styles.username}>{data?.user.name}</span>
//               <span className={styles.date}>01.01.2024</span>
//             </div>
//           </div>
//         </div>
//         {data?.img && (
//           <div className={styles.imageContainer}>
//             <Image
//               src={data.img}
//               alt="Post"
//               fill
//               className={styles.image}
//             />
//           </div>
//         )}
//       </div>
//       <div className={styles.content}>
//         <div className={styles.post}>
//           <div
//             className={styles.description}
//             dangerouslySetInnerHTML={{ __html: data?.desc }}
//           />
//           <div className={styles.comment}>
//             <Comments postSlug={slug} />
//           </div>
//         </div>
//         <Menu />
//       </div>
//     </div>
//      {/* <div className={styles.actions}>
//         <Link href={`/blog/edit/${slug}`} className={styles.editBtn}> Edit</Link>
//         <button onClick={handleDelete} className={styles.deleteBtn}>Delete</button>
//       </div> */}
//     </>
//   );
// };

// export default SinglePage;


/* eslint-disable @next/next/no-async-client-component */
"use client";

import Menu from "@/components/Menu/Menu";
import styles from "./singlePage.module.css";
import Image from "next/image";
import Comments from "@/components/comments/Comments";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";

const SinglePage = ({ params }) => {
  const router = useRouter();
  const { slug } = params;
  const [data, setData] = useState(null);

  const getData = async () => {
    try {
      const res = await fetch(`/api/posts/${slug}`, {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to fetch post");
      const post = await res.json();
      setData(post);
    } catch (error) {
      console.error("Error loading post:", error);
      toast.error("Could not load post");
    }
  };

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this post?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/posts/${slug}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Post deleted successfully!");
        router.push("/blog");
      } else {
        toast.error("Failed to delete post.");
      }
    } catch (err) {
      toast.error("Error deleting post.");
      console.error(err);
    }
  };

  useEffect(() => {
    getData();
  }, [slug]);

  if (!data) return <p className="p-8">Loading...</p>;

  return (
    <>
      <div className={styles.container}>
        <div className={styles.infoContainer}>
          <div className={styles.textContainer}>
            <h1 className={styles.title}>{data?.title}</h1>
            <div className={styles.user}>
              {data?.user?.image && (
                <div className={styles.userImageContainer}>
                  <Image
                    src={data.user.image}
                    alt="User"
                    fill
                    className={styles.avatar}
                    l
                  />
                </div>
              )}
              <div className={styles.userTextContainer}>
                <span className={styles.username}>{data?.user?.name}</span>
                <span className={styles.date}>01.01.2024</span>
              </div>
            </div>
          </div>
          {data?.img && (
            <div className={styles.imageContainer}>
              <Image
                src={data.img}
                alt="Post"
                fill
                className={styles.image}
                loading="lazy"
              />
            </div>
          )}
        </div>
        <div className={styles.content}>
          <div className={styles.post}>
            <div
              className={styles.description}
              dangerouslySetInnerHTML={{ __html: data?.desc }}
            />
            <div className={styles.comment}>
              <Comments postSlug={slug} />
            </div>
          </div>
          <Menu />
        </div>
      </div>

      <div className={styles.actions}>
        <Link href={`/blog/edit/${slug}`} className={styles.editBtn}>
          Edit
        </Link>
        <button onClick={handleDelete} className={styles.deleteBtn}>
          Delete
        </button>
      </div>
    </>
  );
};

export default SinglePage;
