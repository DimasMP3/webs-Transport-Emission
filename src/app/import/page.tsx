import { redirect } from "next/navigation";

// Import page redirects to the dashboard — upload functionality is on the main page
export default function ImportPage() {
    redirect("/");
}
