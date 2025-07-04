// Required dependencies:
// npm install @mui/material @mui/icons-material recharts @emotion/react @emotion/styled

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  useTheme,
  CircularProgress,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  Menu,
  Chip,
  Stack,
  Pagination,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import DownloadIcon from "@mui/icons-material/Download";
import SortIcon from "@mui/icons-material/Sort";
import BarChartIcon from "@mui/icons-material/BarChart";
import { blue, green, orange, purple, red, grey } from "@mui/material/colors";
import sampleData from "./sample.json";
// Static color and category/tag mapping
const techColors = {
  ReactJS: blue[500],
  PostgreSQL: green[500],
  AWS: orange[500],
  Docker: purple[500],
  MongoDB: red[400],
};

const categories = ["Frontend", "Backend", "DevOps", "Database", "Cloud"];
const tagsList = ["Open Source", "Enterprise", "New"];
const techMeta = {
  ReactJS: { category: "Frontend", tags: ["Open Source"] },
  PostgreSQL: { category: "Database", tags: ["Open Source"] },
  AWS: { category: "Cloud", tags: ["Enterprise"] },
  Docker: { category: "DevOps", tags: ["Open Source"] },
  MongoDB: { category: "Database", tags: ["Enterprise", "New"] },
};

export default function TechDashboardV1() {
  const theme = useTheme();
  const [techData, setTechData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("cards");
  const [sortBy, setSortBy] = useState("name");
  const [anchorEl, setAnchorEl] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;
  const open = Boolean(anchorEl);

  useEffect(() => {
    setLoading(false);
    setTechData(sampleData);
    // Replace with actual API
    // fetch("/api/technologies")
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setTechData(data);
    //     setLoading(false);
    //   })
    //   .catch(() => setLoading(false));
  }, []);

  const handleSortChange = (option) => {
    setSortBy(option);
    setAnchorEl(null);
  };

  const handleExport = () => {
    const csv = [
      ["Technology", "Count"],
      ...filteredTech.map((item) => [item.name, item.count]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tech-usage.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredTech = techData
    .filter((item) => {
      const meta = techMeta[item.name] || {};
      const matchSearch = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchUsage =
        filter === "all" ||
        (filter === "high" && item.count >= 80) ||
        (filter === "mid" && item.count >= 40 && item.count < 80) ||
        (filter === "low" && item.count < 40);
      const matchCategory =
        !selectedCategory || meta.category === selectedCategory;
      const matchTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => meta.tags?.includes(tag));
      return matchSearch && matchUsage && matchCategory && matchTags;
    })
    .sort((a, b) =>
      sortBy === "name" ? a.name.localeCompare(b.name) : b.count - a.count
    );

  const pageCount = Math.ceil(filteredTech.length / itemsPerPage);
  const paginatedTech = filteredTech.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Search Technology"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>Filter by Usage</InputLabel>
            <Select
              value={filter}
              label="Filter by Usage"
              onChange={(e) => setFilter(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="high">High (80+)</MenuItem>
              <MenuItem value="mid">Medium (40–79)</MenuItem>
              <MenuItem value="low">Low (&lt;40)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <ToggleButtonGroup
            fullWidth
            exclusive
            value={view}
            onChange={(e, v) => setView(v)}
          >
            <ToggleButton value="cards">Cards</ToggleButton>
            <ToggleButton value="donut">Donut</ToggleButton>
            <ToggleButton value="bar">Bar</ToggleButton>
            <ToggleButton value="line">Line</ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>

      <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
        {categories.map((cat) => (
          <Chip
            key={cat}
            label={cat}
            color={selectedCategory === cat ? "primary" : "default"}
            onClick={() =>
              setSelectedCategory(selectedCategory === cat ? "" : cat)
            }
            sx={{ mb: 1 }}
          />
        ))}
      </Stack>

      <FormGroup row sx={{ mb: 2 }}>
        {tagsList.map((tag) => (
          <FormControlLabel
            key={tag}
            control={
              <Checkbox
                checked={selectedTags.includes(tag)}
                onChange={(e) => {
                  setSelectedTags((prev) =>
                    e.target.checked
                      ? [...prev, tag]
                      : prev.filter((t) => t !== tag)
                  );
                }}
              />
            }
            label={tag}
          />
        ))}
      </FormGroup>

      <Box display="flex" justifyContent="flex-end" mb={1}>
        <IconButton onClick={handleExport} title="Download CSV">
          <DownloadIcon />
        </IconButton>
        <IconButton
          onClick={(e) => setAnchorEl(e.currentTarget)}
          title="Sort Options"
        >
          <SortIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
          <MenuItem onClick={() => handleSortChange("name")}>
            Sort by Name
          </MenuItem>
          <MenuItem onClick={() => handleSortChange("count")}>
            Sort by Count
          </MenuItem>
        </Menu>
      </Box>

      {loading ? (
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : view === "cards" ? (
        <>
          <Grid container sx={{ margin: "auto" }} spacing={2}>
            {paginatedTech.map((tech) => (
              <Grid item xs={12} sm={6} md={4} key={tech.name}>
                <Card
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    margin: "auto",
                    borderRadius: 3,
                    boxShadow: 3,
                    width: 300,
                    backgroundColor:
                      theme.palette.mode === "dark" ? grey[900] : "#fff",
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: techColors[tech.name] || blue[500],
                      color: "white",
                      width: 48,
                      height: 48,
                      fontSize: 24,
                      mr: 2,
                    }}
                  >
                    {tech.icon}
                  </Avatar>
                  <CardContent sx={{ flexGrow: 1, p: 0 }}>
                    <Typography variant="h6">{tech.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {tech.count} uses
                    </Typography>
                  </CardContent>
                  <BarChartIcon color="action" />
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box mt={2} display="flex" justifyContent="center">
            <Pagination
              count={pageCount}
              page={page}
              onChange={(e, val) => setPage(val)}
            />
          </Box>
        </>
      ) : (
        <Box sx={{ height: 400 }}>
          <ResponsiveContainer>
            {view === "donut" ? (
              <PieChart>
                <Pie
                  data={filteredTech}
                  dataKey="count"
                  nameKey="name"
                  label
                  outerRadius={120}
                >
                  {filteredTech.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={techColors[entry.name] || "#8884d8"}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            ) : view === "bar" ? (
              <BarChart data={filteredTech}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#1976d2" />
              </BarChart>
            ) : (
              <LineChart data={filteredTech}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#1976d2"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </Box>
      )}
    </Box>
  );
}



[
  {
    "name": "ReactJS",
    "count": 127,
    "icon": "⚛️",
    "category": "Frontend",
    "tags": ["Open Source"],
    "trend": [
      { "date": "2024-01", "count": 100 },
      { "date": "2024-02", "count": 115 },
      { "date": "2024-03", "count": 127 }
    ]
  },
  {
    "name": "Angular",
    "count": 98,
    "icon": "🅰️",
    "category": "Frontend",
    "tags": ["Enterprise"],
    "trend": [
      { "date": "2024-01", "count": 78 },
      { "date": "2024-02", "count": 90 },
      { "date": "2024-03", "count": 98 }
    ]
  },
  {
    "name": "VueJS",
    "count": 73,
    "icon": "🟢",
    "category": "Frontend",
    "tags": ["Open Source", "New"],
    "trend": [
      { "date": "2024-01", "count": 50 },
      { "date": "2024-02", "count": 65 },
      { "date": "2024-03", "count": 73 }
    ]
  },
  {
    "name": "Svelte",
    "count": 41,
    "icon": "🧡",
    "category": "Frontend",
    "tags": ["New"],
    "trend": [
      { "date": "2024-01", "count": 28 },
      { "date": "2024-02", "count": 34 },
      { "date": "2024-03", "count": 41 }
    ]
  },
  {
    "name": "Next.js",
    "count": 89,
    "icon": "➡️",
    "category": "Frontend",
    "tags": ["Open Source"],
    "trend": [
      { "date": "2024-01", "count": 60 },
      { "date": "2024-02", "count": 75 },
      { "date": "2024-03", "count": 89 }
    ]
  },
  {
    "name": "Node.js",
    "count": 105,
    "icon": "🌲",
    "category": "Backend",
    "tags": ["Open Source"],
    "trend": [
      { "date": "2024-01", "count": 88 },
      { "date": "2024-02", "count": 96 },
      { "date": "2024-03", "count": 105 }
    ]
  },
  {
    "name": "Express",
    "count": 92,
    "icon": "🚂",
    "category": "Backend",
    "tags": ["Open Source"],
    "trend": [
      { "date": "2024-01", "count": 70 },
      { "date": "2024-02", "count": 85 },
      { "date": "2024-03", "count": 92 }
    ]
  },
  {
    "name": "NestJS",
    "count": 55,
    "icon": "🧬",
    "category": "Backend",
    "tags": ["New"],
    "trend": [
      { "date": "2024-01", "count": 40 },
      { "date": "2024-02", "count": 48 },
      { "date": "2024-03", "count": 55 }
    ]
  },
  {
    "name": "Django",
    "count": 78,
    "icon": "🐍",
    "category": "Backend",
    "tags": ["Open Source"],
    "trend": [
      { "date": "2024-01", "count": 60 },
      { "date": "2024-02", "count": 68 },
      { "date": "2024-03", "count": 78 }
    ]
  },
  {
    "name": "Flask",
    "count": 47,
    "icon": "🧪",
    "category": "Backend",
    "tags": ["Open Source"],
    "trend": [
      { "date": "2024-01", "count": 35 },
      { "date": "2024-02", "count": 42 },
      { "date": "2024-03", "count": 47 }
    ]
  },
  {
    "name": "Spring Boot",
    "count": 94,
    "icon": "🌱",
    "category": "Backend",
    "tags": ["Enterprise"],
    "trend": [
      { "date": "2024-01", "count": 70 },
      { "date": "2024-02", "count": 83 },
      { "date": "2024-03", "count": 94 }
    ]
  },
  {
    "name": "Laravel",
    "count": 63,
    "icon": "📕",
    "category": "Backend",
    "tags": ["Open Source"],
    "trend": [
      { "date": "2024-01", "count": 48 },
      { "date": "2024-02", "count": 58 },
      { "date": "2024-03", "count": 63 }
    ]
  },
  {
    "name": "MongoDB",
    "count": 73,
    "icon": "🍃",
    "category": "Database",
    "tags": ["Enterprise", "New"],
    "trend": [
      { "date": "2024-01", "count": 55 },
      { "date": "2024-02", "count": 65 },
      { "date": "2024-03", "count": 73 }
    ]
  },
  {
    "name": "PostgreSQL",
    "count": 89,
    "icon": "🐘",
    "category": "Database",
    "tags": ["Open Source"],
    "trend": [
      { "date": "2024-01", "count": 55 },
      { "date": "2024-02", "count": 72 },
      { "date": "2024-03", "count": 89 }
    ]
  },
  {
    "name": "MySQL",
    "count": 102,
    "icon": "🐬",
    "category": "Database",
    "tags": ["Enterprise"],
    "trend": [
      { "date": "2024-01", "count": 88 },
      { "date": "2024-02", "count": 96 },
      { "date": "2024-03", "count": 102 }
    ]
  },
  {
    "name": "Redis",
    "count": 65,
    "icon": "🔴",
    "category": "Database",
    "tags": ["Open Source"],
    "trend": [
      { "date": "2024-01", "count": 50 },
      { "date": "2024-02", "count": 58 },
      { "date": "2024-03", "count": 65 }
    ]
  },
  {
    "name": "AWS",
    "count": 45,
    "icon": "☁️",
    "category": "Cloud",
    "tags": ["Enterprise"],
    "trend": [
      { "date": "2024-01", "count": 35 },
      { "date": "2024-02", "count": 38 },
      { "date": "2024-03", "count": 45 }
    ]
  },
  {
    "name": "Azure",
    "count": 52,
    "icon": "🌀",
    "category": "Cloud",
    "tags": ["Enterprise"],
    "trend": [
      { "date": "2024-01", "count": 40 },
      { "date": "2024-02", "count": 48 },
      { "date": "2024-03", "count": 52 }
    ]
  },
  {
    "name": "GCP",
    "count": 38,
    "icon": "🌤️",
    "category": "Cloud",
    "tags": ["Enterprise", "New"],
    "trend": [
      { "date": "2024-01", "count": 22 },
      { "date": "2024-02", "count": 30 },
      { "date": "2024-03", "count": 38 }
    ]
  },
  {
    "name": "Docker",
    "count": 32,
    "icon": "🐳",
    "category": "DevOps",
    "tags": ["Open Source"],
    "trend": [
      { "date": "2024-01", "count": 20 },
      { "date": "2024-02", "count": 26 },
      { "date": "2024-03", "count": 32 }
    ]
  },
  {
    "name": "Kubernetes",
    "count": 54,
    "icon": "☸️",
    "category": "DevOps",
    "tags": ["Open Source", "Enterprise"],
    "trend": [
      { "date": "2024-01", "count": 40 },
      { "date": "2024-02", "count": 48 },
      { "date": "2024-03", "count": 54 }
    ]
  },
  {
    "name": "Jenkins",
    "count": 39,
    "icon": "🔧",
    "category": "DevOps",
    "tags": ["Open Source"],
    "trend": [
      { "date": "2024-01", "count": 28 },
      { "date": "2024-02", "count": 34 },
      { "date": "2024-03", "count": 39 }
    ]
  },
  {
    "name": "Terraform",
    "count": 44,
    "icon": "📦",
    "category": "DevOps",
    "tags": ["Open Source", "New"],
    "trend": [
      { "date": "2024-01", "count": 33 },
      { "date": "2024-02", "count": 39 },
      { "date": "2024-03", "count": 44 }
    ]
  },
  {
    "name": "Git",
    "count": 120,
    "icon": "🔀",
    "category": "DevOps",
    "tags": ["Open Source"],
    "trend": [
      { "date": "2024-01", "count": 100 },
      { "date": "2024-02", "count": 110 },
      { "date": "2024-03", "count": 120 }
    ]
  },
  {
    "name": "GitHub Actions",
    "count": 51,
    "icon": "⚙️",
    "category": "DevOps",
    "tags": ["Open Source"],
    "trend": [
      { "date": "2024-01", "count": 35 },
      { "date": "2024-02", "count": 46 },
      { "date": "2024-03", "count": 51 }
    ]
  },
  {
    "name": "Tailwind CSS",
    "count": 62,
    "icon": "💨",
    "category": "Frontend",
    "tags": ["New", "Open Source"],
    "trend": [
      { "date": "2024-01", "count": 42 },
      { "date": "2024-02", "count": 54 },
      { "date": "2024-03", "count": 62 }
    ]
  },
  {
    "name": "Bootstrap",
    "count": 110,
    "icon": "🅱️",
    "category": "Frontend",
    "tags": ["Enterprise"],
    "trend": [
      { "date": "2024-01", "count": 95 },
      { "date": "2024-02", "count": 104 },
      { "date": "2024-03", "count": 110 }
    ]
  },
  {
    "name": "Material UI",
    "count": 88,
    "icon": "📐",
    "category": "Frontend",
    "tags": ["Open Source"],
    "trend": [
      { "date": "2024-01", "count": 72 },
      { "date": "2024-02", "count": 82 },
      { "date": "2024-03", "count": 88 }
    ]
  },
  {
    "name": "Webpack",
    "count": 40,
    "icon": "📦",
    "category": "Frontend",
    "tags": ["Open Source"],
    "trend": [
      { "date": "2024-01", "count": 30 },
      { "date": "2024-02", "count": 36 },
      { "date": "2024-03", "count": 40 }
    ]
  },
  {
    "name": "Vite",
    "count": 46,
    "icon": "⚡",
    "category": "Frontend",
    "tags": ["Open Source", "New"],
    "trend": [
      { "date": "2024-01", "count": 32 },
      { "date": "2024-02", "count": 40 },
      { "date": "2024-03", "count": 46 }
    ]
  }
]



✅ Dynamic Threshold Generator:

type Technology = {
  name: string;
  count: number;
};

type CountFilterConfig = {
  high: number;              // count > high
  medium: [number, number];  // medium[0] <= count <= medium[1]
  low: number;               // count < low
};

function generateDynamicFilterConfig(data: Technology[]): CountFilterConfig {
  if (data.length === 0) {
    return {
      high: 0,
      medium: [0, 0],
      low: 0,
    };
  }

  const counts = data.map(d => d.count);
  const min = Math.min(...counts);
  const max = Math.max(...counts);
  const range = max - min;

  const lowThreshold = min + range / 3;
  const highThreshold = min + (2 * range) / 3;

  return {
    high: highThreshold,
    medium: [lowThreshold, highThreshold],
    low: lowThreshold,
  };
}