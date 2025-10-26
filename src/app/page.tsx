import ChatInterface from "@/components/chat/ChatInterface";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-lg">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">📱 PhoneGenie</h1>
          <p className="text-sm opacity-90">Your AI Shopping Assistant</p>
        </div>
      </header>
      <ChatInterface />
    </main>
  );
}

