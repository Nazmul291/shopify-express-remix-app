
import { useNavigation, useSubmit } from "@remix-run/react";
import {
  BlockStack,
  Button,
  DropZone,
  Form,
  FormLayout,
  InlineError,
  Page,
  Text,
  TextField,
  Thumbnail,
  Select,
  RadioButton,
} from "@shopify/polaris";
import adminStyle from "../components/admin.css?url";

export const links = () => [{ rel: "stylesheet", href: adminStyle }];

import { NoteIcon, ImageIcon } from "@shopify/polaris-icons";
import { useCallback, useState, useEffect } from "react";


export default function Admin() {
  // const { session } = useLoaderData();
  // console.log("Session :", session);

  const [sectionName, setSectionName] = useState("");
  const [sectionDesc, setSectionDesc] = useState("");
  const [sectionPrice, setSectionPrice] = useState(0.0);
  const [sectionDiscount, setSectionDiscount] = useState(0.0);
  const [sectionImgs, setSectionImages] = useState([]);
  const [sectionFiles, setSectionFiles] = useState([]);
  const [nameError, setNameError] = useState(false);
  const [nameErrorMsg, setNameErrorMsg] = useState("");
  const [descError, setDescError] = useState(false);
  const [descErrorMsg, setDescErrorMsg] = useState("");
  const [imgError, setImgError] = useState(false);
  const [imgErrorMsg, setImgErrorMsg] = useState("");

  const [filesError, setFilesError] = useState(false);
  const [filesErrorMsg, setFilesErrorMsg] = useState("");
  const [tags, setTags] = useState("");
  const [selected, setSelected] = useState("popular");
  const [pricingType, setPricingType] = useState("paid");
  const [priceError, setPriceError] = useState(false);
  const [priceErrorMsg, setPriceErrorMsg] = useState("");
  const [discountError, setDiscountError] = useState(false);
  const [discountErrorMsg, setDiscountErrorMsg] = useState("");

  const submit = useSubmit();
  const navigation = useNavigation();
  const isLoading = ["submitting", "loading"].includes(navigation.state);

  useEffect(() => {
    if (pricingType === "free") {
      setSectionPrice(0.0);
      setSectionDiscount(0.0);
    }
  }, [pricingType]);

  const validateFields = () => {
    let isValid = true;

    if (sectionName.length < 4) {
      setNameError(true);
      setNameErrorMsg(
        "Section name can't be empty & should be greater than 3 characters"
      );
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMsg("");
    }

    if (sectionDesc.trim() === "") {
      setDescError(true);
      setDescErrorMsg("Section description is required");
      isValid = false;
    } else {
      setDescError(false);
      setDescErrorMsg("");
    }

    if (sectionImgs.length !== 5) {
      setImgError(true);
      setImgErrorMsg("Exactly 5 section images are required");
      isValid = false;
    } else {
      setImgError(false);
      setImgErrorMsg("");
    }

    if (sectionFiles.length === 0) {
      setFilesError(true);
      setFilesErrorMsg("At least one section file is required");
      isValid = false;
    } else {
      setFilesError(false);
      setFilesErrorMsg("");
    }

    if (pricingType === "paid") {
      const price = parseFloat(sectionPrice);
      const discount = parseFloat(sectionDiscount);

      if (price < 0) {
        setPriceError(true);
        setPriceErrorMsg("Base price cannot be negative");
        isValid = false;
      } else {
        setPriceError(false);
        setPriceErrorMsg("");
      }

      if (discount < 0) {
        setDiscountError(true);
        setDiscountErrorMsg("Discount cannot be negative");
        isValid = false;
      } else if (discount > price) {
        setDiscountError(true);
        setDiscountErrorMsg("Discount must be less than the Base Price");
        isValid = false;
      } else {
        setDiscountError(false);
        setDiscountErrorMsg("");
      }
    }
    if (pricingType === "free") {
      setSectionPrice(0.0);
      setSectionDiscount(0.0);
    }

    return isValid;
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const isValid = validateFields();
    if (!isValid) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    formData.append("sectionName", sectionName);
    formData.append("sectionDesc", sectionDesc);
    formData.append("sectionPrice", sectionPrice);
    formData.append("sectionDiscount", sectionDiscount);
    formData.append("category", selected);
    formData.append("tags", tags);
    formData.append("pricingType", pricingType);

    sectionImgs.forEach((image) => {
      formData.append("sectionImgs", image, image.name);
    });

    if (Array.isArray(sectionFiles)) {
      sectionFiles.forEach((file) => {
        formData.append("sectionFiles", file, file.name);
      });
    } else {
      formData.append("sectionFiles", sectionFiles, sectionFiles.name);
    }
    try {
      await fetch("/upload-manager", {
        method: "POST",
        body: formData,
      });

      await submit(formData, {
        method: "post",
        // action: "/create-manager",
        encType: "multipart/form-data",
      });

      handleReset();
    } catch (error) {
      console.error("Failed to submit form", error);
    }
  };

  const handleSectionImgs = useCallback(
    (_dropFiles, acceptedFiles, _rejectedFiles) => {
      setSectionImages((images) => [...images, ...acceptedFiles].slice(0, 5));
    },
    []
  );
  const validImageTypes = ["image/jpeg", "image/png"];
  const fileUpload = sectionImgs.length === 0 && ( // Changed
    <DropZone.FileUpload actionHint="Accepts .jpg, .png and .webp" />
  );
  const uploadedImgs = sectionImgs.length > 0 && ( // Changed
    <div
      style={{
        padding: "0",
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      <BlockStack>
        {sectionImgs.map((img, index) => (
          <BlockStack key={index} horizontal="true" spacing="tight">
            <Thumbnail
              size="small"
              alt={img.name}
              source={
                validImageTypes.includes(img.type)
                  ? window.URL.createObjectURL(img)
                  : ImageIcon
              }
            />
            <div>
              {img.name}{" "}
              <Text variant="bodySm" as="p">
                {img.size} bytes
              </Text>
            </div>
          </BlockStack>
        ))}
      </BlockStack>
    </div>
  );
  const handleSectionFiles = useCallback(
    (_dropFiles, acceptedFiles, _rejectedFiles) => {
      setSectionFiles((files) => [...files, ...acceptedFiles]);
    },
    []
  );

  const validFilesTypes = [
    "application/js",
    "application/json",
    "text/plain",
    "text/css",
    "image/*",
  ];

  const fileUploads = !sectionFiles.length && (
    <DropZone.FileUpload actionHint="Accepts .css, .js, .liquid and image files" />
  );
  const uploadedSectionFiles = sectionFiles.length > 0 && (
    <div
      style={{
        padding: "0",
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      <BlockStack>
        {sectionFiles.map((file, index) => (
          <BlockStack key={index} horizontal spacing="tight">
            <Thumbnail
              size="small"
              alt={file.name}
              source={
                validFilesTypes.includes(file.type)
                  ? window.URL.createObjectURL(file)
                  : NoteIcon
              }
            />
            <div>
              {file.name}{" "}
              <Text variant="bodySm" as="p">
                {file.size} bytes
              </Text>
            </div>
          </BlockStack>
        ))}
      </BlockStack>
    </div>
  );

  const handleReset = () => {
    setSectionName("");
    setSectionDesc("");
    setSectionPrice(0.0);
    setSectionDiscount(0.0);
    setSectionImages([]);
    setSectionFiles([]);
    setSectionVideos([]);
    setNameError(false);
    setDescError(false);
    setPriceError(false);
    setDiscountError(false);
    setImgError(false);
    setFilesError(false);
    setVideoError(false);
    setNameErrorMsg("");
    setDescErrorMsg("");
    setPriceErrorMsg("");
    setDiscountErrorMsg("");
    setImgErrorMsg("");
    setFilesErrorMsg("");
    setVideoErrorMsg("");
    setTags("");
    setSelected("popular");
    setPricingType("paid");
  };
  const handleSelectChange = useCallback((value) => setSelected(value), []);

  const options = [
    { label: "Popular", value: "popular" },
    { label: "Trending", value: "trending" },
    { label: "Newest", value: "newest" },
    { label: "Hero", value: "hero" },
    { label: "Features", value: "features" },
    { label: "Testimonial", value: "testimonial" },
    { label: "Scrolling", value: "scrolling" },
    { label: "Video", value: "video" },
    { label: "Text", value: "text" },
    { label: "Images", value: "images" },
  ];

  return (
    <Page fullWidth>
      <div className="body">
        <div className="main">
          <Form onSubmit={handleFormSubmit}>
            <FormLayout>
              <div className="general">
                <span className="genText">General</span>
                <TextField
                  id="sectionname"
                  error={nameError}
                  requiredIndicator={true}
                  label="Section name"
                  name="name"
                  value={sectionName}
                  placeholder="Enter your section name....."
                  onChange={(value) => setSectionName(value)}
                  autoComplete="off"
                />
                <TextField
                  type="text"
                  name="desc"
                  error={descError}
                  label="Section description"
                  value={sectionDesc}
                  multiline={4}
                  onChange={(value) => setSectionDesc(value)}
                  placeholder="Enter your section description....."
                />
              </div>
              <div className="media">
                <span className="medText">Media</span>
                <DropZone
                  label="Section image"
                  onDrop={handleSectionImgs}
                  error={imgError}
                  accept="image/jpeg, image/png, image/webp"
                  type="image"
                  // allowMultiple={false}
                  variableHeight
                >
                  {uploadedImgs}
                  {fileUpload}
                </DropZone>
                <DropZone
                  label="Section files"
                  onDrop={handleSectionFiles}
                  error={filesError}
                  accept="application/json, application/js, text/css, .liquid, image/*"
                  type="file"
                  allowMultiple={false}
                  variableHeight
                >
                  {uploadedSectionFiles}
                  {fileUploads}
                </DropZone>
              </div>
              <div className="pricing">
                <span className="priText">Pricing</span>
                <div className="redio">
                  <RadioButton
                    type="radio"
                    label="Paid"
                    checked={pricingType === "paid"}
                    onChange={() => setPricingType("paid")}
                  />
                  <RadioButton
                    type="radio"
                    label="Free"
                    checked={pricingType === "free"}
                    onChange={() => setPricingType("free")}
                  />
                </div>
                {pricingType === "paid" && (
                  <>
                    <TextField
                      prefix="$"
                      name="price"
                      error={priceError}
                      label="Base Price"
                      type="number"
                      value={sectionPrice}
                      onChange={(value) => setSectionPrice(value)}
                    />
                    <TextField
                      prefix="$"
                      name="discount"
                      error={discountError}
                      label="Discounted Price"
                      type="number"
                      value={sectionDiscount}
                      onChange={(value) => setSectionDiscount(value)}
                    />
                  </>
                )}
              </div>
              <div className="additional">
                <span className="additionalText">Additional Information</span>
                <Select
                  label="Categories"
                  options={options}
                  onChange={handleSelectChange}
                  value={selected}
                />
                <TextField
                  type="text"
                  name="tags"
                  error={descError}
                  label="Tags"
                  value={tags}
                  onChange={(value) => setTags(value)}
                  placeholder="Enter your section Tags"
                />
                {nameError && (
                  <InlineError message={nameErrorMsg} fieldID="sectionname" />
                )}
                {descError && (
                  <InlineError message={descErrorMsg} fieldID="desc" />
                )}
                {imgError && (
                  <InlineError message={imgErrorMsg} fieldID="sectionImg" />
                )}
                {filesError && (
                  <InlineError message={filesErrorMsg} fieldID="sectionFiles" />
                )}
                {priceError && (
                  <InlineError message={priceErrorMsg} fieldID="price" />
                )}
                {discountError && (
                  <InlineError message={discountErrorMsg} fieldID="discount" />
                )}
              </div>
            </FormLayout>
            <div className="subBtn">
              <Button onClick={handleReset} destructive>
                Reset
              </Button>
              <Button loading={isLoading} submit success>
                Submit
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </Page>
  );
}
