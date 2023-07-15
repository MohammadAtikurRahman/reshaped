import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Popper from "@material-ui/core/Popper";
import swal from "sweetalert";
import Swal from "sweetalert2";

const axios = require("axios");
const baseUrl = process.env.REACT_APP_URL;

export function AddBeneficiary(props) {
  const { isEditModalOpen, handleEditModalClose, getBeneficiaries } = props;
  const [beneficiary, setBeneficiary] = useState({});
  const [error, setError] = useState(false);

  const [eiinInput, setEiinInput] = useState("");
  const [nameInput, setNameInput] = useState("");

  const [submit, setSubmit] = useState(false);

  // Schools data
  const schools = [
    { eiin: "111794", name: "Sakhuya Adarsha Biddyaniketan" },
    { eiin: "130875", name: "Shaheed Muktijoddha Girls High School" },
    { eiin: "107827", name: "Ruhul Amin Khan Uccho Biddaloy" },
    { eiin: "104414", name: "Fateyabad Mohakali Balika Uccho Biddaloy" },
    { eiin: "106916", name: "Shyamganj Uccho Biddaloy" },
    { eiin: "138307", name: "Biam Laboratory School" },
    { eiin: "117769", name: "The Old Kushtia HighSchool" },
    { eiin: "131212", name: "Chulash Adarsha Uccho Biddaloy" },
  ];

  useEffect(() => {
    if (submit && beneficiary.u_nm && beneficiary.beneficiaryId) {
      makeRequest();
    }
  }, [submit, beneficiary]);

  async function makeRequest() {
    try {
      const res = await axios.post(baseUrl + "/beneficiary/", {
        beneficiary: beneficiary,
        token: localStorage.getItem("token"),
      });

      if (res.status === 200) {
        handleEditModalClose();
        Swal.fire({
          text: "School Successfully Added",
          icon: "success",
          type: "success",
          timer: 3000,
          showConfirmButton: false,
        });
        getBeneficiaries();
      }
    } catch (error) {
      if (error.response && error.response.data.errorMessage) {
        swal({
          text: error.response.data.errorMessage,
          icon: "error",
          type: "error",
        });
      } else {
        swal({
          text: "An error occurred. Please try again.",
          icon: "error",
          type: "error",
        });
      }
    }
    setSubmit(false);
  }

  async function addBeneficiary(e) {
    e.preventDefault();

    // Appending 'L' to u_nm and 'P' to f_nm before appending the beneficiaryId (eiin)
    setBeneficiary((prevState) => ({
      ...prevState,
      u_nm: `${prevState.beneficiaryId}-L${prevState.u_nm}`,
      f_nm: `${prevState.beneficiaryId}-P${prevState.f_nm}`,
    }));

    setSubmit(true);
  }

  function update(event) {
    let { name, value } = event.target;
    if (value === null) {
      value = "";
    }
    setBeneficiary((beneficiary) => {
      return { ...beneficiary, [name]: value };
    });
  }

  function checkNumber(e) {
    if (isNaN(e.target.value)) {
      swal("Oops!", "Please enter a number", "error");
    }
  }

  return (
    <Dialog
      open={isEditModalOpen}
      onClose={handleEditModalClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="xs"
      // scroll="false" // This will disable the scroll

      style={{ zIndex: 1300 }}
    >
      <DialogContent style={{  width: "400px" }}>
        <DialogTitle id="alert-dialog-title">
          <span style={{ color: "#138D75" }}>
            {" "}
            <b> Add School </b>{" "}
          </span>
        </DialogTitle>
        <br />

        {/* <TextField
          id="standard-basic"
          type="text"
          autoComplete="off"
          name="beneficiaryId"
          value={beneficiary.beneficiaryId}
          onChange={update}
          onBlur={checkNumber}
          placeholder="School EIIN"
          required
          pattern="[0-9]*"
          fullWidth
        /> */}

        <Autocomplete
          id="eiin-combo-box"
          options={schools}
          getOptionLabel={(option) => option.eiin}
          inputValue={eiinInput}
          onInputChange={(event, newInputValue) => {
            setEiinInput(newInputValue);
            if (newInputValue === "") {
              setNameInput("");
              setBeneficiary({});
              return;
            }
            const selectedSchool = schools.find(
              (school) => school.eiin === newInputValue
            );
            if (selectedSchool) {
              setBeneficiary((prevState) => ({
                ...prevState,
                beneficiaryId: selectedSchool.eiin,
                name: selectedSchool.name,
              }));
              setNameInput(selectedSchool.name);
            }
          }}
          filterOptions={(options, params) => {
            if (params.inputValue === "") {
              return [];
            }
            const filtered = options.filter((option) =>
              option.eiin.includes(params.inputValue)
            );
            return filtered;
          }}
          renderInput={(params) => (
            <TextField {...params} label="School EIIN" variant="outlined" />
          )}
          PopperComponent={({ children, ...props }) => (
            <Popper {...props} style={{ zIndex: 2000 }}>
              {children}
            </Popper>
          )}
        />

        <br />

        <Autocomplete
          id="name-combo-box"
          options={schools}
          getOptionLabel={(option) => option.name}
          inputValue={nameInput}
          onInputChange={(event, newInputValue) => {
            setNameInput(newInputValue);
            if (newInputValue === "") {
              setEiinInput("");
              setBeneficiary({});
              return;
            }
            const selectedSchool = schools.find(
              (school) =>
                school.name.toLowerCase() === newInputValue.toLowerCase()
            );
            if (selectedSchool) {
              setBeneficiary((prevState) => ({
                ...prevState,
                beneficiaryId: selectedSchool.eiin,
                name: selectedSchool.name,
              }));
              setEiinInput(selectedSchool.eiin);
            }
          }}
          filterOptions={(options, params) => {
            if (params.inputValue === "") {
              return [];
            }
            const filtered = options.filter((option) =>
              option.name
                .toLowerCase()
                .includes(params.inputValue.toLowerCase())
            );
            return filtered;
          }}
          renderInput={(params) => (
            <TextField {...params} label="School Name" variant="outlined" />
          )}
          PopperComponent={({ children, ...props }) => (
            <Popper {...props} style={{ zIndex: 2000 }}>
              {children}
            </Popper>
          )}
        />

        <br />

        <TextField
          id="outlined-basic"
          type="text"
          autoComplete="off"
          name="u_nm"
          value={beneficiary.u_nm}
          onChange={update}
          placeholder="Lab Id "
          variant="outlined"
          fullWidth
        />
        <br />
        <br />
        <TextField
          id="outlined-basic"
          type="text"
          autoComplete="off"
          name="f_nm"
          value={beneficiary.f_nm}
          onChange={update}
          placeholder="PC ID"
          variant="outlined"
          fullWidth
        />
        <br />
      </DialogContent>
      <DialogActions style={{ paddingRight: "80px", paddingBottom: "50px" }}>
        <Button
          onClick={handleEditModalClose}
          color="primary"
          style={{ backgroundColor: "#34495E", color: "white" }}
        >
          Cancel
        </Button>
        <Button
          onClick={addBeneficiary}
          color="primary"
          autoFocus
          style={{ backgroundColor: "#138D75", color: "white" }}
        >
          Add School
        </Button>
      </DialogActions>
    </Dialog>
  );
}
