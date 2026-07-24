/**
 * Type declarations for the Academic Portfolio application
 */

export interface Profile {
  name: string;
  title: string;
  affiliation: string;
  email: string;
  avatarUrl: string;
  bio: string;
  researchInterests: string;
  googleScholar: string;
  linkedin: string;
  twitter: string;
  cvUrl: string;
  websiteTitle?: string;
  websiteIcon?: string;
}

export interface Paper {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  abstract: string;
  link: string;
  codeUrl?: string;
  huggingfaceUrl?: string;
  huggingface?: string;
  tags: string[];
  category: 'journal' | 'conference' | 'workshop' | 'preprint';
  doi?: string;
  bibtex: string;
  featured?: boolean;
  teaserImage?: string;
}

export interface AcademicExperience {
  id: string;
  role: string;
  institution: string;
  duration: string;
  description: string;
  type: 'education' | 'position' | 'award';
}

export interface ResearchArea {
  id: string;
  title: string;
  description: string;
  iconName: string; // references lucide icons dynamically
}
