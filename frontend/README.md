# 🤖 AI-Powered HR Employee Helpdesk

An AI-powered HR Employee Helpdesk designed to provide employees with quick, secure, and natural-language access to common HR services.

The system combines **AI-based Natural Language Understanding (NLU)** with structured HR data and policy documents to handle employee queries such as leave balance, payslips, company policies, leave applications, and date/time requests.

---

## 🚀 Key Features

### 🏖️ Leave Management
- View Casual, Sick, and Earned leave balances
- Calculate remaining leave automatically
- Apply for leave using natural language
- Automatically calculate requested leave days
- Reject leave requests when available balance is insufficient
- Generate a unique leave request ID
- Store leave requests with status and timestamps

### 💰 Payslip Management
- Retrieve monthly payslips
- Display:
  - Basic Salary
  - HRA
  - Deductions
  - Net Pay
- Supports natural-language month recognition

### 📋 Company Policy Search
- Search company policies using natural language
- Supports topics such as:
  - Work From Home
  - Notice Period
  - Leave Carry Forward
  - Leave Application
  - Salary & Payslip

### 🕐 Date & Time
- Provides the current date and time
- Supports relative-date understanding such as:
  - Tomorrow
  - Next Monday
  - This month

### 🌐 Multilingual AI Interaction
The system can understand employee queries written in:
- English
- Hindi
- Hinglish
- Marathi
- Kannada
- Mixed-language queries

The response is generated in the employee's detected language whenever possible.

### 🔐 Privacy & Security
- Employees can only access their own sensitive HR information
- Salary and payslip information belonging to another employee is protected
- Leave requests cannot be submitted for another employee
- API credentials are protected using environment variables
- `.env` and `node_modules` are excluded from version control

---

# 🧠 AI Architecture

```text
                    Employee
                       │
                       ▼
                Natural Language Query
                       │
                       ▼
              ┌─────────────────────┐
              │   AI / NLU Layer    │
              │  Intent Detection   │
              │ Entity Extraction   │
              └──────────┬──────────┘
                         │
                         ▼
                 HR Agent / Router
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
     Leave Tools    Payroll Tools   Policy Tools
          │              │              │
          └──────────────┼──────────────┘
                         ▼
                  Structured HR Data
                         │
                         ▼
                 Security Validation
                         │
                         ▼
              AI Response Generation
                         │
                         ▼
                  Employee Chat UI