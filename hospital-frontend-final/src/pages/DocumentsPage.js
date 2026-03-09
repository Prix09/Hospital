import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function DocumentsPage() {
    const { user, token } = useAuth();
    const [documents, setDocuments] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dragOver, setDragOver] = useState(false);

    useEffect(() => {
        if (user && token) fetchDocuments();
    }, [user, token]);

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8080/api/documents/patient/${user.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setDocuments(Array.isArray(data) ? data : []);
        } catch { } finally { setLoading(false); }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) { setMessage({ text: 'Please select a file first.', type: 'error' }); return; }
        setUploading(true);
        setMessage({ text: '', type: '' });
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch(`http://localhost:8080/api/documents/upload/${user.id}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });
            const data = await res.json();
            if (res.ok) {
                setMessage({ text: '✅ File uploaded successfully!', type: 'success' });
                setFile(null);
                fetchDocuments();
            } else {
                setMessage({ text: data.message || 'Upload failed.', type: 'error' });
            }
        } catch {
            setMessage({ text: 'Could not connect to server.', type: 'error' });
        } finally {
            setUploading(false);
        }
    };

    const handleDownload = async (doc) => {
        try {
            const res = await fetch(`http://localhost:8080/api/documents/${doc.id}/download`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url; a.download = doc.fileName;
                document.body.appendChild(a); a.click(); a.remove();
            }
        } catch { setMessage({ text: 'Download failed.', type: 'error' }); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this document?')) return;
        try {
            const res = await fetch(`http://localhost:8080/api/documents/${id}`, {
                method: 'DELETE', headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setMessage({ text: 'Document deleted.', type: 'info' });
                fetchDocuments();
            }
        } catch { }
    };

    const fileIcon = (name) => {
        if (!name) return '📄';
        if (name.match(/\.(jpg|jpeg|png|gif)$/i)) return '🖼️';
        if (name.match(/\.pdf$/i)) return '📕';
        return '📄';
    };

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="section-title">Medical Records</h1>
                <p className="text-muted">Securely store and manage your medical documents</p>
            </div>

            {/* Upload Section */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.25rem' }}>📤 Upload New Document</h2>

                <form onSubmit={handleUpload}>
                    {/* Drop Zone */}
                    <div
                        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={e => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]); }}
                        style={{
                            border: `2px dashed ${dragOver ? '#4f46e5' : '#cbd5e1'}`,
                            borderRadius: '12px',
                            padding: '2rem',
                            textAlign: 'center',
                            background: dragOver ? '#eff6ff' : '#f8fafc',
                            cursor: 'pointer',
                            marginBottom: '1rem',
                            transition: 'all 0.2s',
                        }}
                        onClick={() => document.getElementById('fileInput').click()}
                    >
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📁</div>
                        {file ? (
                            <p style={{ color: '#4f46e5', fontWeight: 600 }}>Selected: {file.name}</p>
                        ) : (
                            <>
                                <p style={{ fontWeight: 600, color: '#475569' }}>Drop file here or click to browse</p>
                                <p className="text-muted" style={{ marginTop: '0.25rem' }}>PDF, JPG, PNG — max 5MB</p>
                            </>
                        )}
                        <input id="fileInput" type="file" style={{ display: 'none' }} accept=".pdf,.jpg,.jpeg,.png" onChange={e => setFile(e.target.files[0])} />
                    </div>

                    {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}

                    <button type="submit" className="btn btn-primary" disabled={uploading || !file}>
                        {uploading ? 'Uploading...' : '⬆️ Upload Document'}
                    </button>
                </form>
            </div>

            {/* Documents List */}
            <div className="card">
                <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.25rem' }}>📚 Your Documents ({documents.length})</h2>

                {loading ? (
                    <div className="spinner"></div>
                ) : documents.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📂</div>
                        <p style={{ fontWeight: 600, color: '#475569' }}>No documents uploaded yet</p>
                        <p className="text-muted">Upload your first medical record above.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {documents.map(doc => (
                            <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                                    <span style={{ fontSize: '1.5rem' }}>{fileIcon(doc.fileName)}</span>
                                    <div>
                                        <p style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.9rem' }}>{doc.fileName}</p>
                                        <p className="text-muted" style={{ fontSize: '0.78rem' }}>
                                            {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : 'Unknown date'}
                                        </p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button className="btn btn-secondary btn-sm" onClick={() => handleDownload(doc)}>⬇️ Download</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(doc.id)}>🗑 Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
