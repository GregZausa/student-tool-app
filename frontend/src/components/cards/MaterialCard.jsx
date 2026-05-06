import React from "react";
import { TYPE_CONFIG } from "../../utils/constants/materials.config";
import { getDomain, getYoutubeThumbnail, timeAgo } from "../../utils/functions/materials";
import { ExternalLink, Play, Trash2 } from "lucide-react";

const MaterialCard = ({ material, onDelete }) => {
  const cfg = TYPE_CONFIG[material.type] || TYPE_CONFIG.other;
  const TypeIcon = cfg.icon;
  const thumb =
    material.type === "youtube" ? getYoutubeThumbnail(material.url) : null;
  const domain = material.url ? getDomain(material.url) : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-sm hover:border-slate-300 transition-all group">
      {thumb && (
        <div className="relative h-32 bg-slate-100 overflow-hidden">
          <img
            src={thumb}
            alt={material.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
              <Play size={18} className="text-white" />
            </div>
          </div>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start gap-3">
          {!thumb && (
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cfg.color}`}
            >
              <TypeIcon size={16} />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2">
                {material.title}
              </h3>
              <button
                onClick={() => onDelete(material.id)}
                className="shrink-0 w-6 h-6 rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-50 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={12} />
              </button>
            </div>

            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ${cfg.badge}`}
              >
                {cfg.label}
              </span>
              {material.subject && (
                <span className="text-[10px] text-slate-400 font-medium">
                  📚 {material.subject}
                </span>
              )}
              {domain && (
                <span className="text-[10px] text-slate-400 truncate max-w-60">
                  {domain}
                </span>
              )}
            </div>

            <div className="text-[10px] text-slate-300 mt-1">
              {timeAgo(material.created_at)}
            </div>
          </div>
        </div>

        {material.url && (
          <a
            href={material.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-1.5 w-full py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
          >
            <ExternalLink size={12} /> Open
          </a>
        )}
      </div>
    </div>
  );
};

export default MaterialCard;
