"use client";

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  Briefcase, CheckCircle, ArrowRight, ChevronRight,
  Send, Info, AlertCircle, XCircle, Mail, Phone, MapPin, Building2, Plus, Trash2, Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import RichTextEditor from '@/components/RichTextEditor';
import JobPostingPreview, { type JobPostingData } from '@/components/JobPostingPreview';
import { useSession } from '@/lib/auth/auth-client';
import { toast } from 'sonner';

/* ── Animation variants ─────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.09 } } };

/* ── Types for Apply Methods ────────────────────────────────────────── */
interface ApplyMethod {
  method: 'email' | 'phone' | 'mail' | 'inPerson';
  email?: string;
  phone?: string;
  mailAddress?: string;
  inPersonAddress?: string;
  inPersonTiming?: string;
}

const employmentTypes = [
  'Full-time',
  'Part-time',
  'Contract',
  'Casual / Seasonal',
  'Volunteer',
];

const jobCategories = [
  'Administration & Office', 'Arts, Culture & Heritage', 'Community & Social Services',
  'Construction & Trades', 'Education & Training', 'Environment & Natural Resources',
  'Finance & Accounting', 'Government & Public Administration', 'Health & Medical',
  'Hospitality & Tourism', 'Information Technology', 'Legal & Justice',
  'Management & Executive', 'Marketing & Communications', 'Natural Resources & Forestry',
  'Nursing & Allied Health', 'Oil, Gas & Mining', 'Other', 'Sales & Customer Service',
  'Science & Research', 'Security & Law Enforcement', 'Transportation & Logistics',
  'Restaurant & Food Service'
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
      <h2 className="text-xl font-bold text-[#1C1C1C]" style={{ fontFamily: "'Playfair Display', serif" }}>
        {title}
      </h2>
    </div>
  );
}

