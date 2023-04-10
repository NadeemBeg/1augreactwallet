import React from "react";
import style from "../style.module.css";

function Index({ isSelected, imageUrl, onChange, id, isViewed }) {
  console.log(isSelected);
  return (
    <div className={style.certificateCardWraper}>
      <div>
        <img src={imageUrl} alt="" width={"100%"} height={"100%"} />
      </div>
      {!isViewed && (
        <input
          onChange={(e) => {
            onChange(e.target.checked, id);
          }}
          type="checkbox"
          className={style.checkbox}
          checked={isSelected}
        />
      )}
    </div>
  );
}

export default Index;
