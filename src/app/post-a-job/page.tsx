"use client";

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  Briefcase, CheckCircle, ArrowRight, ChevronRight,
  Send, Info, AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import RichTextEditor from '@/components/RichTextEditor';
import JobPostingPreview, { type JobPostingData } from '@/components/JobPostingPreview';

/* ── Animation variants ─────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.09 } } };

/* ── Package data ───────────────────────────────────────────────────── */
const packages = [
  {
    id: 'basic',
    name: 'Basic Job Posting',
    desc: 'Single listing · 30-day active · standard visibility',
    featured: false,
    popular: false,
  },
  {
    id: 'featured',
    name: 'Featured Job Posting',
    desc: 'Priority placement · 60-day active · highlighted listing',
    featured: true,
    popular: true,
  },
  {
    id: 'branding',
    name: 'Employer Branding Package',
    desc: 'Company profile · multiple listings · logo placement',
    featured: true,
    popular: false,
  },
  {
    id: 'monthly',
    name: 'Monthly Hiring Support',
    desc: 'Unlimited postings · dedicated support · full management',
    featured: true,
    popular: false,
  },
];

const employmentTypes = [
  'Full-time',
  'Part-time',
  'Contract',
  'Casual / Seasonal',
  'Volunteer',
];

const jobCategories = [
  'Administration & Office',
  'Arts, Culture & Heritage',
  'Community & Social Services',
  'Construction & Trades',
  'Education & Training',
  'Environment & Natural Resources',
  'Finance & Accounting',
  'Government & Public Administration',
  'Health & Medical',
  'Hospitality & Tourism',
  'Information Technology',
  'Legal & Justice',
  'Management & Executive',
  'Marketing & Communications',
  'Natural Resources & Forestry',
  'Nursing & Allied Health',
  'Oil, Gas & Mining',
  'Other',
  'Sales & Customer Service',
  'Science & Research',
  'Security & Law Enforcement',
  'Transportation & Logistics',
];

const provinces = [
  'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
  'Newfoundland & Labrador', 'Northwest Territories', 'Nova Scotia',
  'Nunavut', 'Ontario', 'Prince Edward Island', 'Québec',
  'Saskatchewan', 'Yukon',
];

/* ── Tip box ────────────────────────────────────────────────────────── */
function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2.5 bg-[#1a64c4]/6 border border-[#1a64c4]/15 rounded-xl px-4 py-3">
      <Info size={14} className="text-[#1a64c4] flex-shrink-0 mt-0.5" />
      <p className="text-xs text-[#1a64c4]/80 leading-relaxed">{children}</p>
    </div>
  );
}

