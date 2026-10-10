import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { Bi, T } from "@/components/bilingual";

const figureBase = "/blog/vla-aspace";

const sections = [
  { id: "tldr", en: "TL;DR", zh: "太长不看" },
  { id: "why", en: "Why I did this", zh: "为什么做这个" },
  { id: "setup", en: "Setup: one backbone, three heads", zh: "实验设置：一个主干，三种动作头" },
  { id: "readable", en: "Act I · What can be read out", zh: "第一幕 · 能读出什么" },
  { id: "used", en: "Act II · Readable is not used", zh: "第二幕 · 可读不等于被使用" },
  { id: "subspace", en: "Act III · Searching for the causal subspace", zh: "第三幕 · 直接搜索因果子空间" },
  { id: "late", en: "Act IV · The last flow step decides", zh: "第四幕 · 最后一步 flow 才拍板" },
  { id: "meaning", en: "Act V · Motor intent, not geometry", zh: "第五幕 · 是运动意图，不是几何" },
  { id: "useful", en: "Act VI · Is any of this useful?", zh: "第六幕 · 这些发现有用吗？" },
  { id: "lessons", en: "What I learned", zh: "我学到了什么" },
  { id: "caveats", en: "Caveats", zh: "局限" },
];

function Section({ id, children }: { id: string; children: ReactNode }) {
  const section = sections.find((item) => item.id === id);
  return (
    <section id={id} className="post-section">
      <h2 className="post-h2">{section ? <T en={section.en} zh={section.zh} /> : null}</h2>
      {children}
    </section>
  );
}

function Figure({
  name,
  width,
  height,
  alt,
  en,
  zh,
}: {
  name: string;
  width: number;
  height: number;
  alt: string;
  en: ReactNode;
  zh: ReactNode;
}) {
  const src = `${figureBase}/${name}.png`;
  return (
    <figure className="post-figure">
      <a href={src} target="_blank" rel="noreferrer" title="Open full-size image">
        <Image src={src} alt={alt} width={width} height={height} sizes="(max-width: 820px) 100vw, 760px" />
      </a>
      <figcaption><T en={en} zh={zh} /></figcaption>
    </figure>
  );
}

function Callout({ children }: { children: ReactNode }) {
  return <aside className="post-callout">{children}</aside>;
}

