import React from "react";
import styles from "./footer.module.css";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
   <div className={styles.container}>
  <div className={styles.topSection}>
    <div className={styles.info}>
      <div className={styles.logo}>
        {/* <Image src="/pugarch-logo.png" alt="PugArch Logo" width={50} height={50} /> */}
        <h1 className={styles.logoText}>PugArch Blog</h1>
      </div>
      {/* <p className={styles.desc}>
        Headquartered in Nagpur, we offer technology solutions across India—focused on innovation, integrity, and impact.
      </p> */}
      <div className={styles.icons}>
        <Link href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
          <Image src="/linkIdin.png" alt="LinkedIn" width={18} height={18} />
        </Link>
        <Link href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
          <Image src="/instagram.png" alt="Instagram" width={18} height={18} />
        </Link>
      </div>
    </div>

    <div className={styles.links}>
      <div className={styles.list}>
        <span className={styles.listTitle}>Quick Links</span>
        <Link href="/">Home</Link>
        <Link href="/about">About Us</Link>
        <Link href="/write">Write</Link>
        {/* <Link href="/services">Services</Link> */}
        <Link href="/contact">Contact Us</Link>
      </div>

      <div className={styles.list}>
        <span className={styles.listTitle}>Get in Touch</span>
        <p><strong>Head Office:</strong><br />Nagpur, Maharashtra</p>
        <p><strong>Branch Office:</strong><br />Kandivali(W), Mumbai-400067</p>
        <p><strong>Email:</strong> info@pugarch.in</p>
        <p><strong>Call:</strong> 7887858594</p>
      </div>

      <div className={styles.list}>
        <span className={styles.listTitle}>Follow Us</span>
        <Link href="https://www.linkedin.com">LinkedIn</Link>
        <Link href="https://www.instagram.com">Instagram</Link>
      </div>
    </div>
  </div>
</div>
  );
};

export default Footer;
