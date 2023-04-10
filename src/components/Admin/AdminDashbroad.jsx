import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AdminNavbar from "./AdminNavbar";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardPage from "./DashboardPage";
import Template from "../Template/Template";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PostAddIcon from "@mui/icons-material/PostAdd";
import images from "../../assets/images.png";
import template2 from "../../assets/template2.jpeg";
import template3 from "../../assets/template3.jpeg";
import template5 from "../../assets/template5.jpeg";
import ViewAllTemplates from "./ViewAllTemplates";
import AddTemplate from "./AddTemplate";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

export default function VerticalTabs() {
  const [value, setValue] = React.useState(0);
  const [show, setShow] = React.useState(false);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "background.paper",
          display: "flex",
          height: "100vh",
          overflowY: "scroll",
          marginBottom: "20px",
        }}
      >
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          width="200px"
          onChange={handleChange}
          sx={{
            borderRight: 1,
            borderColor: "divider",
            display: show ? "block" : "none",
          }}
        >
          <Tab
            style={{ width: "200px" }}
            label={
              <img
                src="https://png.pngtree.com/element_our/png/20180918/simple-eagle-logo-png_100655.jpg"
                height="51px"
                width="51px"
              />
            }
            {...a11yProps(0)}
          />
          <Tab label="Dashboard" {...a11yProps(1)} />
          <Tab label="Template" {...a11yProps(2)} />
        </Tabs>
        <div
          style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
          <div>
            <AdminNavbar setShow={setShow} show={show} />
          </div>

          <TabPanel value={value} index={0}></TabPanel>
          <TabPanel value={value} index={1}>
            <DashboardPage />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <ViewAllTemplates />
            {/* <Template
              background={template2}
              title={""}
              subTitle={""}
              name={""}
              comments={""}
              course={"FullStack Devloper"}
              score={"B+"}
              sinature={images}
              date={"23-03-2023"}
            /> */}
            {/* <Template
              background={template3}
              title={""}
              subTitle={""}
              name={""}
              comments={""}
              course={"FullStack Devloper"}
              score={"B+"}
              sinature={images}
              date={"23-03-2023"}
            /> */}
            {/* <Template
              background={template5}
              title={""}
              subTitle={""}
              name={""}
              comments={""}
              course={"FullStack Devloper"}
              score={"B+"}
              sinature={images}
              date={"23-03-2023"}
            /> */}
          </TabPanel>
        </div>
      </Box>
    </>
  );
}
