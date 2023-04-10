import { Card, CardActionArea, CardContent, CardMedia } from "@mui/material";
import React from "react";
import Template from "../Template/Template";

export default function UserTemplate() {
  const templateList = JSON.parse(localStorage.getItem("templateList"));

  console.log("showCard", templateList);
  return (
    <div
      style={{
        backgroundColor: "rgb(109,76,212)",
        height: "100vh",
        width: "100vw",
        overflowY: "auto",
      }}
    >
      <h1 style={{ color: "red" }}>Please Select Template</h1>

      {templateList.map((template, index) => {
        return (
          <div>
            /*{" "}
            <Card sx={{ maxWidth: 850 }}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="60"
                  image="/static/images/cards/contemplative-reptile.jpg"
                  alt="green iguana"
                />
                <CardContent>
                  <Template
                    isAdminAccessble={false}
                    background={template.background}
                    title={template.title}
                    subTitle={template.subTitle}
                    name={template.name}
                    comments={template.comments}
                    course={template.course}
                    score={template.score}
                    sinature={template.sinature}
                    date={template.date}
                  />
                  ;
                </CardContent>
              </CardActionArea>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
