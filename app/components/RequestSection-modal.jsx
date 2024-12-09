import {
  Modal,
  LegacyStack,
  TextField,
  DropZone,
  Thumbnail,
  BlockStack,
  InlineError,
  Text,
} from "@shopify/polaris";
import React, { useCallback, useState } from "react";

function RequestSectionModal({
  active,
  handleChange,
  toggleToast,
  toggleModal,
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const handleNameChange = useCallback((value) => setName(value), []);
  const handleDescriptionChange = useCallback(
    (value) => setDescription(value),
    [],
  );
  const handleUrlChange = useCallback((value) => setUrl(value), []);

  const handleDropZoneDrop = useCallback(
    (_dropFiles, acceptedFiles) => setFile(acceptedFiles[0]),
    [],
  );

  const handleSubmit = useCallback(async () => {
    if (!description) {
      setError("Description is required.");
      return;
    }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("url", url);
    if (file) {
      formData.append("file", file, file.name);
    }

    try {
      const response = await fetch("/section-request", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toggleToast();
        setDescription("");
        setUrl("");
        setError("");
        setFile(null);
        toggleModal();
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to submit request.");
      }
    } catch (error) {
      setError("Failed to submit request. Please try again.");
    }
  }, [name, description, url, file, toggleModal, toggleToast]);

  const validImageTypes = ["image/gif", "image/jpeg", "image/png"];

  return (
    <Modal
      open={active}
      onClose={handleChange}
      title="Request a Section"
      primaryAction={{
        content: "Submit",
        onAction: handleSubmit,
      }}
      secondaryActions={[
        {
          content: "Cancel",
          onAction: handleChange,
        },
      ]}
    >
      <Modal.Section>
        <LegacyStack vertical>
          <LegacyStack.Item>
            <Text variant="headingSm" as="h6">
              We are pleased to offer you the opportunity to request new
              sections for your store. This service allows you to add unique
              sections tailored to your specific needs and preferences,
              enhancing your store's functionality and appearance
            </Text>
          </LegacyStack.Item>
          <LegacyStack.Item>
            <TextField
              label="Name"
              id="name"
              value={name}
              onChange={handleNameChange}
              autoComplete="off"
            />
          </LegacyStack.Item>
          <LegacyStack.Item>
            <TextField
              label="Description"
              id="description"
              value={description}
              onChange={handleDescriptionChange}
              autoComplete="off"
              requiredIndicator
              multiline={4}
            />
            {error === "Description is required." && (
              <InlineError message={error} fieldID="description" />
            )}
          </LegacyStack.Item>
          <LegacyStack.Item>
            <TextField
              label="Please provide a reference url (optional)"
              value={url}
              onChange={handleUrlChange}
              autoComplete="off"
            />
          </LegacyStack.Item>
          <LegacyStack.Item>
            <DropZone
              onDrop={handleDropZoneDrop}
              label="Please upload a reference image (optional)"
              type="image"
            >
              {file && (
                <BlockStack vertical>
                  {validImageTypes.includes(file.type) ? (
                    <Thumbnail
                      size="large"
                      alt={file.name}
                      source={URL.createObjectURL(file)}
                    />
                  ) : (
                    <div>{file.name}</div>
                  )}
                </BlockStack>
              )}
              {!file && <DropZone.FileUpload />}
            </DropZone>
          </LegacyStack.Item>
        </LegacyStack>
      </Modal.Section>
    </Modal>
  );
}

export default RequestSectionModal;
