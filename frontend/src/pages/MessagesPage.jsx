import React, { useEffect, useState } from "react";
import api from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import { Send, Plus, X } from "lucide-react";
import { toast } from "sonner";

export default function MessagesPage() {
  const { user } = useAuth();
  const [msgs, setMsgs] = useState([]);
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ recipient_id: "", subject: "", body: "" });

  const load = () => Promise.all([api.get("/messages"), api.get("/users")]).then(([m, u]) => { setMsgs(m.data); setUsers(u.data.filter(x => x.id !== user.id)); });
  useEffect(() => { load(); }, [user?.id]);

  const submit = async (e) => {
    e.preventDefault();
    try { await api.post("/messages", form); toast.success("تم الإرسال"); setShow(false); setForm({ recipient_id: "", subject: "", body: "" }); load(); }
    catch { toast.error("تعذر"); }
  };

  return (
    <div data-testid="messages-page">
      <div className="flex items-end justify-between mb-7 flex-wrap gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-yellow-500/80">التواصل الداخلي</div>
          <h1 className="font-heading text-4xl font-black mt-2">الرسائل</h1>
          <p className="text-slate-500 text-sm mt-1">{msgs.length} رسالة</p>
        </div>
        <button onClick={() => setShow(true)} className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold flex items-center gap-2"><Plus size={18}/> رسالة جديدة</button>
      </div>

      <div className="space-y-2">
        {msgs.length === 0 ? <div className="glass-card p-10 text-center text-slate-500">لا توجد رسائل</div> :
        msgs.map(m => {
          const incoming = m.recipient_id === user.id;
          return (
            <div key={m.id} className={`glass-card p-4 ${incoming && !m.read ? "border-yellow-500/30" : ""}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">{incoming ? `من: ${m.sender_name}` : `إلى: ${users.find(u => u.id === m.recipient_id)?.name || "—"}`}</span>
                <span className="text-xs text-slate-500">{new Date(m.created_at).toLocaleString("ar-EG")}</span>
              </div>
              {m.subject && <div className="font-bold text-slate-100">{m.subject}</div>}
              <div className="text-sm text-slate-300 mt-1 whitespace-pre-wrap">{m.body}</div>
            </div>
          );
        })}
      </div>

      {show && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShow(false)}>
          <div className="glass-card p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5"><h2 className="font-heading text-xl font-bold">رسالة جديدة</h2><button onClick={() => setShow(false)}><X size={18}/></button></div>
            <form onSubmit={submit} className="space-y-3">
              <select required value={form.recipient_id} onChange={e => setForm({...form, recipient_id: e.target.value})} className="w-full px-4 py-2.5 rounded-lg bg-[#0a0d14]/80 border border-white/10 text-sm">
                <option value="">— اختر المستقبل —</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
              <input placeholder="الموضوع" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="w-full px-4 py-2.5 rounded-lg bg-[#0a0d14]/80 border border-white/10 text-sm"/>
              <textarea required placeholder="نص الرسالة" value={form.body} onChange={e => setForm({...form, body: e.target.value})} className="w-full px-4 py-2.5 rounded-lg bg-[#0a0d14]/80 border border-white/10 text-sm min-h-[120px]"/>
              <button type="submit" className="w-full py-3 rounded-lg bg-yellow-500 text-black font-bold flex items-center justify-center gap-2"><Send size={14}/> إرسال</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
