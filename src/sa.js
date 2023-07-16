import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@material-ui/core";
import { useState } from "react";
import swal from "sweetalert2";
import moment from "moment";
import { Autocomplete } from "@material-ui/lab";

const axios = require("axios");
const baseUrl = process.env.REACT_APP_URL;

export function EditBeneficiary(props) {
  const { isEditModalOpen, handleEditModalClose, getBeneficiaries } = props;
  const [beneficiary, setBeneficiary] = useState(props.beneficiary);

  async function updateBeneficiary(e) {
    console.log(beneficiary);

    e.preventDefault();

    if (!beneficiary.beneficiaryId) {
      swal("Oops!", "Beneficiary Id is required!", "error");
      return;
    }

    if (isNaN(beneficiary.beneficiaryId)) {
      swal("Oops!", "Please enter a number", "error");
      return;
    }
    if (!beneficiary.name) {
      swal("Oops!", "Beneficiary Name is required!", "error");
      return;
    }

    const res = await axios.patch(baseUrl + "/beneficiary/" + beneficiary._id, {
      beneficiary: beneficiary,
    });

    if (res.status === 200) {
      handleEditModalClose();
      swal.fire({
        text: "School Successfully Updated",
        icon: "success",
        type: "success",
        timer: 3000,
        showConfirmButton: false,
      });
      getBeneficiaries();
    } else {
      swal({
        text: res?.data?.errorMessage,
        icon: "error",
        type: "error",
      });
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
  return (
    <Dialog
      open={isEditModalOpen}
      onClose={handleEditModalClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      style={{ zIndex: "99999" }}
      maxWidth="xs"
    >
      <DialogContent style={{ padding: "40px" }}>
        <DialogTitle id="alert-dialog-title">
          <span style={{ color: "#138D75" }}>
            {" "}
            <b> Edit School </b>{" "}
          </span>
        </DialogTitle>
  
        <br />
        <TextField
          id="standard-basic"
          type="text"
          autoComplete="off"
          name="beneficiaryId"
          value={beneficiary.beneficiaryId}
          onChange={update}
          placeholder="School EIIN"
          required
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
          placeholder="Lab Id"
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
          placeholder="PC Id"
          fullWidth
        />
        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
       
        &nbsp;
      </DialogContent>

      <DialogActions style={{ paddingRight: "80px", paddingBottom: "30px" }}>
        <Button
          onClick={handleEditModalClose}
          color="primary"
          style={{ backgroundColor: "#34495E", color: "white" }}
        >
          Cancel
        </Button>
        <Button
          onClick={updateBeneficiary}
          color="primary"
          autoFocus
          style={{ backgroundColor: "#138D75", color: "white" }}
        >
          Updated School
        </Button>
      </DialogActions>
    </Dialog>
  );
}