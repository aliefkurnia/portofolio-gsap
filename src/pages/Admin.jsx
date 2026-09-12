import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "./Admin.css";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;
const BUCKET = "portfolio-assets";

function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("technologies");
  const [technologies, setTechnologies] = useState([]);
  const [aiTools, setAiTools] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [projects, setProjects] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [dragItem, setDragItem] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [techRes, aiRes, expRes, projRes, settingsRes] = await Promise.all([
      supabase.from("technologies").select("*").order("sort_order"),
      supabase.from("ai_tools").select("*").order("sort_order"),
      supabase.from("experiences").select("*").order("sort_order"),
      supabase.from("projects").select("*").order("sort_order"),
      supabase.from("site_settings").select("*"),
    ]);
    if (techRes.data) setTechnologies(techRes.data);
    if (aiRes.data) setAiTools(aiRes.data);
    if (expRes.data) setExperiences(expRes.data);
    if (projRes.data) setProjects(projRes.data);
    if (settingsRes.data) {
      const map = {};
      settingsRes.data.forEach((row) => {
        map[row.key] = row.value;
      });
      setSettings(map);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authenticated) fetchData();
  }, [authenticated, fetchData]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
    } else {
      alert("Wrong password");
    }
  };

  async function uploadImage(file, folder) {
    const ext = file.name.split(".").pop();
    const fileName = `${folder}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, file, { contentType: file.type, upsert: true });
    if (error) {
      alert("Upload error: " + error.message);
      return null;
    }
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
    return data.publicUrl;
  }

  function startEdit(item) {
    setEditingItem(item);
    setFormData({ ...item });
  }

  function startCreate() {
    setEditingItem("new");
    if (activeTab === "technologies") {
      setFormData({ name: "", icon_url: "", sort_order: technologies.length });
    } else if (activeTab === "ai_tools") {
      setFormData({ name: "", icon_url: "", sort_order: aiTools.length });
    } else if (activeTab === "experiences") {
      setFormData({
        title: "",
        company_name: "",
        icon_url: "",
        icon_bg: "#ffffff",
        date_range: "",
        points: [""],
        sort_order: experiences.length,
      });
    } else if (activeTab === "projects") {
      setFormData({
        name: "",
        description: "",
        image_url: "",
        source_code_link: "",
        website_link: "",
        tags: [{ name: "", color: "blue-text-gradient" }],
        sort_order: projects.length,
      });
    }
  }

  function cancelEdit() {
    setEditingItem(null);
    setFormData({});
  }

  async function handleSave() {
    const table = activeTab;
    const data = { ...formData };
    delete data.id;
    delete data.created_at;

    if (editingItem === "new") {
      const { error } = await supabase.from(table).insert(data);
      if (error) {
        alert("Error: " + error.message);
        return;
      }
    } else {
      const { error } = await supabase
        .from(table)
        .update(data)
        .eq("id", editingItem.id);
      if (error) {
        alert("Error: " + error.message);
        return;
      }
    }
    cancelEdit();
    fetchData();
  }

  async function handleDelete(table, id) {
    if (!window.confirm("Delete this item?")) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) alert("Error: " + error.message);
    else fetchData();
  }

  async function handleFileChange(e, field, folder) {
    const file = e.target.files[0];
    if (!file) return;
    const url = await uploadImage(file, folder);
    if (url) setFormData((prev) => ({ ...prev, [field]: url }));
  }

  const listConfig = {
    technologies: { items: technologies, setItems: setTechnologies },
    ai_tools: { items: aiTools, setItems: setAiTools },
    experiences: { items: experiences, setItems: setExperiences },
    projects: { items: projects, setItems: setProjects },
  };

  function handleDragStart(table, index) {
    setDragItem({ table, index });
  }

  function handleDragEnter(table, index) {
    if (dragItem && dragItem.table === table) setDragOverIndex(index);
  }

  function handleDragEnd() {
    setDragItem(null);
    setDragOverIndex(null);
  }

  async function handleDrop(table, dropIndex) {
    if (!dragItem || dragItem.table !== table) {
      handleDragEnd();
      return;
    }
    const from = dragItem.index;
    const to = dropIndex;
    handleDragEnd();
    if (from === to) return;

    const { items, setItems } = listConfig[table];
    const updated = [...items];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    const reordered = updated.map((it, i) => ({ ...it, sort_order: i }));
    setItems(reordered);

    const changed = reordered.filter(
      (it, i) => items.findIndex((o) => o.id === it.id) !== i
    );
    const results = await Promise.all(
      changed.map((it) =>
        supabase.from(table).update({ sort_order: it.sort_order }).eq("id", it.id)
      )
    );
    const failed = results.find((r) => r.error);
    if (failed) {
      alert("Error saving order: " + failed.error.message);
      fetchData();
    }
  }

  if (!authenticated) {
    return (
      <div className="admin-login">
        <form onSubmit={handleLogin} className="admin-login-form">
          <h2>Admin Panel</h2>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Portfolio Admin</h1>
        <button onClick={() => navigate("/")} className="btn-logout">
          Logout
        </button>
      </header>

      <nav className="admin-tabs">
        {[
          ["technologies", "Technologies"],
          ["ai_tools", "AI Tools"],
          ["experiences", "Experiences"],
          ["projects", "Projects"],
          ["settings", "Settings"],
        ].map(([tab, label]) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => {
              setActiveTab(tab);
              cancelEdit();
            }}
          >
            {label}
          </button>
        ))}
      </nav>

      {loading ? (
        <p className="admin-loading">Loading...</p>
      ) : (
        <div className="admin-content">
          {activeTab !== "settings" && (
            <div className="admin-toolbar">
              <button onClick={startCreate} className="btn-add">
                + Add New
              </button>
            </div>
          )}

          {editingItem && (
            <div className="admin-form-overlay">
              <div className="admin-form">
                <h3>{editingItem === "new" ? "Create" : "Edit"}</h3>
                {activeTab === "technologies" && (
                  <TechForm
                    formData={formData}
                    setFormData={setFormData}
                    onFileChange={handleFileChange}
                    folder="tech"
                  />
                )}
                {activeTab === "ai_tools" && (
                  <TechForm
                    formData={formData}
                    setFormData={setFormData}
                    onFileChange={handleFileChange}
                    folder="ai"
                  />
                )}
                {activeTab === "experiences" && (
                  <ExpForm
                    formData={formData}
                    setFormData={setFormData}
                    onFileChange={handleFileChange}
                  />
                )}
                {activeTab === "projects" && (
                  <ProjectForm
                    formData={formData}
                    setFormData={setFormData}
                    onFileChange={handleFileChange}
                  />
                )}
                <div className="form-actions">
                  <button onClick={handleSave} className="btn-save">
                    Save
                  </button>
                  <button onClick={cancelEdit} className="btn-cancel">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "technologies" && (
            <div className="admin-list">
              {technologies.map((tech, index) => (
                <div
                  key={tech.id}
                  className={`admin-item${
                    dragItem?.table === "technologies" && dragItem.index === index
                      ? " dragging"
                      : ""
                  }${dragOverIndex === index && dragItem?.table === "technologies" ? " drag-over" : ""}`}
                  draggable
                  onDragStart={() => handleDragStart("technologies", index)}
                  onDragEnter={() => handleDragEnter("technologies", index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop("technologies", index)}
                  onDragEnd={handleDragEnd}
                >
                  <span className="drag-handle" title="Drag to reorder">⠿</span>
                  <img src={tech.icon_url} alt={tech.name} className="admin-thumb" />
                  <span>{tech.name}</span>
                  <div className="item-actions">
                    <button onClick={() => startEdit(tech)}>Edit</button>
                    <button onClick={() => handleDelete("technologies", tech.id)} className="btn-del">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "ai_tools" && (
            <div className="admin-list">
              {aiTools.map((tool, index) => (
                <div
                  key={tool.id}
                  className={`admin-item${
                    dragItem?.table === "ai_tools" && dragItem.index === index
                      ? " dragging"
                      : ""
                  }${dragOverIndex === index && dragItem?.table === "ai_tools" ? " drag-over" : ""}`}
                  draggable
                  onDragStart={() => handleDragStart("ai_tools", index)}
                  onDragEnter={() => handleDragEnter("ai_tools", index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop("ai_tools", index)}
                  onDragEnd={handleDragEnd}
                >
                  <span className="drag-handle" title="Drag to reorder">⠿</span>
                  {tool.icon_url && (
                    <img src={tool.icon_url} alt={tool.name} className="admin-thumb" />
                  )}
                  <span>{tool.name}</span>
                  <div className="item-actions">
                    <button onClick={() => startEdit(tool)}>Edit</button>
                    <button onClick={() => handleDelete("ai_tools", tool.id)} className="btn-del">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "experiences" && (
            <div className="admin-list">
              {experiences.map((exp, index) => (
                <div
                  key={exp.id}
                  className={`admin-item${
                    dragItem?.table === "experiences" && dragItem.index === index
                      ? " dragging"
                      : ""
                  }${dragOverIndex === index && dragItem?.table === "experiences" ? " drag-over" : ""}`}
                  draggable
                  onDragStart={() => handleDragStart("experiences", index)}
                  onDragEnter={() => handleDragEnter("experiences", index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop("experiences", index)}
                  onDragEnd={handleDragEnd}
                >
                  <span className="drag-handle" title="Drag to reorder">⠿</span>
                  <img src={exp.icon_url} alt={exp.company_name} className="admin-thumb" />
                  <div className="item-info">
                    <strong>{exp.title}</strong>
                    <span>{exp.company_name} | {exp.date_range}</span>
                  </div>
                  <div className="item-actions">
                    <button onClick={() => startEdit(exp)}>Edit</button>
                    <button onClick={() => handleDelete("experiences", exp.id)} className="btn-del">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "projects" && (
            <div className="admin-list">
              {projects.map((proj, index) => (
                <div
                  key={proj.id}
                  className={`admin-item${
                    dragItem?.table === "projects" && dragItem.index === index
                      ? " dragging"
                      : ""
                  }${dragOverIndex === index && dragItem?.table === "projects" ? " drag-over" : ""}`}
                  draggable
                  onDragStart={() => handleDragStart("projects", index)}
                  onDragEnter={() => handleDragEnter("projects", index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop("projects", index)}
                  onDragEnd={handleDragEnd}
                >
                  <span className="drag-handle" title="Drag to reorder">⠿</span>
                  <img src={proj.image_url} alt={proj.name} className="admin-thumb project-thumb" />
                  <div className="item-info">
                    <strong>{proj.name}</strong>
                    <span>{proj.description.slice(0, 60)}...</span>
                  </div>
                  <div className="item-actions">
                    <button onClick={() => startEdit(proj)}>Edit</button>
                    <button onClick={() => handleDelete("projects", proj.id)} className="btn-del">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "settings" && (
            <SettingsPanel
              settings={settings}
              uploadImage={uploadImage}
              onSaved={fetchData}
            />
          )}
        </div>
      )}
    </div>
  );
}

function TechForm({ formData, setFormData, onFileChange, folder = "tech" }) {
  return (
    <div className="form-fields">
      <label>Name</label>
      <input
        value={formData.name || ""}
        onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
      />
      <label>Icon</label>
      {formData.icon_url && <img src={formData.icon_url} alt="" className="form-preview" />}
      <input type="file" accept="image/*" onChange={(e) => onFileChange(e, "icon_url", "tech")} />
    </div>
  );
}

function ExpForm({ formData, setFormData, onFileChange }) {
  const points = formData.points || [""];

  return (
    <div className="form-fields">
      <label>Title</label>
      <input
        value={formData.title || ""}
        onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
      />
      <label>Company Name</label>
      <input
        value={formData.company_name || ""}
        onChange={(e) => setFormData((p) => ({ ...p, company_name: e.target.value }))}
      />
      <label>Company Icon</label>
      {formData.icon_url && <img src={formData.icon_url} alt="" className="form-preview" />}
      <input type="file" accept="image/*" onChange={(e) => onFileChange(e, "icon_url", "company")} />
      <label>Icon Background Color</label>
      <input
        type="color"
        value={formData.icon_bg || "#ffffff"}
        onChange={(e) => setFormData((p) => ({ ...p, icon_bg: e.target.value }))}
      />
      <label>Date Range</label>
      <input
        value={formData.date_range || ""}
        onChange={(e) => setFormData((p) => ({ ...p, date_range: e.target.value }))}
      />
      <label>Points</label>
      {points.map((point, i) => (
        <div key={i} className="point-row">
          <input
            value={point}
            onChange={(e) => {
              const updated = [...points];
              updated[i] = e.target.value;
              setFormData((p) => ({ ...p, points: updated }));
            }}
          />
          <button
            type="button"
            className="btn-remove-point"
            onClick={() => {
              const updated = points.filter((_, idx) => idx !== i);
              setFormData((p) => ({ ...p, points: updated }));
            }}
          >
            x
          </button>
        </div>
      ))}
      <button
        type="button"
        className="btn-add-point"
        onClick={() => setFormData((p) => ({ ...p, points: [...points, ""] }))}
      >
        + Add Point
      </button>
    </div>
  );
}

function ProjectForm({ formData, setFormData, onFileChange }) {
  const tags = formData.tags || [{ name: "", color: "blue-text-gradient" }];

  return (
    <div className="form-fields">
      <label>Name</label>
      <input
        value={formData.name || ""}
        onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
      />
      <label>Description</label>
      <textarea
        value={formData.description || ""}
        onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
      />
      <label>Project Image</label>
      {formData.image_url && <img src={formData.image_url} alt="" className="form-preview project-preview" />}
      <input type="file" accept="image/*" onChange={(e) => onFileChange(e, "image_url", "projects")} />
      <label>Source Code Link</label>
      <input
        value={formData.source_code_link || ""}
        onChange={(e) => setFormData((p) => ({ ...p, source_code_link: e.target.value }))}
      />
      <label>Website Link</label>
      <input
        value={formData.website_link || ""}
        onChange={(e) => setFormData((p) => ({ ...p, website_link: e.target.value }))}
      />
      <label>Tags</label>
      {tags.map((tag, i) => (
        <div key={i} className="tag-row">
          <input
            placeholder="Tag name"
            value={tag.name}
            onChange={(e) => {
              const updated = [...tags];
              updated[i] = { ...updated[i], name: e.target.value };
              setFormData((p) => ({ ...p, tags: updated }));
            }}
          />
          <select
            value={tag.color}
            onChange={(e) => {
              const updated = [...tags];
              updated[i] = { ...updated[i], color: e.target.value };
              setFormData((p) => ({ ...p, tags: updated }));
            }}
          >
            <option value="blue-text-gradient">Blue</option>
            <option value="green-text-gradient">Green</option>
            <option value="pink-text-gradient">Pink</option>
          </select>
          <button
            type="button"
            className="btn-remove-point"
            onClick={() => {
              const updated = tags.filter((_, idx) => idx !== i);
              setFormData((p) => ({ ...p, tags: updated }));
            }}
          >
            x
          </button>
        </div>
      ))}
      <button
        type="button"
        className="btn-add-point"
        onClick={() =>
          setFormData((p) => ({
            ...p,
            tags: [...tags, { name: "", color: "blue-text-gradient" }],
          }))
        }
      >
        + Add Tag
      </button>
    </div>
  );
}

function SettingsPanel({ settings, uploadImage, onSaved }) {
  const [heroPhoto, setHeroPhoto] = useState(settings.hero_photo_url || "");
  const [jobTitle, setJobTitle] = useState(settings.job_title || "Software Developer");
  const [aboutHeadline, setAboutHeadline] = useState(settings.about_headline || "");
  const [aboutBio, setAboutBio] = useState(settings.about_bio || "");
  const [cvIdUrl, setCvIdUrl] = useState(settings.cv_id_url || "");
  const [cvEnUrl, setCvEnUrl] = useState(settings.cv_en_url || "");
  const [saving, setSaving] = useState(false);

  async function upsertSetting(key, value) {
    const { data } = await supabase
      .from("site_settings")
      .select("id")
      .eq("key", key)
      .single();

    if (data) {
      await supabase.from("site_settings").update({ value }).eq("key", key);
    } else {
      await supabase.from("site_settings").insert({ key, value });
    }
  }

  async function handleSaveSettings() {
    setSaving(true);
    await Promise.all([
      upsertSetting("hero_photo_url", heroPhoto),
      upsertSetting("job_title", jobTitle),
      upsertSetting("about_headline", aboutHeadline),
      upsertSetting("about_bio", aboutBio),
      upsertSetting("cv_id_url", cvIdUrl),
      upsertSetting("cv_en_url", cvEnUrl),
    ]);
    setSaving(false);
    onSaved();
    alert("Settings saved!");
  }

  async function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const url = await uploadImage(file, "hero");
    if (url) setHeroPhoto(url);
  }

  async function handleCvUpload(e, lang) {
    const file = e.target.files[0];
    if (!file) return;
    const ext = file.name.split(".").pop();
    const fileName = `cv/cv-${lang}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("portfolio-assets")
      .upload(fileName, file, { contentType: file.type, upsert: true });
    if (error) {
      alert("Upload error: " + error.message);
      return;
    }
    const { data } = supabase.storage.from("portfolio-assets").getPublicUrl(fileName);
    if (lang === "id") setCvIdUrl(data.publicUrl);
    else setCvEnUrl(data.publicUrl);
  }

  return (
    <div className="settings-panel">
      <div className="settings-section">
        <h3>Hero Photo</h3>
        <p className="settings-desc">Photo displayed in the About section</p>
        {heroPhoto && <img src={heroPhoto} alt="Hero" className="settings-preview" />}
        <input type="file" accept="image/*" onChange={handlePhotoUpload} />
      </div>

      <div className="settings-section">
        <h3>Job Title</h3>
        <p className="settings-desc">Subtitle shown below your name in the hero section</p>
        <input
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="Software Developer"
        />
      </div>

      <div className="settings-section">
        <h3>About Headline</h3>
        <p className="settings-desc">Short headline in the About section</p>
        <input
          type="text"
          value={aboutHeadline}
          onChange={(e) => setAboutHeadline(e.target.value)}
          placeholder="Software developer based in Indonesia."
        />
      </div>

      <div className="settings-section">
        <h3>About Bio</h3>
        <p className="settings-desc">Your bio paragraph in the About section</p>
        <textarea
          className="settings-textarea"
          value={aboutBio}
          onChange={(e) => setAboutBio(e.target.value)}
          placeholder="Write a short bio about yourself..."
          rows={4}
        />
      </div>

      <div className="settings-section">
        <h3>CV / Resume</h3>
        <p className="settings-desc">Upload PDF files for Indonesian and English versions</p>
        <div className="cv-upload-group">
          <label>CV (Indonesia)</label>
          {cvIdUrl && (
            <a href={cvIdUrl} target="_blank" rel="noopener noreferrer" className="cv-link-preview">
              View current CV (ID)
            </a>
          )}
          <input type="file" accept=".pdf" onChange={(e) => handleCvUpload(e, "id")} />
        </div>
        <div className="cv-upload-group">
          <label>CV (English)</label>
          {cvEnUrl && (
            <a href={cvEnUrl} target="_blank" rel="noopener noreferrer" className="cv-link-preview">
              View current CV (EN)
            </a>
          )}
          <input type="file" accept=".pdf" onChange={(e) => handleCvUpload(e, "en")} />
        </div>
      </div>

      <button onClick={handleSaveSettings} className="btn-save-settings" disabled={saving}>
        {saving ? "Saving..." : "Save Settings"}
      </button>
    </div>
  );
}

export default Admin;
