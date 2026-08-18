import { Profile, Paper, AcademicExperience, ResearchArea } from './types';

/**
 * ============================================================================
 * ACADEMIC PROFILE & PERSONAL INFORMATION
 * ============================================================================
 * 
 * INSTRUCTIONS FOR ASSET PATHS:
 * - `avatarUrl`: Reference a image file in `/public/data/` (e.g., "/data/avatar.jpg") or an external image URL.
 * - `cvUrl`: Reference a PDF file in `/public/data/` (e.g., "/data/cv.pdf") or an external URL.
 */
export const INITIAL_PROFILE: Profile = {
  name: "Moonjun Gong",
  title: "Ph.D Student",
  affiliation: "City University of Hong Kong",
  email: "Moonjungong@gmail.com",
  avatarUrl: "./data/avatar-transparent.png",
  bio: "I am a PhD student at the City University of Hong Kong, where I work under the supervision of Prof. Jiawei Ma. I received my bachelor's degree from Beijing University of Posts and Telecommunications.\n\nPrior to my doctoral studies, I gained extensive research experience, working with Yiming Li and advised by Prof. Chen Feng at New York University, followed by a position as a research assistant at Tsinghua University under the guidance of Prof. Hang Zhao.",
  researchInterests: "I'm driven by a big question: how can we build autonomous systems that don't just process the physical world, but truly understand it — perceiving, reasoning, and acting with the reliability and adaptability that humans bring to everyday life? A key area I aim to explore is explainable, generalizable, and robust representation learning.",
  googleScholar: "https://scholar.google.com/citations?user=9t65xl0AAAAJ&hl=en",
  linkedin: "https://www.linkedin.com/in/moonjun-gong-209183283/",
  twitter: "https://x.com/MoonjunGong",
  cvUrl: "./data/cv.pdf",
  websiteTitle: "Moonjun Gong",
  websiteIcon: ""
};

/**
 * ============================================================================
 * RESEARCH FOCUS AREAS
 * ============================================================================
 * 
 * INSTRUCTIONS FOR `iconName`:
 * You can specify any standard Lucide icon name (in PascalCase) for `iconName`.
 * Examples of popular Lucide icon names you can use:
 *   - "Users"         (People / Collaboration)
 *   - "Sparkles"      (AI / Magic / Innovation)
 *   - "Eye"           (Vision / XAI / Observation)
 *   - "Brain"         (Neural Networks / Cognition)
 *   - "Cpu"           (Hardware / Systems / Computing)
 *   - "Code"          (Software / Programming)
 *   - "BookOpen"      (Literature / Publishing)
 *   - "Globe"         (Web / Networks / Global)
 *   - "Search"        (Information Retrieval / Search)
 *   - "GraduationCap" (Education / Pedagogy)
 *   - "Lightbulb"     (Ideas / Creativity)
 *   - "Layers"        (Architectures / Abstractions)
 *   - "Compass"       (Navigation / Exploration)
 *   - "Database"      (Data Systems / Infrastructure)
 *   - "Terminal"      (Developer Tools / Command Line)
 *   - "Zap"           (Performance / High Speed)
 *   - "Shield"        (Security / Privacy / Alignment)
 *   - "Activity"      (Healthcare / Diagnostics / Signals)
 * 
 * If an unrecognized name is provided, it defaults gracefully to "BookOpen".
 * Browse all available icons at: https://lucide.dev/icons
 */
export const INITIAL_RESEARCH_AREAS: ResearchArea[] = [
  {
    id: "ra-1",
    title: "Reconstructing Dynamic Worlds",
    description: "How can machines build structured, persistent representations of complex, dynamic 3D environments from visual data?",
    iconName: "Eye"
  },
  {
    id: "ra-2",
    title: "Perceiving to Act",
    description: "How can autonomous systems perceive their environment and act within it reliably, even in unpredictable, real-world conditions?",
    iconName: "Brain"
  },
  {
    id: "ra-3",
    title: "Learning to Generalize",
    description: "What kinds of learned representations allow machines to generalize reliably across diverse, unseen conditions, and remain trustworthy?",
    iconName: "Sparkles"
  }
];

