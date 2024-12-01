import React, { useState } from "react";
import "./DynamicForm.css";

const apiResponses = {
  userInfo: {
    fields: [
      { name: "firstName", type: "text", label: "First Name", required: true },
      { name: "lastName", type: "text", label: "Last Name", required: true },
      { name: "age", type: "number", label: "Age", required: false },
    ],
  },
  addressInfo: {
    fields: [
      { name: "street", type: "text", label: "Street", required: true },
      { name: "city", type: "text", label: "City", required: true },
      {
        name: "state",
        type: "dropdown",
        label: "State",
        options: ["California", "Texas", "New York", "Manhatten", "Ohio" ],
        required: true,
      },
      { name: "zipCode", type: "text", label: "Zip Code", required: false },
    ],
  },
  paymentInfo: {
    fields: [
      { name: "cardNumber", type: "text", label: "Card Number", required: true },
      { name: "expiryDate", type: "date", label: "Expiry Date", required: true },
      { name: "cvv", type: "password", label: "CVV", required: true },
      { name: "cardholderName", type: "text", label: "Cardholder Name", required: true },
    ],
  },
};

function DynamicForm() {
  const [formType, setFormType] = useState("");
  const [formFields, setFormFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFormTypeChange = (event) => {
    const selectedType = event.target.value;
    setFormType(selectedType);
    setFormFields(apiResponses[selectedType]?.fields || []);
    setFormData({});
    setErrors({});
    setIsSubmitted(false);
  };

  const handleInputChange = (e, field) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (field.required && !value) {
      setErrors({ ...errors, [name]: `${field.label} is required` });
    } else {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    formFields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="form-container">
      <h1>Dynamic Form</h1>
      <div>
        <label htmlFor="formType">Select Form Type:</label>
        <select id="formType" value={formType} onChange={handleFormTypeChange}>
          <option value="">--Select--</option>
          <option value="userInfo">User Information</option>
          <option value="addressInfo">Address Information</option>
          <option value="paymentInfo">Payment Information</option>
        </select>
      </div>
      {formFields.length > 0 && (
        <form onSubmit={handleSubmit}>
          {formFields.map((field) => (
            <div key={field.name} className="form-field">
              <label htmlFor={field.name}>{field.label}</label>
              {field.type === "dropdown" ? (
                <select
                  id={field.name}
                  name={field.name}
                  onChange={(e) => handleInputChange(e, field)}
                >
                  <option value="">--Select--</option>
                  {field.options.map((option, idx) => (
                    <option key={idx} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={field.name}
                  type={field.type}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleInputChange(e, field)}
                />
              )}
              {errors[field.name] && <span className="error">{errors[field.name]}</span>}
            </div>
          ))}
          <button type="submit">Submit</button>
        </form>
      )}
      {isSubmitted && (
        <div className="success-message">
          <h2>Form Submitted Successfully!</h2>
          <table>
            <thead>
              <tr>
                {formFields.map((field) => (
                  <th key={field.name}>{field.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {formFields.map((field) => (
                  <td key={field.name}>{formData[field.name]}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DynamicForm;
