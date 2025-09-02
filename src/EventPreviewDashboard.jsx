import React, { useEffect, useState } from "react";
import {
  normalizeTrainingType,
  formatEventDate,
  calculateCapacityMetrics,
  getEnrolledStudents,
  getDangerZoneStatus
} from "./utils/gtu-helpers.js";

export default function EventPreviewDashboard() {
  const [events, setEvents] = useState([]);
  const [eventDetails, setEventDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://grastonguideconnection.jdarling.workers.dev/events")
      .then((res) => res.json())
      .then(async (eventsData) => {
        setEvents(eventsData);

        // Fetch additional details for each event
        const details = {};
        for (const event of eventsData.slice(0, 5)) { // Limit to first 5 events for demo
          try {
            const [students, dangerStatus] = await Promise.all([
              getEnrolledStudents(event.id, event.group_id).catch(() => []),
              getDangerZoneStatus(event.id).catch(() => "Unknown")
            ]);

            details[event.id] = {
              students,
              dangerStatus,
              capacity: calculateCapacityMetrics(students.length, event.capacity || 20)
            };
          } catch (err) {
            console.error(`Error fetching details for event ${event.id}:`, err);
            details[event.id] = {
              students: [],
              dangerStatus: "Unknown",
              capacity: calculateCapacityMetrics(0, event.capacity || 20)
            };
          }
        }

        setEventDetails(details);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
        setLoading(false);
      });
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'full': return 'text-red-600 bg-red-100';
      case 'filling': return 'text-yellow-600 bg-yellow-100';
      case 'available': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📋 Event Intelligence Dashboard</h1>

      {loading && (
        <div className="text-center py-8">
          <div className="text-lg">Loading event details...</div>
        </div>
      )}

      <div className="grid gap-4">
        {events.map((event) => {
          const trainingType = normalizeTrainingType(event.title);
          const details = eventDetails[event.id];

          return (
            <div key={event.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-semibold">{event.title}</h3>
                  <p className="text-gray-600">{event.city} • {formatEventDate(event.date)}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {trainingType}
                </span>
              </div>

              {details && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-gray-50 p-3 rounded">
                    <h4 className="font-semibold text-sm text-gray-700">Enrollment</h4>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-lg font-bold">
                        {details.capacity.enrolled}/{details.capacity.capacity}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(details.capacity.status)}`}>
                        {details.capacity.percentage}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {details.capacity.remaining} spots remaining
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded">
                    <h4 className="font-semibold text-sm text-gray-700">Students</h4>
                    <div className="text-lg font-bold">{details.students.length}</div>
                    <div className="text-xs text-gray-500">
                      {details.students.filter(s => s.source === 'WooCommerce').length} via WooCommerce
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded">
                    <h4 className="font-semibold text-sm text-gray-700">Status</h4>
                    <div className="text-lg font-bold">{details.dangerStatus}</div>
                    <div className="text-xs text-gray-500">Danger zone status</div>
                  </div>
                </div>
              )}

              {!details && !loading && (
                <div className="text-sm text-gray-500 mt-2">
                  Event details not loaded (limited to first 5 events for demo)
                </div>
              )}
            </div>
          );
        })}
      </div>

      {events.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          No events found.
        </div>
      )}
    </div>
  );
}