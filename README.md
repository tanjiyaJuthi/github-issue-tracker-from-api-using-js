# Get and show data in website from API
## GitHub Issues Tracker

### **API Endpoints:**
###  **All Issues:** 
  - https://phi-lab-server.vercel.app/api/v1/lab/issues 


###  **Single Issue:**
   - https://phi-lab-server.vercel.app/api/v1/lab/issue/{id}

   - Example: https://phi-lab-server.vercel.app/api/v1/lab/issue/33


###  **Search Issue:** https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q={searchText}

   - Example:  https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=notifications


## ⚙️ Functionalities
- In login page, there will be default admin credentials (username, password). You need to sign in using these credentials.

- Load all issues and display as per Figma

- On clicking on an open or closed tab, it will load the issues data of the related tab and show it in a display-like card in a 4-column layout like Figma. By default, it will show all data 

- Each card shows:
  - Title
  - Description
  - Status
  - Category
  - Author
  - Priority
  - Label
  - CreatedAt
- Clicking on a tree name in a card will open a modal and show all the information about that Issue. 

- 1️⃣ What is the difference between var, let, and const?
- 2️⃣ What is the spread operator (...)?
- 3️⃣ What is the difference between map(), filter(), and forEach()?
- 4️⃣ What is an arrow function?
- 5️⃣ What are template literals?

---

## 🛠️ Technology Stack

- **HTML**
- **CSS** (Vanilla/Tailwind/DaisyUI)
- **JavaScript** (Vanilla)

---

## 🔑 Demo Credentials

```text
Username: admin
Password: admin123
```