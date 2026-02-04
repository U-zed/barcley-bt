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
      canvas.toBlob((blob) => resolve(blob), "image/jpeg", quality);
    };
    reader.readAsDataURL(file);
  });

export default function AdminDashboardProfile() {
  const usersCol = collection(db, "users");

  const [users, setUsers] = useState([]);
  const [selectedUsername, setSelectedUsername] = useState(null);
  const [userForm, setUserForm] = useState({});
  const [newUserForm, setNewUserForm] = useState({});
  const [uploading, setUploading] = useState(false);
  const [showSection, setShowSection] = useState("users"); // users | add
  const [dropdownOpen, setDropdownOpen] = useState(false);

  /* ===============================
     LOAD USERS FROM FIRESTORE
  ================================ */
  useEffect(() => {
    const unsub = onSnapshot(usersCol, (snap) => {
      setUsers(snap.docs.map((doc) => ({ username: doc.id, ...doc.data() })));
    });
    return unsub;
  }, []);

  /* ===============================
     HANDLE USER SELECTION
  ================================ */
  const selectUser = (username) => {
    setSelectedUsername(username);
    const user = users.find((u) => u.username === username);
    setUserForm(user || {});
  };

  /* ===============================
     HANDLE CHANGE
  ================================ */
  const handleChange = (formType, field, value) => {
    if (formType === "selected")
      setUserForm((p) => ({ ...p, [field]: value }));
    if (formType === "new") setNewUserForm((p) => ({ ...p, [field]: value }));
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
        `profile/${formType === "selected" ? selectedUsername : newUserForm.username}.jpg`
      );

      await uploadBytes(imageRef, compressed);
      const url = await getDownloadURL(imageRef);
      handleChange(formType, "photo", url);
    } finally {
      setUploading(false);
    }
  };

  /* ===============================
     SAVE SELECTED USER (USERNAME CANNOT CHANGE)
  ================================ */
  const saveUser = async () => {
    if (!selectedUsername) return alert("Select a user first");

    const { username, ...rest } = userForm; // username is not updated
    await setDoc(
      doc(db, "users", selectedUsername),
      {
        ...rest,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    alert("User updated");
  };

  /* ===============================
     ADD NEW USER (USERNAME AS DOC ID)
  ================================ */
  const addUser = async () => {
    if (!newUserForm.username) return alert("Enter a username");

    await setDoc(doc(db, "users", newUserForm.username), {
      ...newUserForm,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    setNewUserForm({});
    alert("User added");
  };

  /* ===============================
     DELETE USER
  ================================ */
  const deleteUser = async () => {
    if (!selectedUsername) return alert("Select a user first");
    if (!confirm("Are you sure?")) return;

    await deleteDoc(doc(db, "users", selectedUsername));

    setSelectedUsername(null);
    setUserForm({});
    alert("User deleted");
  };

  return (
    <div className="p-4 space-y-6">
      {/* ===== TOP BUTTONS ===== */}
      <div className="flex gap-2 items-center justify-center">
        <button
          onClick={() => setShowSection("users")}
          className="text-base font-semibold bg-blue-900 text-white px-4 py-2 rounded hover:bg-gray-400 transition"
        >
          Users
        </button>
        <button
          onClick={() => setShowSection("add")}
          className="text-base font-semibold bg-blue-900 text-white px-4 py-2 rounded hover:bg-gray-400 transition"
        >
          Add User
        </button>
      </div>

      {/* ===== USERS SECTION ===== */}
      {showSection === "users" && (
        <div className="border rounded p-4 space-y-4">
          {/* USER DROPDOWN */}
          <div className="relative">
            <button
              className="bg-slate-950 mb-2 text-white w-full border p-2 flex items-center justify-between"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {selectedUsername
                ? users.find((u) => u.username === selectedUsername)?.fullName
                : "Select a user"}
            </button>
            {dropdownOpen && (
              <ul className="absolute w-full border bg-slate-950 text-white max-h-60 overflow-y-auto z-10">
                {users.map((u) => (
                  <li
                    key={u.username}
                    className="flex items-center gap-2 p-2 bg-gray-300 text-black hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      selectUser(u.username);
                      setDropdownOpen(false);
                    }}
                  >
                    {u.photo && <img src={u.photo} className="w-8 h-8 rounded-full" />}
                    <span>{u.fullName || u.username}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* USER FORM */}
          {selectedUsername && (
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <Input
                label="Full Name"
                value={userForm.fullName}
                onChange={(v) => handleChange("selected", "fullName", v)}
              />
              <Input
                label="Email"
                value={userForm.email}
                onChange={(v) => handleChange("selected", "email", v)}
              />
              <Input
                label="Phone"
                value={userForm.phone}
                onChange={(v) => handleChange("selected", "phone", v)}
              />
              <Input
                label="Date of Birth"
                value={userForm.dob}
                onChange={(v) => handleChange("selected", "dob", v)}
              />
              <Input
                label="Address"
                value={userForm.address}
                onChange={(v) => handleChange("selected", "address", v)}
              />
              <Input
                label="Password"
                value={userForm.password}
                onChange={(v) => handleChange("selected", "password", v)}
              />
              <PhotoUpload
                photo={userForm.photo}
                uploading={uploading}
                onUpload={(file) => handlePhotoUpload("selected", file)}
              />
              <div className="flex gap-2 col-span-2 mt-4 justify-between">
                <button
                  onClick={deleteUser}
                  className="bg-red-900 hover:bg-red-950 transition text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
                <button
                  onClick={saveUser}
                  className="bg-blue-900 hover:bg-blue-950 transition text-white px-4 py-2 rounded"
                >
                  Update
                </button>
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
            <Input
              label="Full Name"
              value={newUserForm.fullName}
              onChange={(v) => handleChange("new", "fullName", v)}
            />
            <Input
              label="Email"
              value={newUserForm.email}
              onChange={(v) => handleChange("new", "email", v)}
            />
            <Input
              label="Phone"
              value={newUserForm.phone}
              onChange={(v) => handleChange("new", "phone", v)}
            />
            <Input
              label="Date of Birth"
              value={newUserForm.dob}
              onChange={(v) => handleChange("new", "dob", v)}
            />
                        <Input
              label="Address"
              value={newUserForm.address}
              onChange={(v) => handleChange("new", "address", v)}
            />
            <p className="text-white"><b className="text-red-600">Note: </b>Username cannot be changed in future</p>
            <Input
              label="Username"
              value={newUserForm.username}
              onChange={(v) => handleChange("new", "username", v)}
            />
            <Input
              label="Password"
              value={newUserForm.password}
              onChange={(v) => handleChange("new", "password", v)}
            />
            <PhotoUpload
              photo={newUserForm.photo}
              uploading={uploading}
              onUpload={(file) => handlePhotoUpload("new", file)}
            />
          </div>
          <button
            onClick={addUser}
            className="bg-green-900 text-white px-4 py-2 rounded mt-4"
          >
            Add User
          </button>
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
      {photo && (
        <img
          src={photo}
          className="w-24 h-24 rounded-full border mb-2"
        />
      )}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => onUpload(e.target.files[0])}
        className="w-full p-2"
      />
      {uploading && <p className="text-xs text-gray-200 mt-1">Uploading…</p>}
    </div>
  );
}