/* ── Section heading ────────────────────────────────────────────────── */
function SectionHeading({ step, title }: { step: number; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-7 h-7 rounded-full bg-[#C8782A] flex items-center justify-center flex-shrink-0">
        <span className="text-white text-xs font-bold">{step}</span>
      </div>
      <h2
        className="text-xl font-bold text-[#1C1C1C]"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {title}
      </h2>
    </div>
  );
}

/* ── Main page ──────────────────────────────────────────────────────── */
export default function PostAJobPage() {
  /* Form state */
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [category, setCategory] = useState('');
  const [salary, setSalary] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [descHtml, setDescHtml] = useState('');
  const [reqHtml, setReqHtml] = useState('');
  const [indigenous, setIndigenous] = useState(false);
  const [remote, setRemote] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState('featured');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  /* Derived preview data */
  const selectedPackage = packages.find((p) => p.id === selectedPkg)!;
  const location = [city, province].filter(Boolean).join(', ');

  const previewData: JobPostingData = {
    title,
    company,
    location,
    employmentType,
    salary,
    descriptionHtml: descHtml,
    requirementsHtml: reqHtml,
    indigenous,
    remote,
    packageName: selectedPackage?.name ?? '',
    featured: selectedPackage?.featured ?? false,
  };

  const handleDescChange = useCallback((_: string) => {}, []);
  const handleDescHtml = useCallback((html: string) => setDescHtml(html), []);
  const handleReqChange = useCallback((_: string) => {}, []);
  const handleReqHtml = useCallback((html: string) => setReqHtml(html), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    setLoading(true);
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          company,
          city,
          province,
          employmentType,
          salary,
          category,
          descriptionHtml: descHtml,
          requirementsHtml: reqHtml,
          indigenousOwned: indigenous,
          contactEmail: email,
          website,
          package: selectedPkg,
        }),
      });
      const data = await res.json() as { error?: string; success?: boolean };
      if (!res.ok) {
        setServerError(data.error || 'Failed to submit job posting. Please try again.');
        return;
      }
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setServerError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Success state ─────────────────────────────────────────────── */
  if (submitted) {
    return (
      <>
        <section className="bg-[#FAF5EE] min-h-[70vh] flex items-center justify-center py-20 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg w-full bg-white rounded-3xl p-10 border border-[#C8782A]/10 text-center shadow-lg"
          >
            <div className="w-16 h-16 rounded-full bg-[#7A9E7E]/15 flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={32} className="text-[#7A9E7E]" />
            </div>
            <h1
              className="text-3xl font-bold text-[#1C1C1C] mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Posting Submitted!
            </h1>
            <p className="text-[#6B3A2A]/70 leading-relaxed mb-2">
              Thank you, <strong>{company || 'your organization'}</strong>. Your job posting for{' '}
              <strong>{title || 'the role'}</strong> has been received.
            </p>
            <p className="text-[#6B3A2A]/60 text-sm mb-8">
              Our team will review your listing and confirm within 1 business day. We'll reach out
              to <strong>{email}</strong> with next steps.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/employers">
                <Button className="bg-[#C8782A] hover:bg-[#B06820] text-white font-semibold px-8">
                  Employer Dashboard
                </Button>
              </Link>
              <Button
                variant="outline"
                className="border-[#C8782A]/30 text-[#6B3A2A] hover:bg-[#C8782A]/5"
                onClick={() => { setSubmitted(false); setServerError(''); setCategory(''); }}
              >
                Post Another Job
              </Button>
            </div>
          </motion.div>
        </section>
      </>
    );
  }

  /* ── Main form ─────────────────────────────────────────────────── */
  return (
    <>
      {/* Hero */}
      <section className="bg-[#FAF5EE] py-14 lg:py-20 relative overflow-hidden">
        <div
          className="absolute -right-24 top-1/2 -translate-y-1/2 w-[420px] h-[420px] text-[#C8782A] pointer-events-none opacity-30"
          aria-hidden="true"
        >
          <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="1" opacity="0.4" />
            <circle cx="200" cy="200" r="120" stroke="currentColor" strokeWidth="1" opacity="0.3" />
            <circle cx="200" cy="200" r="60" fill="currentColor" opacity="0.1" />
          </svg>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.div variants={fadeUp} className="flex items-center gap-2 text-sm text-[#6B3A2A]/60 mb-4">
              <Link href="/employers" className="hover:text-[#C8782A] transition-colors">Employers</Link>
              <ChevronRight size={14} />
              <span className="text-[#C8782A] font-medium">Post a Job</span>
            </motion.div>
            <motion.p variants={fadeUp} className="text-[#C8782A] font-semibold text-sm uppercase tracking-widest mb-3">
              Employers
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-5xl lg:text-6xl font-bold text-[#1C1C1C] mb-4 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Post a Job
            </motion.h1>
            <motion.p variants={fadeUp} className="text-[#6B3A2A]/70 text-lg max-w-xl leading-relaxed">
              Reach thousands of qualified Indigenous job seekers across Canada. Fill in your details
              and watch your listing come to life in the preview.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Form + Sidebar */}
      <section className="bg-white py-10 lg:py-14 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8 items-start">

            {/* ── LEFT: Form ──────────────────────────────────────────── */}
            <motion.form
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              onSubmit={handleSubmit}
              className="flex flex-col gap-8"
            >
              {/* Step 1 — Package */}
              <div className="bg-[#FAF5EE] rounded-3xl p-7 lg:p-9 border border-[#C8782A]/10">
                <SectionHeading step={1} title="Choose a Package" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {packages.map((pkg) => (
                    <label
                      key={pkg.id}
                      className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        selectedPkg === pkg.id
                          ? 'border-[#C8782A] bg-white shadow-sm'
                          : 'border-[#C8782A]/15 bg-white hover:border-[#C8782A]/40'
                      }`}
                    >
                      <input
                        type="radio"
                        name="package"
                        value={pkg.id}
                        checked={selectedPkg === pkg.id}
                        onChange={() => setSelectedPkg(pkg.id)}
                        className="mt-1 accent-[#C8782A]"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-[#1C1C1C] text-sm">{pkg.name}</span>
                          {pkg.popular && (
                            <span className="text-xs bg-[#C8782A] text-white px-2 py-0.5 rounded-full font-semibold">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#6B3A2A]/60 mt-0.5 leading-relaxed">{pkg.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
                <Link href="/pricing"
                  className="inline-flex items-center gap-1.5 text-[#C8782A] text-sm font-semibold mt-4 hover:gap-2.5 transition-all duration-200"
                >
                  Compare all packages <ArrowRight size={13} />
                </Link>
              </div>

              {/* Step 2 — Job Details */}
              <div className="bg-white rounded-3xl p-7 lg:p-9 border border-[#C8782A]/10">
                <SectionHeading step={2} title="Job Details" />
                <div className="flex flex-col gap-5">
                  {/* Title */}
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="job-title" className="text-[#6B3A2A] font-medium text-sm">
                      Job Title <span className="text-[#C8782A]">*</span>
                    </Label>
                    <Input
                      id="job-title"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Community Health Worker"
                      className="border-[#C8782A]/20 focus-visible:ring-[#C8782A]/30"
                    />
                  </div>

                  {/* Company + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="company" className="text-[#6B3A2A] font-medium text-sm">
                        Company / Organization <span className="text-[#C8782A]">*</span>
                      </Label>
                      <Input
                        id="company"
                        required
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Your organization name"
                        className="border-[#C8782A]/20 focus-visible:ring-[#C8782A]/30"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="website" className="text-[#6B3A2A] font-medium text-sm">
                        Website (optional)
                      </Label>
                      <Input
                        id="website"
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://yourorganization.ca"
                        className="border-[#C8782A]/20 focus-visible:ring-[#C8782A]/30"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="city" className="text-[#6B3A2A] font-medium text-sm">
                        City / Community <span className="text-[#C8782A]">*</span>
                      </Label>
                      <Input
                        id="city"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Edmonton"
                        className="border-[#C8782A]/20 focus-visible:ring-[#C8782A]/30"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="province" className="text-[#6B3A2A] font-medium text-sm">
                        Province / Territory <span className="text-[#C8782A]">*</span>
                      </Label>
                      <select
                        id="province"
                        required
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        className="w-full rounded-md border border-[#C8782A]/20 bg-white px-3 py-2 text-sm text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#C8782A]/30"
                      >
                        <option value="">Select province / territory</option>
                        {provinces.map((p) => (
                          <option key={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Type + Salary */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="emp-type" className="text-[#6B3A2A] font-medium text-sm">
                        Employment Type <span className="text-[#C8782A]">*</span>
                      </Label>
                      <select
                        id="emp-type"
                        required
                        value={employmentType}
                        onChange={(e) => setEmploymentType(e.target.value)}
                        className="w-full rounded-md border border-[#C8782A]/20 bg-white px-3 py-2 text-sm text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#C8782A]/30"
                      >
                        <option value="">Select type</option>
                        {employmentTypes.map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="salary" className="text-[#6B3A2A] font-medium text-sm">
                        Salary Range (optional)
                      </Label>
                      <Input
                        id="salary"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                        placeholder="e.g. $55,000 – $70,000 / year"
                        className="border-[#C8782A]/20 focus-visible:ring-[#C8782A]/30"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="category" className="text-[#6B3A2A] font-medium text-sm">
                      Job Category <span className="text-[#C8782A]">*</span>
                    </Label>
                    <select
                      id="category"
                      required
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-md border border-[#C8782A]/20 bg-white px-3 py-2 text-sm text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#C8782A]/30"
                    >
                      <option value="">Select a category</option>
                      {jobCategories.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Toggles */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <Switch
                        checked={remote}
                        onCheckedChange={setRemote}
                        className="data-[state=checked]:bg-[#C8782A]"
                      />
                      <span className="text-sm text-[#6B3A2A] font-medium">Remote / Hybrid available</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <Switch
                        checked={indigenous}
                        onCheckedChange={setIndigenous}
                        className="data-[state=checked]:bg-[#7A9E7E]"
                      />
                      <span className="text-sm text-[#6B3A2A] font-medium">Indigenous-owned organization</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Step 3 — Description */}
              <div className="bg-white rounded-3xl p-7 lg:p-9 border border-[#C8782A]/10">
                <SectionHeading step={3} title="Job Description" />
                <div className="flex flex-col gap-5">
                  <Tip>
                    Use plain, welcoming language. Describe the role, team, and what makes your
                    organization a great place to work. Avoid jargon and list only truly essential
                    requirements to encourage more applicants.
                  </Tip>
                  <div className="flex flex-col gap-2">
                    <Label className="text-[#6B3A2A] font-medium text-sm">
                      About the Role <span className="text-[#C8782A]">*</span>
                    </Label>
                    <RichTextEditor
                      placeholder="Describe the role, responsibilities, and what makes your organization a great place to work…"
                      onChange={handleDescChange}
                      onHtmlChange={handleDescHtml}
                      minHeight={180}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-[#6B3A2A] font-medium text-sm">
                      Qualifications &amp; Requirements
                    </Label>
                    <RichTextEditor
                      placeholder="List required skills, education, experience, and any preferred qualifications…"
                      onChange={handleReqChange}
                      onHtmlChange={handleReqHtml}
                      minHeight={140}
                    />
                  </div>
                </div>
              </div>

              {/* Step 4 — Contact */}
              <div className="bg-white rounded-3xl p-7 lg:p-9 border border-[#C8782A]/10">
                <SectionHeading step={4} title="Contact Information" />
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="contact-email" className="text-[#6B3A2A] font-medium text-sm">
                      Application Email <span className="text-[#C8782A]">*</span>
                    </Label>
                    <Input
                      id="contact-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="applications@yourorganization.ca"
                      className="border-[#C8782A]/20 focus-visible:ring-[#C8782A]/30"
                    />
                    <p className="text-xs text-[#6B3A2A]/50">
                      Applications from job seekers will be directed to this address.
                    </p>
                  </div>
                  <Tip>
                    Your contact email is kept private and is never shown publicly on the listing.
                    Job seekers apply through Aboriginal Jobs Canada's secure application system.
                  </Tip>
                </div>
              </div>

              {/* Submit */}
              <div className="flex flex-col gap-4">
                {serverError && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                    <AlertCircle size={15} className="flex-shrink-0" />
                    {serverError}
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={loading}
                    className="bg-[#C8782A] hover:bg-[#B06820] text-white font-semibold px-10 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-60"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Submitting…
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Submit Job Posting <Send size={15} />
                      </span>
                    )}
                  </Button>
                  <p className="text-xs text-[#6B3A2A]/50 self-center leading-relaxed max-w-xs">
                    Our team reviews every posting and will confirm within 1 business day.
                  </p>
                </div>
              </div>
            </motion.form>

            {/* ── RIGHT: Sidebar ───────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex flex-col gap-5 xl:sticky xl:top-24"
            >
              {/* Live preview */}
              <JobPostingPreview data={previewData} />

              {/* Need help */}
              <div className="bg-[#6B3A2A] rounded-2xl p-6 text-[#FAF5EE]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                    <Briefcase size={16} className="text-white" />
                  </div>
                  <h4
                    className="font-bold"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Need Help?
                  </h4>
                </div>
                <p className="text-[#FAF5EE]/70 text-sm leading-relaxed mb-4">
                  Our team can help you craft an inclusive, effective job posting that resonates
                  with Indigenous job seekers.
                </p>
                <Link href="/contact">
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-[#6B3A2A] w-full text-sm font-semibold"
                  >
                    Contact Aboriginal Jobs Canada
                  </Button>
                </Link>
              </div>

              {/* Why post with us */}
              <div className="bg-[#FAF5EE] rounded-2xl p-6 border border-[#C8782A]/10">
                <h4
                  className="font-bold text-[#1C1C1C] mb-4"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Why Post with Aboriginal Jobs Canada?
                </h4>
                <ul className="flex flex-col gap-3">
                  {[
                    '15,000+ active Indigenous job seekers',
                    'Canada-wide reach across all provinces & territories',
                    'Culturally respectful, inclusive platform',
                    'Dedicated employer support team',
                    'Aligned with TRC Calls to Action',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-[#6B3A2A]/75">
                      <CheckCircle size={14} className="text-[#7A9E7E] flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
