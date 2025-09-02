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
  return (
    <div className="p-4 space-y-6">
      {events.map((event) => {
        const trainingType = normalizeTrainingType(event.title);
        const date = formatEventDate(event.start_date);
        const { enrolled, capacity, status } = calculateCapacityMetrics(event.attendees, event.max_attendees);
        const danger = getDangerZoneStatus(event);
        const { total } = summarizeInstruments(event.orders);

        return (
          <div key={event.id} className="border rounded-xl p-4 shadow-md">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{event.title}</h2>
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
