/**
 * JobPostingPreview — live read-only preview of a job posting.
 * Mirrors how the listing will appear to job seekers on Aboriginal Jobs Canada.
 */
import { MapPin, Clock, DollarSign, Building2, Eye } from 'lucide-react';

export interface JobPostingData {
  title: string;
  company: string;
  location: string;
  employmentType: string;
  salary: string;
  descriptionHtml: string;
  requirementsHtml: string;
  indigenous: boolean;
  remote: boolean;
  packageName: string;
  featured: boolean;
}

interface JobPostingPreviewProps {
  data: JobPostingData;
}

export default function JobPostingPreview({ data }: JobPostingPreviewProps) {
  const isEmpty =
    !data.title && !data.company && !data.location && !data.descriptionHtml;

  return (
    <div className="bg-white rounded-3xl border border-[#C8782A]/10 overflow-hidden">
      {/* Preview header bar */}
      <div className="flex items-center gap-2 px-5 py-3 bg-[#FAF5EE] border-b border-[#C8782A]/10">
        <Eye size={14} className="text-[#C8782A]" />
        <span className="text-xs font-semibold text-[#6B3A2A] uppercase tracking-wider">
          Live Preview
        </span>
        {data.featured && (
          <span className="ml-auto text-xs bg-[#C8782A] text-white px-2.5 py-0.5 rounded-full font-semibold">
            Featured
          </span>
        )}
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="w-14 h-14 rounded-full bg-[#C8782A]/10 flex items-center justify-center mb-4">
            <Building2 size={24} className="text-[#C8782A]/50" />
          </div>
          <p className="text-[#6B3A2A]/50 text-sm leading-relaxed">
            Your job posting preview will appear here as you fill in the form.
          </p>
        </div>
      ) : (
        <div className="p-6">
          {/* Title + company */}
          <div className="mb-4">
            <h3
              className="text-xl font-bold text-[#1C1C1C] leading-tight mb-1"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {data.title || <span className="text-[#1C1C1C]/30 italic">Job Title</span>}
            </h3>
            <p className="text-[#C8782A] font-semibold text-sm">
              {data.company || <span className="text-[#1C1C1C]/30 italic">Company Name</span>}
            </p>
          </div>

          {/* Meta chips */}
          <div className="flex flex-wrap gap-2 mb-5">
            {data.location && (
              <span className="inline-flex items-center gap-1.5 text-xs text-[#6B3A2A]/70 bg-[#FAF5EE] border border-[#C8782A]/15 rounded-full px-3 py-1">
                <MapPin size={11} className="text-[#C8782A]" />
                {data.location}
              </span>
            )}
            {data.employmentType && (
              <span className="inline-flex items-center gap-1.5 text-xs text-[#6B3A2A]/70 bg-[#FAF5EE] border border-[#C8782A]/15 rounded-full px-3 py-1">
                <Clock size={11} className="text-[#C8782A]" />
                {data.employmentType}
              </span>
            )}
            {data.salary && (
              <span className="inline-flex items-center gap-1.5 text-xs text-[#6B3A2A]/70 bg-[#FAF5EE] border border-[#C8782A]/15 rounded-full px-3 py-1">
                <DollarSign size={11} className="text-[#C8782A]" />
                {data.salary}
              </span>
            )}
            {data.remote && (
              <span className="inline-flex items-center gap-1.5 text-xs text-white bg-[#1a64c4] rounded-full px-3 py-1">
                Remote
              </span>
            )}
            {data.indigenous && (
              <span className="inline-flex items-center gap-1.5 text-xs text-white bg-[#7A9E7E] rounded-full px-3 py-1">
                Indigenous Employer
              </span>
            )}
          </div>

          {/* Description */}
          {data.descriptionHtml && data.descriptionHtml !== '<p><br></p>' && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-[#6B3A2A]/50 uppercase tracking-wider mb-2">
                About the Role
              </p>
              <div
                className="text-sm text-[#1C1C1C]/75 leading-relaxed prose-sm [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_li]:my-0.5 [&_strong]:font-semibold [&_em]:italic"
                dangerouslySetInnerHTML={{ __html: data.descriptionHtml }}
              />
            </div>
          )}

          {/* Requirements */}
          {data.requirementsHtml && data.requirementsHtml !== '<p><br></p>' && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-[#6B3A2A]/50 uppercase tracking-wider mb-2">
                Qualifications
              </p>
              <div
                className="text-sm text-[#1C1C1C]/75 leading-relaxed [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_li]:my-0.5 [&_strong]:font-semibold [&_em]:italic"
                dangerouslySetInnerHTML={{ __html: data.requirementsHtml }}
              />
            </div>
          )}

          {/* Package badge */}
          {data.packageName && (
            <div className="mt-5 pt-4 border-t border-[#C8782A]/10">
              <p className="text-xs text-[#6B3A2A]/40">
                Package: <span className="font-medium text-[#6B3A2A]/60">{data.packageName}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
