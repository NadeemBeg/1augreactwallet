import React from "react";
import style from "./Template.module.css";
import templatebackground from "../../assets/templatebackground.jpg";

export default function Template(props) {
  return (
    <div class={style.templateWrapper}>
      <img
        src={props.background || templatebackground}
        class={style.templateBackground}
        alt="loading..."
      />
      <div class={style.templateContent}>
        <span class={style.certification}>
          <i>{props.title || " UPSC "}</i>
        </span>
        <br />
        <br />
        <span class={style.certify}>
          <i> {props.subTitle || "This is to certify that"}</i>
        </span>
        <br />
        <br />
        <span class={style.name}>
          <b>
            {props.name
              ? props.isPartnerAdmin
                ? "Please enter Name"
                : props.name
              : "Shanu Kumar"}
          </b>
        </span>
        <br />
        <br />
        <span class={style.certify}>
          <i>
            {props.comments || "has successfully completed the certification"}
          </i>
        </span>{" "}
        <br />
        <br />
        {props.course && (
          <span class={style.fs - 30}>
            <b>{props.isPartnerAdmin ? "Please enter course" : props.course}</b>
          </span>
        )}
        <br />
        <br />
        {props.score && (
          <span class={style.fs - 20}>
            <b>{props.isPartnerAdmin ? "Please enter Score" : props.score}</b>
          </span>
        )}
        <br />
        <br />
        <br />
        <br />
        <br />
        {props.date && (
          <span class={style.fs30}>
            {props.isPartnerAdmin ? "Please enter Date" : props.date}
          </span>
        )}
        {props.sinature && (
          <u style={{ marginLeft: "326px" }}>
            <span class={style.fs30}>
              {props.isPartnerAdmin ? (
                "Please enter Sign"
              ) : (
                <img src={props.sinature} class={style.sign} alt="loading..." />
              )}
            </span>
          </u>
        )}
      </div>
    </div>
  );
}
