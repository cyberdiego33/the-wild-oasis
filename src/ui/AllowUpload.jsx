import { useState } from "react";
import Button from "./Button";
import styled from "styled-components";

const PassWordForm = styled.input`
  width: 100%;
  color: black;
`;

const ErrorText = styled.p`
  color: red;
  font-size: small;
`;

const AllowUpload = function ({ setOpenUpload }) {
  const [openForm, closeForm] = useState(false);
  const [password, setPassword] = useState("");

  if (password === "Diego.1104") setOpenUpload(true);

  return (
    <>
      {openForm ? (
        <form>
          <PassWordForm
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            value={password}
            type="password"
          />
          {password !== "" && password !== "Diego.1104" ? (
            <ErrorText>Input Matching Password </ErrorText>
          ) : (
            ""
          )}
        </form>
      ) : (
        <Button onClick={() => closeForm(true)}>Update Upload</Button>
      )}
    </>
  );
};

export default AllowUpload;
