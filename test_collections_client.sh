#!/bin/bash

# Set the API URL
API_URL="http://localhost:3000/api/collections"
USER_EMAIL="sartiz.alam.ayon@g.bracu.ac.bd"
COLLECTION_ID=""
PAPER_ID="645f6b9b651a9b24ec35e123" # Replace with a valid paper ID from your database

# Color codes for better readability
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Testing Collection APIs via Next.js for user ${USER_EMAIL}${NC}"
echo "========================================"

# 1. Create a new collection
echo -e "${YELLOW}1. Creating a new collection...${NC}"
CREATE_RESPONSE=$(curl -s -L -X POST "${API_URL}" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Client Test Collection\", \"tags\":[\"test\", \"nextjs\"], \"user_email\":\"${USER_EMAIL}\"}")

echo "Response: $CREATE_RESPONSE"

# Extract the collection ID
COLLECTION_ID=$(echo $CREATE_RESPONSE | grep -o '"_id":"[^"]*"' | cut -d'"' -f4)

if [ -z "$COLLECTION_ID" ]; then
  echo -e "${RED}Failed to create collection or extract ID${NC}"
  exit 1
else
  echo -e "${GREEN}Successfully created collection with ID: $COLLECTION_ID${NC}"
fi

# 2. Get all collections
echo -e "\n${YELLOW}2. Getting all collections for user...${NC}"
ALL_COLLECTIONS=$(curl -s -L "${API_URL}?user_email=${USER_EMAIL}")
echo "Response: $ALL_COLLECTIONS"

# 3. Get a specific collection
echo -e "\n${YELLOW}3. Getting collection by ID...${NC}"
COLLECTION=$(curl -s -L "${API_URL}/${COLLECTION_ID}?user_email=${USER_EMAIL}")
echo "Response: $COLLECTION"

# 4. Update a collection
echo -e "\n${YELLOW}4. Updating collection...${NC}"
UPDATE_RESPONSE=$(curl -s -L -X PATCH "${API_URL}/${COLLECTION_ID}" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Updated Client Test Collection\", \"user_email\":\"${USER_EMAIL}\"}")
echo "Response: $UPDATE_RESPONSE"

# 5. Add a tag to the collection
echo -e "\n${YELLOW}5. Adding a tag to collection...${NC}"
ADD_TAG_RESPONSE=$(curl -s -L -X POST "${API_URL}/${COLLECTION_ID}/tags/nextjstag?user_email=${USER_EMAIL}")
echo "Response: $ADD_TAG_RESPONSE"

# 6. Add a paper to the collection
echo -e "\n${YELLOW}6. Adding a paper to collection...${NC}"
ADD_PAPER_RESPONSE=$(curl -s -L -X POST "${API_URL}/${COLLECTION_ID}/papers" \
  -H "Content-Type: application/json" \
  -d "{\"paper_id\":\"${PAPER_ID}\", \"user_email\":\"${USER_EMAIL}\"}")
echo "Response: $ADD_PAPER_RESPONSE"

# 7. Get the updated collection
echo -e "\n${YELLOW}7. Getting updated collection...${NC}"
UPDATED_COLLECTION=$(curl -s -L "${API_URL}/${COLLECTION_ID}?user_email=${USER_EMAIL}")
echo "Response: $UPDATED_COLLECTION"

# 8. Remove the paper from the collection
echo -e "\n${YELLOW}8. Removing paper from collection...${NC}"
REMOVE_PAPER_RESPONSE=$(curl -s -L -X DELETE "${API_URL}/${COLLECTION_ID}/papers/${PAPER_ID}?user_email=${USER_EMAIL}")
echo "Response: $REMOVE_PAPER_RESPONSE"

# 9. Remove the tag from the collection
echo -e "\n${YELLOW}9. Removing tag from collection...${NC}"
REMOVE_TAG_RESPONSE=$(curl -s -L -X DELETE "${API_URL}/${COLLECTION_ID}/tags/nextjstag?user_email=${USER_EMAIL}")
echo "Response: $REMOVE_TAG_RESPONSE"

# 10. Delete the collection
echo -e "\n${YELLOW}10. Deleting collection...${NC}"
DELETE_RESPONSE=$(curl -s -L -X DELETE "${API_URL}/${COLLECTION_ID}?user_email=${USER_EMAIL}")
echo "Response: $DELETE_RESPONSE"

echo -e "\n${GREEN}Tests completed!${NC}" 