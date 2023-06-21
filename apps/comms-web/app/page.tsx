import { Button } from "@/components/ui/button";

export default function IndexPage() {
  return (
    <main>
      <header className="flex justify-between w-screen">
        <h1 className="font-bold">comms</h1>
        <section></section>
        <section className=" flex gap-2 ">
          <Button variant={"ghost"}>Login</Button>
          <Button>Get Started</Button>
        </section>
      </header>
      <section className="flex flex-col gap-3 justify-center w-max">
        <h1>Message your customers, <br/>they&apos;ll love you for it</h1>
<Button>Sign Up It&apos;s Free</Button>
      </section>
    </main>
  )
}
