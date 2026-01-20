#!/bin/bash
# Test Corporate Submission
echo "Testing Corporate Submission..."
curl -X POST http://localhost:3000/api/submit-form \
  -H "Content-Type: application/json" \
  -d '{
    "type": "Corporate",
    "data": {
      "legal_name": "Test Corp LLC",
      "entity_type": "llc",
      "revenue_concentration": "yes"
    }
  }'

echo -e "\n\nTesting Personal Submission..."
curl -X POST http://localhost:3000/api/submit-form \
  -H "Content-Type: application/json" \
  -d '{
    "type": "Personal",
    "data": {
      "fullName": "John Doe",
      "filingStatus": "single",
      "moved2025": false
    }
  }'
