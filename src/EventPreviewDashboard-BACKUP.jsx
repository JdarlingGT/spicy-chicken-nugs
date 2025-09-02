import React, { useEffect, useState } from "react";
import {
  normalizeTrainingType,
  formatEventDate,
  calculateCapacityMetrics,
  getEnrolledStudents,
  getDangerZoneStatus,
  summarizeInstruments
} from "./utils/gtu-helpers.js";

export default function EventPreviewDashboard() {
  const [events, setEvents] = useState([]);
  const [eventDetails, setEventDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [testResults, setTestResults] = useState([]);

  useEffect(() => {
    // 🧪 Run helper function tests
    const results = [];
    
    console.log("🔥 Testing Spicy Chicken Nugs Helper Functions:");
    
    // Test 1: normalizeTrainingType
    console.log("\n1. Testing normalizeTrainingType:");
    const testTitle = "Hybrid Essential Pilot";
    const result1 = normalizeTrainingType(testTitle);
    console.log(`Input: "${testTitle}"`);
    console.log(`Output: "${result1}"`);
    console.log(`Expected: "Essential – Hybrid"`);
    const test1Pass = result1 === "Essential – Hybrid";
    console.log(`✅ Pass:`, test1Pass);
    
    results.push({
      test: 'normalizeTrainingType("Hybrid Essential Pilot")',
      expected: '"Essential – Hybrid"',
      actual: `"${result1}"`,
      pass: test1Pass
    });
    
    // Test 2: summarizeInstruments
    console.log("\n2. Testing summarizeInstruments:");
    const orders = [
      { line_items: [{ name: "Instrument GT-1", quantity: 3 }] },
      { line_items: [{ name: "Training Event", quantity: 1 }] }
    ];
    const result2 = summarizeInstruments(orders);
    console.log("Input orders:", orders);
    console.log("Output:", result2);
    console.log('Expected: { summary: { "Instrument GT-1": 3 }, total: 3 }');
    const test2Pass = result2.total === 3 && result2.summary["Instrument GT-1"] === 3;
    console.log(`✅ Pass:`, test2Pass);
    
    results.push({
      test: 'summarizeInstruments(orders)',
      expected: '{ summary: { "Instrument GT-1": 3 }, total: 3 }',
      actual: JSON.stringify(result2),
      pass: test2Pass
    });
    
    // Test 3: More training types
    console.log("\n3. Testing more training types:");
    const testCases = [
      { input: "Advanced Graston Training", expected: "Advanced – In-Person" },
      { input: "Virtual Training Session", expected: "Virtual Training" },
      { input: "Equine Specialty Course", expected: "Specialty – Equine" },
      { input: "Random Training Name", expected: "Uncategorized" }
    ];
    
    testCases.forEach(testCase => {
      const result = normalizeTrainingType(testCase.input);
      const pass = result === testCase.expected;
      console.log(`"${testCase.input}" → "${result}" (${pass ? '✅' : '❌'})`);
      results.push({
        test: `normalizeTrainingType("${testCase.input}")`,
        expected: `"${testCase.expected}"`,
        actual: `"${result}"`,
        pass
      });
    });
    
    console.log("\n🎉 Helper function tests complete!");
    setTestResults(results);
    
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
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '20px' }}>
        🔥 Spicy Chicken Nugs - Helper Function Tests
      </h1>
      
      {/* Test Results Section */}
      <div style={{ marginBottom: '40px', padding: '20px', border: '2px solid #ddd', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>🧪 Test Results</h2>
        <div style={{ fontFamily: 'monospace', fontSize: '14px' }}>
          {testResults.map((result, index) => (
            <div key={index} style={{ 
              marginBottom: '15px', 
              padding: '10px', 
              backgroundColor: result.pass ? '#d4edda' : '#f8d7da',
              border: `1px solid ${result.pass ? '#c3e6cb' : '#f5c6cb'}`,
              borderRadius: '4px'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                {result.pass ? '✅' : '❌'} {result.test}
              </div>
              <div>Expected: {result.expected}</div>
              <div>Actual: {result.actual}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <strong>📝 Instructions:</strong> Open your browser's Developer Tools (F12) and check the Console tab for detailed test output!
        </div>
      </div>

      {/* Event Dashboard Section */}
      <div style={{ marginTop: '40px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>📋 Event Intelligence Dashboard</h2>

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
        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
          No events found.
        </div>
      )}
              </div>
      )}
      </div> {/* Close Event Dashboard Section */}
    </div> {/* Close Main Container */}
  );
}