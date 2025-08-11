import ResizablePanel from "@/components/ResizablePanel";

export default function Dashboard() {
  return (
    <div className="relative h-screen w-screen bg-gray-900">
      {/* Left Panel: List of users */}
      <ResizablePanel side="left">
        <h2 className="text-white mb-2 font-bold">Users</h2>
        {["Alice", "Bob", "Charlie","Ghulam","Alice", "Bob", "Charlie","Ghulam","Alice", "Bob", "Charlie","Ghulam"].map((user,id) => (
          <div
            key={id}
            className="p-2 mb-1 bg-gray-700 rounded hover:bg-gray-600"
          >
            {user}
          </div>
        ))}
        <div className="w-full p-4 bg-gray-800 absolute bottom-0 ">
        <button className="bg-gray-800 text-white px-4 py-2  border-2 border-accent cursor-pointer hover:bg-accent rounded">Sign Up</button>
        </div>
      </ResizablePanel>

      {/* Right Panel: Chat messages */}
      <ResizablePanel side="right" defaultWidth={350}>
        <h2 className="text-white mb-2 font-bold">Chat</h2>
        {[
          { sender: "Alice", text: "Hello!" },
          { sender: "Bob", text: "Hey there!" },
        ].map((msg, i) => (
          <div key={i} className="p-2 mb-1 bg-gray-700 rounded">
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </ResizablePanel>
    </div>
  );
}
