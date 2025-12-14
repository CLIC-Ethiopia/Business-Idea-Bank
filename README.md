# NeonVentures - AI Business Idea Bank

NeonVentures is a cyberpunk-themed intelligence platform designed to democratize access to manufacturing and service-based business models. By leveraging Google's Gemini AI and Supabase, it scans global markets to generate actionable, machine-based micro-business opportunities tailored to user profiles.

## 🚀 Features

*   **AI Market Scanning**: Generates business ideas based on specific industry sectors using Gemini 2.5 Flash.
*   **Business Model Canvas**: Automatically generates detailed strategies (Partners, Costs, Revenue) for selected ideas.
*   **Personalized Matching**: Creates ideas based on user budget, skills, and risk tolerance.
*   **Operational Analysis**: Provides operational requirements, skill gaps, and SWOT analysis for every idea.
*   **Community Hive**: A social feed for entrepreneurs to share signals and collaborate.
*   **Admin Console**: "God Mode" for injecting specific business concepts into the system database.
*   **Cyberpunk UI**: Custom-built aesthetic using Tailwind CSS with neon glows and futuristic typography.
*   **PDF Export**: Download business canvases as high-resolution PDFs.
*   **Dual Language**: Full support for English and Amharic.

## 🛠 Tech Stack

*   **Frontend**: React 18, TypeScript
*   **Styling**: Tailwind CSS (Custom Config)
*   **AI**: Google GenAI SDK (`gemini-2.5-flash`, `gemini-2.5-flash-lite`)
*   **Backend/Auth**: Supabase (PostgreSQL, Auth)
*   **Utilities**: `html2canvas`, `jspdf`

## 📦 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/neon-ventures.git
    cd neon-ventures
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Variables**
    Create a `.env` file in the root directory. You need keys for Google Gemini and Supabase.
    ```env
    API_KEY=your_google_gemini_api_key
    SUPABASE_URL=your_supabase_project_url
    SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run Development Server**
    ```bash
    npm start
    # or
    npm run dev
    ```

## 🔐 Auth & Roles

*   **Guest Mode**: Allows exploring the app with restricted saving capabilities.
*   **User**: Can save ideas to the database, build a profile, and post in the community.
*   **Admin**: Detected via email pattern (e.g., `admin@...`). Has access to the `Admin Dashboard` to CRUD global business ideas.

## 📜 License

MIT License.
