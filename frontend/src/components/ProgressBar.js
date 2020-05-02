import React from "react";

import styles from "./ProgressBar.module.css";

const ProgressBar = (props) => {
  return (
    <div className={styles["progress-bar"]}>
      <Filler percentage={props.percentage} />
    </div>
  );
};

const Filler = (props) => {
  return <div className={styles["filler"]} style={{ width: `${props.percentage}%` }} />;
};

export default ProgressBar;
