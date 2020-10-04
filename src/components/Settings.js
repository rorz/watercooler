import React, { useState } from "react";
import styled from "styled-components";

const SettingsBackground = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
`;

const SettingsForm = styled.form`
  padding: 2rem;
  background: white;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
`;

const SettingsField = styled.input`
  padding: 0.2rem;
  margin-bottom: 1rem;
  min-width: 10rem;
`;

const SettingsLabel = styled.label`
  padding: 0.2rem;
  margin-top; 1rem;
`;

const Submit = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: blue;
  color: white;
  font-weight: 800;
  border-radius: 1rem;
`;

const SettingsModal = ({ onSubmit }) => {
  const [firstName, setFirstName] = useState("");
  const [ventureName, setVentureName] = useState("");
  const [passcode, setPasscode] = useState("");
  return (
    <SettingsBackground>
      <SettingsForm>
        <SettingsLabel>First name</SettingsLabel>
        <SettingsField
          type="text"
          placeholder="Alex"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
        />
        <SettingsLabel>Venture</SettingsLabel>
        <SettingsField
          type="text"
          placeholder="Best Company"
          value={ventureName}
          onChange={(event) => setVentureName(event.target.value)}
        />
        <SettingsLabel>Watercooler passcode</SettingsLabel>
        <SettingsField
          type="text"
          placeholder="1234ABC"
          value={passcode}
          onChange={(event) => setPasscode(event.target.value)}
        />
        <Submit onClick={() => onSubmit({ firstName, ventureName, passcode })}>
          Submit
        </Submit>
      </SettingsForm>
    </SettingsBackground>
  );
};

export default SettingsModal;
