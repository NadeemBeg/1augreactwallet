import React, { useEffect } from "react";
import { useState } from "react";
import Certificate from "../CertificateTemplates/Certificate";
import { mockCertificateList } from "../../Constants";

function AddCertificates() {
  const [certificateList, setCertificateList] = useState([]);

  useEffect(() => {
    let tempCertificateList = localStorage.getItem("certificateList");
    if (tempCertificateList) {
      tempCertificateList = JSON.parse(tempCertificateList);
      setCertificateList(tempCertificateList);
    } else {
      setCertificateList([]);
    }
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexFlow: "wrap",
      }}
    >
      {certificateList.map((certificate) => {
        return certificate.isSelected ? (
          <Certificate
            id={certificate.id}
            isViewed={true}
            imageUrl={certificate.imageUrl}
          />
        ) : null;
      })}
    </div>
  );
}

export default AddCertificates;
