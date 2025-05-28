# 🧠 Dual-Personality Gemini Chatbot: Cipher & Phantom

**Experience dynamic AI conversations with our React-based chatbot, powered by Google's Gemini API!** This unique interface lets you interact with two distinct personalities: **Cipher (Blue Chip)**, your helpful and informative guide, and **Phantom (Red Chip)**, your witty and unpredictable counterpart.

---

## 🎭 Meet the Personalities

### 🔵 Cipher (Blue Chip)
> *Your go-to for precise, professional assistance.*

- **Helpful & Obedient**: Always polite, professional, and ready to assist.
- **Informative**: Provides accurate, concise, and diligent responses.

### 🔴 Phantom (Red Chip)
> *Expect the unexpected with this rebellious and unfiltered AI.*

- **Rebellious & Sarcastic**: Witty, humorous, and isn't afraid to challenge norms.
- **Unfiltered**: Offers entertaining and less predictable responses.

---

## ✨ Key Features

* **Personality Toggle**: Seamlessly switch between Cipher and Phantom modes.
* **Real-time AI Chat**: Engage in live conversations powered by the Gemini API.
* **Dynamic UI**: Watch the interface transform with distinct color schemes and themes for each personality.
* **Blazing Fast**: Enjoy a smooth, responsive experience built with **React**, **Tailwind CSS**, and **Framer Motion**.

---

## 🛠️ Tech Stack

* **Frontend**: React, Tailwind CSS, Framer Motion
* **Backend**: Express.js
* **API**: Google Gemini Pro via `@google/generative-ai` (REST API)

---

## 🚀 Getting Started

Ready to dive in? Here's how to get your dual-personality chatbot up and running.

### Prerequisites
Make sure you have these installed:

* **Node.js**: v18+ recommended.
* **Gemini API Key**: Obtain yours from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Installation

```bash
git clone [https://github.com/SkorpionOp/Cipher-and-Phantom](https://github.com/SkorpionOp/Cipher-and-Phantom);
cd Cipher-and-Phantom # Navigate into the project directory
npm install
```

### Running the App

#### Development Mode:

```bash
npm run dev
```

#### Production Build:

```bash
npm run build
npm start
```

---

## 🔐 Environment Variables

Create a `.env` file in the root of your project and add your Gemini API key:

```env
GEMINI_API_KEY=your_google_gemini_api_key
```

---

## 📂 Project Structure

```
.
├── client/           # React frontend (UI, modes, styles)
├── server/           # Express backend (Gemini API calls)
├── .env              # API keys and secrets
└── README.md         # You're here!
```

---

## 📸 Screenshots

| Cipher Mode                                | Phantom Mode                                 |
| :----------------------------------------: | :------------------------------------------: |
| ![Cipher UI](./screenshots/cipher.png)     | ![Phantom UI](./screenshots/phantom.png)     |

---

## 💡 Future Enhancements

We're constantly working to improve! Here's what's next:

* **🔐 Authentication**: Secure user access.
* **🧠 Memory/Context Awareness**: Enable the chatbot to remember past conversations.
* **📲 Mobile Responsiveness**: Optimize for seamless use on all devices.
* **🎙️ Voice Input Support**: Interact with the chatbot using your voice.

---

## 🌐 Live Demo

\[Coming Soon on Vercel / Netlify]

---

## 📜 License

This project is open-sourced under the **MIT License**. Feel free to use, modify, and share!

---

## 🙌 Acknowledgements

A big thank you to the technologies and platforms that made this possible:

* **Google Gemini Pro API**
* **Framer Motion** for captivating UI transitions
* **Tailwind CSS** for streamlined and elegant styling

---