export default function VlaAspacePost() {
  return (
    <div className="post-body">
      <nav className="post-toc" aria-label="Contents">
        <p className="section-kicker"><T en="Contents" zh="目录" /></p>
        <ol>
          {sections.map((item) => (
            <li key={item.id}><a href={`#${item.id}`}><T en={item.en} zh={item.zh} /></a></li>
          ))}
        </ol>
      </nav>

      <Section id="tldr">
        <Callout>
          <Bi
            en={
              <ul>
                <li>I took three vision-language-action (VLA) policies that share the <strong>same Qwen3-VL-4B backbone</strong> but use different action heads (OpenVLA-OFT style, GR00T style, π style), and asked: <em>where</em> and <em>when</em> does the action actually get decided?</li>
                <li><strong>Almost everything is linearly readable almost everywhere.</strong> But the directions a probe finds are nearly useless when you intervene on them. Readable ≠ used.</li>
                <li>Searching for causal subspaces directly works beautifully at one site: OFT&apos;s 32 action tokens hold an <strong>~6-dimensional</strong> causal interface (8 dims transfer 97% of the donor&apos;s action, PCA-8 transfers 80%, probe directions 8%).</li>
                <li>Inside the flow-matching heads there is no small subspace. Instead, the decision is a <strong>pathway plus a time</strong>: the information is present from the first flow step, but only the <strong>last of four steps</strong> actually writes it into the action.</li>
                <li>The causal interface speaks <strong>motor intent, not geometry</strong>. It encodes “what the arm will do next” rather than “where the object is”.</li>
                <li>I then tried to turn these findings into five training-free inference tricks. Four were negative or mixed. The one that worked, skipping early-step cross-attention, saves a modest 6–7% GPU time.</li>
              </ul>
            }
            zh={
              <ul>
                <li>我拿了三个共享<strong>同一个 Qwen3-VL-4B 主干</strong>、但动作头不同的 VLA（OpenVLA-OFT 式、GR00T 式、π 式），想回答一个问题：动作到底是在<em>哪里</em>、在<em>什么时候</em>被决定的？</li>
                <li><strong>几乎所有信息在几乎所有地方都能被线性读出。</strong>但探针找到的方向，拿来做干预几乎没用。可读 ≠ 被使用。</li>
                <li>直接搜索因果子空间，在一个位置上效果非常漂亮：OFT 的 32 个动作 token 里有一个<strong>约 6 维</strong>的因果接口（8 维就能迁移供体动作的 97%，PCA-8 只有 80%，探针方向只有 8%）。</li>
                <li>在 flow-matching 动作头内部找不到小的子空间。决定动作的是<strong>一条通路加一个时刻</strong>：信息从第一步 flow 就已经在了，但只有 4 步中的<strong>最后一步</strong>真正把它写进动作。</li>
                <li>这个因果接口说的是<strong>运动意图，而不是几何</strong>：它编码的是“手臂接下来要怎么动”，而不是“物体在哪里”。</li>
                <li>最后我试着把这些发现变成 5 个免训练的推理技巧。4 个是负结果或者好坏参半；唯一有用的是跳过早期 flow 步的 cross-attention，能省 6–7% 的 GPU 时间，不多。</li>
              </ul>
            }
          />
        </Callout>
      </Section>

      <Section id="why">
        <Bi
          en={
            <>
              <p>VLAs are usually described as “a VLM plus an action head”. The VLM sees the cameras and reads the instruction; the head turns its hidden states into a chunk of motor commands. That picture hides the interesting question: what exactly crosses the boundary between the two? Is there a compact “action space” inside the VLM that the head reads, like a bottleneck? Is it geometric, like “the cup is 12 cm to the left”? Or is it something more like a motor plan?</p>
              <p>I started this as a quick probing exercise and it slowly turned into seven phases of experiments, a few hundred figures and a lot of failed hypotheses. I do not think it is a paper: the setting is narrow, everything is open-loop, and the most useful outcome is a list of things that do <em>not</em> work. But I learned a lot from it, and the story is fun, so here it is. Internally I called the object I was hunting <strong>“A-Space”</strong> (the action space inside the model).</p>
            </>
          }
          zh={
            <>
              <p>VLA 通常被描述成“VLM 加一个动作头”：VLM 看相机画面、读指令，动作头把它的隐藏状态变成一段电机指令。这个说法掩盖了一个很有意思的问题：两者之间到底传递了什么？VLM 里面是不是有一个紧凑的“动作空间”，像瓶颈一样被动作头读取？它是几何性的吗，比如“杯子在左边 12 厘米”？还是更像一个运动计划？</p>
              <p>一开始我只是想做个简单的探针实验，结果慢慢变成了七个阶段的实验、几百张图和一大堆被推翻的假设。我不觉得这能成为一篇论文：设定很窄，所有结果都是开环的，而且最有用的产出是一份“什么不行”的清单。但我从中学到了很多，过程也挺好玩，所以写下来。我把要找的东西叫做 <strong>“A-Space”</strong>（模型内部的动作空间）。</p>
            </>
          }
        />
      </Section>

      <Section id="setup">
        <Bi
          en={<p>All three policies were fine-tuned on the RoboTwin bimanual simulation benchmark and share the same backbone: Qwen3-VL-4B, 36 decoder layers, hidden size 2560. Only the action head differs.</p>}
          zh={<p>三个策略都在 RoboTwin 双臂仿真基准上微调，共享同一个主干：Qwen3-VL-4B，36 层 decoder，隐藏维度 2560。唯一的区别是动作头。</p>}
        />
        <div className="post-table-wrap">
          <table className="post-table">
            <thead>
              <tr>
                <th><T en="Model" zh="模型" /></th>
                <th><T en="How the head reads the VLM" zh="动作头如何读取 VLM" /></th>
                <th><T en="Decoding" zh="解码方式" /></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>OFT</td>
                <td><T en="32 action-placeholder tokens appended to the VLM sequence, then an MLP head" zh="在 VLM 序列末尾加 32 个动作占位 token，再接一个 MLP 头" /></td>
                <td><T en="one forward pass" zh="一次前向" /></td>
              </tr>
              <tr>
                <td>GR00T</td>
                <td><T en="16-block DiT (d = 768); 8 blocks cross-attend to the last VLM layer" zh="16 个 block 的 DiT（d = 768），其中 8 个 block 对 VLM 最后一层做 cross-attention" /></td>
                <td><T en="4 Euler flow-matching steps" zh="4 步 Euler flow matching" /></td>
              </tr>
              <tr>
                <td>PI</td>
                <td><T en="28-layer action expert (d = 1024) attending to a projection of the last VLM layer" zh="28 层动作专家（d = 1024），读取 VLM 最后一层的投影" /></td>
                <td><T en="4 Euler flow-matching steps" zh="4 步 Euler flow matching" /></td>
              </tr>
            </tbody>
          </table>
        </div>
        <Bi
          en={
            <>
              <p>The dataset is 10 tasks × 30 trajectories × 10 timesteps = <strong>3000 samples</strong>, each with three cameras (head, left wrist, right wrist) and a language instruction, and no proprioception. Splits are trajectory-disjoint, plus a held-out-task split. I hooked every layer, every action token, every cross-attention update (called ΔZ below) and every flow step, checked that all three models are deterministic under a fixed seed, and built a small attention debugger to look at things by eye.</p>
              <p>Three tools carry the whole story:</p>
              <ul>
                <li><strong>Linear probes</strong> ask: can a variable be read out of this hidden state?</li>
                <li><strong>Interchange interventions</strong> ask: if I take the hidden state from a <em>donor</em> sample B and paste it into a <em>receiver</em> sample A, does A&apos;s action move toward B&apos;s? I measure this with the <strong>causal agreement ratio</strong>, CAR = ⟨a<sub>patched</sub> − a<sub>A</sub>, a<sub>B</sub> − a<sub>A</sub>⟩ / ‖a<sub>B</sub> − a<sub>A</sub>‖². CAR = 1 means the action fully became the donor&apos;s; 0 means nothing happened.</li>
                <li><strong>Causal subspace search</strong> asks: what is the smallest k-dimensional subspace whose patch alone reproduces the full effect? I optimize an orthonormal basis U directly for CAR, with a rule that the edited states must stay on the data manifold (median out-of-distribution ratio ≤ 1.10), validation/test splits and multiple seeds.</li>
              </ul>
              <p>Most claims were preregistered as hypothesis tests with Holm correction, so that I could not quietly drop the ones that failed. Many did.</p>
            </>
          }
          zh={
            <>
              <p>数据是 10 个任务 × 30 条轨迹 × 10 个时间步 = <strong>3000 个样本</strong>，每个样本有三个相机（头部、左腕、右腕）和一条语言指令，没有本体感知输入。数据划分按轨迹隔离，另外还有一个留出任务的划分。我在每一层、每个动作 token、每个 cross-attention 更新（下文称 ΔZ）、每个 flow 步上都挂了 hook，确认三个模型在固定随机种子下是确定性的，还写了一个小的 attention debugger 用来肉眼检查。</p>
              <p>整个故事靠三个工具：</p>
              <ul>
                <li><strong>线性探针</strong>：某个变量能不能从这个隐藏状态里读出来？</li>
                <li><strong>交换干预</strong>：把<em>供体</em>样本 B 的隐藏状态贴进<em>受体</em>样本 A，A 的动作会不会向 B 的动作移动？我用<strong>因果一致率</strong>来衡量：CAR = ⟨a<sub>patched</sub> − a<sub>A</sub>, a<sub>B</sub> − a<sub>A</sub>⟩ / ‖a<sub>B</sub> − a<sub>A</sub>‖²。CAR = 1 表示动作完全变成了供体的，0 表示没有任何影响。</li>
                <li><strong>因果子空间搜索</strong>：最小的 k 维子空间是多少，只替换它就能复现完整效果？我直接针对 CAR 优化一个正交基 U，同时要求编辑后的状态留在数据流形上（OOD 比值中位数 ≤ 1.10），并使用验证/测试划分和多个随机种子。</li>
              </ul>
              <p>大部分结论都事先登记成假设检验，并做 Holm 校正，这样我就没法悄悄丢掉失败的那些。失败的有很多。</p>
            </>
          }
        />
        <Figure
          name="attention-three-models"
          width={1160}
          height={720}
          alt="Instruction-to-image attention at VLM layer 18 for OFT, GR00T and PI on a handover task"
          en="A sanity check from the attention debugger: instruction-token → image attention at VLM layer 18 for “grab the red block with the left arm…”. All three fine-tuned backbones look at the red block in the head camera. Pretty, but attention maps tell you where information is routed, not what is used."
          zh="来自 attention debugger 的一个直观检查：指令 token 到图像的 attention（VLM 第 18 层），指令是“用左臂抓起红色方块……”。三个微调后的主干都在看头部相机里的红色方块。好看，但 attention 图只能告诉你信息流向哪里，不能告诉你什么被真正使用。"
        />
      </Section>

      <Section id="readable">
        <Bi
          en={<p>The first phase was the classic one: train linear probes on every layer for task identity, current robot state and future motor targets (the end point and displacement of the upcoming action chunk).</p>}
          zh={<p>第一阶段是经典做法：在每一层上训练线性探针，读出任务身份、当前机器人状态和未来的运动目标（即将执行的动作块的终点和位移）。</p>}
        />
        <Figure
          name="decodability-by-layer"
          width={1650}
          height={880}
          alt="Layerwise linear probe accuracy for task, end-effector position, gripper state, future action, chunk endpoint and displacement"
          en="Layerwise linear decodability (index 36 = the tensor the action head reads). Task and current state are readable from the very first layer; future-motor targets climb slowly and then jump in the last few layers."
          zh="逐层线性可读性（第 36 个索引就是动作头读取的张量）。任务和当前状态从第一层开始就能读出；未来运动目标缓慢上升，在最后几层陡增。"
        />
        <Bi
          en={
            <ul>
              <li><strong>Task identity is trivially decodable (≈ 1.0) from layer 0.</strong> That is just the instruction words.</li>
              <li><strong>The current robot state is already in the visual tokens at layer 0</strong> (end-effector position R² ≈ 0.9). The arms are visible in the wrist cameras.</li>
              <li><strong>Future-motor targets build up across depth.</strong> For OFT, the chunk-endpoint R² goes from about .61 at the embeddings to .86 around layer 32 and .94 at the head input. The last layer is always the best layer.</li>
              <li>Which arm the instruction refers to peaks in the middle layers (7–19) and then declines. Where the information concentrates is model-specific: in OFT text tokens beat image tokens, in PI image tokens win, GR00T is a tie.</li>
              <li>Each OFT action token on its own already holds almost the whole 32-step chunk. The concatenated final states of the expert heads are the best carriers overall (≈ .985) and transfer much better to a held-out task than the VLM states do (gripper .92–.94 vs .56–.71).</li>
              <li>Changing the flow step barely changes decodability. Remember this; it comes back in Act IV.</li>
            </ul>
          }
          zh={
            <ul>
              <li><strong>任务身份从第 0 层就能被读出（≈ 1.0）。</strong>这只是因为指令里的单词。</li>
              <li><strong>当前机器人状态在第 0 层的视觉 token 里就已经存在</strong>（末端位置 R² ≈ 0.9），因为腕部相机里能看到手臂。</li>
              <li><strong>未来运动目标随深度逐渐形成。</strong>以 OFT 为例，动作块终点的 R² 从 embedding 层的约 .61，到第 32 层左右的 .86，再到动作头输入处的 .94。最后一层永远是最好的一层。</li>
              <li>指令中指的是哪只手臂，这个信息在中间层（7–19 层）最强，之后下降。信息集中在哪类 token 上因模型而异：OFT 中文本 token 强于图像 token，PI 中图像 token 更强，GR00T 两者持平。</li>
              <li>OFT 的每一个动作 token 单独拿出来，就几乎包含了整个 32 步动作块。专家头最终状态的拼接是整体上最好的载体（≈ .985），迁移到留出任务时也远好于 VLM 状态（夹爪 .92–.94 对 .56–.71）。</li>
              <li>切换 flow 步几乎不改变可读性。记住这一点，第四幕还会用到。</li>
            </ul>
          }
        />
        <Callout>
          <Bi
            en={<p><strong>A bug that looked like a finding.</strong> At first OFT&apos;s MLP head showed a mysterious mid-stage “dip” in decodability. It turned out to be a pooling artifact: a handful of outlier dimensions dominate the mean over tokens. Applying LayerNorm per token before pooling makes the dip disappear. Lesson: when a curve looks interesting, first check whether a few huge activations are drawing it.</p>}
            zh={<p><strong>一个看起来像发现的 bug。</strong>最初 OFT 的 MLP 头在中间阶段出现了一个神秘的可读性“凹陷”。后来发现这是池化造成的假象：少数几个离群维度主导了对 token 的平均。在池化前对每个 token 做 LayerNorm，凹陷就消失了。教训：曲线看起来很有意思的时候，先检查是不是几个巨大的激活值在画这条曲线。</p>}
          />
        </Callout>
      </Section>

      <Section id="used">
        <Bi
          en={
            <>
              <p>The obvious next step: take the probe directions for future motion (an 8-dimensional subspace I called A<sub>motor</sub>), and check whether the model actually <em>uses</em> them. If I swap only those 8 dimensions from a donor into a receiver, does the receiver&apos;s action follow?</p>
              <p><strong>Almost not at all.</strong> At the head input, patching A<sub>motor</sub> gives CAR ≈ 0.008, against 0.002 for a random 8-dimensional subspace. Its complement, i.e. everything the probe ignored, carries nearly all of the effect. Even at OFT&apos;s action tokens it only reaches 0.115, and inside the expert heads it is no better than random. Steering along probe directions moves the gripper monotonically, but by at most about 1.5 cm, and at the expert sites it sometimes moves it the wrong way.</p>
            </>
          }
          zh={
            <>
              <p>下一步很自然：取出未来运动的探针方向（一个 8 维子空间，我叫它 A<sub>motor</sub>），检查模型是不是真的<em>使用</em>了它们。如果只把这 8 个维度从供体换到受体，受体的动作会不会跟着变？</p>
              <p><strong>几乎完全不会。</strong>在动作头输入处，替换 A<sub>motor</sub> 的 CAR ≈ 0.008，随机 8 维子空间是 0.002。它的补空间，也就是探针忽略的所有东西，承载了几乎全部效果。即使在 OFT 的动作 token 上也只有 0.115，在专家头内部则和随机没有区别。沿探针方向做 steering，夹爪确实单调移动，但最多只有约 1.5 厘米，而且在专家头的位置上有时还会往反方向走。</p>
            </>
          }
        />
        <Figure
          name="decodable-vs-used"
          width={1800}
          height={480}
          alt="Probe R2 versus causal agreement ratio across VLM layers for OFT, GR00T and PI"
          en="Black: probe decodability rises with depth. Blue: replacing the full state gives CAR = 1 from layer 6 on. Red/purple (flat at zero): the probe subspace A_motor and a random subspace. Green: patching only the image tokens works early and stops working late, because by then the information has moved elsewhere."
          zh="黑线：探针可读性随深度上升。蓝线：从第 6 层开始替换整个状态都能得到 CAR = 1。红/紫线（贴着 0）：探针子空间 A_motor 和随机子空间。绿线：只替换图像 token，在浅层有效、深层失效，因为那时信息已经转移到别的位置。"
        />
        <Bi
          en={
            <>
              <p>The full-state patches tell a cleaner story about <em>where</em> the information flows:</p>
              <ul>
                <li>From layer 6 on, the full VLM state is sufficient (CAR = 1.0). Layer 0 is weak because Qwen3-VL&apos;s DeepStack re-injects the receiver&apos;s own visual features into later layers.</li>
                <li>In OFT, the image tokens stop mattering between layers 24 and 33: that is where the visual information gets copied into the 32 action tokens.</li>
                <li>OFT&apos;s action tokens are strikingly local: <strong>swapping token i changes only timestep i</strong> of the output (influence 1.52 on the diagonal vs 0.002 off it).</li>
                <li>In the flow heads, the cross-attention updates (ΔZ) act in a distributed, super-additive way across blocks.</li>
                <li>And the first hint of Act IV: replacing ΔZ only at the <strong>last</strong> flow step transfers .907 (PI) and .513 (GR00T). Replacing it at steps 0–2 transfers ≤ .03.</li>
              </ul>
            </>
          }
          zh={
            <>
              <p>替换整个状态的结果，更清楚地说明了信息<em>流向哪里</em>：</p>
              <ul>
                <li>从第 6 层开始，完整的 VLM 状态就是充分的（CAR = 1.0）。第 0 层效果弱，是因为 Qwen3-VL 的 DeepStack 会把受体自己的视觉特征重新注入后面的层。</li>
                <li>在 OFT 中，图像 token 在第 24 到 33 层之间不再重要：视觉信息就是在这里被复制进 32 个动作 token 的。</li>
                <li>OFT 的动作 token 非常局部：<strong>替换第 i 个 token 只改变输出的第 i 个时间步</strong>（对角线影响 1.52，非对角线 0.002）。</li>
                <li>在 flow 头里，cross-attention 更新（ΔZ）跨 block 分布式地起作用，而且是超加性的。</li>
                <li>还有第四幕的第一个线索：只在<strong>最后一个</strong> flow 步替换 ΔZ，能迁移 .907（PI）和 .513（GR00T）；在第 0–2 步替换只有 ≤ .03。</li>
              </ul>
            </>
          }
        />
        <Figure
          name="oft-token-influence"
          width={1800}
          height={518}
          alt="OFT action-token influence matrices: swapping, mean-ablating and leave-one-out on 32 action tokens"
          en="OFT at layer 33. Left: swapping action token i with the donor’s changes only output timestep i. Middle: mean-ablating token i, same picture. Right: swapping all tokens except i leaves exactly timestep i untouched."
          zh="OFT 第 33 层。左：把第 i 个动作 token 换成供体的，只有输出的第 i 个时间步改变。中：对第 i 个 token 做均值消融，结果相同。右：除第 i 个以外全部替换，恰好只有第 i 个时间步不变。"
        />
        <Callout>
          <Bi
            en={<p><strong>Readable ≠ used.</strong> A linear probe finds <em>a</em> direction that correlates with the target. The model is free to use completely different directions, and here it does: later I measured that the probe basis and the causal basis overlap at about .06, close to orthogonal.</p>}
            zh={<p><strong>可读 ≠ 被使用。</strong>线性探针找到的是<em>某个</em>与目标相关的方向，模型完全可以使用别的方向，而这里正是如此：后来我测到探针基和因果基的重叠只有约 .06，接近正交。</p>}
          />
        </Callout>
      </Section>

      <Section id="subspace">
        <Bi
          en={<p>If probes find the wrong directions, search for the right ones directly. For each site I optimized an orthonormal basis U (k = 1 … 256) so that patching only the U-component of the donor state maximizes CAR on held-out pairs, while keeping the edited state on the data manifold. Then I asked how many directions are needed to recover 90% of the full-state effect (k<sub>90</sub>).</p>}
          zh={<p>既然探针找错了方向，那就直接去找对的方向。对每个位置，我优化一个正交基 U（k = 1 … 256），使得只替换供体状态在 U 上的分量时，留出样本对上的 CAR 最大，同时要求编辑后的状态留在数据流形上。然后看需要多少个方向才能恢复完整状态效果的 90%（k<sub>90</sub>）。</p>}
        />
        <Figure
          name="causal-recovery-spectrum"
          width={1800}
          height={410}
          alt="Cumulative causal recovery versus number of causal directions for OFT action tokens and late VLM layers"
          en="Causal recovery spectrum. OFT action tokens (left) saturate after a handful of directions. Late VLM layers need 16–32 directions and are still climbing."
          zh="因果恢复谱。OFT 动作 token（左）只需要少数几个方向就饱和；VLM 后几层需要 16–32 个方向，而且还在上升。"
        />
        <div className="post-table-wrap">
          <table className="post-table">
            <thead>
              <tr>
                <th><T en="Site" zh="位置" /></th>
                <th><T en="Result" zh="结果" /></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><T en="OFT action tokens" zh="OFT 动作 token" /></td>
                <td><T en={<><strong>k₉₀ ≈ 6.1.</strong> k = 8: CAR .972 vs PCA .80, probe .083, random .002; complement .02. Seeds agree (span overlap ≥ .95), edits stay on-manifold (OOD 1.02). The only site that passes every criterion.</>} zh={<><strong>k₉₀ ≈ 6.1。</strong>k = 8 时 CAR .972，PCA .80，探针 .083，随机 .002，补空间 .02。不同种子结果一致（张成重叠 ≥ .95），编辑留在流形上（OOD 1.02）。唯一通过所有标准的位置。</>} /></td>
              </tr>
              <tr>
                <td><T en="Late VLM (head input)" zh="VLM 后几层（动作头输入）" /></td>
                <td><T en="k₉₀ ≈ 20 (OFT), 16 (PI), 32 (GR00T). The effect is identified but the coordinates are not: different seeds share only 3–10 directions. PCA-32 reaches .34–.62 where the causal basis reaches .90–.97." zh="k₉₀ ≈ 20（OFT）、16（PI）、32（GR00T）。效果是确定的，但坐标不唯一：不同种子只共享 3–10 个方向。同样 32 维，PCA 只有 .34–.62，因果基有 .90–.97。" /></td>
              </tr>
              <tr>
                <td><T en="Inside the flow heads" zh="flow 动作头内部" /></td>
                <td><T en="No low-dimensional subspace under the on-manifold rule. Without the rule, 4–8 dims “work” but only by pushing states off-manifold. GR00T blocks are cooperative: single-block patches sum to 0.14, all blocks together give 1.0." zh="在流形约束下找不到低维子空间。去掉约束时 4–8 维“有效”，但只是因为把状态推出了流形。GR00T 的 block 之间是协作的：单个 block 的效果加起来只有 0.14，所有 block 一起替换是 1.0。" /></td>
              </tr>
            </tbody>
          </table>
        </div>
        <Bi
          en={
            <>
              <p>Two controls kept me honest here. First, <strong>shuffled donors</strong>: if you patch a state from a random other sample, CAR is still about 0.5, because every donor differs from the receiver in a shared “move toward the typical state” direction. So 0.5, not 0, is the floor for donor-specific transfer. Second, I tried nonlinear bottlenecks instead of a linear U, and they added nothing.</p>
              <p>So my definition had to change. A-Space is not one global subspace. It is a <strong>site-specific causal interface</strong>: crisp and tiny at OFT&apos;s action tokens, broader and non-unique in the late VLM, and inside the flow heads it is not a subspace at all, but a pathway that is only active at a particular time.</p>
            </>
          }
          zh={
            <>
              <p>这里有两个对照让我保持诚实。第一是<strong>打乱的供体</strong>：从随便另一个样本贴一个状态过来，CAR 也有约 0.5，因为每个供体和受体之间都有一个共同的“往典型状态移动”的分量。所以衡量供体特异的迁移，基线是 0.5 而不是 0。第二，我把线性 U 换成非线性瓶颈试过，没有任何提升。</p>
              <p>所以我的定义得改。A-Space 不是一个全局子空间，而是一个<strong>依赖位置的因果接口</strong>：在 OFT 动作 token 上又小又清晰；在 VLM 后几层更宽，而且不唯一；在 flow 头内部根本不是子空间，而是一条只在特定时刻起作用的通路。</p>
            </>
          }
        />
      </Section>

      <Section id="late">
        <Bi
          en={<p>This is my favorite result. Both flow heads integrate four Euler steps from noise to action. I took the donor&apos;s cross-attention update from step s and inserted it into the receiver&apos;s run at step t, for all 4 × 4 combinations, with every other step running live.</p>}
          zh={<p>这是我最喜欢的结果。两个 flow 头都用 4 步 Euler 从噪声积分到动作。我把供体在第 s 步的 cross-attention 更新，插入受体运行的第 t 步，遍历全部 4 × 4 种组合，其余步骤正常运行。</p>}
        />
        <Figure
          name="cross-flow-matrix"
          width={977}
          height={991}
          alt="4 by 4 cross-flow patch matrices of CAR for PI and GR00T"
          en="Rows: which step the donor state came from. Columns: which step it was inserted into. Only the last column lights up. A donor’s step-0 update works as well as its step-3 update, as long as it is inserted at step 3."
          zh="行：供体状态来自哪一步。列：插入到哪一步。只有最后一列亮。只要插在第 3 步，供体第 0 步的更新和第 3 步的更新效果一样好。"
        />
        <Bi
          en={
            <>
              <ul>
                <li><strong>When it is inserted decides almost everything; where it came from decides almost nothing.</strong> Inserted at the last step, the donor&apos;s update transfers .91–.93 (PI) and .58–.64 (GR00T) whatever its source step. Inserted at steps 0–2 it transfers at most 3%.</li>
                <li>So the information that distinguishes donor from receiver is <strong>already present at step 0</strong>, but it is <strong>written into the action only at step 3</strong>.</li>
                <li>The sensitivity of the action to the head&apos;s internal state, ‖∂a/∂state‖, jumps <strong>70× (GR00T) and 190× (PI) from step 2 to step 3</strong>.</li>
                <li>Patching only the final expert state at the last step gives CAR = 0.251 in <em>both</em> models, which equals the step size Δτ = 0.25. That is what an ideal rectified-flow head should do: the patch swaps exactly one step&apos;s worth of velocity.</li>
              </ul>
              <p>Why the last step? Under the rectified-flow convention, the head&apos;s clean-action estimate at time τ is â = x<sub>τ</sub> + (1 − τ)v. At the last step the remaining step size equals 1 − τ, so the output <em>is</em> the step-3 estimate. Anything the head predicts earlier is partly re-predicted away by later steps. Late commitment is therefore a property of this 4-step integrator, and both heads show it, even though they were trained separately.</p>
            </>
          }
          zh={
            <>
              <ul>
                <li><strong>插在哪一步几乎决定一切，来自哪一步几乎无关。</strong>只要插在最后一步，无论来源是哪一步，供体更新都能迁移 .91–.93（PI）和 .58–.64（GR00T）；插在第 0–2 步则最多 3%。</li>
                <li>所以区分供体和受体的信息<strong>在第 0 步就已经存在</strong>，但<strong>直到第 3 步才被写进动作</strong>。</li>
                <li>动作对动作头内部状态的敏感度 ‖∂a/∂state‖，<strong>从第 2 步到第 3 步跳升 70 倍（GR00T）和 190 倍（PI）</strong>。</li>
                <li>在最后一步只替换专家头的最终状态，两个模型的 CAR <em>都</em>恰好是 0.251，等于步长 Δτ = 0.25。这正是一个理想的 rectified-flow 头应有的行为：这个替换恰好换掉了一步的速度。</li>
              </ul>
              <p>为什么是最后一步？在 rectified flow 的约定下，动作头在时刻 τ 对干净动作的估计是 â = x<sub>τ</sub> + (1 − τ)v。最后一步剩下的步长正好等于 1 − τ，所以输出<em>就是</em>第 3 步的估计。更早的预测会被后面的步骤部分覆盖掉。因此“晚决定”是这个 4 步积分器本身的性质，两个分别训练的动作头都表现出这一点。</p>
            </>
          }
        />
        <Figure
          name="decodability-vs-leverage"
          width={1485}
          height={564}
          alt="Decodability versus causal leverage across four flow steps for PI and GR00T"
          en="Blue: how well the model’s own action can be decoded from ΔZ, flat across steps. Red: how much patching ΔZ at that step changes the action, near zero until the last step."
          zh="蓝线：从 ΔZ 中解码模型自身动作的程度，在各步之间几乎不变。红线：在该步替换 ΔZ 对动作的影响，直到最后一步之前都接近 0。"
        />
        <Callout>
          <Bi
            en={<p>This is “readable ≠ used” again, now along the time axis. A probe at step 0 sees R² ≈ .78 (PI) and ≈ .87 (GR00T), exactly as high as at step 3, yet patching at step 0 does nothing. Both preregistered tests for this (one per model) were confirmed: +0.924 for PI and +0.572 for GR00T.</p>}
            zh={<p>这又是“可读 ≠ 被使用”，只不过换成了时间轴。在第 0 步，探针看到的 R² ≈ .78（PI）和 ≈ .87（GR00T），和第 3 步完全一样高，但在第 0 步做替换毫无作用。针对这一点事先登记的两个检验（每个模型一个）都得到了确认：PI +0.924，GR00T +0.572。</p>}
          />
        </Callout>
      </Section>

      <Section id="meaning">
        <Bi
          en={
            <>
              <p>Knowing <em>where</em> and <em>when</em>, I wanted to know <em>what</em>. My hypothesis was a “world → control” story: early layers encode absolute positions of objects in the world, and deeper layers convert them into end-effector-relative displacements that are easier to act on. To test it, I replayed seeds in the simulator and re-simulated scenes to get exact geometry labels: absolute target position, displacement from the end effector to the target, and so on.</p>
              <p>The story mostly <strong>failed</strong>, in an informative way:</p>
              <ul>
                <li>Absolute target position is readable everywhere (≈ .98 at the head input). Relative displacement is never preferred over absolute in the full state at any depth. There is no world → control transition across depth.</li>
                <li>Inside OFT&apos;s 8-dimensional causal space, relative <em>does</em> beat absolute (+0.187, confirmed). But PCA and probe subspaces of the same size show the same preference, so this is not something special about the causal coordinates.</li>
                <li>The compression is <strong>motor first</strong>: going from the late VLM&apos;s 32-dim causal space to the action tokens&apos; 8-dim one, absolute position is dropped and future action becomes the most enriched variable.</li>
                <li>The geometry-aligned part of the causal space behaves like a random part of the same size when patched. The causal coordinates look like a <strong>phase-conditioned motor code</strong> shared across tokens.</li>
                <li>Action is committed at the last flow step, but geometry is not specially committed there. And the end effector is outside the head camera in about 64% of frames, so the head camera cannot be the source of end-effector-relative geometry anyway.</li>
              </ul>
              <p>In the end, 2 of 7 preregistered tests were confirmed.</p>
            </>
          }
          zh={
            <>
              <p>知道了<em>在哪里</em>和<em>什么时候</em>，我想知道<em>是什么</em>。我的假设是一个“世界 → 控制”的故事：浅层编码物体在世界中的绝对位置，深层再把它转换成相对末端执行器的位移，这样更方便执行。为了检验，我在仿真器里重放随机种子、重新模拟场景，拿到精确的几何标签：目标的绝对位置、末端到目标的位移等等。</p>
              <p>这个故事基本<strong>失败了</strong>，但失败得很有信息量：</p>
              <ul>
                <li>目标的绝对位置在所有地方都能读出（动作头输入处 ≈ .98）。在完整状态里，任何深度上相对位移都没有比绝对位置更突出。不存在随深度从“世界”到“控制”的转换。</li>
                <li>在 OFT 的 8 维因果空间里，相对位移<em>确实</em>比绝对位置强（+0.187，检验确认）。但同样大小的 PCA 和探针子空间也有同样的偏好，所以这不是因果坐标特有的性质。</li>
                <li>压缩是<strong>运动优先</strong>的：从 VLM 后几层的 32 维因果空间到动作 token 的 8 维因果空间，绝对位置被丢掉了，未来动作成为最富集的变量。</li>
                <li>因果空间中与几何对齐的那部分，替换时的表现和同样大小的随机部分一样。因果坐标更像是一个<strong>依赖动作阶段的运动编码</strong>，在 token 之间共享。</li>
                <li>动作是在最后一步 flow 才确定的，但几何信息并没有特别在那里被确定。而且约 64% 的帧里末端执行器根本不在头部相机视野内，所以头部相机本来就不可能提供相对末端的几何信息。</li>
              </ul>
              <p>最后，7 个事先登记的检验中有 2 个得到确认。</p>
            </>
          }
        />
        <Figure
          name="oft-compression"
          width={1702}
          height={711}
          alt="Semantic content of OFT causal spaces along the interface from late VLM to action tokens"
          en="Left: what each OFT causal space encodes. From the late-VLM k = 32 space (dark blue) to the action-token k = 8 space (red), absolute position (abs_p) drops while future action stays high."
          zh="左：OFT 各个因果空间编码了什么。从 VLM 后几层的 k = 32 空间（深蓝）到动作 token 的 k = 8 空间（红），绝对位置（abs_p）下降，未来动作保持在高位。"
        />
        <Figure
          name="world-control-motor-pca"
          width={1456}
          height={1439}
          alt="PCA of OFT late-VLM causal space, action-token causal space and action output, coloured by target position, displacement and action"
          en="Visual inspection only. PCA of the late-VLM causal space, the action-token causal space and the action output, coloured by target x, relative displacement and action PC1. The bottom row, colored by action, shows the clearest gradient at every stage."
          zh="仅作直观参考。对 VLM 后几层因果空间、动作 token 因果空间和动作输出做 PCA，分别按目标 x 坐标、相对位移和动作第一主成分着色。按动作着色的最下面一行，在每个阶段都呈现出最清晰的渐变。"
        />
        <Callout>
          <Bi
            en={<p><strong>Revised picture:</strong> A-Space is a <strong>motor-intent interface, not a geometry interface</strong>. The model does represent the world geometrically, everywhere, but the part that the head actually depends on is closer to “what the arm will do next, given the current phase of the task”.</p>}
            zh={<p><strong>修正后的图景：</strong>A-Space 是一个<strong>运动意图接口，而不是几何接口</strong>。模型确实在各处都以几何方式表示了世界，但动作头真正依赖的那部分，更接近“在任务当前阶段，手臂接下来要做什么”。</p>}
          />
        </Callout>
      </Section>

      <Section id="useful">
        <Bi
          en={<p>Finally, the engineer in me asked: can any of this make a frozen VLA better or faster without training? I tried five ideas. No weights were changed, all hyperparameters were chosen on validation, and every number is on held-out test pairs. Everything was <strong>open-loop</strong>, so none of this is a task-success claim.</p>}
          zh={<p>最后，我心里的工程师问：这些发现能不能在不训练的情况下，让一个冻结的 VLA 变得更好或更快？我试了五个想法。没有改动任何权重，所有超参数都在验证集上选择，所有数字都来自留出的测试样本对。全部是<strong>开环</strong>评估，所以都不能说明任务成功率。</p>}
        />
        <div className="post-table-wrap">
          <table className="post-table">
            <thead>
              <tr>
                <th><T en="Idea" zh="想法" /></th>
                <th><T en="What happened" zh="结果" /></th>
                <th><T en="Verdict" zh="结论" /></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><T en="Causal latent filtering: keep only the causal subspace to resist image corruption" zh="因果隐空间过滤：只保留因果子空间来抵抗图像扰动" /></td>
                <td><T en="Corruption drift lives inside the causal subspace (24–61× chance), so keeping it keeps the corruption. Validation picks “no filter” every time." zh="扰动造成的漂移恰好落在因果子空间里（是随机水平的 24–61 倍），保留它就保留了扰动。验证集每次都选择“不过滤”。" /></td>
                <td><T en="negative" zh="负结果" /></td>
              </tr>
              <tr>
                <td><T en="Commitment-aware flow routing: skip VLM cross-attention at early flow steps" zh="基于“晚决定”的 flow 路由：在早期 flow 步跳过对 VLM 的 cross-attention" /></td>
                <td><T en="Skipping step 0 is within seed noise; skipping the last step is catastrophic. −7.1% (PI) / −6.3% (GR00T) end-to-end GPU time; −12.7% / −11.9% with an exact KV cache." zh="跳过第 0 步在随机种子噪声范围内；跳过最后一步则是灾难性的。端到端 GPU 时间 −7.1%（PI）/ −6.3%（GR00T）；结合精确 KV cache 为 −12.7% / −11.9%。" /></td>
                <td><T en="small positive" zh="小幅正结果" /></td>
              </tr>
              <tr>
                <td><T en="Local causal action editing: nudge the action by editing causal coordinates" zh="局部因果动作编辑：通过修改因果坐标来微调动作" /></td>
                <td><T en="Best basis at 8 dims (13.3% vs 9.3% PCA), but end-effector requests almost never succeed, and at 32 dims PCA catches up." zh="8 维时是最好的基（13.3% 对 PCA 的 9.3%），但末端位置的编辑请求几乎从不成功，到 32 维时 PCA 追平。" /></td>
                <td><T en="mostly negative" zh="基本负结果" /></td>
              </tr>
              <tr>
                <td><T en="Causal seed selection: pick the flow noise whose causal latent is most typical" zh="因果种子选择：选择因果隐变量最“典型”的 flow 噪声" /></td>
                <td><T en="Slightly worse than random selection; even an oracle only has ~6–7% headroom." zh="比随机选择略差；即使是 oracle 也只有约 6–7% 的提升空间。" /></td>
                <td><T en="negative" zh="负结果" /></td>
              </tr>
              <tr>
                <td><T en="Causal latent cache: reuse the action when the causal latent barely changes" zh="因果隐变量缓存：因果隐变量变化很小时复用动作" /></td>
                <td><T en="Recomputing every other frame on a fixed schedule saves ~50% wall-clock at similar fidelity. The causal trigger loses to it." zh="按固定节奏隔一帧重算一次，就能在相近精度下节省约 50% 的时间，因果触发器比不过它。" /></td>
                <td><T en="negative" zh="负结果" /></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="post-figure-pair">
          <Figure
            name="corruption-drift"
            width={1170}
            height={546}
            alt="Corruption drift energy within each basis relative to chance, per corruption type"
            en="Why filtering fails: image corruptions push the state mostly inside the causal (and PCA) subspace."
            zh="过滤为什么失败：图像扰动主要把状态推向因果（以及 PCA）子空间内部。"
          />
          <Figure
            name="pi-step-drop"
            width={650}
            height={455}
            alt="PI action error when VLM conditioning is removed from different flow steps"
            en="PI: dropping VLM conditioning at step 0 is harmless (below the dashed seed-noise line); dropping it at step 3 is catastrophic."
            zh="PI：在第 0 步去掉 VLM 条件几乎无害（低于虚线表示的种子噪声）；在第 3 步去掉则是灾难性的。"
          />
        </div>
        <Bi
          en={<p>The honest summary: <strong>a representation that is mechanistically causal is not automatically a good handle for controlling inference</strong>. The one useful thing was the <em>temporal</em> finding, late commitment, not the subspaces themselves.</p>}
          zh={<p>诚实的总结：<strong>机制上“因果”的表示，并不会自动成为控制推理的好把手</strong>。唯一有用的是关于<em>时间</em>的发现，即“晚决定”，而不是子空间本身。</p>}
        />
      </Section>

      <Section id="lessons">
        <Bi
          en={
            <ol>
              <li><strong>Decodability is cheap and causality is expensive, and they disagree.</strong> Probe directions were nearly orthogonal to the directions the model uses. If I had stopped after Act I, I would have written a confident and wrong story.</li>
              <li><strong>“Where” and “when” mattered more than “which directions”.</strong> The cleanest results were about sites (action tokens) and time (the last flow step), not about any particular basis.</li>
              <li><strong>Controls change the conclusions.</strong> Shuffled donors move the floor from 0 to 0.5. Without the on-manifold rule, the flow heads would have had a tidy 4–8-dim subspace that is really just an off-manifold artifact. Random and PCA baselines of the same size killed several “discoveries”.</li>
              <li><strong>Preregistering hurts, in a good way.</strong> Writing down tests before running them meant I had to report that 5 of 7 tests in the last phase failed.</li>
              <li><strong>Check the plumbing.</strong> A pooling artifact looked like a finding. “Layer 36” turned out to mean “output of decoder layer 35, before the final norm”, which is what the heads read. A verify run once silently truncated a file. All numbers here were re-checked against the result tables.</li>
            </ol>
          }
          zh={
            <ol>
              <li><strong>可读性很便宜，因果性很昂贵，而且两者结论不一致。</strong>探针方向和模型真正使用的方向几乎正交。如果我在第一幕就停下，会写出一个自信但错误的故事。</li>
              <li><strong>“在哪里”和“什么时候”比“哪些方向”更重要。</strong>最干净的结果是关于位置（动作 token）和时间（最后一步 flow）的，而不是关于某个特定的基。</li>
              <li><strong>对照实验会改变结论。</strong>打乱供体把基线从 0 抬到了 0.5。如果没有流形约束，flow 头里会出现一个整齐的 4–8 维子空间，但它其实只是偏离流形造成的假象。同样大小的随机基和 PCA 基推翻了好几个“发现”。</li>
              <li><strong>事先登记假设很痛苦，但是好的那种痛苦。</strong>先把检验写下来再跑实验，意味着我必须如实报告最后一个阶段 7 个检验中有 5 个失败。</li>
              <li><strong>检查管道。</strong>一个池化假象看起来像发现；“第 36 层”实际上是“第 35 个 decoder 层的输出、在最终 norm 之前”，也就是动作头真正读取的东西；有一次验证运行悄悄截断了一个文件。这里的所有数字都对照结果表重新核对过。</li>
            </ol>
          }
        />
      </Section>

      <Section id="caveats">
        <Bi
          en={
            <>
              <ul>
                <li>One benchmark (RoboTwin, simulation), 10 tasks, 3000 samples, and one shared backbone. The three heads differ, but nothing here says how other backbones behave.</li>
                <li>Everything is open-loop: I measure how actions change, not whether the robot succeeds.</li>
                <li>Late commitment is tied to a 4-step Euler integrator. With more steps or a different solver, the picture may be smoother.</li>
                <li>Subspace coordinates outside OFT&apos;s action tokens are not unique across seeds, so I avoid interpreting individual directions.</li>
              </ul>
              <p>If you work on VLA interpretability, or you have ideas for turning “late commitment” into something more useful, I would love to chat. My email is on the <Link href="/">home page</Link>.</p>
            </>
          }
          zh={
            <>
              <ul>
                <li>只有一个基准（RoboTwin 仿真）、10 个任务、3000 个样本，以及一个共享的主干。三个动作头不同，但这里的结果不能说明其它主干会怎样。</li>
                <li>全部是开环评估：我测量的是动作怎么变，而不是机器人能否完成任务。</li>
                <li>“晚决定”与 4 步 Euler 积分器绑定。换成更多步数或不同的求解器，图景可能会更平滑。</li>
                <li>除了 OFT 动作 token 以外，其它位置的子空间坐标在不同种子之间并不唯一，所以我避免解读单个方向。</li>
              </ul>
              <p>如果你也在做 VLA 可解释性，或者有办法把“晚决定”变成更有用的东西，非常欢迎交流。我的邮箱在<Link href="/">主页</Link>上。</p>
            </>
          }
        />
      </Section>
    </div>
  );
}
