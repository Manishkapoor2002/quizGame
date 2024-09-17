import React, { useEffect } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  MenuItem,
  Toolbar,
  Typography,
  Divider,
  Drawer,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useRecoilState } from "recoil";
import { authState, userState } from "../store/userAtom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { userStateType } from "../global/types";

const Navbar = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useRecoilState(authState);
  const [currentUserState, setcurrentUserState] =
    useRecoilState<userStateType | null>(userState);

  const [open, setOpen] = React.useState(false);

  const toggleDrawer =
    (newOpen: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setOpen(newOpen);
    };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const result = await axios.get("http://localhost:3000/user/me", {
          headers: {
            authentication: localStorage.getItem("token"),
          },
        });

        if (result.data.message === "Logged in") {
          setAuth(true);
          setcurrentUserState({
            userId: result.data.userId,
            profilePicture: result.data.profilePicture,
            username: result.data.username,
            isPremiumUser: result.data.isPremiumUser,
            email:result.data.email
          });
        } else {
          setAuth(false);
        }
      } catch (err) {
        console.log("Something went wrong", err);
        setAuth(false);
      }
    };

    fetchUserData();
  }, []);

  const sharedStyles = {
    borderRadius: "80px",
    transition: "background 0.3s ease",
    ":hover": {
      background: "#efefef",
      borderRadius: "80px",
    },
  };

  const renderMenuItems = () => (
    <>
      {["Home", "Premium"].map((text) => (
        <Typography
          key={text}
          component="h6"
          variant="h6"
          sx={{ color: "black", cursor: "pointer", padding: "8px 16px", ...sharedStyles }}
          onClick={() => navigate(`/${text.toLowerCase().replace(/\s+/g, "")}`)}
        >
          {text}
        </Typography>
      ))}
    </>
  );

  return (
    <div>
      <AppBar
        position="fixed"
        sx={{
          boxShadow: 0,
          bgcolor: "transparent",
          backgroundImage: "none",
          mt: 2,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            variant="regular"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
              borderRadius: "999px",
              backdropFilter: "blur(5px)",
              maxHeight: 40,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography
              component="h5"
              variant="h5"
              sx={{
                color: "#3795BD",
                fontWeight: "bold",
                cursor: "pointer",
                padding: "8px 16px",
                borderRadius: "8px",
                transition: "background 0.3s ease",
              }}
              onClick={() => navigate("/home")}
            >
              MindMingle
            </Typography>

            {/* Large screen size */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
                py: 2,
              }}
            >
              {renderMenuItems()}
            </Box>

            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
                py: 2,
              }}
            >
              {auth ? (
                <>
                  <div onClick={() => {
                    navigate(`/profile/${currentUserState?.username}`)
                  }}>
                    <img
                      src={currentUserState?.profilePicture}
                      alt="Profile Picture"
                      style={{ borderRadius: "50%", width: "40px", height: "40px", cursor: "pointer" }}
                    />
                  </div>
                  <Button
                    color="primary"
                    variant="contained"
                    size="small"
                    sx={{
                      borderRadius: "80px",
                      transition: "background 0.3s ease",
                      ":hover": {
                        color: 'black',
                        fontWeight: 'bold',
                        background: "#efefef",
                        borderRadius: "80px",
                      },
                    }}
                    onClick={() => {
                      setAuth(false)
                      setcurrentUserState(null)
                      localStorage.setItem("token", "")
                      localStorage.setItem("userId", "");
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    color="primary"
                    variant="contained"
                    size="small"
                    sx={sharedStyles}
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </Button>
                  <Button
                    color="primary"
                    variant="contained"
                    size="small"
                    sx={sharedStyles}
                    onClick={() => navigate("/signup")}
                  >
                    Signup
                  </Button>
                </>
              )}
            </Box>

            {/* Smaller screen size */}
            <Box sx={{ display: { sm: "", md: "none" } }}>
              <Button
                variant="text"
                color="primary"
                aria-label="menu"
                sx={{ minWidth: "30px", p: "4px" }}
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </Button>
              <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
                <Box
                  sx={{
                    minWidth: "60dvw",
                    p: 2,
                    backgroundColor: "background.paper",
                    flexGrow: 1,
                  }}
                  onClick={toggleDrawer(false)}
                  onKeyDown={toggleDrawer(false)}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "end",
                      flexGrow: 1,
                    }}
                  >
                    {renderMenuItems()}
                    <Divider />
                    {auth ? (
                      <MenuItem>
                        <Button
                          color="primary"
                          variant="contained"
                          sx={{ width: "100%", ...sharedStyles }}
                          onClick={() => {
                            setAuth(false)
                            setcurrentUserState(null)
                            localStorage.setItem("token", "")
                            localStorage.setItem("userId", "");

                          }}
                        >
                          Logout
                        </Button>
                      </MenuItem>
                    ) : (
                      <>
                        <MenuItem>
                          <Button
                            color="primary"
                            variant="contained"
                            sx={{ width: "100%", ...sharedStyles }}
                            onClick={() => navigate("/login")}
                          >
                            Login
                          </Button>
                        </MenuItem>
                        <MenuItem>
                          <Button
                            color="primary"
                            variant="outlined"
                            sx={{ width: "100%", ...sharedStyles }}
                            onClick={() => navigate("/signup")}
                          >
                            Sign up
                          </Button>
                        </MenuItem>
                      </>
                    )}
                  </Box>
                </Box>
              </Drawer>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
};

export default Navbar;
