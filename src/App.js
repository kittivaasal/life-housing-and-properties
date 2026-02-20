import { FileText } from "lucide-react";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    plotNo: "",
    date: "",
    nameOfCustomer: "",
    gender: "",
    projectArea: "",
    nationality: "",
    dob: "",
    occupation: "",
    qualification: "",
    planNo: "",
    communicationAddress: "",
    pincode: "",
    mobileNo: "",
    landLineNo: "",
    email: "",
    fatherOrHusbandName: "",
    motherName: "",
    nomineeName: "",
    nomineeAge: "",
    nomineeRelationship: "",
    nameOfGuardian: "",
    so_wf_do: "",
    relationshipWithCustomer: "",
    address: "",
    introducerName: "",
    introducerMobileNo: "",
    immSupervisorName: "",
    cedName: "",
    cedId: "", // Added
    cedMobile: "", // Added
    diamountDirectorName: "", // Leaving as is for backward compat if needed, but we use ddName in search
    diamountDirectorPhone: "",
    ddName: "", // Added for new dropdown
    ddId: "", // Added
    ddMobile: "", // Added
    schemeName: "", // Added
    schemeNo: "", // Added (mapped to projectId)
    idNo: "", // Added
    photo: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New State for Searchable Dropdowns
  const [allProjects, setAllProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [schemeSearchQuery, setSchemeSearchQuery] = useState("");
  const [activeSchemeDropdown, setActiveSchemeDropdown] = useState(false);

  const [cedList, setCedList] = useState([]);
  const [filteredCedList, setFilteredCedList] = useState([]);
  const [isLoadingCED, setIsLoadingCED] = useState(false);
  const [cedSearchQuery, setCedSearchQuery] = useState("");
  const [activeCedDropdown, setActiveCedDropdown] = useState(false);

  const [ddList, setDdList] = useState([]);
  const [filteredDdList, setFilteredDdList] = useState([]);
  const [isLoadingDD, setIsLoadingDD] = useState(false);
  const [ddSearchQuery, setDdSearchQuery] = useState("");
  const [activeDdDropdown, setActiveDdDropdown] = useState(false);

  useEffect(() => {
    const baseUrl =
      process.env.REACT_APP_BASE_URL || "https://api.lifedeegrand.com";

    // Fetch Projects
    const fetchAllProjects = async () => {
      setIsLoadingProjects(true);
      try {
        const response = await fetch(`${baseUrl}/api/project/get/all`);
        if (!response.ok)
          throw new Error(`Failed to fetch projects: ${response.status}`);
        const data = await response.json();
        const projects = Array.isArray(data) ? data : data.data || [];
        setAllProjects(projects);
        setFilteredProjects(projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
        // alert("Failed to load schemes. Please refresh the page.");
      } finally {
        setIsLoadingProjects(false);
      }
    };

    // Fetch CED List
    const fetchCEDList = async () => {
      setIsLoadingCED(true);
      try {
        const response = await fetch(`${baseUrl}/api/market/detail/get/all`);
        if (!response.ok)
          throw new Error(`Failed to fetch CED list: ${response.status}`);
        const data = await response.json();
        const cedData = Array.isArray(data) ? data : data.data || [];
        setCedList(cedData);
        setFilteredCedList(cedData);
      } catch (error) {
        console.error("Error fetching CED list:", error);
        // alert("Failed to load CED names. Please refresh the page.");
      } finally {
        setIsLoadingCED(false);
      }
    };

    // Fetch DD List
    const fetchDDList = async () => {
      setIsLoadingDD(true);
      try {
        const response = await fetch(`${baseUrl}/api/market/head/get/all`);
        if (!response.ok)
          throw new Error(`Failed to fetch DD list: ${response.status}`);
        const data = await response.json();
        const ddData = Array.isArray(data) ? data : data.data || [];
        setDdList(ddData);
        setFilteredDdList(ddData);
      } catch (error) {
        console.error("Error fetching DD list:", error);
        // alert("Failed to load DD names. Please refresh the page.");
      } finally {
        setIsLoadingDD(false);
      }
    };

    fetchAllProjects();
    fetchCEDList();
    fetchDDList();
  }, []);

  // Filter projects
  useEffect(() => {
    if (!schemeSearchQuery.trim()) {
      setFilteredProjects(allProjects);
    } else {
      const query = schemeSearchQuery.toLowerCase();
      const filtered = allProjects.filter((project) => {
        const name = (
          project.name ||
          project.projectName ||
          project.schemeName ||
          ""
        ).toLowerCase();
        const id = (project.id || project._id || "").toString().toLowerCase();
        return name.includes(query) || id.includes(query);
      });
      setFilteredProjects(filtered);
    }
  }, [schemeSearchQuery, allProjects]);

  // Filter CED list
  useEffect(() => {
    if (!cedSearchQuery.trim()) {
      setFilteredCedList(cedList);
    } else {
      const query = cedSearchQuery.toLowerCase();
      const filtered = cedList.filter((ced) => {
        const name = (ced.name || "").toLowerCase();
        const phone = (ced.phone || "").toString().toLowerCase();
        return name.includes(query) || phone.includes(query);
      });
      setFilteredCedList(filtered);
    }
  }, [cedSearchQuery, cedList]);

  // Filter DD list
  useEffect(() => {
    if (!ddSearchQuery.trim()) {
      setFilteredDdList(ddList);
    } else {
      const query = ddSearchQuery.toLowerCase();
      const filtered = ddList.filter((dd) => {
        const name = (dd.name || "").toLowerCase();
        const phone = (dd.phone || "").toString().toLowerCase();
        return name.includes(query) || phone.includes(query);
      });
      setFilteredDdList(filtered);
    }
  }, [ddSearchQuery, ddList]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0], // store uploaded file
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? value.replace(/\D/g, "") : value,
      }));
    }

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    /*   const requiredFields = [
      "plotNo", "date", "nameOfCustomer", "gender", "projectArea",
      "nationality", "dob", "occupation", "qualification", "planNo",
      "communicationAddress", "pincode", "mobileNo", "email",
      "fatherOrHusbandName", "motherName", "nomineeName", "nomineeAge",
      "nomineeRelationship", "nameOfGuardian", "so_wf_do", "relationshipWithCustomer",
      "address", "introducerName", "introducerMobileNo", "immSupervisorName",
      "cedName", "diamountDirectorName", "diamountDirectorPhone", "photo"
    ]; */

    const requiredFields = [
      "nameOfCustomer",
      // "email", // Made optional
      "mobileNo",
      "address",
      // "introducerName",
      // "address", // Duplicate removed
      "ddId", // Added as per snippet requirements (red star)
      "schemeNo", // Added as per snippet requirements (red star)
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
      }
    });

    // Basic validations
    if (formData.mobileNo && !/^\d{10}$/.test(formData.mobileNo))
      newErrors.mobileNo = "Enter a valid 10-digit mobile number";

    // Introducer validation commented out
    /* if (formData.introducerMobileNo && !/^\d{10}$/.test(formData.introducerMobileNo))
      newErrors.introducerMobileNo = "Enter a valid 10-digit mobile number"; */

    if (formData.pincode && !/^\d{6}$/.test(formData.pincode))
      newErrors.pincode = "Enter a valid 6-digit PIN code";

    // Email validation only if provided
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Enter a valid email address";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      alert("Please fill all required fields correctly.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Convert photo to base64 if present
      let photoBase64 = null;
      if (formData.photo) {
        photoBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(formData.photo);
        });
      }

      // Prepare payload as JSON
      const payload = {
        ...formData,
        projectId: formData.schemeNo, // Mapping schemeNo (ID) to projectId
        photo: photoBase64, // replace file object with base64 string
      };

      // Remove display-only fields from payload if backend doesn't accept them
      // keeping them if backend is flexible/ignores extra fields, but explicitly mapping projectId is key.

      const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000"; // Fallback or env
      const response = await fetch(`${baseUrl}`, {
        // Updated endpoint based on curl
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload), // send as JSON payload
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const result = await response.json();
      console.log("Form Submitted:", result);
      alert("Plot booking submitted successfully!");
      setFormData({});
      window.location.reload();
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong while submitting. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-container">
      <div className="form-wrapper">
        {/* Header */}
        <div className="form-header">
          <div className="company-logo">
            <img width={60} height={60} src="/log.jpg" alt="company logo" />
          </div>
          <h1 className="company-title">Life Housing & Properties</h1>
          <p className="form-subtitle">Plot Booking Form</p>
          <div className="title-underline"></div>
        </div>

        <div className="form-card">
          <div className="form-body">
            <h2 className="section-title">
              <FileText className="section-icon" /> Plot & Customer Details
            </h2>
            {/* NEW Scheme & App ID Section - Moved to Top */}
            <div>
              {/* Scheme Dropdown */}
              <div className="input-field" style={{ position: "relative" }}>
                <label>
                  Scheme <span style={{ color: "red" }}>*</span>
                </label>
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="text"
                    name="schemeName"
                    placeholder={
                      isLoadingProjects ? "Loading schemes..." : "Select Scheme"
                    }
                    value={formData.schemeName || schemeSearchQuery || ""}
                    onChange={(e) => {
                      setSchemeSearchQuery(e.target.value);
                      setFormData((prev) => ({ ...prev, schemeName: "" }));
                      setActiveSchemeDropdown(true);
                    }}
                    onFocus={() => {
                      setActiveSchemeDropdown(true);
                      setSchemeSearchQuery("");
                    }}
                    disabled={isLoadingProjects}
                    style={{ paddingRight: "40px", width: "100%" }}
                  />
                  {formData.schemeNo && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          schemeNo: "",
                          schemeName: "",
                        }));
                        setSchemeSearchQuery("");
                      }}
                      style={{
                        position: "absolute",
                        right: "8px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "#e5e7eb",
                        border: "none",
                        borderRadius: "50%",
                        width: "22px",
                        height: "22px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      ✖
                    </button>
                  )}
                </div>

                {/* Scheme Dropdown List */}
                {activeSchemeDropdown && !isLoadingProjects && (
                  <div
                    className="dropdown-list"
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      maxHeight: "200px",
                      overflowY: "auto",
                      backgroundColor: "white",
                      border: "1px solid #ddd",
                      zIndex: 1000,
                      marginTop: "4px",
                    }}
                  >
                    {filteredProjects.length > 0 ? (
                      filteredProjects.map((project) => (
                        <div
                          key={project.id || project._id}
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              schemeNo: project._id, // Store ID as schemeNo
                              schemeName:
                                project.name ||
                                project.projectName ||
                                project.schemeName, // Store name
                            }));
                            setSchemeSearchQuery("");
                            setActiveSchemeDropdown(false);
                          }}
                          className="dropdown-item"
                          style={{
                            padding: "10px",
                            cursor: "pointer",
                            borderBottom: "1px solid #eee",
                          }}
                        >
                          {project.name ||
                            project.projectName ||
                            project.schemeName}
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: "10px", color: "#999" }}>
                        No schemes found
                      </div>
                    )}
                  </div>
                )}
                {activeSchemeDropdown && (
                  <div
                    className="overlay"
                    onClick={() => setActiveSchemeDropdown(false)}
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 999,
                    }}
                  />
                )}
                {errors.schemeNo && (
                  <span className="error">{errors.schemeNo}</span>
                )}
              </div>

              {/* Application ID - COMMENTED OUT 
              <div className="input-field">
                <label>Application ID</label>
                <input
                  type="text"
                  name="idNo"
                  value={formData.idNo || "Auto-Generated"}
                  disabled
                  style={{ backgroundColor: "#f9fafb", cursor: "not-allowed" }}
                />
              </div>
              */}
            </div>
            <div className="grid-2">
              <div className="input-field">
                <label>Plot Number</label>
                <input
                  type="text"
                  name="plotNo"
                  value={formData.plotNo || ""}
                  onChange={handleChange}
                />
                {errors.plotNo && (
                  <span className="error">{errors.plotNo}</span>
                )}
              </div>
              <div className="input-field">
                <label>Booking Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date || ""}
                  onChange={handleChange}
                />
                {errors.date && <span className="error">{errors.date}</span>}
              </div>
            </div>

            {/* Customer Info */}
            <div className="grid-2">
              <div className="input-field">
                <label>
                  Customer Name<span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="nameOfCustomer"
                  value={formData.nameOfCustomer || ""}
                  onChange={handleChange}
                />
                {errors.nameOfCustomer && (
                  <span className="error">{errors.nameOfCustomer}</span>
                )}
              </div>
              <div className="input-field">
                <label>
                  Mobile Number<span className="required">*</span>
                </label>
                <input
                  type="tel"
                  name="mobileNo"
                  value={formData.mobileNo || ""}
                  onChange={handleChange}
                />
                {errors.mobileNo && (
                  <span className="error">{errors.mobileNo}</span>
                )}
              </div>
            </div>

            <div className="input-field">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            {/* Introducer Info - COMMENTED OUT */}
            {/* 
            <div className="grid-2">
              <div className="input-field">
                <label>Introducer Name</label>
                <input
                  type="text"
                  name="introducerName"
                  value={formData.introducerName || ""}
                  onChange={handleChange}
                />
                {errors.introducerName && <span className="error">{errors.introducerName}</span>}
              </div>
              <div className="input-field">
                <label>Introducer Mobile</label>
                <input
                  type="tel"
                  name="introducerMobileNo"
                  value={formData.introducerMobileNo || ""}
                  onChange={handleChange}
                />
                {errors.introducerMobileNo && <span className="error">{errors.introducerMobileNo}</span>}
              </div>
            </div>
            */}

            <div className="input-field">
              <label>Gender</label>
              <div>
                {["Male", "Female", "Other"].map((g) => (
                  <label key={g}>
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={formData.gender === g}
                      onChange={handleChange}
                    />
                    {g}
                  </label>
                ))}
              </div>
              {errors.gender && <span className="error">{errors.gender}</span>}
            </div>

            <div className="input-field">
              <label>
                Address<span className="required">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
              />
              {errors.address && (
                <span className="error">{errors.address}</span>
              )}
            </div>

            <div className="input-field">
              <label>Project Area</label>
              <input
                type="text"
                name="projectArea"
                value={formData.projectArea || ""}
                onChange={handleChange}
              />
              {errors.projectArea && (
                <span className="error">{errors.projectArea}</span>
              )}
            </div>

            {/* NEW DD Section */}
            <div className="grid-2">
              {/* DD Name Dropdown */}
              <div className="input-field" style={{ position: "relative" }}>
                <label>
                  DD Name <span style={{ color: "red" }}>*</span>
                </label>
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="text"
                    name="ddName"
                    placeholder={isLoadingDD ? "Loading..." : "Search DD"}
                    value={formData.ddName || ddSearchQuery || ""}
                    onChange={(e) => {
                      setDdSearchQuery(e.target.value);
                      setFormData((prev) => ({ ...prev, ddName: "" }));
                      setActiveDdDropdown(true);
                    }}
                    onFocus={() => {
                      setActiveDdDropdown(true);
                      setDdSearchQuery("");
                    }}
                    disabled={isLoadingDD}
                    style={{ paddingRight: "40px", width: "100%" }}
                  />
                  {formData.ddId && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          ddId: "",
                          ddName: "",
                          ddMobile: "",
                        }));
                        setDdSearchQuery("");
                      }}
                      style={{
                        position: "absolute",
                        right: "8px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "#e5e7eb",
                        border: "none",
                        borderRadius: "50%",
                        width: "22px",
                        height: "22px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      ✖
                    </button>
                  )}
                </div>

                {/* Dropdown List */}
                {activeDdDropdown && !isLoadingDD && (
                  <div
                    className="dropdown-list"
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      maxHeight: "200px",
                      overflowY: "auto",
                      backgroundColor: "white",
                      border: "1px solid #ddd",
                      zIndex: 1000,
                    }}
                  >
                    {filteredDdList.length > 0 ? (
                      filteredDdList.map((dd) => (
                        <div
                          key={dd._id}
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              ddId: dd._id,
                              ddName: dd.name,
                              ddMobile: dd.phone || "",
                            }));
                            setDdSearchQuery("");
                            setActiveDdDropdown(false);
                          }}
                          className="dropdown-item"
                          style={{
                            padding: "10px",
                            cursor: "pointer",
                            borderBottom: "1px solid #eee",
                          }}
                        >
                          <div style={{ fontWeight: "500" }}>{dd.name}</div>
                          <div style={{ fontSize: "0.85rem", color: "#666" }}>
                            {dd.phone}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: "10px", color: "#999" }}>
                        No DD found
                      </div>
                    )}
                  </div>
                )}
                {activeDdDropdown && (
                  <div
                    className="overlay"
                    onClick={() => setActiveDdDropdown(false)}
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 999,
                    }}
                  />
                )}
                {errors.ddId && <span className="error">{errors.ddId}</span>}
              </div>

              {/* DD Mobile */}
              <div className="input-field">
                <label>
                  DD Mobile <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="tel"
                  name="ddMobile"
                  value={formData.ddMobile || ""}
                  disabled
                  style={{ backgroundColor: "#f3f4f6", cursor: "not-allowed" }}
                  placeholder="Auto-filled"
                />
              </div>
            </div>

            {/* NEW CED Section */}
            <div className="grid-2">
              {/* CED Name Dropdown */}
              <div className="input-field" style={{ position: "relative" }}>
                <label>CED Name</label>
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="text"
                    name="cedName"
                    placeholder={isLoadingCED ? "Loading..." : "Search CED"}
                    value={formData.cedName || cedSearchQuery || ""}
                    // Logic: show selected name if exists, else show query
                    // User snippet uses: formData.cedId ? (cedList.find...) : query
                    // I will adapt to use formData.cedName if set, simplified.
                    onChange={(e) => {
                      setCedSearchQuery(e.target.value);
                      setFormData((prev) => ({ ...prev, cedName: "" })); // Clear selected on type
                      setActiveCedDropdown(true);
                    }}
                    onFocus={() => {
                      setActiveCedDropdown(true);
                      setCedSearchQuery("");
                    }}
                    disabled={isLoadingCED}
                    style={{ paddingRight: "40px", width: "100%" }}
                  />
                  {formData.cedId && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          cedId: "",
                          cedName: "",
                          cedMobile: "",
                        }));
                        setCedSearchQuery("");
                      }}
                      style={{
                        position: "absolute",
                        right: "8px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "#e5e7eb",
                        border: "none",
                        borderRadius: "50%",
                        width: "22px",
                        height: "22px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      ✖
                    </button>
                  )}
                </div>

                {/* Dropdown List */}
                {activeCedDropdown && !isLoadingCED && (
                  <div
                    className="dropdown-list"
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      maxHeight: "200px",
                      overflowY: "auto",
                      backgroundColor: "white",
                      border: "1px solid #ddd",
                      zIndex: 1000,
                    }}
                  >
                    {filteredCedList.length > 0 ? (
                      filteredCedList.map((ced) => (
                        <div
                          key={ced._id}
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              cedId: ced._id,
                              cedName: ced.name,
                              cedMobile: ced.phone || "",
                            }));
                            setCedSearchQuery("");
                            setActiveCedDropdown(false);
                          }}
                          className="dropdown-item"
                          style={{
                            padding: "10px",
                            cursor: "pointer",
                            borderBottom: "1px solid #eee",
                          }}
                        >
                          <div style={{ fontWeight: "500" }}>{ced.name}</div>
                          <div style={{ fontSize: "0.85rem", color: "#666" }}>
                            {ced.phone}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: "10px", color: "#999" }}>
                        No CED found
                      </div>
                    )}
                  </div>
                )}
                {activeCedDropdown && (
                  <div
                    className="overlay"
                    onClick={() => setActiveCedDropdown(false)}
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 999,
                    }}
                  />
                )}
                {errors.cedId && <span className="error">{errors.cedId}</span>}
              </div>

              {/* CED Mobile */}
              <div className="input-field">
                <label>CED Mobile</label>
                <input
                  type="tel"
                  name="cedMobile"
                  value={formData.cedMobile || ""}
                  disabled
                  style={{ backgroundColor: "#f3f4f6", cursor: "not-allowed" }}
                  placeholder="Auto-filled"
                />
              </div>
            </div>

            {/* Personal Info Grid */}
            <div className="grid-2">
              <div className="input-field">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob || ""}
                  onChange={handleChange}
                />
                {errors.dob && <span className="error">{errors.dob}</span>}
              </div>
              <div className="input-field">
                <label>Nationality</label>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality || ""}
                  onChange={handleChange}
                />
                {errors.nationality && (
                  <span className="error">{errors.nationality}</span>
                )}
              </div>
            </div>

            {/* Photo Upload - COMMENTED OUT 
            <div className="input-field">
              <label>Passport Size Photo</label>
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleChange}
              />
              {formData.photo && (
                <div className="photo-preview">
                  <img
                    src={URL.createObjectURL(formData.photo)}
                    alt="Passport Preview"
                    className="preview-img"
                  />
                </div>
              )}
              {errors.photo && <span className="error">{errors.photo}</span>}
            </div>
            */}

            <div className="grid-2">
              <div className="input-field">
                <label>Occupation</label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation || ""}
                  onChange={handleChange}
                />
                {errors.occupation && (
                  <span className="error">{errors.occupation}</span>
                )}
              </div>
              <div className="input-field">
                <label>Qualification</label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification || ""}
                  onChange={handleChange}
                />
                {errors.qualification && (
                  <span className="error">{errors.qualification}</span>
                )}
              </div>
            </div>

            <div className="input-field">
              <label>Plan Number</label>
              <input
                type="text"
                name="planNo"
                value={formData.planNo || ""}
                onChange={handleChange}
              />
              {errors.planNo && <span className="error">{errors.planNo}</span>}
            </div>

            {/* Contact Info */}
            <div className="input-field">
              <label>Communication Address</label>
              <textarea
                name="communicationAddress"
                value={formData.communicationAddress || ""}
                onChange={handleChange}
              />
              {errors.communicationAddress && (
                <span className="error">{errors.communicationAddress}</span>
              )}
            </div>

            <div className="input-field">
              <label>Pincode</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode || ""}
                onChange={handleChange}
              />
              {errors.pincode && (
                <span className="error">{errors.pincode}</span>
              )}
            </div>

            {/* Family & Nominee */}
            <div className="grid-2">
              <div className="input-field">
                <label>Father / Husband Name</label>
                <input
                  type="text"
                  name="fatherOrHusbandName"
                  value={formData.fatherOrHusbandName || ""}
                  onChange={handleChange}
                />
                {errors.fatherOrHusbandName && (
                  <span className="error">{errors.fatherOrHusbandName}</span>
                )}
              </div>
              <div className="input-field">
                <label>Mother's Name</label>
                <input
                  type="text"
                  name="motherName"
                  value={formData.motherName || ""}
                  onChange={handleChange}
                />
                {errors.motherName && (
                  <span className="error">{errors.motherName}</span>
                )}
              </div>
            </div>

            <div className="grid-2">
              <div className="input-field">
                <label>Nominee Name</label>
                <input
                  type="text"
                  name="nomineeName"
                  value={formData.nomineeName || ""}
                  onChange={handleChange}
                />
                {errors.nomineeName && (
                  <span className="error">{errors.nomineeName}</span>
                )}
              </div>
              <div className="input-field">
                <label>Nominee Age</label>
                <input
                  type="number"
                  name="nomineeAge"
                  value={formData.nomineeAge || ""}
                  onChange={handleChange}
                />
                {errors.nomineeAge && (
                  <span className="error">{errors.nomineeAge}</span>
                )}
              </div>
            </div>

            <div className="grid-2">
              <div className="input-field">
                <label>Nominee Relationship</label>
                <input
                  type="text"
                  name="nomineeRelationship"
                  value={formData.nomineeRelationship || ""}
                  onChange={handleChange}
                />
                {errors.nomineeRelationship && (
                  <span className="error">{errors.nomineeRelationship}</span>
                )}
              </div>
              <div className="input-field">
                <label>Guardian Name</label>
                <input
                  type="text"
                  name="nameOfGuardian"
                  value={formData.nameOfGuardian || ""}
                  onChange={handleChange}
                />
                {errors.nameOfGuardian && (
                  <span className="error">{errors.nameOfGuardian}</span>
                )}
              </div>
            </div>

            {/* Address & Relationships */}
            <div className="grid-2">
              <div className="input-field">
                <label>S/O, W/O, D/O</label>
                <input
                  type="text"
                  name="so_wf_do"
                  value={formData.so_wf_do || ""}
                  onChange={handleChange}
                />
                {errors.so_wf_do && (
                  <span className="error">{errors.so_wf_do}</span>
                )}
              </div>
              <div className="input-field">
                <label>Relationship With Customer</label>
                <input
                  type="text"
                  name="relationshipWithCustomer"
                  value={formData.relationshipWithCustomer || ""}
                  onChange={handleChange}
                />
                {errors.relationshipWithCustomer && (
                  <span className="error">
                    {errors.relationshipWithCustomer}
                  </span>
                )}
              </div>
            </div>

            <div className="input-field">
              <label>IMM Supervisor Name</label>
              <input
                type="text"
                name="immSupervisorName"
                value={formData.immSupervisorName || ""}
                onChange={handleChange}
              />
              {errors.immSupervisorName && (
                <span className="error">{errors.immSupervisorName}</span>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="form-footer">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`submit-button ${isSubmitting ? "submitting" : ""}`}
            >
              {isSubmitting ? "Processing..." : "Submit Plot Booking"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="app-footer">
          <p>
            © {new Date().getFullYear()} Life Housing & Properties. All rights
            reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
