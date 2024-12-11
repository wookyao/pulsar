import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function Login() {
  return (
    <div className="h-screen flex items-center flex-col pt-20 md:pt-72">
      <h1 className="text-7xl md:text-9xl font-bold leading-tight tracking-wide">
        PULSAR
      </h1>
      <h4 className="text-xl md:text-4xl tracking-normal py-2 md:py-4">
        OFFICE AUTOMATION SYSTEM
      </h4>

      <div className="w-72 md:w-96 mt-20 md:mt-48 flex flex-col gap-6">
        <Input placeholder="E-Mail / Phone Number" />
        <Input type="password" placeholder="Password" />
        <Button className="mt-4">登录</Button>
      </div>
    </div>
  );
}

export default Login;
