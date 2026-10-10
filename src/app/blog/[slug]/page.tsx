import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUp } from "lucide-react";

import { T } from "@/components/bilingual";
import { LangToggle } from "@/components/lang-toggle";
import { SiteHeader } from "@/components/site-header";
import { blogPosts, getBlogPost } from "@/data/blog";
import { postBodies } from "@/posts";

export const dynamicParams = false;

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = getBlogPost((await params).slug);
  if (!post) return {};
  return { title: `${post.title.en} · Yuhang Chen`, description: post.summary.en };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  const Body = postBodies[slug];
  if (!post || !Body) notFound();

  return (
    <div className="site-page">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <SiteHeader />
      <main id="main-content" className="site-shell">
        <article className="blog-shell post">
          <div className="post-toolbar">
            <Link href="/blog" className="publication-link"><ArrowLeft size={12} aria-hidden="true" /><T en="All posts" zh="全部文章" /></Link>
            <LangToggle />
          </div>
          <header className="post-header">
            <p className="list-date">{post.date} · <T en={post.readingTime.en} zh={post.readingTime.zh} /></p>
            <h1 className="post-title"><T en={post.title.en} zh={post.title.zh} /></h1>
            <p className="post-summary"><T en={post.summary.en} zh={post.summary.zh} /></p>
            <ul className="blog-tags" aria-label="Tags">
              {post.tags.map((tag) => <li key={tag}>{tag}</li>)}
            </ul>
          </header>
          <Body />
        </article>
        <footer className="site-footer">
          <Link href="/blog" className="publication-link"><ArrowLeft size={12} aria-hidden="true" /><T en="All posts" zh="全部文章" /></Link>
          <a href="#main-content" className="back-to-top" title="Back to top" aria-label="Back to top"><ArrowUp size={18} aria-hidden="true" /></a>
        </footer>
      </main>
    </div>
  );
}
