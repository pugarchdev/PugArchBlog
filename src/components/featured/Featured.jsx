import React from "react";
import styles from "./featured.module.css";
import Image from "next/image";

const Featured = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <b> A space to think and feel.</b>
      </h1>
      <div className={styles.post}>
        <div className={styles.imgContainer}>
          <Image src="/p1.jpeg" alt="" fill className={styles.image} />
        </div>
        <div className={styles.textContainer}>
          <h1 className={styles.postTitle}>
            Welcome to a small corner of the internet made for curious minds.
          </h1>
          <p className={styles.postDesc}>
            Here, ideas unfold through quiet moments, bold thoughts, and stories
            that inspire reflection. Whether its travel, creativity, or
            everyday wonder — this space is crafted to explore and connect.
            Thanks for stopping by.
          </p>
          <h3 className=""> ➡️ Tap below to start reading.</h3>
          <button className={styles.button}>Read More</button>
        </div>
      </div>
    </div>
  );
};

export default Featured;