/* ── Apply Method Card Component ────────────────────────────────────── */
function ApplyMethodCard({
  method,
  data,
  onChange,
  onRemove,
  isRemovable,
}: {
  method: string;
  data: ApplyMethod;
  onChange: (field: string, value: string) => void;
  onRemove?: () => void;
  isRemovable: boolean;
}) {
  const getIcon = () => {
    switch (method) {
      case 'email': return <Mail size={16} className="text-[#C8782A]" />;
      case 'phone': return <Phone size={16} className="text-[#C8782A]" />;
      case 'mail': return <MapPin size={16} className="text-[#C8782A]" />;
      case 'inPerson': return <Building2 size={16} className="text-[#C8782A]" />;
      default: return null;
    }
  };

  const getTitle = () => {
    switch (method) {
      case 'email': return 'Apply by Email';
      case 'phone': return 'Apply by Phone';
      case 'mail': return 'Apply by Mail';
      case 'inPerson': return 'Apply in Person';
      default: return method;
    }
  };

  return (
    <div className="bg-[#FAF5EE] rounded-xl p-4 border border-[#C8782A]/15 relative">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {getIcon()}
          <h3 className="font-semibold text-sm text-[#1C1C1C]">{getTitle()}</h3>
        </div>
        {isRemovable && onRemove && (
          <button type="button" onClick={onRemove} className="text-red-500 hover:text-red-700">
            <Trash2 size={14} />
          </button>
        )}
      </div>

      <div className="space-y-3">
        {method === 'email' && (
          <div>
            <Label className="text-xs text-[#6B3A2A] font-medium">Email Address *</Label>
            <Input
              type="email"
              value={data.email || ''}
              onChange={(e) => onChange('email', e.target.value)}
              placeholder="jobs@company.com"
              className="mt-1 border-[#C8782A]/20"
              required
            />
          </div>
        )}

        {method === 'phone' && (
          <div>
            <Label className="text-xs text-[#6B3A2A] font-medium">Phone Number *</Label>
            <Input
              type="tel"
              value={data.phone || ''}
              onChange={(e) => onChange('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="mt-1 border-[#C8782A]/20"
              required
            />
          </div>
        )}

        {method === 'mail' && (
          <div>
            <Label className="text-xs text-[#6B3A2A] font-medium">Mailing Address *</Label>
            <Input
              value={data.mailAddress || ''}
              onChange={(e) => onChange('mailAddress', e.target.value)}
              placeholder="123 Street Name, City, Province, Postal Code"
              className="mt-1 border-[#C8782A]/20"
              required
            />
          </div>
        )}

        {method === 'inPerson' && (
          <>
            <div>
              <Label className="text-xs text-[#6B3A2A] font-medium">Office Address *</Label>
              <Input
                value={data.inPersonAddress || ''}
                onChange={(e) => onChange('inPersonAddress', e.target.value)}
                placeholder="123 Business Ave, Suite 100, City, Province"
                className="mt-1 border-[#C8782A]/20"
                required
              />
            </div>
            <div>
              <Label className="text-xs text-[#6B3A2A] font-medium">Available Hours / Time Slots *</Label>
              <Input
                value={data.inPersonTiming || ''}
                onChange={(e) => onChange('inPersonTiming', e.target.value)}
                placeholder="Monday-Friday, 9AM to 5PM"
                className="mt-1 border-[#C8782A]/20"
                required
              />
              <p className="text-xs text-[#6B3A2A]/50 mt-1">Example: Monday-Friday, 9AM-5PM</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Helper to format date for input ───────────────────────────────── */
function formatDateForInput(date: string | Date): string {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

/* ── Main page ──────────────────────────────────────────────────────── */
export default function PostAJobPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams?.get('id');
  const isEditMode = !!jobId;
  
  const { session } = useSession();

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [serverError, setServerError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  /* ── Form State ───────────────────────────────────────────────────── */
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [category, setCategory] = useState('');
  const [salary, setSalary] = useState('');
  const [salaryType, setSalaryType] = useState('hour');
  const [nocCode, setNocCode] = useState('');
  const [runDays, setRunDays] = useState('30');
  const [experience, setExperience] = useState('');
  const [startDate, setStartDate] = useState('');
  const [website, setWebsite] = useState('');
  const [descHtml, setDescHtml] = useState('');
  const [reqHtml, setReqHtml] = useState('');
  const [indigenous, setIndigenous] = useState(false);
  const [remote, setRemote] = useState(false);
  const [applyMethods, setApplyMethods] = useState<ApplyMethod[]>([]);
  const [selectedMethodToAdd, setSelectedMethodToAdd] = useState<string>('');
  const [postDate, setPostDate] = useState(''); 
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Fetch job data if in edit mode
  useEffect(() => {
    if (isEditMode && jobId) {
      setLoadingData(true);
      fetch(`/api/jobs/${jobId}`)
        .then(res => res.json())
        .then(data => {
          const job = data.data;
          if (job) {
            setTitle(job.title || '');
            setCompany(job.company || '');
            setCity(job.city || '');
            setProvince(job.province || '');
            setEmploymentType(job.employmentType || '');
            setCategory(job.category || '');
            setSalary(job.salary || '');
            setSalaryType(job.salaryType || 'hour');
            setNocCode(job.nocCode || '');
            setRunDays(job.runDays || '30');
            setExperience(job.experience || '');
            setStartDate(job.startDate || '');
            setWebsite(job.website || '');
            setDescHtml(job.descriptionHtml || '');
            setReqHtml(job.requirementsHtml || '');
            setIndigenous(job.indigenousOwned || false);
            setRemote(job.remote || false);
            setApplyMethods(job.applyMethods || []);
            setPostDate(job.postDate ? formatDateForInput(job.postDate) : '');
          }
        })
        .catch(err => console.error('Error fetching job:', err))
        .finally(() => setLoadingData(false));
    }
  }, [isEditMode, jobId]);

  const markTouched = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const addApplyMethod = () => {
    if (!selectedMethodToAdd) return;
    if (applyMethods.some(m => m.method === selectedMethodToAdd)) {
      setErrors(prev => ({ ...prev, applyMethods: `Already added ${selectedMethodToAdd} method` }));
      return;
    }
    setApplyMethods([...applyMethods, { method: selectedMethodToAdd as ApplyMethod['method'] }]);
    setSelectedMethodToAdd('');
    setErrors(prev => ({ ...prev, applyMethods: '' }));
  };

  const removeApplyMethod = (index: number) => {
    setApplyMethods(applyMethods.filter((_, i) => i !== index));
  };

  const updateApplyMethod = (index: number, field: string, value: string) => {
    const updated = [...applyMethods];
    updated[index] = { ...updated[index], [field]: value };
    setApplyMethods(updated);
  };

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = 'Job title is required';
    if (!company.trim()) newErrors.company = 'Company name is required';
    if (!city.trim()) newErrors.city = 'City is required';
    if (!province) newErrors.province = 'Province is required';
    if (!employmentType) newErrors.employmentType = 'Employment type is required';
    if (!category) newErrors.category = 'Job category is required';
    if (!nocCode.trim()) newErrors.nocCode = 'NOC code is required';
    if (!descHtml.trim() || descHtml === '<p></p>' || descHtml === '<p><br></p>') {
      newErrors.description = 'Job description is required';
    }
    if (!reqHtml.trim() || reqHtml === '<p></p>' || reqHtml === '<p><br></p>') {
      newErrors.requirements = 'Qualifications & Requirements are required';
    }

    if (applyMethods.length === 0) {
      newErrors.applyMethods = 'At least one application method is required';
    } else {
      for (let i = 0; i < applyMethods.length; i++) {
        const method = applyMethods[i];
        if (method.method === 'email' && !method.email?.trim()) {
          newErrors[`applyMethod_${i}`] = 'Email is required for email application';
        }
        if (method.method === 'phone' && !method.phone?.trim()) {
          newErrors[`applyMethod_${i}`] = 'Phone number is required for phone application';
        }
        if (method.method === 'mail' && !method.mailAddress?.trim()) {
          newErrors[`applyMethod_${i}`] = 'Mail address is required for mail application';
        }
        if (method.method === 'inPerson') {
          if (!method.inPersonAddress?.trim()) {
            newErrors[`applyMethod_${i}`] = 'Address is required for in-person application';
          }
          if (!method.inPersonTiming?.trim()) {
            newErrors[`applyMethod_${i}`] = 'Time schedule is required for in-person application';
          }
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [title, company, city, province, employmentType, category, nocCode, descHtml, reqHtml, applyMethods]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const allFields = ['title', 'company', 'city', 'province', 'employmentType', 'category', 'nocCode'];
    const touchedObj: Record<string, boolean> = {};
    allFields.forEach(field => { touchedObj[field] = true; });
    setTouched(touchedObj);

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setServerError('');
    setLoading(true);

    try {
      const url = isEditMode ? `/api/jobs/${jobId}` : '/api/jobs';
      const method = isEditMode ? 'PUT' : 'POST';
      
      const requestBody: any = {
        title,
        company,
        city,
        province,
        employmentType,
        salary,
        salaryType,
        category,
        nocCode,
        runDays,
        experience,
        startDate,
        descriptionHtml: descHtml,
        requirementsHtml: reqHtml,
        indigenousOwned: indigenous,
        remote,
        website,
        applyMethods,
      };

      // Add postDate only in edit mode
      if (isEditMode && postDate) {
        requestBody.postDate = new Date(postDate).toISOString();
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || `Failed to ${isEditMode ? 'update' : 'submit'} job posting.`);
        return;
      }

      toast.success(isEditMode ? 'Job updated successfully!' : 'Job posted successfully!');
      
      if (!isEditMode) {
        setSubmitted(true);
      } else {
        router.push('/employers/dashboard');
      }
    } catch {
      setServerError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const location = [city, province].filter(Boolean).join(', ');
  const previewData: JobPostingData = {
    title, company, location, employmentType, salary, salaryType,
    descriptionHtml: descHtml, requirementsHtml: reqHtml,
    indigenous, remote, packageName: 'Job Posting', featured: false,
    nocCode, runDays, experience, startDate, category, website, applyMethods,
  };

  if (loadingData) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C8782A] mx-auto mb-4" />
          <p className="text-[#6B3A2A]/60">Loading job data...</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <section className="bg-[#FAF5EE] min-h-[70vh] flex items-center justify-center py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg w-full bg-white rounded-3xl p-6 sm:p-10 border border-[#C8782A]/10 text-center shadow-lg mx-4"
        >
          <div className="w-16 h-16 rounded-full bg-[#7A9E7E]/15 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-[#7A9E7E]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1C1C] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Posting Submitted!
          </h1>
          <p className="text-[#6B3A2A]/70 leading-relaxed mb-2">
            Thank you, <strong>{company}</strong>. Your job posting for{' '}
            <strong>{title}</strong> has been received.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Link href="/employers/dashboard" className="w-full sm:w-auto">
              <Button className="bg-[#C8782A] hover:bg-[#B06820] text-white font-semibold px-8 w-full sm:w-auto">
                Employer Dashboard
              </Button>
            </Link>
            <Button
              variant="outline"
              className="border-[#C8782A]/30 text-[#6B3A2A] hover:bg-[#C8782A]/5 w-full sm:w-auto"
              onClick={() => {
                setSubmitted(false);
                setServerError('');
                setTitle('');
                setCompany('');
                setCity('');
                setProvince('');
                setEmploymentType('');
                setSalary('');
                setNocCode('');
                setDescHtml('');
                setReqHtml('');
                setApplyMethods([]);
                setPostDate('');
              }}
            >
              Post Another Job
            </Button>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-[#FAF5EE] py-12 lg:py-20 relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.div variants={fadeUp} className="flex items-center gap-2 text-sm text-[#6B3A2A]/60 mb-4 flex-wrap">
              <Link href="/employers/dashboard" className="hover:text-[#C8782A] transition-colors">Dashboard</Link>
              <ChevronRight size={14} />
              <span className="text-[#C8782A] font-medium">{isEditMode ? 'Edit Job' : 'Post a Job'}</span>
            </motion.div>
            <motion.p variants={fadeUp} className="text-[#C8782A] font-semibold text-sm uppercase tracking-widest mb-3">
              Employers
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1C1C1C] mb-4 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {isEditMode ? 'Edit Job Posting' : 'Post a Job'}
            </motion.h1>
            <motion.p variants={fadeUp} className="text-[#6B3A2A]/70 text-base sm:text-lg max-w-xl leading-relaxed">
              {isEditMode 
                ? 'Update your job posting to attract the right candidates.'
                : 'Reach thousands of qualified Indigenous job seekers across Canada.'}
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-10 lg:py-14 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col xl:flex-row gap-8">
            <motion.form
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              onSubmit={handleSubmit}
              className="flex-1 flex flex-col gap-8"
              noValidate
            >
              {/* Job Details */}
              <div className="bg-white rounded-3xl p-5 sm:p-7 lg:p-9 border border-[#C8782A]/10">
                <SectionHeading step={1} title="Job Details" />
                <div className="flex flex-col gap-5">
                  {/* Title */}
                  <div className="flex flex-col gap-2">
                    <Label className="text-[#6B3A2A] font-medium text-sm">Job Title <span className="text-[#C8782A]">*</span></Label>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Community Health Worker" />
                    {errors.title && touched.title && <p className="text-xs text-red-500"><XCircle size={12} className="inline mr-1" />{errors.title}</p>}
                  </div>

                  {/* Company + Website */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <Label className="text-[#6B3A2A] font-medium text-sm">Company / Organization <span className="text-[#C8782A]">*</span></Label>
                      <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Your organization name" />
                      {errors.company && touched.company && <p className="text-xs text-red-500">{errors.company}</p>}
                    </div>
                    <div>
                      <Label className="text-[#6B3A2A] font-medium text-sm">Website (optional)</Label>
                      <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://yourorganization.ca" />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <Label className="text-[#6B3A2A] font-medium text-sm">City / Community <span className="text-[#C8782A]">*</span></Label>
                      <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Edmonton" />
                      {errors.city && touched.city && <p className="text-xs text-red-500">{errors.city}</p>}
                    </div>
                    <div>
                      <Label className="text-[#6B3A2A] font-medium text-sm">Province / Territory <span className="text-[#C8782A]">*</span></Label>
                      <select value={province} onChange={(e) => setProvince(e.target.value)} className="w-full rounded-md border border-[#C8782A]/20 bg-white px-3 py-2.5">
                        <option value="">Select province</option>
                        {provinces.map(p => <option key={p}>{p}</option>)}
                      </select>
                      {errors.province && touched.province && <p className="text-xs text-red-500">{errors.province}</p>}
                    </div>
                  </div>

                  {/* Type + Salary */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <Label className="text-[#6B3A2A] font-medium text-sm">Employment Type <span className="text-[#C8782A]">*</span></Label>
                      <select value={employmentType} onChange={(e) => setEmploymentType(e.target.value)} className="w-full rounded-md border border-[#C8782A]/20 bg-white px-3 py-2.5">
                        <option value="">Select type</option>
                        {employmentTypes.map(t => <option key={t}>{t}</option>)}
                      </select>
                      {errors.employmentType && touched.employmentType && <p className="text-xs text-red-500">{errors.employmentType}</p>}
                    </div>
                    <div>
                      <Label className="text-[#6B3A2A] font-medium text-sm">Salary (CAD)</Label>
                      <div className="flex gap-2">
                        <Input value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="e.g. 20 - 35" className="flex-1" />
                        <select value={salaryType} onChange={(e) => setSalaryType(e.target.value)} className="rounded-md border border-[#C8782A]/20 bg-white px-3">
                          <option value="hour">Per Hour</option>
                          <option value="week">Per Week</option>
                          <option value="month">Per Month</option>
                          <option value="year">Per Year</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* NOC Code + Run Days */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <Label className="text-[#6B3A2A] font-medium text-sm">NOC Code <span className="text-[#C8782A]">*</span></Label>
                      <Input value={nocCode} onChange={(e) => setNocCode(e.target.value)} placeholder="e.g. 21231" />
                      {errors.nocCode && touched.nocCode && <p className="text-xs text-red-500">{errors.nocCode}</p>}
                    </div>
                    <div>
                      <Label className="text-[#6B3A2A] font-medium text-sm">Run Ad For</Label>
                      <select value={runDays} onChange={(e) => setRunDays(e.target.value)} className="w-full rounded-md border border-[#C8782A]/20 bg-white px-3 py-2.5">
                        <option value="30">30 Days</option><option value="60">60 Days</option><option value="90">90 Days</option>
                        <option value="120">120 Days</option><option value="150">150 Days</option>
                      </select>
                    </div>
                  </div>

                  {/* Experience + Start Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <Label className="text-[#6B3A2A] font-medium text-sm">Experience Required</Label>
                      <Input value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="e.g. 2+ years" />
                    </div>
                    <div>
                      <Label className="text-[#6B3A2A] font-medium text-sm">Expected Start Date</Label>
                      <select value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full rounded-md border border-[#C8782A]/20 bg-white px-3 py-2.5">
                        <option value="">Select start date</option>
                        <option value="asap">As Soon As Possible</option>
                        <option value="immediate">Immediate Joining</option>
                        <option value="1week">Within 1 Week</option>
                        <option value="2weeks">Within 2 Weeks</option>
                        <option value="1month">Within 1 Month</option>
                      </select>
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <Label className="text-[#6B3A2A] font-medium text-sm">Job Category <span className="text-[#C8782A]">*</span></Label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-md border border-[#C8782A]/20 bg-white px-3 py-2.5">
                      <option value="">Select a category</option>
                      {jobCategories.map(c => <option key={c}>{c}</option>)}
                    </select>
                    {errors.category && touched.category && <p className="text-xs text-red-500">{errors.category}</p>}
                  </div>

                  {/*  Post Date - Only in Edit Mode */}
                  {isEditMode && (
                    <div>
                      <Label className="text-[#6B3A2A] font-medium text-sm">Post Date (Display Date)</Label>
                      <div className="relative">
                        <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B3A2A]/40" />
                        <Input
                          type="date"
                          value={postDate}
                          onChange={(e) => setPostDate(e.target.value)}
                          className="pl-9 border-[#C8782A]/20 focus-visible:ring-[#C8782A]/30"
                        />
                      </div>
                      <p className="text-xs text-[#6B3A2A]/50 mt-1">
                        Set a custom display date for this job posting. Leave empty to use original date.
                      </p>
                    </div>
                  )}

                  {/* Toggles */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <Switch checked={remote} onCheckedChange={setRemote} className="data-[state=checked]:bg-[#C8782A]" />
                      <span className="text-sm text-[#6B3A2A] font-medium">Remote / Hybrid available</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <Switch checked={indigenous} onCheckedChange={setIndigenous} className="data-[state=checked]:bg-[#7A9E7E]" />
                      <span className="text-sm text-[#6B3A2A] font-medium">Indigenous-owned organization</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="bg-white rounded-3xl p-5 sm:p-7 lg:p-9 border border-[#C8782A]/10">
                <SectionHeading step={2} title="Job Description" />
                <div className="flex flex-col gap-5">
                  <Tip>Use plain, welcoming language. <strong>Maximum 5000 characters per field.</strong></Tip>
                  <div>
                    <Label className="text-[#6B3A2A] font-medium text-sm">About the Role <span className="text-[#C8782A]">*</span></Label>
                    <RichTextEditor 
                      value={descHtml} 
                      onHtmlChange={setDescHtml} 
                      minHeight={200} 
                      maxLength={5000} 
                    />
                    {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
                  </div>
                  <div>
                    <Label className="text-[#6B3A2A] font-medium text-sm">Qualifications & Requirements <span className="text-[#C8782A]">*</span></Label>
                    <RichTextEditor 
                      value={reqHtml}  
                      onHtmlChange={setReqHtml} 
                      minHeight={160} 
                      maxLength={4000} 
                    />
                    {errors.requirements && <p className="text-xs text-red-500">{errors.requirements}</p>}
                  </div>
                </div>
              </div>

              {/* How to Apply */}
              <div className="bg-white rounded-3xl p-5 sm:p-7 lg:p-9 border border-[#C8782A]/10">
                <SectionHeading step={3} title="How to Apply" />
                <div className="flex flex-col gap-5">
                  <Tip>Select one or more methods. At least one method is required.</Tip>

                  <div className="flex flex-col sm:flex-row gap-3 items-end">
                    <div className="flex-1">
                      <Label className="text-xs text-[#6B3A2A] font-medium">Add Application Method</Label>
                      <select value={selectedMethodToAdd} onChange={(e) => setSelectedMethodToAdd(e.target.value)} className="w-full rounded-md border border-[#C8782A]/20 bg-white px-3 py-2.5 mt-1">
                        <option value="">Select a method</option>
                        <option value="email">Apply by Email</option>
                        <option value="phone">Apply by Phone</option>
                        <option value="mail">Apply by Mail</option>
                        <option value="inPerson">Apply in Person</option>
                      </select>
                    </div>
                    <Button type="button" onClick={addApplyMethod} disabled={!selectedMethodToAdd} className="bg-[#C8782A] hover:bg-[#B06820] text-white">
                      <Plus size={16} className="mr-1" /> Add
                    </Button>
                  </div>

                  {applyMethods.length > 0 && (
                    <div className="space-y-3">
                      {applyMethods.map((method, index) => (
                        <ApplyMethodCard
                          key={index}
                          method={method.method}
                          data={method}
                          onChange={(field, value) => updateApplyMethod(index, field, value)}
                          onRemove={() => removeApplyMethod(index)}
                          isRemovable={applyMethods.length > 1}
                        />
                      ))}
                    </div>
                  )}

                  {errors.applyMethods && <p className="text-xs text-red-500">{errors.applyMethods}</p>}
                </div>
              </div>

              {/* Submit */}
              <div className="flex flex-col gap-4">
                {serverError && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                    <AlertCircle size={15} /> {serverError}
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button type="submit" disabled={loading} className="bg-[#C8782A] hover:bg-[#B06820] text-white font-semibold px-10">
                    {loading ? <span className="flex items-center gap-2"><div className="animate-spin rounded-full h-4 w-4 border-2 border-white" /> Processing...</span> : (isEditMode ? 'Update Job' : 'Post Job')}
                  </Button>
                  <Link href="/employers/dashboard">
                    <Button type="button" variant="outline" className="border-[#C8782A]/25">Cancel</Button>
                  </Link>
                </div>
              </div>
            </motion.form>

            {/* Preview Sidebar */}
            <div className="xl:w-[380px] flex-shrink-0">
              <div className="flex flex-col gap-5 xl:sticky xl:top-24">
                <JobPostingPreview data={previewData} />
                <div className="bg-[#FAF5EE] rounded-2xl p-6 border border-[#C8782A]/10">
                  <h4 className="font-bold text-[#1C1C1C] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Why Post with Us?</h4>
                  <ul className="flex flex-col gap-3">
                    {['15,000+ active Indigenous job seekers', 'Canada-wide reach', 'Culturally respectful platform', 'Dedicated employer support'].map(item => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-[#6B3A2A]/75">
                        <CheckCircle size={14} className="text-[#7A9E7E] flex-shrink-0 mt-0.5" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}