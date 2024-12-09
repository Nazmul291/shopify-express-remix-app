import {
  Button,
  FormLayout,
  TextField,
  DropZone,
  LegacyStack,
  Thumbnail,
  Text,
  Page,
  LegacyCard,
  DataTable,
  Checkbox,
} from "@shopify/polaris";
import { NoteIcon } from "@shopify/polaris-icons";
import React, { useState, useCallback, useEffect } from "react";

export default function CreateSectionForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0");
  
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [images, setImages] = useState([]);
  const [sectionFile, setSectionFile] = useState(null);

  const [snippets, setSnippets] = useState([]);
  const [selectedSnippets, setSelectedSnippets] = useState([]);

  const [assets, setAssets] = useState([]);
  const [selectedAssets, setSelectedAssets] = useState([]);

  const validImageTypes = ["image/gif", "image/jpeg", "image/png"];

  // Fetch snippets and assets from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const snippetsResponse = await fetch("http://localhost:3001/api/snippet");
        const snippetsData = await snippetsResponse.json();
        setSnippets(snippetsData.data || []);

        const assetsResponse = await fetch("http://localhost:3001/api/assets");
        const assetsData = await assetsResponse.json();
        setAssets(assetsData.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSnippetCheckboxChange = (id) => {
    setSelectedSnippets((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((snippetId) => snippetId !== id)
        : [...prevSelected, id]
    );
  };

  const handleAssetCheckboxChange = (id) => {
    setSelectedAssets((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((assetId) => assetId !== id)
        : [...prevSelected, id]
    );
  };

  const snippetRows = snippets.map((snippet) => [
    <Checkbox
      checked={selectedSnippets.includes(snippet.id)}
      onChange={() => handleSnippetCheckboxChange(snippet.id)}
    />,
    snippet.name,
    snippet.fileType,
    snippet.fileExtention,
    snippet.createdAt,
  ]);

  const assetRows = assets.map((asset) => [
    <Checkbox
      checked={selectedAssets.includes(asset.id)}
      onChange={() => handleAssetCheckboxChange(asset.id)}
    />,
    asset.name,
    asset.fileType,
    asset.fileExtention,
    asset.createdAt,
  ]);

  const handleImageDrop = useCallback(
    (_dropFiles, acceptedFiles) => {
      setImages([...images, ...acceptedFiles]);
    },
    [images]
  );

  const handleFileDrop = useCallback(
    (_dropFiles, acceptedFiles) => {
      setSectionFile(acceptedFiles[0]);
    },
    []
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const priceFloat = parseFloat(price);
      if (isNaN(priceFloat)) throw new Error("Price must be a valid number.");

    
      // Create form-data instance
      const formData = new FormData();

      // Append non-array fields
      formData.append("name", title);
      formData.append("description", description);
      formData.append("price", priceFloat.toFixed(2).toString());
      formData.append("category", category);
      formData.append("tags", tags);

      // Append images (if any)
      images.forEach((file) => formData.append("image", file));

      // Append section file (if any)
      if (sectionFile) {
        formData.append("sectionFile", sectionFile);
      }

      // Append stringified arrays
      formData.append("snippets", JSON.stringify(selectedSnippets));
      formData.append("assets", JSON.stringify(selectedAssets));

      // Debugging
      console.log("FormData being sent:");
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await fetch("http://localhost:3001/api/section", {
        method: "POST",
        body: formData, // Send the formData directly
      });

      if (!response.ok) {
        const responseText = await response.text();
        console.error("Error response from server:", responseText);
        throw new Error(`Failed to submit: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Success:", data);

      // Reset form fields
      setTitle("");
      setDescription("");
      setPrice("0");
      setCategory("");
      setTags("");
      setImages([]);
      setSectionFile(null);
      setSelectedSnippets([]);
      setSelectedAssets([]);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };


  return (
    <Page title="Create Section" subtitle="Fill out the details below to create a new section.">
      <LegacyCard sectioned>
        <FormLayout>
          <TextField label="Title" value={title} onChange={setTitle} autoComplete="off" />
          <TextField label="Description" value={description} onChange={setDescription} autoComplete="off" />
          <TextField type="number" label="Price" value={price} onChange={setPrice} autoComplete="off" />
          <TextField label="Category" value={category} onChange={setCategory} autoComplete="off" />
          <TextField label="Tags" value={tags} onChange={setTags} autoComplete="off" />

          <DropZone accept="image/*" type="image" onDrop={handleImageDrop}>
            {images.length > 0
              ? images.map((file, index) => (
                <LegacyStack key={index}>
                  <Thumbnail
                    size="small"
                    alt={file.name}
                    source={validImageTypes.includes(file.type) ? window.URL.createObjectURL(file) : NoteIcon}
                  />
                  <div>
                    {file.name}
                    <Text variant="bodySm" as="p">
                      {file.size} bytes
                    </Text>
                  </div>
                </LegacyStack>
              ))
              : <DropZone.FileUpload />}
          </DropZone>

          <DropZone accept=".liquid,.css,.js" type="file" onDrop={handleFileDrop}>
            {sectionFile && (
              <LegacyStack>
                <Thumbnail size="small" alt={sectionFile.name} source={NoteIcon} />
                <div>
                  {sectionFile.name}
                  <Text variant="bodySm" as="p">
                    {sectionFile.size} bytes
                  </Text>
                </div>
              </LegacyStack>
            )}
          </DropZone>

          <Text variant="headingMd" as="h3">Snippets</Text>
          <DataTable
            columnContentTypes={["text", "text", "text", "text", "text"]}
            headings={["Select", "Name", "File Type", "File Extension", "Created At"]}
            rows={snippetRows}
          />

          <Text variant="headingMd" as="h3">Assets</Text>
          <DataTable
            columnContentTypes={["text", "text", "text", "text", "text"]}
            headings={["Select", "Name", "File Type", "File Extension", "Created At"]}
            rows={assetRows}
          />

          <Button onClick={handleSubmit}>Submit</Button>
        </FormLayout>
      </LegacyCard>
    </Page>
  );
}
