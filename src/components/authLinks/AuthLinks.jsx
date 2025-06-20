"use client";
import Link from "next/link";
import styles from "./authLinks.module.css";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";

const AuthLinks = () => {
  const [open, setOpen] = useState(false);

  const { status, data } = useSession();
  // const user = useSession();

  console.log(status, data, "status");

  return (
    <>
      {status === "unauthenticated" ? (
        <Link href="/login" className={styles.link}>
          Login
        </Link>
      ) : (
        <>
          <Link href="/write" className={styles.link}>
            Write
          </Link>
          <span className={styles.link} onClick={signOut}>
            Logout
          </span>

          <Link href='/user'>
            <img src={data?.user?.image} alt="user_image" className={styles.user_image} />
          </Link>
        </>
      )}
      <div className={styles.burger} onClick={() => setOpen(!open)}>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
      </div>
    {open && (
        <div className={styles.responsiveMenu}>
          <Link href="/" onClick={() => setOpen(false)}>
            About
          </Link>
          <Link href="/" onClick={() => setOpen(false)}>
            Contact
          </Link>
          {status === "unauthenticated" ? (
            <Link href="/login" onClick={() => setOpen(false)}>
              Login
            </Link>
          ) : (
            <>
              <Link href="/write" onClick={() => setOpen(false)}>
                Write
              </Link>
              <span
                className={styles.link}
                onClick={() => {
                  signOut();
                  setOpen(false);
                }}
              >
                Logout
              </span>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AuthLinks;
