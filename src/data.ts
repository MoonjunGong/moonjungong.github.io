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
  avatarUrl: "./data/avatar.jpg",
  bio: "I am a PhD student at the City University of Hong Kong, where I work under the supervision of Prof. Jiawei Ma. I received my bachelor's degree from Beijing University of Posts and Telecommunications. Prior to my doctoral studies, I gained extensive research experience, working with Yiming Li and advised by Prof. Chen Feng at New York University, followed by a position as a research assistant at Tsinghua University under the guidance of Prof. Hang Zhao.",
  researchInterests: "I'm driven by a big question: how can we build autonomous systems that don't just process the physical world, but truly understand it — perceiving, reasoning, and acting with the reliability and adaptability that humans bring to everyday life? A key area I aim to explore is explainable, generalizable, and robust representation learning.",
  googleScholar: "https://scholar.google.com/citations?user=9t65xl0AAAAJ&hl=en",
  linkedin: "https://www.linkedin.com/in/moonjun-gong-209183283/",
  twitter: "https://x.com/MoonjunGong",
  cvUrl: "./data/cv.pdf",
  websiteTitle: "Moonjun Gong",
  websiteIcon: "Bookopen"
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
    abstract: "3D Gaussian Splatting (3DGS) is an increasingly popular novel view synthesis approach due to its fast rendering time, and high-quality output. However, scaling 3DGS to large (or intricate) scenes is challenging due to its substantial memory requirement, which exceeds the memory capacity of most GPUs. In this paper, we describe CLM, a system that allows 3DGS to render large scenes using a single consumer-grade GPU, e.g., RTX4090. It does so by offloading Gaussians to CPU memory, and loading them into GPU memory only when necessary. To improve performance and reduce communication overheads, CLM uses a novel offloading strategy based on insights into 3DGS's memory access patterns. This strategy enables efficient pipelining, which overlaps GPU-to-CPU communication, GPU computation and CPU computation. Furthermore, CLM exploits these access patterns to reduce communication volume. Our evaluation shows that the resulting implementation can render a large scene that requires 102 million Gaussians on a single RTX4090 and achieve state-of-the-art reconstruction quality. The code is open-sourced at: https://github.com/nyu-systems/CLM-GS",
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
    abstract: "Occupancy is crucial for autonomous driving, providing essential geometric priors for perception and planning. However, existing methods predominantly rely on LiDAR-based occupancy annotations, which limits scalability and prevents leveraging vast amounts of potential crowdsourced data for auto-labeling. To address this, we propose GS-Occ3D, a scalable vision-only framework that directly reconstructs occupancy. Vision-only occupancy reconstruction poses significant challenges due to sparse viewpoints, dynamic scene elements, severe occlusions, and long-horizon motion. Existing vision-based methods primarily rely on mesh representation, which suffer from incomplete geometry and additional post-processing, limiting scalability. To overcome these issues, GS-Occ3D optimizes an explicit occupancy representation using an Octree-based Gaussian Surfel formulation, ensuring efficiency and scalability. Additionally, we decompose scenes into static background, ground, and dynamic objects, enabling tailored modeling strategies: (1) Ground is explicitly reconstructed as a dominant structural element, significantly improving large-area consistency; (2) Dynamic vehicles are separately modeled to better capture motion-related occupancy patterns. Extensive experiments on the Waymo dataset demonstrate that GS-Occ3D achieves state-of-the-art geometry reconstruction results. By curating vision-only binary occupancy labels from diverse urban scenes, we show their effectiveness for downstream occupancy models on Occ3D-Waymo and superior zero-shot generalization on Occ3D-nuScenes. It highlights the potential of large-scale vision-based occupancy reconstruction as a new paradigm for scalable auto-labeling.",
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
    abstract: "Large-scale datasets have fueled recent advancements in AI-based autonomous vehicle research. However these datasets are usually collected from a single vehicle's one-time pass of a certain location lacking multiagent interactions or repeated traversals of the same place. Such information could lead to transformative enhancements in autonomous vehicles' perception prediction and planning capabilities. To bridge this gap in collaboration with the self-driving company May Mobility we present the MARS dataset which unifies scenarios that enable MultiAgent multitraveRSal and multimodal autonomous vehicle research. More specifically MARS is collected with a fleet of autonomous vehicles driving within a certain geographical area. Each vehicle has its own route and different vehicles may appear at nearby locations. Each vehicle is equipped with a LiDAR and surround-view RGB cameras. We curate two subsets in MARS: one facilitates collaborative driving with multiple vehicles simultaneously present at the same location and the other enables memory retrospection through asynchronous traversals of the same location by multiple vehicles. We conduct experiments in place recognition and neural reconstruction. More importantly MARS introduces new research opportunities and challenges such as multitraversal 3D reconstruction multiagent perception and unsupervised object discovery. Our data and codes can be found at https://ai4ce.github.io/MARS/.",
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
    abstract: "Scene completion and forecasting are two popular perception problems in research for mobile agents like autonomous vehicles. Existing approaches treat the two problems in isolation, resulting in a separate perception of the two aspects. In this paper, we introduce a novel LiDAR perception task of Occupancy Completion and Forecasting (OCF) in the context of autonomous driving to unify these aspects into a cohesive framework. This task requires new algorithms to address three challenges altogether: (1) sparse-to-dense reconstruction, (2) partial-to-complete hallucination, and (3) 3D-to-4D prediction. To enable supervision and evaluation, we curate a large-scale dataset termed OCFBench from public autonomous driving datasets. We analyze the performance of closely related existing baselines and variants on our dataset. We envision that this research will inspire and call for further investigation in this evolving and crucial area of 4D perception. Our code for data curation and baseline implementation is available at https://github.com/ai4ce/Occ4cast.",
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
    abstract: "Monocular scene understanding is a foundational component of autonomous systems. Within the spectrum of monocular perception topics, one crucial and useful task for holistic 3D scene understanding is semantic scene completion (SSC), which jointly completes semantic information and geometric details from RGB input. However, progress in SSC, particularly in large-scale street views, is hindered by the scarcity of high-quality datasets. To address this issue, we introduce SSCBench, a comprehensive benchmark that integrates scenes from widely used automotive datasets (e.g., KITTI-360, nuScenes, and Waymo). SSCBench follows an established setup and format in the community, facilitating the easy exploration of SSC methods in various street views. We benchmark models using monocular, trinocular, and point cloud input to assess the performance gap resulting from sensor coverage and modality. Moreover, we have unified semantic labels across diverse datasets to simplify cross-domain generalization testing. We commit to including more datasets and SSC models to drive further advancements in this field. Our data and code are available at https://github.com/ai4ce/SSCBench.",
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
    role: "B.S. in Artificial Intelligence",
    institution: "Beijing University of Posts and Telecommunications",
    duration: "2020 - 2024",
    description: "",
    type: "education"
  }
];
