---
title: "Quantifying the Gap between Understanding and Generation within Unified Multimodal Models"
collection: publications
category: conferences
permalink: /publication/2026-2-2-paper-number-2
excerpt: 'We extend MLLM-as-a-Judge across multiple modalities, present TaskAnything and JudgeAnything benchmarks that reveal MLLM-as-a-Judge excel at judging MMU but struggle with MMG tasks.'
date: 2026-2-2
venue: 'CVPR 2026 Findings'
slidesurl: 'https://arxiv.org/pdf/2602.02140'
paperurl: 'https://arxiv.org/pdf/2602.02140'
bibtexurl: 'https://arxiv.org/pdf/2602.02140'
citation: '@misc{wang2026quantifyinggapunderstandinggeneration,
      title={Quantifying the Gap between Understanding and Generation within Unified Multimodal Models}, 
      author={Chenlong Wang and Yuhang Chen and Zhihan Hu and Dongping Chen and Wenhu Chen and Sarah Wiegreffe and Tianyi Zhou},
      year={2026},
      eprint={2602.02140},
      archivePrefix={arXiv},
      primaryClass={cs.CL},
      url={https://arxiv.org/abs/2602.02140}, 
}'
---
Recent advances in unified multimodal models (UMM) have demonstrated remarkable progress in both understanding and generation tasks. However, whether these two capabilities are genuinely aligned and integrated within a single model remains unclear. To investigate this question, we introduce GapEval, a bidirectional benchmark designed to quantify the gap between understanding and generation capabilities, and quantitatively measure the cognitive coherence of the two "unified" directions. Each question can be answered in both modalities (image and text), enabling a symmetric evaluation of a model's bidirectional inference capability and cross-modal consistency. Experiments reveal a persistent gap between the two directions across a wide range of UMMs with different architectures, suggesting that current models achieve only surface-level unification rather than deep cognitive convergence of the two. To further explore the underlying mechanism, we conduct an empirical study from the perspective of knowledge manipulation to illustrate the underlying limitations. Our findings indicate that knowledge within UMMs often remains disjoint. The capability emergence and knowledge across modalities are unsynchronized, paving the way for further exploration. 
![Quantifying the Gap between Understanding and Generation within Unified Multimodal Models](../images/gapeval.png)