/**
 * ============================================================================
 * PUBLICATIONS & BIBLIOGRAPHY
 * ============================================================================
 * 
 * INSTRUCTIONS FOR `category`:
 * Must be one of the following exact string values:
 *   - "conference"  (ACM CHI, UIST, IUI, NeurIPS, ICML, etc.)
 *   - "journal"     (IEEE TVCG, ACM TOCHI, Nature, etc.)
 *   - "workshop"    (Workshop papers & extended abstracts)
 *   - "preprint"    (arXiv, bioRxiv, OpenReview preprints)
 * 
 * INSTRUCTIONS FOR `teaserImage`:
 *   - Reference any image file placed in public/data/ (e.g. "/data/paper1_teaser.jpg")
 *   - Or leave as undefined if no teaser image is needed.
 */
export const INITIAL_PAPERS: Paper[] = [
  {
    id: "pub-1",
    title: "CLM: Removing the GPU Memory Barrier for 3D Gaussian Splatting",
    authors: "Hexu Zhao, Xiwen Min, Xiaoteng Liu, Moonjun Gong, Yiming Li, Ang Li, Saining Xie, Jinyang Li, Aurojit Panda",
    journal: "ASPLOS 2026",
    year: 2026,
    category: "conference",
    featured: false,
    doi: "",
    teaserImage: "./data/clm.png",
    tags: ["Heterogeneous Systems", "Gaussian Splatting"],
    link: "https://dl.acm.org/doi/abs/10.1145/3779212.3790140",
    codeUrl: "https://github.com/nyu-systems/CLM-GS",
    abstract: "CLM overcomes GPU memory limits in 3D Gaussian Splatting by offloading Gaussians to CPU memory and dynamically streaming them during rendering. This enables real-time rendering of large-scale scenes (102M+ Gaussians) on a single consumer GPU (e.g., RTX 4090) with state-of-the-art quality.",
    bibtex: `@inproceedings{10.1145/3779212.3790140,
author = {Zhao, Hexu and Min, Xiwen and Liu, Xiaoteng and Gong, Moonjun and Li, Yiming and Li, Ang and Xie, Saining and Li, Jinyang and Panda, Aurojit},
title = {CLM: Removing the GPU Memory Barrier for 3D Gaussian Splatting},
year = {2026},
isbn = {9798400723599},
publisher = {Association for Computing Machinery},
address = {New York, NY, USA},
url = {https://doi.org/10.1145/3779212.3790140},
doi = {10.1145/3779212.3790140},
abstract = {3D Gaussian Splatting (3DGS) is an increasingly popular novel view synthesis approach due to its fast rendering time, and high-quality output. However, scaling 3DGS to large (or intricate) scenes is challenging due to its substantial memory requirement, which exceeds the memory capacity of most GPUs. In this paper, we describe CLM, a system that allows 3DGS to render large scenes using a single consumer-grade GPU, e.g., RTX4090. It does so by offloading Gaussians to CPU memory, and loading them into GPU memory only when necessary. To improve performance and reduce communication overheads, CLM uses a novel offloading strategy based on insights into 3DGS's memory access patterns. This strategy enables efficient pipelining, which overlaps GPU-to-CPU communication, GPU computation and CPU computation. Furthermore, CLM exploits these access patterns to reduce communication volume. Our evaluation shows that the resulting implementation can render a large scene that requires 102 million Gaussians on a single RTX4090 and achieve state-of-the-art reconstruction quality. The code is open-sourced at: https://github.com/nyu-systems/CLM-GS},
booktitle = {Proceedings of the 31st ACM International Conference on Architectural Support for Programming Languages and Operating Systems, Volume 2},
pages = {377–393},
numpages = {17},
keywords = {gpu memory offloading, heterogeneous systems for ml, 3d gaussian splatting},
location = {USA},
series = {ASPLOS '26}
}`
  },
  {
    id: "pub-2",
    title: "GS-Occ3D: Scaling Vision-only Occupancy Reconstruction with Gaussian Splatting",
    authors: "Baijun Ye, Minghui Qin, Saining Zhang, Moonjun Gong, Shaoting Zhu, Hao Zhao, Hang Zhao",
    journal: "ICCV 2025",
    year: 2025,
    category: "conference",
    featured: false,
    doi: "",
    teaserImage: "./data/gsocc.png",
    tags: ["3D Reconstruction", "Gaussian Splatting"],
    link: "https://arxiv.org/pdf/2507.19451",
    codeUrl: "https://gs-occ3d.github.io/",
    abstract: "GS-Occ3D leverages vision-only Gaussian Surfel reconstruction to generate scalable 3D occupancy labels without LiDAR, demonstrating state-of-the-art reconstruction quality and strong zero-shot generalization across driving benchmarks.",
    bibtex: `@InProceedings{Ye_2025_ICCV,
    author    = {Ye, Baijun and Qin, Minghui and Zhang, Saining and Gong, Moonjun and Zhu, Shaoting and Zhao, Hao and Zhao, Hang},
    title     = {GS-Occ3D: Scaling Vision-only Occupancy Reconstruction with Gaussian Splatting},
    booktitle = {Proceedings of the IEEE/CVF International Conference on Computer Vision (ICCV)},
    month     = {October},
    year      = {2025},
    pages     = {25925-25937}
}`
  },
  {
    id: "pub-3",
    title: "Multiagent Multitraversal Multimodal Self-Driving: Open MARS Dataset",
    authors: "Yiming Li, Zhiheng Li, Nuo Chen, Moonjun Gong, Zonglin Lyu, Zehong Wang, Peili Jiang, Chen Feng",
    journal: "CVPR 2024",
    year: 2024,
    category: "conference",
    featured: false,
    doi: "",
    teaserImage: "./data/mars.png",
    tags: ["Large-Scale Dataset", "Autonomous Driving"],
    link: "https://arxiv.org/pdf/2406.09383",
    codeUrl: "https://ai4ce.github.io/MARS/",
    huggingfaceUrl: "https://huggingface.co/datasets/ai4ce-drive/MARS",
    abstract: "MARS advances autonomous driving research by combining simultaneous multi-agent perception with asynchronous multi-traversals of the same environment across LiDAR and camera modalities.",
    bibtex: `@InProceedings{Li_2024_CVPR, author = {Li, Yiming and Li, Zhiheng and Chen, Nuo and Gong, Moonjun and Lyu, Zonglin and Wang, Zehong and Jiang, Peili and Feng, Chen}, title = {Multiagent Multitraversal Multimodal Self-Driving: Open MARS Dataset}, booktitle = {Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR)}, month = {June}, year = {2024}, pages = {22041-22051} } `
  },
  {
    id: "pub-4",
    title: "LiDAR-based 4D Occupancy Completion and Forecasting",
    authors: "Moonjun Gong*, Xinhao Liu*, Qi Fang, Haoyu Xie, Yiming Li, Hang Zhao, Chen Feng",
    journal: "IROS 2024",
    year: 2024,
    category: "conference",
    featured: false,
    doi: "",
    teaserImage: "./data/ocf.png",
    tags: ["Large-Scale Dataset", "Autonomous Driving", "3D Reconstruction"],
    link: "https://arxiv.org/pdf/2310.11239",
    codeUrl: "https://github.com/ai4ce/Occ4cast",
    huggingfaceUrl: "https://huggingface.co/datasets/ai4ce/OCFBench",
    abstract: "To bridge the gap between isolated scene completion and future prediction, OCF introduces a unified 4D perception framework that handles sparse-to-dense reconstruction and 3D-to-4D forecasting simultaneously.",
    bibtex: `@INPROCEEDINGS{10801302,
  author={Liu, Xinhao and Gong, Moonjun and Fang, Qi and Xie, Haoyu and Li, Yiming and Zhao, Hang and Feng, Chen},
  booktitle={2024 IEEE/RSJ International Conference on Intelligent Robots and Systems (IROS)}, 
  title={LiDAR-based 4D Occupancy Completion and Forecasting}, 
  year={2024},
  volume={},
  number={},
  pages={11102-11109},
  keywords={Training;Point cloud compression;Laser radar;Codes;Mobile agents;Robot sensing systems;Prediction algorithms;Forecasting;Autonomous vehicles;Intelligent robots},
  doi={10.1109/IROS58592.2024.10801302}}
`
  },
  {
    id: "pub-5",
    title: "SSCBench: A Large-Scale 3D Semantic Scene Completion Benchmark for Autonomous Driving",
    authors: "Moonjun Gong*, Yiming Li*, Sihang Li*, Xinhao Liu*, Kenan Li, Nuo Chen, Zijun Wang, Zhiheng Li, Tao Jiang, Fisher Yu, Yue Wang, Hang Zhao, Zhiding Yu, Chen Feng",
    journal: "IROS 2024",
    year: 2024,
    category: "conference",
    featured: false,
    doi: "10.48550/arXiv.2302.14589",
    teaserImage: "./data/sscbench.png",
    tags: ["Large-Scale Dataset", "Autonomous Driving", "3D Reconstruction"],
    link: "https://arxiv.org/pdf/2306.09001",
    codeUrl: "https://github.com/ai4ce/SSCBench",
    huggingfaceUrl: "https://huggingface.co/datasets/ai4ce-drive/SSCBench",
    abstract: "To resolve dataset scarcity and fragmentation in street-view semantic scene completion, SSCBench unifies major autonomous driving datasets into a standardized benchmark for cross-domain evaluation.",
    bibtex: `@INPROCEEDINGS{10802143,
  author={Li, Yiming and Li, Sihang and Liu, Xinhao and Gong, Moonjun and Li, Kenan and Chen, Nuo and Wang, Zijun and Li, Zhiheng and Jiang, Tao and Yu, Fisher and Wang, Yue and Zhao, Hang and Yu, Zhiding and Feng, Chen},
  booktitle={2024 IEEE/RSJ International Conference on Intelligent Robots and Systems (IROS)}, 
  title={SSCBench: A Large-Scale 3D Semantic Scene Completion Benchmark for Autonomous Driving}, 
  year={2024},
  volume={},
  number={},
  pages={13333-13340},
  keywords={Point cloud compression;Three-dimensional displays;Codes;Semantics;Benchmark testing;Robot sensing systems;Next generation networking;Intelligent robots;Autonomous vehicles;Automotive engineering},
  doi={10.1109/IROS58592.2024.10802143}}
`
  }
];

