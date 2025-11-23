import { useEffect, useState } from "react";
import axios from "axios";
import { setUser as setUserAction } from "../../store/userSlice";   // 👈 rename import
import { Avatar, Button, TextInput, Loader } from "@mantine/core";
import { FaCheckCircle, FaEdit } from "react-icons/fa";
import { notifications } from "@mantine/notifications";
import { useDispatch, useSelector } from "react-redux";
import { SERVER_BASE_URL, USER_API_END_POINT } from "../../utils/constant";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [localUser, setLocalUser] = useState(null);                 // 👈 rename local state
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ fullname: "", email: "", profilePic: "" });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const reduxUser = useSelector((state) => state.user);

  // ----- fetch profile once --------------------------------------------------
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${USER_API_END_POINT}/me`, { withCredentials: true });
        if (res.data.success) {
          setLocalUser(res.data.user);
          setForm(res.data.user);
        }
      } catch (err) {
        console.error("Error fetching profile", err);
      }
    })();
  }, []);

  // ----- update profile ------------------------------------------------------
  const handleUpdate = async () => {
    try {
      const fd = new FormData();
      fd.append("fullname", form.fullname);
      fd.append("email", form.email);
      if (form.profilePic instanceof File) fd.append("profilePic", form.profilePic);

      const res = await axios.post(`${USER_API_END_POINT}/update`, fd, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        // ⬇️ update Redux + localStorage
        dispatch(setUserAction(res.data.user));
        localStorage.setItem("user", JSON.stringify(res.data.user));

        // ⬇️ update local form/UI
        setForm(res.data.user);
        setLocalUser(res.data.user);
        setEdit(false);

        notifications.show({
          title: "Profile Updated",
          message: "Your profile was updated successfully",
          icon: <FaCheckCircle />,
          color: "teal",
        });
      }
    } catch (err) {
      console.error("Profile update failed:", err.message);
    }
  };

  // ----- loading state -------------------------------------------------------
  if (!localUser) {
    return (
      <div className="p-10">
        <Loader />
      </div>
    );
  }

  const profilePicUrl = `${SERVER_BASE_URL}/uploads/profile-pic/${reduxUser.profilePic}`;

  // ----- render --------------------------------------------------------------
  return (
    <div className="max-w-2xl mx-auto p-5">
      <div className="flex items-center gap-6 mb-6">
        <Button
          leftSection={<IoMdArrowRoundBack size={14} />}
          variant="default"
          onClick={() => navigate(-1)}
        >
          Back
        </Button>

        <div>
          <Avatar src={profilePicUrl} size={100} />
          {edit && (
            <input
              type="file"
              accept="image/*"
              className="cursor-pointer mt-2"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) setForm({ ...form, profilePic: file });
              }}
            />
          )}
        </div>
      </div>

      <div className="space-y-4">
        <TextInput
          label="Full Name"
          value={form.fullname}
          readOnly={!edit}
          onChange={(e) => setForm({ ...form, fullname: e.target.value })}
        />
        <TextInput
          label="Email"
          value={form.email}
          readOnly={!edit}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>

      <div className="flex gap-4 mt-6">
        {edit ? (
          <>
            <Button color="teal" onClick={handleUpdate}>
              Save
            </Button>
            <Button variant="outline" onClick={() => setEdit(false)}>
              Cancel
            </Button>
          </>
        ) : (
          <Button leftSection={<FaEdit />} onClick={() => setEdit(true)}>
            Edit Profile
          </Button>
        )}
      </div>
    </div>
  );
};

export default Profile;
