import React, { useState } from 'react';
import Button from '../ui/Button';

export default function PrescriptionModal({ appointment, onClose, onSave }) {
    const [diagnosis, setDiagnosis] = useState('');
    const [medication, setMedication] = useState('');
    const [instructions, setInstructions] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const success = await onSave({
                appointmentId: appointment.id,
                diagnosis,
                medication,
                instructions
            });
            if (success) onClose();
        } catch (err) {
            setError('Failed to save prescription.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
                    <h2 className="text-xl font-bold">Write Prescription</h2>
                    <button onClick={onClose} className="text-2xl hover:text-gray-200">&times;</button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
                        <p className="p-2 bg-gray-50 rounded border text-gray-800 font-semibold">{appointment.patientName}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
                        <textarea 
                            required
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                            value={diagnosis}
                            onChange={e => setDiagnosis(e.target.value)}
                            placeholder="Patient's diagnosis..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Medication</label>
                        <textarea 
                            required
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                            value={medication}
                            onChange={e => setMedication(e.target.value)}
                            placeholder="List medications and dosages..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Instructions (Optional)</label>
                        <textarea 
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 min-h-[60px]"
                            value={instructions}
                            onChange={e => setInstructions(e.target.value)}
                            placeholder="Additional instructions..."
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
                        <Button type="submit" variant="primary" className="flex-1" loading={loading}>Save Prescription</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
