import {
  Button,
  Checkbox,
  FormControlLabel,
  InputLabel,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import getBase64 from "../../utils/common";
import Template from "../Template/Template";
import { v4 as uuid } from "uuid";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const inputFields = {
  name: {
    label: "Name",
    type: "text",
    placeHolder: "Enter name",
  },
  signature: {
    label: "Signature",
    type: "file",
    placeHolder: "",
  },
  title: {
    label: "Title",
    type: "text",
    placeHolder: "Enter Title",
  },
  subTitle: {
    label: "Sub Title",
    type: "text",
    placeHolder: "Enter Sub Title",
  },
  comments: {
    label: "Comment",
    type: "text",
    placeHolder: "Enter Comment",
  },
  course: {
    label: "Course",
    type: "text",
    placeHolder: "Enter Course",
  },
  score: {
    label: "Score",
    type: "text",
    placeHolder: "Enter Score",
  },
  date: {
    label: "Date",
    type: "date",
    placeHolder: "Enter Date",
  },
};

export default function AddTemplate({
  setShow,
  selectedTemplate,
  setData,
  isAdminAccess,
}) {
  const [template, setTemplate] = useState({
    id: uuid(),
    backgroundImage: "",
    requiredFields: ["title", "subTitle", "comments"],
    isAdminAccessble: true,
    fieldsDetails: {},
  });
  const [error, setError] = useState({
    title: "",
    subTitle: "",
    comments: "",
    backgroundImage: "",
  });

  const isValid = () => {
    const fieldDetails = template.fieldsDetails;
    const { backgroundImage } = template;
    console.log("fieldDetails 78", fieldDetails);
    const errMsg = {
      title: "",
      subTitle: "",
      comments: "",
      backgroundImage: "",
    };
    if (!backgroundImage) {
      errMsg.backgroundImage = "This Field is required";
    }
    if (!fieldDetails?.title) {
      errMsg.title = "This Field is required";
    }
    if (!fieldDetails?.subTitle) {
      errMsg.subTitle = "This Field is required";
    }
    if (!fieldDetails?.comments) {
      errMsg.comments = "This Field is required";
    }
    if (
      errMsg.title ||
      errMsg.subTitle ||
      errMsg.comments ||
      errMsg.backgroundImage
    ) {
      setError(errMsg);
      return false;
    } else {
      setError(errMsg);
      return true;
    }
  };
  useEffect(() => {
    console.log("template", template);
  }, [template]);

  useEffect(() => {
    if (selectedTemplate && Object.keys(selectedTemplate).length > 0) {
      setTemplate(selectedTemplate);
    }
  }, []);

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const checked = e.target.checked;
    let preRequiredFields = [...template.requiredFields];
    if (checked) {
      preRequiredFields.push(name);
    } else {
      preRequiredFields = preRequiredFields.filter(
        (fieldName) => fieldName !== name
      );
    }
    setTemplate({
      ...template,
      requiredFields: preRequiredFields,
    });
    console.log(name, checked);
  };

  function DataSubmit() {
    const templateList = localStorage.getItem("templateList");
    if (isValid()) {
      setShow(false);
      if (templateList) {
        let tempTemplateList = JSON.parse(templateList);
        if (selectedTemplate) {
          tempTemplateList = tempTemplateList.map((temp) => {
            if (temp.id === template.id) {
              return template;
            } else {
              return temp;
            }
          });
          alert("Update Successfully !!");
        } else {
          tempTemplateList.push(template);
          alert("Save Successfully !!");
        }
        setData(tempTemplateList);
        localStorage.setItem("templateList", JSON.stringify(tempTemplateList));
      } else {
        localStorage.setItem("templateList", JSON.stringify([template]));
        alert("Save Successfully !!");
      }
    }
  }

  const inputHandler = async (e) => {
    let { value, name } = e.target;
    if (name === "signature") {
      const file = e.target.files[0];
      if (file) {
        const base64 = await getBase64(file);
        value = base64;
        console.log("99", value);
      }
    }
    setTemplate({
      ...template,
      fieldsDetails: {
        ...template.fieldsDetails,
        [name]: value,
      },
    });
  };

  console.log(template?.backgroundImage?.split("**")[0]);

  return (
    <div>
      <h2> Create New Template </h2>

      <div style={{ float: "right" }}>
        <Button
          onClick={() => {
            setShow(false);
          }}
        >
          <ArrowBackIosNewIcon /> Back
        </Button>
      </div>

      <div style={{ marginTop: "4vw" }}>
        <h3>Upload BackGround Image</h3>
        <Button
          onClick={() => {
            document.getElementById("background").click();
          }}
        >
          Upload Background Image
        </Button>
        {template?.backgroundImage?.split("**")[0] ? (
          ""
        ) : (
          <span style={{ color: "red", fontSize: "12px", marginTop: "-10px" }}>
            {error.backgroundImage}
          </span>
        )}
        <span>
          {template?.backgroundImage?.split("**")[0]
            ? template.backgroundImage.split("**")[0]
            : null}
        </span>
        <TextField
          fullWidth
          id="background"
          name="background"
          type="file"
          onChange={async (e) => {
            const file = e.target.files[0];
            console.log("file", file.name);

            const b64 = await getBase64(file);
            setTemplate({
              ...template,
              backgroundImage: file?.name + "**" + b64,
            });
            console.log("217", template?.backgroundImage.split("**")[1]);
            console.log(file, b64);
          }}
          sx={{ marginTop: "15px", marginBottom: "10px", display: "none" }}
        />
      </div>

      <div
        style={{
          marginTop: "4vw",
        }}
      >
        <h3>Select Template Required Fields</h3>
        <FormControlLabel
          control={
            <Checkbox
              name="name"
              checked={template.requiredFields.includes("name")}
              onChange={(e) => {
                onChangeHandler(e);
              }}
            />
          }
          label="Name"
        />
        <FormControlLabel
          control={
            <Checkbox
              name="course"
              checked={template.requiredFields.includes("course")}
              onChange={(e) => {
                onChangeHandler(e);
              }}
            />
          }
          label="Course"
        />
        <FormControlLabel
          control={
            <Checkbox
              name="score"
              checked={template.requiredFields.includes("score")}
              onChange={(e) => {
                onChangeHandler(e);
              }}
            />
          }
          label="Score"
        />
        <FormControlLabel
          control={
            <Checkbox
              name="signature"
              checked={template.requiredFields.includes("signature")}
              onChange={(e) => {
                onChangeHandler(e);
              }}
            />
          }
          label="Sinature"
        />
        <FormControlLabel
          control={
            <Checkbox
              name="date"
              checked={template.requiredFields.includes("date")}
              onChange={(e) => {
                onChangeHandler(e);
              }}
            />
          }
          label="Date"
        />
      </div>

      <div
        style={{
          width: "500px",
          marginTop: "40px",
        }}
      >
        <h3>All Required Fields</h3>
        {template.requiredFields.length <= 0 && (
          <p style={{ textAlign: "center" }}>No field selected!</p>
        )}

        {template.requiredFields.map((fieldName, index) => {
          const fieldDetails = inputFields[fieldName];
          const errormessage = error[fieldName];
          console.log("object", errormessage);
          console.log("fieldDetails", fieldDetails);
          if (index > 2) return null;
          return (
            <>
              <label htmlFor={fieldName}>{fieldDetails.label}</label>

              <TextField
                fullWidth
                id={fieldName}
                name={fieldName}
                error={errormessage ? true : false}
                value={
                  fieldDetails.type === "file"
                    ? null
                    : template.fieldsDetails[fieldName]
                }
                onChange={inputHandler}
                type={fieldDetails.type}
                placeholder={fieldDetails.placeHolder}
                sx={{ marginBottom: "10px" }}
              />
              <div
                style={{ color: "red", fontSize: "12px", marginTop: "-10px" }}
              >
                <span>{errormessage}</span>
              </div>
            </>
          );
        })}
      </div>

      <div style={{ marginTop: "5vh" }}>
        <label htmlFor="">
          <span style={{ fontSize: "20px" }}>
            <b> Preview Template</b>
          </span>
        </label>
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Button
            style={{ display: "block" }}
            variant="contained"
            color="success"
            onClick={() => {
              console.log("object");
              DataSubmit();

              // setShow(false);
            }}
          >
            Save Template
          </Button>
        </div>

        <div style={{ marginTop: "7vh" }}>
          <Template
            isPartnerAdmin={true}
            background={
              template?.backgroundImage?.split("**")[1]
                ? template.backgroundImage.split("**")[1]
                : ""
            }
            name={template.requiredFields.includes("name")}
            title={template.fieldsDetails.title}
            subTitle={template.fieldsDetails.subTitle}
            comments={template.fieldsDetails.comments}
            course={template.requiredFields.includes("course")}
            score={template.requiredFields.includes("score")}
            sinature={template.requiredFields.includes("signature")}
            date={template.requiredFields.includes("date")}
          />
        </div>
      </div>
    </div>
  );
}
