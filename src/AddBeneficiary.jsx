import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@material-ui/core";
import { useState } from "react";
import swal from "sweetalert";
import Swal from "sweetalert2";

const axios = require("axios");
const baseUrl = process.env.REACT_APP_URL;

export function AddBeneficiary(props) {
  const { isEditModalOpen, handleEditModalClose, getBeneficiaries } = props;
  const [beneficiary, setBeneficiary] = useState({});
  const [error, setError] = useState(false);


  async function addBeneficiary(e) {
    // ... (rest of the code remains the same)

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
      style={{ zIndex: "9999"}}
    >
      <DialogContent style={{ padding: "40px" }}>
        <DialogTitle id="alert-dialog-title">
          <span style={{ color: "#138D75" }}>
            {" "}
            <b> Add School </b>{" "}
          </span>
        </DialogTitle>
        {/* <TextField
          id="standard-basic"
          type="text"
          autoComplete="off"
          name="m_nm"
          value={beneficiary.m_nm}
          onChange={update}
          placeholder="User Name"
          required
          fullWidth
        /> */}
        <br />
        <TextField
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
        />
        <br />
        <br />
        <TextField
          id="standard-basic"
          type="text"
          autoComplete="off"
          name="name"
          value={beneficiary.name}
          onChange={update}
          placeholder="School Name"
          required
          fullWidth
        />
        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
        <TextField
          id="standard-basic"
          type="text"
          autoComplete="off"
          name="u_nm"
          value={beneficiary.u_nm}
          onChange={update}
          placeholder="Lab Id "
          fullWidth
        />
        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
        <TextField
          id="standard-basic"
          type="text"
          autoComplete="off"
          name="f_nm"
          value={beneficiary.f_nm}
          onChange={update}
          placeholder="PC ID"
          fullWidth
        />
        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
      
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
