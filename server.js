import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();

// Use the cors middleware to accept all origins
app.use(cors());
app.use(express.json());

app.get('/call', async (req,res,next)=>{
    console.log("calling");
    
})

app.post("/flag", async (req, res, next) => {
  console.log(req.body.flag);
  const flag = req.body.flag;
  try {
    // Step 1: Get access_token
    const tokenResponse = await axios.post(
      "https://auth.devcycle.com/oauth/token",
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: "Zp3sznT0GmCi1RnaXRtqIVx3JjM7flxn",
        client_secret:
          "p0AGcE4PE4b23qCYAvmo-vSk_-whkQ8lcYaf_PIFpY2PhuJ1NO1MZOW6j2P38CUW", // Replace with actual client_secret
        audience: "https://api.devcycle.com/",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const accessToken = tokenResponse.data.access_token;
    if (!accessToken) {
      throw new Error("Failed to retrieve access token");
    }

    // Step 2: Update the feature flag
    const patchResponse = await axios.patch(
      "https://api.devcycle.com/v1/projects/shutdown/features/674ea1920a08372a6337c26b",
      {
        variations: [
          {
            _id: "674ea1920a08372a6337c276",
            key: "control",
            name: "Control",
            variables: {
              "shut-down": flag,
            },
          },
          {
            _id: "674ea1920a08372a6337c278",
            key: "variation-b",
            name: "Variation B",
            variables: {
              "shut-down": flag,
            },
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    )

    
  } catch (error) {
    console.error("Error in updateFeatureFlagDevCycleApi:");
    // throw error;
  }
});



setInterval(() => {
    axios
      .get("http://localhost:4001/call")
      .then((response) => {
        console.log("Response from /call:", response.data);
      })
      .catch((error) => {
        console.error("Error calling /call:", error.message);
      });
  }, 90000); // 10000ms = 10 seconds

app.listen(4001, () => {
  console.log("Server running on http://localhost:4001");
});
