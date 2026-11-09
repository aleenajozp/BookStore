# 📚 BookStore - Full Stack Application

A full-stack online bookstore application built with **React (Vite) + Node.js (Express) + MongoDB**, ready for unified all-in-one deployment on **Red Hat OpenShift**.

---

## 🌟 Architecture & Features

- **Frontend**: React 19, Material-UI (MUI), React Router 7, Slick Carousel.
- **Backend**: Express.js REST API handling authentication, book catalog, cart, orders, and contact messages.
- **Database**: MongoDB with automatic admin and sample book seeding.
- **All-in-One Deployment**: Frontend and backend are bundled and served from a single unified container and single OpenShift route URL (no CORS, no broken links, no localhost issues).

---

## 🚀 OpenShift Deployment

To deploy to OpenShift with a single command:

```bash
# 1. Login to OpenShift
oc login --token=<YOUR_TOKEN> --server=<YOUR_SERVER_URL>

# 2. Apply all resources (MongoDB, BuildConfig, Deployment, Service, Route)
oc apply -f openshift/all-in-one.yaml

# 3. Start or watch the build
oc start-build bookstore --follow

# 4. Get your live URL
oc get route bookstore
```

---

## 🔐 Default Credentials

- **Admin Email**: `admin@example.com`
- **Admin Password**: `admin123`

---

## 💻 Local Development

### Prerequisites
- Node.js (v18+)
- MongoDB running locally on `localhost:27017`

### Run Backend
```bash
npm install
npm start
```

### Run Frontend
```bash
cd frontend
npm install
npm run dev
```
