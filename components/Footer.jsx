"use client";
import Link from "next/link";
import { scrollToSection } from "@/lib/scroll";

export default function Footer() {
  return (
    <footer>
      <div className="f-logo">
        Hydra<em>.</em>
      </div>
      <p>© {new Date().getFullYear()} Hydra Inc. All rights reserved.</p>
      <div className="f-links">
        <a onClick={() => scrollToSection("video-sec")}>Works</a>
        <a onClick={() => scrollToSection("services")}>Services</a>
        <a onClick={() => scrollToSection("contact")}>Contact</a>
        <Link href="/admin" className="admin-link">
          ADMIN
        </Link>
      </div>
    </footer>
  );
}
