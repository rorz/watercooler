import React, { useState } from "react";
import styled from "styled-components";

import "typeface-fredoka-one";
import "fontsource-comic-neue";

const SettingsBackground = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 1337;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
`;

const SettingsForm = styled.form`
  background: #f1faee;
  padding: 2rem;
  background: white;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  min-width: 300px;
  max-width: 450px;

  i {
    margin-top: 1rem;
    color: #1d3557;
  }
`;

const SettingsField = styled.input`
  padding: 0.8rem 1rem;
  font-size: 1rem;
  margin-bottom: 1rem;
  min-width: 10rem;
  border: 1px solid #457b9d;
  border-radius: 0.2rem;
  font-family: "Comic Neue", sans-serif;
  font-weight: 600;
`;

const SettingsLabel = styled.label`
  font-size: 1.2rem;
  padding: 0.2rem;
  /* margin-top: 1rem; */
  font-weight: 800;
  color: #1d3557;
`;

const Submit = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: #1d3557;
  color: white;
  font-weight: 800;
  border-radius: 1rem;
  margin-top: 1rem;
  font-size: 1.2rem;
  font-family: "Fredoka One", sans-serif;
  font-weight: 400;
  cursor: pointer;

  transition: background 0.4s;

  &:hover {
    background: #457b9d;
  }
`;

const SettingsModal = ({ onSubmit }) => {
  const [firstName, setFirstName] = useState("");
  const [ventureName, setVentureName] = useState("");
  const [passcode, setPasscode] = useState("");
  return (
    <SettingsBackground>
      <SettingsForm>
        <SettingsLabel>✍️ First name</SettingsLabel>
        <SettingsField
          type="text"
          placeholder="Alex"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
        />
        <SettingsLabel>🚀 Venture</SettingsLabel>
        <SettingsField
          type="text"
          placeholder="Best Company"
          value={ventureName}
          onChange={(event) => setVentureName(event.target.value)}
        />
        <SettingsLabel>🔑 'Cooler code</SettingsLabel>
        <SettingsField
          type="text"
          placeholder="1234ABC"
          value={passcode}
          onChange={(event) => setPasscode(event.target.value)}
        />
        <Submit
          onClick={() =>
            firstName &&
            ventureName &&
            passcode &&
            onSubmit({ firstName, ventureName, passcode })
          }
        >
          Walk on over ☕️
        </Submit>
        <i>
          Please note: if you provide the wrong watercooler code, the page will
          reload, and you'll have to guess again...
        </i>
      </SettingsForm>
    </SettingsBackground>
  );
};

export default SettingsModal;
