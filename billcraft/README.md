# 🧾 BillCraft

<div align="center">

![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-7.3-007FFF?style=for-the-badge&logo=mui&logoColor=white)

**Professional Invoices Made Simple**

Create beautiful, professional invoices in seconds. No signup required. Completely free.

[Get Started](#-getting-started) • [Features](#-features) • [Screenshots](#-screenshots) • [Tech Stack](#-tech-stack)

</div>

---

## ✨ Features

### 🚀 Fast & Simple
- Create professional invoices in seconds
- Intuitive drag-and-drop interface
- Auto-incrementing invoice numbers

### 🔒 Privacy First
- No signup or account required
- All data stays in your browser (localStorage)
- No data sent to external servers

### 📥 Export Ready
- Download invoices as high-quality PDF
- Print directly from browser
- Share via WhatsApp with one click

### 🎨 Customization
- Upload your business logo
- Auto-color matching from logo
- 10+ color themes to choose from
- Tax invoice toggle support

### 📋 Invoice Management
- Save drafts to local history
- Load and edit previous invoices
- Delete old invoices easily

### 📱 Responsive Design
- Works on desktop, tablet, and mobile
- Swipeable mobile toolbar
- Touch-friendly interface

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI Framework |
| **TypeScript** | Type Safety |
| **Vite** | Build Tool & Dev Server |
| **Material UI (MUI)** | Component Library |
| **React Router** | Client-side Routing |
| **html2canvas** | HTML to Canvas Conversion |
| **jsPDF** | PDF Generation |
| **ColorThief** | Color Extraction from Images |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SupunLiyanage88/BillCraft.git
   cd BillCraft/billcraft
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The build output will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

---

## 📁 Project Structure

```
billcraft/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, fonts, etc.
│   ├── components/      # Reusable UI components
│   │   ├── invoice/     # Invoice-specific components
│   │   │   ├── InvoiceHeader.tsx
│   │   │   ├── InvoiceParties.tsx
│   │   │   ├── InvoiceItemsTable.tsx
│   │   │   ├── InvoiceSummary.tsx
│   │   │   ├── PaymentInfo.tsx
│   │   │   └── InvoiceFooter.tsx
│   │   ├── AppHeader.tsx
│   │   ├── AppFooter.tsx
│   │   ├── FeatureCard.tsx
│   │   ├── Layout.tsx
│   │   └── PrimaryButton.tsx
│   ├── pages/           # Page components
│   │   ├── Home.tsx
│   │   ├── Invoice.tsx
│   │   └── Template.tsx
│   ├── routes/          # Routing configuration
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   │   └── localStorage.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 📸 Screenshots

### Home Page
Clean, modern landing page with feature highlights and call-to-action.

### Invoice Editor
Full-featured invoice editor with:
- Business logo upload
- Seller & client details
- Line items with quantity, price, and discounts
- Tax calculations (GST support)
- Payment information
- Color customization

### PDF Export
Professional PDF output ready for printing or digital sharing.

---

## 🎯 Key Features Breakdown

### Invoice Fields
- **Invoice Number** - Auto-incremented, editable
- **Issue Date & Due Date** - Date pickers
- **Tax Invoice Toggle** - Show/hide tax details
- **Payment Method** - Customizable

### Seller Information
- Business name
- Contact details (phone, email)
- ABN/Tax number
- Authorized person

### Client Information  
- Client name
- Address
- Email & phone

### Line Items
- Description
- Quantity
- Unit price
- Discount per item
- Auto-calculated totals

### Tax & Totals
- Configurable tax name (GST, VAT, etc.)
- Adjustable tax percentage
- Subtotal, tax amount, and grand total

### Bank Details
- Account name
- Account number
- BSB/Routing number
- Bank name
- Payment notes

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- [Material UI](https://mui.com/) for the beautiful component library
- [Vite](https://vitejs.dev/) for the blazing fast build tool
- [jsPDF](https://github.com/parallax/jsPDF) for PDF generation
- [ColorThief](https://lokeshdhakar.com/projects/color-thief/) for color extraction

---

<div align="center">

Made with ❤️ by [Supun Liyanage](https://github.com/SupunLiyanage88)

⭐ Star this repo if you find it useful!

</div>