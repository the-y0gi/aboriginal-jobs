"use client";

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@/components/Spinner';
import {
  MapPin, Clock, DollarSign, Building2, Globe,
  Mail, ChevronRight, Wifi, Leaf, Calendar,
  CheckCircle, ArrowLeft, Share2, Bookmark,
  BookmarkCheck,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getJobById, JOBS, postedLabel, type Job } from '@/lib/jobs-data';
import ApplyModal from '@/components/ApplyModal';

/* ── Animations ─────────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };

/* ── Related job card ───────────────────────────────────────────────── */
function RelatedCard({ job }: { job: Job }) {
  return (
    <Link href={`/jobs/${job.id}`}
      className="group flex gap-3 p-4 rounded-xl border border-[#C8782A]/10 hover:border-[#C8782A]/30 hover:bg-[#FAF5EE]/50 transition-all duration-200"
    >
      <div className="w-9 h-9 rounded-lg bg-[#FAF5EE] border border-[#C8782A]/10 flex items-center justify-center flex-shrink-0">
        <Building2 size={14} className="text-[#C8782A]" />
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-sm text-[#1C1C1C] group-hover:text-[#C8782A] transition-colors leading-snug truncate">
          {job.title}
        </p>
        <p className="text-xs text-[#C8782A] font-medium truncate">{job.company}</p>
        <p className="text-xs text-[#6B3A2A]/50 mt-0.5">{job.location}, {job.province}</p>
      </div>
      <ChevronRight size={14} className="text-[#C8782A]/40 flex-shrink-0 self-center ml-auto group-hover:translate-x-0.5 transition-transform" />
    </Link>
  );
}

function mapDbJob(dbJob: any): Job {
  const postedAt = dbJob.postedAt ? new Date(dbJob.postedAt) : new Date();
  const diffTime = Math.abs(new Date().getTime() - postedAt.getTime());
  const postedDaysAgo = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return {
    id: dbJob._id || dbJob.id,
    title: dbJob.title,
    company: dbJob.company,
    location: dbJob.location,
    province: dbJob.province,
    employmentType: dbJob.employmentType === 'Casual' ? 'Casual / Seasonal' : dbJob.employmentType,
    category: dbJob.category,
    salary: dbJob.salary || '',
    remote: dbJob.location?.toLowerCase().includes('remote') || false,
    indigenous: dbJob.indigenousPreference ?? true,
    featured: false,
    postedDaysAgo,
    closingDate: dbJob.expiresAt ? new Date(dbJob.expiresAt).toLocaleDateString() : 'June 30, 2026',
    description: dbJob.description,
    responsibilities: dbJob.requirements ? dbJob.requirements.split('\n').filter(Boolean) : [],
    rawRequirements: dbJob.requirements || '',
    qualifications: [],
    preferred: [],
    benefits: [],
    applyEmail: 'apply@example.com',
  };
}

/* ── Main page ──────────────────────────────────────────────────────── */
export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: dbJobResponse, isLoading: dbLoading } = useQuery({
    queryKey: ['job', id],
    queryFn: async () => {
      if (!id) return null;
      const res = await fetch(`/api/jobs/${id}`);
      if (!res.ok) throw new Error('Failed to fetch job details');
      return res.json() as Promise<{ success: boolean; data: any }>;
    },
    enabled: !!id,
  });

  const job = dbJobResponse?.data ? mapDbJob(dbJobResponse.data) : undefined;

  const [saved, setSaved] = useState(false);
  const [showApply, setShowApply] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  /* Related jobs: same category, different id */
  const related = job
    ? JOBS.filter((j) => j.category === job.category && j.id !== job.id).slice(0, 4)
    : [];

  const isHtml = (str?: string): boolean => {
    if (!str) return false;
    return /<[a-z][\s\S]*>/i.test(str);
  };

  if (dbLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-20 bg-[#FAF5EE]">
        <Spinner className="text-[#C8782A] mb-3" />
        <p className="text-sm text-[#6B3A2A]/60 font-medium">Loading job details...</p>
      </div>
    );
  }

  /* 404 */
  if (!job) {
    return (
      <>
        <section className="bg-[#FAF5EE] min-h-[60vh] flex items-center justify-center py-20 px-4">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-full bg-[#C8782A]/10 flex items-center justify-center mx-auto mb-5">
              <AlertCircle size={28} className="text-[#C8782A]" />
            </div>
            <h1
              className="text-3xl font-bold text-[#1C1C1C] mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Job Not Found
            </h1>
            <p className="text-[#6B3A2A]/65 mb-7">
              This listing may have expired or been removed. Browse our current openings below.
            </p>
            <Link href="/jobs">
              <Button className="bg-[#C8782A] hover:bg-[#B06820] text-white font-semibold px-8">
                Browse All Jobs
              </Button>
            </Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      {/* Apply modal */}
      {showApply && <ApplyModal job={job} onClose={() => setShowApply(false)} />}

      {/* ── Breadcrumb ──────────────────────────────────────────── */}
      <div className="bg-[#FAF5EE] border-b border-[#C8782A]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-1.5 text-xs text-[#6B3A2A]/55">
            <Link href="/" className="hover:text-[#C8782A] transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/jobs" className="hover:text-[#C8782A] transition-colors">Jobs</Link>
            <ChevronRight size={12} />
            <span className="text-[#C8782A] font-medium truncate max-w-[200px]">{job.title}</span>
          </nav>
        </div>
      </div>

      {/* ── Hero banner ─────────────────────────────────────────── */}
      <section className="bg-[#FAF5EE] py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-3xl p-6 lg:p-10 border border-[#C8782A]/10 shadow-sm"
          >
            {/* Back to jobs */}
            <div className="mb-6">
              <Link href="/jobs"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#C8782A] hover:underline"
              >
                <ArrowLeft size={14} /> Back to Job Board
              </Link>
            </div>

            <div className="flex flex-col lg:flex-row justify-between gap-8 items-start">
              {/* Main info */}
              <div className="flex-1 min-w-0">
                {/* Badge tags */}
                <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mb-4">
                  {job.remote && (
                    <span className="inline-flex items-center gap-1.5 text-xs bg-[#1a64c4]/10 text-[#1a64c4] px-3 py-1 rounded-full font-medium">
                      <Wifi size={11} /> Remote
                    </span>
                  )}
                  {job.indigenous && (
                    <span className="inline-flex items-center gap-1.5 text-xs bg-[#7A9E7E]/15 text-[#4a7a4e] px-3 py-1 rounded-full font-medium">
                      <Leaf size={11} /> Indigenous Employer
                    </span>
                  )}
                  <span className="text-xs bg-white border border-[#C8782A]/15 text-[#6B3A2A]/60 px-3 py-1 rounded-full">
                    {job.category}
                  </span>
                </motion.div>

                {/* Title */}
                <motion.h1
                  variants={fadeUp}
                  className="text-4xl lg:text-5xl font-bold text-[#1C1C1C] leading-tight mb-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {job.title}
                </motion.h1>

                {/* Company */}
                <motion.p variants={fadeUp} className="text-[#C8782A] font-bold text-lg mb-5">
                  {job.company}
                </motion.p>

                {/* Meta chips */}
                <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-2 text-sm text-[#6B3A2A]/70 bg-white border border-[#C8782A]/12 rounded-full px-4 py-1.5">
                    <MapPin size={13} className="text-[#C8782A]" />
                    {job.location}, {job.province}
                  </span>
                  <span className="inline-flex items-center gap-2 text-sm text-[#6B3A2A]/70 bg-white border border-[#C8782A]/12 rounded-full px-4 py-1.5">
                    <Clock size={13} className="text-[#C8782A]" />
                    {job.employmentType}
                  </span>
                  <span className="inline-flex items-center gap-2 text-sm text-[#6B3A2A]/70 bg-white border border-[#C8782A]/12 rounded-full px-4 py-1.5">
                    <DollarSign size={13} className="text-[#C8782A]" />
                    {job.salary}
                  </span>
                  <span className="inline-flex items-center gap-2 text-sm text-[#6B3A2A]/70 bg-white border border-[#C8782A]/12 rounded-full px-4 py-1.5">
                    <Calendar size={13} className="text-[#C8782A]" />
                    Closes {job.closingDate}
                  </span>
                </motion.div>
              </div>

              {/* Desktop CTA */}
              <motion.div
                variants={fadeUp}
                className="hidden lg:flex flex-col gap-3 flex-shrink-0 w-52"
              >
                <Button
                  onClick={() => setShowApply(true)}
                  size="lg"
                  className="bg-[#C8782A] hover:bg-[#B06820] text-white font-semibold w-full shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Apply Now
                </Button>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSaved((v) => !v)}
                    className={`flex-1 border-[#C8782A]/25 transition-all duration-200 ${saved ? 'bg-[#C8782A]/10 text-[#C8782A] border-[#C8782A]/40' : 'text-[#6B3A2A] hover:bg-[#C8782A]/5'}`}
                  >
                    {saved ? <BookmarkCheck size={14} className="mr-1.5" /> : <Bookmark size={14} className="mr-1.5" />}
                    {saved ? 'Saved' : 'Save'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    className="flex-1 border-[#C8782A]/25 text-[#6B3A2A] hover:bg-[#C8782A]/5"
                  >
                    <Share2 size={14} className="mr-1.5" />
                    {copied ? 'Copied!' : 'Share'}
                  </Button>
                </div>
                <p className="text-xs text-[#6B3A2A]/45 text-center">
                  Posted {postedLabel(job.postedDaysAgo)}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Body ────────────────────────────────────────────────── */}
      <section className="bg-white py-10 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 items-start">

            {/* ── Left: Job content ──────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="flex flex-col gap-8"
            >
              {/* About the role */}
              <div>
                <h2
                  className="text-2xl font-bold text-[#1C1C1C] mb-4"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  About the Role
                </h2>
                {isHtml(job.description) ? (
                  <div
                    className="text-[#1C1C1C]/75 leading-relaxed prose prose-stone max-w-none [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-3"
                    dangerouslySetInnerHTML={{ __html: job.description }}
                  />
                ) : (
                  <p className="text-[#1C1C1C]/75 leading-relaxed whitespace-pre-wrap">{job.description}</p>
                )}
              </div>

              {/* Responsibilities */}
              {job.rawRequirements && isHtml(job.rawRequirements) ? (
                <div>
                  <h2
                    className="text-xl font-bold text-[#1C1C1C] mb-4"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Key Responsibilities &amp; Requirements
                  </h2>
                  <div
                    className="text-[#1C1C1C]/75 leading-relaxed prose prose-stone max-w-none [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-3"
                    dangerouslySetInnerHTML={{ __html: job.rawRequirements }}
                  />
                </div>
              ) : job.responsibilities.length > 0 ? (
                <div>
                  <h2
                    className="text-xl font-bold text-[#1C1C1C] mb-4"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Key Responsibilities
                  </h2>
                  <ul className="flex flex-col gap-3">
                    {job.responsibilities.map((r) => (
                      <li key={r} className="flex items-start gap-3 text-[#1C1C1C]/75 text-sm leading-relaxed">
                        <div className="w-5 h-5 rounded-full bg-[#C8782A]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle size={11} className="text-[#C8782A]" />
                        </div>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {/* Qualifications */}
              {!isHtml(job.rawRequirements) && job.qualifications.length > 0 && (
                <div>
                  <h2
                    className="text-xl font-bold text-[#1C1C1C] mb-4"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Required Qualifications
                  </h2>
                  <ul className="flex flex-col gap-3">
                    {job.qualifications.map((q) => (
                      <li key={q} className="flex items-start gap-3 text-[#1C1C1C]/75 text-sm leading-relaxed">
                        <div className="w-5 h-5 rounded-full bg-[#6B3A2A]/8 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle size={11} className="text-[#6B3A2A]" />
                        </div>
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Preferred */}
              {job.preferred.length > 0 && (
                <div>
                  <h2
                    className="text-xl font-bold text-[#1C1C1C] mb-4"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Preferred Qualifications
                  </h2>
                  <ul className="flex flex-col gap-3">
                    {job.preferred.map((p) => (
                      <li key={p} className="flex items-start gap-3 text-[#1C1C1C]/75 text-sm leading-relaxed">
                        <div className="w-5 h-5 rounded-full bg-[#1a64c4]/8 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle size={11} className="text-[#1a64c4]" />
                        </div>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits */}
              {job.benefits.length > 0 && (
                <div className="bg-[#FAF5EE] rounded-2xl p-6 border border-[#C8782A]/10">
                  <h2
                    className="text-xl font-bold text-[#1C1C1C] mb-4"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    What We Offer
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {job.benefits.map((b) => (
                      <div key={b} className="flex items-center gap-2.5 text-sm text-[#6B3A2A]/75">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#C8782A] flex-shrink-0" />
                        {b}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mobile CTA */}
              <div className="flex flex-col gap-3 lg:hidden">
                <Button
                  onClick={() => setShowApply(true)}
                  size="lg"
                  className="bg-[#C8782A] hover:bg-[#B06820] text-white font-semibold w-full shadow-md"
                >
                  Apply Now
                </Button>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSaved((v) => !v)}
                    className={`flex-1 border-[#C8782A]/25 ${saved ? 'bg-[#C8782A]/10 text-[#C8782A]' : 'text-[#6B3A2A]'}`}
                  >
                    {saved ? <BookmarkCheck size={15} className="mr-2" /> : <Bookmark size={15} className="mr-2" />}
                    {saved ? 'Saved' : 'Save Job'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleShare}
                    className="flex-1 border-[#C8782A]/25 text-[#6B3A2A]"
                  >
                    <Share2 size={15} className="mr-2" />
                    {copied ? 'Copied!' : 'Share'}
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* ── Right: Sidebar ─────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="flex flex-col gap-5 lg:sticky lg:top-24"
            >
              {/* Apply CTA card */}
              <div className="bg-[#FAF5EE] rounded-2xl p-6 border border-[#C8782A]/10">
                <Button
                  onClick={() => setShowApply(true)}
                  size="lg"
                  className="bg-[#C8782A] hover:bg-[#B06820] text-white font-semibold w-full shadow-sm mb-4"
                >
                  Apply Now
                </Button>
                <div className="flex flex-col gap-2.5 text-sm">
                  <div className="flex items-center gap-2.5 text-[#6B3A2A]/65">
                    <Calendar size={14} className="text-[#C8782A] flex-shrink-0" />
                    <span>Closes <strong className="text-[#1C1C1C]">{job.closingDate}</strong></span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[#6B3A2A]/65">
                    <Clock size={14} className="text-[#C8782A] flex-shrink-0" />
                    <span>Posted {postedLabel(job.postedDaysAgo)}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[#6B3A2A]/65">
                    <Mail size={14} className="text-[#C8782A] flex-shrink-0" />
                    <span className="truncate">{job.applyEmail}</span>
                  </div>
                  {job.website && (
                    <div className="flex items-center gap-2.5 text-[#6B3A2A]/65">
                      <Globe size={14} className="text-[#C8782A] flex-shrink-0" />
                      <a
                        href={job.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#1a64c4] hover:underline truncate"
                      >
                        {job.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* About the employer */}
              <div className="bg-white rounded-2xl p-6 border border-[#C8782A]/10">
                <h3
                  className="font-bold text-[#1C1C1C] mb-3"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  About the Employer
                </h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF5EE] border border-[#C8782A]/10 flex items-center justify-center">
                    <Building2 size={16} className="text-[#C8782A]" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[#1C1C1C]">{job.company}</p>
                    <p className="text-xs text-[#6B3A2A]/55">{job.location}, {job.province}</p>
                  </div>
                </div>
                {job.indigenous && (
                  <div className="flex items-center gap-2 text-xs text-[#4a7a4e] bg-[#7A9E7E]/10 rounded-lg px-3 py-2">
                    <Leaf size={12} />
                    Indigenous-owned organization
                  </div>
                )}
              </div>

              {/* Related jobs */}
              {related.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-[#C8782A]/10">
                  <h3
                    className="font-bold text-[#1C1C1C] mb-4"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Similar Jobs
                  </h3>
                  <div className="flex flex-col gap-2">
                    {related.map((rj) => (
                      <RelatedCard key={rj.id} job={rj} />
                    ))}
                  </div>
                  <Link href={`/jobs?category=${encodeURIComponent(job.category)}`}
                    className="inline-flex items-center gap-1.5 text-xs text-[#C8782A] font-semibold mt-4 hover:gap-2.5 transition-all duration-200"
                  >
                    More {job.category} jobs <ChevronRight size={12} />
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
