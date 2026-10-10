import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { T } from "@/components/bilingual";
import { LangToggle } from "@/components/lang-toggle";
import { SiteHeader } from "@/components/site-header";
import { blogPosts } from "@/data/blog";

export const metadata: Metadata = {
  title: "Blog · Yuhang Chen",
  description: "Notes and personal explorations by Yuhang Chen, in English and Chinese.",
};

export default function BlogIndex() {
  return (
    <div className="site-page">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <SiteHeader />
      <main id="main-content" className="site-shell">
        <div className="blog-shell">
          <div className="blog-index-head">
            <div className="section-heading">
              <p className="section-kicker">Blog</p>
              <h1 className="section-title"><T en="Notes & Explorations" zh="笔记与探索" /></h1>
            </div>
            <LangToggle />
          </div>
          <p className="blog-index-intro">
            <T
              en="Side projects, half-finished ideas and things I found interesting along the way. Every post is written in English and Chinese; use the toggle to switch."
              zh="一些业余项目、没做完的想法，以及研究路上觉得好玩的东西。每篇文章都有中英文两个版本，可以用右上角的按钮切换。"
            />
          </p>
          <div className="blog-list">
            {blogPosts.map((post) => (
              <article key={post.slug} className="blog-card">
                <p className="list-date">{post.date} · <T en={post.readingTime.en} zh={post.readingTime.zh} /></p>
                <h2 className="blog-card-title">
                  <Link href={`/blog/${post.slug}`}><T en={post.title.en} zh={post.title.zh} /></Link>
                </h2>
                <p className="blog-card-summary"><T en={post.summary.en} zh={post.summary.zh} /></p>
                <div className="blog-card-foot">
                  <ul className="blog-tags" aria-label="Tags">
                    {post.tags.map((tag) => <li key={tag}>{tag}</li>)}
                  </ul>
                  <Link href={`/blog/${post.slug}`} className="publication-link">
                    <T en="Read" zh="阅读" /><ArrowRight size={12} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
