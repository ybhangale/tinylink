'use client';
import { useState, useEffect } from "react";


function copyToClipboard(text: string) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
  }
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [links, setLinks] = useState([]);
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [rowCopied, setRowCopied] = useState<string | null>(null);


  const fetchLinks = async () => {
    const res = await fetch("/api/links");
    const data = await res.json();
    setLinks(data.links || []);
  };
  useEffect(() => {
    fetchLinks();
  }, []);

 
  useEffect(() => {
    if (shortUrl) fetchLinks();
  }, [shortUrl]);

  
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

 
  useEffect(() => {
    if (rowCopied) {
      const timer = setTimeout(() => setRowCopied(null), 1500);
      return () => clearTimeout(timer);
    }
  }, [rowCopied]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(""); setShortUrl("");
    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (res.ok) {
        setShortUrl(data.short_url);
        setUrl(""); await fetchLinks();
      } else {
        setError(data.error || "Error");
      }
    } catch (err) {
      setError("Request failed");
    }
    setLoading(false);
  };

  const handleDelete = async (code: string) => {
    if (!window.confirm(`Delete link "${code}"? This cannot be undone.`)) return;
    setLoading(true);
    await fetch(`/api/links/${code}`, { method: "DELETE" });
    setShortUrl(""); 
    await fetchLinks();
    setLoading(false);
  };

  return (
    <div style={{
      maxWidth: 680, margin: "48px auto", fontFamily: "Segoe UI, Arial, sans-serif", padding: 16
    }}>
      <div style={{
        background: "#181818", borderRadius: 10, padding: 24, boxShadow: "0 4px 24px #00000022"
      }}>
        <h2 style={{ margin: 0, fontSize: 28, fontWeight: 600 }}>TinyLink Dashboard</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, marginTop: 16 }}>
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            required
            placeholder="Enter a long URL (https://...)"
            style={{
              flex: 1, padding: 10, borderRadius: 6, border: "1px solid #333", background: "#232323",
              color: "#eee", fontSize: 16
            }}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "10px 18px", fontSize: 16, fontWeight: 500,
              borderRadius: 6, border: "none", background: "#4fa7e3", color: "#fff", cursor: "pointer",
              opacity: loading ? 0.7 : 1
            }}
          >{loading ? "..." : "Shorten"}</button>
        </form>
        {error && <div style={{ color: "#c00", marginBottom: 12 }}>{error}</div>}
        {shortUrl && (
          <div style={{
            marginBottom: 18, background: "#222", padding: 12, borderRadius: 6, display: "flex",
            alignItems: "center", gap: 12, fontSize: 16
          }}>
            <strong>Short Link:</strong>
            <a href={shortUrl} style={{ color: "#4fa7e3" }}>{shortUrl}</a>
            <button
              style={{
                background: "#333", color: "#eee", border: "none",
                borderRadius: 5, padding: "6px 10px", cursor: "pointer"
              }}
              onClick={() => { copyToClipboard(shortUrl); setCopied(true); }}
            >Copy</button>
            {copied && <span style={{ color: "#49e349", fontWeight: 500 }}>Copied!</span>}
          </div>
        )}

        <h3 style={{ marginTop: 32, marginBottom: 8, fontSize: 20 }}>All Short Links</h3>
        <div style={{
          overflowX: "auto", background: "#222", borderRadius: 8, marginTop: 4, marginBottom: 14
        }}>
          <table border={0} cellPadding={9} style={{
            width: "100%", fontSize: 15, color: "#eee", background: "#222", borderCollapse: "collapse"
          }}>
            <thead>
              <tr style={{ background: "#252525", borderBottom: "2px solid #333" }}>
                <th style={{ fontWeight: 500 }}>Short Code</th>
                <th style={{ fontWeight: 500 }}>URL</th>
                <th style={{ fontWeight: 500 }}>Clicks</th>
                <th style={{ fontWeight: 500 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {links.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", opacity: 0.7 }}>
                    No links yet! Add one above.
                  </td>
                </tr>
              ) : links.map((link: any) => (
                <tr key={link.id} style={{ borderTop: "1px solid #333" }}>
                  <td style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <a href={`/${link.short_code}`} style={{ color: "#4fa7e3" }}>{link.short_code}</a>
                    <button
                      style={{
                        background: "#4fa7e3", color: "#fff", border: "none",
                        borderRadius: 4, padding: "2px 6px", cursor: "pointer", fontSize: 13
                      }}
                      onClick={() => {
                        copyToClipboard(`${window.location.origin}/${link.short_code}`);
                        setRowCopied(link.short_code);
                      }}
                    >
                      Copy
                    </button>
                    {rowCopied === link.short_code &&
                      <span style={{ color: "#49e349", fontWeight: 450, fontSize: 13, marginLeft: 4 }}>Copied!</span>
                    }
                  </td>
                  <td style={{ wordBreak: "break-all" }}>
                    <a href={link.original_url} target="_blank" style={{ color: "#fff" }}>
                      {link.original_url}
                    </a>
                  </td>
                  <td>
                    <span style={{ background: "#333", borderRadius: 5, padding: "2px 8px", fontWeight: 500 }}>
                      {link.click_count}
                    </span>
                  </td>
                  <td>
                    <button
                      style={{
                        background: "#c00", color: "#fff", fontWeight: 500, borderRadius: 5, padding: "4px 14px",
                        border: "none", cursor: "pointer"
                      }}
                      onClick={() => handleDelete(link.short_code)}
                      disabled={loading}
                    >Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 24, color: "#aaa", fontSize: 13 }}>
          Healthcheck: <a href="/api/healthz" style={{ color: "#4fa7e3" }}>/api/healthz</a>
        </div>
      </div>
    </div>
  );
}
