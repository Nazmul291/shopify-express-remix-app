import {
  Button,
  FormLayout,
  LegacyCard,
  Page,
  TextField,
} from "@shopify/polaris";
import React, { useState } from "react";

export default function CreateOrderForm() {
  const [sectionId, setSectionId] = useState("");
  const [userId, setUserId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const orderData = {
        sectionId,
        userId: userId || null, // Optional field
      };

      console.log("Order Data:", orderData);

      // Replace with actual API call or logic to save data
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        console.log("Order created successfully!");
      } else {
        console.error("Error creating order:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <Page
        title="Create Order"
        subtitle="Fill out the details below to create a new order."
      >
        <LegacyCard sectioned>
          <FormLayout>
            <TextField
              label="Section ID"
              value={sectionId}
              onChange={(value) => setSectionId(value)}
              autoComplete="off"
              helpText="Enter the ID of the related section."
            />
            <TextField
              label="User ID (Optional)"
              value={userId}
              onChange={(value) => setUserId(value)}
              autoComplete="off"
              helpText="Enter the ID of the related user, if applicable."
            />
            <Button primary onClick={handleSubmit}>
              Submit
            </Button>
          </FormLayout>
        </LegacyCard>
      </Page>
    </div>
  );
}
