import React, { useEffect, useState } from "react";
import api from "../lib/api";
import { Plus, X, FileText, ExternalLink, Trash2 } from "lucide-react";
import { toast } from "sonner";

const CAT_LABEL = { meeting_notes: "محاضر اجتماعات", correspondence: "مراسلات", report: "تقارير", memo: "مذكرات", presentation: "عروض", other: "أخرى" };
const CAT_COLOR = { meeting_notes: "bg-sky-500/15 text-sky-300", correspondence: "bg-emerald-500/15 text-emerald-300", report: "bg-amber-500/15 text-amber-300", memo: "bg-violet-500/15 text-violet-300", presentation: "bg-rose-500/15 text-rose-300", other: "bg-slate-500/15 text-slate-300" };

export default function DocumentsPage() {
  const [docs, setDocs] = useState([]);
  const [filter, setFilter] = useState("all");
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", category: "report", url: "", file_type: "PDF", is_public: true });

  const load = () => api.get("/documents").then(r => setDocs(r.data));
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try { await api.post("/documents", form); toast.success("تم رفع الوثيقة"); setShow(false); setForm({ title: "", description: "", category: "report", url: "", file_type: "PDF", is_public: true }); load(); }
    catch { toast.error("تعذر الرفع"); }
  };

  const del = async (id) => { if (!confirm("حذف الوثيقة؟")) return; await api.delete(`/documents/${id}`); load(); toast.success("تم الحذف"); };

  const filtered = filter === "all" ? docs : docs.filter(d => d.category === filter);

  return (
    <div data-testid="documents-page">
      <div className="flex items-end justify-between mb-7 flex-wrap gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-yellow-500/80">مركز الوثائق</div>
          <h1 className="font-heading text-4xl font-black mt-2">الأرشيف المؤسسي</h1>
          <p className="text-slate-500 text-sm mt-1">{filtered.length} وثيقة</p>
        </div>
        <button onClick={() => setShow(true)} className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold flex items-center gap-2"><Plus size={18}/> رفع وثيقة</button>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded-lg text-sm transition-colors ${filter==="all"?"bg-yellow-500/15 text-yellow-300 border border-yellow-500/30":"bg-white/5 text-slate-400 hover:text-slate-200 border border-white/5"}`}>الكل</button>
        {Object.entries(CAT_LABEL).map(([k, v]) => <button key={k} onClick={() => setFilter(k)} className={`px-4 py-2 rounded-lg text-sm transition-colors ${filter===k?"bg-yellow-500/15 text-yellow-300 border border-yellow-500/30":"bg-white/5 text-slate-400 hover:text-slate-200 border border-white/5"}`}>{v}</button>)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? <div className="glass-card p-10 text-center text-slate-500 col-span-3">لا توجد وثائق</div> :
        filtered.map(d => (
          <div key={d.id} className="glass-card p-5 hover:border-yellow-500/30 group">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400"><FileText size={20}/></div>
              <span className={`text-[10px] px-2 py-1 rounded ${CAT_COLOR[d.category]}`}>{CAT_LABEL[d.category]}</span>
            </div>
            <h3 className="font-heading font-bold text-slate-100 line-clamp-1">{d.title}</h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{d.description}</p>
            <div className="mt-3 text-xs text-slate-500">رفع بواسطة: {d.uploaded_by_name}</div>
            <div className="text-[11px] text-slate-600">{new Date(d.created_at).toLocaleDateString("ar-EG")}</div>
            <div className="mt-3 flex gap-2">
              <a href={d.url} target="_blank" rel="noreferrer" className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded bg-yellow-500/15 text-yellow-300 text-xs hover:bg-yellow-500/25"><ExternalLink size={12}/> فتح</a>
              <button onClick={() => del(d.id)} className="px-3 py-2 rounded bg-rose-500/10 text-rose-300 hover:bg-rose-500/20"><Trash2 size={12}/></button>
            </div>
          </div>
        ))}
      </div>

      {show && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShow(false)}>
          <div className="glass-card p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5"><h2 className="font-heading text-xl font-bold">رفع وثيقة</h2><button onClick={() => setShow(false)}><X size={18}/></button></div>
            <form onSubmit={submit} className="space-y-3">
              <input required placeholder="عنوان الوثيقة" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-4 py-2.5 rounded-lg bg-[#0a0d14]/80 border border-white/10 text-sm"/>
              <textarea placeholder="وصف موجز" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-4 py-2.5 rounded-lg bg-[#0a0d14]/80 border border-white/10 text-sm min-h-[70px]"/>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-4 py-2.5 rounded-lg bg-[#0a0d14]/80 border border-white/10 text-sm">
                {Object.entries(CAT_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <input required placeholder="رابط الوثيقة (Google Drive, OneDrive, ...)" value={form.url} onChange={e => setForm({...form, url: e.target.value})} className="w-full px-4 py-2.5 rounded-lg bg-[#0a0d14]/80 border border-white/10 text-sm" dir="ltr"/>
              <button type="submit" className="w-full py-3 rounded-lg bg-yellow-500 text-black font-bold">حفظ الوثيقة</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
