// src/components/EventPreviewDashboard.jsx

import React from "react";
import {
  normalizeTrainingType,
  summarizeInstruments,
  formatEventDate,
  calculateCapacityMetrics,
  getDangerZoneStatus,
  getEnrolledStudents,
  mergeLicenseData
} from "../utils/event-utils";

const EventPreviewDashboard = ({ events }) => {
  // Defensive check: ensure events is an array
  if (!Array.isArray(events)) {
    console.warn('EventPreviewDashboard: events is not an array:', events);
    return (
      <div className="p-4">
        <div className="border rounded-xl p-4 shadow-md bg-yellow-50">
          <h2 className="text-xl font-semibold text-yellow-800">No Events Available</h2>
          <p className="text-sm text-yellow-600">Events data is not available or invalid.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {events.map((event) => {
        if (!event) {
          console.warn('EventPreviewDashboard: encountered null/undefined event');
          return null;
        }

        const trainingType = normalizeTrainingType(event.title || '');
        const date = formatEventDate(event.start_date);
        const { enrolled, capacity, status } = calculateCapacityMetrics(event.attendees || 0, event.max_attendees || 0);
        const danger = getDangerZoneStatus(event);
        const { total } = summarizeInstruments(event.orders || []);

        return (
          <div key={event.id} className="border rounded-xl p-4 shadow-md">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{event.title || 'Untitled Event'}</h2>
              <span className="text-sm">{danger}</span>
            </div>
            <p className="text-sm text-gray-500">{trainingType} – {date}</p>
            <p className="text-sm">Enrollment: {enrolled}/{capacity} ({status})</p>
            <p className="text-sm">Total Instruments Sold: {total}</p>
          </div>
        );
      })}
    </div>
  );
};

export default EventPreviewDashboard;
