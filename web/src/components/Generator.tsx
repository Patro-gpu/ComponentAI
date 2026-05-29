"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const UI_LIBRARIES = [
  { key: "antd", label: "Ant Design", frameworks: ["react"] },
  { key: "antd-vue", label: "Ant Design Vue", frameworks: ["vue"] },
  { key: "element-plus", label: "Element Plus", frameworks: ["vue"] },
  { key: "naive-ui", label: "Naive UI", frameworks: ["vue"] },
  { key: "arco-design", label: "Arco Design", frameworks: ["react", "vue"] },
  { key: "shadcn", label: "shadcn/ui", frameworks: ["react", "vue"] },
  { key: "tdesign", label: "TDesign", frameworks: ["react", "vue"] },
  { key: "vant", label: "Vant (Mobile)", frameworks: ["vue"] },
  { key: "tailwind", label: "Tailwind CSS", frameworks: ["react", "vue"] },
];

const FW_OPTIONS = [
  { key: "vue", label: "Vue 3" },
  { key: "react", label: "React" },
  { key: "svelte", label: "Svelte" },
  { key: "html", label: "HTML/CSS" },
];

const SCENARIOS = [
  { key: "table", label: "Data Table" },
  { key: "form", label: "Edit Form" },
  { key: "detail", label: "Detail Page" },
  { key: "modal", label: "Modal/Drawer" },
  { key: "search", label: "Search Filter" },
  { key: "dashboard", label: "Dashboard" },
  { key: "steps", label: "Step Form" },
  { key: "list", label: "List/Card" },
  { key: "custom", label: "Custom" },
];

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

