import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useEffect } from "react";
import AddTemplate from "./AddTemplate";
import { Button } from "@mui/material";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

export default function ViewAllTemplates() {
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  useEffect(() => {
    let showData = localStorage.getItem("templateList");
    showData = JSON.parse(showData);
    console.log("showData", showData);
    setData(showData);
  }, []);

  const deleteData = (template) => {
    let delData = template.id;
    const listFilterData = data.filter((ele) => {
      return ele.id !== delData;
    });
    localStorage.setItem("templateList", JSON.stringify(listFilterData));

    setData(listFilterData);
    console.log("delData", listFilterData);
  };

  const editData = (template) => {
    setSelectedCertificate(template);
    setTimeout(() => {
      setShow(true);
    }, 1000);
    console.log("delData", template);
  };

  return (
    <>
      {!show && (
        <>
          <div>
            <Button
              onClick={() => {
                setShow(true);
                setSelectedCertificate(null);
              }}
              variant="contained"
              color="success"
              style={{ margin: "25px" }}
            >
              Add Template
            </Button>
          </div>

          <div>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Back Ground Image</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>SubTitle</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.map((template) => (
                  <TableRow
                    key={template.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    {console.log("2222", template.backgroundImage)}
                    <TableCell component="th" scope="row">
                      {template.id}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <img
                        width={"40px"}
                        src={template.backgroundImage.split("**")[1]}
                        alt="loading"
                      />
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {template.fieldsDetails.title}
                    </TableCell>

                    <TableCell component="th" scope="row">
                      {template.fieldsDetails.subTitle}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {
                        <DeleteIcon
                          style={{ color: "red", marginRight: "25px" }}
                          onClick={() => {
                            deleteData(template);
                          }}
                        />
                      }
                      {
                        <ModeEditIcon
                          onClick={() => {
                            editData(template);
                          }}
                          style={{ color: "green" }}
                        />
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
      {show && (
        <AddTemplate
          setShow={setShow}
          selectedTemplate={selectedCertificate}
          setData={setData}
        />
      )}
    </>
  );
}
