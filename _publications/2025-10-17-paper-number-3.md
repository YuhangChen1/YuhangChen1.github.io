---
title: "PAPER2WEB: LET’S MAKE YOUR PAPER ALIVE!"
collection: publications
category: conferences
permalink: /publication/2025-10-17-paper-number-3
excerpt: 'We introduce Paper2Web, the first benchmark for assessing academic webpage generation, and PWAgent, an autonomous system designed to bridge the gap between static PDFs and interactive project sites. By leveraging an iterative refinement process and MCP-driven tools, PWAgent generates layout-aware, multimedia-rich homepages that prioritize both aesthetics and information density. Experimental results demonstrate that this agent-driven approach achieves superior performance over end-to-end LLM generation and existing web-conversion templates, offering a high-quality, low-cost solution for researchers.'
date: 2025-10-17
venue: 'In submission'
slidesurl: 'https://francischen3.github.io/P2W_Website/'
paperurl: 'https://arxiv.org/pdf/2510.15842'
bibtexurl: 'https://arxiv.org/pdf/2510.15842'
citation: '@misc{chen2025paper2webletsmakepaper,
      title={Paper2Web: Let''s Make Your Paper Alive!}, 
      author={Yuhang Chen and Tianpeng Lv and Siyi Zhang and Yixiang Yin and Yao Wan and Philip S. Yu and Dongping Chen},
      year={2025},
      eprint={2510.15842},
      archivePrefix={arXiv},
      primaryClass={cs.CL},
      url={https://arxiv.org/abs/2510.15842}, 
}'
---
Academic project websites can more effectively disseminate research when they clearly present core content and enable intuitive navigation and interaction. However, current approaches such as direct Large Language Model (LLM) generation, templates, or direct HTML conversion struggle to produce layout-aware, interactive sites, and a comprehensive evaluation suite for this task has been lacking. In this paper, we introduce Paper2Web, a benchmark dataset and multi-dimensional evaluation framework for assessing academic webpage generation. It incorporates rule-based metrics like Connectivity, Completeness and human-verified LLM-as-a-Judge (covering interactivity, aesthetics, and informativeness), and PaperQuiz, which measures paper-level knowledge retention. We further present PWAgent, an autonomous pipeline that converts scientific papers into interactive and multimedia-rich academic homepages. The agent iteratively refines both content and layout through MCP tools that enhance emphasis, balance, and presentation quality. Our experiments show that PWAgent consistently outperforms end-to-end baselines like template-based webpages and arXiv/alphaXiv versions by a large margin while maintaining low cost, achieving the Pareto-front in academic webpage generation. [HERE](https://github.com/YuhangChen1/Paper2All).
![PAPER2WEB: LET’S MAKE YOUR PAPER ALIVE!](../images/paper2web.png)