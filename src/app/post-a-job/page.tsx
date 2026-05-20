"use client";

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  Briefcase, CheckCircle, ArrowRight, ChevronRight,
  Send, Info, AlertCircle, XCircle, Mail, Phone, MapPin, Building2, Plus, Trash2,
  Mailbox,

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
      <h2
        className="text-xl font-bold text-[#1C1C1C]"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
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
          <button
            type="button"
            onClick={onRemove}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
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
              <p className="text-xs text-[#6B3A2A]/50 mt-1">Example: Monday-Friday, 9AM-5PM or Drop off resume between 10AM-2PM</p>
            </div>
          </>
        )}
      </div>
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

  /* Apply Methods State */
  const [applyMethods, setApplyMethods] = useState<ApplyMethod[]>([]);
  const [selectedMethodToAdd, setSelectedMethodToAdd] = useState<string>('');

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  /* Validation errors */
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  /* Helper to mark field as touched */
  const markTouched = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  /* Add new apply method */
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

  /* Remove apply method */
  const removeApplyMethod = (index: number) => {
    setApplyMethods(applyMethods.filter((_, i) => i !== index));
  };

  /* Update apply method data */
  const updateApplyMethod = (index: number, field: string, value: string) => {
    const updated = [...applyMethods];
    updated[index] = { ...updated[index], [field]: value };
    setApplyMethods(updated);
  };

  /* Validation function */
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

    // Validate apply methods
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

  /* Derived preview data */
  const location = [city, province].filter(Boolean).join(', ');

  const previewData: JobPostingData = {
    title,
    company,
    location,
    employmentType,
    salary,
    salaryType,
    descriptionHtml: descHtml,
    requirementsHtml: reqHtml,
    indigenous,
    remote,
    packageName: 'Job Posting',
    featured: false,
    nocCode,
    runDays,
    experience,
    startDate,
    category,
    website,
    applyMethods, // Pass to preview
  };

  const handleDescChange = useCallback((text: string) => { }, []);
  const handleDescHtml = useCallback((html: string) => {
    setDescHtml(html);
    if (errors.description && html.trim() && html !== '<p></p>' && html !== '<p><br></p>') {
      setErrors(prev => ({ ...prev, description: '' }));
    }
  }, [errors.description]);

  const handleReqChange = useCallback((text: string) => { }, []);
  const handleReqHtml = useCallback((html: string) => {
    setReqHtml(html);
    if (errors.requirements && html.trim() && html !== '<p></p>' && html !== '<p><br></p>') {
      setErrors(prev => ({ ...prev, requirements: '' }));
    }
  }, [errors.requirements]);

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
          postDate: new Date().toISOString(),
        }),
      });

      const data = await res.json();

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

  /* Success state */
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
            Thank you, <strong>{company || 'your organization'}</strong>. Your job posting for{' '}
            <strong>{title || 'the role'}</strong> has been received.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Link href="/employers" className="w-full sm:w-auto">
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
              }}
            >
              Post Another Job
            </Button>
          </div>
        </motion.div>
      </section>
    );
  }

  /* Main form */
  return (
    <>
      {/* Hero */}
      <section className="bg-[#FAF5EE] py-12 lg:py-20 relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.div variants={fadeUp} className="flex items-center gap-2 text-sm text-[#6B3A2A]/60 mb-4 flex-wrap">
              <Link href="/employers" className="hover:text-[#C8782A] transition-colors">Employers</Link>
              <ChevronRight size={14} />
              <span className="text-[#C8782A] font-medium">Post a Job</span>
            </motion.div>
            <motion.p variants={fadeUp} className="text-[#C8782A] font-semibold text-sm uppercase tracking-widest mb-3">
              Employers
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1C1C1C] mb-4 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Post a Job
            </motion.h1>
            <motion.p variants={fadeUp} className="text-[#6B3A2A]/70 text-base sm:text-lg max-w-xl leading-relaxed">
              Reach thousands of qualified Indigenous job seekers across Canada. Fill in your details
              and watch your listing come to life in the preview.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Form + Sidebar */}
      <section className="bg-white py-10 lg:py-14 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col xl:flex-row gap-8">
            {/* LEFT: Form */}
            <motion.form
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              onSubmit={handleSubmit}
              className="flex-1 flex flex-col gap-8"
              noValidate
            >
              {/* Step 1 — Job Details */}
              <div className="bg-white rounded-3xl p-5 sm:p-7 lg:p-9 border border-[#C8782A]/10">
                <SectionHeading step={1} title="Job Details" />
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
                      onChange={(e) => {
                        setTitle(e.target.value);
                        if (errors.title && e.target.value.trim()) {
                          setErrors(prev => ({ ...prev, title: '' }));
                        }
                      }}
                      onBlur={(e) => {
                        markTouched('title');
                        if (!e.target.value.trim()) setErrors(prev => ({ ...prev, title: 'Job title is required' }));
                      }}
                      placeholder="e.g. Community Health Worker"
                      className={`border-[#C8782A]/20 focus-visible:ring-[#C8782A]/30 ${errors.title && touched.title ? 'border-red-500' : ''}`}
                    />
                    {errors.title && touched.title && (
                      <p className="text-xs text-red-500 flex items-center gap-1 mt-1"><XCircle size={12} /> {errors.title}</p>
                    )}
                  </div>

                  {/* Company + Website */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="company" className="text-[#6B3A2A] font-medium text-sm">
                        Company / Organization <span className="text-[#C8782A]">*</span>
                      </Label>
                      <Input
                        id="company"
                        required
                        value={company}
                        onChange={(e) => {
                          setCompany(e.target.value);
                          if (errors.company && e.target.value.trim()) {
                            setErrors(prev => ({ ...prev, company: '' }));
                          }
                        }}
                        onBlur={(e) => {
                          markTouched('company');
                          if (!e.target.value.trim()) setErrors(prev => ({ ...prev, company: 'Company name is required' }));
                        }}
                        placeholder="Your organization name"
                        className={`border-[#C8782A]/20 focus-visible:ring-[#C8782A]/30 ${errors.company && touched.company ? 'border-red-500' : ''}`}
                      />
                      {errors.company && touched.company && <p className="text-xs text-red-500 flex items-center gap-1 mt-1"><XCircle size={12} /> {errors.company}</p>}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="website" className="text-[#6B3A2A] font-medium text-sm">Website (optional)</Label>
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
                        onChange={(e) => {
                          setCity(e.target.value);
                          if (errors.city && e.target.value.trim()) {
                            setErrors(prev => ({ ...prev, city: '' }));
                          }
                        }}
                        onBlur={(e) => {
                          markTouched('city');
                          if (!e.target.value.trim()) setErrors(prev => ({ ...prev, city: 'City is required' }));
                        }}
                        placeholder="e.g. Edmonton"
                        className={`border-[#C8782A]/20 focus-visible:ring-[#C8782A]/30 ${errors.city && touched.city ? 'border-red-500' : ''}`}
                      />
                      {errors.city && touched.city && <p className="text-xs text-red-500 flex items-center gap-1 mt-1"><XCircle size={12} /> {errors.city}</p>}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="province" className="text-[#6B3A2A] font-medium text-sm">
                        Province / Territory <span className="text-[#C8782A]">*</span>
                      </Label>
                      <select
                        id="province"
                        required
                        value={province}
                        onChange={(e) => {
                          setProvince(e.target.value);
                          if (errors.province && e.target.value) setErrors(prev => ({ ...prev, province: '' }));
                        }}
                        onBlur={(e) => {
                          markTouched('province');
                          if (!e.target.value) setErrors(prev => ({ ...prev, province: 'Province is required' }));
                        }}
                        className={`w-full rounded-md border border-[#C8782A]/20 bg-white px-3 py-2.5 text-sm text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#C8782A]/30 ${errors.province && touched.province ? 'border-red-500' : ''}`}
                      >
                        <option value="">Select province / territory</option>
                        {provinces.map((p) => <option key={p}>{p}</option>)}
                      </select>
                      {errors.province && touched.province && <p className="text-xs text-red-500 flex items-center gap-1 mt-1"><XCircle size={12} /> {errors.province}</p>}
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
                        onChange={(e) => {
                          setEmploymentType(e.target.value);
                          if (errors.employmentType && e.target.value) setErrors(prev => ({ ...prev, employmentType: '' }));
                        }}
                        onBlur={(e) => {
                          markTouched('employmentType');
                          if (!e.target.value) setErrors(prev => ({ ...prev, employmentType: 'Employment type is required' }));
                        }}
                        className={`w-full rounded-md border border-[#C8782A]/20 bg-white px-3 py-2.5 text-sm text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#C8782A]/30 ${errors.employmentType && touched.employmentType ? 'border-red-500' : ''}`}
                      >
                        <option value="">Select type</option>
                        {employmentTypes.map((t) => <option key={t}>{t}</option>)}
                      </select>
                      {errors.employmentType && touched.employmentType && <p className="text-xs text-red-500 flex items-center gap-1 mt-1"><XCircle size={12} /> {errors.employmentType}</p>}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="salary" className="text-[#6B3A2A] font-medium text-sm">Salary (CAD)</Label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Input
                          id="salary"
                          value={salary}
                          onChange={(e) => setSalary(e.target.value)}
                          placeholder="e.g. 20 - 35"
                          className="flex-1 border-[#C8782A]/20 focus-visible:ring-[#C8782A]/30"
                        />
                        <select
                          value={salaryType}
                          onChange={(e) => setSalaryType(e.target.value)}
                          className="rounded-md border border-[#C8782A]/20 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8782A]/30"
                        >
                          <option value="hour">Per Hour</option>
                          <option value="week">Per Week</option>
                          <option value="month">Per Month</option>
                          <option value="year">Per Year</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* NOC Code + Run Ad For */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="noc-code" className="text-[#6B3A2A] font-medium text-sm">
                        Job Code / NOC Code <span className="text-[#C8782A]">*</span>
                      </Label>
                      <Input
                        id="noc-code"
                        value={nocCode}
                        onChange={(e) => {
                          setNocCode(e.target.value);
                          if (errors.nocCode && e.target.value.trim()) setErrors(prev => ({ ...prev, nocCode: '' }));
                        }}
                        onBlur={(e) => {
                          markTouched('nocCode');
                          if (!e.target.value.trim()) setErrors(prev => ({ ...prev, nocCode: 'NOC code is required' }));
                        }}
                        placeholder="e.g. 21231"
                        className={`border-[#C8782A]/20 focus-visible:ring-[#C8782A]/30 ${errors.nocCode && touched.nocCode ? 'border-red-500' : ''}`}
                      />
                      {errors.nocCode && touched.nocCode && <p className="text-xs text-red-500 flex items-center gap-1 mt-1"><XCircle size={12} /> {errors.nocCode}</p>}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="run-for" className="text-[#6B3A2A] font-medium text-sm">Run Ad For</Label>
                      <select
                        id="run-for"
                        value={runDays}
                        onChange={(e) => setRunDays(e.target.value)}
                        className="w-full rounded-md border border-[#C8782A]/20 bg-white px-3 py-2.5 text-sm text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#C8782A]/30"
                      >
                        <option value="30">30 Days</option>
                        <option value="60">60 Days</option>
                        <option value="90">90 Days</option>
                        <option value="120">120 Days</option>
                        <option value="150">150 Days</option>
                      </select>
                    </div>
                  </div>

                  {/* Experience + Start Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="experience" className="text-[#6B3A2A] font-medium text-sm">Experience Required</Label>
                      <Input
                        id="experience"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        placeholder="e.g. 2+ years"
                        className="border-[#C8782A]/20 focus-visible:ring-[#C8782A]/30"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="start-date" className="text-[#6B3A2A] font-medium text-sm">Expected Start Date</Label>
                      <select
                        id="start-date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full rounded-md border border-[#C8782A]/20 bg-white px-3 py-2.5 text-sm text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#C8782A]/30"
                      >
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
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="category" className="text-[#6B3A2A] font-medium text-sm">
                      Job Category <span className="text-[#C8782A]">*</span>
                    </Label>
                    <select
                      id="category"
                      required
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        if (errors.category && e.target.value) setErrors(prev => ({ ...prev, category: '' }));
                      }}
                      onBlur={(e) => {
                        markTouched('category');
                        if (!e.target.value) setErrors(prev => ({ ...prev, category: 'Job category is required' }));
                      }}
                      className={`w-full rounded-md border border-[#C8782A]/20 bg-white px-3 py-2.5 text-sm text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#C8782A]/30 ${errors.category && touched.category ? 'border-red-500' : ''}`}
                    >
                      <option value="">Select a category</option>
                      {jobCategories.map((c) => <option key={c}>{c}</option>)}
                    </select>
                    {errors.category && touched.category && <p className="text-xs text-red-500 flex items-center gap-1 mt-1"><XCircle size={12} /> {errors.category}</p>}
                  </div>

                  {/* Toggles */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <Switch checked={remote} onCheckedChange={setRemote} className="data-[state=checked]:bg-[#C8782A]" />
                      <span className="text-sm text-[#6B3A2A] font-medium">Remote / Hybrid available</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <Switch checked={indigenous} onCheckedChange={setIndigenous} className="data-[state=checked]:bg-[#7A9E7E]" />
                      <span className="text-sm text-[#6B3A2A] font-medium">Indigenous-owned organization</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Step 2 — Job Description */}
              <div className="bg-white rounded-3xl p-5 sm:p-7 lg:p-9 border border-[#C8782A]/10">
                <SectionHeading step={2} title="Job Description" />
                <div className="flex flex-col gap-5">
                  <Tip>
                    Use plain, welcoming language. Describe the role, team, and what makes your
                    organization a great place to work. <strong>Maximum 5000 characters per field.</strong>
                  </Tip>

                  <div className="flex flex-col gap-2">
                    <Label className="text-[#6B3A2A] font-medium text-sm">
                      About the Role <span className="text-[#C8782A]">*</span>
                    </Label>
                    <RichTextEditor
                      placeholder="Describe the role, responsibilities, and what makes your organization a great place to work…"
                      onChange={handleDescChange}
                      onHtmlChange={handleDescHtml}
                      minHeight={200}
                      maxLength={5000}
                      required={true}
                    />
                    {errors.description && <p className="text-xs text-red-500 flex items-center gap-1 mt-1"><XCircle size={12} /> {errors.description}</p>}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label className="text-[#6B3A2A] font-medium text-sm">
                      Qualifications &amp; Requirements <span className="text-[#C8782A]">*</span>
                    </Label>
                    <RichTextEditor
                      placeholder="List required skills, education, experience, and any preferred qualifications…"
                      onChange={handleReqChange}
                      onHtmlChange={handleReqHtml}
                      minHeight={160}
                      maxLength={4000}
                      required={true}
                    />
                    {errors.requirements && <p className="text-xs text-red-500 flex items-center gap-1 mt-1"><XCircle size={12} /> {errors.requirements}</p>}
                  </div>
                </div>
              </div>

              {/* Step 3 — How to Apply Methods */}
              <div className="bg-white rounded-3xl p-5 sm:p-7 lg:p-9 border border-[#C8782A]/10">
                <SectionHeading step={3} title="How to Apply" />
                <div className="flex flex-col gap-5">
                  <Tip>
                    Select one or more methods how candidates should apply for this position.
                    At least one method is required.
                  </Tip>

                  {/* Add  dropdown */}
                  <div className="flex flex-col sm:flex-row gap-3 items-end">
                    <div className="flex-1">
                      <Label className="text-xs text-[#6B3A2A] font-medium">Add Application Method</Label>
                      <select
                        value={selectedMethodToAdd}
                        onChange={(e) => setSelectedMethodToAdd(e.target.value)}
                        className="w-full rounded-md border border-[#C8782A]/20 bg-white px-3 py-2.5 text-sm text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#C8782A]/30 mt-1"
                      >
                        <option value="">Select a method</option>
                        <option value="email">Apply by Email</option>
                        <option value="phone">Apply by Phone</option>
                        <option value="mail">Apply by Mail</option>
                        <option value="inPerson">Apply in Person</option>
                      </select>
                    </div>
                    <Button
                      type="button"
                      onClick={addApplyMethod}
                      disabled={!selectedMethodToAdd}
                      className="bg-[#C8782A] hover:bg-[#B06820] text-white font-semibold px-4 py-2.5 h-auto sm:mb-0"
                    >
                      <Plus size={16} className="mr-1" /> Add
                    </Button>
                  </div>

                  {/* Display added methods */}
                  {applyMethods.length > 0 && (
                    <div className="space-y-3 mt-2">
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

                  {errors.applyMethods && (
                    <p className="text-xs text-red-500 flex items-center gap-1 mt-1"><AlertCircle size={12} /> {errors.applyMethods}</p>
                  )}
                  {Object.keys(errors).filter(k => k.startsWith('applyMethod_')).map(key => (
                    <p key={key} className="text-xs text-red-500 flex items-center gap-1"><XCircle size={12} /> {errors[key]}</p>
                  ))}
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
                    className="bg-[#C8782A] hover:bg-[#B06820] text-white font-semibold px-10 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-60 w-full sm:w-auto"
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
                      <span className="flex items-center gap-2">Submit Job Posting <Send size={15} /></span>
                    )}
                  </Button>
                  <p className="text-xs text-[#6B3A2A]/50 self-center leading-relaxed max-w-xs">
                    Your job posting will be live immediately. You can edit or close it from your dashboard.
                  </p>
                </div>
              </div>
            </motion.form>

            {/* RIGHT: Sidebar - Preview */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="xl:w-[380px] flex-shrink-0"
            >
              <div className="flex flex-col gap-5 xl:sticky xl:top-24">
                <JobPostingPreview data={previewData} />
{/* 
                <div className="bg-[#6B3A2A] rounded-2xl p-6 text-[#FAF5EE]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                      <Briefcase size={16} className="text-white" />
                    </div>
                    <h4 className="font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Need Help?</h4>
                  </div>
                  <p className="text-[#FAF5EE]/70 text-sm leading-relaxed mb-4">
                    Our team can help you craft an inclusive, effective job posting that resonates with Indigenous job seekers.
                  </p>
                  <Link href="/contact">
                    <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#6B3A2A] w-full text-sm font-semibold">
                      Contact Aboriginal Jobs Canada
                    </Button>
                  </Link>
                </div> */}

                <div className="bg-[#FAF5EE] rounded-2xl p-6 border border-[#C8782A]/10">
                  <h4 className="font-bold text-[#1C1C1C] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Why Post with Aboriginal Jobs Canada?</h4>
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
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}