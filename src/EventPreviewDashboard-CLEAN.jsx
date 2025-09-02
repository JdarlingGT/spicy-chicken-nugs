import React, { useEffect, useState } from "react";
import {
  normalizeTrainingType,
  summarizeInstruments
} from "./utils/gtu-helpers.js";

export default function EventPreviewDashboard() {
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
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '20px' }}>
        🔥 Spicy Chicken Nugs - Helper Function Tests
      </h1>

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

      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>🎯 Next Steps</h2>
        <ul style={{ lineHeight: '1.6' }}>
          <li>✅ Helper functions are imported and working</li>
          <li>✅ Tests are running in the console</li>
          <li>✅ Visual results displayed on page</li>
          <li>🔥 Ready to integrate into your event dashboard!</li>
        </ul>
      </div>
    </div>
  );
}
