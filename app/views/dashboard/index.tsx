import type { Route } from "../../+types/root";

function Dashboard() {
  return <div>Dashboard</div>;
}

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Dashboard - Pulsar OA" },
    { name: "description", content: "欢迎使用Pulsar OA管理系统" },
  ];
}

export default Dashboard;
