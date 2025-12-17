# PyCharm Setup Guide

## Files Already Created
All the files are already in your project! Here's how to see them and set things up in PyCharm:

## Step 1: Refresh PyCharm
1. **Refresh the project**: Right-click on the project root folder → `Synchronize 'trading_bot'`
   - Or use: `File` → `Synchronize`
   - Or press: `Ctrl + Alt + Y` (Windows/Linux) or `Cmd + Option + Y` (Mac)

2. **Reload from disk**: `File` → `Reload from Disk`

## Step 2: Configure Python Interpreter

1. Open `File` → `Settings` (or `PyCharm` → `Preferences` on Mac)
2. Go to `Project: trading_bot` → `Python Interpreter`
3. Click the gear icon → `Add...`
4. Select `Virtualenv Environment` → `New environment`
5. Choose location: `venv` in your project root
6. Click `OK`

## Step 3: Install Python Dependencies

1. Open the terminal in PyCharm (`Alt + F12` or `View` → `Tool Windows` → `Terminal`)
2. Make sure your virtual environment is activated (PyCharm usually does this automatically)
3. Run:
   ```bash
   pip install -r requirements.txt
   ```

## Step 4: Configure Node.js (if needed)

PyCharm should recognize Node.js files automatically. If not:

1. `File` → `Settings` → `Languages & Frameworks` → `JavaScript`
2. Set Node.js interpreter (if you have Node.js installed)
3. Package manager: npm

## Step 5: Set Up Run Configurations

### Python Backend (FastAPI)

1. `Run` → `Edit Configurations...`
2. Click `+` → `Python`
3. Configure:
   - **Name**: `FastAPI Server`
   - **Script path**: `app.py`
   - **Parameters**: (leave empty)
   - **Working directory**: Your project root
   - **Python interpreter**: Your virtual environment

   OR use these settings to run with uvicorn:
   - **Name**: `FastAPI Server (uvicorn)`
   - **Module name**: `uvicorn`
   - **Parameters**: `app:app --reload`
   - **Working directory**: Your project root

### React Frontend (Vite)

1. `Run` → `Edit Configurations...`
2. Click `+` → `npm`
3. Configure:
   - **Name**: `Vite Dev Server`
   - **Command**: `run`
   - **Scripts**: `dev`
   - **Package.json**: `package.json` (should auto-detect)

## Step 6: Running the Application

### Option 1: Using PyCharm Run Configurations
1. Select `FastAPI Server (uvicorn)` from the dropdown
2. Click the green play button (or press `Shift + F10`)
3. In another run configuration, select `Vite Dev Server` and run it

### Option 2: Using Terminal
1. Open terminal (`Alt + F12`)
2. Start backend:
   ```bash
   python -m uvicorn app:app --reload
   ```
3. Open a new terminal (`+` button in terminal)
4. Start frontend:
   ```bash
   npm run dev
   ```

## Step 7: File Structure Visibility

If files aren't showing in the Project view:

1. Check **Project view** (left sidebar)
2. Make sure view options show all files:
   - Right-click in Project view → `Always Show Excluded Files` (if needed)
3. Check file filters: `File` → `Settings` → `Editor` → `File Types` → ensure `.jsx`, `.js`, `.css` are recognized

## Project Structure in PyCharm

You should see:
```
trading_bot/
├── .idea/                    (PyCharm config - hidden by default)
├── node_modules/             (Node.js dependencies)
├── src/                      (React source files)
│   ├── components/
│   ├── App.jsx
│   ├── main.jsx
│   └── *.css
├── api_alpaca.py            (Your existing file)
├── app.py                   (FastAPI backend)
├── index.html               (HTML entry point)
├── package.json             (Node.js config)
├── requirements.txt         (Python dependencies)
├── vite.config.js          (Vite config)
└── README.md
```

## Tips

- **Python files** (.py) will be recognized automatically by PyCharm
- **JavaScript/React files** (.jsx, .js) should also be recognized
- If syntax highlighting doesn't work, PyCharm might prompt you to install JavaScript plugin
- You can mark `src/` as a source root if needed: Right-click `src` → `Mark Directory as` → `Sources Root`

## Troubleshooting

**Files not showing?**
- `File` → `Invalidate Caches...` → `Invalidate and Restart`

**Python interpreter not found?**
- Install Python if not already installed
- PyCharm will prompt you to configure it

**Node.js not recognized?**
- Install Node.js from nodejs.org
- Restart PyCharm after installation

