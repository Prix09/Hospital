import apiClient from './api';
import { toast } from 'react-toastify';

/**
 * Creates a new appointment.
 * @param {object} appointmentData - Contains patientId, doctorId, and appointmentTime.
 * @returns {Promise<object>} The created appointment.
 */
export const createAppointment = async (appointmentData) => {
    try {
        const response = await apiClient.post('/appointments', appointmentData);
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to create appointment.');
        throw error;
    }
};

/**
 * Approves an existing appointment (Doctor's action).
 * @param {number} appointmentId - The ID of the appointment to approve.
 * @returns {Promise<object>} The updated appointment.
 */
export const approveAppointment = async (appointmentId) => {
    try {
        const response = await apiClient.put(`/appointments/${appointmentId}/approve`);
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to approve appointment.');
        throw error;
    }
};

/**
 * Gets all appointments for a specific patient.
 * @param {number} patientId - The ID of the patient.
 * @returns {Promise<Array>} The list of appointments.
 */
export const getAppointmentsForPatient = async (patientId) => {
    try {
        const response = await apiClient.get(`/appointments/patient/${patientId}`);
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch patient appointments.');
        throw error;
    }
};

/**
 * Gets all appointments for a specific doctor.
 * @param {number} doctorId - The ID of the doctor.
 * @returns {Promise<Array>} The list of appointments.
 */
export const getAppointmentsForDoctor = async (doctorId) => {
    try {
        const response = await apiClient.get(`/appointments/doctor/${doctorId}`);
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch doctor appointments.');
        throw error;
    }
};
