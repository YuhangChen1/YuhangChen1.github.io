export type Bilingual = {
  en: string;
  zh: string;
};

export type BlogPostMeta = {
  slug: string;
  date: string;
  title: Bilingual;
  summary: Bilingual;
  tags: string[];
  readingTime: Bilingual;
};

// Newest first. The body of each post lives in src/posts/<slug>.tsx and is registered in src/posts/index.ts.
export const blogPosts: BlogPostMeta[] = [
  {
    slug: "vla-aspace",
    date: "2026-10-10",
    title: {
      en: "Where does a VLA decide what to do? Poking at the action interface of three robot policies",
      zh: "VLA 到底在哪里决定动作？拆解三个机器人策略的“动作接口”",
    },
    summary: {
      en: "A weekend-project-that-got-out-of-hand: linear probes, interchange interventions and causal subspace search on OFT, GR00T and PI heads built on the same Qwen3-VL backbone. Readable is not the same as used, the action is committed at the very last flow step, and the causal interface speaks motor, not geometry.",
      zh: "一个越做越大的个人探索：在共享 Qwen3-VL 主干的 OFT、GR00T、PI 三种动作头上做线性探针、交换干预和因果子空间搜索。结论是：可读不等于被使用；动作在最后一步 flow 才被真正“拍板”；因果接口说的是运动语言，而不是几何语言。",
    },
    tags: ["VLA", "interpretability", "robotics", "causal interventions"],
    readingTime: { en: "25 min read", zh: "约 25 分钟" },
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
