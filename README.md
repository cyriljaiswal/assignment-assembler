# Assignment Assembler 📄✨

A fast, cross-platform local web application that allows you to drag, drop, and instantly compile multiple images and documents into a single, perfectly formatted PDF. 

Built to solve the headache of merging scattered screenshots and assignment briefs into a single submission file.

## 🚀 Features
* **Frictionless Drag & Drop:** Visual interface for uploading and reordering files.
* **Auto-Conversion:** Seamlessly converts `.jpg`, `.jpeg`, and `.png` files into PDF format on the fly before merging.
* **Local Cloud Capable:** Can be exposed to a local Wi-Fi network, allowing you to use your mobile device as a wireless document scanner that sends files directly to your laptop's engine.
* **Zero External APIs:** All processing is done locally on your machine for maximum privacy and speed.

## 🛠️ Tech Stack
* **Frontend:** React.js (Vite), Tailwind CSS, React-Dropzone
* **Backend:** Python (Flask), PyPDF2, Pillow, Flask-CORS

---

## 💻 Local Setup & Installation (Desktop Only)

To run this project locally on a single machine, you will need two terminal windows running simultaneously.

### 1. Start the Python Engine (Backend)
Navigate into the backend directory, activate the virtual environment, and start the Flask server:

```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install the engine dependencies
pip install flask flask-cors PyPDF2 Pillow

# Run the server
python server.py
```
*The backend will now be listening on `http://localhost:5000`.*

### 2. Start the React Canvas (Frontend)
Open a new terminal, navigate to the frontend directory, install the Node packages, and spin up Vite:

```bash
cd frontend
npm install
npm run dev
```
*Vite will provide a local link (usually `http://localhost:5173`). Click it to open the app in your browser!*

---

## 📱 How to Use With Your Phone (Mobile Scanning)

Want to upload photos straight from your phone's camera roll to your laptop? You can expose this app to your local Wi-Fi network. 

### Step 1: Find Your Laptop's IP Address
* **Windows:** Open Command Prompt, type `ipconfig`, and look for your **IPv4 Address**.
* **Mac:** Open Terminal, type `ipconfig getifaddr en0`, and copy the numbers it outputs.
*(Example: `192.168.1.15` or `172.20.10.8`)*

### Step 2: Configure the Code
1. Open `backend/server.py` and change the final line to expose the server:
   ```python
   app.run(host='0.0.0.0', port=5000)
   ```
2. Open `frontend/src/App.jsx` and update the Axios POST request URL to point to your laptop's IP instead of localhost:
   ```javascript
   // Replace YOUR_IP_ADDRESS with the number you found in Step 1
   const response = await axios.post('http://YOUR_IP_ADDRESS:5000/assemble', formData, {
   ```

### Step 3: Run and Connect
1. Restart your Python server.
2. Restart your React server using this command to expose it to the network:
   ```bash
   npm run dev -- --host
   ```
3. Ensure your phone and laptop are on the same Wi-Fi network.
4. Open your phone's web browser and type in the **Network URL** provided by Vite in your terminal (e.g., `http://192.168.1.15:5173`).
