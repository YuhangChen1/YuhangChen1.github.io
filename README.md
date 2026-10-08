# Yuhang Chen 个人主页

使用 Next.js + Markdown，构建为静态站点并发布到 GitHub Pages。

## 本地预览

需要 Node.js 22 和 npm。在项目目录执行：

```sh
npm ci
npm run dev -- --hostname 0.0.0.0
```

打开 http://localhost:3000。如果端口被占用，在命令末尾加 `--port 3001`。
在远程服务器上开发时，可通过 VS Code 的 Ports 面板转发对应端口。

## 以后如何更新

| 文件 | 修改内容 |
| --- | --- |
| `content/home.md` | 简介、联系方式、PhD 申请意向和研究兴趣 |
| `content/news.md` | 新闻，最新消息放最前面 |
| `content/publications.md` | 论文与在投稿件、作者、状态、配图和链接 |
| `content/experience.md` | 研究经历、教育经历和荣誉 |
| `public/cv/Resume_yuhang_chen.pdf` | 当前英文简历，以后替换同名文件即可 |
| `public/cursors/` | 猫猫指针及悬停在链接上时的表情 |

中文简历入口已删除，历史 PDF 文件仍保留在仓库里。
`public/` 下的资源使用网站根路径，例如
`public/cv/Resume_yuhang_chen.pdf` 的链接是 `/cv/Resume_yuhang_chen.pdf`。

`paper/` 中现有的 MOSAIC PDF 无法被解析，因此目前仅展示稿件信息。
准备好有效的 PDF 后，将它放到 `public/papers/mosaic.pdf`，并在对应的
Markdown 条目里加上 `links: PDF|/papers/mosaic.pdf` 即可。

## 发布到 GitHub Pages

首次使用这套发布流程时，在 GitHub 仓库的 **Settings > Pages > Build and
deployment > Source** 中选择 **GitHub Actions**。

```sh
npm run lint
npm run build
git add content src public scripts .github README.md package.json package-lock.json next-env.d.ts .gitignore
git commit -m "Update academic homepage"
git push origin master
```

推送后，**Deploy GitHub Pages** 工作流会构建并发布整个 `out/`，包括简历、
照片、猫猫指针和 BibTeX。也可以在仓库的 Actions 页面手动运行该工作流。
发布成功后的地址是 https://yuhangchen1.github.io/。

根目录的 `index.html`、`_next/` 等是历史手动导出的旧页面，不要编辑这些文件，
也不要继续使用仓库根目录作为发布源。新工作流从 `src/`、`content/` 和
`public/` 构建，完整的新网站在 `out/` 中。旧的根目录发布方式曾导致
`/avatar-main.jpg` 和 `/cv/…` 等资源找不到。

构建后的脚本仅压缩 `out/japan/` 的照片，`public/japan/` 中的原图保持不变。
项目采用 `output: "export"`，生产环境直接托管 `out/`，不使用 `next start`。

本地检查构建产物可执行 `python -m http.server 4173 --directory out`，然后访问
http://localhost:4173。
