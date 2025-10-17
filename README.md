Here’s a complete, professional **README.md** file for your **Buttercut AI Video Editor** project 👇

---

# 🎬 Buttercut AI – Smart Video Editor

Buttercut AI is an intelligent video editing tool that allows users to **upload videos, add draggable text or image overlays**, and send them to a backend for processing.
This project integrates a **React Native frontend** (using Expo) and a **FastAPI backend** for media handling and rendering.

---

## 🚀 Features

✅ Upload videos directly from your device
✅ Add draggable **text** and **image overlays**
✅ Define start & end times for overlays
✅ Submit video + overlay data to backend for rendering
✅ Real-time backend integration with **FastAPI**
✅ Clean and interactive **UI** built using React Native

---

## 🏗️ Tech Stack

### 🎨 Frontend

* React Native (Expo)
* Axios for API requests
* Draggable overlays (`react-native-draggable`)
* Expo Video Player (`expo-av`)
* Expo Image Picker

### ⚙️ Backend

* FastAPI (Python)
* Uvicorn (server)
* FFmpeg (for future video rendering)
* Pydantic for data validation

---

## 📦 Project Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/buttercut-ai-video-editor.git
cd buttercut-ai-video-editor
```

---

## 🖥️ Backend Setup (FastAPI)

### Install dependencies

```bash
pip install fastapi uvicorn python-multipart ffmpeg-python
```

### Run the backend

```bash
uvicorn main:app --reload
```

✅ Backend will start at:

```
http://127.0.0.1:8000
```

---

## 📱 Frontend Setup (React Native)

### Install dependencies

```bash
npm install
```

### Run the app

```bash
npx expo start
```

✅ This will open the Metro bundler — use **Android Emulator**, **iOS Simulator**, or **Expo Go** app to test.

---

## 🔗 API Endpoint

### **POST /upload**

Uploads a video and overlay metadata to backend.

**Request Type:** `multipart/form-data`

**Body:**

* `video`: File (video/mp4)
* `overlays`: JSON string (array of text/image overlay objects)

**Response:**

```json
{
  "message": "Upload successful",
  "job_id": "unique-job-id"
}
```

---

## 🧠 Example Overlay JSON

```json
[
  {
    "id": 1697543212345,
    "type": "text",
    "content": "Hello World!",
    "position": { "x": 100, "y": 150 },
    "start_time": 0,
    "end_time": 5
  },
  {
    "id": 1697543212346,
    "type": "image",
    "uri": "https://example.com/sample.png",
    "position": { "x": 50, "y": 50 },
    "start_time": 2,
    "end_time": 6
  }
]
```

---

## 🧩 Folder Structure

```
ButtercutAI/
│
├── backend/
│   ├── main.py           # FastAPI backend
│   ├── requirements.txt  # Python dependencies
│
└── frontend/
    ├── App.js
    ├── components/
    ├── screens/
    │   └── EditorScreen.js
    └── package.json
```

---

## ⚠️ Common Issues

### ❌ `422 Unprocessable Entity`

If you see this error:

> Expected UploadFile, received: <class 'str'>

✅ Fix: Ensure you are sending **FormData()** with:

```js
formData.append("video", {
  uri: video.uri,
  name: "uploaded_video.mp4",
  type: "video/mp4",
});
formData.append("overlays", JSON.stringify(overlays));
```

### ❌ Network Errors

* Use your **local IP address** (e.g. `http://192.168.x.x:8000`) instead of `127.0.0.1` if testing on a **mobile device**.

---

## 🎥 Demo Video

📺 Watch demo here → [Add your demo video link]

---

## 🤝 Contributing

Pull requests are welcome!
If you’d like to enhance overlay types (like stickers, transitions, or trimming), feel free to fork and submit PRs.

---

## 👨‍💻 Author

**Abhinay Bethi**
📧 [[abhinaybethi@email.com](mailto:abhinaybethi@email.com)]
🌐 www.linkedin.com/in/abhinay-bethi
💬 Passionate about AI, Machine Learning, and Real-Time Applications.

---

Would you like me to **add instructions for deploying the backend to Render or Railway** (so your mobile can access it publicly)?
