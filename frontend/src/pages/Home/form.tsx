import React, { useState } from "react";
import { isAddress } from 'web3-validator';

interface BalanceApiResponse {
    data: number;
    status: 'SUCCESS' | 'ERROR';
    error?: {
        message: string[];
        code: string;
        dashboardLog: string | null;
    }
}

function Form() {
  const [inputValue, setInputValue] = useState(""); // State to hold the input value
  const [labelText, setLabelText] = useState(""); // State to hold the label text

  const handleButtonClick = async () => {
    if (!isAddress(inputValue)) {
      setLabelText('Incorrect address provided!');
      return;
    }
    const balanceReq = await fetch(`/api/eth-balance?address=${inputValue}`);
    const balanceRes: BalanceApiResponse = await balanceReq.json();

    setLabelText(`${balanceRes.data ? 'Balance: ' + balanceRes.data : `Error: ${balanceRes.error?.message.join() ?? 'Unknown Error'}`}`);
  };

  return (
    <div>
      <p>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter ETH wallet address to get balance"
          style={{ padding: "5px", width: "320px" }}
        />
      </p>
      <button onClick={handleButtonClick} style={{ padding: "5px" }}>
        Click Me
      </button>
      <p style={{ padding: "5px", fontSize: "16px", fontWeight: "bold" }}>
        {labelText}
      </p>
    </div>
  );
}

export default Form;