export function Generator() {
  const [uiLib, setUiLib] = useState("element-plus");
  const [framework, setFramework] = useState("vue");
  const [scenario, setScenario] = useState("table");
  const [desc, setDesc] = useState("");
  const [projectSpec, setProjectSpec] = useState("");
  const [showSpec, setShowSpec] = useState(false);
  const [code, setCode] = useState("");
  const [generating, setGenerating] = useState(false);
  const [msg, setMsg] = useState("");
  const [tab, setTab] = useState<"code" | "preview">("code");

  // Filter UI libs by selected framework
  const availableLibs = UI_LIBRARIES.filter(
    (lib) => lib.frameworks.includes(framework)
  );

  async function doGenerate() {
    if (!desc.trim()) { setMsg("Please enter requirements"); return; }
    setGenerating(true); setCode(""); setMsg("");
    try {
      const res = await fetch(`${API_BASE}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: buildPrompt(uiLib, framework, scenario, projectSpec),
          user: desc,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setCode(data.content);
      setMsg("Done!");

      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        await supabase.from("components").insert({
          user_id: userData.user.id,
          component_type: `${uiLib}·${scenario}`,
          framework,
          prompt: desc,
          code: data.content,
        });
      }
    } catch (e: unknown) {
      setMsg(`Error: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div>
      {/* UI Library */}
      <div className="mb-3">
        <label className="block text-sm text-zinc-400 mb-1.5">UI Library</label>
        <div className="flex flex-wrap gap-1.5">
          {availableLibs.map((lib) => (
            <button key={lib.key} onClick={() => setUiLib(lib.key)}
              className={`px-3 py-1.5 rounded-lg text-xs border transition ${uiLib === lib.key ? "border-purple-500 bg-purple-500/15 text-white" : "border-zinc-700 text-zinc-400 hover:border-zinc-500"}`}>
              {lib.label}
            </button>
          ))}
        </div>
      </div>

      {/* Framework + Scenario */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">Framework</label>
          <div className="flex flex-wrap gap-1.5">
            {FW_OPTIONS.map((f) => (
              <button key={f.key} onClick={() => { setFramework(f.key); }}
                className={`px-3 py-1.5 rounded-lg text-xs border transition ${framework === f.key ? "border-purple-500 bg-purple-500/15 text-white" : "border-zinc-700 text-zinc-400 hover:border-zinc-500"}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">Scenario</label>
          <div className="flex flex-wrap gap-1.5">
            {SCENARIOS.map((s) => (
              <button key={s.key} onClick={() => setScenario(s.key)}
                className={`px-3 py-1.5 rounded-lg text-xs border transition ${scenario === s.key ? "border-purple-500 bg-purple-500/15 text-white" : "border-zinc-700 text-zinc-400 hover:border-zinc-500"}`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Project Spec (collapsible) */}
      <div className="mb-3">
        <button onClick={() => setShowSpec(!showSpec)}
          className="text-xs text-purple-400 hover:text-purple-300 mb-1.5 flex items-center gap-1">
          {showSpec ? "▼" : "▶"} Project Spec (theme, fields, code style)
        </button>
        {showSpec && (
          <textarea value={projectSpec} onChange={(e) => setProjectSpec(e.target.value)}
            placeholder={`Project specification:
- Theme color: #1677FF
- Field naming: camelCase, e.g. customerName
- API fields: customer_name (snake_case)
- Code style: TypeScript, Composition API
- Responsive: mobile + desktop`}
            className="w-full h-28 bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-xs text-zinc-300 placeholder-zinc-600 resize-none focus:outline-none focus:border-purple-500 font-mono"
          />
        )}
      </div>

      {/* Main Description */}
      <textarea value={desc} onChange={(e) => setDesc(e.target.value)}
        placeholder={
          scenario === "table"
            ? "e.g. Customer list table with columns: name, email, status, created_at. Support pagination, search, sort. Status column uses Tag component with color mapping."
            : scenario === "form"
            ? "e.g. Customer edit form with fields: name (required), email (required+validation), phone, status (select), notes (textarea). Submit calls POST /api/customers."
            : "Describe your component requirements in detail..."
        }
        className="w-full h-24 bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-200 placeholder-zinc-500 resize-none focus:outline-none focus:border-purple-500"
      />

      <button onClick={doGenerate} disabled={generating}
        className="mt-3 px-6 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 rounded-lg text-sm font-semibold transition">
        {generating ? "Generating..." : "Generate Component"}
      </button>

      {msg && <p className={`mt-2 text-xs ${msg.startsWith("Error") ? "text-red-400" : "text-emerald-400"}`}>{msg}</p>}

      {/* Output */}
      {code && (
        <div className="mt-6 border border-zinc-700 rounded-lg overflow-hidden">
          <div className="flex border-b border-zinc-700">
            <button onClick={() => setTab("code")} className={`px-4 py-2 text-sm ${tab === "code" ? "text-white border-b-2 border-purple-500" : "text-zinc-400"}`}>Code</button>
            <button onClick={() => setTab("preview")} className={`px-4 py-2 text-sm ${tab === "preview" ? "text-white border-b-2 border-purple-500" : "text-zinc-400"}`}>Preview</button>
            <button onClick={() => { navigator.clipboard.writeText(code); }}
              className="ml-auto px-4 py-2 text-sm text-zinc-400 hover:text-white">Copy</button>
          </div>
          {tab === "code" ? (
            <pre className="p-4 text-xs font-mono text-zinc-300 overflow-auto max-h-96 bg-zinc-950">{code}</pre>
          ) : (
            <div className="bg-zinc-950 min-h-[200px] flex items-center justify-center">
              <div className="text-center text-zinc-500 text-sm">
                <p>Preview not available for {uiLib} components</p>
                <p className="text-xs mt-1">Copy code to your project to see the rendered result</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function buildPrompt(uiLib: string, fw: string, scenario: string, projectSpec: string) {
  const libGuides: Record<string, string> = {
    antd: "Ant Design 5.x. Use Table, Form, Modal, Button, Input, Select, Tag, Space, Card, Descriptions. Import from 'antd'.",
    "antd-vue": "Ant Design Vue 4.x. Use a-table, a-form, a-modal, a-button, a-input, a-select, a-tag. Import from 'ant-design-vue'.",
    "element-plus": "Element Plus. Use ElTable, ElForm, ElDialog, ElButton, ElInput, ElSelect, ElTag. Import from 'element-plus'.",
    "naive-ui": "Naive UI. Use NDataTable, NForm, NModal, NButton, NInput, NSelect, NTag. Import from 'naive-ui'.",
    "arco-design": "Arco Design. Use Table, Form, Modal, Button, Input, Select, Tag. Import from '@arco-design/web-react' or '@arco-design/web-vue'.",
    shadcn: "shadcn/ui components. Use Table, Form, Dialog, Button, Input, Select, Badge. Import from '@/components/ui/'.",
    tdesign: "TDesign. Use Table, Form, Dialog, Button, Input, Select, Tag. Import from 'tdesign-react' or 'tdesign-vue-next'.",
    vant: "Vant 4 Mobile. Use van-list, van-form, van-popup, van-button, van-field, van-tag. Import from 'vant'.",
    tailwind: "Tailwind CSS utility classes. Build custom components with semantic HTML + Tailwind.",
  };

  const scenarioGuides: Record<string, string> = {
    table: "Build a data table with: columns definition, pagination, search/filter bar, loading state, empty state, row actions (edit/delete). Include TypeScript types.",
    form: "Build a form with: field validation rules, submit handler, loading state on submit, success/error feedback, field types (input, select, datepicker, textarea). Include TypeScript types.",
    detail: "Build a detail/description page with: field-value pairs in a card layout, loading skeleton, edit button, back navigation.",
    modal: "Build a modal/dialog with: form inside, submit/cancel buttons, loading state, validation, controlled visibility. Include TypeScript types.",
    search: "Build a search filter bar with: multiple filter fields, search/clear buttons, collapsible advanced filters, emit filter-change event.",
    dashboard: "Build a dashboard card with: stats numbers, trend indicators, charts placeholder, loading skeleton, responsive grid.",
    steps: "Build a step-by-step form with: steps indicator, per-step validation, next/prev navigation, final submit. Include TypeScript types.",
    list: "Build a list/card grid with: pagination/infinite scroll, loading skeleton cards, empty state, responsive grid.",
    custom: "Build the component as described.",
  };

  const specSection = projectSpec.trim()
    ? `\nProject specification:\n${projectSpec}\n`
    : "";

  return `You are a senior frontend engineer at an outsourcing company. Generate a production-ready enterprise backend component.

UI Library: ${libGuides[uiLib] || "Use modern best practices."}
Framework: ${fw === "vue" ? "Vue 3 Composition API with <script setup lang=\"ts\">. Use TypeScript." : fw === "react" ? "React functional components with hooks. Use TypeScript." : fw === "svelte" ? "Svelte 5 runes ($state). TypeScript." : "Modern HTML/CSS/JS."}
Scenario: ${scenarioGuides[scenario] || "Build the described component."}
${specSection}
Requirements:
1. Write clean, well-structured production code
2. Include loading, empty, error, edge-case states
3. Use the UI library's native components and patterns — do NOT use Tailwind unless specified
4. Include TypeScript types/interfaces
5. Props: make all text/options/data configurable via props
6. Accessibility: proper ARIA labels, keyboard navigation
7. Add Chinese locale where applicable (antd/element-plus locale)
8. Output ONLY the code, no explanations.`;
}
