"use client";

import { motion } from 'motion/react';
import Link from 'next/link';
import {
  Search,
  MapPin,
  Briefcase,
  Users,
  Building2,
  CheckCircle,
  ArrowRight,
  Star,
  Quote,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// ─── Animation Variants ───────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};



// ─── Data ─────────────────────────────────────────────────────────────────────

const stats = [
  { value: '2,400+', label: 'Jobs Posted' },
  { value: '850+', label: 'Employers' },
  { value: '15,000+', label: 'Job Seekers' },
  { value: 'All', label: 'Provinces & Territories' },
];

const featuredJobs = [
  { title: 'Project Manager', company: 'Infrastructure Canada', location: 'Ottawa, ON', type: 'Full-time', typeColor: 'bg-[#7A9E7E]/20 text-[#4A7A4E]' },
  { title: 'Community Health Worker', company: 'First Nations Health Authority', location: 'Winnipeg, MB', type: 'Full-time', typeColor: 'bg-[#7A9E7E]/20 text-[#4A7A4E]' },
  { title: 'Environmental Technician', company: 'NWT Environment Dept.', location: 'Yellowknife, NT', type: 'Contract', typeColor: 'bg-[#C8782A]/15 text-[#8B4E10]' },
  { title: 'IT Support Specialist', company: 'Tsuut\'ina Nation', location: 'Calgary, AB', type: 'Full-time', typeColor: 'bg-[#7A9E7E]/20 text-[#4A7A4E]' },
  { title: 'Social Services Coordinator', company: 'Urban Native Youth Assoc.', location: 'Vancouver, BC', type: 'Part-time', typeColor: 'bg-[#6B3A2A]/15 text-[#6B3A2A]' },
  { title: 'Administrative Assistant', company: 'Métis Nation of Ontario', location: 'Toronto, ON', type: 'Full-time', typeColor: 'bg-[#7A9E7E]/20 text-[#4A7A4E]' },
];

const packages = [
  {
    name: 'Basic Job Posting',
    tagline: 'Get started with ease',
    features: ['Single job listing', '30-day active posting', 'Standard search visibility', 'Applicant email notifications'],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Featured Job Posting',
    tagline: 'Stand out from the crowd',
    features: ['Highlighted placement', '60-day active posting', 'Priority search results', 'Featured badge on listing', 'Applicant management tools'],
    cta: 'Post Featured',
    highlight: true,
    badge: 'Most Popular',
  },
  {
    name: 'Employer Branding',
    tagline: 'Build your Indigenous employer brand',
    features: ['Dedicated company profile page', 'Multiple job listings', 'Logo & banner placement', 'Indigenous hiring statement', 'Priority support'],
    cta: 'Build Your Brand',
    highlight: false,
  },
  {
    name: 'Monthly Hiring Support',
    tagline: 'Full-service hiring partnership',
    features: ['Unlimited job postings', 'Dedicated account support', 'Full applicant management', 'Monthly performance reports', 'Indigenous hiring consultation'],
    cta: 'Contact Us',
    highlight: false,
  },
];

const testimonials = [
  {
    quote: 'Aboriginal Jobs Canada helped me find a meaningful career close to home. The platform truly understands what Indigenous job seekers need.',
    name: 'Sarah T.',
    role: 'Community Health Worker',
    location: 'Saskatchewan',
  },
  {
    quote: 'As an employer committed to reconciliation, Aboriginal Jobs Canada connected us with incredible Indigenous talent we wouldn\'t have found anywhere else.',
    name: 'Marcus L.',
    role: 'HR Director',
    location: 'British Columbia',
  },
  {
    quote: 'Finally, a job board that feels like it was built for us. The process was simple, respectful, and I landed a great opportunity.',
    name: 'Jordan B.',
    role: 'Environmental Technician',
    location: 'Northwest Territories',
  },
];

// ─── Decorative SVG ───────────────────────────────────────────────────────────

function OrganicShape({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="1" opacity="0.15" />
      <circle cx="200" cy="200" r="130" stroke="currentColor" strokeWidth="1" opacity="0.12" />
      <circle cx="200" cy="200" r="80" stroke="currentColor" strokeWidth="1.5" opacity="0.1" />
      <circle cx="200" cy="200" r="30" fill="currentColor" opacity="0.08" />
      <path d="M200 20 Q280 100 200 200 Q120 100 200 20Z" fill="currentColor" opacity="0.06" />
      <path d="M380 200 Q300 280 200 200 Q300 120 380 200Z" fill="currentColor" opacity="0.06" />
      <path d="M200 380 Q120 300 200 200 Q280 300 200 380Z" fill="currentColor" opacity="0.06" />
      <path d="M20 200 Q100 120 200 200 Q100 280 20 200Z" fill="currentColor" opacity="0.06" />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      {/* ── 1. HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[92vh] flex items-center">
        {/* Background image */}
        <img
          src="/airo-assets/images/pages/home/hero"
          alt="Indigenous professionals across Canada"
          className="absolute inset-0 w-full h-full object-cover object-center"
          fetchPriority="high"
        />
        {/* Dark gradient overlay — left heavy so text is readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/85 via-gray-900/60 to-gray-900/20" />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900/50 to-transparent" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="max-w-2xl"
          >
            <motion.p
              variants={fadeUp}
              className="text-[#C8782A] font-semibold text-sm uppercase tracking-widest mb-5 flex items-center gap-2"
            >
              <span className="inline-block w-8 h-px bg-[#C8782A]" />
              Canada's Indigenous Job Platform
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Your Career
              <br />
              <span className="text-[#C8782A]">Starts Here.</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-lg text-white/80 leading-relaxed mb-10 max-w-xl"
            >
              Connecting First Nations, Métis, and Inuit job seekers with inclusive employers across every province and territory in Canada.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              variants={fadeUp}
              className="bg-white rounded-2xl shadow-2xl p-2 flex flex-col sm:flex-row gap-2 max-w-2xl mb-8"
            >
              <div className="flex items-center gap-2 flex-1 px-3">
                <Search size={18} className="text-[#C8782A] flex-shrink-0" />
                <Input
                  placeholder="Job title, keyword, or company"
                  className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-[#1C1C1C] placeholder:text-[#1C1C1C]/40"
                />
              </div>
              <div className="w-px bg-[#C8782A]/20 hidden sm:block" />
              <div className="flex items-center gap-2 flex-1 px-3">
                <MapPin size={18} className="text-[#C8782A] flex-shrink-0" />
                <Input
                  placeholder="City, province, or territory"
                  className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-[#1C1C1C] placeholder:text-[#1C1C1C]/40"
                />
              </div>
              <Button className="bg-[#C8782A] hover:bg-[#B06820] text-white font-semibold px-6 rounded-xl shrink-0">
                Search Jobs
              </Button>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              <Link href="/job-seekers">
                <Button
                  size="lg"
                  className="bg-[#C8782A] hover:bg-[#B06820] text-white font-semibold px-8 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
                >
                  Find Jobs
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
              <Link href="/post-a-job">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-[#6B3A2A] font-semibold px-8 transition-all duration-200 hover:-translate-y-0.5 bg-transparent"
                >
                  Post a Job
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats Row — bottom of hero */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-2xl"
          >
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={fadeUp} className="text-left">
                <p className="text-3xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {stat.value}
                </p>
                <p className="text-sm text-white/60 mt-0.5">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 2. DUAL CTA SPLIT ───────────────────────────────────────────────── */}
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Job Seekers Card — larger */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(200,120,42,0.2)' }}
              className="lg:col-span-3 bg-[#C8782A] rounded-3xl p-10 lg:p-12 relative overflow-hidden cursor-pointer"
            >
              <OrganicShape className="absolute -right-16 -bottom-16 w-72 h-72 text-white pointer-events-none" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 mb-6">
                  <Users size={14} className="text-white" />
                  <span className="text-white text-xs font-semibold uppercase tracking-wider">For Job Seekers</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                  I'm Looking for Work
                </h2>
                <p className="text-white/80 mb-8 leading-relaxed max-w-md">
                  Discover opportunities with employers who value Indigenous talent and are committed to inclusive, respectful workplaces.
                </p>
                <ul className="flex flex-col gap-3 mb-8">
                  {['Search thousands of jobs across Canada', 'Create your free professional profile', 'Upload your resume and apply online', 'Set up personalized job alerts'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-white/90 text-sm">
                      <CheckCircle size={16} className="text-white flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-white text-[#C8782A] hover:bg-[#FAF5EE] font-semibold px-8 shadow-md"
                  >
                    Get Started Free
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Employers Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.12 }}
              whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(107,58,42,0.25)' }}
              className="lg:col-span-2 bg-[#6B3A2A] rounded-3xl p-10 lg:p-12 relative overflow-hidden cursor-pointer"
            >
              <OrganicShape className="absolute -right-16 -bottom-16 w-64 h-64 text-white pointer-events-none" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 mb-6">
                  <Building2 size={14} className="text-white" />
                  <span className="text-white text-xs font-semibold uppercase tracking-wider">For Employers</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                  I'm Hiring Indigenous Talent
                </h2>
                <p className="text-white/80 mb-8 leading-relaxed">
                  Connect with skilled Indigenous job seekers and build a workforce that reflects the richness of Canada.
                </p>
                <ul className="flex flex-col gap-3 mb-8">
                  {['Post jobs to a targeted audience', 'Manage applicants in one place', 'Featured listings for more visibility', 'Indigenous hiring support & resources'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-white/90 text-sm">
                      <CheckCircle size={16} className="text-white flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/post-a-job">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-[#6B3A2A] font-semibold px-8 transition-all duration-200"
                  >
                    Post a Job
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 3. FEATURED JOBS ────────────────────────────────────────────────── */}
      <section className="bg-[#FAF5EE] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.p variants={fadeUp} className="text-[#C8782A] font-semibold text-sm uppercase tracking-widest mb-3">
              Opportunities Await
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-4xl lg:text-5xl font-bold text-[#1C1C1C]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Latest Opportunities
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {featuredJobs.map((job) => (
              <motion.div
                key={job.title + job.location}
                variants={fadeUp}
                whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(107,58,42,0.12)' }}
                className="bg-white rounded-2xl p-6 border border-[#C8782A]/10 cursor-pointer transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#C8782A]/10 flex items-center justify-center flex-shrink-0">
                    <Briefcase size={18} className="text-[#C8782A]" />
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${job.typeColor}`}>
                    {job.type}
                  </span>
                </div>
                <h3 className="font-bold text-[#1C1C1C] text-lg mb-1 leading-snug">{job.title}</h3>
                <p className="text-[#6B3A2A] text-sm font-medium mb-2">{job.company}</p>
                <div className="flex items-center gap-1.5 text-[#1C1C1C]/50 text-sm mb-5">
                  <MapPin size={13} />
                  <span>{job.location}</span>
                </div>
                <Link href="/job-seekers"
                  className="inline-flex items-center gap-1.5 text-[#C8782A] text-sm font-semibold hover:gap-2.5 transition-all duration-200"
                >
                  Apply Now <ArrowRight size={14} />
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-10"
          >
            <Link href="/job-seekers">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-[#C8782A] text-[#C8782A] hover:bg-[#C8782A] hover:text-white font-semibold px-10 transition-all duration-200"
              >
                View All Jobs
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── 4. HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-14"
          >
            <motion.p variants={fadeUp} className="text-[#7A9E7E] font-semibold text-sm uppercase tracking-widest mb-3">
              How It Works
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-4xl lg:text-5xl font-bold text-[#1C1C1C]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Simple. Respectful. Effective.
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Job Seekers Steps */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="bg-[#FAF5EE] rounded-3xl p-8 lg:p-10"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-[#C8782A]/15 flex items-center justify-center">
                  <Users size={18} className="text-[#C8782A]" />
                </div>
                <h3 className="text-xl font-bold text-[#1C1C1C]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  For Job Seekers
                </h3>
              </div>
              <div className="flex flex-col gap-7">
                {[
                  { step: '01', title: 'Create your free profile', desc: 'Sign up in minutes and build a profile that showcases your skills, experience, and aspirations.' },
                  { step: '02', title: 'Search and apply for jobs', desc: 'Browse thousands of opportunities from inclusive employers across Canada and apply with ease.' },
                  { step: '03', title: 'Connect with inclusive employers', desc: 'Hear back from employers who are genuinely committed to Indigenous hiring and reconciliation.' },
                ].map((item) => (
                  <motion.div key={item.step} variants={fadeUp} className="flex gap-5">
                    <div className="w-10 h-10 rounded-full bg-[#C8782A] text-white text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1C1C1C] mb-1">{item.title}</h4>
                      <p className="text-sm text-[#6B3A2A]/70 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-8">
                <Link href="/register">
                  <Button className="bg-[#C8782A] hover:bg-[#B06820] text-white font-semibold">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Employers Steps */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="bg-[#6B3A2A]/5 rounded-3xl p-8 lg:p-10 border border-[#6B3A2A]/10"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-[#6B3A2A]/15 flex items-center justify-center">
                  <Building2 size={18} className="text-[#6B3A2A]" />
                </div>
                <h3 className="text-xl font-bold text-[#1C1C1C]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  For Employers
                </h3>
              </div>
              <div className="flex flex-col gap-7">
                {[
                  { step: '01', title: 'Choose your package', desc: 'Select from flexible packages designed to fit your hiring needs — from a single posting to full monthly support.' },
                  { step: '02', title: 'Post your job listing', desc: 'Create a compelling job listing that reaches thousands of qualified Indigenous job seekers across Canada.' },
                  { step: '03', title: 'Review applications and hire', desc: 'Manage applicants through your dashboard, connect with candidates, and build your inclusive team.' },
                ].map((item) => (
                  <motion.div key={item.step} variants={fadeUp} className="flex gap-5">
                    <div className="w-10 h-10 rounded-full bg-[#6B3A2A] text-white text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1C1C1C] mb-1">{item.title}</h4>
                      <p className="text-sm text-[#6B3A2A]/70 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-8">
                <Link href="/post-a-job">
                  <Button className="bg-[#6B3A2A] hover:bg-[#5A2F1F] text-white font-semibold">
                    Post a Job
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 5. PACKAGES PREVIEW ─────────────────────────────────────────────── */}
      <section className="bg-[#FAF5EE] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.p variants={fadeUp} className="text-[#C8782A] font-semibold text-sm uppercase tracking-widest mb-3">
              Employer Packages
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-4xl lg:text-5xl font-bold text-[#1C1C1C]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Packages for Every Hiring Need
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[#6B3A2A]/70 mt-4 max-w-xl mx-auto">
              Whether you're posting your first job or building a long-term Indigenous hiring strategy, we have a package for you.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-start"
          >
            {packages.map((pkg) => (
              <motion.div
                key={pkg.name}
                variants={fadeUp}
                whileHover={{ y: -5, boxShadow: pkg.highlight ? '0 20px 50px rgba(200,120,42,0.3)' : '0 12px 30px rgba(107,58,42,0.12)' }}
                className={`rounded-2xl p-7 relative transition-shadow duration-200 ${pkg.highlight
                  ? 'bg-[#C8782A] text-white ring-2 ring-[#C8782A] shadow-xl lg:-mt-4 lg:mb-4'
                  : 'bg-white border border-[#C8782A]/10'
                  }`}
              >
                {pkg.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-[#6B3A2A] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md whitespace-nowrap">
                      {pkg.badge}
                    </span>
                  </div>
                )}
                <div className={`w-10 h-10 rounded-xl mb-5 flex items-center justify-center ${pkg.highlight ? 'bg-white/20' : 'bg-[#C8782A]/10'}`}>
                  <Star size={18} className={pkg.highlight ? 'text-white' : 'text-[#C8782A]'} />
                </div>
                <h3 className={`font-bold text-lg mb-1 ${pkg.highlight ? 'text-white' : 'text-[#1C1C1C]'}`} style={{ fontFamily: "'Playfair Display', serif" }}>
                  {pkg.name}
                </h3>
                <p className={`text-sm mb-5 ${pkg.highlight ? 'text-white/75' : 'text-[#6B3A2A]/60'}`}>
                  {pkg.tagline}
                </p>
                <ul className="flex flex-col gap-2.5 mb-7">
                  {pkg.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2.5 text-sm ${pkg.highlight ? 'text-white/90' : 'text-[#1C1C1C]/70'}`}>
                      <CheckCircle size={14} className={`flex-shrink-0 mt-0.5 ${pkg.highlight ? 'text-white' : 'text-[#7A9E7E]'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/pricing">
                  <Button
                    className={`w-full font-semibold transition-all duration-200 ${pkg.highlight
                      ? 'bg-white text-[#C8782A] hover:bg-[#FAF5EE]'
                      : 'bg-[#C8782A] hover:bg-[#B06820] text-white'
                      }`}
                  >
                    {pkg.cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center mt-10"
          >
            <Link href="/pricing">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-[#C8782A] text-[#C8782A] hover:bg-[#C8782A] hover:text-white font-semibold px-10 transition-all duration-200"
              >
                View All Packages
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── 6. WHY CYBERNEST ────────────────────────────────────────────────── */}
      <section className="bg-[#6B3A2A] py-16 lg:py-24 relative overflow-hidden">
        <OrganicShape className="absolute -left-32 top-1/2 -translate-y-1/2 w-96 h-96 text-[#C8782A] pointer-events-none" />
        <OrganicShape className="absolute -right-32 top-1/2 -translate-y-1/2 w-80 h-80 text-white pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-14"
          >
            <motion.p variants={fadeUp} className="text-[#C8782A] font-semibold text-sm uppercase tracking-widest mb-3">
              Why Aboriginal Jobs Canada
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-4xl lg:text-5xl font-bold text-[#FAF5EE]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Built for Indigenous Canada
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {[
              {
                num: '01',
                title: 'Dedicated Platform',
                desc: 'The only job board built exclusively for Indigenous job seekers and inclusive employers across Canada — not an afterthought, but a purpose-built community.',
              },
              {
                num: '02',
                title: 'Culturally Respectful',
                desc: 'Every feature is designed with sensitivity to the diverse cultures, traditions, and communities of First Nations, Métis, and Inuit Peoples across Turtle Island.',
              },
              {
                num: '03',
                title: 'Canada-Wide Reach',
                desc: 'Connecting talent and opportunity from coast to coast to coast — in every province and territory, from urban centres to remote and northern communities.',
              },
            ].map((item) => (
              <motion.div
                key={item.num}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="bg-white/8 border border-white/10 rounded-2xl p-8 backdrop-blur-sm"
              >
                <p className="text-[#C8782A] text-5xl font-bold mb-5 opacity-60" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {item.num}
                </p>
                <h3 className="text-xl font-bold text-[#FAF5EE] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {item.title}
                </h3>
                <p className="text-[#FAF5EE]/65 leading-relaxed text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 7. TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.p variants={fadeUp} className="text-[#7A9E7E] font-semibold text-sm uppercase tracking-widest mb-3">
              Community Stories
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-4xl lg:text-5xl font-bold text-[#1C1C1C]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Voices from Our Community
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {testimonials.map((t) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(107,58,42,0.1)' }}
                className="bg-[#FAF5EE] rounded-2xl p-8 border border-[#C8782A]/10 transition-shadow duration-200"
              >
                <Quote size={32} className="text-[#C8782A] mb-5 opacity-60" />
                <p className="text-[#1C1C1C]/80 leading-relaxed mb-6 italic">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#C8782A]/15 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#C8782A] font-bold text-sm">{t.name[0]}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#1C1C1C] text-sm">{t.name}</p>
                    <p className="text-[#6B3A2A]/60 text-xs">{t.role} · {t.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 8. FINAL CTA BANNER ─────────────────────────────────────────────── */}
      <section className="bg-[#C8782A] py-16 lg:py-20 relative overflow-hidden">
        <OrganicShape className="absolute -left-20 top-1/2 -translate-y-1/2 w-80 h-80 text-white pointer-events-none" />
        <OrganicShape className="absolute -right-20 top-1/2 -translate-y-1/2 w-96 h-96 text-[#6B3A2A] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2
              variants={fadeUp}
              className="text-4xl lg:text-5xl font-bold text-white mb-5"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Ready to Take the Next Step?
            </motion.h2>
            <motion.p variants={fadeUp} className="text-white/80 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Whether you're searching for your next opportunity or building an inclusive team — Aboriginal Jobs Canada is here for you.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center">
              <Link href="/job-seekers">
                <Button
                  size="lg"
                  className="bg-white text-[#C8782A] hover:bg-[#FAF5EE] font-semibold px-10 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                >
                  Find Jobs
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
              <Link href="/post-a-job">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-[#C8782A] font-semibold px-10 transition-all duration-200 hover:-translate-y-0.5"
                >
                  Post a Job
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="ghost"
                  className="text-white hover:bg-white/15 font-semibold px-8 transition-all duration-200"
                >
                  Contact Aboriginal Jobs Canada
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
