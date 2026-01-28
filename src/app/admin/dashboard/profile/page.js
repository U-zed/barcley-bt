"use client";

import { useEffect, useState } from "react";
import {
  doc,
  onSnapshot,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebaseClient";
import CredentialsTable from "../components/CredentialsTable";

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

export default function AdminUserProfile() {
  const userRef = doc(db, "users", "mainUser");
  const credsRef = doc(db, "loginCredentials", "users");

  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [creds, setCreds] = useState({});
  const [activeTab, setActiveTab] = useState("view");
  const [uploading, setUploading] = useState(false);
  const [savingCreds, setSavingCreds] = useState(false);

  /* ===============================
     REALTIME USER PROFILE
  ================================ */
  useEffect(() => {
    return onSnapshot(userRef, async (snap) => {
      if (snap.exists()) {
        setUser(snap.data());
        setForm(snap.data());
      } else {
        const init = {
          photo: "",
          fullName: "",
          email: "",
          phone: "",
          dob: "",
          business: {
            registration: "",
            type: "",
            country: "",
          },
          customerId: "",
          status: "",
          account: {
            type: "",
          },
          since: "",
          updatedBy: "system",
          updatedAt: serverTimestamp(),
        };
        await setDoc(userRef, init);
        setUser(init);
        setForm(init);
      }
    });
  }, []);

  /* ===============================
     FETCH LOGIN CREDENTIALS
  ================================ */
  useEffect(() => {
    const loadCreds = async () => {
      const snap = await getDoc(credsRef);
      if (snap.exists()) {
        setCreds(snap.data());
      } else {
        const init = {
          userUsername: "",
          userPassword: "",
          adminUsername: "",
          adminPassword: "",
          updatedAt: serverTimestamp(),
        };
        await setDoc(credsRef, init);
        setCreds(init);
      }
    };
    loadCreds();
  }, []);

  /* ===============================
     FORM HANDLER
  ================================ */
  const handleChange = (path, value) => {
    setForm((prev) => {
      const updated = structuredClone(prev);
      const keys = path.split(".");
      let ref = updated;
      keys.slice(0, -1).forEach((k) => (ref = ref[k] ||= {}));
      ref[keys.at(-1)] = value;
      return updated;
    });
  };

  /* ===============================
     PHOTO UPLOAD
  ================================ */
  const handlePhotoUpload = async (file) => {
    if (!file) return;
    try {
      setUploading(true);
      const compressed = await compressImage(file);
      const imageRef = ref(storage, "profile/mainUser.jpg");
      await uploadBytes(imageRef, compressed);
      const url = await getDownloadURL(imageRef);
      handleChange("photo", url);
    } catch (err) {
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* ===============================
     SAVE PROFILE
  ================================ */
  const handleSave = async () => {
    await setDoc(
      userRef,
      {
        ...form,
        updatedBy: "admin",
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    alert("Profile updated");
  };

  /* ===============================
     SAVE CREDENTIALS
  ================================ */
  const saveCreds = async () => {
    setSavingCreds(true);
    await setDoc(
      credsRef,
      { ...creds, updatedAt: serverTimestamp() },
      { merge: true }
    );
    setSavingCreds(false);
    alert("Credentials updated");
  };

  if (!user) return <p className="p-6">Loading…</p>;

  return (
    <div className="space-y-6 p-4">

      {/* ===== TABS ===== */}
      <div className="flex justify-center gap-3 text-xs">
        {["view", "update", "logs"].map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded font-semibold ${activeTab === t
                ? "bg-slate-300 text-black "
                : "bg-slate-900 text-white"
              }`}
          >
            {t === "view"
              ? "View Info"
              : t === "update"
                ? "Update Info"
                : "Update Logs"}
          </button>
        ))}
      </div>

      {/* ===== VIEW ===== */}
      {activeTab === "view" && (
        <section className="bg-slate-900 rounded border  p-4 text-xs grid grid-cols-2 gap-4">
          <PhotoView src={user.photo} />
          <Info label="Full Name" value={user.fullName} />
          <Info label="Email" value={user.email} />
          <Info label="Phone" value={user.phone} />
          <Info label="Date of Birth" value={user.dob} />
          <Info label="Business Registration" value={user.business?.registration} />
          <Info label="Business Type" value={user.business?.type} />
          <Info label="Country" value={user.business?.country} />
          <Info label="Customer ID" value={user.customerId} />
          <Info label="Status" value={user.status} />
          <Info label="Account Type" value={user.account?.type} />
          <Info label="Member Since" value={user.since} />
        </section>
      )}

      {/* ===== UPDATE ===== */}
      {activeTab === "update" && (
        <section className="bg-slate-900  rounded-md p-6">
          <div className="grid md:grid-cols-2 gap-4 text-xs">

            <PhotoUpload
              photo={form.photo}
              uploading={uploading}
              onUpload={handlePhotoUpload}
            />

            <Input label="Full Name" value={form.fullName} onChange={(v) => handleChange("fullName", v)} />
            <Input label="Email" value={form.email} onChange={(v) => handleChange("email", v)} />
            <Input label="Phone" value={form.phone} onChange={(v) => handleChange("phone", v)} />
            <Input label="Date of Birth" value={form.dob} onChange={(v) => handleChange("dob", v)} />
            <Input label="Business Registration" value={form.business?.registration} onChange={(v) => handleChange("business.registration", v)} />
            <Input label="Business Type" value={form.business?.type} onChange={(v) => handleChange("business.type", v)} />
            <Input label="Country" value={form.business?.country} onChange={(v) => handleChange("business.country", v)} />
            <Input label="Customer ID" value={form.customerId} onChange={(v) => handleChange("customerId", v)} />
            <Input label="Account Status" value={form.status} onChange={(v) => handleChange("status", v)} />
            <Input label="Account Type" value={form.account?.type} onChange={(v) => handleChange("account.type", v)} />
            <Input label="Member Since" value={form.since} onChange={(v) => handleChange("since", v)} />
          </div>

          <div className="w-1/2 mx-auto mt-6">      
             <button
            onClick={handleSave}
            disabled={uploading}
            className=" w-full bg-blue-900 hover:bg-blue-950 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            Save Changes
          </button>
          </div>
        </section>
      )}

      {/* ===== UPDATE LOGS ===== */}
      {activeTab === "logs" && (
        <section className="flex flex-col md:flex-row gap-4 p-2 max-w-md mx-auto ">
          
        <div className="bg-slate-900  rounded-xl space-y-3 p-5">
          <p className="text-gray-400 text-center p-1 text-base font-semibold">Update Guest Access Login</p>
          <Input label="User Username" value={creds.userUsername} onChange={(v) => setCreds({ ...creds, userUsername: v })} />
          <Input label="User Password" value={creds.userPassword} onChange={(v) => setCreds({ ...creds, userPassword: v })} />
          <p className="text-gray-400 text-center p-1 text-base font-semibold">Update Core Account Login</p>
          <Input label="Admin Username" value={creds.adminUsername} onChange={(v) => setCreds({ ...creds, adminUsername: v })} />
          <Input label="Admin Password" value={creds.adminPassword} onChange={(v) => setCreds({ ...creds, adminPassword: v })} />

          <button
            onClick={saveCreds}
            disabled={savingCreds}
            className="w-full mt-4 bg-blue-900 text-white py-2 rounded"
          >
            {savingCreds ? "Saving…" : "Save Credentials"}
          </button>
        </div>

        <div className="bg-slate-900 border  rounded-xl w-full p-4 mx-auto space-y-3">
          <CredentialsTable/>
        </div>
        </section>
      )}
    </div>
  );
}

/* ===============================
   REUSABLE COMPONENTS
================================ */
function Info({ label, value }) {
  return (
    <div>
      <p className="text-gray-400 uppercase text-xs">{label}</p>
      <p className="font-medium text-gray-200 py-2">{value || "—"}</p>
    </div>
  );
}

function Input({ label, value, onChange }) {
  return (
    <div>
      <p className="text-xs text-gray-100 mb-2">{label}</p>
      <input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border rounded text-sm bg-gray-200 text-black"
      />
    </div>
  );
}

function PhotoView({ src }) {
  return (
    <div>
      <p className="text-gray-100  text-xs">Profile Photo</p>
      {src ? (
        <img src={src} className="w-16 h-16 rounded-full border mt-2" />
      ) : (
        <p className="text-gray-100">—</p>
      )}
    </div>
  );
}

function PhotoUpload({ photo, uploading, onUpload }) {
  return (
    <div>
      <p className="text-xs text-gray-100 mb-2">Profile Photo</p>
      {photo && (
        <img src={photo} className="w-16 h-16 rounded-full border mb-2" />
      )}
      <input type="file" accept="image/*" onChange={(e) => onUpload(e.target.files[0])} />
      {uploading && <p className="text-xs text-gray-100 mt-2">Uploading…</p>}
    </div>
  );
}
