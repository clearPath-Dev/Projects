# Your Paper Digest — 2025-09-30

**Topics:** computational linguistics, neuroscience
**Reader level:** Intermediate
**How to read:** Read abstract → intro → figures → discussion. Note unfamiliar terms for later.

---


### 1) Brain Harmony: A Multimodal Foundation Model Unifying Morphology and
  Function into 1D Tokens
- **Authors:** Zijian Dong, Ruilin Li, Joanna Su Xian Chong, Niousha Dehestani, Yinghui Teng, Yi Lin, Zhizhou Li, Yichi Zhang, Yapei Xie, Leon Qi Rong Ooi, B. T. Thomas Yeo, Juan Helen Zhou
- **Published:** 2025-09-29
- **Category:** q-bio.NC
- **Link:** http://arxiv.org/abs/2509.24693v1
- **PDF:** http://arxiv.org/pdf/2509.24693v1

**Why it matters:** This work is relevant because it addresses: We present Brain Harmony (BrainHarmonix), the first multimodal brain foundation model that unifies structural morphology and functional dynamics into compact 1D token representations.

**Abstract**
> We present Brain Harmony (BrainHarmonix), the first multimodal brain
foundation model that unifies structural morphology and functional dynamics
into compact 1D token representations. The model was pretrained on two of the
largest neuroimaging datasets to date, encompassing 64,594 T1-weighted
structural MRI 3D volumes (~ 14 million images) and 70,933 functional MRI
(fMRI) time series. BrainHarmonix is grounded in two foundational neuroscience
principles: structure complements function - structural and functional
modalities offer distinct yet synergistic insights into brain organization;
function follows structure - brain functional dynamics are shaped by cortical
morphology. The modular pretraining process involves single-modality training
with geometric pre-alignment followed by modality fusion through shared brain
hub tokens. Notably, our dynamics encoder uniquely handles fMRI time series
with heterogeneous repetition times (TRs), addressing a major limitation in
existing models. BrainHarmonix is also the first to deeply compress
high-dimensional neuroimaging signals into unified, continuous 1D tokens,
forming a compact latent space of the human brain. BrainHarmonix achieves
strong generalization across diverse downstream tasks, including
neurodevelopmental and neurodegenerative disorder classification and cognition
prediction - consistently outperforming previous approaches. Our models -
pretrained on 8 H100 GPUs - aim to catalyze a new era of AI-driven neuroscience
powered by large-scale multimodal neuroimaging.

---


### 2) Inducing Dyslexia in Vision Language Models
- **Authors:** Melika Honarmand, Ayati Sharma, Badr AlKhamissi, Johannes Mehrer, Martin Schrimpf
- **Published:** 2025-09-29
- **Category:** cs.CL
- **Link:** http://arxiv.org/abs/2509.24597v1
- **PDF:** http://arxiv.org/pdf/2509.24597v1

**Why it matters:** This work is relevant because it addresses: Dyslexia, a neurodevelopmental disorder characterized by persistent reading difficulties, is often linked to reduced activity of the visual word form area in the ventral occipito-temporal cortex.

**Abstract**
> Dyslexia, a neurodevelopmental disorder characterized by persistent reading
difficulties, is often linked to reduced activity of the visual word form area
in the ventral occipito-temporal cortex. Traditional approaches to studying
dyslexia, such as behavioral and neuroimaging methods, have provided valuable
insights but remain limited in their ability to test causal hypotheses about
the underlying mechanisms of reading impairments. In this study, we use
large-scale vision-language models (VLMs) to simulate dyslexia by functionally
identifying and perturbing artificial analogues of word processing. Using
stimuli from cognitive neuroscience, we identify visual-word-form-selective
units within VLMs and demonstrate that targeted ablation of these units, unlike
ablation of random units, leads to selective impairments in reading tasks while
general visual and language comprehension abilities remain intact. In
particular, the resulting model matches dyslexic humans' phonological deficits
without a significant change in orthographic processing. Taken together, our
modeling results replicate key characteristics of dyslexia and establish a
computational framework for investigating reading disorders.

---


### 3) Hybrid Layer-Wise ANN-SNN With Surrogate Spike Encoding-Decoding
  Structure
- **Authors:** Nhan T. Luu, Duong T. Luu, Pham Ngoc Nam, Truong Cong Thang
- **Published:** 2025-09-29
- **Category:** cs.NE
- **Link:** http://arxiv.org/abs/2509.24411v1
- **PDF:** http://arxiv.org/pdf/2509.24411v1

**Why it matters:** This work is relevant because it addresses: Spiking Neural Networks (SNNs) have gained significant traction in both computational neuroscience and artificial intelligence for their potential in energy-efficient computing.

**Abstract**
> Spiking Neural Networks (SNNs) have gained significant traction in both
computational neuroscience and artificial intelligence for their potential in
energy-efficient computing. In contrast, artificial neural networks (ANNs)
excel at gradient-based optimization and high accuracy. This contrast has
consequently led to a growing subfield of hybrid ANN-SNN research. However,
existing hybrid approaches often rely on either a strict separation between ANN
and SNN components or employ SNN-only encoders followed by ANN classifiers due
to the constraints of non-differentiability of spike encoding functions,
causing prior hybrid architectures to lack deep layer-wise cooperation during
backpropagation. To address this gap, we propose a novel hybrid ANN-SNN
framework that integrates layer-wise encode-decode SNN blocks within
conventional ANN pipelines. Central to our method is the use of surrogate
gradients for a bit-plane-based spike encoding function, enabling end-to-end
differentiable training across ANN and SNN layers. This design achieves
competitive accuracy with state-of-the-art pure ANN and SNN models while
retaining the potential efficiency and temporal representation benefits of
spiking computation. To the best of our knowledge, this is the first
implementation of a surrogate gradient for bit plane coding specifically and
spike encoder interface in general to be utilized in the context of hybrid
ANN-SNN, successfully leading to a new class of hybrid models that pave new
directions for future research.

