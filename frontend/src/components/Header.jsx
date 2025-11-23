import { Avatar, Button, Menu, Group, Container } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {   FaCheckCircle, FaUser } from "react-icons/fa";
import { IoExitOutline, IoKeySharp, IoLocation } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { SERVER_BASE_URL, USER_API_END_POINT } from "../utils/constant";
import { setUser } from "../store/userSlice";
import axios from "axios";

const Header = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    const res = await axios.get(`${USER_API_END_POINT}/logout`);
    if (res.data.success) {
      dispatch(setUser(null));
      localStorage.removeItem("user");
      notifications.show({
        title: "Logout Successfully",
        message: "Redirecting to the Home page...",
        icon: <FaCheckCircle />,
        color: "teal",
        withBorder: true,
        className: "!border-green-500",
      });
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } else {
      notifications.show({
        title: "Login Failed",
        message:
          res.data.message || "Invalid credentials or something went wrong.",
        color: "red",
        withBorder: true,
        className: "!border-red-500",
      });
    }
  };
  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <Container size="lg" className="py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-primary">
          Nepal Heritage
        </Link>
        <Group gap="md">
          <Link
            to="/"
            className="text-gray-600 hover:text-primary text-lg font-semibold"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-gray-600 hover:text-primary text-lg font-semibold"
          >
            About
          </Link>
          <Link
            to="/places"
            className="text-gray-600 hover:text-primary text-lg font-semibold"
          >
            Explore
          </Link>
        </Group>

        <Group gap="md">
          {user ? (
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <Group gap="xs" className="cursor-pointer">
                  <Avatar src={`${SERVER_BASE_URL}/uploads/profile-pic/${user.profilePic}`}
                  radius="xl" size="sm" />
                  <span className="hidden sm:inline text-lg capitalize">
                    {user.fullname}
                  </span>
                </Group>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  component={Link}
                  rightSection={<FaUser />}
                  to="/user/profile"
                >
                  Profile
                </Menu.Item>
                <Menu.Item
                  component={Link}
                  rightSection={<IoKeySharp />}
                  to="/change-password"
                >
                  Change Password
                </Menu.Item>

                {
                  user?.role === "admin" &&(
                    <>
                  <Menu.Item
                  component={Link}
                  rightSection={<IoLocation />}
                  to="/add-location"
                >
                  Add Location
                </Menu.Item>
                  <Menu.Item
                  component={Link}
                  rightSection={<IoLocation />}
                  to="admin/location"
                >
                  View the locations
                </Menu.Item>

                </>
                  )
                }
               
                <hr className="text-c"/>
                <Menu.Item
                   rightSection={<IoExitOutline />} onClick={handleLogout} color="red" mt={2}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ) : (
            <Group gap="xs">
              <Button component={Link} to="/login" variant="default" size="xs">
                Login
              </Button>
              <Button component={Link} to="/register" color="purple-heart.5" size="xs">
                Register
              </Button>
            </Group>
          )}
        </Group>
      </Container>
    </header>
  );
};

export default Header;
