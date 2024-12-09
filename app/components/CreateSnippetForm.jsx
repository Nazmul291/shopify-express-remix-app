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

export default function CreateSnippetForm() {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [fileUri, setFileUri] = useState("");
  const [fileType, setFileType] = useState("");
  const [fileExtension, setFileExtension] = useState("");
  const [error, setError] = useState("");

  const allowedExtensions = ["liquid", "css", "js", "txt"];

  const handleFileDrop = useCallback((_dropFiles, acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
  
    if (uploadedFile) {
      const fileExt = uploadedFile.name.split(".").pop().toLowerCase();
  
      if (allowedExtensions.includes(fileExt)) {
        setFile(uploadedFile);
        setFileUri(uploadedFile.name);
  
        // Manually set file type for unsupported types
        if (fileExt === "liquid") {
          setFileType("application/liquid"); // Custom MIME type for .liquid
        } else if (uploadedFile.type) {
          setFileType(uploadedFile.type); // Use detected type for other files
        } else {
          setFileType("Unknown");
        }
  
        setFileExtension(fileExt);
        setError(""); // Clear any previous error
      } else {
        setError(`Invalid file type. Allowed types: ${allowedExtensions.join(", ")}`);
        setFile(null); // Reset file
      }
    }
  }, []);
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !file) {
      setError("Please provide a name and upload a valid file.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("snippet", file);
    formData.append("fileType", fileType);
    formData.append("fileExtention", fileExtension);

    try {
      const response = await fetch("http://localhost:3001/api/snippet", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Snippet created successfully!");
        setError(""); // Clear error on success
        setName("");
        setFile(null);
        setFileType("");
        setFileExtension("");
        setError(""); // Clear error
      } else {
        console.error("Error creating snippet:", response.statusText);
        setError("Failed to create snippet. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred while submitting the form.");
    }
  };

  return (
    <div>
      <Page
        title="Create Snippet"
        subtitle="Fill out the details below to create a new snippet."
      >
        <LegacyCard sectioned>
          <FormLayout>
            <TextField
              label="Name"
              value={name}
              onChange={(value) => setName(value)}
              autoComplete="off"
            />

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

            {error && <InlineError message={error} fieldID="fileError" />}

            <TextField
              label="File Name"
              value={fileUri}
              autoComplete="off"
              disabled
            />
            <TextField
              label="File Type"
              value={fileType}
              autoComplete="off"
              disabled
            />
            <TextField
              label="File Extension"
              value={fileExtension}
              autoComplete="off"
              disabled
            />

            <Button onClick={handleSubmit}>Submit</Button>
          </FormLayout>
        </LegacyCard>
      </Page>
    </div>
  );
}
