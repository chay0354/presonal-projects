import React from "react";

const formGroup = {
  width: "22%",
  marginBottom: "20px",
};
const InputLabels = {
  fontSize: "13px",
  fontWeight: 400,
  color: "#323C54",
};

const formControl = {
  marginTop: "4px",
  width: "100%",
  padding: "10px",
  outline: "none",
  fonrWeight: 400,
  color: "black",
  fontSize: "14px",
  borderRadius: "30px",
  border: "1px solid  #E7E9F4",
  background: " #FFF",
};

const AuthInput = (props) => {
  const { InputLabel, ...rest } = props;

  return (
    <div style={formGroup}>
      <label style={InputLabels}>{InputLabel}</label>
      <input className=" rounded" style={formControl} {...rest} />
    </div>
  );
};

export default AuthInput;
