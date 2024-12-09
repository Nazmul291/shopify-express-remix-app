import {
  Button,
  FormLayout,
  LegacyCard,
  Page,
  TextField,
  DropZone,
  Thumbnail,
  LegacyStack,
  Text,
  InlineError,
} from "@shopify/polaris";
import React, { useState, useCallback } from "react";
import { NoteIcon } from "@shopify/polaris-icons";

export default function CreateAssetForm() {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("");
  const [fileExtension, setFileExtension] = useState("");
  const [error, setError] = useState("");

  const allowedExtensions = ["liquid", "css", "js", "txt"]; // Allowed file types

  // Handle file drop
  const handleFileDrop = useCallback((_dropFiles, acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];

    if (uploadedFile) {
      const fileExt = uploadedFile.name.split(".").pop().toLowerCase();

      if (allowedExtensions.includes(fileExt)) {
        setFile(uploadedFile);
        setFileType(uploadedFile.type || "Unknown");
        setFileExtension(fileExt);
        setError(""); // Clear previous errors
      } else {
        setError(`Invalid file type. Allowed types: ${allowedExtensions.join(", ")}`);
        setFile(null); // Reset file state
      }
    }
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !file) {
      setError("Please provide a name and upload a valid file.");
      return;
    }

    // Create FormData object
    const formData = new FormData();
    formData.append("name", name);
    formData.append("asset", file); // Append the file as 'asset'
    formData.append("fileType", fileType);
    formData.append("fileExtention", fileExtension);

    try {
      console.log("jhkbdshkba", formData)
      const response = await fetch("http://localhost:3001/api/assets", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Asset created successfully!");
        setError(""); // Clear error on success
        setName("");
        setFile(null);
        setFileType("");
        setFileExtension("");
      } else {
        console.error("Error creating asset:", response.statusText);
        setError("Failed to create asset. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred while submitting the form.");
    }
  };

  return (
    <div>
      <Page
        title="Create Asset"
        subtitle="Fill out the details below to create a new asset."
      >
        <LegacyCard sectioned>
          <FormLayout>
            {/* Asset Name Field */}
            <TextField
              label="Asset Name"
              value={name}
              onChange={(value) => setName(value)}
              autoComplete="off"
              helpText="Enter the name of the asset."
            />

            {/* File Upload Field */}
            <DropZone
              accept=".liquid,.css,.js,.txt"
              type="file"
              onDrop={handleFileDrop}
            >
              {file ? (
                <LegacyStack>
                  <Thumbnail size="small" alt={file.name} source={NoteIcon} />
                  <div>
                    {file.name}{" "}
                    <Text variant="bodySm" as="p">
                      {file.size} bytes
                    </Text>
                  </div>
                </LegacyStack>
              ) : (
                <DropZone.FileUpload />
              )}
            </DropZone>

            {/* Error Message */}
            {error && <InlineError message={error} fieldID="fileError" />}

            {/* File Info Fields */}
            <TextField
              label="File Type"
              value={fileType}
              autoComplete="off"
              disabled
              helpText="Automatically detected file type."
            />
            <TextField
              label="File Extension"
              value={fileExtension}
              autoComplete="off"
              disabled
              helpText="Automatically detected file extension."
            />

            {/* Submit Button */}
            <Button primary onClick={handleSubmit}>
              Submit
            </Button>
          </FormLayout>
        </LegacyCard>
      </Page>
    </div>
  );
}