/**
 * ============================================================================
 * ACADEMIC EXPERIENCE & TIMELINE
 * ============================================================================
 * 
 * INSTRUCTIONS FOR `type`:
 * You MUST choose one of the following exact string values:
 *   - "education" (Degrees: B.S., M.S., Ph.D., Postdoc Fellowships, etc.)
 *   - "position"  (Academic & Industry Roles: Professor, Researcher, Intern, etc.)
 *   - "award"     (Honors & Grants: NSF Fellowships, Best Paper Awards, Scholarships, Grants)
 */
export const INITIAL_EXPERIENCES: AcademicExperience[] = [
  {
    id: "exp-1",
    role: "Ph.D. in Computer Science",
    institution: "City University of Hong Kong",
    duration: "2026 - Now",
    description: "",
    type: "education"
  },
  {
    id: "exp-2",
    role: "Research Assitant",
    institution: "Tsinghua University",
    duration: "2024 - 2024",
    description: "",
    type: "position"
  },
  {
    id: "exp-3",
    role: "B.S. in Artificial Intelligence",
    institution: "Beijing University of Posts and Telecommunications",
    duration: "2020 - 2024",
    description: "",
    type: "education"
  },
  {
    id: "exp-4",
    role: "Research Assistant",
    institution: "New York University",
    duration: "2023 - 2025",
    description: "",
    type: "position"
  }
];
