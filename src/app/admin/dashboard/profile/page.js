"use client";

import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebaseClient";

/* ===============================
   IMAGE COMPRESSION (≈ 2MB)
================================ */
const compressImage = (file, maxWidth = 800, quality = 0.75) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = (e) => (img.src = e.target.result);
    reader.onerror = reject;
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => resolve(blob),
        "image/jpeg",
        quality
      );
    };
    reader.readAsDataURL(file);
  });

export default function AdminDashboardProfile() {
  const usersCol = collection(db, "users");
  const credsDoc = doc(db, "loginCredentials", "users");

  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userForm, setUserForm] = useState({});
  const [newUserForm, setNewUserForm] = useState({});
  const [creds, setCreds] = useState({});
  const [uploading, setUploading] = useState(false);
  const [showSection, setShowSection] = useState("users"); // users | add | admin
  const [showAdminCreds, setShowAdminCreds] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  /* ===============================
     LOAD USERS FROM FIRESTORE
  ================================ */
  useEffect(() => {
    const unsub = onSnapshot(usersCol, (snap) => {
      setUsers(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, []);

  /* ===============================
     LOAD LOGIN CREDENTIALS
  ================================ */
  useEffect(() => {
    const loadCreds = async () => {
      const snap = await getDocs(collection(db, "loginCredentials"));
      if (snap.docs.length) setCreds(snap.docs[0].data());
    };
    loadCreds();
  }, []);

  /* ===============================
     HANDLE USER SELECTION
  ================================ */
  const selectUser = (id) => {
    setSelectedUserId(id);
    const user = users.find((u) => u.id === id);
    setUserForm(user || {});
  };

  /* ===============================
     HANDLE CHANGE
  ================================ */
  const handleChange = (formType, field, value) => {
    if (formType === "selected") setUserForm((p) => ({ ...p, [field]: value }));
    if (formType === "new") setNewUserForm((p) => ({ ...p, [field]: value }));
    if (formType === "creds") setCreds((p) => ({ ...p, [field]: value }));
  };

  /* ===============================
     UPLOAD IMAGE
  ================================ */
  const handlePhotoUpload = async (formType, file) => {
    if (!file) return;
    try {
      setUploading(true);
      const compressed = await compressImage(file);
      const imageRef = ref(
        storage,
        `profile/${formType === "selected" ? selectedUserId : newUserForm.username}.jpg`
      );
      await uploadBytes(imageRef, compressed);
      const url = await getDownloadURL(imageRef);
      handleChange(formType, "photo", url);
    } catch (err) {
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* ===============================
     SAVE SELECTED USER
  ================================ */
  const saveUser = async () => {
    if (!selectedUserId) return alert("Select a user first");
    await setDoc(doc(db, "users", selectedUserId), {
      ...userForm,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    alert("User updated");
  };

  /* ===============================
     ADD NEW USER
  ================================ */
  const addUser = async () => {
    if (!newUserForm.username) return alert("Enter a username for new user");
    await setDoc(doc(db, "users", newUserForm.username), {
      ...newUserForm,
      createdAt: serverTimestamp(),
    });
    setNewUserForm({});
    alert("User added");
  };

  /* ===============================
     DELETE USER
  ================================ */
  const deleteUser = async () => {
    if (!selectedUserId) return alert("Select a user first");
    if (!confirm("Are you sure you want to delete this user?")) return;
    await deleteDoc(doc(db, "users", selectedUserId));
    setSelectedUserId(null);
    setUserForm({});
    alert("User deleted");
  };

  /* ===============================
     SAVE LOGIN CREDENTIALS
  ================================ */
  const saveCreds = async () => {
    await setDoc(credsDoc, creds, { merge: true });
    alert("Login credentials updated");
  };

  return (
    <div className="p-4 space-y-6">

      {/* ===== TOP BUTTONS ===== */}
      <div className="flex gap-2 items-center justify-center">
        <button onClick={() => setShowSection("users")} className="text-base  font-semibold bg-blue-900 text-white px-4 py-2 rounded  hover:bg-gray-400 transition">Users</button>
        <button onClick={() => setShowSection("add")} className="text-base  font-semibold bg-blue-900 text-white px-4 py-2 rounded  hover:bg-gray-400 transition">Add User</button>
        <button onClick={() => setShowSection("admin")} className="text-base  font-semibold bg-blue-900 text-white px-4 py-2 rounded  hover:bg-gray-400 transition">Admin</button>
      </div>

      {/* ===== USERS SECTION ===== */}
      {showSection === "users" && (
        <div className="border rounded p-4 space-y-4">

          {/* USER DROPDOWN */}
          <div className="relative">
            <button className="bg-slate-950 mb-2 text-white w-full border p-2 flex items-center justify-between" onClick={() => setDropdownOpen(!dropdownOpen)}>
              {selectedUserId ? users.find(u => u.id === selectedUserId)?.fullName : "Select a user"}
            </button>
            {dropdownOpen && (
              <ul className="absolute w-full border bg-slate-950 text-white max-h-60 overflow-y-auto z-10">
                {users.map(u => (
                  <li key={u.id} className="flex items-center gap-2 p-2 bg-gray-300 text-black hover:bg-gray-100 cursor-pointer"
                      onClick={() => { selectUser(u.id); setDropdownOpen(false); }}>
                    {u.photo && <img src={u.photo} className="w-8 h-8 rounded-full" />}
                    <span>{u.fullName || u.userUsername}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* USER FORM */}
          {selectedUserId && (
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <Input label="Full Name" value={userForm.fullName} onChange={(v) => handleChange("selected", "fullName", v)} />
              <Input label="Email" value={userForm.email} onChange={(v) => handleChange("selected", "email", v)} />
              <Input label="Phone" value={userForm.phone} onChange={(v) => handleChange("selected", "phone", v)} />
              <Input label="Date of Birth" value={userForm.dob} onChange={(v) => handleChange("selected", "dob", v)} />
              <Input label="Business Type" value={userForm.businessType} onChange={(v) => handleChange("selected", "businessType", v)} />
              <Input label="Address" value={userForm.address} onChange={(v) => handleChange("selected", "address", v)} />
              <Input label="Username" value={userForm.userUsername} onChange={(v) => handleChange("selected", "userUsername", v)} />
              <Input label="Password" value={userForm.userPassword} onChange={(v) => handleChange("selected", "userPassword", v)} />
              <PhotoUpload photo={userForm.photo} uploading={uploading} onUpload={(file) => handlePhotoUpload("selected", file)} />
              <div className="flex gap-2 col-span-2 mt-4 justify-between">
                <button onClick={saveUser} className="bg-blue-900 hover:bg-blue-950 transition text-white px-4 py-2 rounded">Update</button>
                <button onClick={deleteUser} className="bg-red-900 hover:bg-red-950 transition text-white px-4 py-2 rounded">Delete</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== ADD NEW USER ===== */}
      {showSection === "add" && (
        <div className="border rounded p-4 space-y-4">
          <h3 className="font-bold">Add New User</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Full Name" value={newUserForm.fullName} onChange={(v) => handleChange("new", "fullName", v)} />
            <Input label="Email" value={newUserForm.email} onChange={(v) => handleChange("new", "email", v)} />
            <Input label="Phone" value={newUserForm.phone} onChange={(v) => handleChange("new", "phone", v)} />
            <Input label="Date of Birth" value={newUserForm.dob} onChange={(v) => handleChange("new", "dob", v)} />
            <Input label="Business Type" value={newUserForm.businessType} onChange={(v) => handleChange("new", "businessType", v)} />
            <Input label="Address" value={newUserForm.address} onChange={(v) => handleChange("new", "address", v)} />
            <Input label="Username" value={newUserForm.username} onChange={(v) => handleChange("new", "username", v)} />
            <Input label="Password" value={newUserForm.password} onChange={(v) => handleChange("new", "password", v)} />
            <PhotoUpload photo={newUserForm.photo} uploading={uploading} onUpload={(file) => handlePhotoUpload("new", file)} />
          </div>
          <button onClick={addUser} className="bg-green-900 text-white px-4 py-2 rounded mt-4">Add User</button>
        </div>
      )}

      {/* ===== ADMIN CREDENTIALS ===== */}
      {showSection === "admin" && (
        <div className="border rounded p-4 space-y-4">
          <button onClick={() => setShowAdminCreds(!showAdminCreds)} className="bg-gray-900 text-white px-4 py-2 rounded border">
            {showAdminCreds ? "Hide Admin Credentials" : "Show Admin Credentials"}
          </button>
          {showAdminCreds && (
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <Input label="Admin Username" value={creds.adminUsername} onChange={(v) => handleChange("creds", "adminUsername", v)} />
              <Input label="Admin Password" value={creds.adminPassword} onChange={(v) => handleChange("creds", "adminPassword", v)} />
              <button onClick={saveCreds} className="bg-blue-900 text-white px-4 py-2 rounded col-span-2">Save Credentials</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ===============================
   REUSABLE COMPONENTS
================================ */
function Input({ label, value, onChange }) {
  return (
    <div>
      <p className="text-xs text-gray-300 mb-2">{label}</p>
      <input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border rounded text-sm"
      />
    </div>
  );
}

function PhotoUpload({ photo, uploading, onUpload }) {
  return (
    <div>
      <p className="text-xs text-gray-300 mb-2">Profile Photo</p>
      {photo && <img src={photo} className="w-24 h-24 rounded-full border mb-2 " />}
      <input type="file" accept="image/*" onChange={(e) => onUpload(e.target.files[0])} className="w-full p-2"/>
      {uploading && <p className="text-xs text-gray-200 mt-1">Uploading…</p>}
    </div>
  );
}
